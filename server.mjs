import http from 'node:http';
import {readFile,stat,mkdir,unlink,writeFile} from 'node:fs/promises';
import {resolve,join,extname,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {tmpdir} from 'node:os';
import {randomUUID} from 'node:crypto';
import {spawn} from 'node:child_process';
import {chefPrompt,parseChefReply} from './chef-prompt.mjs';

const root=fileURLToPath(new URL('.',import.meta.url)),web=join(root,'www');
// Deliberately ignore inherited API-key environment variables and machine credentials.
const settings={};try{for(const line of (await readFile(join(root,'.env'),'utf8')).split(/\r?\n/)){const m=line.match(/^([A-Z_]+)=(.*)$/);if(m)settings[m[1]]=m[2].trim().replace(/^(['"])(.*)\1$/,'$2');}}catch{}
const key=settings.OPENROUTER_API_KEY||'',chefModel=settings.CHEF_MODEL||'deepseek/deepseek-v4.1-flash',fishModel=settings.FISH_MODEL||'';
const port=5335,host='127.0.0.1',audio=new Map(),cache=join(tmpdir(),'test-kitchen-'+randomUUID());
const busy={chef:false,fish:false},last={chef:0,fish:0};
const json=(res,status,value)=>{res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify(value));};
async function body(req){let text='';for await(const chunk of req){text+=chunk;if(Buffer.byteLength(text)>24000)throw Error('Request too large');}return JSON.parse(text);}
async function model(messages,id){
 const response=await fetch('https://openrouter.ai/api/v1/chat/completions',{method:'POST',headers:{Authorization:'Bearer '+key,'Content-Type':'application/json'},body:JSON.stringify({model:id,messages,max_tokens:2048,stream:false}),signal:AbortSignal.timeout(55000)});
 if(!response.ok)throw Error('Model provider returned HTTP '+response.status);
 const data=await response.json();if(typeof data.choices?.[0]?.message?.content!=='string')throw Error('Model returned no dialogue');return data;
}
async function voice(speech){
 if(settings.YUNXI_TTS!=='1')return null;
 await mkdir(cache,{recursive:true});const id=randomUUID(),output=join(cache,id+'.mp3'),manifest=join(cache,id+'.json');
 await writeFile(manifest,JSON.stringify({speech,output}));
 try{await new Promise((accept,reject)=>{const p=spawn('python',[join(root,'yunxi-voice.py'),manifest],{windowsHide:true,stdio:'ignore'});const timer=setTimeout(()=>{p.kill();reject(Error('Voice timeout'));},18000);p.on('error',e=>{clearTimeout(timer);reject(e);});p.on('close',code=>{clearTimeout(timer);code===0?accept():reject(Error('Voice unavailable'));});});audio.set(id,output);if(audio.size>40){const [old,file]=audio.entries().next().value;audio.delete(old);await unlink(file).catch(()=>{});}return '/cooking-api/audio/'+id+'.mp3';}catch{return null;}finally{await unlink(manifest).catch(()=>{});}
}
const server=http.createServer(async(req,res)=>{
 try{
  if(!['127.0.0.1:'+port,'localhost:'+port].includes(req.headers.host))return json(res,403,{error:'Localhost only'});
  if(req.headers.origin&&!['http://127.0.0.1:'+port,'http://localhost:'+port].includes(req.headers.origin))return json(res,403,{error:'Origin not allowed'});
  const url=new URL(req.url,'http://127.0.0.1:'+port);
  if(req.method==='GET'&&url.pathname==='/api/config')return json(res,200,{chef:!!key,fish:!!key&&!!fishModel});
  if(req.method==='GET'&&/^\/cooking-api\/audio\/[a-f0-9-]{36}\.mp3$/.test(url.pathname)){const file=audio.get(url.pathname.split('/').at(-1).slice(0,-4));if(!file)return json(res,404,{error:'Audio expired'});res.writeHead(200,{'Content-Type':'audio/mpeg'});return res.end(await readFile(file));}
  if(req.method==='POST'&&['/cooking-api/comment','/llm/v1/chat/completions'].includes(url.pathname)){
   const kind=url.pathname.startsWith('/cooking')?'chef':'fish';
   if(!key)return json(res,503,{error:'Optional AI is off. Add your own OpenRouter key to .env and restart.'});
   if(kind==='fish'&&!fishModel)return json(res,503,{error:'Set FISH_MODEL in .env and restart.'});
   if(busy[kind]||Date.now()-last[kind]<8000)return json(res,429,{error:'Please wait for the previous comment.'});
   const input=await body(req);busy[kind]=true;last[kind]=Date.now();
   try{if(kind==='chef'){const result=await model([{role:'user',content:chefPrompt(input)}],chefModel),line=parseChefReply(result.choices[0].message.content);return json(res,200,{...line,model:chefModel,audio:await voice(line.speech)});}
    if(!Array.isArray(input.messages)||input.messages.length>16)return json(res,400,{error:'Invalid game dialogue'});
    return json(res,200,await model(input.messages,fishModel));
   }finally{busy[kind]=false;}
  }
  if(req.method!=='GET'&&req.method!=='HEAD')return json(res,405,{error:'Method not allowed'});
  const relative=decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname),file=resolve(web,'.'+relative);
  if(!file.startsWith(web+sep)||relative.includes('\\')||relative.includes('\0'))return json(res,403,{error:'Invalid path'});
  const info=await stat(file).catch(()=>null);if(!info?.isFile())return json(res,404,{error:'Not found'});
  const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.mp3':'audio/mpeg','.png':'image/png'};
  res.writeHead(200,{'Content-Type':types[extname(file)]||'application/octet-stream','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer','Cache-Control':'no-cache'});res.end(req.method==='HEAD'?undefined:await readFile(file));
 }catch(error){json(res,502,{error:error.message.startsWith('Model ')?error.message:'Request could not be completed. Check your optional AI settings.'});}
});
server.listen(port,host,()=>{console.log('ClaudeBang Kitchen: http://127.0.0.1:'+port);console.log(key?'Your local AI configuration is enabled.':'Offline gameplay ready. Optional AI is not configured.');console.log('Close this window to stop the game server.');if(process.argv.includes('--open'))spawn('explorer.exe',['http://127.0.0.1:'+port],{windowsHide:true,stdio:'ignore'}).on('error',()=>{});});
server.on('error',()=>{console.error('Could not open local port 5335. Close another copy of the game and try again.');process.exitCode=1;});

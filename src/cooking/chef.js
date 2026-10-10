// Event-driven DeepSeek chef commentary. The browser never holds model keys: it POSTs the actual
// kitchen snapshot to the local backend, which calls DeepSeek and renders Mandarin TTS (Yunxi).
// No canned lines: if the backend fails, the UI shows the error and the chef stays silent.
import {repeatedLine} from '../repetition.js';
export const CHEF_ENDPOINT='/cooking-api/comment';
export const CHEF_LIMITS={settle:1.4,maxSettle:4,cooldown:10,priorityCooldown:4,timeout:20,maxEvents:10,recent:8,maxBackoff:60};
const PRIORITY=new Set(['served','mukbang-start','mukbang-finished','burning']);
export function parseChefReply(r){
 if(!r||typeof r!=='object')throw Error('Chef reply is not JSON');
 const text=typeof r.text==='string'?r.text.trim():'',speech=typeof r.speech==='string'?r.speech.trim():'';
 if(!text||text.length>350)throw Error('Chef reply has no usable subtitle');
 if(!speech||speech.length>240)throw Error('Chef reply has no usable Mandarin speech');
 const audio=typeof r.audio==='string'&&/^\/cooking-api\/audio\/[\w\-.]+\.(?:wav|mp3)$/i.test(r.audio)&&!r.audio.includes('..')?r.audio:null;
 return {text,speech,audio,model:typeof r.model==='string'?r.model.slice(0,80):'unknown'};
}
export function createChef({fetchImpl=(...a)=>fetch(...a),snapshot,play,stopAudio=()=>{},onStatus=()=>{},onLine=()=>{},onGesture=()=>{},limits={}}={}){
 const L={...CHEF_LIMITS,...limits};
 let enabled=true,epoch=0,controller=null,busy=false,speaking=false,pending=[],firstAt=0,lastAt=0,lastSpoke=-1e9,backoffUntil=0,backoff=0,recent=[],requests=0,lastStatus='';
 const status=(text,ok=true)=>{lastStatus=text;onStatus(text,ok);};
 function notify(type,detail={},now=0){
  if(!enabled)return false;const key=type+':'+JSON.stringify(detail);
  // Coalesce identical observations (e.g. a burst of cuts on one carrot) instead of queueing duplicates.
  const same=pending.find(e=>e.key===key);if(same){same.count++;same.at=now;}else{pending.push({key,type,detail,at:now,count:1});if(pending.length>L.maxEvents)pending.splice(0,pending.length-L.maxEvents);}
  if(pending.length===1&&(!same))firstAt=now;lastAt=now;return true;
 }
 function cancel(reason){epoch++;controller?.abort();controller=null;busy=false;speaking=false;pending=[];stopAudio();if(reason)status(reason,true);}
 function ready(now,hidden){
  if(!enabled||hidden||busy||speaking||!pending.length)return false;
  if(now<backoffUntil)return false; // errors back off even for priority events
  const priority=pending.some(e=>PRIORITY.has(e.type)),allowed=lastSpoke+(priority?L.priorityCooldown:L.cooldown);
  if(now<allowed)return false;
  return now-lastAt>=L.settle||now-firstAt>=L.maxSettle;
 }
 async function request(now,hidden=false){
  if(!ready(now,hidden))return null;
  const queued=pending.splice(0),mine=++epoch,events=queued.map(({type,detail,count})=>({type,...detail,...(count>1?{count}:{})}));busy=true;requests++;
  const ac=new AbortController();controller=ac;const timer=setTimeout(()=>ac.abort(),L.timeout*1000);status('DeepSeek · thinking…');
  const current=()=>mine===epoch&&enabled;
  try{
   const body={snapshot:{...snapshot(),events},recent:recent.slice(-6)};
   const r=await fetchImpl(CHEF_ENDPOINT,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body),signal:ac.signal});
   if(!r.ok){let detail='';try{detail=(await r.json())?.error||'';}catch{}throw Error('HTTP '+r.status+(detail?' · '+String(detail).slice(0,80):''));}
   const reply=parseChefReply(await r.json());
   if(!current())return {stale:true};
   backoff=0;backoffUntil=0;lastSpoke=now;
   if(repeatedLine(reply.text,recent)){status('DeepSeek · skipped a repeated line',true);return {repeated:true};}
   recent.push(reply.text);if(recent.length>L.recent)recent.shift();
   busy=false;speaking=true;onLine(reply);onGesture(reply);status(`DeepSeek · ${reply.model}`+(reply.audio?' · speaking':' · no audio'));
   let voiceFailed=false;if(reply.audio||reply.speech){try{await play(reply.audio||{speech:reply.speech},{isCurrent:current});if(!current())return {stale:true};}catch(e){voiceFailed=true;if(current())status('DeepSeek voice error · '+e.message,false);}}
   if(current()&&!voiceFailed){speaking=false;status(`DeepSeek · ${reply.model} · listening`);}
   return {reply};
  }catch(error){
   if(!current())return {stale:true};
   pending=[...queued,...pending].slice(-L.maxEvents);
   backoff=Math.min(L.maxBackoff,backoff?backoff*2:8);backoffUntil=now+backoff;
   status(error.name==='AbortError'?`DeepSeek timed out · retry in ${backoff}s`:`DeepSeek unavailable · ${error.message}`,false);return {error};
  }finally{clearTimeout(timer);if(mine===epoch){busy=false;speaking=false;controller=null;}}
 }
 return {notify,request,cancel,
  update(now,hidden){if(hidden){if(busy||speaking||pending.length)cancel('DeepSeek · paused (tab hidden)');return;}if(ready(now,hidden))request(now,hidden);},
  setEnabled(v){enabled=!!v;cancel(v?'DeepSeek · listening':'DeepSeek chef off');},
  reset(){cancel('DeepSeek · listening');recent=[];lastSpoke=-1e9;backoffUntil=0;backoff=0;},
  get enabled(){return enabled;},get busy(){return busy;},get speaking(){return speaking;},get pending(){return pending.length;},get requests(){return requests;},get recent(){return recent.slice();},get status(){return lastStatus;},get epoch(){return epoch;}};
}

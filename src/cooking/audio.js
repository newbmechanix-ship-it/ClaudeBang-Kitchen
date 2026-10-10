import {createWindowsVoice} from './windows-voice.js';
export const FALLBACK_SCREAMS=[1,2,3,4,5,6].map(n=>'/sfx/robot-scream-scandalous-0'+n+'.mp3');
export const CHEW_CLIPS=[1,2,3].map(n=>'/sfx/cooking-chew-0'+n+'.mp3');
/** Validate the scream manifest {clips:[...]}; falls back to the six original clips. */
export function screamList(manifest){const clips=Array.isArray(manifest?.clips)?manifest.clips.filter(c=>typeof c==='string'&&/^\/sfx\/[\w\-./]+\.mp3$/i.test(c)&&!c.includes('..')):[];const unique=[...new Set(clips)].slice(0,48);return unique.length?unique:FALLBACK_SCREAMS.slice();}
/** Soft-clip curve for the robot distortion stage. */
export function robotCurve(amount=2.4,n=1024){const c=new Float32Array(n);for(let i=0;i<n;i++){const x=i/(n-1)*2-1;c[i]=Math.tanh(amount*x)/Math.tanh(amount);}return c;}
export const ROBOT_MIX={dry:.38,wet:.9,band:1500,q:.75,carrierBase:58,comb:.0075,feedback:.38};
export function createCookingAudio({fetchImpl=(...a)=>fetch(...a)}={}){
 let ctx,master,buses,noise,fryGain,gasGain,boilGain,waterPour,oilPour,voice,muted=false,loading,curve;const clips=[],active=new Map(),next=new Map(),lastClip=new Map();
 let nativeChef=null,nativeSpeaking=false;
 const chew={buffers:[],source:null,last:-1};const chef={source:null,analyser:null,data:null,controller:null,resolve:null,level:0};let duck={chewing:false,chef:false};
 async function decode(url){const r=await fetchImpl(url);if(!r.ok)throw Error(url+' HTTP '+r.status);return ctx.decodeAudioData(await r.arrayBuffer());}
 async function loadScreams(){let urls=FALLBACK_SCREAMS;try{const r=await fetchImpl('/sfx/cooking-screams.json',{cache:'no-cache'});if(r.ok)urls=screamList(await r.json());}catch{}
  // Bounded concurrency; failures leave a hole, never a fake buffer.
  let index=0;const worker=async()=>{while(index<urls.length){const n=index++;try{clips[n]=await decode(urls[n]);}catch{}}};await Promise.all([worker(),worker(),worker(),worker()]);
  if(!clips.some(Boolean)&&urls!==FALLBACK_SCREAMS){urls=FALLBACK_SCREAMS;index=0;clips.length=0;await Promise.all([worker(),worker()]);}}
 async function start(){if(!ctx){ctx=new AudioContext();master=ctx.createGain();master.gain.value=.65;master.connect(ctx.destination);
  buses={};for(const k of ['ambient','screams','voice','chef','chew'])(buses[k]=ctx.createGain()).connect(master);
  const data=ctx.createBuffer(1,ctx.sampleRate*2,ctx.sampleRate),v=data.getChannelData(0);for(let i=0;i<v.length;i++)v[i]=Math.random()*2-1;noise=data;curve=robotCurve();
  function loop(freq,type,q=.7){const source=ctx.createBufferSource(),f=ctx.createBiquadFilter(),gain=ctx.createGain();source.buffer=data;source.loop=true;f.type=type;f.frequency.value=freq;f.Q.value=q;gain.gain.value=0;source.connect(f).connect(gain).connect(buses.ambient);source.start();return gain;}
  fryGain=loop(4200,'highpass');gasGain=loop(500,'lowpass');boilGain=loop(650,'lowpass');waterPour=loop(2300,'bandpass',.9);oilPour=loop(520,'bandpass',1.6);voice=createWindowsVoice();
  loading=Promise.all([loadScreams(),...CHEW_CLIPS.map(async(url,n)=>{try{chew.buffers[n]=await decode(url);}catch{}})]);}
  await ctx.resume();return loading;
 }
 function tone(freq,duration,gain=.1,type='sine',end=freq){if(!ctx||muted)return;const o=ctx.createOscillator(),g=ctx.createGain();o.type=type;o.frequency.setValueAtTime(freq,ctx.currentTime);o.frequency.exponentialRampToValueAtTime(Math.max(20,end),ctx.currentTime+duration);g.gain.setValueAtTime(gain,ctx.currentTime);g.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+duration);o.connect(g).connect(buses.ambient);o.start();o.stop(ctx.currentTime+duration);o.onended=()=>{o.disconnect();g.disconnect();};}
 function burst(duration=.12,gain=.08,freq=5000){if(!ctx||muted)return;const s=ctx.createBufferSource(),f=ctx.createBiquadFilter(),g=ctx.createGain();s.buffer=noise;f.type='highpass';f.frequency.value=freq;g.gain.setValueAtTime(gain,ctx.currentTime);g.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+duration);s.connect(f).connect(g).connect(buses.ambient);s.start(0,Math.random()*1.5,duration+.05);s.onended=()=>{s.disconnect();f.disconnect();g.disconnect();};}
 function chop(){tone(160,.055,.26,'triangle',75);tone(1600,.025,.045,'sawtooth',500);}
 function splash(){for(let i=0;i<5;i++)setTimeout(()=>tone(180+Math.random()*550,.10,.10,'sine',80),i*40);}
 // Robot chain: dry + [bandpass -> ring modulator -> comb resonance -> soft clip] wet, then per-fish panner.
 function robotChain(fish){
  const id=Number(String(fish.id).split('-')[1])||0,input=ctx.createGain(),dry=ctx.createGain(),band=ctx.createBiquadFilter(),ring=ctx.createGain(),carrier=ctx.createOscillator(),comb=ctx.createDelay(.05),fb=ctx.createGain(),shaper=ctx.createWaveShaper(),wet=ctx.createGain(),out=ctx.createGain(),panner=ctx.createStereoPanner();
  dry.gain.value=ROBOT_MIX.dry;band.type='bandpass';band.frequency.value=ROBOT_MIX.band+(id%4)*120;band.Q.value=ROBOT_MIX.q;ring.gain.value=0;carrier.type='sine';carrier.frequency.value=ROBOT_MIX.carrierBase+(id%5)*9;carrier.connect(ring.gain);
  comb.delayTime.value=ROBOT_MIX.comb+(id%3)*.0012;fb.gain.value=ROBOT_MIX.feedback;shaper.curve=curve;shaper.oversample='2x';wet.gain.value=ROBOT_MIX.wet;
  input.connect(dry).connect(out);input.connect(band).connect(ring).connect(comb).connect(shaper).connect(wet).connect(out);comb.connect(fb).connect(comb);out.connect(panner).connect(buses.screams);carrier.start();
  return {input,panner,out,dispose(){try{carrier.stop();}catch{}for(const n of [input,dry,band,ring,carrier,comb,fb,shaper,wet,out,panner])n.disconnect();}};
 }
 function scream(fish,pan=0,{bite=false}={}){if(!fish||!ctx||muted)return false;if(active.has(fish.id)){if(!bite)return false;try{active.get(fish.id).stop();}catch{}active.delete(fish.id);}if(!bite&&ctx.currentTime<(next.get(fish.id)||0))return false;const loaded=clips.map((b,n)=>b?n:-1).filter(n=>n>=0);if(!loaded.length)return false;
  let index=loaded[Math.floor(Math.random()*loaded.length)];if(loaded.length>1&&index===lastClip.get(fish.id))index=loaded[(loaded.indexOf(index)+1)%loaded.length];lastClip.set(fish.id,index);
  const source=ctx.createBufferSource(),gain=ctx.createGain(),chain=robotChain(fish);source.buffer=clips[index];source.playbackRate.value=.94+(Number(String(fish.id).split('-')[1])%5)*.035;gain.gain.value=bite?.36:.24;chain.panner.pan.value=Math.max(-.85,Math.min(.85,pan));
  source.connect(gain).connect(chain.input);active.set(fish.id,source);fish.screaming=true;source.onended=()=>{if(active.get(fish.id)===source){active.delete(fish.id);fish.screaming=false;}source.disconnect();gain.disconnect();chain.dispose();};source.start();next.set(fish.id,ctx.currentTime+5+Math.random()*4);return true;}
 function applyDuck(){if(!ctx)return;const now=ctx.currentTime,a=(duck.chewing?.35:1)*(duck.chef?.55:1);buses.ambient.gain.setTargetAtTime(a,now,.12);buses.voice.gain.setTargetAtTime(duck.chewing||duck.chef?.5:1,now,.12);buses.screams.gain.setTargetAtTime(duck.chewing?.55:1,now,.12);buses.chew.gain.setTargetAtTime(duck.chef?.5:1,now,.12);}
 function update(s,extra={}){if(!ctx)return;const hot=s.temp>90&&s.items.some(i=>i.zone==='pan'),boil=s.water>.035&&s.temp>93,now=ctx.currentTime;fryGain.gain.setTargetAtTime(!muted&&hot&&s.oil>.02&&!boil?.12*Math.min(1,(s.temp-80)/80):!muted&&s.oil>.02&&s.temp>150&&!boil?.04:0,now,.15);gasGain.gain.setTargetAtTime(!muted&&s.gas>0?(s.lit?.016:.01)*s.gas:0,now,.2);boilGain.gain.setTargetAtTime(!muted&&boil?.13:!muted&&s.water>.035&&s.temp>80?.05*(s.temp-80)/13:0,now,.2);if(boil&&Math.random()<.07)tone(70+Math.random()*100,.07,.035,'sine',40);
  const w=s.containers?.water?.rate||0,o=s.containers?.oil?.rate||0;waterPour.gain.setTargetAtTime(!muted?Math.min(.14,w*.16+(extra.panSpill||0)*.2):0,now,.06);oilPour.gain.setTargetAtTime(!muted?Math.min(.09,o*.6):0,now,.08);
  const want={chewing:!!extra.chewing,chef:chef.source!==null};if(want.chewing!==duck.chewing||want.chef!==duck.chef){duck=want;applyDuck();}
  for(const f of s.fish)if(f.pain>35)scream(f,(s.items.find(i=>i.fishId===f.id)?.x||0)*.5);}
 // Chewing: one source at a time, varied clips. Returns the clip duration so the jaw animation stays in sync.
 function playChew(){stopChew();const loaded=chew.buffers.map((b,n)=>b?n:-1).filter(n=>n>=0);if(!ctx||!loaded.length)return null;let n=loaded[Math.floor(Math.random()*loaded.length)];if(loaded.length>1&&n===chew.last)n=loaded[(loaded.indexOf(n)+1)%loaded.length];chew.last=n;const buffer=chew.buffers[n];if(muted)return buffer.duration;
  const source=ctx.createBufferSource(),g=ctx.createGain();source.buffer=buffer;g.gain.value=.8;source.connect(g).connect(buses.chew);source.onended=()=>{if(chew.source===source)chew.source=null;source.disconnect();g.disconnect();};chew.source=source;source.start();return buffer.duration;}
 function stopChew(){const s=chew.source;chew.source=null;if(s){try{s.stop();}catch{}}}
 // Chef voice (server-generated WAV). Cancellable; analyser drives the mouth.
 async function playChef(url,{isCurrent=()=>true}={}){
  stopChef();if(!ctx)throw Error('Audio not enabled');if(muted)return {played:false,reason:'muted'};
  const controller=new AbortController();chef.controller=controller;const r=await fetchImpl(url,{signal:controller.signal});if(!r.ok)throw Error('Chef audio HTTP '+r.status);const buffer=await ctx.decodeAudioData(await r.arrayBuffer());
  if(controller.signal.aborted||!isCurrent()||muted)return {played:false,reason:'stale'};
  return new Promise(resolve=>{const source=ctx.createBufferSource(),analyser=ctx.createAnalyser(),g=ctx.createGain();analyser.fftSize=512;source.buffer=buffer;g.gain.value=1;source.connect(analyser).connect(g).connect(buses.chef);
   chef.source=source;chef.analyser=analyser;chef.data=new Uint8Array(analyser.fftSize);chef.resolve=resolve;duck.chef=true;applyDuck();
   source.onended=()=>{source.disconnect();analyser.disconnect();g.disconnect();if(chef.source===source){chef.source=null;chef.analyser=null;chef.level=0;chef.resolve=null;duck.chef=false;applyDuck();}resolve({played:true});};source.start();});
 }
 function stopChef(){nativeChef?.stop();nativeSpeaking=false;chef.controller?.abort();chef.controller=null;const s=chef.source,res=chef.resolve;chef.source=null;chef.analyser=null;chef.resolve=null;chef.level=0;if(s){try{s.stop();}catch{}}res?.({played:false,reason:'stopped'});duck.chef=false;applyDuck();}
 function chefLevel(){if(nativeSpeaking)return .35;if(!chef.analyser)return 0;chef.analyser.getByteTimeDomainData(chef.data);let sum=0;for(const v of chef.data){const x=(v-128)/128;sum+=x*x;}const rms=Math.sqrt(sum/chef.data.length);chef.level+=(Math.min(1,rms*5)-chef.level)*.5;return chef.level;}
 function stop(){voice?.stop();for(const source of active.values()){try{source.stop();}catch{}}active.clear();}
 function stopAll(){stop();stopChew();stopChef();}
 function playChefNative(text,{isCurrent=()=>true}={}){if(muted||!isCurrent())return Promise.resolve();nativeChef??=createWindowsVoice({language:'zh-CN'});return new Promise((resolve,reject)=>nativeChef.speak(text,{shouldPlay:isCurrent,onStart:()=>{nativeSpeaking=true;},onDone:()=>{nativeSpeaking=false;resolve();},onError:e=>{nativeSpeaking=false;reject(e);}}));}
 return {playChefNative,start,chop,splash,burst,scream,update,tone,stop,stopAll,playChew,stopChew,playChef,stopChef,chefLevel,
  get voiceName(){return voice?.selected||'Microsoft David';},get activeCount(){return active.size;},get loaded(){return clips.filter(Boolean).length;},get chewLoaded(){return chew.buffers.filter(Boolean).length;},get ready(){return !!ctx;},get chefPlaying(){return chef.source!==null;},get muted(){return muted;},
  speak(text,options){if(!voice||muted){if(!options.shouldPlay||options.shouldPlay())options.onStart?.();options.onDone?.();return;}voice.speak(text,{delivery:{gain:.9,carrier:67},...options});},
  mute(value){muted=value;if(ctx)master.gain.setTargetAtTime(value?0:.65,ctx.currentTime,.05);if(value)stopAll();},suspend(){stopAll();ctx?.suspend();},resume(){ctx?.resume();}};
}

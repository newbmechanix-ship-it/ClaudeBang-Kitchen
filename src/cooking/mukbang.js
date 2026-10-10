// Mukbang lifecycle: DeepSeek eats the actual plated servings, bite by bite.
// Pure state machine (no DOM / three) so it can be tested; the scene reads pose(), audio plays chews.
import {FOODS,event} from './state.js';
export const PHASES={reach:.9,grasp:.35,lift:.8,bite:.45,chew:1.6,lower:.7};
const ease=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
export function bitesFor(item){return Math.max(1,Math.min(4,Math.round((item.b-item.a)/.11)));}
export function servings(state){return state.items.filter(i=>i.zone==='plate'&&(i.eaten||0)<.999);}
export function createMukbang(state,{onBite=()=>{},onChew=()=>null,onServingDone=()=>{},onFinish=()=>{}}={}){
 let active=false,paused=false,phase='idle',timer=0,current=null,chewFor=PHASES.chew,eatenCount=0,epoch=0;
 function setPhase(p){phase=p;timer=0;}
 function nextServing(){const list=servings(state);return list.sort((a,b)=>(b.eaten||0)-(a.eaten||0)||a.id-b.id)[0]||null;}
 function start(){if(active)return {ok:false,reason:'already eating'};const first=nextServing();if(!first)return {ok:false,reason:'Plate a dish first.'};active=true;paused=false;epoch++;eatenCount=0;current=null;setPhase('reach');event(state,'DeepSeek started eating the plated dish');return {ok:true,count:servings(state).length};}
 function stop(reason='stopped'){if(!active)return false;active=false;paused=false;epoch++;current=null;setPhase('idle');event(state,`DeepSeek stopped eating (${reason})`);onFinish({reason,eaten:eatenCount,remaining:servings(state).length});return true;}
 function reset(){active=false;paused=false;epoch++;current=null;setPhase('idle');eatenCount=0;}
 function finishServing(){const item=current;current=null;if(!item)return;const index=state.items.indexOf(item);if(index>=0)state.items.splice(index,1);eatenCount++;event(state,`DeepSeek finished a piece of ${FOODS[item.type].name}`,item.fishId);onServingDone(item,servings(state).length);}
 function update(dt){
  if(!active||paused)return;dt=Math.max(0,Math.min(dt,.1));timer+=dt;
  // The held serving can vanish (reset, physics recovery, clear): never keep eating a phantom.
  if(current&&!state.items.includes(current)){current=null;setPhase('lower');}
  if(phase==='reach'&&timer>=PHASES.reach){current=nextServing();if(!current){stop('finished');return;}setPhase('grasp');}
  else if(phase==='grasp'&&timer>=PHASES.grasp){if(current.zone!=='plate'){current=null;setPhase('lower');return;}setPhase('lift');}
  else if(phase==='lift'&&timer>=PHASES.lift)setPhase('bite');
  else if(phase==='bite'&&timer>=PHASES.bite){const bites=bitesFor(current);current.eaten=Math.min(1,(current.eaten||0)+1/bites+1e-9);onBite(current,{bite:Math.round(current.eaten*bites),bites,remaining:servings(state).length});const d=Number(onChew(current));chewFor=Number.isFinite(d)&&d>0?Math.max(1.1,Math.min(10,d)):PHASES.chew;setPhase('chew');}
  else if(phase==='chew'&&timer>=chewFor){if((current.eaten||0)>=.999){finishServing();setPhase('lower');}else setPhase('bite');}
  else if(phase==='lower'&&timer>=PHASES.lower){if(!nextServing()){stop('finished');return;}setPhase('reach');}
 }
 function pose(){
  const t=phase==='chew'?timer/chewFor:timer/(PHASES[phase]||1);let reach=0,lift=0,jaw=0;
  if(phase==='reach'){reach=ease(t);}else if(phase==='grasp'){reach=1;}else if(phase==='lift'){reach=1-ease(t);lift=ease(t);}
  else if(phase==='bite'){lift=1;jaw=Math.sin(Math.min(1,t)*Math.PI)*.55;}else if(phase==='chew'){lift=.92;jaw=Math.abs(Math.sin(t*Math.PI*Math.max(2,Math.round(chewFor*2))))*.22;}else if(phase==='lower'){lift=1-ease(t);}
  return {active,paused,phase,progress:Math.min(1,t),reach,lift,jaw,carryId:current&&['grasp','lift','bite','chew'].includes(phase)?current.id:null,chewing:phase==='chew'};
 }
 return {start,stop,reset,update,pose,setPaused(v){if(active)paused=!!v;},get active(){return active;},get paused(){return paused;},get phase(){return phase;},get eaten(){return eatenCount;},get epoch(){return epoch;},get remaining(){return servings(state).length;}};
}

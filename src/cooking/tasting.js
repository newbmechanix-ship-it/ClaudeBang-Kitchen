import {FOODS} from './state.js';

// Keep the tasted portion after mukbang removes its physical item from the plate.
export function describeTastingItem(item){
 const cooked=Math.max(0,item.cook||0),burn=Math.max(0,item.burn||0);
 return {food:FOODS[item.type]?.name||item.type,fishId:item.fishId||null,
  lengthCm:Math.round((item.b-item.a)*100),cookedPercent:Math.round(cooked*100),
  burnedPercent:Math.round(burn*100),wetness:Math.round((item.wet||0)*100),
  doneness:burn>.25?'burnt':cooked<.3?'raw':cooked<.85?'underdone':cooked<=1.2?'cooked through':'overcooked'};
}
export function beginTasting(state,items,score){
 state.tasting={dish:items.map(describeTastingItem),score,bites:[],biteCount:0,completed:false};
 return state.tasting;
}
export function recordTastingBite(state,item,info){
 const tasting=state.tasting||beginTasting(state,state.items.filter(i=>i.zone==='plate'),state.lastScore??null);
 const bite={...describeTastingItem(item),bite:info.bite,totalBites:info.bites};
 tasting.bites.push(bite);tasting.bites=tasting.bites.slice(-8);tasting.biteCount++;tasting.completed=false;
 return bite;
}

import './style.css';
import {createKitchen,createContainers,addFood,ignite,updateKitchen,plate,cookingMode,BOARD,BURNER,IGNITER,ignitionAccess,FOODS,event,LIQUID} from './state.js';
import {createCookingPhysics} from './physics.js';
import {createCookingScene} from './scene.js';
import {createCookingAudio} from './audio.js';
import {createFishMind} from './mind.js';
import {createLiquidSim,resetLiquidSim,stepLiquids,driveContainer,pourThreshold,panLitres,panPose,airborne,groundHeight} from './liquid.js';
import {createChef} from './chef.js';
import {createMukbang,servings} from './mukbang.js';
import {beginTasting,recordTastingBite} from './tasting.js';
const $=id=>document.getElementById(id),s=createKitchen(),audio=createCookingAudio(),sim=createLiquidSim(),clock=()=>performance.now()/1000;let restored=false;
try{const saved=JSON.parse(sessionStorage.getItem('test-kitchen-share-v1'));if(saved?.version===1&&Array.isArray(saved.items)&&Array.isArray(saved.fish)){Object.assign(s,saved);s.items=s.items.filter(i=>(i.eaten||0)<.999);s.gas=0;s.lit=false;s.fish.forEach(f=>{f.speaking=f.screaming=false;});if(!s.containers?.oil||!s.containers?.water)s.containers=createContainers();for(const c of Object.values(s.containers)){c.held=false;c.tilt=0;c.rate=0;}for(const k of ['spilled','poured','supplied'])s[k]={oil:0,water:0,...(s[k]||{})};restored=true;}}catch{}
if(!restored){addFood(s,'carrot');addFood(s,'zucchini');addFood(s,'tomato');}
const physics=createCookingPhysics(s),world=createCookingScene($('kitchen'),s,sim);physics.step(0);
let tool='hand',drag=null,knob=null,held=false,heldTime=0,lastChop=-1,last=performance.now(),lastUi=0,toastUntil=0,dialogueUntil=0,muted=false,lastSave=0,lastImpact=-99,frameMs=16.7,lastPick=null;
let subtitles=true;
$('subtitles').onclick=()=>{subtitles=!subtitles;$('subtitles').textContent=subtitles?'Subtitles on':'Subtitles off';$('subtitles').setAttribute('aria-pressed',String(subtitles));$('dialogue').hidden=!subtitles||!$('line').textContent;$('chef-sub').hidden=!subtitles||!$('chef-en').textContent;};
let scrollTilts=false,rotating=null;
let heldContainer=null,containerTarget=null,lastSplash=0,lastMode='',doneStage=0,burnNoted=false,chefSubUntil=0;const keys={q:false,e:false},pourLog={oil:{pan:0,spill:0,active:false},water:{pan:0,spill:0,active:false}};let panSpillLog=0,panSpillNoted=0;
function toast(text){$('toast').textContent=text;$('toast').classList.add('show');toastUntil=s.time+3.2;}
const mind=createFishMind(s,audio,{status(text,ok){$('brain-status').textContent=text;$('brain-status').style.color=ok?'#b3c9ac':'#ecbc86';},spoken(name,text){$('speaker').textContent=name.toUpperCase();$('line').textContent=text;$('dialogue').hidden=!subtitles;dialogueUntil=s.time+12;}});
function enableAudio(){audio.start().then(()=>$('audio-status').textContent='SPATIAL AUDIO / LIVE').catch(()=>$('audio-status').textContent='Click again to enable audio');}
document.addEventListener('pointerdown',enableAudio,{once:true});
document.addEventListener('click',()=>{if(!audio.ready)enableAudio();});

// ---------- DeepSeek chef (live model via local backend) ----------
const named=zone=>{const out={};for(const i of s.items)if(i.zone===zone){const k=FOODS[i.type].name;out[k]=(out[k]||0)+1;}return out;};
function chefSnapshot(){const pan=s.items.filter(i=>i.zone==='pan'),done=pan.length?pan.reduce((n,i)=>n+i.cook,0)/pan.length:0,p=muk.pose();
 return {ingredients:{board:named('board'),pan:named('pan'),plate:named('plate')},pieces:s.items.length,cuts:s.cuts,vessel:s.vessel,temperatureC:Math.round(s.temp),mode:cookingMode(s),gasPercent:Math.round(s.gas*100),flame:s.lit,
  panLiquid:{oilLitres:+panLitres(s,'oil').toFixed(2),waterLitres:+panLitres(s,'water').toFixed(2)},spilledLitres:{oil:+s.spilled.oil.toFixed(2),water:+s.spilled.water.toFixed(2)},containersLitres:{oil:+s.containers.oil.amount.toFixed(2),water:+s.containers.water.amount.toFixed(2)},
  doneness:{averagePercent:Math.round(done*100),burnedPieces:pan.filter(i=>i.burn>.2).length,pieces:pan.slice(0,10).map(i=>({food:FOODS[i.type].name,lengthCm:Math.round((i.b-i.a)*100),cookedPercent:Math.round(i.cook*100),burnedPercent:Math.round(i.burn*100)}))},
  served:s.served,lastScore:s.lastScore,tasting:s.tasting||null,mukbang:p.active?{phase:p.phase,eatenPieces:muk.eaten,remainingServings:muk.remaining}:null,fish:s.fish.map(f=>({name:f.name,pain:Math.round(f.pain)}))};}
function chefStatus(text,ok){$('chef-status').textContent=text;$('chef-status').classList.toggle('error',!ok);}
const chef=createChef({snapshot:chefSnapshot,play:(url,o)=>typeof url==='string'?audio.playChef(url,o):audio.playChefNative(url.speech,o),stopAudio:()=>audio.stopChef(),onStatus:chefStatus,
 onLine(reply){$('chef-en').textContent=reply.text;$('chef-sub').hidden=!subtitles;chefSubUntil=s.time+Math.max(6,reply.text.length*.08);},onGesture(){world.chefGesture();}});
const tell=(type,detail)=>chef.notify(type,detail,clock());
$('chef').onclick=()=>{chef.setEnabled(!chef.enabled);$('chef').textContent=chef.enabled?'DeepSeek chef on':'DeepSeek chef off';$('chef').setAttribute('aria-pressed',String(chef.enabled));if(!chef.enabled)$('chef-sub').hidden=true;};

// ---------- Mukbang ----------
const muk=createMukbang(s,{onBite(item,info){const bite=recordTastingBite(s,item,info);const fish=s.fish.find(f=>f.id===item.fishId);if(fish){fish.pain=Math.max(fish.pain,80);event(s,`${fish.name} reacts to bite ${info.bite}`,fish.id);audio.scream(fish,0,{bite:true});$('speaker').textContent=fish.name.toUpperCase();$('line').textContent=`[Robotic scream as DeepSeek takes bite ${info.bite} of ${info.bites}]`;$('dialogue').hidden=!subtitles;}tell('mukbang-bite',{...bite,of:info.bites});},onChew:()=>audio.playChew(),onServingDone(item,remaining){$('mukbang-status').textContent=`MUKBANG · ${remaining} serving${remaining===1?'':'s'} left`;},
 onFinish({reason,eaten}){audio.stopChew();if(reason==='finished'){if(s.tasting)s.tasting.completed=true;tell('mukbang-finished',{eatenPieces:eaten});toast('DeepSeek cleaned the plate.');}mukUi();}});
function mukUi(){const p=muk.pose(),left=servings(s).length;$('mukbang-status').textContent=p.active?`MUKBANG · ${p.paused?'PAUSED · ':''}${left} serving${left===1?'':'s'} left`:left?`MUKBANG STOPPED · ${left} left`:'MUKBANG · PLATE EMPTY';$('mukbang-stop').textContent=p.active?'Stop eating':'Eat more';$('mukbang-stop').disabled=!p.active&&!left;$('mukbang-panel').disabled=p.active||!left;$('mukbang').disabled=!left;}
function startMukbang(){release();putDown();if(!servings(s).length){toast('Plate a dish first.');return;}const r=muk.start();if(!r.ok){toast(r.reason);return;}$('dish').hidden=true;$('mukbang-bar').hidden=false;world.frame('mukbang');tell('mukbang-start',{servings:r.count});mukUi();}
$('mukbang').onclick=startMukbang;$('mukbang-panel').onclick=startMukbang;
$('mukbang-stop').onclick=()=>{if(muk.active){muk.stop('stopped by the cook');audio.stopChew();}else startMukbang();mukUi();};
$('mukbang-back').onclick=()=>{if(muk.active)muk.stop('returned to cooking');audio.stopChew();world.frame('cooking');$('mukbang-bar').hidden=true;mukUi();};

// ---------- Tools ----------
function choose(value){release();if(value!=='hand')putDown();tool=value;$('kitchen').dataset.tool=value;world.setTool(value);for(const b of document.querySelectorAll('[data-tool]'))b.setAttribute('aria-pressed',String(b.dataset.tool===value));const hints={knife:['KNIFE / CLICK OR DRAG TO SLICE','Slice settled food on the board. Each cut follows the angle of the food.'],hand:['GRAB / CLICK TO PICK UP OR DROP','Click to pick up/drop. Hold right mouse and move to rotate. Scroll to lift. F lights the lighter; Q/E tilt bottles.'],spatula:['SPATULA / CLICK TO FLIP','Click food in the pan to flip. Toss / stir moves the whole pan.']};[$('hint-label').textContent,$('hint-text').textContent]=hints[value];}
for(const b of document.querySelectorAll('[data-tool]'))b.onclick=()=>choose(b.dataset.tool);choose(tool);
function add(type,zone='board'){if(type==='pasta'){let n=0;for(;n<8;n++)if(!addFood(s,type,'pan'))break;if(!n){toast('The station is full. Serve or clear it first.');return;}audio.splash();tell('added',{food:'Rigatoni',zone:'pan',count:n});toast('Rigatoni added. Pour water and bring it to a rolling boil.');return;}const f=addFood(s,type,zone);if(!f){toast(type==='claude'&&s.fish.length>=6?'Six fish-Claudes per service. Clear the station for a new batch.':zone==='board'?'The board is full. Sweep or drag its ingredients into the pan first.':'The station is full. Serve or clear it first.');return;}tell('added',{food:FOODS[type].name,zone});toast(FOODS[type].name+' added to the '+zone);audio.tone(430,.07,.07,'sine',610);}
for(const b of document.querySelectorAll('[data-food]'))b.onclick=()=>add(b.dataset.food);$('fish-pan').onclick=()=>add('claude','pan');
for(const v of ['pan','pot'])$(v).onclick=()=>{s.vessel=v;for(const k of ['pan','pot'])$(k).setAttribute('aria-pressed',String(k===v));audio.tone(260,.15,.06,'triangle');};

// ---------- Containers: pick up, move, tilt, set down ----------
const NAME={oil:'Oil bottle',water:'Water jug'};
function pickUp(kind){if(heldContainer)putDown();const c=s.containers[kind];heldContainer=kind;c.held=true;delete c.returnTo;containerTarget=[c.pos[0],Math.max(c.pos[1],groundHeight(c.pos[0],c.pos[2])+.12),c.pos[2]];world.setSelectedContainer(kind);}
function putDown(){scrollTilts=false;if(!heldContainer)return;const c=s.containers[heldContainer];c.held=false;c.tilt=0;c.rate=0;delete c.returnTo;heldContainer=null;containerTarget=null;world.setSelectedContainer(null);}

function gas(value){s.gas=Math.max(0,Math.min(1,value));$('gas').value=Math.round(s.gas*100);if(!s.gas)s.lit=false;}
$('gas').oninput=()=>gas(Number($('gas').value)/100);
$('transfer').onclick=()=>{const ids=s.items.filter(i=>i.zone==='board').map(i=>i.id),count=physics.transfer(ids,'pan');if(count){audio.splash();toast(count+' pieces lifted into the pan.');tell('moved-to-pan',{pieces:count});}else toast('The board is clear.');};
function toss(){const count=physics.toss();if(count){audio.chop();event(s,'Pan tossed / ingredients turned');}else toast('Let the ingredients settle in the pan first.');}
$('toss').onclick=toss;
$('dock-pan').onclick=()=>{physics.dockPan();toast('Returning the pan to the burner.');};
$('recover').onclick=()=>{const count=physics.recover();toast(count?'Dropped food returned to the board.':'No dropped ingredients to recover.');};
$('serve').onclick=()=>{const ids=s.items.filter(i=>i.zone==='pan').map(i=>i.id),served=named('pan'),result=plate(s);if(!result){toast('Add something to the pan first.');return;}beginTasting(s,s.items.filter(i=>ids.includes(i.id)),result.score);physics.transfer(ids,'plate');$('dish').hidden=false;$('score').textContent=result.score+'/100';$('dish-title').textContent=result.score>80?'Chef’s questionable masterpiece.':result.score>45?'An interesting first course.':'A brave interpretation.';$('dish-note').textContent=result.score>80?'Golden, cooked through, and ready for service.':result.score>45?'Almost there. Watch the heat and give each ingredient time.':'Try a little oil for vegetables, boiling water for pasta, and serve before anything burns.';audio.tone(520,.5,.08,'sine',780);tell('served',{score:result.score,pieces:result.count,dish:served});doneStage=0;burnNoted=false;mukUi();};
$('continue').onclick=()=>$('dish').hidden=true;
$('view').onclick=()=>world.resetView();
$('sound').onclick=()=>{muted=!muted;audio.mute(muted);$('sound').textContent=muted?'Sound off':'Sound on';$('sound').setAttribute('aria-pressed',String(!muted));};
$('agent').onclick=()=>{mind.setEnabled(!mind.enabled);$('agent').textContent=mind.enabled?'Claude agent on':'Claude agent off';$('agent').setAttribute('aria-pressed',String(mind.enabled));};
$('clear').onclick=()=>{release();putDown();mind.reset();chef.reset();muk.reset();audio.stopChew();audio.stopChef();physics.reset();Object.assign(s,createKitchen());delete s.tasting;resetLiquidSim(sim);for(const k of ['oil','water'])pourLog[k]={pan:0,spill:0,active:false};doneStage=0;burnNoted=false;lastMode='';world.frame('cooking');$('mukbang-bar').hidden=true;$('chef-sub').hidden=true;$('gas').value=0;$('dish').hidden=true;$('dialogue').hidden=true;$('pan').setAttribute('aria-pressed','true');$('pot').setAttribute('aria-pressed','false');mukUi();toast('Clean board. Cold pan. Full bottle and jug. A fresh service.');};
function strike(hit){if(s.time-lastChop<.14)return;if(!hit?.id)return;const result=physics.cut(hit.id,hit.point,hit.linkIndex);if(result){lastChop=s.time;world.setPointer(hit.point);world.strike();audio.chop();world.pulse(hit.point.x,hit.point.z,FOODS[result[0].type].inside);tell('cut',{food:FOODS[result[0].type].name});if(result[0].fishId)audio.scream(s.fish.find(f=>f.id===result[0].fishId),-.5);}}
// A toggled grab owns right-drag rotation, before OrbitControls sees it.
world.canvas.addEventListener('pointerdown',e=>{
 if(e.button!==2||muk.active||!drag)return;
 e.preventDefault();e.stopImmediatePropagation();rotating={x:e.clientX,y:e.clientY};world.canvas.setPointerCapture(e.pointerId);
},{capture:true});
world.canvas.addEventListener('pointermove',e=>{
 if(!rotating||!drag)return;e.preventDefault();e.stopImmediatePropagation();
 const dx=e.clientX-rotating.x,dy=e.clientY-rotating.y;rotating={x:e.clientX,y:e.clientY};
 if(heldContainer){const c=s.containers[heldContainer];c.manualYaw=true;c.yaw+=dx*.009;c.tilt=Math.max(0,Math.min(2.27,c.tilt+dy*.009));}
 else physics.rotateHeld(dx*.009,dy*.009);
},{capture:true});
world.canvas.addEventListener('pointerup',e=>{
 if(e.button!==2||!rotating)return;e.preventDefault();e.stopImmediatePropagation();rotating=null;
 if(drag){const p=world.project(e,drag.height);if(p)drag.offset={x:drag.point.x-p.x,z:drag.point.z-p.z};drag.event={clientX:e.clientX,clientY:e.clientY};}
 if(world.canvas.hasPointerCapture(e.pointerId))world.canvas.releasePointerCapture(e.pointerId);
},{capture:true});
world.canvas.addEventListener('contextmenu',e=>{if(drag){e.preventDefault();e.stopImmediatePropagation();}},{capture:true});
world.canvas.addEventListener('pointerdown',e=>{
 if(muk.active)return;
 if(e.button!==0)return;if(drag){release();return;}enableAudio();held=true;heldTime=0;world.setDown(true);world.canvas.setPointerCapture(e.pointerId);
 const p=world.project(e),hit=world.pick(e);lastPick=hit?{id:hit.id,panHandle:!!hit.panHandle,knob:!!hit.knob,container:hit.container}:null;world.setPointer(p);world.setHover(hit);
 if(hit?.lighter){putDown();world.setDrag('prop');toast('Hold F to spark. Right-drag to rotate. Scroll to lift. Click again to drop.');const target=physics.beginLighterGrab();drag={kind:'lighter',height:target.y,point:{...target},event:{clientX:e.clientX,clientY:e.clientY}};const ground=world.project(e,drag.height);drag.offset=ground?{x:target.x-ground.x,z:target.z-ground.z}:{x:0,z:0};return;}
 if(hit?.container){pickUp(hit.container);const c=s.containers[hit.container];drag={kind:'container',height:containerTarget[1],point:{x:c.pos[0],y:containerTarget[1],z:c.pos[2]},event:{clientX:e.clientX,clientY:e.clientY}};const ground=world.project(e,drag.height);drag.offset=ground?{x:drag.point.x-ground.x,z:drag.point.z-ground.z}:{x:0,z:0};world.setDrag('prop');return;}
 if(hit?.knob){knob={x:e.clientX,y:e.clientY,value:s.gas};return;}
 if(tool==='knife')strike(hit);
 if(tool==='hand'&&hit){
  if(hit.panHandle){putDown();physics.beginPanGrab(hit.point);drag={kind:'pan',height:hit.point.y+.10,point:{x:hit.point.x,y:hit.point.y+.10,z:hit.point.z}};}
  else if(hit.id&&physics.beginGrab(hit.id,hit.point,hit.linkIndex)){const target=physics.grab.target;drag={kind:'food',id:hit.id,height:target.y,point:{...target}};world.setDrag(hit.id);}
  if(drag){const ground=world.project(e,drag.height);drag.offset=ground?{x:drag.point.x-ground.x,z:drag.point.z-ground.z}:{x:0,z:0};drag.event={clientX:e.clientX,clientY:e.clientY};}
 }
 if(tool==='spatula'&&hit?.id&&physics.toss(hit.id))audio.chop();
});
function moveHeld(e){if(!drag)return;const p=world.project(e,drag.height);if(!p)return;const target={x:p.x+drag.offset.x,y:drag.height,z:p.z+drag.offset.z};drag.point=target;drag.event={clientX:e.clientX,clientY:e.clientY};if(drag.kind==='lighter')physics.moveLighter(target);else if(drag.kind==='pan')physics.movePan(target);else if(drag.kind==='container')containerTarget=[target.x,target.y,target.z];else physics.moveGrab(target);}
world.canvas.addEventListener('pointermove',e=>{
 if(knob){gas(knob.value+(e.clientX-knob.x-(e.clientY-knob.y))/180);return;}
 if(drag){moveHeld(e);return;}
 const p=world.project(e);if(!p)return;world.setPointer(p);const hit=world.pick(e);world.setHover(hit);world.setHoverContainer(hit?.container);
 if(tool==='knife'&&hit?.id){world.setPointer(hit.point);if(held)strike(hit);}
});
world.canvas.addEventListener('wheel',e=>{if(!drag&&!heldContainer)return;e.preventDefault();e.stopImmediatePropagation();if(heldContainer&&(scrollTilts||(e.buttons&2))){const c=s.containers[heldContainer],pixels=e.deltaY*(e.deltaMode===1?16:e.deltaMode===2?240:1);c.tilt=Math.max(0,Math.min(130*Math.PI/180,c.tilt-Math.max(-240,Math.min(240,pixels))*.0022));return;}if(drag){const [lo,hi]=drag.kind==='lighter'?[.92,2.1]:drag.kind==='container'?[.9,1.9]:[1.08,2.1];drag.height=Math.max(lo,Math.min(hi,drag.height-e.deltaY*.001));moveHeld(drag.event);}else if(containerTarget)containerTarget[1]=Math.max(.9,Math.min(1.9,containerTarget[1]-e.deltaY*.001));},{passive:false,capture:true});
// Click again or Escape drops a toggled grab; pointer-up only finishes knife/knob input.
function release(e){rotating=null;if(drag?.kind==='container')putDown();if(drag?.kind==='lighter')physics.endLighterGrab();else if(drag?.kind==='pan')physics.endPanGrab();else if(drag?.kind!=='container')physics.endGrab();world.setDrag(null);drag=null;knob=null;held=false;world.setDown(false);if(e&&world.canvas.hasPointerCapture(e.pointerId))world.canvas.releasePointerCapture(e.pointerId);}
world.canvas.addEventListener('pointerup',e=>{if(e.button!==0)return;held=false;knob=null;if(world.canvas.hasPointerCapture(e.pointerId))world.canvas.releasePointerCapture(e.pointerId);if(!drag)world.setDown(false);});world.canvas.addEventListener('pointercancel',release);window.addEventListener('blur',()=>{release();keys.f=keys.q=keys.e=false;});
window.addEventListener('keydown',e=>{const k=e.key.toLowerCase();if(k==='f'&&!e.target.matches('input,textarea')){keys.f=true;e.preventDefault();return;}if(k==='escape'&&drag){release();return;}if((k==='q'||k==='e')&&(heldContainer||drag?.kind==='pan')&&!e.target.matches('input[type=text],textarea')){keys[k]=true;e.preventDefault();return;}if(k==='escape'&&heldContainer){release();return;}if(e.target.matches('input,button,select'))return;const v={1:'hand',2:'knife',4:'spatula'}[e.key];if(v)choose(v);});
window.addEventListener('keyup',e=>{const k=e.key.toLowerCase();if(k==='q'||k==='e'||k==='f')keys[k]=false;});
document.addEventListener('visibilitychange',()=>{release();keys.f=keys.q=keys.e=false;if(document.hidden){audio.suspend();mind.setEnabled(false);$('agent').textContent='Claude agent off';$('agent').setAttribute('aria-pressed','false');chef.update(clock(),true);muk.setPaused(true);}else{audio.resume();muk.setPaused(false);}last=performance.now();mukUi();});

// ---------- Liquids per frame ----------
function stepPour(dt){
 const dir=(keys.e?1:0)-(keys.q?1:0);
 if(dir&&heldContainer){const c=s.containers[heldContainer];c.tilt=Math.max(0,Math.min(2.27,c.tilt+dir*dt*1.1));}
 if(dir&&drag?.kind==='pan')physics.setPanTilt(physics.panTilt+dir*dt*.8);
 for(const c of Object.values(s.containers)){driveContainer(s,c,c.kind===heldContainer?containerTarget:null,dt);}
 const events=[];for(let r=dt;r>1e-6;r-=.02){stepLiquids(s,sim,Math.min(.02,r));events.push(...sim.events);}sim.events=events;
 let hits=0,spatter=false,overflow=0;
 for(const e of events){if(e.type==='hit'){pourLog[e.kind].pan+=e.vol;hits++;}else if(e.type==='spill'&&!e.fromPan)pourLog[e.kind].spill+=e.vol;else if(e.type==='spatter')spatter=true;else if(e.type==='overflow')overflow+=e.vol;}
 if(hits&&s.time-lastSplash>.09){lastSplash=s.time;const oilHit=events.some(e=>e.type==='hit'&&e.kind==='oil');audio.tone(oilHit?140+Math.random()*60:300+Math.random()*500,.06,oilHit?.02:.035,'sine',oilHit?90:140);}
 if(spatter){audio.burst(.25,.12,3500);}
 if(overflow>0){panSpillLog+=overflow;if(s.time-panSpillNoted>3&&panSpillLog>.02){panSpillNoted=s.time;tell('pan-spill',{litres:+panSpillLog.toFixed(2),vessel:s.vessel});toast('Liquid is slopping over the rim onto the worktop.');panSpillLog=0;}}
 for(const kind of ['oil','water']){const log=pourLog[kind],c=s.containers[kind];if(c.rate>0)log.active=true;else if(log.active&&airborne(sim,kind)<1e-6){log.active=false;if(log.pan+log.spill>.004){event(s,`${kind==='oil'?'Oil':'Water'} poured: ${log.pan.toFixed(2)} L in the ${s.vessel}, ${log.spill.toFixed(2)} L spilled`);tell('pour',{liquid:kind,intoVesselLitres:+log.pan.toFixed(2),spilledLitres:+log.spill.toFixed(2),vessel:s.vessel});if(log.spill>log.pan&&log.spill>.02)toast(`Missed — ${log.spill.toFixed(2)} L of ${kind} on the worktop.`);}log.pan=log.spill=0;}}
}
function noteCooking(){const mode=cookingMode(s);if(mode!==lastMode){if(lastMode&&(mode==='boiling'||mode==='frying'||mode==='searing'))tell('mode',{mode});lastMode=mode;}
 const pan=s.items.filter(i=>i.zone==='pan');if(!pan.length){doneStage=0;return;}const done=pan.reduce((n,i)=>n+i.cook,0)/pan.length,stage=done>=.9?3:done>=.5?2:done>=.2?1:0;if(stage>doneStage){doneStage=stage;tell('doneness',{averagePercent:Math.round(done*100)});}
 const burnt=pan.some(i=>i.burn>.25);if(burnt&&!burnNoted){burnNoted=true;tell('burning',{pieces:pan.filter(i=>i.burn>.25).length});}}
function pourStatus(){if(!heldContainer){$('tilt-target').textContent=drag?.kind==='pan'?`PAN TILT ${Math.round(physics.panTilt*57.3)}°`:'TILT / NOTHING HELD';$('tilt-value').textContent='—';$('pour-status').textContent='Click to pick up/drop. Hold right mouse and move to rotate. Scroll to lift. F lights the lighter; Q/E tilt bottles.';return;}
 const c=s.containers[heldContainer],deg=Math.round(c.tilt*57.3),thr=Math.round(pourThreshold(c)*57.3);$('tilt-target').textContent='TILT / '+NAME[heldContainer].toUpperCase();$('tilt-value').textContent=deg+'°';
 $('pour-status').textContent=c.amount<=1e-4?`${NAME[heldContainer]} is empty. Clear the station to refill.`:c.rate>0?`Pouring ${c.rate.toFixed(2)} L/s · ${c.amount.toFixed(2)} L left. Aim into the ${s.vessel}. ${scrollTilts?'Scroll down to stop pouring.':'Hold right mouse and move to tilt.'}`:`${c.amount.toFixed(2)} L left · tilt ${deg}° — pours past ~${thr}°. ${scrollTilts?'SCROLL: TILT / up pours, down straightens.':'SCROLL: LIFT / right-drag rotates.'} E/Q also tilt; click again to set down.`;}

function frame(now){const dt=Math.min(.25,(now-last)/1000);last=now;frameMs=frameMs*.95+dt*1000*.05;if(!document.hidden){physics.step(dt);const impact=physics.world.contacts.reduce((v,c)=>Math.max(v,Math.abs(c.getImpactVelocityAlongNormal())),0);if(impact>.6&&s.time-lastImpact>.12){audio.tone(130+Math.min(180,impact*35),.045,Math.min(.10,impact*.018),'triangle',65);lastImpact=s.time;}for(let remaining=dt;remaining>0;remaining-=.1)updateKitchen(s,Math.min(.1,remaining));
 stepPour(Math.min(dt,.1));muk.update(dt);const mp=muk.pose();world.setMukbang(mp);
 const sparking=drag?.kind==='lighter'&&keys.f,tip=physics.lighterTip;world.setDown(sparking);if(!sparking)heldTime=0;if(sparking&&!s.lit){const access=ignitionAccess(s,tip),near=access.ready&&Math.abs(tip.y-IGNITER.y)<.17;if(access.near&&access.covered)toast('Move the pan aside to expose the brass nozzle.');heldTime=near?heldTime+dt:0;if(ignite(s,near,heldTime)){audio.tone(100,.2,.14,'triangle',220);audio.burst(.35,.07,900);toast('Burner lit. Adjust the knob to control the heat.');tell('ignited',{gasPercent:Math.round(s.gas*100)});}}
 noteCooking();
 if(now-lastSave>1500){lastSave=now;try{sessionStorage.setItem('test-kitchen-share-v1',JSON.stringify(s));}catch{}}world.setChefTalk(audio.chefLevel());world.update(dt);audio.update(s,{chewing:mp.chewing,panSpill:sim.panSpill});mind.update();if(audio.ready)chef.update(clock(),false);
 if(now-lastUi>100){lastUi=now;for(const vessel of ['pan','pot'])$(vessel).setAttribute('aria-pressed',String(s.vessel===vessel));$('piece-count').textContent=s.items.length+' pieces';$('temperature').textContent=Math.round(s.temp);$('gas-value').textContent=s.gas?Math.round(s.gas*100)+'%':'OFF';$('flame-status').textContent=s.lit?'● FLAME ON':s.gas?'○ GAS OPEN / LIGHT IT':'● UNLIT';$('flame-status').style.color=s.lit?'#9bd8ef':'#b5c0a9';
  $('oil-level').textContent=`${s.containers.oil.amount.toFixed(2)} L · pan ${panLitres(s,'oil').toFixed(2)} L`;$('water-level').textContent=`${s.containers.water.amount.toFixed(2)} L · ${s.vessel} ${panLitres(s,'water').toFixed(2)} L`;pourStatus();
  $('mode').textContent=cookingMode(s).toUpperCase();const items=s.items.filter(i=>i.zone==='pan'),done=items.length?items.reduce((n,i)=>n+i.cook,0)/items.length:0,burn=items.some(i=>i.burn>.2);$('cook-fill').style.width=Math.min(100,done*100)+'%';$('cook-fill').style.background=burn?'#b9764b':'#d5b573';$('doneness').textContent=items.length?(burn?'Getting dark — turn down the heat.':done>=.9?'Ready to plate.':done>.4?'Cooking beautifully. Keep an eye on it.':'Let the pan do its thing.'):'Your station is ready.';$('recipe-steps').textContent=`${s.cuts?'✓':'○'} Slice · ${s.oil>.005?'✓':'○'} Oil · ${s.lit?'✓':'○'} Flame · ${done>=.9?'✓':'○'} Golden · ${s.served?'✓':'○'} Serve`;mukUi();
  $('kitchen').dataset.state=JSON.stringify({tool,lastPick,lighter:s.lighterPose,fps:Math.round(1000/frameMs),scrollMode:rotating?'rotate':'lift',physics:!!s.physics,held:drag?.id??drag?.kind??heldContainer??null,contacts:s.items.filter(i=>i.panContact).length,floor:s.items.filter(i=>i.zone==='floor').length,poses:s.items.map(i=>({id:i.id,zone:i.zone,position:i.pose?.position,velocity:i.pose?.velocity})),panPosition:s.panPose?.position,gas:s.gas,lit:s.lit,temp:Math.round(s.temp),mode:cookingMode(s),cuts:s.cuts,pieces:s.items.length,board:s.items.filter(i=>i.zone==='board').length,pan:items.length,fish:s.fish.length,screamSources:audio.activeCount,claudeVoice:audio.voiceName,subtitles,screamClips:audio.loaded,chewClips:audio.chewLoaded,agentBusy:mind.busy,served:s.served,water:s.water,oil:s.oil,containers:Object.fromEntries(Object.entries(s.containers).map(([k,c])=>[k,{amount:+c.amount.toFixed(3),tilt:+c.tilt.toFixed(2),rate:+c.rate.toFixed(3),pos:c.pos.map(v=>+v.toFixed(3)),held:c.held}])),spilled:s.spilled,poured:s.poured,particles:sim.particles.length,puddles:sim.puddles.length,panTilt:physics.panTilt,chef:{enabled:chef.enabled,busy:chef.busy,speaking:chef.speaking,pending:chef.pending,requests:chef.requests,status:chef.status},mukbang:{phase:mp.phase,active:mp.active,eaten:muk.eaten,remaining:muk.remaining},igniterCovered:ignitionAccess(s,world.pointer).covered,lighterDistance:Math.hypot(world.pointer.x-IGNITER.x,world.pointer.z-IGNITER.z).toFixed(2)});}
 if(s.time>toastUntil)$('toast').classList.remove('show');
 }requestAnimationFrame(frame);}
mukUi();requestAnimationFrame(frame);

fetch('/api/config').then(r=>r.json()).then(config=>{
 if(!config.chef){chef.setEnabled(false);$('chef').textContent='DeepSeek chef off';$('chef').setAttribute('aria-pressed','false');chefStatus('Optional AI: add your own key to .env and restart.',true);}
 if(!config.fish){mind.setEnabled(false);$('agent').textContent='Claude agent off';$('agent').setAttribute('aria-pressed','false');$('brain-status').textContent='Fish dialogue: configure your own key and FISH_MODEL in .env.';}
}).catch(()=>chefStatus('Local server unavailable. Open the game with Start-Game.cmd.',false));

export const FOODS={carrot:{name:'Carrot',length:.70,radius:.075,skin:'#e68736',inside:'#ffba66',cook:20},zucchini:{name:'Zucchini',length:.70,radius:.09,skin:'#426c36',inside:'#e1e1a0',cook:24},tomato:{name:'Tomato',length:.35,radius:.14,skin:'#c64432',inside:'#ee7750',cook:18},pasta:{name:'Rigatoni',length:.18,radius:.042,skin:'#e7be68',inside:'#f4d88b',cook:30},claude:{name:'Fish-Claude',length:.62,radius:.105,skin:'#6eaaa6',inside:'#c4dbd6',cook:28}};
export const BOARD={x:-.72,z:.28,y:.97,width:1.35,depth:.85},BURNER={x:.85,z:.12,y:.98,radius:.48};
export const IGNITER={x:BURNER.x,y:1.028,z:BURNER.z+.34};
export function ignitionAccess(s,p){const near=Math.hypot(p.x-IGNITER.x,p.z-IGNITER.z)<.14,position=s.panPose?.position||[BURNER.x,1.056,BURNER.z],covered=Math.hypot(position[0]-IGNITER.x,position[2]-IGNITER.z)<.47&&position[1]<1.30&&position[1]>.80;return {near,covered,ready:near&&!covered};}
// Pourable containers. `unit` = litres per 1.0 of the pan's s.water / s.oil fraction.
export const LIQUID={
 water:{unit:4,capacity:3,height:.24,radius:.09,minTilt:.5,maxTilt:1.45,rate:.95,speed:.95,drop:.004,spout:[.092,.24],home:[-1.18,.8825,-.40]},
 oil:{unit:.5,capacity:.6,height:.40,radius:.072,minTilt:.75,maxTilt:1.95,rate:.16,speed:.6,drop:.003,spout:[0,.40],home:[-1.46,.8825,-.37]}};
export function createContainers(){const c={};for(const [kind,L] of Object.entries(LIQUID))c[kind]={kind,amount:L.capacity,pos:[...L.home],yaw:0,tilt:0,held:false,rate:0};return c;}
export function createKitchen(){return {version:1,physics:false,panPose:null,time:0,next:1,items:[],fish:[],gas:0,lit:false,temp:22,oil:0,water:0,vessel:'pan',cuts:0,served:0,lastScore:null,events:[],containers:createContainers(),spilled:{oil:0,water:0},poured:{oil:0,water:0},supplied:{oil:0,water:0},evaporated:0};}
export function event(s,text,fishId=null){s.events.push({at:s.time,text,fishId});s.events=s.events.slice(-28);}
export function addFood(s,type,zone='board'){
 if(!FOODS[type])return null;if(s.items.length>=70)return null;if(type==='claude'&&s.fish.length>=6)return null;
 const f=FOODS[type],slot=zone==='board'?[BOARD.z-.26,BOARD.z,BOARD.z+.26].find(z=>s.items.every(i=>i.zone!=='board'||Math.abs(i.z-z)>=f.radius+FOODS[i.type].radius+.01)):null;
 if(zone==='board'&&slot===undefined)return null;
 const id=s.next++,fishId=type==='claude'?'claude-'+id:null;
 const item={id,type,fishId,a:-f.length/2,b:f.length/2,x:zone==='pan'?BURNER.x:BOARD.x,z:zone==='pan'?BURNER.z:slot,zone,cook:0,burn:0,side:0,wet:0,cutAt:-99,head:type==='claude',angle:0};
 if(zone==='pan'){const n=s.items.filter(i=>i.zone==='pan').length,r=Math.min(Math.max(.02,.39-Math.hypot(f.length/2,f.radius)),.08+n*.02);item.x+=Math.cos(n*2.4)*r;item.z+=Math.sin(n*2.4)*r;item.angle=n*2.4;}
 s.items.push(item);if(fishId)s.fish.push({id:fishId,name:'Claude '+(s.fish.length+1),pain:0,lastCut:-99,say:'',speaking:false,spokenAt:-99});event(s,`${FOODS[type].name} added to ${zone}`,fishId);return item;
}
export function cutFood(s,id,worldX){const item=s.items.find(i=>i.id===id);if(!item||item.zone!=='board'||s.items.length>=70)return null;const local=worldX-item.x;if(local-item.a<.018||item.b-local<.018)return null;
 const left={...item,b:local,id:s.next++,cutAt:s.time,x:item.x-.006},right={...item,a:local,id:s.next++,head:false,cutAt:s.time,x:item.x+.006};
 // Preserve the actual contact plane; subsequent slices use these exact intervals.
 const index=s.items.indexOf(item);s.items.splice(index,1,left,right);s.cuts++;if(item.fishId){const fish=s.fish.find(f=>f.id===item.fishId);fish.pain=Math.max(fish.pain,75);fish.lastCut=s.time;}event(s,`${FOODS[item.type].name} sliced at ${local.toFixed(3)} m`,item.fishId);return [left,right];}
export function moveFood(s,id,zone,x,z){const item=s.items.find(i=>i.id===id);if(!item)return;item.zone=zone;const center=(item.a+item.b)/2;item.x=x-center;item.z=z;event(s,`${FOODS[item.type].name} moved to ${zone}`,item.fishId);}
export function ignite(s,near,held){if(s.gas>.04&&near&&held>=.4){s.lit=true;event(s,'Burner ignited');return true;}return false;}
export function updateKitchen(s,dt){dt=Math.max(0,Math.min(dt,.1));s.time+=dt;if(s.gas<=.02)s.lit=false;
 const onBurner=!s.physics||!s.panPose||(Math.hypot(s.panPose.position[0]-BURNER.x,s.panPose.position[2]-BURNER.z)<.28&&s.panPose.position[1]<1.18),wet=s.water>.035,target=s.lit&&onBurner?(wet?100:22+225*s.gas):22;if(wet)s.temp=Math.min(100,s.temp);s.temp+=(target-s.temp)*(1-Math.exp(-dt/(wet?10:7)));
 if(wet&&s.temp>93&&s.lit){const lost=Math.min(s.water,dt*.0014*s.gas);s.water-=lost;s.evaporated=(s.evaporated||0)+lost*LIQUID.water.unit;}
 for(const i of s.items){if(i.zone!=='pan'||(s.physics&&!i.panContact))continue;const f=FOODS[i.type],heat=wet?Math.max(0,(s.temp-75)/25):Math.max(0,(s.temp-65)/100);i.wet=wet?Math.min(1,i.wet+dt*.08):Math.max(0,i.wet-dt*.03);i.cook=Math.min(1.5,i.cook+dt/f.cook*heat*(i.type==='pasta'&&!wet?.05:1)*(wet||s.oil>.02?1:.55));if(!wet&&s.temp>175&&i.cook>.8)i.burn=Math.min(1,i.burn+dt*(s.temp-175)/2200);}
 for(const fish of s.fish){const hot=s.items.some(i=>i.fishId===fish.id&&i.zone==='pan'&&(!s.physics||i.panContact))&&s.temp>48;fish.pain=Math.max(0,fish.pain-dt*4);if(hot)fish.pain=Math.max(fish.pain,Math.min(95,(s.temp-40)*.8));}
}
export function plate(s){const food=s.items.filter(i=>i.zone==='pan');if(!food.length)return null;const score=Math.round(food.reduce((n,i)=>n+Math.max(0,1-Math.abs(1-i.cook))*(1-i.burn),0)/food.length*100);for(const i of food)i.zone='plate';s.served++;s.lastScore=score;event(s,`Dish served: ${score}/100`);return {score,count:food.length};}
export function cookingMode(s){return s.temp<48?'warming':s.water>.035?(s.temp>=93?'boiling':'heating water'):s.oil>.02&&s.temp>95?'frying':s.temp>175?'searing':'warming';}

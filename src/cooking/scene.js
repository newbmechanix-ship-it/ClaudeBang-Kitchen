import * as T from 'three';
import {gestureEnvelope} from './animation.js';
import {createInterrogationRoom} from '../interrogation/room.js';
import {createArenaRobot} from '../revolver-cast.js';
import {BOARD,BURNER,IGNITER,ignitionAccess,FOODS,cookingMode} from './state.js';
import {createGasFlames,createLighterFlame} from './flame.js';
import {createFoodMesh,disposeFood} from './food.js';
import {createPourView} from './pour-view.js';
import {createLiquidSim} from './liquid.js';
export function createCookingScene(container,state,sim=createLiquidSim()){
 const room=createInterrogationRoom(container,{dilemma:true,title:'ROOM 09 / THE TEST KITCHEN'}),{scene,camera,renderer,controls}=room;
 camera.position.set(.1,2.83,1.89);camera.fov=66;camera.updateProjectionMatrix();controls.target.set(.08,.97,.04);controls.maxDistance=4;controls.minDistance=1;controls.enablePan=true;controls.mouseButtons={LEFT:null,MIDDLE:T.MOUSE.DOLLY,RIGHT:T.MOUSE.ROTATE};
 const mat=(color,metalness=0,roughness=.5)=>new T.MeshStandardMaterial({color,metalness,roughness});
 const metal=mat('#899a9b',.8,.26),black=mat('#202a2c',.7,.28),wood=mat('#b7844f',0,.83);
 function mesh(parent,g,m,p=[0,0,0]){const o=new T.Mesh(g,typeof m==='string'?mat(m):m);o.position.set(...p);o.castShadow=o.receiveShadow=true;parent.add(o);return o;}
 const box=(p,m,xyz,s)=>mesh(p,new T.BoxGeometry(...s),m,xyz),ball=(p,m,xyz,r)=>mesh(p,new T.SphereGeometry(r,16,12),m,xyz);
 // The same observation glass, cell walls and lighting, refitted as a test kitchen.
 box(scene,metal,[.02,.84,.11],[3.35,.085,1.4]);for(const x of[-1.5,1.5])for(const z of[-.48,.7])box(scene,black,[x,.41,z],[.06,.82,.06]);
 box(scene,black,[.02,.45,-.5],[3.25,.12,.045]);box(scene,wood,[BOARD.x,.923,BOARD.z],[BOARD.width,.085,BOARD.depth]);
 for(let n=0;n<24;n++)box(scene,n%3?'#a7794c':'#c5945b',[BOARD.x-.64+n*.055,.967,BOARD.z],[.001,.002,.81]);
 const groove=mesh(scene,new T.TorusGeometry(.035,.009,6,16),black,[-1.31,.969,.59]);groove.rotation.x=Math.PI/2;
 box(scene,black,[BURNER.x,.922,BURNER.z],[1.1,.075,1.05]);
 const burner=mesh(scene,new T.CylinderGeometry(.32,.32,.055,40),black,[BURNER.x,.974,BURNER.z]);
 for(let n=0;n<4;n++){const a=n*Math.PI/2,bar=box(scene,metal,[BURNER.x+Math.cos(a)*.29,1.01,BURNER.z+Math.sin(a)*.29],[.30,.035,.045]);bar.rotation.y=-a;}
 const gasKnob=new T.Group();gasKnob.position.set(.87,.866,.681);gasKnob.rotation.x=Math.PI/2;scene.add(gasKnob);mesh(gasKnob,new T.CylinderGeometry(.08,.08,.055,32),black);const marker=box(gasKnob,'#f0c77f',[0,.036,.042],[.013,.012,.05]);gasKnob.traverse(n=>n.userData.knob=true);
 const pan=new T.Group();pan.position.set(BURNER.x,1.054,BURNER.z);scene.add(pan);
 const vesselMat=mat('#414d50',.83,.23),inside=mat('#283334',.65,.34);
 mesh(pan,new T.CylinderGeometry(.45,.38,.055,64),inside);
 const rim=mesh(pan,new T.CylinderGeometry(.46,.405,.115,64,1,true),vesselMat,[0,.055,0]);rim.material.side=T.DoubleSide;
 const lip=mesh(pan,new T.TorusGeometry(.46,.018,8,64),metal,[0,.112,0]);lip.rotation.x=Math.PI/2;
 const handle=box(pan,black,[.71,.04,0],[.52,.055,.095]);handle.material=handle.material.clone();handle.userData.panHandle=true;box(pan,metal,[.46,.025,0],[.12,.035,.07]);
 const plateRoot=new T.Group();plateRoot.position.set(-.4,.898,-.51);scene.add(plateRoot);mesh(plateRoot,new T.CylinderGeometry(.36,.32,.025,48),'#d9ddcd');const plateRim=mesh(plateRoot,new T.TorusGeometry(.34,.025,8,48),'#eff3dd',[0,.017,0]);plateRim.rotation.x=Math.PI/2;
 // Pourable oil bottle and water jug (state.containers), streams, puddles and the pan's liquid surface.
 const pourView=createPourView(scene,pan,state,sim);
 for(let i=0;i<3;i++){const utensil=box(scene,metal,[-1.55+i*.08,1.12,-.53],[.018,.43,.018]);utensil.rotation.z=(i-1)*.17;}
 const cook=createArenaRobot(scene,'deepseek');cook.root.position.set(-.80,.18,-1.16);cook.root.scale.multiplyScalar(.9);cook.arms.L.sh.rotation.x=-.8;cook.arms.R.sh.rotation.x=-1;for(const a of Object.values(cook.arms))a.fa.rotation.x=-.8;
 const apron=box(cook.nodes.torso,'#eee6ca',[0,-.15,.42],[1.02,1.08,.03]);
 const patch=box(cook.nodes.torso,'#324d49',[0,-.2,.444],[.53,.3,.02]);
 const warm=new T.PointLight('#ffe0a5',4,4);warm.position.set(-.9,2,.4);scene.add(warm);
 const gasFlames=createGasFlames(),fire=gasFlames.group;fire.position.set(BURNER.x,1.012,BURNER.z);scene.add(fire);
 const nozzleMaterial=mat('#a78d53',.8,.32),nozzle=mesh(scene,new T.CylinderGeometry(.018,.018,.11,16),nozzleMaterial,[IGNITER.x,IGNITER.y,IGNITER.z-.055]);nozzle.rotation.x=Math.PI/2;
 mesh(scene,new T.TorusGeometry(.013,.004,6,20),nozzleMaterial,[IGNITER.x,IGNITER.y,IGNITER.z]);mesh(scene,new T.CircleGeometry(.010,16),black,[IGNITER.x,IGNITER.y,IGNITER.z+.001]);
 const pilotGuide=mesh(scene,new T.TorusGeometry(.045,.002,6,32),new T.MeshBasicMaterial({color:'#8bd6ff',transparent:true,opacity:.7,depthWrite:false}),[IGNITER.x,IGNITER.y+.012,IGNITER.z]);pilotGuide.rotation.x=Math.PI/2;
 const fireLight=new T.PointLight('#70bdff',0,1.8);fireLight.position.copy(fire.position);scene.add(fireLight);
 const knife=new T.Group();scene.add(knife);box(knife,metal,[0,.055,-.05],[.014,.13,.40]);box(knife,'#ede4c8',[0,.11,.25],[.055,.065,.22]);box(knife,metal,[0,.11,.13],[.065,.072,.025]);for(let z=.19;z<.34;z+=.065)ball(knife,metal,[.031,.11,z],.009);
 const lighter=new T.Group();scene.add(lighter);box(lighter,'#df9d48',[0,0,0],[.055,.15,.036]);box(lighter,metal,[0,.09,0],[.055,.032,.04]);mesh(lighter,new T.CylinderGeometry(.025,.025,.027,12),black,[0,.101,-.004]).rotation.z=Math.PI/2;
 lighter.traverse(n=>n.userData.lighter=true);
 const lighterFlame=createLighterFlame();lighterFlame.group.position.set(0,.116,-.004);lighter.add(lighterFlame.group);
 // Hot-oil spatter: a small fixed pool of additive specks.
 const spatter=Array.from({length:26},()=>{const p=ball(scene,new T.MeshBasicMaterial({color:'#ffe7a0',transparent:true,depthWrite:false,blending:T.AdditiveBlending}),[0,0,0],.0035);p.visible=false;p.castShadow=false;p.userData.v=new T.Vector3();p.userData.age=9;return p;});let spatterBurst=0;
 const guide=new T.Line(new T.BufferGeometry().setFromPoints([new T.Vector3(0,0,-.19),new T.Vector3(0,0,.19)]),new T.LineBasicMaterial({color:'#f6e8bb',transparent:true,opacity:.7}));scene.add(guide);
 const bubbles=Array.from({length:90},()=>{const b=mesh(scene,new T.SphereGeometry(.012,7,5),new T.MeshBasicMaterial({color:'#e4e8c3',transparent:true,opacity:.4}));b.visible=false;return b;});
 const steam=Array.from({length:28},()=>{const p=mesh(scene,new T.SphereGeometry(.042,8,6),new T.MeshBasicMaterial({color:'#d8e7df',transparent:true,opacity:.1,depthWrite:false}));p.visible=false;return p;});
 const food=new Map(),ray=new T.Raycaster(),mouse=new T.Vector2(),plane=new T.Plane(new T.Vector3(0,1,0),-BOARD.y);
 const feedback=[];
 let hoverContainer=null,tool='knife',pointer=new T.Vector3(BOARD.x,BOARD.y,BOARD.z),knifeStrike=-99,down=false,dragId=null,hoverId=null,cutYaw=0,panHover=false;
 function sync(){const ids=new Set(state.items.map(i=>i.id));for(const [id,m]of food)if(!ids.has(id)){disposeFood(m);food.delete(id);}for(const item of state.items)if(!food.has(item.id)){const model=createFoodMesh(item);scene.add(model.root);food.set(item.id,model);}}
 function project(e,height=BOARD.y){plane.constant=-height;const r=renderer.domElement.getBoundingClientRect();mouse.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);ray.setFromCamera(mouse,camera);return ray.ray.intersectPlane(plane,new T.Vector3());}
 function pick(e){project(e);const hits=ray.intersectObjects([...food.values()].map(m=>m.root).concat(gasKnob,handle,lighter,...pourView.meshes()),true).filter(h=>h.object.userData.lighter||h.object.userData.foodId||h.object.userData.knob||h.object.userData.panHandle||h.object.userData.container);const u=hits[0]?.object.userData;return hits[0]?{lighter:!!u.lighter,id:u.foodId,knob:u.knob,panHandle:u.panHandle,container:u.container||null,linkIndex:u.linkIndex,point:hits[0].point}:null;}
 function pulse(x,z,color='#f4d784'){for(let n=0;n<10;n++){const m=ball(scene,new T.MeshBasicMaterial({color,transparent:true}),[x,1.03,z],.006+Math.random()*.008);feedback.push({m,born:state.time,v:new T.Vector3((Math.random()-.5)*.6,Math.random()*.8+.1,(Math.random()-.5)*.6)});}}
 // --- DeepSeek chef: speech-driven mouth/gestures and mukbang eating ---
 let chefTalk=0,gestureAt=-99,gestureSide=1,muk=null,frameMode='cooking',savedView=null,cameraGoal=null;
 scene.updateMatrixWorld(true);const plateWorld=plateRoot.getWorldPosition(new T.Vector3()),handWorld=s=>cook.arms[s].hand.getWorldPosition(new T.Vector3());
 const eatSide=handWorld('L').distanceTo(plateWorld)<handWorld('R').distanceTo(plateWorld)?'L':'R',eatSign=eatSide==='L'?1:-1;
 const chopsticks=new T.Group();for(const dx of [-.03,.03]){const stick=new T.Mesh(new T.CylinderGeometry(.012,.02,.8,6),mat('#3a2a1c',0,.6));stick.position.set(dx,-.36,.08);stick.rotation.x=.12;chopsticks.add(stick);}chopsticks.visible=false;cook.arms[eatSide].hand.add(chopsticks);
 const mouthPoint=new T.Vector3(),facing=new T.Vector3(),tmp=new T.Vector3();
 function updateMouth(){cook.jaw.getWorldPosition(mouthPoint);facing.set(0,0,1).transformDirection(cook.head.matrixWorld);facing.y=0;facing.normalize();mouthPoint.addScaledVector(facing,.09);mouthPoint.y-=.02;return mouthPoint;}
 function carryPosition(item,out){const p=muk;if(!item.pose)out.copy(plateWorld);else out.fromArray(item.pose.position);if(p.phase==='grasp')return out.y+=.03*p.progress,out;return out.lerp(updateMouth(),Math.max(p.lift,p.phase==='bite'||p.phase==='chew'?1:0));}
 function animateCook(t,dt,strike){
  const eating=muk?.active,arm=cook.arms[eatSide],other=cook.arms[eatSide==='L'?'R':'L'];chopsticks.visible=!!eating;
  if(eating){
   const reach=muk.reach,lift=muk.lift;
   arm.sh.rotation.set(-1.0-reach*.35-lift*.5,0,eatSign*(.05+reach*.35-lift*.45));arm.fa.rotation.x=-.8+reach*.55-lift*1.15;
   other.sh.rotation.set(-.9,0,0);other.fa.rotation.x=-.9;
   cook.head.rotation.x=-.30+reach*.25-lift*.12+(muk.chewing?Math.sin(t*9)*.03:0);cook.head.rotation.y=eatSign*reach*.25;
   cook.jaw.rotation.x=muk.jaw;
   cook.root.updateMatrixWorld(true);const serving=state.items.find(i=>i.id===muk.carryId);if(serving){const target=carryPosition(serving,new T.Vector3());arm.hand.worldToLocal(target);chopsticks.quaternion.setFromUnitVectors(new T.Vector3(0,-1,0),target.normalize());}
  }else{
   // Mouth follows the actual chef audio level; a short hand gesture accompanies each new line.
   const g=gestureEnvelope(t,gestureAt,2.2),wave=Math.sin((t-gestureAt)*5)*g;
   cook.head.rotation.y=Math.sin(t*.5)*.12+chefTalk*Math.sin(t*2.3)*.08;cook.head.rotation.x=-.30+chefTalk*Math.sin(t*3.1)*.05;
   cook.arms.R.sh.rotation.set(-1.1+strike*.2-(gestureSide<0?g*.7:0),0,gestureSide<0?-wave*.25:0);cook.arms.R.fa.rotation.x=-.8-strike*.3-(gestureSide<0?g*.5:0);
   cook.arms.L.sh.rotation.set(-.8-(gestureSide>0?g*.75:0),0,gestureSide>0?wave*.25:0);cook.arms.L.fa.rotation.x=-.8-(gestureSide>0?g*.55:0);
   cook.jaw.rotation.x=Math.min(.34,chefTalk*.42);
  }
  if(cameraGoal){const k=1-Math.exp(-dt*3.5);camera.position.lerp(cameraGoal.position,k);controls.target.lerp(cameraGoal.target,k);controls.update();if(camera.position.distanceTo(cameraGoal.position)<.005)cameraGoal=null;}
 }
 function frame(mode){if(mode===frameMode)return;if(mode==='mukbang'){savedView={position:camera.position.clone(),target:controls.target.clone()};const head=cook.head.getWorldPosition(new T.Vector3()),target=head.clone().lerp(plateWorld,.28);updateMouth();cameraGoal={target,position:target.clone().addScaledVector(facing,1.55).add(new T.Vector3(.35,.5,0))};}else{cameraGoal=savedView||{position:new T.Vector3(.1,2.83,1.89),target:new T.Vector3(.08,.97,.04)};savedView=null;}frameMode=mode;}
 function update(dt){sync();const t=state.time,mode=cookingMode(state);if(state.panPose){pan.position.fromArray(state.panPose.position);pan.quaternion.fromArray(state.panPose.quaternion);}else{pan.position.set(BURNER.x,1.054,BURNER.z);pan.quaternion.identity();}handle.material.emissive.set(panHover?'#1f3029':'#000000');gasKnob.rotation.y=-state.gas*Math.PI*1.35;
  // Flames stop at the pan's underside (lowest point of the tilted base) and spread outward there.
  const panUp=new T.Vector3(0,1,0).applyQuaternion(pan.quaternion),overBurner=Math.hypot(pan.position.x-BURNER.x,pan.position.z-BURNER.z)<.62,ceiling=overBurner?pan.position.y-.0275*panUp.y-.45*Math.sqrt(Math.max(0,1-panUp.y*panUp.y))-.002:99;
  const flame=gasFlames.update(t,state.gas,state.lit,ceiling,dt);const flicker=1+Math.sin(t*19)*.04+Math.sin(t*31)*.03;fireLight.position.set(BURNER.x,Math.min(1.02+flame.height*.6,ceiling-.01),BURNER.z);fireLight.intensity=state.lit?(.6+flame.height*22+flame.ignite*5)*flicker:0;fireLight.color.set(flame.ignite>.2?'#b8b0ff':'#6aaeff');pilotGuide.visible=dragId==='prop'&&!state.lit&&!ignitionAccess(state,pointer).covered;pilotGuide.material.opacity=.45+Math.sin(t*5)*.22;
  const liquidView=pourView.update(dt,mode),liquidY=liquidView.level;pourView.setHover(hoverContainer);

  rim.scale.y=state.vessel==='pot'?2.5:1;rim.position.y=state.vessel==='pot'?.14:.055;lip.position.y=state.vessel==='pot'?.28:.112;handle.visible=true;
  // Bubbles scale with temperature: sparse simmer beads near 85°C, a rolling boil at 100°C, fine oil sizzle when frying.
  const simmer=state.water>.035?Math.max(0,Math.min(1,(state.temp-80)/18)):0,fry=state.oil>.02&&state.water<=.035?Math.max(0,Math.min(1,(state.temp-110)/90)):0,bubbleCount=Math.round(simmer*90+fry*55);
  bubbles.forEach((b,n)=>{b.visible=n<bubbleCount;if(!b.visible)return;const a=n*2.399,r=Math.sqrt((n+.5)/90)*.41,cycle=(t*(simmer?1.1+simmer*.6:3.2)+n*.13)%1;const p=new T.Vector3(Math.cos(a)*r,liquidY+cycle*.022*(simmer?1:.4),Math.sin(a)*r).applyQuaternion(pan.quaternion).add(pan.position);b.position.copy(p);b.scale.setScalar(.25+Math.sin(cycle*Math.PI)*(simmer?.6+simmer:.5));b.material.opacity=(1-cycle)*.45;});
  const steamy=state.temp>70&&(state.water>.035||state.items.some(i=>i.zone==='pan')),steamAmount=state.water>.035?Math.max(0,Math.min(1,(state.temp-70)/30)):Math.max(0,Math.min(.5,(state.temp-120)/160));
  steam.forEach((p,n)=>{p.visible=steamy;const age=(t*.36+n/28)%1;p.position.set(pan.position.x+Math.sin(n*8.4)*.25+Math.sin(t+n)*age*.13,pan.position.y+.056+liquidY+age*.85,pan.position.z+Math.cos(n*3.7)*.25);p.scale.setScalar(.4+age*2.3);p.material.opacity=Math.sin(age*Math.PI)*.09*steamAmount;});
  // Sizzle spatter from hot oil, and violent bursts when water meets hot oil.
  for(const e of sim.events)if(e.type==='spatter')spatterBurst=Math.min(1,spatterBurst+.5);spatterBurst=Math.max(0,spatterBurst-dt*.8);
  const spatterRate=(state.oil>.02&&state.temp>150&&state.water<=.035?(state.temp-150)/120*(state.items.some(i=>i.zone==='pan'&&i.panContact!==false)?1:.4):0)+spatterBurst*6;
  for(const p of spatter){const u=p.userData;u.age+=dt;if(u.age>.5&&Math.random()<spatterRate*dt*2){u.age=0;const a=Math.random()*Math.PI*2,r=Math.random()*.38;p.position.set(pan.position.x+Math.cos(a)*r,pan.position.y+liquidY+.004,pan.position.z+Math.sin(a)*r);u.v.set((Math.random()-.5)*.5,.5+Math.random()*.9,(Math.random()-.5)*.5);}p.visible=u.age<.5;if(p.visible){u.v.y-=9.81*dt;p.position.addScaledVector(u.v,dt);p.material.opacity=1-u.age/.5;}}
  for(const item of state.items){const m=food.get(item.id),f=FOODS[item.type],center=(item.a+item.b)/2;let y=BOARD.y+f.radius;
   if(item.pose){m.root.position.fromArray(item.pose.position);m.root.quaternion.fromArray(item.pose.quaternion);}else{m.root.position.set(item.x+center,item.zone==='pan'?1.09+f.radius:BOARD.y+f.radius,item.z);m.root.rotation.set(0,item.angle||0,0);}
   const left=1-(item.eaten||0);m.root.scale.set(Math.max(.12,left),Math.max(.4,Math.sqrt(left)),Math.max(.4,Math.sqrt(left)));
   if(m.parts&&item.links){const inverse=m.root.quaternion.clone().invert();m.parts.forEach((part,n)=>{const link=item.links[n];part.root.position.fromArray(link.position).sub(m.root.position).applyQuaternion(inverse);part.root.quaternion.fromArray(link.quaternion).premultiply(inverse);});}
   if(muk?.carryId===item.id)carryPosition(item,m.root.position);
   for(const skin of m.skins||[m.skin])skin.emissive.set(item.id===dragId?'#294735':item.id===hoverId?'#17291d':'#000000');
   for(const skin of m.skins||[m.skin])skin.color.copy(m.base).lerp(new T.Color('#b17638'),Math.min(.8,item.cook*.6)).lerp(new T.Color('#362920'),item.burn);
   const fish=state.fish.find(f=>f.id===item.fishId);if(m.robot){m.robot.head.rotation.z=Math.sin(t*3+item.id)*.06+(fish?.pain||0)/100*Math.sin(t*20)*.06;m.robot.jaw.rotation.x=fish?.speaking||fish?.screaming?Math.abs(Math.sin(t*18))*.4:0;for(const [side,arm]of Object.entries(m.robot.arms))arm.sh.rotation.z=(side==='L'?1:-1)*(.35+Math.sin(t*4+item.id)*.13+(fish?.pain||0)/200);}
   if(m.tail)m.tail.rotation.y=Math.sin(t*(fish?.pain>40?19:4)+item.id)*.28;
  }
  const strike=gestureEnvelope(t,knifeStrike,.25);knife.visible=dragId===null&&tool==='knife'&&frameMode!=='mukbang';knife.position.copy(pointer);knife.position.y=BOARD.y+.012+(.22*(1-strike));knife.rotation.set(0,cutYaw,-.06*(1-strike));guide.rotation.y=cutYaw;guide.visible=dragId===null&&tool==='knife'&&hoverId!==null&&frameMode!=='mukbang';guide.position.copy(pointer);guide.position.y=BOARD.y+.003;
  lighter.visible=true;if(state.lighterPose){lighter.position.fromArray(state.lighterPose.position);lighter.quaternion.fromArray(state.lighterPose.quaternion);}lighterFlame.update(t,down);
  for(let i=feedback.length-1;i>=0;i--){const p=feedback[i],age=t-p.born;if(age>.7){p.m.geometry.dispose();p.m.material.dispose();scene.remove(p.m);feedback.splice(i,1);continue;}p.m.position.addScaledVector(p.v,dt);p.v.y-=dt*2;p.m.material.opacity=1-age/.7;}
  animateCook(t,dt,strike);
  room.update(t,dt,{});
 }
 return {room,canvas:renderer.domElement,update,project,pick,pulse,food,pourView,frame,setChefTalk(v){chefTalk=Math.max(0,Math.min(1,v||0));},chefGesture(){gestureAt=state.time;gestureSide=-gestureSide;},setMukbang(p){muk=p;},setHoverContainer(k){hoverContainer=k||null;renderer.domElement.style.cursor=k&&tool==='hand'?'grab':renderer.domElement.style.cursor;},setSelectedContainer(k){pourView.setSelected(k||null);},get frameMode(){return frameMode;},setTool(v){tool=v;},setPointer(p){if(p)pointer.copy(p);},setDown(v){down=v;},setDrag(v){dragId=v;},setHover(hit){hoverId=hit?.id??null;panHover=!!hit?.panHandle;const m=food.get(hoverId);if(m){const model=m.parts?.[hit.linkIndex]||m;const rotation=model.root.getWorldQuaternion(new T.Quaternion());const axis=new T.Vector3(1,0,0).applyQuaternion(rotation);cutYaw=Math.atan2(-axis.z,axis.x);}else cutYaw=0;renderer.domElement.style.cursor=hit?.lighter||hit?.container?(dragId==='prop'?'grabbing':'grab'):hit?.knob?'ew-resize':tool==='hand'&&(hoverId!==null||panHover)?(dragId!==null?'grabbing':'grab'):tool==='knife'&&hoverId!==null?'crosshair':'default';},strike(){knifeStrike=state.time;},resetView(){cameraGoal=null;savedView=null;frameMode='cooking';camera.position.set(.1,2.83,1.89);controls.target.set(.08,.97,.04);controls.update();},get pointer(){return pointer;}};
}

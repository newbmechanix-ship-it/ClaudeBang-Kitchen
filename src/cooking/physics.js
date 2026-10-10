import * as C from 'cannon-es';
import {FOODS,BOARD,BURNER,cutFood} from './state.js';
import {radiusAt} from './profile.js';
const V=p=>Array.isArray(p)?new C.Vec3(...p):new C.Vec3(p.x,p.y,p.z);
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x)),mid=i=>(i.a+i.b)/2;
const HOME=new C.Vec3(BURNER.x,1.056,BURNER.z),PLATE=new C.Vec3(-.4,.918,-.51),X=new C.Vec3(1,0,0);
const cap=(v,max)=>{const n=v.length();if(n>max)v.scale(max/n,v);};
const validPose=p=>p?.position?.length===3&&p?.quaternion?.length===4&&[...p.position,...p.quaternion].every(Number.isFinite);
const snapshot=b=>({position:b.position.toArray(),quaternion:b.quaternion.toArray(),velocity:b.velocity.toArray(),angularVelocity:b.angularVelocity.toArray()});
export function createCookingPhysics(s){
 const world=new C.World({gravity:new C.Vec3(0,-9.81,0),allowSleep:true});
 world.broadphase=new C.SAPBroadphase(world);world.solver.iterations=24;world.solver.tolerance=1e-7;
 Object.assign(world.defaultContactMaterial,{friction:.42,restitution:.04,contactEquationStiffness:1e7,contactEquationRelaxation:4});
 const bodies=new Map(),rigs=new Map(),supported=new Map(),flights=new Map();
 let grab=null,panGrab=null,panAuto=null,panTarget=HOME.clone(),accumulator=0,lastVessel=null,panTilt=0;
 function fixed(shape,pos,kind){const b=new C.Body({mass:0,shape,position:V(pos)});b.kind=kind;world.addBody(b);return b;}
 fixed(new C.Box(new C.Vec3(1.675,.0425,.7)),[.02,.84,.11],'counter');
 fixed(new C.Box(new C.Vec3(BOARD.width/2,.044,BOARD.depth/2)),[BOARD.x,BOARD.y-.044,BOARD.z],'board');
 fixed(new C.Box(new C.Vec3(.55,.0375,.525)),[BURNER.x,.922,BURNER.z],'counter');
 fixed(new C.Cylinder(.32,.32,.055,20),[BURNER.x,.974,BURNER.z],'counter');
 for(let n=0;n<4;n++){const a=n*Math.PI/2,b=fixed(new C.Box(new C.Vec3(.15,.0175,.0225)),[BURNER.x+Math.cos(a)*.29,1.01,BURNER.z+Math.sin(a)*.29],'counter');b.quaternion.setFromEuler(0,-a,0);}
 fixed(new C.Cylinder(.35,.35,.035,24),[-.4,.9005,-.51],'plate');
 for(let n=0;n<28;n++){const a=n*Math.PI*2/28,b=fixed(new C.Box(new C.Vec3(.012,.03,.04)),[PLATE.x+Math.cos(a)*.34,PLATE.y+.014,PLATE.z+Math.sin(a)*.34],'plate');b.quaternion.setFromEuler(0,-a,0);}
 const floor=fixed(new C.Plane(),[0,.015,0],'floor');floor.quaternion.setFromEuler(-Math.PI/2,0,0);
 const pan=new C.Body({mass:3,position:HOME.clone(),linearDamping:.35,angularDamping:.8,allowSleep:true,sleepSpeedLimit:.06,sleepTimeLimit:.7});pan.kind='pan';world.addBody(pan);
 if(validPose(s.panPose)){pan.position.set(...s.panPose.position);pan.quaternion.set(...s.panPose.quaternion);}
 function vessel(){while(pan.shapes.length)pan.removeShape(pan.shapes[0]);pan.addShape(new C.Cylinder(.415,.415,.055,28));const h=s.vessel==='pot'?.29:.115;for(let n=0;n<24;n++){const a=n*Math.PI/12,q=new C.Quaternion();q.setFromAxisAngle(new C.Vec3(0,1,0),-a);pan.addShape(new C.Box(new C.Vec3(.020,h/2,.058)),new C.Vec3(Math.cos(a)*.435,h/2+.02,Math.sin(a)*.435),q);}pan.updateMassProperties();pan.updateBoundingRadius();pan.aabbNeedsUpdate=true;pan.wakeUp();lastVessel=s.vessel;}
 vessel();
 const lighterHome=new C.Vec3(-.17,1.08,.63),lighter=new C.Body({mass:.09,shape:new C.Box(new C.Vec3(.030,.095,.022)),position:lighterHome.clone(),linearDamping:.25,angularDamping:.65});lighter.kind='lighter';world.addBody(lighter);
 if(validPose(s.lighterPose)&&s.lighterPose.position[1]>=0&&s.lighterPose.position[1]<3&&Math.abs(s.lighterPose.position[0])<3&&Math.abs(s.lighterPose.position[2])<3&&Math.hypot(...s.lighterPose.quaternion)>.5){lighter.position.set(...s.lighterPose.position);lighter.quaternion.set(...s.lighterPose.quaternion);}
 let lighterTarget=null,lighterRotation=new C.Quaternion(),panRotation=null;
 function rotateHeld(yaw,pitch){
  if(!Number.isFinite(yaw)||!Number.isFinite(pitch))return;
  const b=lighterTarget?lighter:panGrab?pan:grab?.body;if(!b)return;
  let goal=lighterTarget?lighterRotation:panGrab?(panRotation??=pan.quaternion.clone()):(grab.rotation??=b.quaternion.clone());
  const delta=new C.Quaternion();delta.setFromEuler(clamp(pitch,-.3,.3),clamp(yaw,-.3,.3),0);delta.mult(goal,goal);goal.normalize();b.wakeUp();
 }
 function aimRotation(b,goal){const inverse=b.quaternion.conjugate(),delta=goal.mult(inverse);if(delta.w<0){delta.x*=-1;delta.y*=-1;delta.z*=-1;delta.w*=-1;}b.angularVelocity.set(delta.x*16,delta.y*16,delta.z*16);cap(b.angularVelocity,5);b.torque.setZero();}
 function guardLighter(){
  if(![...lighter.position.toArray(),...lighter.quaternion.toArray(),...lighter.velocity.toArray(),...lighter.angularVelocity.toArray()].every(Number.isFinite)||lighter.position.y<-.5||lighter.position.y>3.5||Math.abs(lighter.position.x)>4||Math.abs(lighter.position.z)>4||Math.hypot(...lighter.quaternion.toArray())<.5){resetLighter();return;}
  lighter.quaternion.normalize();cap(lighter.velocity,3);cap(lighter.angularVelocity,6);
  const x=lighter.position.x,z=lighter.position.z;let surface=.015;
  if(Math.abs(x-.02)<1.645&&Math.abs(z-.11)<.67)surface=.8825;
  if(Math.abs(x-BOARD.x)<BOARD.width/2-.03&&Math.abs(z-BOARD.z)<BOARD.depth/2-.03)surface=BOARD.y;
  const axes=[new C.Vec3(.030,0,0),new C.Vec3(0,.095,0),new C.Vec3(0,0,.022)],extent=axes.reduce((v,a)=>v+Math.abs(lighter.quaternion.vmult(a).y),0);
  if(lighter.position.y-extent<surface){lighter.position.y=surface+extent+.0001;lighter.velocity.y=Math.max(0,lighter.velocity.y);lighter.aabbNeedsUpdate=true;}
 }

 function beginLighterGrab(){endGrab();guardLighter();lighterRotation.copy(lighter.quaternion);lighter.fixedRotation=true;lighter.updateMassProperties();lighter.angularVelocity.setZero();lighterTarget=lighter.position.clone();lighterTarget.y=Math.max(1.02,lighterTarget.y+.14);lighter.wakeUp();return lighterTarget;}
 function moveLighter(p){if(lighterTarget)lighterTarget.set(clamp(p.x,-1.6,1.6),clamp(p.y,.92,2.1),clamp(p.z,-.6,.8));}
 function endLighterGrab(){lighterTarget=null;lighter.fixedRotation=false;lighter.updateMassProperties();lighter.angularVelocity.setZero();cap(lighter.velocity,1.3);cap(lighter.angularVelocity,4);}
 function resetLighter(){lighterTarget=null;lighter.fixedRotation=false;lighter.updateMassProperties();lighter.force.setZero();lighter.torque.setZero();lighter.position.copy(lighterHome);lighter.quaternion.set(0,0,0,1);lighter.velocity.setZero();lighter.angularVelocity.setZero();lighter.wakeUp();}
 function reference(r){const first=r.links[0];return first.body.pointToWorldFrame(new C.Vec3(mid(r.item)-mid(first),0,0));}
 function intervals(i){if(i.type!=='claude')return [{a:i.a,b:i.b}];const stops=[i.a,...[-.19,-.055,.08,.20].filter(x=>x>i.a+.012&&x<i.b-.012),i.b];return stops.slice(1).map((b,n)=>({a:stops[n],b}));}
 function create(i,sample){
  const f=FOODS[i.type],parts=intervals(i),q=new C.Quaternion();q.setFromEuler(0,i.angle||0,0);
  let pos=new C.Vec3(i.x+mid(i),BOARD.y+f.radius+.035,i.z);
  if(i.zone==='pan'){pos.x+=pan.position.x-HOME.x;pos.z+=pan.position.z-HOME.z;pos.y=pan.position.y+.15+f.radius+[...rigs.values()].filter(r=>r.item.zone==='pan').length*.035;}
  if(i.zone==='plate')pos.set(PLATE.x,PLATE.y+f.radius+.04,PLATE.z);
  if(validPose(i.pose)){pos=V(i.pose.position);q.set(...i.pose.quaternion);q.normalize();}
  const rig={item:i,links:[],joints:[]};
  for(let n=0;n<parts.length;n++){
   const part=parts[n],length=part.b-part.a;let radius=.008;for(let k=0;k<=8;k++)radius=Math.max(radius,radiusAt(i.type,part.a+length*k/8));
   const b=new C.Body({mass:length*Math.PI*f.radius*f.radius*80,linearDamping:.12,angularDamping:i.type==='claude'?.62:.48,allowSleep:true,sleepSpeedLimit:.06,sleepTimeLimit:.8});
   const turn=new C.Quaternion();turn.setFromEuler(0,0,-Math.PI/2);b.addShape(new C.Cylinder(radius,radius,length,12),new C.Vec3(),turn);b.foodId=i.id;b.kind='food';b.radius=radius;b.zone=i.zone;
   const saved=sample?sample(mid(part)):i.links?.find(l=>Math.abs(l.a-part.a)<1e-7&&Math.abs(l.b-part.b)<1e-7);
   if(validPose(saved)){b.position.set(...saved.position);b.quaternion.set(...saved.quaternion);b.quaternion.normalize();if(saved.velocity?.every(Number.isFinite))b.velocity.set(...saved.velocity);if(saved.angularVelocity?.every(Number.isFinite))b.angularVelocity.set(...saved.angularVelocity);}
   else{b.position.copy(pos.vadd(q.vmult(new C.Vec3(mid(part)-mid(i),0,0))));b.quaternion.copy(q);if(i.pose?.velocity)b.velocity.set(...i.pose.velocity);if(i.pose?.angularVelocity)b.angularVelocity.set(...i.pose.angularVelocity);}
   if(i.plated){b.type=C.Body.KINEMATIC;b.collisionResponse=false;b.velocity.setZero();b.angularVelocity.setZero();}const link={...part,body:b};rig.links.push(link);world.addBody(b);
   if(n){const previous=rig.links[n-1],joint=new C.ConeTwistConstraint(previous.body,b,{pivotA:new C.Vec3((previous.b-previous.a)/2,0,0),pivotB:new C.Vec3(-length/2,0,0),axisA:X,axisB:X,angle:.52,twistAngle:.22,maxForce:Math.max(150,b.mass*220),collideConnected:false});world.addConstraint(joint);rig.joints.push(joint);}
  }
  rigs.set(i.id,rig);bodies.set(i.id,rig.links[0].body);return rig;
 }
 function remove(id){const r=rigs.get(id);if(!r)return;if(grab?.id===id)endGrab();for(const c of r.joints)world.removeConstraint(c);for(const l of r.links)world.removeBody(l.body);rigs.delete(id);bodies.delete(id);supported.delete(id);flights.delete(id);}
 function sync(){const byId=new Map(s.items.map(i=>[i.id,i]));for(const [id,r]of rigs)if(byId.get(id)!==r.item)remove(id);for(const i of s.items)if(!rigs.has(i.id))create(i);if(lastVessel!==s.vessel)vessel();s.physics=true;}
 function publish(){
  const contacts=new Map(),edges=[];
  for(const c of world.contacts){const a=c.bi,b=c.bj;if(a.kind==='food'&&b.kind==='food'){if(a.foodId!==b.foodId)edges.push([a.foodId,b.foodId]);}else{const food=a.kind==='food'?a:b.kind==='food'?b:null,surface=food===a?b:a;if(food){let set=contacts.get(food.foodId);if(!set)contacts.set(food.foodId,set=new Set());set.add(surface.kind);}}}
  for(const [id,r]of rigs)if(r.links.every(l=>l.body.sleepState===C.Body.SLEEPING)&&!contacts.has(id)&&supported.has(id))contacts.set(id,new Set(supported.get(id)));
  const hot=new Set();for(const [id,set]of contacts)if(set.has('pan'))hot.add(id);for(let k=0;k<6;k++)for(const [a,b]of edges)if(hot.has(a)||hot.has(b)){hot.add(a);hot.add(b);}
  for(const [id,r]of rigs){const i=r.item,b=r.links[0].body,set=contacts.get(id)||new Set(),held=grab?.id===id;
   i.panContact=!held&&r.links.some(l=>{const b=l.body,p=pan.pointToLocalFrame(b.position),inside=Math.hypot(p.x,p.z)<.42,below=p.y<.04+(s.vessel==='pot'?.29:.115)+b.radius*.8,wet=s.water>.035&&inside&&p.y-b.radius<.035+s.water*.21&&p.y>0;return inside&&below&&(wet||(hot.has(id)&&Math.abs(b.velocity.y-pan.velocity.y)<.45));});
   let zone=held?'air':i.plated?'plate':i.panContact?'pan':set.has('board')?'board':set.has('plate')?'plate':set.has('counter')?'counter':set.has('floor')?'floor':'air';
   if(zone==='air'&&!held&&r.links.every(l=>l.body.sleepState===C.Body.SLEEPING))zone=b.zone;
   const p=reference(r);i.zone=zone;for(const l of r.links)l.body.zone=zone;i.x=p.x-mid(i);i.z=p.z;i.pose={...snapshot(b),position:p.toArray()};
   if(i.type==='claude')i.links=r.links.map(l=>({a:l.a,b:l.b,...snapshot(l.body)}));else delete i.links;
   const axis=b.quaternion.vmult(X);i.angle=Math.atan2(-axis.z,axis.x);if(set.size)supported.set(id,set);
  }s.panPose=snapshot(pan);s.lighterPose=snapshot(lighter);
 }
 function spring(b,local,target,mass,stiffness,damping){const anchor=b.pointToWorldFrame(local),r=anchor.vsub(b.position),vel=b.getVelocityAtWorldPoint(anchor,new C.Vec3()),force=target.vsub(anchor);force.scale(mass*stiffness,force);force.vsub(vel.scale(mass*damping),force);force.y+=mass*9.81;cap(force,mass*55);b.applyForce(force,r);b.wakeUp();}
 function step(dt){sync();accumulator+=clamp(Number.isFinite(dt)?dt:0,0,.25);let count=0;
  while(accumulator>=1/120&&count++<30){const h=1/120;
   if(panAuto){if(panAuto===1){panTarget.set(pan.position.x,1.52,pan.position.z);if(pan.position.y>1.47)panAuto=2;}else if(panAuto===2){panTarget.set(HOME.x,1.52,HOME.z);if(Math.hypot(pan.position.x-HOME.x,pan.position.z-HOME.z)<.035)panAuto=3;}else{panTarget.copy(HOME);if(pan.position.distanceTo(HOME)<.025&&pan.velocity.length()<.12)panAuto=null;}}
   if(panGrab||panAuto){spring(pan,new C.Vec3(),panTarget,pan.mass+1,150,25);const up=pan.quaternion.vmult(new C.Vec3(0,1,0)),hx=pan.quaternion.vmult(X),hn=Math.hypot(hx.x,hx.z)||1,a=panGrab?panTilt:0,goal=new C.Vec3(-Math.sin(a)*hx.x/hn,Math.cos(a),-Math.sin(a)*hx.z/hn),error=up.cross(goal);pan.torque.vadd(error.scale(28),pan.torque);pan.torque.vsub(pan.angularVelocity.scale(4),pan.torque);cap(pan.velocity,1.6);}
   if(grab){const r=rigs.get(grab.id),b=grab.body;if(r){const delta=V(grab.target).vsub(grab.filtered);cap(delta,2.7*h);grab.filtered.vadd(delta,grab.filtered);spring(b,grab.local,grab.filtered,r.links.reduce((m,l)=>m+l.body.mass,0),190,28);}}
   for(const r of rigs.values())for(let n=0;n<r.links.length;n++){const b=r.links[n].body;cap(b.velocity,6);cap(b.angularVelocity,14);if(n){const a=r.links[n-1].body,axisA=a.quaternion.vmult(X),axisB=b.quaternion.vmult(X),error=axisA.cross(axisB),torque=error.scale(Math.min(a.mass,b.mass)*.35);a.torque.vadd(torque,a.torque);b.torque.vsub(torque,b.torque);}}
   guardLighter();if(lighterTarget){spring(lighter,new C.Vec3(),lighterTarget,lighter.mass,210,29);lighter.quaternion.slerp(lighterRotation,1-Math.exp(-h*12),lighter.quaternion);lighter.angularVelocity.setZero();lighter.torque.setZero();lighter.aabbNeedsUpdate=true;cap(lighter.velocity,1.8);}
   if(grab?.rotation)aimRotation(grab.body,grab.rotation);if(panGrab&&panRotation)aimRotation(pan,panRotation);
   world.step(h);guardLighter();
   for(const [id,f]of flights){if(f.serving){f.time+=h;const r=rigs.get(id);if(!r){flights.delete(id);continue;}const ease=x=>{x=clamp(x,0,1);return x*x*(3-2*x);},t=f.time,up=ease(t/.35),across=ease((t-.35)/.65),down=ease((t-1)/.35),peak=Math.max(f.from.y,f.destination.y)+.48;const center=new C.Vec3(f.from.x+(f.destination.x-f.from.x)*across,f.from.y+(peak-f.from.y)*up+(f.destination.y-peak)*down,f.from.z+(f.destination.z-f.from.z)*across);for(let n=0;n<r.links.length;n++){const b=r.links[n].body,offset=new C.Vec3(mid(r.links[n])-mid(r.item),0,0);b.position.copy(center.vadd(offset));f.rotations[n].slerp(new C.Quaternion(),across,b.quaternion);b.velocity.setZero();b.angularVelocity.setZero();b.aabbNeedsUpdate=true;if(t>=1.35){r.item.plated=true;b.type=C.Body.KINEMATIC;b.collisionResponse=false;b.updateMassProperties();}}if(t>=1.35)flights.delete(id);continue;}f.wait-=h;if(f.wait<=0){const r=rigs.get(id);if(r){const b=r.links[0].body,p=reference(r),vy=b.velocity.y,t=(vy+Math.sqrt(Math.max(0,vy*vy+2*9.81*(p.y-f.destination.y))))/9.81,k=-Math.log(.88),factor=k/(1-Math.exp(-k*Math.max(.1,t)));for(const l of r.links){l.body.velocity.x=(f.destination.x-p.x)*factor;l.body.velocity.z=(f.destination.z-p.z)*factor;}}flights.delete(id);}}
   accumulator-=h;
  }
  for(const [id,r]of rigs)if(r.links.some(l=>![...l.body.position.toArray(),...l.body.quaternion.toArray()].every(Number.isFinite)||l.body.position.y<-3||Math.abs(l.body.position.x)>8||Math.abs(l.body.position.z)>8))recoverRig(r);
  if(pan.position.y<-2||Math.abs(pan.position.x)>4||Math.abs(pan.position.z)>4){pan.position.copy(HOME);pan.velocity.setZero();pan.angularVelocity.setZero();pan.quaternion.set(0,0,0,1);}
  guardLighter();
  publish();
 }
 function nearest(r,point,index){if(Number.isInteger(index)&&r.links[index])return r.links[index];let found=r.links[0],distance=Infinity;for(const l of r.links){const p=l.body.pointToLocalFrame(point),d=Math.hypot(Math.max(0,Math.abs(p.x)-(l.b-l.a)/2),p.y,p.z);if(d<distance){distance=d;found=l;}}return found;}
 function beginGrab(id,point,index){sync();const r=rigs.get(id);if(!r)return false;delete r.item.plated;for(const l of r.links){l.body.type=C.Body.DYNAMIC;l.body.collisionResponse=true;l.body.updateMassProperties();}endGrab();const p=V(point),b=nearest(r,p,index).body;grab={id,body:b,local:b.pointToLocalFrame(p),target:{x:p.x,y:p.y+.18,z:p.z},filtered:p.clone()};for(const l of r.links)l.body.wakeUp();supported.delete(id);return true;}
 function moveGrab(p){if(grab)grab.target={x:clamp(p.x,-2.5,2.5),y:clamp(p.y,.4,2.2),z:clamp(p.z,-1.5,1.7)};}
 function endGrab(){if(grab){const r=rigs.get(grab.id);if(r)for(const l of r.links){cap(l.body.velocity,2.8);cap(l.body.angularVelocity,8);l.body.wakeUp();}}grab=null;}
 function toss(id){sync();let n=0;for(const r of rigs.values())if((id===undefined||id===r.item.id)&&r.item.panContact){for(const l of r.links){const b=l.body,aim=pan.position.vsub(b.position);b.wakeUp();b.applyImpulse(new C.Vec3(aim.x*b.mass*.7,b.mass*(s.water>.035?1.3:2.0),aim.z*b.mass*.7),new C.Vec3(.025,0,.01));}r.item.panContact=false;r.item.side=1-r.item.side;n++;}return n;}
 function transfer(ids,zone){sync();let n=0;for(const id of ids){const r=rigs.get(id);if(!r)continue;delete r.item.plated;for(const l of r.links){l.body.type=C.Body.DYNAMIC;l.body.collisionResponse=true;l.body.updateMassProperties();}if(grab?.id===id)endGrab();const b=r.links[0].body,p=reference(r),destination=zone==='pan'?pan.position.clone():zone==='plate'?PLATE.clone():new C.Vec3(BOARD.x,BOARD.y,BOARD.z);const a=n*2.4,radius=zone==='pan'?.025:Math.min(.19,n*.025);destination.x+=Math.cos(a)*radius;destination.z+=Math.sin(a)*radius;if(zone==='plate'){destination.x=PLATE.x;destination.z=PLATE.z+([0,-.20,.20][n%3]);destination.y+=Math.floor(n/3)*.23+.025;}destination.y+=(zone==='pan'?.06:0)+FOODS[r.item.type].radius;const apex=Math.max(p.y,destination.y)+.62,vy=Math.sqrt(2*9.81*(apex-p.y));for(const l of r.links){l.body.velocity.set(0,vy,0);l.body.angularVelocity.set(.1,.1,.05);l.body.wakeUp();}if(zone==='plate'){for(const l of r.links){l.body.type=C.Body.KINEMATIC;l.body.collisionResponse=false;l.body.velocity.setZero();l.body.angularVelocity.setZero();}flights.set(id,{serving:true,time:0,from:p.clone(),destination,rotations:r.links.map(l=>l.body.quaternion.clone())});}else flights.set(id,{destination,wait:.22});supported.delete(id);n++;}return n;}
 function beginPanGrab(point){endGrab();panRotation=null;panAuto=null;const p=V(point);panGrab=p.vsub(pan.position);panTarget=pan.position.clone();panTarget.y+=.10;pan.wakeUp();return true;}
 function movePan(point){if(!panGrab)return;panTarget=V(point).vsub(panGrab);panTarget.x=clamp(panTarget.x,-1.12,1.30);panTarget.z=clamp(panTarget.z,-.25,.52);panTarget.y=clamp(panTarget.y,1.04,1.62);}
 function endPanGrab(){panRotation=null;panGrab=null;panTilt=0;cap(pan.velocity,.65);cap(pan.angularVelocity,1.2);pan.wakeUp();}
 function dockPan(){endGrab();panGrab=null;panAuto=1;pan.wakeUp();}
 function cut(id,point,index){sync();const r=rigs.get(id),i=r?.item;if(!r||i.zone!=='board'||grab?.id===id||r.links.some(l=>l.body.velocity.length()>.4||l.body.angularVelocity.length()>1.2))return null;
  const hit=nearest(r,V(point),index),local=hit.body.pointToLocalFrame(V(point)),coordinate=local.x+mid(hit),captured=r.links.map(l=>({...l,pose:snapshot(l.body)}));
  const sample=x=>{const l=captured.find(l=>x>=l.a-1e-7&&x<=l.b+1e-7)||captured[captured.length-1],offset=l.body.quaternion.vmult(new C.Vec3(x-mid(l),0,0)),position=l.body.position.vadd(offset),velocity=l.body.velocity.vadd(l.body.angularVelocity.cross(offset));return {...l.pose,position:position.toArray(),velocity:velocity.toArray()};};
  const parts=cutFood(s,id,i.x+coordinate);if(!parts)return null;remove(id);
  for(let n=0;n<parts.length;n++){const child=parts[n],next=create(child,sample);for(const l of next.links){const shift=l.body.quaternion.vmult(new C.Vec3(n?.0015:-.0015,0,0));l.body.position.vadd(shift,l.body.position);l.body.applyImpulse(l.body.quaternion.vmult(new C.Vec3((n?1:-1)*l.body.mass*.035,0,0)));}}
  publish();return parts;
 }
 function recoverRig(r){const y=1.65+(r.item.id%4)*.14;for(const l of r.links){const b=l.body;b.position.set(BOARD.x+mid(l)-mid(r.item),y,BOARD.z);b.velocity.setZero();b.angularVelocity.setZero();b.quaternion.set(0,0,0,1);b.wakeUp();}supported.delete(r.item.id);}
 function recover(){let count=0;for(const r of rigs.values())if(r.item.zone==='floor'||Math.abs(r.item.x)>1.8||Math.abs(r.item.z)>.95){recoverRig(r);count++;}return count;}
 function reset(){endGrab();resetLighter();for(const id of [...rigs.keys()])remove(id);for(const i of s.items){delete i.pose;delete i.links;delete i.panContact;}panGrab=null;panAuto=null;panTilt=0;pan.position.copy(HOME);pan.velocity.setZero();pan.angularVelocity.setZero();pan.quaternion.set(0,0,0,1);panTarget=HOME.clone();flights.clear();accumulator=0;s.panPose=null;}
 return {world,bodies,rigs,step,rotateHeld,beginLighterGrab,moveLighter,endLighterGrab,get lighter(){return lighter;},get lighterTip(){return lighter.pointToWorldFrame(new C.Vec3(0,.146,-.004));},beginGrab,moveGrab,endGrab,toss,transfer,beginPanGrab,movePan,endPanGrab,dockPan,cut,recover,reset,get grab(){return grab;},get pan(){return pan;},get panTilt(){return panTilt;},setPanTilt(v){panRotation=null;panTilt=clamp(Number(v)||0,0,1.2);if(panGrab)pan.wakeUp();},get panHeld(){return !!panGrab;},dispose(){reset();for(const b of [...world.bodies])world.removeBody(b);}};
}

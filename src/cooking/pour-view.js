import * as T from 'three';
import {createContainerFluid} from './container-fluid.js';
import {LIQUID} from './state.js';
import {MAX_PARTICLES,PAN_INNER,levelOf,rimHeight,spout} from './liquid.js';
// Rendering for containers, streams, splashes, ripples, worktop puddles and the pan's liquid surface.
// One InstancedMesh per liquid (no instanceColor), fixed pools, no per-frame allocation of meshes.
const LOOK={water:{color:'#b9e2ea',opacity:.55,rough:.04,surface:'#9fcbd0'},oil:{color:'#e2b33a',opacity:.86,rough:.12,surface:'#d9ad38'}};
export function createPourView(scene,pan,state,sim){
 const group=new T.Group();scene.add(group);
 const mats={},containers={};
 // --- Containers ---
 const glass=(color,opacity)=>new T.MeshPhysicalMaterial({color,transparent:true,opacity,roughness:.08,metalness:.05,clearcoat:1,side:T.DoubleSide,depthWrite:false});
 function container(kind){
  const outer=new T.Group(),root=new T.Group();outer.add(root);group.add(outer);const L=LIQUID[kind],parts=[];
  const add=(g,m,p=[0,0,0])=>{const o=new T.Mesh(g,m);o.position.set(...p);o.castShadow=true;o.userData.container=kind;root.add(o);parts.push(o);return o;};
  let fill;
  if(kind==='oil'){
   add(new T.CylinderGeometry(.066,.074,.30,28,1,true),glass('#9fb060',.42),[0,.15,0]);
   add(new T.CylinderGeometry(.074,.074,.006,28),glass('#9fb060',.6),[0,.003,0]);
   add(new T.CylinderGeometry(.024,.064,.07,24,1,true),glass('#9fb060',.45),[0,.335,0]);
   add(new T.CylinderGeometry(.022,.024,.03,20,1,true),glass('#9fb060',.5),[0,.385,0]);
   add(new T.TorusGeometry(.023,.004,6,20),new T.MeshStandardMaterial({color:'#c9b46a',metalness:.6,roughness:.3}),[0,.40,0]).rotation.x=Math.PI/2;
   add(new T.CylinderGeometry(.0745,.0745,.11,28,1,true,-.9,1.8),new T.MeshStandardMaterial({color:'#efe2b4',roughness:.8,side:T.DoubleSide}),[0,.15,0]);
   fill=add(new T.CylinderGeometry(.061,.068,1,24),new T.MeshPhysicalMaterial({color:'#d9a92c',transparent:true,opacity:.8,roughness:.1,clearcoat:1}),[0,.15,0]);
  }else{
   add(new T.CylinderGeometry(.088,.096,.235,28,1,true),glass('#cfeeee',.28),[0,.1175,0]);
   add(new T.CylinderGeometry(.096,.096,.006,28),glass('#cfeeee',.45),[0,.003,0]);
   add(new T.TorusGeometry(.088,.005,6,28),glass('#e3fbfb',.5),[0,.235,0]).rotation.x=Math.PI/2;
   const lip=add(new T.ConeGeometry(.03,.045,12,1,true),glass('#e3fbfb',.45),[.092,.232,0]);lip.rotation.z=-Math.PI/2;lip.scale.set(1,1,.6);
   const handle=add(new T.TorusGeometry(.06,.011,8,20,Math.PI),glass('#e3fbfb',.55),[-.095,.12,0]);handle.rotation.z=Math.PI/2;
   fill=add(new T.CylinderGeometry(.083,.09,1,24),new T.MeshPhysicalMaterial({color:'#a8d8e3',transparent:true,opacity:.45,roughness:.03,clearcoat:1}),[0,.11,0]);
  }
  const fluid=createContainerFluid(kind,fill.material);root.remove(fill);parts.splice(parts.indexOf(fill),1);fill.geometry.dispose();root.add(fluid.mesh);fluid.mesh.userData.container=kind;parts.push(fluid.mesh);
  containers[kind]={outer,root,parts,fluid,L};
 }
 container('oil');container('water');
 // --- Stream particles and splashes ---
 const sphere=new T.SphereGeometry(1,7,5),dummy=new T.Object3D(),UP=new T.Vector3(0,1,0),dir=new T.Vector3();
 const streams={};for(const kind of ['water','oil']){const m=new T.MeshPhysicalMaterial({color:LOOK[kind].color,transparent:true,opacity:LOOK[kind].opacity,roughness:LOOK[kind].rough,clearcoat:1,depthWrite:false});mats[kind]=m;const mesh=new T.InstancedMesh(sphere,m,MAX_PARTICLES+120);mesh.frustumCulled=false;mesh.count=0;group.add(mesh);streams[kind]=mesh;}
 // --- Ripples (pan surface) and puddles (worktop) ---
 const ripples=Array.from({length:18},()=>{const m=new T.Mesh(new T.RingGeometry(.8,1,32),new T.MeshBasicMaterial({color:'#ffffff',transparent:true,opacity:0,depthWrite:false,side:T.DoubleSide}));m.rotation.x=-Math.PI/2;m.visible=false;group.add(m);return m;});
 const puddles=Array.from({length:16},()=>{const m=new T.Mesh(new T.CircleGeometry(1,28),new T.MeshPhysicalMaterial({color:'#ffffff',transparent:true,opacity:.5,roughness:.05,clearcoat:1,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-2}));m.rotation.x=-Math.PI/2;m.visible=false;m.receiveShadow=true;group.add(m);return m;});
 // --- Pan liquid: displaced ring meshes for water and oil, held level in world space ---
 function surface(color,opacity){const g=new T.RingGeometry(.0005,PAN_INNER,48,8);const m=new T.Mesh(g,new T.MeshPhysicalMaterial({color,transparent:true,opacity,roughness:.05,metalness:.1,clearcoat:1,side:T.DoubleSide,depthWrite:false}));m.visible=false;pan.add(m);const base=Float32Array.from(g.attributes.position.array);return {m,g,base};}
 const water=surface(LOOK.water.surface,.6),oil=surface(LOOK.oil.surface,.7);
 const panInverse=new T.Quaternion(),slope=new T.Quaternion(),flat=new T.Quaternion().setFromAxisAngle(new T.Vector3(1,0,0),-Math.PI/2),local=new T.Vector3(),normal=new T.Vector3();
 let selected=null,hover=null;
 function displace(layer,amp,t,mode,coverage,offset){
  const p=layer.g.attributes.position,b=layer.base,inv=pan.matrixWorld.clone().invert();
  const rip=sim.ripples.map(r=>({p:local.set(r.x,r.y,r.z).applyMatrix4(inv).clone(),age:sim.time-r.born}));
  for(let n=0;n<p.count;n++){let x=b[n*3]*coverage+offset.x,y=b[n*3+1]*coverage+offset.y,h=0;
   for(const r of rip){const d=Math.hypot(x-r.p.x,y+r.p.z),front=d-r.age*.45;h+=Math.exp(-front*front*900)*.006*(1-r.age/.9);}
   if(mode==='boiling')h+=(Math.sin(x*41+t*9)*Math.sin(y*37-t*7))*.0035;else if(mode==='frying')h+=Math.sin(x*90+t*30)*Math.sin(y*80-t*24)*.0009;
   h+=Math.sin(x*14+t*3)*Math.sin(y*12-t*2.3)*amp;p.setXYZ(n,x,y,h);}
  p.needsUpdate=true;layer.g.computeVertexNormals();
 }
 function update(dt,mode){
  const t=sim.time;
  // Containers follow state; the fill level shows the remaining volume.
  for(const [kind,v] of Object.entries(containers)){const c=state.containers[kind];v.outer.position.fromArray(c.pos);v.outer.quaternion.setFromAxisAngle(UP,-c.yaw);v.root.rotation.set(0,0,-c.tilt);const f=Math.max(0,c.amount/v.L.capacity);v.fluid.update(f,c.tilt);
   const glow=kind===selected?'#2b4a3a':kind===hover?'#18291f':'#000000';for(const part of v.parts)part.material.emissive?.set(glow);}
  // Streams: droplets stretch along velocity so the dense emission reads as a continuous stream.
  for(const kind of ['water','oil']){const mesh=streams[kind];let n=0;
   for(const q of sim.particles){if(q.kind!==kind||n>=mesh.instanceMatrix.count)continue;const r=Math.cbrt(q.vol*1e-3*.2387)*(kind==='oil'?1.25:1),speed=Math.hypot(...q.v);dummy.position.fromArray(q.p);dir.set(q.v[0],q.v[1],q.v[2]).normalize();dummy.quaternion.setFromUnitVectors(UP,speed>1e-3?dir:UP);dummy.scale.set(r,r*(1+speed*(kind==='oil'?3.2:2.4)),r);dummy.updateMatrix();mesh.setMatrixAt(n++,dummy.matrix);}
   for(const q of sim.splashes){if(q.kind!==kind||n>=mesh.instanceMatrix.count)continue;const r=(kind==='oil'?.004:.0035)*(1-q.age/.6);dummy.position.fromArray(q.p);dummy.quaternion.identity();dummy.scale.setScalar(Math.max(.0005,r));dummy.updateMatrix();mesh.setMatrixAt(n++,dummy.matrix);}
   mesh.count=n;mesh.instanceMatrix.needsUpdate=true;}
  ripples.forEach((m,n)=>{const r=sim.ripples[n];m.visible=!!r;if(!r)return;const age=t-r.born;m.position.set(r.x,r.y+.002,r.z);m.scale.setScalar(.01+age*.16);m.material.opacity=(1-age/.9)*(r.kind==='water'?.45:.3);m.material.color.set(r.kind==='water'?'#eefcff':'#ffe9a0');});
  puddles.forEach((m,n)=>{const p=sim.puddles[n];m.visible=!!p;if(!p)return;m.position.set(p.x,p.y+.0015,p.z);const wobble=1+Math.sin(t*2+n)*.01;m.scale.set(p.radius*wobble,p.radius*(p.kind==='oil'?.85:.95),1);m.material.color.set(LOOK[p.kind].color);m.material.opacity=p.kind==='oil'?.72:.42;});
  // Pan liquid: world-level surface with slosh slope, oil film floating on water.
  pan.updateMatrixWorld();panInverse.copy(pan.quaternion).invert();const sl=sim.slosh;normal.set(-sl.x,1,-sl.z).normalize();slope.setFromUnitVectors(UP,normal);const level=levelOf(state),rim=rimHeight(state),wet=state.water>.002,oily=state.oil>.002;
  const orient=new T.Quaternion().copy(panInverse).multiply(slope).multiply(flat);
  water.m.visible=wet;if(wet){water.m.position.set(0,Math.min(rim,.035+state.water*.21),0);water.m.quaternion.copy(orient);displace(water,.0006+Math.hypot(sl.vx,sl.vz)*.002,t,mode,1,{x:0,y:0});water.m.material.opacity=.42+Math.min(.25,state.water*.4);water.m.material.color.set(mode==='boiling'?'#cfe6e2':LOOK.water.surface);}
  oil.m.visible=oily;if(oily){const coverage=wet?1:Math.min(1,.35+Math.sqrt(state.oil/.12)*.65),up=new T.Vector3(0,1,0).applyQuaternion(pan.quaternion),lean=new T.Vector3(up.x,0,up.z).applyQuaternion(panInverse).multiplyScalar(PAN_INNER*(1-coverage)*4);lean.clampLength(0,PAN_INNER*(1-coverage));
   oil.m.position.set(0,Math.min(rim,level)+.001,0);oil.m.quaternion.copy(orient);displace(oil,.0003,t,mode,coverage,{x:lean.x,y:-lean.z});oil.m.material.opacity=wet?.32:.55+Math.min(.3,state.oil);oil.m.material.color.set(state.temp>150?'#e8b440':LOOK.oil.surface);}
  return {level:Math.min(rim,level)};
 }
 return {group,update,containers,meshes:()=>Object.values(containers).flatMap(v=>v.parts),setSelected(k){selected=k;},setHover(k){hover=k;},spout:kind=>spout(state.containers[kind])};
}

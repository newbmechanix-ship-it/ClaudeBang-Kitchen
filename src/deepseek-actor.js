import * as T from 'three';

// A whale-inspired research android on the arena's shared compact joint rig.
export function createDeepSeekActor(scene){
 const root=new T.Group();root.name='DeepSeek';root.scale.setScalar(.38);scene.add(root);
 const blue=new T.MeshStandardMaterial({color:'#225ee8',metalness:.45,roughness:.3}),white=new T.MeshStandardMaterial({color:'#dceeff',metalness:.55,roughness:.28}),dark=new T.MeshStandardMaterial({color:'#101d38',metalness:.6,roughness:.4}),silver=new T.MeshStandardMaterial({color:'#729db9',metalness:.8,roughness:.25}),glow=new T.MeshStandardMaterial({color:'#97edff',emissive:'#40bfff',emissiveIntensity:1.9,roughness:.28});
 const box=new T.BoxGeometry(1,1,1),ball=new T.SphereGeometry(1,20,14),cyl=new T.CylinderGeometry(1,1,1,16);
 const pivot=(parent,p,name)=>{const g=new T.Group();g.position.set(...p);g.name=name||'';parent.add(g);return g;};
 const add=(parent,geometry,material,p,s,rz=0)=>{const m=new T.Mesh(geometry,material);m.position.set(...p);m.scale.set(...s);m.rotation.z=rz;m.castShadow=m.receiveShadow=true;parent.add(m);return m;};
 const fin=(parent,p,s,rz=0)=>{const shape=new T.Shape();shape.moveTo(0,0);shape.quadraticCurveTo(.5,.1,.68,.8);shape.quadraticCurveTo(.2,.63,-.12,.15);shape.closePath();const g=new T.ExtrudeGeometry(shape,{depth:.1,bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:.035,bevelThickness:.025,curveSegments:10});return add(parent,g,blue,p,s,rz);};
 const torso=pivot(root,[0,2.12,0],'torso'),head=pivot(torso,[0,1.05,.05],'head'),jaw=pivot(head,[0,-.16,.29],'jaw');
 add(torso,ball,blue,[0,0,0],[.57,.59,.37]);add(torso,ball,white,[0,-.07,.23],[.43,.43,.18]);add(torso,box,dark,[0,-.45,0],[.71,.18,.48]);
 add(torso,cyl,silver,[0,.67,0],[.13,.32,.13]);
 // Glowing whale badge: body, eye and two flukes, all geometry (no external textures).
 const badge=pivot(torso,[0,.12,.405],'whale-emblem');add(badge,ball,blue,[-.025,0,0],[.17,.085,.025]);add(badge,ball,glow,[-.105,.023,.026],[.017,.017,.009]);
 add(badge,ball,blue,[.16,.059,0],[.095,.031,.024],.65);add(badge,ball,blue,[.17,-.029,0],[.09,.03,.024],-.5);
 for(let i=0;i<3;i++)add(torso,box,silver,[0,-.18-i*.065,.393],[.33-i*.045,.016,.023]);
 // Smooth blue whale brow over a white lower face and continuous dark visor.
 add(head,ball,blue,[0,.18,0],[.51,.46,.43]);add(head,ball,white,[0,-.015,.11],[.445,.25,.37]);
 add(head,ball,dark,[0,.18,.343],[.431,.151,.113]);
 for(const sign of [-1,1]){
  add(head,box,glow,[sign*.19,.185,.449],[.18,.042,.024],-sign*.075);
  const ear=add(head,cyl,silver,[sign*.485,.13,-.015],[.115,.13,.115]);ear.rotation.z=Math.PI/2;
  fin(head,[sign*.45,.18,-.06],[sign*.24,.32,.6],-sign*.35);
 }
 add(jaw,ball,white,[0,0,0],[.3,.105,.15]);add(jaw,box,dark,[0,.035,.13],[.32,.016,.016]);
 // Paired blowhole ports and a small rear dorsal keel make the silhouette distinct.
 for(const sign of [-1,1])add(head,ball,dark,[sign*.09,.607,-.055],[.05,.018,.065]);
 // Woven straw hat, attached to the head so it follows speech and ragdoll motion.
 const straw=new T.MeshStandardMaterial({color:'#d8b465',roughness:.95,metalness:0}),weave=new T.MeshStandardMaterial({color:'#aa7b37',roughness:1});
 const hat=pivot(head,[0,.5,0],'straw-hat');
 add(hat,new T.ConeGeometry(.81,.48,48,1,true),straw,[0,.24,0],[1,1,1]);
 add(hat,new T.CylinderGeometry(.94,.94,.035,64),straw,[0,0,0],[1,1,1]);
 for(let i=0;i<5;i++){const radius=.8-i*.145;const ring=add(hat,new T.TorusGeometry(radius,.009,4,64),weave,[0,i*.086+.005,0],[1,1,1]);ring.rotation.x=Math.PI/2;}
 for(let i=0;i<24;i++){const a=i*Math.PI/12;const rib=new T.Line(new T.BufferGeometry().setFromPoints([new T.Vector3(Math.cos(a)*.91,.027,Math.sin(a)*.91),new T.Vector3(Math.cos(a)*.04,.46,Math.sin(a)*.04)]),new T.LineBasicMaterial({color:'#b78c48'}));hat.add(rib);}
 const dorsal=fin(torso,[0,.04,-.38],[.65,.64,.9]);dorsal.rotation.y=Math.PI/2;
 const arms={},legs={},nodes={head,torso,jaw,neck:torso,body:root};
 for(const [side,sign]of [['L',-1],['R',1]]){
  const sh=pivot(torso,[sign*.73,.34,0],'sh'+side),el=pivot(sh,[0,-.65,0],'el'+side),fa=pivot(el,[0,0,0],'fa'+side),hand=pivot(fa,[0,-.65,0],'hand'+side);
  add(sh,ball,dark,[0,0,0],[.21,.21,.21]);add(sh,ball,blue,[sign*.045,.025,0],[.285,.22,.265]);add(sh,cyl,silver,[0,-.35,0],[.105,.55,.105]);add(sh,box,white,[0,-.32,.07],[.25,.39,.22]);
  add(el,ball,dark,[0,0,0],[.16,.16,.16]);add(fa,ball,white,[0,-.29,0],[.19,.32,.185]);add(fa,box,blue,[0,-.3,.153],[.25,.38,.065]);add(fa,box,glow,[0,-.28,.19],[.035,.23,.016]);
  fin(fa,[sign*.13,-.42,-.015],[sign*.3,.48,.65],sign*.12);
  add(hand,box,dark,[0,-.035,0],[.26,.24,.21]);for(let n=0;n<3;n++)add(hand,box,white,[(n-1)*.075,-.075,.11],[.055,.19,.06]);
  const hip=pivot(root,[sign*.34,1.6,0],'hip'+side),knee=pivot(hip,[0,-.7,0],'knee'+side),foot=pivot(knee,[0,-.68,.1],'foot'+side);
  add(hip,ball,dark,[0,0,0],[.18,.18,.18]);add(hip,cyl,silver,[0,-.34,0],[.115,.57,.115]);add(hip,ball,white,[0,-.32,.02],[.19,.31,.19]);
  add(knee,ball,dark,[0,0,0],[.175,.175,.175]);add(knee,ball,blue,[0,-.025,.13],[.19,.165,.11]);add(knee,box,white,[0,-.36,.01],[.29,.51,.28]);add(knee,box,blue,[0,-.35,.161],[.2,.37,.05]);add(knee,box,glow,[0,-.35,.19],[.035,.22,.016]);
  add(foot,box,dark,[0,-.03,.13],[.39,.16,.59]);add(foot,ball,blue,[0,.025,.18],[.205,.13,.34]);
  arms[side]={sh,el,fa,hand};legs[side]={hip,knee,foot};Object.assign(nodes,{['sh'+side]:sh,['el'+side]:el,['fa'+side]:fa,['hand'+side]:hand,['hip'+side]:hip,['knee'+side]:knee,['foot'+side]:foot});
 }
 return {root,torso,head,jaw,arms,legs,nodes,rigKind:'compact',robotId:'deepseek',baseY:0,update(t,dt,speaking){head.rotation.z=Math.sin(t*1.3)*.023;jaw.rotation.x=speaking?Math.abs(Math.sin(t*14))*.28:0;glow.emissiveIntensity=1.7+Math.sin(t*2)*.2;}};
}

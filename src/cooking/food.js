import * as T from 'three';
import {FOODS} from './state.js';
import {createBot} from '../bot.js';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import {radiusAt,surfaceRadius,axialU,carrotGroove,zucchiniStripe,tomatoLobe,pastaRidge,noise1,hash2,PASTA_INNER} from './profile.js';
export {radiusAt,surfaceRadius} from './profile.js';
const TAU=Math.PI*2,mix=(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t],rgb=hex=>{const c=new T.Color(hex);return [c.r,c.g,c.b];},clamp01=v=>Math.max(0,Math.min(1,v)),smooth=(a,b,v)=>{const t=clamp01((v-a)/(b-a));return t*t*(3-2*t);};
const C={carrotSkin:rgb('#e0761f'),carrotDark:rgb('#9c4a14'),carrotLight:rgb('#f39a3c'),carrotCore:rgb('#f8b85a'),carrotPhloem:rgb('#ee7d22'),carrotCrown:rgb('#7f7a2a'),
 zDark:rgb('#1f3d1b'),zLight:rgb('#6d8f4c'),zFleck:rgb('#a7bb7a'),zFlesh:rgb('#ebebb6'),zSeedZone:rgb('#d8dc9a'),zRim:rgb('#2c4f25'),zBlossom:rgb('#c2b15a'),
 tRed:rgb('#c42a1c'),tDeep:rgb('#8e1b12'),tShoulder:rgb('#d8642a'),tWall:rgb('#e2412b'),tGel:rgb('#e8a050'),tCore:rgb('#f2a07a'),
 pasta:rgb('#e9c27a'),pastaDark:rgb('#c99a4e'),pastaInner:rgb('#d6ac62')};
// Lateral surface: rings along the true material interval [a,b], wrapped around theta (no seam duplicate).
function lateral(a,b,center,nx,nt,rFn,colFn,inward=false){
 const pos=[],col=[],idx=[];
 for(let i=0;i<=nx;i++){const x=a+(b-a)*i/nx;for(let j=0;j<nt;j++){const th=j/nt*TAU,r=rFn(x,th);pos.push(x-center,r*Math.sin(th),r*Math.cos(th));col.push(...colFn(x,th));}}
 for(let i=0;i<nx;i++)for(let j=0;j<nt;j++){const k=(j+1)%nt,p=i*nt+j,q=(i+1)*nt+j,r=i*nt+k,s=(i+1)*nt+k;if(inward)idx.push(p,r,q,q,r,s);else idx.push(p,q,r,q,s,r);}
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setAttribute('color',new T.Float32BufferAttribute(col,3));g.setIndex(idx);g.computeVertexNormals();return g;
}
// Cut/end face exactly at material coordinate x, its rim sampled from the same surface function as the skin.
function capGeometry(x,center,dir,rFn,colFn,nt,rings=6,rho0=0){
 const pos=[],col=[],nor=[],idx=[],solid=rho0<=0,first=solid?1:0;
 if(solid){pos.push(x-center,0,0);col.push(...colFn(0,0));nor.push(dir,0,0);}
 for(let k=first;k<=rings;k++){const rho=rho0+(1-rho0)*k/rings;for(let j=0;j<nt;j++){const th=j/nt*TAU,R=rFn(x,th)*rho;pos.push(x-center,R*Math.sin(th),R*Math.cos(th));col.push(...colFn(rho,th));nor.push(dir,0,0);}}
 const ring=k=>(solid?1:0)+(k-first)*nt;
 if(solid)for(let j=0;j<nt;j++)idx.push(0,ring(1)+j,ring(1)+(j+1)%nt);
 for(let k=first;k<rings;k++)for(let j=0;j<nt;j++){const n=(j+1)%nt,p=ring(k)+j,q=ring(k+1)+j,r=ring(k)+n,s=ring(k+1)+n;idx.push(p,q,r,q,s,r);}
 // Orient every triangle toward +/-X.
 for(let t=0;t<idx.length;t+=3){const [i0,i1,i2]=[idx[t]*3,idx[t+1]*3,idx[t+2]*3],ay=pos[i1+1]-pos[i0+1],az=pos[i1+2]-pos[i0+2],by=pos[i2+1]-pos[i0+1],bz=pos[i2+2]-pos[i0+2];if((ay*bz-az*by)*dir<0){const tmp=idx[t+1];idx[t+1]=idx[t+2];idx[t+2]=tmp;}}
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setAttribute('normal',new T.Float32BufferAttribute(nor,3));g.setAttribute('color',new T.Float32BufferAttribute(col,3));g.setIndex(idx);return g;
}
function skinColor(type,x,th){const u=axialU(type,x);
 if(type==='carrot'){const g=carrotGroove(u,th),n=noise1(th*2.3+u*31);let c=mix(C.carrotSkin,C.carrotLight,n*.45);c=mix(c,C.carrotDark,g*.75);if(u<.06)c=mix(C.carrotCrown,c,smooth(.0,.06,u));if(u>.9)c=mix(c,C.carrotDark,(u-.9)*3);return c;}
 if(type==='zucchini'){const fleck=hash2(Math.floor(u*150),Math.floor(th*9))>.86?.8:0;let c=mix(C.zDark,C.zLight,zucchiniStripe(u,th)*.75+noise1(u*40+th*3)*.15);c=mix(c,C.zFleck,fleck*.6);if(u>.97)c=mix(c,C.zBlossom,(u-.97)/.03);if(u<.04)c=mix(C.zLight,c,u/.04);return c;}
 if(type==='tomato'){const l=tomatoLobe(u,th);let c=mix(C.tRed,C.tDeep,clamp01(-l)*.55);c=mix(C.tShoulder,c,smooth(0,.22,u));return mix(c,C.tShoulder,noise1(th*5+u*13)*.12);}
 if(type==='pasta'){return mix(C.pasta,C.pastaDark,pastaRidge(th)*.6+noise1(x*80+th)*.1);}
 return [1,1,1];
}
function fleshColor(type,rho,th,natural){
 if(natural)return null;
 if(type==='carrot'){const core=smooth(.52,.38,rho);let c=mix(C.carrotPhloem,C.carrotCore,core);const ray=Math.pow(Math.abs(Math.cos(th*6)),12)*smooth(.15,.4,rho)*smooth(.6,.45,rho);c=mix(c,C.carrotCore,ray*.4);return rho>.96?C.carrotSkin:c;}
 if(type==='zucchini'){if(rho>.95)return C.zRim;const seed=smooth(.5,.38,rho);return mix(C.zFlesh,C.zSeedZone,seed);}
 if(type==='tomato'){if(rho>.83)return C.tWall;if(rho<.24)return C.tCore;const sector=TAU/4,d=Math.abs(((th%sector)+sector)%sector-sector/2);const septum=smooth(.13,.06,Math.abs(d-sector/2)*rho);return mix(C.tGel,C.tWall,Math.max(septum,smooth(.7,.83,rho)));}
 return C.pasta;
}
function seedsGeometry(type,x,center,dir,item){
 const parts=[],out=dir*.0016;
 if(type==='tomato'){for(let s=0;s<4;s++)for(let k=0;k<4;k++){const th=(s+.5)*TAU/4+(k-1.5)*.17+(hash2(item.id,s*7+k)-.5)*.06,rho=.42+.16*hash2(s,k+3),R=radiusAt(type,x)*rho,g=new T.SphereGeometry(1,6,4);g.scale(.0014,.0062,.0042).rotateX(-th).translate(x-center+out,R*Math.sin(th),R*Math.cos(th));parts.push(g);}}
 if(type==='zucchini'){for(let s=0;s<3;s++)for(let k=0;k<3;k++){const th=s*TAU/3+(k-1)*.32,rho=.26+.05*k%2,R=radiusAt(type,x)*rho,g=new T.SphereGeometry(1,6,4);g.scale(.0012,.0075,.0035).rotateX(-th).translate(x-center+out,R*Math.sin(th),R*Math.cos(th));parts.push(g);}}
 if(!parts.length)return null;const m=mergeGeometries(parts);parts.forEach(g=>g.dispose());return m;
}
function ribbon(points){/* points:[{c:Vector3,side:Vector3,w}] */const pos=[],idx=[];points.forEach((p,k)=>{pos.push(p.c.x+p.side.x*p.w,p.c.y+p.side.y*p.w,p.c.z+p.side.z*p.w,p.c.x-p.side.x*p.w,p.c.y-p.side.y*p.w,p.c.z-p.side.z*p.w);if(k){const a=(k-1)*2;idx.push(a,a+1,a+2,a+1,a+3,a+2);}});const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();return g;}
function surfacePoint(type,x,th,center,lift){const r=surfaceRadius(type,x,th)+lift;return new T.Vector3(x-center,r*Math.sin(th),r*Math.cos(th));}
function accessories(item,center,root){
 const f=FOODS[item.type],L=f.length/2,naturalA=item.a<=-L+1e-6,naturalB=item.b>=L-1e-6,add=(geoms,material)=>{if(!geoms.length)return;const g=mergeGeometries(geoms);geoms.forEach(q=>q.dispose());const m=new T.Mesh(g,material);root.add(m);return m;};
 if(item.type==='carrot'&&naturalA){const stems=[],leaves=[],base=item.a-center;
  for(let k=0;k<9;k++){const az=k*2.4+hash2(item.id,k)*.5,el=.35+hash2(k,item.id)*.55,len=.07+hash2(k,9)*.07,dir=new T.Vector3(-Math.cos(el),Math.sin(el)*Math.abs(Math.cos(az))*1.1+.15,Math.sin(el)*Math.sin(az)).normalize(),q=new T.Quaternion().setFromUnitVectors(new T.Vector3(0,1,0),dir);
   const g=new T.CylinderGeometry(.0013,.0032,len,5,1).translate(0,len/2,0).applyQuaternion(q).translate(base+.006,Math.sin(az)*.008,Math.cos(az)*.008);stems.push(g);
   for(let n=0;n<4;n++){const t=.45+n*.17,leaf=new T.SphereGeometry(1,5,3).scale(.011,.0018,.0055).rotateY(n*1.3+k).translate(0,len*t,0).applyQuaternion(q).translate(base+.006,Math.sin(az)*.008,Math.cos(az)*.008);leaves.push(leaf);}}
  add(stems,new T.MeshStandardMaterial({color:'#5f8a32',roughness:.7}));add(leaves,new T.MeshStandardMaterial({color:'#4f8a2a',roughness:.65,side:T.DoubleSide}));}
 if(item.type==='zucchini'){if(naturalA){const g=new T.CylinderGeometry(.012,.019,.05,6,2).rotateZ(Math.PI/2).translate(item.a-center-.016,.002,0);add([g],new T.MeshStandardMaterial({color:'#8d9a5c',roughness:.85,flatShading:true}));}
  if(naturalB){const g=new T.SphereGeometry(.011,8,6).scale(.5,1,1).translate(item.b-center-.001,0,0);add([g],new T.MeshStandardMaterial({color:'#6d5a2c',roughness:.9}));}}
 if(item.type==='tomato'&&naturalA){const sepals=[];for(let k=0;k<5;k++){const th0=k*TAU/5+hash2(item.id,k)*.3,pts=[];for(let n=0;n<=7;n++){const t=n/7,u=.004+t*.1,x=-L+u*f.length,th=th0+Math.sin(t*3)*.08,c=surfacePoint('tomato',x,th,center,.0025),side=new T.Vector3(0,Math.cos(th),-Math.sin(th));pts.push({c,side,w:.012*Math.sin(Math.min(1,t*1.4+.12)*Math.PI)*(1-t*.5)+.0008});}sepals.push(ribbon(pts));}
  add(sepals,new T.MeshStandardMaterial({color:'#3f6e25',roughness:.7,side:T.DoubleSide}));
  add([new T.CylinderGeometry(.0045,.006,.03,6).rotateZ(Math.PI/2).translate(item.a-center-.008,0,0)],new T.MeshStandardMaterial({color:'#567a30',roughness:.8}));}
}
function createProduceMesh(item){
 const f=FOODS[item.type],type=item.type,root=new T.Group(),center=(item.a+item.b)/2,frac=(item.b-item.a)/f.length;
 const skin=new (type==='tomato'?T.MeshPhysicalMaterial:T.MeshStandardMaterial)({color:'#ffffff',vertexColors:true,roughness:type==='tomato'?.32:type==='zucchini'?.42:type==='pasta'?.78:.66,...(type==='tomato'?{clearcoat:.6,clearcoatRoughness:.25}:{})});
 const flesh=new T.MeshPhysicalMaterial({color:'#ffffff',vertexColors:true,roughness:type==='tomato'?.18:.5,clearcoat:type==='tomato'?1:.35,clearcoatRoughness:.2,side:T.DoubleSide});
 const nt=type==='pasta'?56:type==='zucchini'?40:type==='tomato'?40:28,nx=Math.max(4,Math.round((type==='carrot'?96:type==='tomato'?26:type==='pasta'?6:40)*Math.max(.12,frac)));
 const rFn=(x,th)=>surfaceRadius(type,x,th);
 root.add(new T.Mesh(lateral(item.a,item.b,center,nx,nt,rFn,(x,th)=>skinColor(type,x,th)),skin));
 if(type==='pasta'){const inner=(x,th)=>radiusAt(type,x)*PASTA_INNER;root.add(new T.Mesh(lateral(item.a,item.b,center,nx,24,inner,(x,th)=>C.pastaInner,true),skin));}
 for(const [x,dir,natural] of [[item.a,-1,item.a<=-f.length/2+1e-6],[item.b,1,item.b>=f.length/2-1e-6]]){
  let geometry,material;
  if(type==='pasta'){geometry=capGeometry(x,center,dir,rFn,()=>C.pasta,nt,1,PASTA_INNER);material=skin;}
  else if(natural){geometry=capGeometry(x,center,dir,rFn,(rho,th)=>skinColor(type,x,th),nt,1);material=skin;}
  else{geometry=capGeometry(x,center,dir,rFn,(rho,th)=>fleshColor(type,rho,th,false),nt,type==='tomato'?14:9);material=flesh;}
  const cap=new T.Mesh(geometry,material);cap.userData.cutFace=natural?null:(dir<0?'a':'b');cap.userData.capX=x;root.add(cap);
  if(!natural&&type!=='pasta'){const seeds=seedsGeometry(type,x,center,dir,item);if(seeds)root.add(new T.Mesh(seeds,new T.MeshPhysicalMaterial({color:type==='tomato'?'#f1dc8a':'#f4f0c8',roughness:.3,clearcoat:.8})));}
 }
 accessories(item,center,root);
 root.traverse(n=>{if(n.isMesh){n.castShadow=n.receiveShadow=true;n.userData.foodId=item.id;}});root.userData.foodId=item.id;
 return {root,skin,skins:[skin,flesh],base:new T.Color('#ffffff'),robot:null,tail:null};
}
function createSingleFoodMesh(item){
 if(item.type!=='claude')return createProduceMesh(item);
 const f=FOODS[item.type],root=new T.Group(),skin=new T.MeshStandardMaterial({color:item.type==='claude'?'#a1bcb4':f.skin,roughness:.56,metalness:item.type==='claude'?.45:0}),flesh=new T.MeshStandardMaterial({color:f.inside,roughness:.74}),center=(item.a+item.b)/2;
 const points=[];for(let n=0;n<=20;n++){const x=item.a+(item.b-item.a)*n/20;points.push(new T.Vector2(radiusAt(item.type,x),x-center));}
 const body=new T.Mesh(new T.LatheGeometry(points,32).rotateZ(-Math.PI/2),skin);root.add(body);if(item.type==='claude'){body.scale.set(1,.94,.68);skin.metalness=.62;skin.roughness=.35;const pos=body.geometry.attributes.position,colors=[];for(let n=0;n<pos.count;n++){const u=T.MathUtils.clamp((pos.getY(n)/f.radius+1)/2,0,1),c=new T.Color('#dbe5ce').lerp(new T.Color('#78998f'),u);colors.push(c.r,c.g,c.b);}body.geometry.setAttribute('color',new T.Float32BufferAttribute(colors,3));skin.vertexColors=true;}
 for(const x of [item.a,item.b]){if((x===item.a&&item.internalLeft)||(x===item.b&&item.internalRight))continue;const cap=new T.Mesh(new T.CircleGeometry(radiusAt(item.type,x),32).rotateY(x===item.a?-Math.PI/2:Math.PI/2),flesh);cap.position.x=x-center;root.add(cap);
  const ring=new T.Mesh(new T.RingGeometry(radiusAt(item.type,x)*.86,radiusAt(item.type,x),32).rotateY(x===item.a?-Math.PI/2:Math.PI/2),skin);ring.position.x=x-center+(x===item.a?-.0004:.0004);root.add(ring);if(item.type==='claude'){cap.scale.set(1,.94,.68);ring.scale.set(1,.94,.68);}
 }
 let robot=null,tail=null;
 if(item.type==='claude'){
  if(item.head){robot=createBot(c=>new T.MeshStandardMaterial({color:c,metalness:.8,roughness:.29}),{free:true,eyeScale:0});const torso=robot.nodes.torso;root.add(torso);torso.position.set(-f.length/2-center+.10,.015,0);torso.scale.setScalar(.12);
   // Prone swimmer basis: spine/headward = -X, chest = -Y, shoulders = Z.
   torso.quaternion.setFromRotationMatrix(new T.Matrix4().makeBasis(new T.Vector3(0,0,1),new T.Vector3(-1,0,0),new T.Vector3(0,-1,0)));
   // The neck looks straight ahead along the fish, rather than up at the ceiling.
   robot.head.rotation.set(-Math.PI/2,0,0);robot.head.userData.fishForward=true;
   for(const [side,arm]of Object.entries(robot.arms)){arm.sh.rotation.set(.12,0,side==='L'?-.14:.14);arm.fa.rotation.x=-.12;arm.sh.scale.setScalar(.72);}robot.head.traverse(n=>{if(n.isPointLight)n.visible=false;});
  }
  const finMaterial=new T.MeshStandardMaterial({color:'#65938d',metalness:.38,roughness:.48,side:T.DoubleSide,transparent:true,opacity:.94});
  function fin(parent,vertices){const shape=new T.Shape();vertices.forEach(([x,y],i)=>i?shape.lineTo(x,y):shape.moveTo(x,y));shape.closePath();const m=new T.Mesh(new T.ExtrudeGeometry(shape,{depth:.004,bevelEnabled:false,steps:1}),finMaterial);m.position.z=-.002;parent.add(m);return m;}
  if(item.b>=f.length/2-.001){tail=new T.Group();tail.position.x=item.b-center;root.add(tail);fin(tail,[[0,.013],[.145,.112],[.118,.036],[.074,0],[.118,-.036],[.145,-.112],[0,-.013]]);for(const sign of [-1,1])for(let n=0;n<5;n++){const end=new T.Vector3(.09+n*.012,sign*(.025+n*.02),.0025),rib=new T.Line(new T.BufferGeometry().setFromPoints([new T.Vector3(.006,0,.0025),end]),new T.LineBasicMaterial({color:'#3d6966',transparent:true,opacity:.6}));tail.add(rib);}}
  // A low swept dorsal fin follows the back, with no upright human silhouette.
  const dorsalStart=Math.max(-.12,item.a),dorsalEnd=Math.min(.12,item.b);if(dorsalEnd>dorsalStart){const ridge=x=>x<-.02?.085+(x+.12)/.10*.083:.168-(x+.02)/.14*.103,vertices=[[dorsalStart-center,radiusAt('claude',dorsalStart)*.8],[dorsalStart-center,ridge(dorsalStart)]];if(dorsalStart<-.02&&dorsalEnd>-.02)vertices.push([-.02-center,.168]);vertices.push([dorsalEnd-center,ridge(dorsalEnd)],[dorsalEnd-center,radiusAt('claude',dorsalEnd)*.8]);fin(root,vertices);}

  // Tiny tangential scales merged into one draw call, not a grid of bulky armor plates.
  const scales=[];for(let x=-f.length/2+.023;x<item.b-.008;x+=.027){if(x<item.a+.008)continue;for(let n=0;n<8;n++){const a=n*Math.PI/4+(Math.round(x/.027)%2)*.39,r=radiusAt('claude',x),g=new T.SphereGeometry(1,7,4);g.scale(Math.min(.016,r*.3),.0008,Math.min(.010,r*.25)).rotateX(Math.PI/2-a).translate(x-center,Math.sin(a)*r*.94,Math.cos(a)*r*.68);scales.push(g);}}
  if(scales.length){const merged=mergeGeometries(scales);scales.forEach(g=>g.dispose());root.add(new T.Mesh(merged,new T.MeshStandardMaterial({color:'#779990',metalness:.4,roughness:.6})));}
 }
 root.traverse(n=>{if(n.isMesh){n.castShadow=n.receiveShadow=true;n.userData.foodId=item.id;}});root.userData.foodId=item.id;
 return {root,skin,base:new T.Color(item.type==='claude'?'#a1bcb4':f.skin),robot,tail};
}
export function createFoodMesh(item){
 if(item.type!=='claude'||!item.links?.length)return createSingleFoodMesh(item);
 const root=new T.Group(),parts=[],skins=[];let robot=null,tail=null;
 item.links.forEach((link,n)=>{
  const model=createSingleFoodMesh({...item,a:link.a,b:link.b,head:!!item.head&&n===0,internalLeft:n>0,internalRight:n<item.links.length-1});
  model.root.traverse(o=>{if(o.isMesh)o.userData.linkIndex=n;});
  if(n<item.links.length-1){const material=model.skin.clone();material.vertexColors=false;const joint=new T.Mesh(new T.SphereGeometry(radiusAt('claude',link.b),16,10),material);joint.scale.set(.7,.94,.68);joint.position.x=(link.b-link.a)/2;joint.castShadow=joint.receiveShadow=true;joint.userData={foodId:item.id,linkIndex:n};model.root.add(joint);skins.push(material);}
  root.add(model.root);parts.push(model);skins.push(model.skin);robot ||= model.robot;tail ||= model.tail;
 });
 return {root,parts,skins,skin:parts[0].skin,base:parts[0].base,robot,tail};
}
export function disposeFood(model){model.root.traverse(o=>{o.geometry?.dispose();if(o.material){for(const m of Array.isArray(o.material)?o.material:[o.material])m.dispose();}});model.root.removeFromParent();}

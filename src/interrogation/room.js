import * as T from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {createBot} from '../bot.js';
const S=.38,ROOM={x0:-2.5,x1:2.5,z0:-2,z1:2,h:3};

export function createInterrogationRoom(container,{dilemma=false,title=null}={}){
 const scene=new T.Scene();scene.background=new T.Color('#121a1f');scene.fog=new T.Fog('#233138',4,12);
 const renderer=new T.WebGLRenderer({antialias:true,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setSize(innerWidth,innerHeight);renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.08;renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;container.appendChild(renderer.domElement);
 const camera=new T.PerspectiveCamera(53,innerWidth/innerHeight,.05,30);camera.position.set(-1.85,1.62,1.6);
 const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.enablePan=false;controls.target.set(0,1.0,-.55);controls.minDistance=1.0;controls.maxDistance=4;controls.maxPolarAngle=Math.PI*.65;
 const grad=new T.DataTexture(new Uint8Array([65,125,185,245]),4,1,T.RedFormat);grad.minFilter=grad.magFilter=T.NearestFilter;grad.needsUpdate=true;
 const materials=new Map(),toon=color=>{if(!materials.has(color))materials.set(color,new T.MeshToonMaterial({color,gradientMap:grad}));return materials.get(color);};
 const furniture=new T.Group();scene.add(furniture);let furnishing=false;
 function mesh(geo,color,pos,scale,parent=scene,rot){if(furnishing&&parent===scene)parent=furniture;const m=new T.Mesh(geo,typeof color==='string'?toon(color):color);m.position.set(...pos);m.scale.set(...scale);if(rot)m.rotation.set(...rot);m.castShadow=m.receiveShadow=true;parent.add(m);return m;}
 const box=new T.BoxGeometry(1,1,1),cyl=new T.CylinderGeometry(1,1,1,20);
 const block=(color,pos,scale,parent=scene,rot)=>mesh(box,color,pos,scale,parent,rot);
 // The same 5 × 4 metre shell, metal door and two-tone institutional walls as Cell 7.
 block('#586560',[0,-.06,0],[5.2,.12,4.2]);
 for(const [pos,size] of [[[0,1.5,-2.07],[5.2,3,.14]],[[-2.57,1.5,0],[.14,3,4.2]],[[2.57,1.5,0],[.14,3,4.2]],[[0,1.5,2.07],[5.2,3,.14]]].filter(([p])=>!dilemma||p[0]!==2.57))block('#737d77',pos,size);
 for(const [pos,size] of [[[0,.45,-1.985],[5,.9,.02]],[[-2.485,.45,0],[.02,.9,4]],[[2.485,.45,0],[.02,.9,4]],[[0,.45,1.985],[5,.9,.02]]].filter(([p])=>!dilemma||p[0]!==2.485))block('#374846',pos,size);
 if(dilemma){for(const [z,length]of [[-1.24,1.66],[1.52,1.1]]){block('#737d77',[2.57,1.5,z],[.14,3,length]);block('#374846',[2.485,.45,z],[.02,.9,length]);}block('#737d77',[2.57,2.64,.28],[.14,.72,1.38]);}
 // Concrete seams, scuffed floor, vents and perimeter conduit.
 for(let x=-2.5;x<=2.5;x+=.5)block('#4a5752',[x,.005,0],[.008,.005,4]);
 for(let z=-2;z<=2;z+=.5)block('#4a5752',[0,.005,z],[5,.005,.008]);
 for(let i=0;i<25;i++){const x=Math.sin(i*43.7)*2.3,z=Math.cos(i*17.3)*1.8;block('#505e57',[x,.01,z],[.15+i%3*.04,.005,.008],scene,[0,i*.71,0]);}
 for(const x of[-2.45,2.45])mesh(cyl,'#242e30',[x,2.8,0],[.025,4,.025],scene,[Math.PI/2,0,0]);
 block('#212c2f',[1.1,2.48,-1.98],[.65,.25,.06]);for(let i=0;i<8;i++)block('#66726d',[.83+i*.076,2.48,-1.938],[.014,.2,.013]);
 // Observation glass, recessed frame and subtle fluorescent reflections.
 block('#1c282d',[-.72,1.78,-1.97],[2.05,1.05,.09]);
 block(new T.MeshStandardMaterial({color:'#183743',metalness:.8,roughness:.2}),[-.72,1.78,-1.91],[1.9,.9,.018]);
 for(const y of[1.45,2.08])block(new T.MeshBasicMaterial({color:'#6e9397',transparent:true,opacity:.22}),[-.75,y,-1.895],[1.62,.012,.003]);
 const door=new T.Group();door.position.set(2.465,0,.3);scene.add(door);
 block('#5d696e',[0,1.06,0],[.05,2.12,.92],door);for(const z of[-.51,.51])block('#202a2e',[-.005,1.09,z],[.08,2.2,.07],door);block('#202a2e',[-.005,2.2,0],[.08,.08,1.06],door);block('#101a1d',[-.04,1.67,0],[.02,.2,.3],door);block('#acb6b2',[-.065,1.04,-.3],[.08,.04,.13],door);for(let i=0;i<4;i++)block('#737f81',[-.055,1.67,-.1+i*.068],[.01,.2,.012],door);
 furnishing=true;
 // Steel interrogation table, bolted chair, recorder and paper dossier.
 block('#89948d',[0,.73,.36],[1.48,.085,1.1]);block('#34413e',[0,.678,.36],[1.35,.04,1]);
 for(const x of[-.62,.62])for(const z of[-.08,.8])block('#394744',[x,.34,z],[.04,.68,.04]);
 block('#586561',[0,.46,-.66],[.58,.06,.6]);block('#42534e',[0,.76,-.95],[.57,.65,.055]);
 for(const x of[-.25,.25])for(const z of[-.9,-.42])block('#2b3936',[x,.23,z],[.034,.46,.034]);
 block('#c5c3ac',[.4,.78,.45],[.3,.012,.24],scene,[0,.13,0]);block('#263432',[.32,.79,.6],[.17,.02,.23],scene,[0,.13,0]);
 block('#1d292c',[-.45,.79,.52],[.2,.055,.13]);const recorderLed=mesh(new T.SphereGeometry(1,8,6),new T.MeshBasicMaterial({color:'#be7153'}),[-.51,.823,.52],[.007,.004,.007]);
 furnishing=false;furniture.visible=!dilemma;
 // Wall intercom: grille, status light and cable to the ceiling.
 const speaker=new T.Group();speaker.position.set(1.46,1.8,-1.9);scene.add(speaker);block('#233237',[0,0,0],[.42,.5,.09],speaker);block('#121e23',[0,.02,.052],[.32,.34,.008],speaker);
 for(let i=0;i<12;i++)block('#66746e',[0,-.12+i*.027,.06],[.29,.007,.009],speaker);
 const speakerLed=mesh(new T.SphereGeometry(1,12,8),new T.MeshBasicMaterial({color:'#314d43'}),[.12,-.2,.06],[.015,.015,.005],speaker);block('#263c39',[1.46,2.46,-1.94],[.015,.8,.012]);
 block('#273337',[-2.22,2.65,-1.69],[.17,.15,.32],scene,[-.25,-.4,0]);mesh(cyl,'#1a2228',[-2.16,2.6,-1.47],[.04,.07,.04],scene,[Math.PI/2,0,0]);
 function label(text,w,h,pos){const cv=document.createElement('canvas');cv.width=768;cv.height=192;const c=cv.getContext('2d');c.fillStyle='#273431';c.fillRect(0,0,768,192);c.fillStyle='#adbfb1';c.font='28px Consolas';c.textAlign='center';c.fillText(text,384,110);const texture=new T.CanvasTexture(cv);texture.colorSpace=T.SRGBColorSpace;const m=mesh(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({map:texture}),pos,[1,1,1]);return m;}
 label(title||(dilemma?'ROOM 08 / THE CONDITION':'INTERVIEW ROOM 07'),1.3,.3,[.2,2.5,-1.97]);
 const bot=createBot(toon,{free:true,eyeScale:.035,pose:(t)=>{
  const n=bot.nodes;n.hipL.rotation.x=n.hipR.rotation.x=-Math.PI/2;n.kneeL.rotation.x=n.kneeR.rotation.x=Math.PI/2;
  n.shL.rotation.x=n.shR.rotation.x=-.6;n.faL.rotation.x=n.faR.rotation.x=-1.04;
  n.shL.rotation.z=.05;n.shR.rotation.z=-.05;n.torso.rotation.x=-.025;
  n.head.rotation.y+=Math.sin(t*.29)*.035;
 }});bot.root.scale.setScalar(S);bot.root.position.set(0,.005,-.66);scene.add(bot.root);bot.root.visible=!dilemma;

 scene.add(new T.AmbientLight('#c9d9d1',1.15));const overhead=new T.RectAreaLight('#e6ece3',6,2.2,.65);overhead.position.set(0,2.85,-.1);overhead.rotation.x=-Math.PI/2;scene.add(overhead);
 block('#283737',[0,2.91,-.1],[2.3,.07,.73]);block(new T.MeshBasicMaterial({color:'#e2e9da'}),[0,2.866,-.1],[2.13,.015,.57]);
 const key=new T.SpotLight('#e1ebdc',21,8,1.05,.7,1.6);key.position.set(-.3,2.8,.15);key.target.position.set(0,.5,-.4);key.castShadow=true;key.shadow.mapSize.set(1024,1024);key.shadow.bias=-.0003;scene.add(key,key.target);
 const fill=new T.PointLight('#7a9db9',2.5,5,2);fill.position.set(-1.9,1.9,-1.2);scene.add(fill);
 let close=false;const home={position:new T.Vector3(-1.85,1.62,1.6),target:new T.Vector3(0,1,-.55)};
 function toggleView(){close=!close;camera.position.copy(close?new T.Vector3(-.9,1.47,.95):home.position);controls.target.copy(close?new T.Vector3(0,1.25,-.66):home.target);controls.update();return close;}
 function update(time,dt,{speaking=false,question=false,level=0,playing=false}={}){
  bot.update(time,dt,speaking);if(speaking)bot.jaw.rotation.x=Math.min(.42,level*.9+Math.abs(Math.sin(time*12))*.07);
  speakerLed.material.color.set(question?'#b5efd0':'#314d43');recorderLed.material.color.set(playing?'#b8dcbb':'#be7153');
  controls.update();camera.position.x=T.MathUtils.clamp(camera.position.x,ROOM.x0+.15,ROOM.x1-.15);camera.position.y=T.MathUtils.clamp(camera.position.y,.3,ROOM.h-.15);camera.position.z=T.MathUtils.clamp(camera.position.z,ROOM.z0+.15,ROOM.z1-.15);renderer.render(scene,camera);
 }
 function resize(){camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);}
 addEventListener('resize',resize);
 return {scene,renderer,bot,camera,controls,door,furniture,update,toggleView};
}

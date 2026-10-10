import * as T from 'three';
// Procedural gas flames: per-port jets made of three crossed soft billboards with a bright base,
// a translucent blue inner cone and a noisy, fading tip. Jets are clipped to a world-space ceiling
// (the pan bottom) where they spread outward instead of piercing the metal. No textures, no solid cones.
const NOISE=`float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}`;
export const PORTS=30,PORT_RADIUS=.287;
/** Visual flame height (m) for a gas fraction; also used by tests and the light. */
export function flameHeight(gas,ignite=0){return gas<=0?0:(.022+gas*.115)*(1+ignite*1.4);}
export function createGasFlames(){
 const group=new T.Group(),planes=3,count=PORTS*planes,geometry=new T.PlaneGeometry(.034,1,1,12);geometry.translate(0,.5,0);
 geometry.setAttribute('aSeed',new T.InstancedBufferAttribute(Float32Array.from({length:count},(_,n)=>Math.floor(n/planes)*1.73+.37),1));
 const uniforms={uTime:{value:0},uGas:{value:0},uIgnite:{value:0},uH:{value:0},uCeil:{value:99},uCenter:{value:new T.Vector3()}};
 const material=new T.ShaderMaterial({transparent:true,depthWrite:false,side:T.DoubleSide,blending:T.AdditiveBlending,uniforms,
  vertexShader:`attribute float aSeed;uniform float uTime,uGas,uIgnite,uH,uCeil;uniform vec3 uCenter;varying vec2 vUv;varying float vSeed;varying float vSquash;
  void main(){vUv=uv;vSeed=aSeed;vec3 p=position;float flick=1.0+sin(uTime*23.0+aSeed*3.1)*.07+sin(uTime*37.0+aSeed*1.7)*.05;float h=uH*flick;
   p.x*=(1.0+uIgnite*.9)*(.75+.5*uv.y);p.y*=h;p.x+=sin(uTime*14.0+aSeed+uv.y*6.0)*.004*uv.y*uv.y;
   vec4 world=modelMatrix*instanceMatrix*vec4(p,1.0);float over=world.y-uCeil;vSquash=0.0;
   if(over>0.0){vec2 r=world.xz-uCenter.xz;float len=max(length(r),1e-4);world.xz+=r/len*over*.85;world.y=uCeil-min(over,.01)*.15;vSquash=clamp(over/max(h,1e-3),0.0,1.0);}
   gl_Position=projectionMatrix*viewMatrix*world;}`,
  fragmentShader:`uniform float uTime,uGas,uIgnite;varying vec2 vUv;varying float vSeed;varying float vSquash;${NOISE}
  void main(){float y=vUv.y;float n=noise(vec2(vUv.x*4.0+vSeed,y*6.0-uTime*7.5));float n2=noise(vec2(vUv.x*9.0-vSeed,y*11.0-uTime*13.0));
   float x=abs(vUv.x-.5)*2.0+(n-.5)*.28*y;float env=clamp(pow(max(y,0.0),.32)*pow(max(1.0-y,0.0),.6)*1.85,0.0,1.0);
   float outer=1.0-smoothstep(env*.45,env+.001,x);float coreLen=.38+uGas*.14;float coreW=env*.42*(1.0-smoothstep(coreLen*.55,coreLen,y));
   float core=1.0-smoothstep(coreW*.35,coreW+.001,x);float base=(1.0-smoothstep(0.0,.11,y))*(1.0-smoothstep(0.0,.55,x));float tip=smoothstep(.5,1.0,y);
   vec3 col=vec3(.05,.16,.92)*(.55+.45*n);col=mix(col,vec3(.38,.72,1.0),core*.85);col+=vec3(.7,.88,1.0)*base*.9;col+=vec3(.22,.04,.38)*tip*.35;col+=uIgnite*vec3(.95,.55,.18)*(1.0-core*.5);col*=1.0+vSquash*.25;
   float a=max(outer*(.42+.3*n2)*(1.0-tip*.75),core*.95);a=max(a,base*.9);a*=1.0-vSquash*.3;if(a<.01)discard;gl_FragColor=vec4(col,a*(.75+uGas*.35));}`});
 const jets=new T.InstancedMesh(geometry,material,count),dummy=new T.Object3D();
 for(let n=0;n<count;n++){const port=Math.floor(n/planes),angle=port*Math.PI*2/PORTS;dummy.position.set(Math.cos(angle)*PORT_RADIUS,0,Math.sin(angle)*PORT_RADIUS);
  // Each jet leans ~20° outward from the burner crown; the three billboards are crossed about the jet axis.
  dummy.quaternion.setFromAxisAngle(new T.Vector3(-Math.sin(angle),0,Math.cos(angle)),-.35).multiply(new T.Quaternion().setFromAxisAngle(new T.Vector3(0,1,0),-angle+(n%planes)*Math.PI/planes));
  dummy.updateMatrix();jets.setMatrixAt(n,dummy.matrix);}
 jets.frustumCulled=false;group.add(jets);
 // Bright port bases: tiny additive beads, one per port.
 const beadMat=new T.MeshBasicMaterial({color:'#a8d8ff',transparent:true,opacity:.0,depthWrite:false,blending:T.AdditiveBlending}),beads=new T.InstancedMesh(new T.SphereGeometry(.0065,6,4),beadMat,PORTS);
 for(let n=0;n<PORTS;n++){const a=n*Math.PI*2/PORTS;dummy.position.set(Math.cos(a)*PORT_RADIUS,.002,Math.sin(a)*PORT_RADIUS);dummy.quaternion.identity();dummy.scale.set(1,.6,1);dummy.updateMatrix();beads.setMatrixAt(n,dummy.matrix);}group.add(beads);
 const glow=new T.Mesh(new T.TorusGeometry(PORT_RADIUS,.006,8,64),new T.MeshBasicMaterial({color:'#2a6bff',transparent:true,opacity:0,depthWrite:false,blending:T.AdditiveBlending}));glow.rotation.x=Math.PI/2;group.add(glow);
 let previous=false,ignited=-99,smoothGas=0;
 return {group,get ignite(){return uniforms.uIgnite.value;},
  update(time,gas,lit,ceiling=99,dt=1/60){if(lit&&!previous)ignited=time;previous=lit;group.visible=lit;smoothGas+=(gas-smoothGas)*Math.min(1,dt*6);
   const ig=Math.max(0,1-(time-ignited)*2.2);group.updateMatrixWorld();uniforms.uTime.value=time;uniforms.uGas.value=smoothGas;uniforms.uIgnite.value=ig;uniforms.uH.value=flameHeight(smoothGas,ig);uniforms.uCeil.value=ceiling;uniforms.uCenter.value.setFromMatrixPosition(group.matrixWorld);
   beadMat.opacity=lit?.55+smoothGas*.35:0;glow.material.opacity=lit?.10+smoothGas*.18+Math.sin(time*21)*.02:0;return {height:uniforms.uH.value,ignite:ig};}};
}
/** Lighter flame: a soft yellow teardrop with a blue base, flickering; never an opaque cone. */
export function createLighterFlame(){
 const group=new T.Group(),uniforms={uTime:{value:0},uOn:{value:0}},g=new T.PlaneGeometry(.032,.075,1,8);g.translate(0,.0375,0);
 const material=new T.ShaderMaterial({transparent:true,depthWrite:false,side:T.DoubleSide,blending:T.AdditiveBlending,uniforms,
  vertexShader:`uniform float uTime;varying vec2 vUv;void main(){vUv=uv;vec3 p=position;p.x+=sin(uTime*17.0+uv.y*4.0)*.003*uv.y*uv.y;p.y*=1.0+sin(uTime*29.0)*.06;gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.0);}`,
  fragmentShader:`uniform float uTime,uOn;varying vec2 vUv;${NOISE}void main(){float y=vUv.y;float n=noise(vec2(vUv.x*5.0,y*7.0-uTime*9.0));float x=abs(vUv.x-.5)*2.0+(n-.5)*.2*y;float env=clamp(pow(max(y,0.0),.45)*pow(max(1.0-y,0.0),.7)*2.1,0.0,1.0);
   float body=1.0-smoothstep(env*.35,env+.001,x);float core=1.0-smoothstep(env*.1,env*.45+.001,x);float blue=(1.0-smoothstep(.05,.24,y));
   vec3 col=mix(vec3(1.0,.52,.12),vec3(1.0,.88,.55),core);col=mix(col,vec3(.25,.45,1.0),blue*.8);float a=body*(.55+.35*n)*(1.0-smoothstep(.7,1.0,y)*.6)*uOn;if(a<.01)discard;gl_FragColor=vec4(col,a);}`});
 for(let n=0;n<2;n++){const m=new T.Mesh(g,material);m.rotation.y=n*Math.PI/2;group.add(m);}
 const light=new T.PointLight('#ffb35a',0,.9,2);light.position.y=.03;group.add(light);
 return {group,update(time,on){uniforms.uTime.value=time;uniforms.uOn.value=on?1:0;group.visible=on;light.intensity=on?.35+Math.sin(time*31)*.05:0;}};
}

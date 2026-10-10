// Lightweight, bounded liquid simulation: finite container volumes, ballistic droplet streams,
// pan/pot hit detection, worktop spills, slosh and tip-over spill. Not CFD; volumes are conserved exactly.
import {LIQUID,BURNER,BOARD} from './state.js';
export const PAN_INNER=.42,PAN_HOME=[BURNER.x,1.056,BURNER.z],MAX_PARTICLES=240,MAX_PUDDLES=16,MAX_RIPPLES=18;
const G=9.81,clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export const rimHeight=s=>s.vessel==='pot'?.28:.112;
/** Liquid surface height above the pan origin (pan-local Y). */
export const levelOf=s=>.035+Math.max(0,s.water)*.21+Math.max(0,s.oil)*.012;
export function rotate(q,v){const [x,y,z,w]=q,[vx,vy,vz]=v,ix=w*vx+y*vz-z*vy,iy=w*vy+z*vx-x*vz,iz=w*vz+x*vy-y*vx,iw=-x*vx-y*vy-z*vz;return [ix*w+iw*-x+iy*-z-iz*-y,iy*w+iw*-y+iz*-x-ix*-z,iz*w+iw*-z+ix*-y-iy*-x];}
export const invRotate=(q,v)=>rotate([-q[0],-q[1],-q[2],q[3]],v);
export function groundHeight(x,z){
 if(Math.abs(x-BOARD.x)<BOARD.width/2&&Math.abs(z-BOARD.z)<BOARD.depth/2)return .966;
 if(Math.abs(x-BURNER.x)<.55&&Math.abs(z-BURNER.z)<.525)return .96;
 if(x>-1.655&&x<1.695&&z>-.59&&z<.81)return .8825;
 return .015;
}
export function panPose(s){const p=s.panPose;return {position:p?.position||PAN_HOME,quaternion:p?.quaternion||[0,0,0,1],velocity:p?.velocity||[0,0,0]};}
/** Tilt (radians) at which the liquid surface reaches the spout; fuller containers pour sooner. */
export function pourThreshold(c){const L=LIQUID[c.kind],f=clamp(c.amount/L.capacity,0,1);return L.minTilt+(L.maxTilt-L.minTilt)*(1-f);}
/** Volumetric flow (L/s) out of the spout for the current tilt. Zero below threshold or when empty. */
export function flowRate(c){if(!(c.amount>1e-6))return 0;const excess=c.tilt-pourThreshold(c);if(excess<=0)return 0;const L=LIQUID[c.kind];return L.rate*Math.pow(Math.min(1,excess/.55),1.4)*(.45+.55*Math.sqrt(c.amount/L.capacity));}
/** World spout position and initial stream velocity. Containers tip toward their yaw direction. */
export function spout(c){
 const L=LIQUID[c.kind],d=[Math.cos(c.yaw),0,Math.sin(c.yaw)],st=Math.sin(c.tilt),ct=Math.cos(c.tilt),axis=[d[0]*st,ct,d[2]*st],out=[d[0]*ct,-st,d[2]*ct],[side,h]=L.spout;
 const pos=[c.pos[0]+axis[0]*h+out[0]*side,c.pos[1]+axis[1]*h+out[1]*side,c.pos[2]+axis[2]*h+out[2]*side];
 const excess=clamp((c.tilt-pourThreshold(c))/.55,0,1),speed=L.speed*(.45+.55*excess),horizontal=speed*(.45+.55*Math.min(1,Math.abs(st)));
 return {pos,axis,velocity:[d[0]*horizontal,-.18*speed,d[2]*horizontal]};
}
export function createLiquidSim(){return {time:0,particles:[],ripples:[],puddles:[],splashes:[],events:[],pending:{oil:0,water:0,panoil:0,panwater:0},rimEmit:null,slosh:{x:0,z:0,vx:0,vz:0},lastVel:null,panSpill:0};}
export function resetLiquidSim(sim){Object.assign(sim,createLiquidSim());}
/** Liquid currently in flight or queued for emission (litres). */
export function airborne(sim,kind){return sim.pending[kind]+sim.pending['pan'+kind]+sim.particles.reduce((n,p)=>n+(p.kind===kind?p.vol:0),0);}
export function panLitres(s,kind){return Math.max(0,s[kind])*LIQUID[kind].unit;}
/** Total accounted litres for a kind; constant except for refills (supplied) and boiling (evaporated). */
export function liquidLedger(s,sim,kind){return s.containers[kind].amount+panLitres(s,kind)+s.spilled[kind]+airborne(sim,kind)+(kind==='water'?s.evaporated||0:0)-s.supplied[kind];}
function addToPan(s,sim,kind,vol,at){
 const L=LIQUID[kind],dv=vol/L.unit;
 if(kind==='water'){const before=Math.max(0,s.water),hot=s.oil>.02&&s.temp>120&&before<.035;s.temp=(s.temp*(before+.03)+18*dv)/(before+.03+dv);s.water+=dv;if(hot)sim.events.push({type:'spatter',at});}
 else s.oil+=dv;
 s.poured[kind]+=vol;sim.events.push({type:'hit',kind,vol,at});
 if(sim.ripples.length<MAX_RIPPLES)sim.ripples.push({kind,x:at[0],y:at[1],z:at[2],born:sim.time});
}
function addPuddle(s,sim,kind,x,y,z,vol,fromPan=false){
 s.spilled[kind]+=vol;sim.events.push({type:'spill',kind,vol,at:[x,y,z],fromPan});
 let best=null,d=Infinity;for(const p of sim.puddles){if(p.kind!==kind)continue;const e=Math.hypot(p.x-x,p.z-z)-p.radius;if(e<d){d=e;best=p;}}
 if(best&&(d<.03||sim.puddles.length>=MAX_PUDDLES)){const w=best.vol/(best.vol+vol);best.x=best.x*w+x*(1-w);best.z=best.z*w+z*(1-w);best.vol+=vol;}
 else sim.puddles.push(best={kind,x,y,z,vol,born:sim.time});
 best.y=Math.max(best.y,y);best.radius=.02+Math.sqrt(best.vol)*.26;
}
function emit(sim,kind,vol,pos,vel,spread,extra={}){
 const key=extra.fromPan?'pan'+kind:kind;sim.pending[key]+=vol;const drop=LIQUID[kind].drop;let n=0;
 // Flush tiny remainders too, so a stopped pour never strands volume in the queue.
 while(sim.pending[key]>1e-9&&(sim.pending[key]>=drop*.999||vol===0)&&sim.particles.length<MAX_PARTICLES&&n++<14){const v=Math.min(drop,sim.pending[key]);sim.pending[key]-=v;const j=()=>(Math.random()-.5)*spread;sim.particles.push({kind,vol:v,age:0,p:[pos[0]+j()*.02,pos[1],pos[2]+j()*.02],v:[vel[0]+j(),vel[1]+j()*.5,vel[2]+j()],...extra});}
}
function splash(sim,kind,at,count,up){for(let n=0;n<count&&sim.splashes.length<90;n++){const a=Math.random()*Math.PI*2,r=.25+Math.random()*.5;sim.splashes.push({kind,age:0,p:[...at],v:[Math.cos(a)*r*.6,up*(.4+Math.random()*.6),Math.sin(a)*r*.6]});}}
/** Advance containers, streams, pan slosh and spills. `dt` seconds. Returns frame events. */
export function stepLiquids(s,sim,dt){
 dt=clamp(Number.isFinite(dt)?dt:0,0,.05);sim.time+=dt;sim.events=[];if(!dt)return sim.events;
 const pose=panPose(s),pp=pose.position,pq=pose.quaternion,rim=rimHeight(s);
 // Containers: pour only above the tilt threshold.
 for(const c of Object.values(s.containers)){const L=LIQUID[c.kind];c.rate=flowRate(c);if(c.rate>0){let vol=Math.min(c.amount,c.rate*dt);if(c.amount-vol<1e-7)vol=c.amount;c.amount-=vol;const sp=spout(c);emit(sim,c.kind,vol,sp.pos,sp.velocity,c.kind==='water'?.16:.04);}else if(sim.pending[c.kind]>0){const sp=spout(c);emit(sim,c.kind,0,sp.pos,sp.velocity,.1);}}
 // Particles.
 for(let i=sim.particles.length-1;i>=0;i--){const q=sim.particles[i];q.age+=dt;q.v[1]-=G*dt;const drag=q.kind==='oil'?.4:.15;for(let k=0;k<3;k++){q.v[k]*=1-drag*dt;q.p[k]+=q.v[k]*dt;}
  const rel=[q.p[0]-pp[0],q.p[1]-pp[1],q.p[2]-pp[2]],local=invRotate(pq,rel),r=Math.hypot(local[0],local[2]);
  if(!(q.fromPan&&q.age<.25)&&r<PAN_INNER&&local[1]<rim&&local[1]>-.05){const surface=rotate(pq,[local[0],Math.min(levelOf(s),rim),local[2]]);const at=[pp[0]+surface[0],pp[1]+surface[1],pp[2]+surface[2]];addToPan(s,sim,q.kind,q.vol,at);if(Math.random()<(q.kind==='water'?.35:.12))splash(sim,q.kind,at,q.kind==='water'?2:1,q.kind==='water'?1:.5);sim.particles.splice(i,1);continue;}
  if(!q.deflected&&r>=PAN_INNER&&r<PAN_INNER+.06&&local[1]<rim+.02&&local[1]>-.05){q.deflected=true;const out=rotate(pq,[local[0]/r,0,local[2]/r]);q.v[0]=out[0]*.6;q.v[2]=out[2]*.6;q.v[1]=Math.abs(q.v[1])*.2;}
  const g=groundHeight(q.p[0],q.p[2]);
  if(q.p[1]<=g||q.age>4){addPuddle(s,sim,q.kind,q.p[0],g,q.p[2],q.vol,!!q.fromPan);if(Math.random()<.2)splash(sim,q.kind,[q.p[0],g,q.p[2]],1,.5);sim.particles.splice(i,1);}
 }
 for(let i=sim.splashes.length-1;i>=0;i--){const q=sim.splashes[i];q.age+=dt;q.v[1]-=G*dt;for(let k=0;k<3;k++)q.p[k]+=q.v[k]*dt;if(q.age>.6)sim.splashes.splice(i,1);}
 sim.ripples=sim.ripples.filter(r=>sim.time-r.born<.9);
 // Slosh: damped surface-slope oscillator driven by pan acceleration.
 const vel=pose.velocity,last=sim.lastVel||vel,ax=clamp((vel[0]-last[0])/dt,-25,25),az=clamp((vel[2]-last[2])/dt,-25,25);sim.lastVel=[...vel];
 const w=7,zeta=s.water>.035?.09:.3,sl=sim.slosh,tx=clamp(-ax/G,-.6,.6),tz=clamp(-az/G,-.6,.6);
 sl.vx+=(-w*w*(sl.x-tx)-2*zeta*w*sl.vx)*dt;sl.vz+=(-w*w*(sl.z-tz)-2*zeta*w*sl.vz)*dt;sl.x=clamp(sl.x+sl.vx*dt,-.8,.8);sl.z=clamp(sl.z+sl.vz*dt,-.8,.8);
 // Tip/overflow spill from the low rim. Oil floats, so it leaves first.
 const total=panLitres(s,'water')+panLitres(s,'oil');sim.panSpill=0;
 if(total>1e-6){const up=rotate(pq,[0,1,0]),tilt=Math.acos(clamp(up[1],-1,1)),rise=PAN_INNER*(Math.tan(Math.min(tilt,1.35))+Math.hypot(sl.x,sl.z)),excess=levelOf(s)+rise-rim*Math.cos(Math.min(tilt,1.35));
  if(excess>0){let dir=[up[0]+sl.x,0,up[2]+sl.z];const n=Math.hypot(dir[0],dir[2]);dir=n>1e-4?[dir[0]/n,0,dir[2]/n]:[1,0,0];let vol=Math.min(total,(.4+30*excess)*dt);sim.panSpill=vol/dt;
   const rimPoint=[pp[0]+up[0]*rim+dir[0]*(PAN_INNER+.07),pp[1]+up[1]*rim,pp[2]+up[2]*rim+dir[2]*(PAN_INNER+.07)],v=[dir[0]*.45+vel[0],.05+vel[1],dir[2]*.45+vel[2]];
   sim.rimEmit={pos:rimPoint,vel:v};
   for(const kind of ['oil','water']){const have=panLitres(s,kind),take=Math.min(have,vol);if(take<=0)continue;s[kind]-=take/LIQUID[kind].unit;if(s[kind]<1e-12)s[kind]=0;vol-=take;emit(sim,kind,take,rimPoint,v,.12,{fromPan:true});sim.events.push({type:'overflow',kind,vol:take});}}}
 if(sim.rimEmit&&!sim.panSpill)for(const kind of ['oil','water'])if(sim.pending['pan'+kind]>0)emit(sim,kind,0,sim.rimEmit.pos,sim.rimEmit.vel,.12,{fromPan:true});
 return sim.events;
}
/** Move a held container toward a target; auto-aim the spout at the pan. Set-down containers stand upright on the worktop. */
export function driveContainer(s,c,target,dt){
 const k=1-Math.exp(-dt*14);
 if(c.held&&target){const y=Math.max(target[1],groundHeight(target[0],target[2])+.005);c.pos=[c.pos[0]+(clamp(target[0],-1.7,1.7)-c.pos[0])*k,c.pos[1]+(clamp(y,.88,1.95)-c.pos[1])*k,c.pos[2]+(clamp(target[2],-.6,.8)-c.pos[2])*k];}
 if(c.held&&!c.manualYaw){const pp=panPose(s).position,dx=pp[0]-c.pos[0],dz=pp[2]-c.pos[2];if(Math.hypot(dx,dz)>.08){let d=Math.atan2(dz,dx)-c.yaw;d=Math.atan2(Math.sin(d),Math.cos(d));c.yaw+=d*Math.min(1,dt*6);}}
 else if(!c.held){c.tilt=Math.max(0,c.tilt-dt*2.5);const g=groundHeight(c.pos[0],c.pos[2]);c.pos[1]+=(g-c.pos[1])*Math.min(1,dt*8);}
 c.tilt=clamp(c.tilt,0,2.3);
}
export function refill(s,kind){const c=s.containers[kind],add=LIQUID[kind].capacity-c.amount;if(add>0){c.amount+=add;s.supplied[kind]+=add;}return add;}

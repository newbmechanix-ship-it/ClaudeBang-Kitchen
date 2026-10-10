import {FOODS} from './state.js';
// Deterministic value noise so every cut piece of an ingredient reproduces the same organic surface.
const hash=n=>{const s=Math.sin(n*127.1+311.7)*43758.5453;return s-Math.floor(s);};
export function noise1(x){const i=Math.floor(x),f=x-i,e=f*f*(3-2*f);return hash(i)+(hash(i+1)-hash(i))*e;}
export function hash2(a,b){return hash(a*57.31+b*13.77);}
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
export const PASTA_INNER=.6;
export function axialU(type,x){const f=FOODS[type];return clamp((x+f.length/2)/f.length);}

/** Mean (axisymmetric) radius at material coordinate x. Physics colliders and cut caps use this profile. */
export function radiusAt(type,x){
 const f=FOODS[type],u=axialU(type,x);
 if(type==='claude'){const profile=[[0,.18],[.24,.72],[.44,1.0],[.65,.63],[.85,.27],[1,.13]];let n=0;while(n<profile.length-2&&u>profile[n+1][0])n++;const [a,r]=profile[n],[b,s]=profile[n+1],v=(u-a)/(b-a),e=v*v*(3-2*v);return f.radius*(r+(s-r)*e);}
 if(type==='carrot'){
  // Rounded crown shoulder at -X, irregular taper to a fine root tip at +X.
  const s=Math.min(1,u/.07),dome=Math.sqrt(Math.max(0,1-(1-s)**2)),taper=.04+.96*Math.pow(1-u,.82),tip=u>.96?Math.sqrt((1-u)/.04):1;
  return f.radius*Math.max(.02,dome*taper*tip*(1+.05*(noise1(u*7.3)-.5)));
 }
 if(type==='zucchini'){
  // Capsule with a slightly club-shaped blossom end; the stem end narrows into the peduncle.
  const d=Math.min(u/.10,(1-u)/.08),round=d<1?Math.sqrt(Math.max(0,1-(1-d)**2)):1;
  return f.radius*Math.max(.14,round)*(.9+.12*u)*(1+.025*(noise1(u*5.1+3)-.5));
 }
 if(type==='tomato'){
  // Oblate fruit lying on its side: flatter shoulder at the calyx end (-X).
  const p=u<.5?2.9:2.2,base=Math.pow(Math.max(0,1-Math.pow(Math.abs(2*u-1),p)),1/p);
  return f.radius*Math.max(.07,base);
 }
 return f.radius; // rigatoni: outer tube radius
}
export function carrotGroove(u,theta){
 // Fine, partial transverse rings in the skin, irregularly spaced.
 const phase=u*22+1.2*noise1(u*5),k=Math.floor(phase),ring=Math.pow(Math.max(0,Math.cos((phase-k-.5)*Math.PI*2)),18);
 const mask=clamp((Math.sin(theta+hash(k)*6.283)+.15)*1.6);return ring*mask;
}
export function zucchiniStripe(u,theta){return clamp((Math.sin(10*theta+.4*Math.sin(u*4)+Math.PI)-.25)/.7);}
export function tomatoLobe(u,theta){const w=Math.pow(Math.max(0,1-Math.abs(2*u-1)),.5)*(u<.5?1:.45);return Math.cos(5*theta+.35*Math.sin(2*theta))*w;}
export function pastaRidge(theta){return Math.pow(.5-.5*Math.cos(14*theta),1.6);}
/** Full surface radius including organic detail. Lateral skin and cut-cap rims share this, so caps seal exactly. */
export function surfaceRadius(type,x,theta){
 theta=((theta%(Math.PI*2))+Math.PI*2)%(Math.PI*2);
 const r=radiusAt(type,x),u=axialU(type,x);
 if(type==='carrot')return r*(1+.032*Math.sin(2*theta+3.1*u+.7)+.022*Math.sin(3*theta-5*u)-.05*carrotGroove(u,theta));
 if(type==='zucchini'){const end=clamp(Math.min(u,1-u)/.08);return r*(1+end*(.022*Math.cos(10*theta+.4*Math.sin(u*4))+.008*(noise1(Math.sin(theta)*3+u*20)-.5)));}
 if(type==='tomato')return r*(1+.06*tomatoLobe(u,theta)+.01*(noise1(Math.sin(theta)*4+u*9)-.5));
 if(type==='pasta')return r*(1-.07*pastaRidge(theta));
 return r;
}

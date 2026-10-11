(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function e(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=e(s);fetch(s.href,r)}})();const ze={carrot:{name:"Carrot",length:.7,radius:.075,skin:"#e68736",inside:"#ffba66",cook:20},zucchini:{name:"Zucchini",length:.7,radius:.09,skin:"#426c36",inside:"#e1e1a0",cook:24},tomato:{name:"Tomato",length:.35,radius:.14,skin:"#c64432",inside:"#ee7750",cook:18},pasta:{name:"Rigatoni",length:.18,radius:.042,skin:"#e7be68",inside:"#f4d88b",cook:30},claude:{name:"Fish-Claude",length:.62,radius:.105,skin:"#6eaaa6",inside:"#c4dbd6",cook:28}},le={x:-.72,z:.28,y:.97,width:1.35,depth:.85},fe={x:.85,z:.12},Ze={x:fe.x,y:1.028,z:fe.z+.34};function Al(i,t){const e=Math.hypot(t.x-Ze.x,t.z-Ze.z)<.14,n=i.panPose?.position||[fe.x,1.056,fe.z],s=Math.hypot(n[0]-Ze.x,n[2]-Ze.z)<.47&&n[1]<1.3&&n[1]>.8;return{near:e,covered:s,ready:e&&!s}}const Jn={water:{unit:4,capacity:3,height:.24,radius:.09,minTilt:.5,maxTilt:1.45,rate:.95,speed:.95,drop:.004,spout:[.092,.24],home:[-1.18,.8825,-.4]},oil:{unit:.5,capacity:.6,height:.4,radius:.072,minTilt:.75,maxTilt:1.95,rate:.16,speed:.6,drop:.003,spout:[0,.4],home:[-1.46,.8825,-.37]}};function od(){const i={};for(const[t,e]of Object.entries(Jn))i[t]={kind:t,amount:e.capacity,pos:[...e.home],yaw:0,tilt:0,held:!1,rate:0};return i}function ad(){return{version:1,physics:!1,panPose:null,time:0,next:1,items:[],fish:[],gas:0,lit:!1,temp:22,oil:0,water:0,vessel:"pan",cuts:0,served:0,lastScore:null,events:[],containers:od(),spilled:{oil:0,water:0},poured:{oil:0,water:0},supplied:{oil:0,water:0},evaporated:0}}function di(i,t,e=null){i.events.push({at:i.time,text:t,fishId:e}),i.events=i.events.slice(-28)}function kr(i,t,e="board"){if(!ze[t]||i.items.length>=70||t==="claude"&&i.fish.length>=6)return null;const n=ze[t],s=e==="board"?[le.z-.26,le.z,le.z+.26].find(l=>i.items.every(c=>c.zone!=="board"||Math.abs(c.z-l)>=n.radius+ze[c.type].radius+.01)):null;if(e==="board"&&s===void 0)return null;const r=i.next++,o=t==="claude"?"claude-"+r:null,a={id:r,type:t,fishId:o,a:-n.length/2,b:n.length/2,x:e==="pan"?fe.x:le.x,z:e==="pan"?fe.z:s,zone:e,cook:0,burn:0,side:0,wet:0,cutAt:-99,head:t==="claude",angle:0};if(e==="pan"){const l=i.items.filter(h=>h.zone==="pan").length,c=Math.min(Math.max(.02,.39-Math.hypot(n.length/2,n.radius)),.08+l*.02);a.x+=Math.cos(l*2.4)*c,a.z+=Math.sin(l*2.4)*c,a.angle=l*2.4}return i.items.push(a),o&&i.fish.push({id:o,name:"Claude "+(i.fish.length+1),pain:0,lastCut:-99,say:"",speaking:!1,spokenAt:-99}),di(i,`${ze[t].name} added to ${e}`,o),a}function Of(i,t,e){const n=i.items.find(l=>l.id===t);if(!n||n.zone!=="board"||i.items.length>=70)return null;const s=e-n.x;if(s-n.a<.018||n.b-s<.018)return null;const r={...n,b:s,id:i.next++,cutAt:i.time,x:n.x-.006},o={...n,a:s,id:i.next++,head:!1,cutAt:i.time,x:n.x+.006},a=i.items.indexOf(n);if(i.items.splice(a,1,r,o),i.cuts++,n.fishId){const l=i.fish.find(c=>c.id===n.fishId);l.pain=Math.max(l.pain,75),l.lastCut=i.time}return di(i,`${ze[n.type].name} sliced at ${s.toFixed(3)} m`,n.fishId),[r,o]}function zf(i,t,e){return i.gas>.04&&t&&e>=.4?(i.lit=!0,di(i,"Burner ignited"),!0):!1}function Bf(i,t){t=Math.max(0,Math.min(t,.1)),i.time+=t,i.gas<=.02&&(i.lit=!1);const e=!i.physics||!i.panPose||Math.hypot(i.panPose.position[0]-fe.x,i.panPose.position[2]-fe.z)<.28&&i.panPose.position[1]<1.18,n=i.water>.035,s=i.lit&&e?n?100:22+225*i.gas:22;if(n&&(i.temp=Math.min(100,i.temp)),i.temp+=(s-i.temp)*(1-Math.exp(-t/(n?10:7))),n&&i.temp>93&&i.lit){const r=Math.min(i.water,t*.0014*i.gas);i.water-=r,i.evaporated=(i.evaporated||0)+r*Jn.water.unit}for(const r of i.items){if(r.zone!=="pan"||i.physics&&!r.panContact)continue;const o=ze[r.type],a=n?Math.max(0,(i.temp-75)/25):Math.max(0,(i.temp-65)/100);r.wet=n?Math.min(1,r.wet+t*.08):Math.max(0,r.wet-t*.03),r.cook=Math.min(1.5,r.cook+t/o.cook*a*(r.type==="pasta"&&!n?.05:1)*(n||i.oil>.02?1:.55)),!n&&i.temp>175&&r.cook>.8&&(r.burn=Math.min(1,r.burn+t*(i.temp-175)/2200))}for(const r of i.fish){const o=i.items.some(a=>a.fishId===r.id&&a.zone==="pan"&&(!i.physics||a.panContact))&&i.temp>48;r.pain=Math.max(0,r.pain-t*4),o&&(r.pain=Math.max(r.pain,Math.min(95,(i.temp-40)*.8)))}}function kf(i){const t=i.items.filter(n=>n.zone==="pan");if(!t.length)return null;const e=Math.round(t.reduce((n,s)=>n+Math.max(0,1-Math.abs(1-s.cook))*(1-s.burn),0)/t.length*100);for(const n of t)n.zone="plate";return i.served++,i.lastScore=e,di(i,`Dish served: ${e}/100`),{score:e,count:t.length}}function Kr(i){return i.temp<48?"warming":i.water>.035?i.temp>=93?"boiling":"heating water":i.oil>.02&&i.temp>95?"frying":i.temp>175?"searing":"warming"}class Yn{constructor(t){t===void 0&&(t=[0,0,0,0,0,0,0,0,0]),this.elements=t}identity(){const t=this.elements;t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=1,t[5]=0,t[6]=0,t[7]=0,t[8]=1}setZero(){const t=this.elements;t[0]=0,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=0,t[6]=0,t[7]=0,t[8]=0}setTrace(t){const e=this.elements;e[0]=t.x,e[4]=t.y,e[8]=t.z}getTrace(t){t===void 0&&(t=new E);const e=this.elements;return t.x=e[0],t.y=e[4],t.z=e[8],t}vmult(t,e){e===void 0&&(e=new E);const n=this.elements,s=t.x,r=t.y,o=t.z;return e.x=n[0]*s+n[1]*r+n[2]*o,e.y=n[3]*s+n[4]*r+n[5]*o,e.z=n[6]*s+n[7]*r+n[8]*o,e}smult(t){for(let e=0;e<this.elements.length;e++)this.elements[e]*=t}mmult(t,e){e===void 0&&(e=new Yn);const n=this.elements,s=t.elements,r=e.elements,o=n[0],a=n[1],l=n[2],c=n[3],h=n[4],d=n[5],u=n[6],f=n[7],g=n[8],v=s[0],m=s[1],p=s[2],x=s[3],w=s[4],y=s[5],M=s[6],S=s[7],C=s[8];return r[0]=o*v+a*x+l*M,r[1]=o*m+a*w+l*S,r[2]=o*p+a*y+l*C,r[3]=c*v+h*x+d*M,r[4]=c*m+h*w+d*S,r[5]=c*p+h*y+d*C,r[6]=u*v+f*x+g*M,r[7]=u*m+f*w+g*S,r[8]=u*p+f*y+g*C,e}scale(t,e){e===void 0&&(e=new Yn);const n=this.elements,s=e.elements;for(let r=0;r!==3;r++)s[3*r+0]=t.x*n[3*r+0],s[3*r+1]=t.y*n[3*r+1],s[3*r+2]=t.z*n[3*r+2];return e}solve(t,e){e===void 0&&(e=new E);const n=3,s=4,r=[];let o,a;for(o=0;o<n*s;o++)r.push(0);for(o=0;o<3;o++)for(a=0;a<3;a++)r[o+s*a]=this.elements[o+3*a];r[3]=t.x,r[7]=t.y,r[11]=t.z;let l=3;const c=l;let h;const d=4;let u;do{if(o=c-l,r[o+s*o]===0){for(a=o+1;a<c;a++)if(r[o+s*a]!==0){h=d;do u=d-h,r[u+s*o]+=r[u+s*a];while(--h);break}}if(r[o+s*o]!==0)for(a=o+1;a<c;a++){const f=r[o+s*a]/r[o+s*o];h=d;do u=d-h,r[u+s*a]=u<=o?0:r[u+s*a]-r[u+s*o]*f;while(--h)}}while(--l);if(e.z=r[2*s+3]/r[2*s+2],e.y=(r[1*s+3]-r[1*s+2]*e.z)/r[1*s+1],e.x=(r[0*s+3]-r[0*s+2]*e.z-r[0*s+1]*e.y)/r[0*s+0],isNaN(e.x)||isNaN(e.y)||isNaN(e.z)||e.x===1/0||e.y===1/0||e.z===1/0)throw`Could not solve equation! Got x=[${e.toString()}], b=[${t.toString()}], A=[${this.toString()}]`;return e}e(t,e,n){if(n===void 0)return this.elements[e+3*t];this.elements[e+3*t]=n}copy(t){for(let e=0;e<t.elements.length;e++)this.elements[e]=t.elements[e];return this}toString(){let t="";for(let n=0;n<9;n++)t+=this.elements[n]+",";return t}reverse(t){t===void 0&&(t=new Yn);const e=3,n=6,s=Gf;let r,o;for(r=0;r<3;r++)for(o=0;o<3;o++)s[r+n*o]=this.elements[r+3*o];s[3]=1,s[9]=0,s[15]=0,s[4]=0,s[10]=1,s[16]=0,s[5]=0,s[11]=0,s[17]=1;let a=3;const l=a;let c;const h=n;let d;do{if(r=l-a,s[r+n*r]===0){for(o=r+1;o<l;o++)if(s[r+n*o]!==0){c=h;do d=h-c,s[d+n*r]+=s[d+n*o];while(--c);break}}if(s[r+n*r]!==0)for(o=r+1;o<l;o++){const u=s[r+n*o]/s[r+n*r];c=h;do d=h-c,s[d+n*o]=d<=r?0:s[d+n*o]-s[d+n*r]*u;while(--c)}}while(--a);r=2;do{o=r-1;do{const u=s[r+n*o]/s[r+n*r];c=n;do d=n-c,s[d+n*o]=s[d+n*o]-s[d+n*r]*u;while(--c)}while(o--)}while(--r);r=2;do{const u=1/s[r+n*r];c=n;do d=n-c,s[d+n*r]=s[d+n*r]*u;while(--c)}while(r--);r=2;do{o=2;do{if(d=s[e+o+n*r],isNaN(d)||d===1/0)throw`Could not reverse! A=[${this.toString()}]`;t.e(r,o,d)}while(o--)}while(r--);return t}setRotationFromQuaternion(t){const e=t.x,n=t.y,s=t.z,r=t.w,o=e+e,a=n+n,l=s+s,c=e*o,h=e*a,d=e*l,u=n*a,f=n*l,g=s*l,v=r*o,m=r*a,p=r*l,x=this.elements;return x[0]=1-(u+g),x[1]=h-p,x[2]=d+m,x[3]=h+p,x[4]=1-(c+g),x[5]=f-v,x[6]=d-m,x[7]=f+v,x[8]=1-(c+u),this}transpose(t){t===void 0&&(t=new Yn);const e=this.elements,n=t.elements;let s;return n[0]=e[0],n[4]=e[4],n[8]=e[8],s=e[1],n[1]=e[3],n[3]=s,s=e[2],n[2]=e[6],n[6]=s,s=e[5],n[5]=e[7],n[7]=s,t}}const Gf=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];class E{constructor(t,e,n){t===void 0&&(t=0),e===void 0&&(e=0),n===void 0&&(n=0),this.x=t,this.y=e,this.z=n}cross(t,e){e===void 0&&(e=new E);const n=t.x,s=t.y,r=t.z,o=this.x,a=this.y,l=this.z;return e.x=a*r-l*s,e.y=l*n-o*r,e.z=o*s-a*n,e}set(t,e,n){return this.x=t,this.y=e,this.z=n,this}setZero(){this.x=this.y=this.z=0}vadd(t,e){if(e)e.x=t.x+this.x,e.y=t.y+this.y,e.z=t.z+this.z;else return new E(this.x+t.x,this.y+t.y,this.z+t.z)}vsub(t,e){if(e)e.x=this.x-t.x,e.y=this.y-t.y,e.z=this.z-t.z;else return new E(this.x-t.x,this.y-t.y,this.z-t.z)}crossmat(){return new Yn([0,-this.z,this.y,this.z,0,-this.x,-this.y,this.x,0])}normalize(){const t=this.x,e=this.y,n=this.z,s=Math.sqrt(t*t+e*e+n*n);if(s>0){const r=1/s;this.x*=r,this.y*=r,this.z*=r}else this.x=0,this.y=0,this.z=0;return s}unit(t){t===void 0&&(t=new E);const e=this.x,n=this.y,s=this.z;let r=Math.sqrt(e*e+n*n+s*s);return r>0?(r=1/r,t.x=e*r,t.y=n*r,t.z=s*r):(t.x=1,t.y=0,t.z=0),t}length(){const t=this.x,e=this.y,n=this.z;return Math.sqrt(t*t+e*e+n*n)}lengthSquared(){return this.dot(this)}distanceTo(t){const e=this.x,n=this.y,s=this.z,r=t.x,o=t.y,a=t.z;return Math.sqrt((r-e)*(r-e)+(o-n)*(o-n)+(a-s)*(a-s))}distanceSquared(t){const e=this.x,n=this.y,s=this.z,r=t.x,o=t.y,a=t.z;return(r-e)*(r-e)+(o-n)*(o-n)+(a-s)*(a-s)}scale(t,e){e===void 0&&(e=new E);const n=this.x,s=this.y,r=this.z;return e.x=t*n,e.y=t*s,e.z=t*r,e}vmul(t,e){return e===void 0&&(e=new E),e.x=t.x*this.x,e.y=t.y*this.y,e.z=t.z*this.z,e}addScaledVector(t,e,n){return n===void 0&&(n=new E),n.x=this.x+t*e.x,n.y=this.y+t*e.y,n.z=this.z+t*e.z,n}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}isZero(){return this.x===0&&this.y===0&&this.z===0}negate(t){return t===void 0&&(t=new E),t.x=-this.x,t.y=-this.y,t.z=-this.z,t}tangents(t,e){const n=this.length();if(n>0){const s=Vf,r=1/n;s.set(this.x*r,this.y*r,this.z*r);const o=Hf;Math.abs(s.x)<.9?(o.set(1,0,0),s.cross(o,t)):(o.set(0,1,0),s.cross(o,t)),s.cross(t,e)}else t.set(1,0,0),e.set(0,1,0)}toString(){return`${this.x},${this.y},${this.z}`}toArray(){return[this.x,this.y,this.z]}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}lerp(t,e,n){const s=this.x,r=this.y,o=this.z;n.x=s+(t.x-s)*e,n.y=r+(t.y-r)*e,n.z=o+(t.z-o)*e}almostEquals(t,e){return e===void 0&&(e=1e-6),!(Math.abs(this.x-t.x)>e||Math.abs(this.y-t.y)>e||Math.abs(this.z-t.z)>e)}almostZero(t){return t===void 0&&(t=1e-6),!(Math.abs(this.x)>t||Math.abs(this.y)>t||Math.abs(this.z)>t)}isAntiparallelTo(t,e){return this.negate(dh),dh.almostEquals(t,e)}clone(){return new E(this.x,this.y,this.z)}}E.ZERO=new E(0,0,0);E.UNIT_X=new E(1,0,0);E.UNIT_Y=new E(0,1,0);E.UNIT_Z=new E(0,0,1);const Vf=new E,Hf=new E,dh=new E;class Un{constructor(t){t===void 0&&(t={}),this.lowerBound=new E,this.upperBound=new E,t.lowerBound&&this.lowerBound.copy(t.lowerBound),t.upperBound&&this.upperBound.copy(t.upperBound)}setFromPoints(t,e,n,s){const r=this.lowerBound,o=this.upperBound,a=n;r.copy(t[0]),a&&a.vmult(r,r),o.copy(r);for(let l=1;l<t.length;l++){let c=t[l];a&&(a.vmult(c,fh),c=fh),c.x>o.x&&(o.x=c.x),c.x<r.x&&(r.x=c.x),c.y>o.y&&(o.y=c.y),c.y<r.y&&(r.y=c.y),c.z>o.z&&(o.z=c.z),c.z<r.z&&(r.z=c.z)}return e&&(e.vadd(r,r),e.vadd(o,o)),s&&(r.x-=s,r.y-=s,r.z-=s,o.x+=s,o.y+=s,o.z+=s),this}copy(t){return this.lowerBound.copy(t.lowerBound),this.upperBound.copy(t.upperBound),this}clone(){return new Un().copy(this)}extend(t){this.lowerBound.x=Math.min(this.lowerBound.x,t.lowerBound.x),this.upperBound.x=Math.max(this.upperBound.x,t.upperBound.x),this.lowerBound.y=Math.min(this.lowerBound.y,t.lowerBound.y),this.upperBound.y=Math.max(this.upperBound.y,t.upperBound.y),this.lowerBound.z=Math.min(this.lowerBound.z,t.lowerBound.z),this.upperBound.z=Math.max(this.upperBound.z,t.upperBound.z)}overlaps(t){const e=this.lowerBound,n=this.upperBound,s=t.lowerBound,r=t.upperBound,o=s.x<=n.x&&n.x<=r.x||e.x<=r.x&&r.x<=n.x,a=s.y<=n.y&&n.y<=r.y||e.y<=r.y&&r.y<=n.y,l=s.z<=n.z&&n.z<=r.z||e.z<=r.z&&r.z<=n.z;return o&&a&&l}volume(){const t=this.lowerBound,e=this.upperBound;return(e.x-t.x)*(e.y-t.y)*(e.z-t.z)}contains(t){const e=this.lowerBound,n=this.upperBound,s=t.lowerBound,r=t.upperBound;return e.x<=s.x&&n.x>=r.x&&e.y<=s.y&&n.y>=r.y&&e.z<=s.z&&n.z>=r.z}getCorners(t,e,n,s,r,o,a,l){const c=this.lowerBound,h=this.upperBound;t.copy(c),e.set(h.x,c.y,c.z),n.set(h.x,h.y,c.z),s.set(c.x,h.y,h.z),r.set(h.x,c.y,h.z),o.set(c.x,h.y,c.z),a.set(c.x,c.y,h.z),l.copy(h)}toLocalFrame(t,e){const n=ph,s=n[0],r=n[1],o=n[2],a=n[3],l=n[4],c=n[5],h=n[6],d=n[7];this.getCorners(s,r,o,a,l,c,h,d);for(let u=0;u!==8;u++){const f=n[u];t.pointToLocal(f,f)}return e.setFromPoints(n)}toWorldFrame(t,e){const n=ph,s=n[0],r=n[1],o=n[2],a=n[3],l=n[4],c=n[5],h=n[6],d=n[7];this.getCorners(s,r,o,a,l,c,h,d);for(let u=0;u!==8;u++){const f=n[u];t.pointToWorld(f,f)}return e.setFromPoints(n)}overlapsRay(t){const{direction:e,from:n}=t,s=1/e.x,r=1/e.y,o=1/e.z,a=(this.lowerBound.x-n.x)*s,l=(this.upperBound.x-n.x)*s,c=(this.lowerBound.y-n.y)*r,h=(this.upperBound.y-n.y)*r,d=(this.lowerBound.z-n.z)*o,u=(this.upperBound.z-n.z)*o,f=Math.max(Math.max(Math.min(a,l),Math.min(c,h)),Math.min(d,u)),g=Math.min(Math.min(Math.max(a,l),Math.max(c,h)),Math.max(d,u));return!(g<0||f>g)}}const fh=new E,ph=[new E,new E,new E,new E,new E,new E,new E,new E];class mh{constructor(){this.matrix=[]}get(t,e){let{index:n}=t,{index:s}=e;if(s>n){const r=s;s=n,n=r}return this.matrix[(n*(n+1)>>1)+s-1]}set(t,e,n){let{index:s}=t,{index:r}=e;if(r>s){const o=r;r=s,s=o}this.matrix[(s*(s+1)>>1)+r-1]=n?1:0}reset(){for(let t=0,e=this.matrix.length;t!==e;t++)this.matrix[t]=0}setNumObjects(t){this.matrix.length=t*(t-1)>>1}}class ld{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;return n[t]===void 0&&(n[t]=[]),n[t].includes(e)||n[t].push(e),this}hasEventListener(t,e){if(this._listeners===void 0)return!1;const n=this._listeners;return!!(n[t]!==void 0&&n[t].includes(e))}hasAnyEventListener(t){return this._listeners===void 0?!1:this._listeners[t]!==void 0}removeEventListener(t,e){if(this._listeners===void 0)return this;const n=this._listeners;if(n[t]===void 0)return this;const s=n[t].indexOf(e);return s!==-1&&n[t].splice(s,1),this}dispatchEvent(t){if(this._listeners===void 0)return this;const n=this._listeners[t.type];if(n!==void 0){t.target=this;for(let s=0,r=n.length;s<r;s++)n[s].call(this,t)}return this}}let Ke=class ms{constructor(t,e,n,s){t===void 0&&(t=0),e===void 0&&(e=0),n===void 0&&(n=0),s===void 0&&(s=1),this.x=t,this.y=e,this.z=n,this.w=s}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}toString(){return`${this.x},${this.y},${this.z},${this.w}`}toArray(){return[this.x,this.y,this.z,this.w]}setFromAxisAngle(t,e){const n=Math.sin(e*.5);return this.x=t.x*n,this.y=t.y*n,this.z=t.z*n,this.w=Math.cos(e*.5),this}toAxisAngle(t){t===void 0&&(t=new E),this.normalize();const e=2*Math.acos(this.w),n=Math.sqrt(1-this.w*this.w);return n<.001?(t.x=this.x,t.y=this.y,t.z=this.z):(t.x=this.x/n,t.y=this.y/n,t.z=this.z/n),[t,e]}setFromVectors(t,e){if(t.isAntiparallelTo(e)){const n=Wf,s=qf;t.tangents(n,s),this.setFromAxisAngle(n,Math.PI)}else{const n=t.cross(e);this.x=n.x,this.y=n.y,this.z=n.z,this.w=Math.sqrt(t.length()**2*e.length()**2)+t.dot(e),this.normalize()}return this}mult(t,e){e===void 0&&(e=new ms);const n=this.x,s=this.y,r=this.z,o=this.w,a=t.x,l=t.y,c=t.z,h=t.w;return e.x=n*h+o*a+s*c-r*l,e.y=s*h+o*l+r*a-n*c,e.z=r*h+o*c+n*l-s*a,e.w=o*h-n*a-s*l-r*c,e}inverse(t){t===void 0&&(t=new ms);const e=this.x,n=this.y,s=this.z,r=this.w;this.conjugate(t);const o=1/(e*e+n*n+s*s+r*r);return t.x*=o,t.y*=o,t.z*=o,t.w*=o,t}conjugate(t){return t===void 0&&(t=new ms),t.x=-this.x,t.y=-this.y,t.z=-this.z,t.w=this.w,t}normalize(){let t=Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w);return t===0?(this.x=0,this.y=0,this.z=0,this.w=0):(t=1/t,this.x*=t,this.y*=t,this.z*=t,this.w*=t),this}normalizeFast(){const t=(3-(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w))/2;return t===0?(this.x=0,this.y=0,this.z=0,this.w=0):(this.x*=t,this.y*=t,this.z*=t,this.w*=t),this}vmult(t,e){e===void 0&&(e=new E);const n=t.x,s=t.y,r=t.z,o=this.x,a=this.y,l=this.z,c=this.w,h=c*n+a*r-l*s,d=c*s+l*n-o*r,u=c*r+o*s-a*n,f=-o*n-a*s-l*r;return e.x=h*c+f*-o+d*-l-u*-a,e.y=d*c+f*-a+u*-o-h*-l,e.z=u*c+f*-l+h*-a-d*-o,e}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w,this}toEuler(t,e){e===void 0&&(e="YZX");let n,s,r;const o=this.x,a=this.y,l=this.z,c=this.w;switch(e){case"YZX":const h=o*a+l*c;if(h>.499&&(n=2*Math.atan2(o,c),s=Math.PI/2,r=0),h<-.499&&(n=-2*Math.atan2(o,c),s=-Math.PI/2,r=0),n===void 0){const d=o*o,u=a*a,f=l*l;n=Math.atan2(2*a*c-2*o*l,1-2*u-2*f),s=Math.asin(2*h),r=Math.atan2(2*o*c-2*a*l,1-2*d-2*f)}break;default:throw new Error(`Euler order ${e} not supported yet.`)}t.y=n,t.z=s,t.x=r}setFromEuler(t,e,n,s){s===void 0&&(s="XYZ");const r=Math.cos(t/2),o=Math.cos(e/2),a=Math.cos(n/2),l=Math.sin(t/2),c=Math.sin(e/2),h=Math.sin(n/2);return s==="XYZ"?(this.x=l*o*a+r*c*h,this.y=r*c*a-l*o*h,this.z=r*o*h+l*c*a,this.w=r*o*a-l*c*h):s==="YXZ"?(this.x=l*o*a+r*c*h,this.y=r*c*a-l*o*h,this.z=r*o*h-l*c*a,this.w=r*o*a+l*c*h):s==="ZXY"?(this.x=l*o*a-r*c*h,this.y=r*c*a+l*o*h,this.z=r*o*h+l*c*a,this.w=r*o*a-l*c*h):s==="ZYX"?(this.x=l*o*a-r*c*h,this.y=r*c*a+l*o*h,this.z=r*o*h-l*c*a,this.w=r*o*a+l*c*h):s==="YZX"?(this.x=l*o*a+r*c*h,this.y=r*c*a+l*o*h,this.z=r*o*h-l*c*a,this.w=r*o*a-l*c*h):s==="XZY"&&(this.x=l*o*a-r*c*h,this.y=r*c*a-l*o*h,this.z=r*o*h+l*c*a,this.w=r*o*a+l*c*h),this}clone(){return new ms(this.x,this.y,this.z,this.w)}slerp(t,e,n){n===void 0&&(n=new ms);const s=this.x,r=this.y,o=this.z,a=this.w;let l=t.x,c=t.y,h=t.z,d=t.w,u,f,g,v,m;return f=s*l+r*c+o*h+a*d,f<0&&(f=-f,l=-l,c=-c,h=-h,d=-d),1-f>1e-6?(u=Math.acos(f),g=Math.sin(u),v=Math.sin((1-e)*u)/g,m=Math.sin(e*u)/g):(v=1-e,m=e),n.x=v*s+m*l,n.y=v*r+m*c,n.z=v*o+m*h,n.w=v*a+m*d,n}integrate(t,e,n,s){s===void 0&&(s=new ms);const r=t.x*n.x,o=t.y*n.y,a=t.z*n.z,l=this.x,c=this.y,h=this.z,d=this.w,u=e*.5;return s.x+=u*(r*d+o*h-a*c),s.y+=u*(o*d+a*l-r*h),s.z+=u*(a*d+r*c-o*l),s.w+=u*(-r*l-o*c-a*h),s}};const Wf=new E,qf=new E,Xf={SPHERE:1,PLANE:2,BOX:4,COMPOUND:8,CONVEXPOLYHEDRON:16,HEIGHTFIELD:32,PARTICLE:64,CYLINDER:128,TRIMESH:256};let Vt=class cd{constructor(t){t===void 0&&(t={}),this.id=cd.idCounter++,this.type=t.type||0,this.boundingSphereRadius=0,this.collisionResponse=t.collisionResponse?t.collisionResponse:!0,this.collisionFilterGroup=t.collisionFilterGroup!==void 0?t.collisionFilterGroup:1,this.collisionFilterMask=t.collisionFilterMask!==void 0?t.collisionFilterMask:-1,this.material=t.material?t.material:null,this.body=null}updateBoundingSphereRadius(){throw`computeBoundingSphereRadius() not implemented for shape type ${this.type}`}volume(){throw`volume() not implemented for shape type ${this.type}`}calculateLocalInertia(t,e){throw`calculateLocalInertia() not implemented for shape type ${this.type}`}calculateWorldAABB(t,e,n,s){throw`calculateWorldAABB() not implemented for shape type ${this.type}`}};Vt.idCounter=0;Vt.types=Xf;class _e{constructor(t){t===void 0&&(t={}),this.position=new E,this.quaternion=new Ke,t.position&&this.position.copy(t.position),t.quaternion&&this.quaternion.copy(t.quaternion)}pointToLocal(t,e){return _e.pointToLocalFrame(this.position,this.quaternion,t,e)}pointToWorld(t,e){return _e.pointToWorldFrame(this.position,this.quaternion,t,e)}vectorToWorldFrame(t,e){return e===void 0&&(e=new E),this.quaternion.vmult(t,e),e}static pointToLocalFrame(t,e,n,s){return s===void 0&&(s=new E),n.vsub(t,s),e.conjugate(gh),gh.vmult(s,s),s}static pointToWorldFrame(t,e,n,s){return s===void 0&&(s=new E),e.vmult(n,s),s.vadd(t,s),s}static vectorToWorldFrame(t,e,n){return n===void 0&&(n=new E),t.vmult(e,n),n}static vectorToLocalFrame(t,e,n,s){return s===void 0&&(s=new E),e.w*=-1,e.vmult(n,s),e.w*=-1,s}}const gh=new Ke;class or extends Vt{constructor(t){t===void 0&&(t={});const{vertices:e=[],faces:n=[],normals:s=[],axes:r,boundingSphereRadius:o}=t;super({type:Vt.types.CONVEXPOLYHEDRON}),this.vertices=e,this.faces=n,this.faceNormals=s,this.faceNormals.length===0&&this.computeNormals(),o?this.boundingSphereRadius=o:this.updateBoundingSphereRadius(),this.worldVertices=[],this.worldVerticesNeedsUpdate=!0,this.worldFaceNormals=[],this.worldFaceNormalsNeedsUpdate=!0,this.uniqueAxes=r?r.slice():null,this.uniqueEdges=[],this.computeEdges()}computeEdges(){const t=this.faces,e=this.vertices,n=this.uniqueEdges;n.length=0;const s=new E;for(let r=0;r!==t.length;r++){const o=t[r],a=o.length;for(let l=0;l!==a;l++){const c=(l+1)%a;e[o[l]].vsub(e[o[c]],s),s.normalize();let h=!1;for(let d=0;d!==n.length;d++)if(n[d].almostEquals(s)||n[d].almostEquals(s)){h=!0;break}h||n.push(s.clone())}}}computeNormals(){this.faceNormals.length=this.faces.length;for(let t=0;t<this.faces.length;t++){for(let s=0;s<this.faces[t].length;s++)if(!this.vertices[this.faces[t][s]])throw new Error(`Vertex ${this.faces[t][s]} not found!`);const e=this.faceNormals[t]||new E;this.getFaceNormal(t,e),e.negate(e),this.faceNormals[t]=e;const n=this.vertices[this.faces[t][0]];if(e.dot(n)<0){console.error(`.faceNormals[${t}] = Vec3(${e.toString()}) looks like it points into the shape? The vertices follow. Make sure they are ordered CCW around the normal, using the right hand rule.`);for(let s=0;s<this.faces[t].length;s++)console.warn(`.vertices[${this.faces[t][s]}] = Vec3(${this.vertices[this.faces[t][s]].toString()})`)}}}getFaceNormal(t,e){const n=this.faces[t],s=this.vertices[n[0]],r=this.vertices[n[1]],o=this.vertices[n[2]];or.computeNormal(s,r,o,e)}static computeNormal(t,e,n,s){const r=new E,o=new E;e.vsub(t,o),n.vsub(e,r),r.cross(o,s),s.isZero()||s.normalize()}clipAgainstHull(t,e,n,s,r,o,a,l,c){const h=new E;let d=-1,u=-Number.MAX_VALUE;for(let g=0;g<n.faces.length;g++){h.copy(n.faceNormals[g]),r.vmult(h,h);const v=h.dot(o);v>u&&(u=v,d=g)}const f=[];for(let g=0;g<n.faces[d].length;g++){const v=n.vertices[n.faces[d][g]],m=new E;m.copy(v),r.vmult(m,m),s.vadd(m,m),f.push(m)}d>=0&&this.clipFaceAgainstHull(o,t,e,f,a,l,c)}findSeparatingAxis(t,e,n,s,r,o,a,l){const c=new E,h=new E,d=new E,u=new E,f=new E,g=new E;let v=Number.MAX_VALUE;const m=this;if(m.uniqueAxes)for(let p=0;p!==m.uniqueAxes.length;p++){n.vmult(m.uniqueAxes[p],c);const x=m.testSepAxis(c,t,e,n,s,r);if(x===!1)return!1;x<v&&(v=x,o.copy(c))}else{const p=a?a.length:m.faces.length;for(let x=0;x<p;x++){const w=a?a[x]:x;c.copy(m.faceNormals[w]),n.vmult(c,c);const y=m.testSepAxis(c,t,e,n,s,r);if(y===!1)return!1;y<v&&(v=y,o.copy(c))}}if(t.uniqueAxes)for(let p=0;p!==t.uniqueAxes.length;p++){r.vmult(t.uniqueAxes[p],h);const x=m.testSepAxis(h,t,e,n,s,r);if(x===!1)return!1;x<v&&(v=x,o.copy(h))}else{const p=l?l.length:t.faces.length;for(let x=0;x<p;x++){const w=l?l[x]:x;h.copy(t.faceNormals[w]),r.vmult(h,h);const y=m.testSepAxis(h,t,e,n,s,r);if(y===!1)return!1;y<v&&(v=y,o.copy(h))}}for(let p=0;p!==m.uniqueEdges.length;p++){n.vmult(m.uniqueEdges[p],u);for(let x=0;x!==t.uniqueEdges.length;x++)if(r.vmult(t.uniqueEdges[x],f),u.cross(f,g),!g.almostZero()){g.normalize();const w=m.testSepAxis(g,t,e,n,s,r);if(w===!1)return!1;w<v&&(v=w,o.copy(g))}}return s.vsub(e,d),d.dot(o)>0&&o.negate(o),!0}testSepAxis(t,e,n,s,r,o){const a=this;or.project(a,t,n,s,Oa),or.project(e,t,r,o,za);const l=Oa[0],c=Oa[1],h=za[0],d=za[1];if(l<d||h<c)return!1;const u=l-d,f=h-c;return u<f?u:f}calculateLocalInertia(t,e){const n=new E,s=new E;this.computeLocalAABB(s,n);const r=n.x-s.x,o=n.y-s.y,a=n.z-s.z;e.x=1/12*t*(2*o*2*o+2*a*2*a),e.y=1/12*t*(2*r*2*r+2*a*2*a),e.z=1/12*t*(2*o*2*o+2*r*2*r)}getPlaneConstantOfFace(t){const e=this.faces[t],n=this.faceNormals[t],s=this.vertices[e[0]];return-n.dot(s)}clipFaceAgainstHull(t,e,n,s,r,o,a){const l=new E,c=new E,h=new E,d=new E,u=new E,f=new E,g=new E,v=new E,m=this,p=[],x=s,w=p;let y=-1,M=Number.MAX_VALUE;for(let L=0;L<m.faces.length;L++){l.copy(m.faceNormals[L]),n.vmult(l,l);const I=l.dot(t);I<M&&(M=I,y=L)}if(y<0)return;const S=m.faces[y];S.connectedFaces=[];for(let L=0;L<m.faces.length;L++)for(let I=0;I<m.faces[L].length;I++)S.indexOf(m.faces[L][I])!==-1&&L!==y&&S.connectedFaces.indexOf(L)===-1&&S.connectedFaces.push(L);const C=S.length;for(let L=0;L<C;L++){const I=m.vertices[S[L]],U=m.vertices[S[(L+1)%C]];I.vsub(U,c),h.copy(c),n.vmult(h,h),e.vadd(h,h),d.copy(this.faceNormals[y]),n.vmult(d,d),e.vadd(d,d),h.cross(d,u),u.negate(u),f.copy(I),n.vmult(f,f),e.vadd(f,f);const N=S.connectedFaces[L];g.copy(this.faceNormals[N]);const A=this.getPlaneConstantOfFace(N);v.copy(g),n.vmult(v,v);const D=A-v.dot(e);for(this.clipFaceAgainstPlane(x,w,v,D);x.length;)x.shift();for(;w.length;)x.push(w.shift())}g.copy(this.faceNormals[y]);const _=this.getPlaneConstantOfFace(y);v.copy(g),n.vmult(v,v);const T=_-v.dot(e);for(let L=0;L<x.length;L++){let I=v.dot(x[L])+T;if(I<=r&&(console.log(`clamped: depth=${I} to minDist=${r}`),I=r),I<=o){const U=x[L];if(I<=1e-6){const N={point:U,normal:v,depth:I};a.push(N)}}}}clipFaceAgainstPlane(t,e,n,s){let r,o;const a=t.length;if(a<2)return e;let l=t[t.length-1],c=t[0];r=n.dot(l)+s;for(let h=0;h<a;h++){if(c=t[h],o=n.dot(c)+s,r<0)if(o<0){const d=new E;d.copy(c),e.push(d)}else{const d=new E;l.lerp(c,r/(r-o),d),e.push(d)}else if(o<0){const d=new E;l.lerp(c,r/(r-o),d),e.push(d),e.push(c)}l=c,r=o}return e}computeWorldVertices(t,e){for(;this.worldVertices.length<this.vertices.length;)this.worldVertices.push(new E);const n=this.vertices,s=this.worldVertices;for(let r=0;r!==this.vertices.length;r++)e.vmult(n[r],s[r]),t.vadd(s[r],s[r]);this.worldVerticesNeedsUpdate=!1}computeLocalAABB(t,e){const n=this.vertices;t.set(Number.MAX_VALUE,Number.MAX_VALUE,Number.MAX_VALUE),e.set(-Number.MAX_VALUE,-Number.MAX_VALUE,-Number.MAX_VALUE);for(let s=0;s<this.vertices.length;s++){const r=n[s];r.x<t.x?t.x=r.x:r.x>e.x&&(e.x=r.x),r.y<t.y?t.y=r.y:r.y>e.y&&(e.y=r.y),r.z<t.z?t.z=r.z:r.z>e.z&&(e.z=r.z)}}computeWorldFaceNormals(t){const e=this.faceNormals.length;for(;this.worldFaceNormals.length<e;)this.worldFaceNormals.push(new E);const n=this.faceNormals,s=this.worldFaceNormals;for(let r=0;r!==e;r++)t.vmult(n[r],s[r]);this.worldFaceNormalsNeedsUpdate=!1}updateBoundingSphereRadius(){let t=0;const e=this.vertices;for(let n=0;n!==e.length;n++){const s=e[n].lengthSquared();s>t&&(t=s)}this.boundingSphereRadius=Math.sqrt(t)}calculateWorldAABB(t,e,n,s){const r=this.vertices;let o,a,l,c,h,d,u=new E;for(let f=0;f<r.length;f++){u.copy(r[f]),e.vmult(u,u),t.vadd(u,u);const g=u;(o===void 0||g.x<o)&&(o=g.x),(c===void 0||g.x>c)&&(c=g.x),(a===void 0||g.y<a)&&(a=g.y),(h===void 0||g.y>h)&&(h=g.y),(l===void 0||g.z<l)&&(l=g.z),(d===void 0||g.z>d)&&(d=g.z)}n.set(o,a,l),s.set(c,h,d)}volume(){return 4*Math.PI*this.boundingSphereRadius/3}getAveragePointLocal(t){t===void 0&&(t=new E);const e=this.vertices;for(let n=0;n<e.length;n++)t.vadd(e[n],t);return t.scale(1/e.length,t),t}transformAllPoints(t,e){const n=this.vertices.length,s=this.vertices;if(e){for(let r=0;r<n;r++){const o=s[r];e.vmult(o,o)}for(let r=0;r<this.faceNormals.length;r++){const o=this.faceNormals[r];e.vmult(o,o)}}if(t)for(let r=0;r<n;r++){const o=s[r];o.vadd(t,o)}}pointIsInside(t){const e=this.vertices,n=this.faces,s=this.faceNormals,r=new E;this.getAveragePointLocal(r);for(let o=0;o<this.faces.length;o++){let a=s[o];const l=e[n[o][0]],c=new E;t.vsub(l,c);const h=a.dot(c),d=new E;r.vsub(l,d);const u=a.dot(d);if(h<0&&u>0||h>0&&u<0)return!1}return-1}static project(t,e,n,s,r){const o=t.vertices.length,a=Yf;let l=0,c=0;const h=Zf,d=t.vertices;h.setZero(),_e.vectorToLocalFrame(n,s,e,a),_e.pointToLocalFrame(n,s,h,h);const u=h.dot(a);c=l=d[0].dot(a);for(let f=1;f<o;f++){const g=d[f].dot(a);g>l&&(l=g),g<c&&(c=g)}if(c-=u,l-=u,c>l){const f=c;c=l,l=f}r[0]=l,r[1]=c}}const Oa=[],za=[];new E;const Yf=new E,Zf=new E;class ai extends Vt{constructor(t){super({type:Vt.types.BOX}),this.halfExtents=t,this.convexPolyhedronRepresentation=null,this.updateConvexPolyhedronRepresentation(),this.updateBoundingSphereRadius()}updateConvexPolyhedronRepresentation(){const t=this.halfExtents.x,e=this.halfExtents.y,n=this.halfExtents.z,s=E,r=[new s(-t,-e,-n),new s(t,-e,-n),new s(t,e,-n),new s(-t,e,-n),new s(-t,-e,n),new s(t,-e,n),new s(t,e,n),new s(-t,e,n)],o=[[3,2,1,0],[4,5,6,7],[5,4,0,1],[2,3,7,6],[0,4,7,3],[1,2,6,5]],a=[new s(0,0,1),new s(0,1,0),new s(1,0,0)],l=new or({vertices:r,faces:o,axes:a});this.convexPolyhedronRepresentation=l,l.material=this.material}calculateLocalInertia(t,e){return e===void 0&&(e=new E),ai.calculateInertia(this.halfExtents,t,e),e}static calculateInertia(t,e,n){const s=t;n.x=1/12*e*(2*s.y*2*s.y+2*s.z*2*s.z),n.y=1/12*e*(2*s.x*2*s.x+2*s.z*2*s.z),n.z=1/12*e*(2*s.y*2*s.y+2*s.x*2*s.x)}getSideNormals(t,e){const n=t,s=this.halfExtents;if(n[0].set(s.x,0,0),n[1].set(0,s.y,0),n[2].set(0,0,s.z),n[3].set(-s.x,0,0),n[4].set(0,-s.y,0),n[5].set(0,0,-s.z),e!==void 0)for(let r=0;r!==n.length;r++)e.vmult(n[r],n[r]);return n}volume(){return 8*this.halfExtents.x*this.halfExtents.y*this.halfExtents.z}updateBoundingSphereRadius(){this.boundingSphereRadius=this.halfExtents.length()}forEachWorldCorner(t,e,n){const s=this.halfExtents,r=[[s.x,s.y,s.z],[-s.x,s.y,s.z],[-s.x,-s.y,s.z],[-s.x,-s.y,-s.z],[s.x,-s.y,-s.z],[s.x,s.y,-s.z],[-s.x,s.y,-s.z],[s.x,-s.y,s.z]];for(let o=0;o<r.length;o++)Yi.set(r[o][0],r[o][1],r[o][2]),e.vmult(Yi,Yi),t.vadd(Yi,Yi),n(Yi.x,Yi.y,Yi.z)}calculateWorldAABB(t,e,n,s){const r=this.halfExtents;ei[0].set(r.x,r.y,r.z),ei[1].set(-r.x,r.y,r.z),ei[2].set(-r.x,-r.y,r.z),ei[3].set(-r.x,-r.y,-r.z),ei[4].set(r.x,-r.y,-r.z),ei[5].set(r.x,r.y,-r.z),ei[6].set(-r.x,r.y,-r.z),ei[7].set(r.x,-r.y,r.z);const o=ei[0];e.vmult(o,o),t.vadd(o,o),s.copy(o),n.copy(o);for(let a=1;a<8;a++){const l=ei[a];e.vmult(l,l),t.vadd(l,l);const c=l.x,h=l.y,d=l.z;c>s.x&&(s.x=c),h>s.y&&(s.y=h),d>s.z&&(s.z=d),c<n.x&&(n.x=c),h<n.y&&(n.y=h),d<n.z&&(n.z=d)}}}const Yi=new E,ei=[new E,new E,new E,new E,new E,new E,new E,new E],Ec={DYNAMIC:1,STATIC:2,KINEMATIC:4},Tc={AWAKE:0,SLEEPY:1,SLEEPING:2};class zt extends ld{constructor(t){t===void 0&&(t={}),super(),this.id=zt.idCounter++,this.index=-1,this.world=null,this.vlambda=new E,this.collisionFilterGroup=typeof t.collisionFilterGroup=="number"?t.collisionFilterGroup:1,this.collisionFilterMask=typeof t.collisionFilterMask=="number"?t.collisionFilterMask:-1,this.collisionResponse=typeof t.collisionResponse=="boolean"?t.collisionResponse:!0,this.position=new E,this.previousPosition=new E,this.interpolatedPosition=new E,this.initPosition=new E,t.position&&(this.position.copy(t.position),this.previousPosition.copy(t.position),this.interpolatedPosition.copy(t.position),this.initPosition.copy(t.position)),this.velocity=new E,t.velocity&&this.velocity.copy(t.velocity),this.initVelocity=new E,this.force=new E;const e=typeof t.mass=="number"?t.mass:0;this.mass=e,this.invMass=e>0?1/e:0,this.material=t.material||null,this.linearDamping=typeof t.linearDamping=="number"?t.linearDamping:.01,this.type=e<=0?zt.STATIC:zt.DYNAMIC,typeof t.type==typeof zt.STATIC&&(this.type=t.type),this.allowSleep=typeof t.allowSleep<"u"?t.allowSleep:!0,this.sleepState=zt.AWAKE,this.sleepSpeedLimit=typeof t.sleepSpeedLimit<"u"?t.sleepSpeedLimit:.1,this.sleepTimeLimit=typeof t.sleepTimeLimit<"u"?t.sleepTimeLimit:1,this.timeLastSleepy=0,this.wakeUpAfterNarrowphase=!1,this.torque=new E,this.quaternion=new Ke,this.initQuaternion=new Ke,this.previousQuaternion=new Ke,this.interpolatedQuaternion=new Ke,t.quaternion&&(this.quaternion.copy(t.quaternion),this.initQuaternion.copy(t.quaternion),this.previousQuaternion.copy(t.quaternion),this.interpolatedQuaternion.copy(t.quaternion)),this.angularVelocity=new E,t.angularVelocity&&this.angularVelocity.copy(t.angularVelocity),this.initAngularVelocity=new E,this.shapes=[],this.shapeOffsets=[],this.shapeOrientations=[],this.inertia=new E,this.invInertia=new E,this.invInertiaWorld=new Yn,this.invMassSolve=0,this.invInertiaSolve=new E,this.invInertiaWorldSolve=new Yn,this.fixedRotation=typeof t.fixedRotation<"u"?t.fixedRotation:!1,this.angularDamping=typeof t.angularDamping<"u"?t.angularDamping:.01,this.linearFactor=new E(1,1,1),t.linearFactor&&this.linearFactor.copy(t.linearFactor),this.angularFactor=new E(1,1,1),t.angularFactor&&this.angularFactor.copy(t.angularFactor),this.aabb=new Un,this.aabbNeedsUpdate=!0,this.boundingRadius=0,this.wlambda=new E,this.isTrigger=!!t.isTrigger,t.shape&&this.addShape(t.shape),this.updateMassProperties()}wakeUp(){const t=this.sleepState;this.sleepState=zt.AWAKE,this.wakeUpAfterNarrowphase=!1,t===zt.SLEEPING&&this.dispatchEvent(zt.wakeupEvent)}sleep(){this.sleepState=zt.SLEEPING,this.velocity.set(0,0,0),this.angularVelocity.set(0,0,0),this.wakeUpAfterNarrowphase=!1}sleepTick(t){if(this.allowSleep){const e=this.sleepState,n=this.velocity.lengthSquared()+this.angularVelocity.lengthSquared(),s=this.sleepSpeedLimit**2;e===zt.AWAKE&&n<s?(this.sleepState=zt.SLEEPY,this.timeLastSleepy=t,this.dispatchEvent(zt.sleepyEvent)):e===zt.SLEEPY&&n>s?this.wakeUp():e===zt.SLEEPY&&t-this.timeLastSleepy>this.sleepTimeLimit&&(this.sleep(),this.dispatchEvent(zt.sleepEvent))}}updateSolveMassProperties(){this.sleepState===zt.SLEEPING||this.type===zt.KINEMATIC?(this.invMassSolve=0,this.invInertiaSolve.setZero(),this.invInertiaWorldSolve.setZero()):(this.invMassSolve=this.invMass,this.invInertiaSolve.copy(this.invInertia),this.invInertiaWorldSolve.copy(this.invInertiaWorld))}pointToLocalFrame(t,e){return e===void 0&&(e=new E),t.vsub(this.position,e),this.quaternion.conjugate().vmult(e,e),e}vectorToLocalFrame(t,e){return e===void 0&&(e=new E),this.quaternion.conjugate().vmult(t,e),e}pointToWorldFrame(t,e){return e===void 0&&(e=new E),this.quaternion.vmult(t,e),e.vadd(this.position,e),e}vectorToWorldFrame(t,e){return e===void 0&&(e=new E),this.quaternion.vmult(t,e),e}addShape(t,e,n){const s=new E,r=new Ke;return e&&s.copy(e),n&&r.copy(n),this.shapes.push(t),this.shapeOffsets.push(s),this.shapeOrientations.push(r),this.updateMassProperties(),this.updateBoundingRadius(),this.aabbNeedsUpdate=!0,t.body=this,this}removeShape(t){const e=this.shapes.indexOf(t);return e===-1?(console.warn("Shape does not belong to the body"),this):(this.shapes.splice(e,1),this.shapeOffsets.splice(e,1),this.shapeOrientations.splice(e,1),this.updateMassProperties(),this.updateBoundingRadius(),this.aabbNeedsUpdate=!0,t.body=null,this)}updateBoundingRadius(){const t=this.shapes,e=this.shapeOffsets,n=t.length;let s=0;for(let r=0;r!==n;r++){const o=t[r];o.updateBoundingSphereRadius();const a=e[r].length(),l=o.boundingSphereRadius;a+l>s&&(s=a+l)}this.boundingRadius=s}updateAABB(){const t=this.shapes,e=this.shapeOffsets,n=this.shapeOrientations,s=t.length,r=Kf,o=$f,a=this.quaternion,l=this.aabb,c=Jf;for(let h=0;h!==s;h++){const d=t[h];a.vmult(e[h],r),r.vadd(this.position,r),a.mult(n[h],o),d.calculateWorldAABB(r,o,c.lowerBound,c.upperBound),h===0?l.copy(c):l.extend(c)}this.aabbNeedsUpdate=!1}updateInertiaWorld(t){const e=this.invInertia;if(!(e.x===e.y&&e.y===e.z&&!t)){const n=jf,s=Qf;n.setRotationFromQuaternion(this.quaternion),n.transpose(s),n.scale(e,n),n.mmult(s,this.invInertiaWorld)}}applyForce(t,e){if(e===void 0&&(e=new E),this.type!==zt.DYNAMIC)return;this.sleepState===zt.SLEEPING&&this.wakeUp();const n=tp;e.cross(t,n),this.force.vadd(t,this.force),this.torque.vadd(n,this.torque)}applyLocalForce(t,e){if(e===void 0&&(e=new E),this.type!==zt.DYNAMIC)return;const n=ep,s=np;this.vectorToWorldFrame(t,n),this.vectorToWorldFrame(e,s),this.applyForce(n,s)}applyTorque(t){this.type===zt.DYNAMIC&&(this.sleepState===zt.SLEEPING&&this.wakeUp(),this.torque.vadd(t,this.torque))}applyImpulse(t,e){if(e===void 0&&(e=new E),this.type!==zt.DYNAMIC)return;this.sleepState===zt.SLEEPING&&this.wakeUp();const n=e,s=ip;s.copy(t),s.scale(this.invMass,s),this.velocity.vadd(s,this.velocity);const r=sp;n.cross(t,r),this.invInertiaWorld.vmult(r,r),this.angularVelocity.vadd(r,this.angularVelocity)}applyLocalImpulse(t,e){if(e===void 0&&(e=new E),this.type!==zt.DYNAMIC)return;const n=rp,s=op;this.vectorToWorldFrame(t,n),this.vectorToWorldFrame(e,s),this.applyImpulse(n,s)}updateMassProperties(){const t=ap;this.invMass=this.mass>0?1/this.mass:0;const e=this.inertia,n=this.fixedRotation;this.updateAABB(),t.set((this.aabb.upperBound.x-this.aabb.lowerBound.x)/2,(this.aabb.upperBound.y-this.aabb.lowerBound.y)/2,(this.aabb.upperBound.z-this.aabb.lowerBound.z)/2),ai.calculateInertia(t,this.mass,e),this.invInertia.set(e.x>0&&!n?1/e.x:0,e.y>0&&!n?1/e.y:0,e.z>0&&!n?1/e.z:0),this.updateInertiaWorld(!0)}getVelocityAtWorldPoint(t,e){const n=new E;return t.vsub(this.position,n),this.angularVelocity.cross(n,e),this.velocity.vadd(e,e),e}integrate(t,e,n){if(this.previousPosition.copy(this.position),this.previousQuaternion.copy(this.quaternion),!(this.type===zt.DYNAMIC||this.type===zt.KINEMATIC)||this.sleepState===zt.SLEEPING)return;const s=this.velocity,r=this.angularVelocity,o=this.position,a=this.force,l=this.torque,c=this.quaternion,h=this.invMass,d=this.invInertiaWorld,u=this.linearFactor,f=h*t;s.x+=a.x*f*u.x,s.y+=a.y*f*u.y,s.z+=a.z*f*u.z;const g=d.elements,v=this.angularFactor,m=l.x*v.x,p=l.y*v.y,x=l.z*v.z;r.x+=t*(g[0]*m+g[1]*p+g[2]*x),r.y+=t*(g[3]*m+g[4]*p+g[5]*x),r.z+=t*(g[6]*m+g[7]*p+g[8]*x),o.x+=s.x*t,o.y+=s.y*t,o.z+=s.z*t,c.integrate(this.angularVelocity,t,this.angularFactor,c),e&&(n?c.normalizeFast():c.normalize()),this.aabbNeedsUpdate=!0,this.updateInertiaWorld()}}zt.idCounter=0;zt.COLLIDE_EVENT_NAME="collide";zt.DYNAMIC=Ec.DYNAMIC;zt.STATIC=Ec.STATIC;zt.KINEMATIC=Ec.KINEMATIC;zt.AWAKE=Tc.AWAKE;zt.SLEEPY=Tc.SLEEPY;zt.SLEEPING=Tc.SLEEPING;zt.wakeupEvent={type:"wakeup"};zt.sleepyEvent={type:"sleepy"};zt.sleepEvent={type:"sleep"};const Kf=new E,$f=new Ke,Jf=new Un,jf=new Yn,Qf=new Yn;new Yn;const tp=new E,ep=new E,np=new E,ip=new E,sp=new E,rp=new E,op=new E,ap=new E;class hd{constructor(){this.world=null,this.useBoundingBoxes=!1,this.dirty=!0}collisionPairs(t,e,n){throw new Error("collisionPairs not implemented for this BroadPhase class!")}needBroadphaseCollision(t,e){return!((t.collisionFilterGroup&e.collisionFilterMask)===0||(e.collisionFilterGroup&t.collisionFilterMask)===0||((t.type&zt.STATIC)!==0||t.sleepState===zt.SLEEPING)&&((e.type&zt.STATIC)!==0||e.sleepState===zt.SLEEPING))}intersectionTest(t,e,n,s){this.useBoundingBoxes?this.doBoundingBoxBroadphase(t,e,n,s):this.doBoundingSphereBroadphase(t,e,n,s)}doBoundingSphereBroadphase(t,e,n,s){const r=lp;e.position.vsub(t.position,r);const o=(t.boundingRadius+e.boundingRadius)**2;r.lengthSquared()<o&&(n.push(t),s.push(e))}doBoundingBoxBroadphase(t,e,n,s){t.aabbNeedsUpdate&&t.updateAABB(),e.aabbNeedsUpdate&&e.updateAABB(),t.aabb.overlaps(e.aabb)&&(n.push(t),s.push(e))}makePairsUnique(t,e){const n=cp,s=hp,r=up,o=t.length;for(let a=0;a!==o;a++)s[a]=t[a],r[a]=e[a];t.length=0,e.length=0;for(let a=0;a!==o;a++){const l=s[a].id,c=r[a].id,h=l<c?`${l},${c}`:`${c},${l}`;n[h]=a,n.keys.push(h)}for(let a=0;a!==n.keys.length;a++){const l=n.keys.pop(),c=n[l];t.push(s[c]),e.push(r[c]),delete n[l]}}setWorld(t){}static boundingSphereCheck(t,e){const n=new E;t.position.vsub(e.position,n);const s=t.shapes[0],r=e.shapes[0];return Math.pow(s.boundingSphereRadius+r.boundingSphereRadius,2)>n.lengthSquared()}aabbQuery(t,e,n){return console.warn(".aabbQuery is not implemented in this Broadphase subclass."),[]}}const lp=new E;new E;new Ke;new E;const cp={keys:[]},hp=[],up=[];new E;new E;new E;class dp extends hd{constructor(){super()}collisionPairs(t,e,n){const s=t.bodies,r=s.length;let o,a;for(let l=0;l!==r;l++)for(let c=0;c!==l;c++)o=s[l],a=s[c],this.needBroadphaseCollision(o,a)&&this.intersectionTest(o,a,e,n)}aabbQuery(t,e,n){n===void 0&&(n=[]);for(let s=0;s<t.bodies.length;s++){const r=t.bodies[s];r.aabbNeedsUpdate&&r.updateAABB(),r.aabb.overlaps(e)&&n.push(r)}return n}}class aa{constructor(){this.rayFromWorld=new E,this.rayToWorld=new E,this.hitNormalWorld=new E,this.hitPointWorld=new E,this.hasHit=!1,this.shape=null,this.body=null,this.hitFaceIndex=-1,this.distance=-1,this.shouldStop=!1}reset(){this.rayFromWorld.setZero(),this.rayToWorld.setZero(),this.hitNormalWorld.setZero(),this.hitPointWorld.setZero(),this.hasHit=!1,this.shape=null,this.body=null,this.hitFaceIndex=-1,this.distance=-1,this.shouldStop=!1}abort(){this.shouldStop=!0}set(t,e,n,s,r,o,a){this.rayFromWorld.copy(t),this.rayToWorld.copy(e),this.hitNormalWorld.copy(n),this.hitPointWorld.copy(s),this.shape=r,this.body=o,this.distance=a}}let ud,dd,fd,pd,md,gd,vd;const Ac={CLOSEST:1,ANY:2,ALL:4};ud=Vt.types.SPHERE;dd=Vt.types.PLANE;fd=Vt.types.BOX;pd=Vt.types.CYLINDER;md=Vt.types.CONVEXPOLYHEDRON;gd=Vt.types.HEIGHTFIELD;vd=Vt.types.TRIMESH;let fi=class oi{get[ud](){return this._intersectSphere}get[dd](){return this._intersectPlane}get[fd](){return this._intersectBox}get[pd](){return this._intersectConvex}get[md](){return this._intersectConvex}get[gd](){return this._intersectHeightfield}get[vd](){return this._intersectTrimesh}constructor(t,e){t===void 0&&(t=new E),e===void 0&&(e=new E),this.from=t.clone(),this.to=e.clone(),this.direction=new E,this.precision=1e-4,this.checkCollisionResponse=!0,this.skipBackfaces=!1,this.collisionFilterMask=-1,this.collisionFilterGroup=-1,this.mode=oi.ANY,this.result=new aa,this.hasHit=!1,this.callback=n=>{}}intersectWorld(t,e){return this.mode=e.mode||oi.ANY,this.result=e.result||new aa,this.skipBackfaces=!!e.skipBackfaces,this.collisionFilterMask=typeof e.collisionFilterMask<"u"?e.collisionFilterMask:-1,this.collisionFilterGroup=typeof e.collisionFilterGroup<"u"?e.collisionFilterGroup:-1,this.checkCollisionResponse=typeof e.checkCollisionResponse<"u"?e.checkCollisionResponse:!0,e.from&&this.from.copy(e.from),e.to&&this.to.copy(e.to),this.callback=e.callback||(()=>{}),this.hasHit=!1,this.result.reset(),this.updateDirection(),this.getAABB(vh),Ba.length=0,t.broadphase.aabbQuery(t,vh,Ba),this.intersectBodies(Ba),this.hasHit}intersectBody(t,e){e&&(this.result=e,this.updateDirection());const n=this.checkCollisionResponse;if(n&&!t.collisionResponse||(this.collisionFilterGroup&t.collisionFilterMask)===0||(t.collisionFilterGroup&this.collisionFilterMask)===0)return;const s=fp,r=pp;for(let o=0,a=t.shapes.length;o<a;o++){const l=t.shapes[o];if(!(n&&!l.collisionResponse)&&(t.quaternion.mult(t.shapeOrientations[o],r),t.quaternion.vmult(t.shapeOffsets[o],s),s.vadd(t.position,s),this.intersectShape(l,r,s,t),this.result.shouldStop))break}}intersectBodies(t,e){e&&(this.result=e,this.updateDirection());for(let n=0,s=t.length;!this.result.shouldStop&&n<s;n++)this.intersectBody(t[n])}updateDirection(){this.to.vsub(this.from,this.direction),this.direction.normalize()}intersectShape(t,e,n,s){const r=this.from;if(Cp(r,this.direction,n)>t.boundingSphereRadius)return;const a=this[t.type];a&&a.call(this,t,e,n,s,t)}_intersectBox(t,e,n,s,r){return this._intersectConvex(t.convexPolyhedronRepresentation,e,n,s,r)}_intersectPlane(t,e,n,s,r){const o=this.from,a=this.to,l=this.direction,c=new E(0,0,1);e.vmult(c,c);const h=new E;o.vsub(n,h);const d=h.dot(c);a.vsub(n,h);const u=h.dot(c);if(d*u>0||o.distanceTo(a)<d)return;const f=c.dot(l);if(Math.abs(f)<this.precision)return;const g=new E,v=new E,m=new E;o.vsub(n,g);const p=-c.dot(g)/f;l.scale(p,v),o.vadd(v,m),this.reportIntersection(c,m,r,s,-1)}getAABB(t){const{lowerBound:e,upperBound:n}=t,s=this.to,r=this.from;e.x=Math.min(s.x,r.x),e.y=Math.min(s.y,r.y),e.z=Math.min(s.z,r.z),n.x=Math.max(s.x,r.x),n.y=Math.max(s.y,r.y),n.z=Math.max(s.z,r.z)}_intersectHeightfield(t,e,n,s,r){t.data,t.elementSize;const o=mp;o.from.copy(this.from),o.to.copy(this.to),_e.pointToLocalFrame(n,e,o.from,o.from),_e.pointToLocalFrame(n,e,o.to,o.to),o.updateDirection();const a=gp;let l,c,h,d;l=c=0,h=d=t.data.length-1;const u=new Un;o.getAABB(u),t.getIndexOfPosition(u.lowerBound.x,u.lowerBound.y,a,!0),l=Math.max(l,a[0]),c=Math.max(c,a[1]),t.getIndexOfPosition(u.upperBound.x,u.upperBound.y,a,!0),h=Math.min(h,a[0]+1),d=Math.min(d,a[1]+1);for(let f=l;f<h;f++)for(let g=c;g<d;g++){if(this.result.shouldStop)return;if(t.getAabbAtIndex(f,g,u),!!u.overlapsRay(o)){if(t.getConvexTrianglePillar(f,g,!1),_e.pointToWorldFrame(n,e,t.pillarOffset,co),this._intersectConvex(t.pillarConvex,e,co,s,r,xh),this.result.shouldStop)return;t.getConvexTrianglePillar(f,g,!0),_e.pointToWorldFrame(n,e,t.pillarOffset,co),this._intersectConvex(t.pillarConvex,e,co,s,r,xh)}}}_intersectSphere(t,e,n,s,r){const o=this.from,a=this.to,l=t.radius,c=(a.x-o.x)**2+(a.y-o.y)**2+(a.z-o.z)**2,h=2*((a.x-o.x)*(o.x-n.x)+(a.y-o.y)*(o.y-n.y)+(a.z-o.z)*(o.z-n.z)),d=(o.x-n.x)**2+(o.y-n.y)**2+(o.z-n.z)**2-l**2,u=h**2-4*c*d,f=vp,g=xp;if(!(u<0))if(u===0)o.lerp(a,u,f),f.vsub(n,g),g.normalize(),this.reportIntersection(g,f,r,s,-1);else{const v=(-h-Math.sqrt(u))/(2*c),m=(-h+Math.sqrt(u))/(2*c);if(v>=0&&v<=1&&(o.lerp(a,v,f),f.vsub(n,g),g.normalize(),this.reportIntersection(g,f,r,s,-1)),this.result.shouldStop)return;m>=0&&m<=1&&(o.lerp(a,m,f),f.vsub(n,g),g.normalize(),this.reportIntersection(g,f,r,s,-1))}}_intersectConvex(t,e,n,s,r,o){const a=_p,l=_h,c=o&&o.faceList||null,h=t.faces,d=t.vertices,u=t.faceNormals,f=this.direction,g=this.from,v=this.to,m=g.distanceTo(v),p=c?c.length:h.length,x=this.result;for(let w=0;!x.shouldStop&&w<p;w++){const y=c?c[w]:w,M=h[y],S=u[y],C=e,_=n;l.copy(d[M[0]]),C.vmult(l,l),l.vadd(_,l),l.vsub(g,l),C.vmult(S,a);const T=f.dot(a);if(Math.abs(T)<this.precision)continue;const L=a.dot(l)/T;if(!(L<0)){f.scale(L,_n),_n.vadd(g,_n),Vn.copy(d[M[0]]),C.vmult(Vn,Vn),_.vadd(Vn,Vn);for(let I=1;!x.shouldStop&&I<M.length-1;I++){ni.copy(d[M[I]]),ii.copy(d[M[I+1]]),C.vmult(ni,ni),C.vmult(ii,ii),_.vadd(ni,ni),_.vadd(ii,ii);const U=_n.distanceTo(g);!(oi.pointInTriangle(_n,Vn,ni,ii)||oi.pointInTriangle(_n,ni,Vn,ii))||U>m||this.reportIntersection(a,_n,r,s,y)}}}}_intersectTrimesh(t,e,n,s,r,o){const a=yp,l=Tp,c=Ap,h=_h,d=Mp,u=Sp,f=bp,g=Ep,v=wp,m=t.indices;t.vertices;const p=this.from,x=this.to,w=this.direction;c.position.copy(n),c.quaternion.copy(e),_e.vectorToLocalFrame(n,e,w,d),_e.pointToLocalFrame(n,e,p,u),_e.pointToLocalFrame(n,e,x,f),f.x*=t.scale.x,f.y*=t.scale.y,f.z*=t.scale.z,u.x*=t.scale.x,u.y*=t.scale.y,u.z*=t.scale.z,f.vsub(u,d),d.normalize();const y=u.distanceSquared(f);t.tree.rayQuery(this,c,l);for(let M=0,S=l.length;!this.result.shouldStop&&M!==S;M++){const C=l[M];t.getNormal(C,a),t.getVertex(m[C*3],Vn),Vn.vsub(u,h);const _=d.dot(a),T=a.dot(h)/_;if(T<0)continue;d.scale(T,_n),_n.vadd(u,_n),t.getVertex(m[C*3+1],ni),t.getVertex(m[C*3+2],ii);const L=_n.distanceSquared(u);!(oi.pointInTriangle(_n,ni,Vn,ii)||oi.pointInTriangle(_n,Vn,ni,ii))||L>y||(_e.vectorToWorldFrame(e,a,v),_e.pointToWorldFrame(n,e,_n,g),this.reportIntersection(v,g,r,s,C))}l.length=0}reportIntersection(t,e,n,s,r){const o=this.from,a=this.to,l=o.distanceTo(e),c=this.result;if(!(this.skipBackfaces&&t.dot(this.direction)>0))switch(c.hitFaceIndex=typeof r<"u"?r:-1,this.mode){case oi.ALL:this.hasHit=!0,c.set(o,a,t,e,n,s,l),c.hasHit=!0,this.callback(c);break;case oi.CLOSEST:(l<c.distance||!c.hasHit)&&(this.hasHit=!0,c.hasHit=!0,c.set(o,a,t,e,n,s,l));break;case oi.ANY:this.hasHit=!0,c.hasHit=!0,c.set(o,a,t,e,n,s,l),c.shouldStop=!0;break}}static pointInTriangle(t,e,n,s){s.vsub(e,gs),n.vsub(e,xr),t.vsub(e,ka);const r=gs.dot(gs),o=gs.dot(xr),a=gs.dot(ka),l=xr.dot(xr),c=xr.dot(ka);let h,d;return(h=l*a-o*c)>=0&&(d=r*c-o*a)>=0&&h+d<r*l-o*o}};fi.CLOSEST=Ac.CLOSEST;fi.ANY=Ac.ANY;fi.ALL=Ac.ALL;const vh=new Un,Ba=[],xr=new E,ka=new E,fp=new E,pp=new Ke,_n=new E,Vn=new E,ni=new E,ii=new E;new E;new aa;const xh={faceList:[0]},co=new E,mp=new fi,gp=[],vp=new E,xp=new E,_p=new E;new E;new E;const _h=new E,yp=new E,Mp=new E,Sp=new E,bp=new E,wp=new E,Ep=new E;new Un;const Tp=[],Ap=new _e,gs=new E,ho=new E;function Cp(i,t,e){e.vsub(i,gs);const n=gs.dot(t);return t.scale(n,ho),ho.vadd(i,ho),e.distanceTo(ho)}class nr extends hd{static checkBounds(t,e,n){let s,r;n===0?(s=t.position.x,r=e.position.x):n===1?(s=t.position.y,r=e.position.y):n===2&&(s=t.position.z,r=e.position.z);const o=t.boundingRadius,a=e.boundingRadius,l=s+o;return r-a<l}static insertionSortX(t){for(let e=1,n=t.length;e<n;e++){const s=t[e];let r;for(r=e-1;r>=0&&!(t[r].aabb.lowerBound.x<=s.aabb.lowerBound.x);r--)t[r+1]=t[r];t[r+1]=s}return t}static insertionSortY(t){for(let e=1,n=t.length;e<n;e++){const s=t[e];let r;for(r=e-1;r>=0&&!(t[r].aabb.lowerBound.y<=s.aabb.lowerBound.y);r--)t[r+1]=t[r];t[r+1]=s}return t}static insertionSortZ(t){for(let e=1,n=t.length;e<n;e++){const s=t[e];let r;for(r=e-1;r>=0&&!(t[r].aabb.lowerBound.z<=s.aabb.lowerBound.z);r--)t[r+1]=t[r];t[r+1]=s}return t}constructor(t){super(),this.axisList=[],this.world=null,this.axisIndex=0;const e=this.axisList;this._addBodyHandler=n=>{e.push(n.body)},this._removeBodyHandler=n=>{const s=e.indexOf(n.body);s!==-1&&e.splice(s,1)},t&&this.setWorld(t)}setWorld(t){this.axisList.length=0;for(let e=0;e<t.bodies.length;e++)this.axisList.push(t.bodies[e]);t.removeEventListener("addBody",this._addBodyHandler),t.removeEventListener("removeBody",this._removeBodyHandler),t.addEventListener("addBody",this._addBodyHandler),t.addEventListener("removeBody",this._removeBodyHandler),this.world=t,this.dirty=!0}collisionPairs(t,e,n){const s=this.axisList,r=s.length,o=this.axisIndex;let a,l;for(this.dirty&&(this.sortList(),this.dirty=!1),a=0;a!==r;a++){const c=s[a];for(l=a+1;l<r;l++){const h=s[l];if(this.needBroadphaseCollision(c,h)){if(!nr.checkBounds(c,h,o))break;this.intersectionTest(c,h,e,n)}}}}sortList(){const t=this.axisList,e=this.axisIndex,n=t.length;for(let s=0;s!==n;s++){const r=t[s];r.aabbNeedsUpdate&&r.updateAABB()}e===0?nr.insertionSortX(t):e===1?nr.insertionSortY(t):e===2&&nr.insertionSortZ(t)}autoDetectAxis(){let t=0,e=0,n=0,s=0,r=0,o=0;const a=this.axisList,l=a.length,c=1/l;for(let f=0;f!==l;f++){const g=a[f],v=g.position.x;t+=v,e+=v*v;const m=g.position.y;n+=m,s+=m*m;const p=g.position.z;r+=p,o+=p*p}const h=e-t*t*c,d=s-n*n*c,u=o-r*r*c;h>d?h>u?this.axisIndex=0:this.axisIndex=2:d>u?this.axisIndex=1:this.axisIndex=2}aabbQuery(t,e,n){n===void 0&&(n=[]),this.dirty&&(this.sortList(),this.dirty=!1);const s=this.axisIndex;let r="x";s===1&&(r="y"),s===2&&(r="z");const o=this.axisList;e.lowerBound[r],e.upperBound[r];for(let a=0;a<o.length;a++){const l=o[a];l.aabbNeedsUpdate&&l.updateAABB(),l.aabb.overlaps(e)&&n.push(l)}return n}}class xd{static defaults(t,e){t===void 0&&(t={});for(let n in e)n in t||(t[n]=e[n]);return t}}class Ma{constructor(t,e,n){n===void 0&&(n={}),n=xd.defaults(n,{collideConnected:!0,wakeUpBodies:!0}),this.equations=[],this.bodyA=t,this.bodyB=e,this.id=Ma.idCounter++,this.collideConnected=n.collideConnected,n.wakeUpBodies&&(t&&t.wakeUp(),e&&e.wakeUp())}update(){throw new Error("method update() not implmemented in this Constraint subclass!")}enable(){const t=this.equations;for(let e=0;e<t.length;e++)t[e].enabled=!0}disable(){const t=this.equations;for(let e=0;e<t.length;e++)t[e].enabled=!1}}Ma.idCounter=0;class yh{constructor(){this.spatial=new E,this.rotational=new E}multiplyElement(t){return t.spatial.dot(this.spatial)+t.rotational.dot(this.rotational)}multiplyVectors(t,e){return t.dot(this.spatial)+e.dot(this.rotational)}}class Rs{constructor(t,e,n,s){n===void 0&&(n=-1e6),s===void 0&&(s=1e6),this.id=Rs.idCounter++,this.minForce=n,this.maxForce=s,this.bi=t,this.bj=e,this.a=0,this.b=0,this.eps=0,this.jacobianElementA=new yh,this.jacobianElementB=new yh,this.enabled=!0,this.multiplier=0,this.setSpookParams(1e7,4,1/60)}setSpookParams(t,e,n){const s=e,r=t,o=n;this.a=4/(o*(1+4*s)),this.b=4*s/(1+4*s),this.eps=4/(o*o*r*(1+4*s))}computeB(t,e,n){const s=this.computeGW(),r=this.computeGq(),o=this.computeGiMf();return-r*t-s*e-o*n}computeGq(){const t=this.jacobianElementA,e=this.jacobianElementB,n=this.bi,s=this.bj,r=n.position,o=s.position;return t.spatial.dot(r)+e.spatial.dot(o)}computeGW(){const t=this.jacobianElementA,e=this.jacobianElementB,n=this.bi,s=this.bj,r=n.velocity,o=s.velocity,a=n.angularVelocity,l=s.angularVelocity;return t.multiplyVectors(r,a)+e.multiplyVectors(o,l)}computeGWlambda(){const t=this.jacobianElementA,e=this.jacobianElementB,n=this.bi,s=this.bj,r=n.vlambda,o=s.vlambda,a=n.wlambda,l=s.wlambda;return t.multiplyVectors(r,a)+e.multiplyVectors(o,l)}computeGiMf(){const t=this.jacobianElementA,e=this.jacobianElementB,n=this.bi,s=this.bj,r=n.force,o=n.torque,a=s.force,l=s.torque,c=n.invMassSolve,h=s.invMassSolve;return r.scale(c,Mh),a.scale(h,Sh),n.invInertiaWorldSolve.vmult(o,bh),s.invInertiaWorldSolve.vmult(l,wh),t.multiplyVectors(Mh,bh)+e.multiplyVectors(Sh,wh)}computeGiMGt(){const t=this.jacobianElementA,e=this.jacobianElementB,n=this.bi,s=this.bj,r=n.invMassSolve,o=s.invMassSolve,a=n.invInertiaWorldSolve,l=s.invInertiaWorldSolve;let c=r+o;return a.vmult(t.rotational,uo),c+=uo.dot(t.rotational),l.vmult(e.rotational,uo),c+=uo.dot(e.rotational),c}addToWlambda(t){const e=this.jacobianElementA,n=this.jacobianElementB,s=this.bi,r=this.bj,o=Rp;s.vlambda.addScaledVector(s.invMassSolve*t,e.spatial,s.vlambda),r.vlambda.addScaledVector(r.invMassSolve*t,n.spatial,r.vlambda),s.invInertiaWorldSolve.vmult(e.rotational,o),s.wlambda.addScaledVector(t,o,s.wlambda),r.invInertiaWorldSolve.vmult(n.rotational,o),r.wlambda.addScaledVector(t,o,r.wlambda)}computeC(){return this.computeGiMGt()+this.eps}}Rs.idCounter=0;const Mh=new E,Sh=new E,bh=new E,wh=new E,uo=new E,Rp=new E;class Ko extends Rs{constructor(t,e,n){n===void 0&&(n=1e6),super(t,e,0,n),this.restitution=0,this.ri=new E,this.rj=new E,this.ni=new E}computeB(t){const e=this.a,n=this.b,s=this.bi,r=this.bj,o=this.ri,a=this.rj,l=Pp,c=Lp,h=s.velocity,d=s.angularVelocity;s.force,s.torque;const u=r.velocity,f=r.angularVelocity;r.force,r.torque;const g=Ip,v=this.jacobianElementA,m=this.jacobianElementB,p=this.ni;o.cross(p,l),a.cross(p,c),p.negate(v.spatial),l.negate(v.rotational),m.spatial.copy(p),m.rotational.copy(c),g.copy(r.position),g.vadd(a,g),g.vsub(s.position,g),g.vsub(o,g);const x=p.dot(g),w=this.restitution+1,y=w*u.dot(p)-w*h.dot(p)+f.dot(c)-d.dot(l),M=this.computeGiMf();return-x*e-y*n-t*M}getImpactVelocityAlongNormal(){const t=Np,e=Dp,n=Up,s=Fp,r=Op;return this.bi.position.vadd(this.ri,n),this.bj.position.vadd(this.rj,s),this.bi.getVelocityAtWorldPoint(n,t),this.bj.getVelocityAtWorldPoint(s,e),t.vsub(e,r),this.ni.dot(r)}}const Pp=new E,Lp=new E,Ip=new E,Np=new E,Dp=new E,Up=new E,Fp=new E,Op=new E;class zp extends Ma{constructor(t,e,n,s,r){e===void 0&&(e=new E),s===void 0&&(s=new E),r===void 0&&(r=1e6),super(t,n),this.pivotA=e.clone(),this.pivotB=s.clone();const o=this.equationX=new Ko(t,n),a=this.equationY=new Ko(t,n),l=this.equationZ=new Ko(t,n);this.equations.push(o,a,l),o.minForce=a.minForce=l.minForce=-r,o.maxForce=a.maxForce=l.maxForce=r,o.ni.set(1,0,0),a.ni.set(0,1,0),l.ni.set(0,0,1)}update(){const t=this.bodyA,e=this.bodyB,n=this.equationX,s=this.equationY,r=this.equationZ;t.quaternion.vmult(this.pivotA,n.ri),e.quaternion.vmult(this.pivotB,n.rj),s.ri.copy(n.ri),s.rj.copy(n.rj),r.ri.copy(n.ri),r.rj.copy(n.rj)}}class Bp extends Rs{constructor(t,e,n){n===void 0&&(n={});const s=typeof n.maxForce<"u"?n.maxForce:1e6;super(t,e,-s,s),this.axisA=n.axisA?n.axisA.clone():new E(1,0,0),this.axisB=n.axisB?n.axisB.clone():new E(0,1,0),this.angle=typeof n.angle<"u"?n.angle:0}computeB(t){const e=this.a,n=this.b,s=this.axisA,r=this.axisB,o=kp,a=Gp,l=this.jacobianElementA,c=this.jacobianElementB;s.cross(r,o),r.cross(s,a),l.rotational.copy(a),c.rotational.copy(o);const h=Math.cos(this.angle)-s.dot(r),d=this.computeGW(),u=this.computeGiMf();return-h*e-d*n-t*u}}const kp=new E,Gp=new E;class Vp extends Rs{constructor(t,e,n){n===void 0&&(n={});const s=typeof n.maxForce<"u"?n.maxForce:1e6;super(t,e,-s,s),this.axisA=n.axisA?n.axisA.clone():new E(1,0,0),this.axisB=n.axisB?n.axisB.clone():new E(0,1,0),this.maxAngle=Math.PI/2}computeB(t){const e=this.a,n=this.b,s=this.axisA,r=this.axisB,o=Hp,a=Wp,l=this.jacobianElementA,c=this.jacobianElementB;s.cross(r,o),r.cross(s,a),l.rotational.copy(a),c.rotational.copy(o);const h=Math.cos(this.maxAngle)-s.dot(r),d=this.computeGW(),u=this.computeGiMf();return-h*e-d*n-t*u}}const Hp=new E,Wp=new E;class qp extends zp{constructor(t,e,n){n===void 0&&(n={});const s=typeof n.maxForce<"u"?n.maxForce:1e6,r=n.pivotA?n.pivotA.clone():new E,o=n.pivotB?n.pivotB.clone():new E;super(t,r,e,o,s),this.axisA=n.axisA?n.axisA.clone():new E,this.axisB=n.axisB?n.axisB.clone():new E,this.collideConnected=!!n.collideConnected,this.angle=typeof n.angle<"u"?n.angle:0;const a=this.coneEquation=new Bp(t,e,n),l=this.twistEquation=new Vp(t,e,n);this.twistAngle=typeof n.twistAngle<"u"?n.twistAngle:0,a.maxForce=0,a.minForce=-s,l.maxForce=0,l.minForce=-s,this.equations.push(a,l)}update(){const t=this.bodyA,e=this.bodyB,n=this.coneEquation,s=this.twistEquation;super.update(),t.vectorToWorldFrame(this.axisA,n.axisA),e.vectorToWorldFrame(this.axisB,n.axisB),this.axisA.tangents(s.axisA,s.axisA),t.vectorToWorldFrame(s.axisA,s.axisA),this.axisB.tangents(s.axisB,s.axisB),e.vectorToWorldFrame(s.axisB,s.axisB),n.angle=this.angle,s.maxAngle=this.twistAngle}}new E;new E;new E;new E;new E;new E;class Eh extends Rs{constructor(t,e,n){super(t,e,-n,n),this.ri=new E,this.rj=new E,this.t=new E}computeB(t){this.a;const e=this.b;this.bi,this.bj;const n=this.ri,s=this.rj,r=Xp,o=Yp,a=this.t;n.cross(a,r),s.cross(a,o);const l=this.jacobianElementA,c=this.jacobianElementB;a.negate(l.spatial),r.negate(l.rotational),c.spatial.copy(a),c.rotational.copy(o);const h=this.computeGW(),d=this.computeGiMf();return-h*e-t*d}}const Xp=new E,Yp=new E;class Sa{constructor(t,e,n){n=xd.defaults(n,{friction:.3,restitution:.3,contactEquationStiffness:1e7,contactEquationRelaxation:3,frictionEquationStiffness:1e7,frictionEquationRelaxation:3}),this.id=Sa.idCounter++,this.materials=[t,e],this.friction=n.friction,this.restitution=n.restitution,this.contactEquationStiffness=n.contactEquationStiffness,this.contactEquationRelaxation=n.contactEquationRelaxation,this.frictionEquationStiffness=n.frictionEquationStiffness,this.frictionEquationRelaxation=n.frictionEquationRelaxation}}Sa.idCounter=0;let _d=class yd{constructor(t){t===void 0&&(t={});let e="";typeof t=="string"&&(e=t,t={}),this.name=e,this.id=yd.idCounter++,this.friction=typeof t.friction<"u"?t.friction:-1,this.restitution=typeof t.restitution<"u"?t.restitution:-1}};_d.idCounter=0;new E;new E;new E;new E;new E;new E;new E;new E;new E;new E;new E;new E;new E;new E;new E;new E;new E;new E;new E;new fi;new E;new E;new E;new E(1,0,0),new E(0,1,0),new E(0,0,1);new E;new E;new E;new E;new E;new E;new E;new E;new E;new E;new E;new E;new E;new E;new E;new E;new E;new E;new E;new E;class fo extends or{constructor(t,e,n,s){if(t===void 0&&(t=1),e===void 0&&(e=1),n===void 0&&(n=1),s===void 0&&(s=8),t<0)throw new Error("The cylinder radiusTop cannot be negative.");if(e<0)throw new Error("The cylinder radiusBottom cannot be negative.");const r=s,o=[],a=[],l=[],c=[],h=[],d=Math.cos,u=Math.sin;o.push(new E(-e*u(0),-n*.5,e*d(0))),c.push(0),o.push(new E(-t*u(0),n*.5,t*d(0))),h.push(1);for(let g=0;g<r;g++){const v=2*Math.PI/r*(g+1),m=2*Math.PI/r*(g+.5);g<r-1?(o.push(new E(-e*u(v),-n*.5,e*d(v))),c.push(2*g+2),o.push(new E(-t*u(v),n*.5,t*d(v))),h.push(2*g+3),l.push([2*g,2*g+1,2*g+3,2*g+2])):l.push([2*g,2*g+1,1,0]),(r%2===1||g<r/2)&&a.push(new E(-u(m),0,d(m)))}l.push(c),a.push(new E(0,1,0));const f=[];for(let g=0;g<h.length;g++)f.push(h[h.length-g-1]);l.push(f),super({vertices:o,faces:l,axes:a}),this.type=Vt.types.CYLINDER,this.radiusTop=t,this.radiusBottom=e,this.height=n,this.numSegments=s}}let Zp=class extends Vt{constructor(){super({type:Vt.types.PLANE}),this.worldNormal=new E,this.worldNormalNeedsUpdate=!0,this.boundingSphereRadius=Number.MAX_VALUE}computeWorldNormal(t){const e=this.worldNormal;e.set(0,0,1),t.vmult(e,e),this.worldNormalNeedsUpdate=!1}calculateLocalInertia(t,e){return e===void 0&&(e=new E),e}volume(){return Number.MAX_VALUE}calculateWorldAABB(t,e,n,s){_i.set(0,0,1),e.vmult(_i,_i);const r=Number.MAX_VALUE;n.set(-r,-r,-r),s.set(r,r,r),_i.x===1?s.x=t.x:_i.x===-1&&(n.x=t.x),_i.y===1?s.y=t.y:_i.y===-1&&(n.y=t.y),_i.z===1?s.z=t.z:_i.z===-1&&(n.z=t.z)}updateBoundingSphereRadius(){this.boundingSphereRadius=Number.MAX_VALUE}};const _i=new E;new E;new E;new E;new E;new E;new E;new E;new E;new E;new E;new Un;new E;new Un;new E;new E;new E;new E;new E;new E;new E;new Un;new E;new _e;new Un;class Kp{constructor(){this.equations=[]}solve(t,e){return 0}addEquation(t){t.enabled&&!t.bi.isTrigger&&!t.bj.isTrigger&&this.equations.push(t)}removeEquation(t){const e=this.equations,n=e.indexOf(t);n!==-1&&e.splice(n,1)}removeAllEquations(){this.equations.length=0}}class $p extends Kp{constructor(){super(),this.iterations=10,this.tolerance=1e-7}solve(t,e){let n=0;const s=this.iterations,r=this.tolerance*this.tolerance,o=this.equations,a=o.length,l=e.bodies,c=l.length,h=t;let d,u,f,g,v,m;if(a!==0)for(let y=0;y!==c;y++)l[y].updateSolveMassProperties();const p=jp,x=Qp,w=Jp;p.length=a,x.length=a,w.length=a;for(let y=0;y!==a;y++){const M=o[y];w[y]=0,x[y]=M.computeB(h),p[y]=1/M.computeC()}if(a!==0){for(let S=0;S!==c;S++){const C=l[S],_=C.vlambda,T=C.wlambda;_.set(0,0,0),T.set(0,0,0)}for(n=0;n!==s;n++){g=0;for(let S=0;S!==a;S++){const C=o[S];d=x[S],u=p[S],m=w[S],v=C.computeGWlambda(),f=u*(d-v-C.eps*m),m+f<C.minForce?f=C.minForce-m:m+f>C.maxForce&&(f=C.maxForce-m),w[S]+=f,g+=f>0?f:-f,C.addToWlambda(f)}if(g*g<r)break}for(let S=0;S!==c;S++){const C=l[S],_=C.velocity,T=C.angularVelocity;C.vlambda.vmul(C.linearFactor,C.vlambda),_.vadd(C.vlambda,_),C.wlambda.vmul(C.angularFactor,C.wlambda),T.vadd(C.wlambda,T)}let y=o.length;const M=1/h;for(;y--;)o[y].multiplier=w[y]*M}return n}}const Jp=[],jp=[],Qp=[];class tm{constructor(){this.objects=[],this.type=Object}release(){const t=arguments.length;for(let e=0;e!==t;e++)this.objects.push(e<0||arguments.length<=e?void 0:arguments[e]);return this}get(){return this.objects.length===0?this.constructObject():this.objects.pop()}constructObject(){throw new Error("constructObject() not implemented in this Pool subclass yet!")}resize(t){const e=this.objects;for(;e.length>t;)e.pop();for(;e.length<t;)e.push(this.constructObject());return this}}class em extends tm{constructor(){super(...arguments),this.type=E}constructObject(){return new E}}const Ie={sphereSphere:Vt.types.SPHERE,spherePlane:Vt.types.SPHERE|Vt.types.PLANE,boxBox:Vt.types.BOX|Vt.types.BOX,sphereBox:Vt.types.SPHERE|Vt.types.BOX,planeBox:Vt.types.PLANE|Vt.types.BOX,convexConvex:Vt.types.CONVEXPOLYHEDRON,sphereConvex:Vt.types.SPHERE|Vt.types.CONVEXPOLYHEDRON,planeConvex:Vt.types.PLANE|Vt.types.CONVEXPOLYHEDRON,boxConvex:Vt.types.BOX|Vt.types.CONVEXPOLYHEDRON,sphereHeightfield:Vt.types.SPHERE|Vt.types.HEIGHTFIELD,boxHeightfield:Vt.types.BOX|Vt.types.HEIGHTFIELD,convexHeightfield:Vt.types.CONVEXPOLYHEDRON|Vt.types.HEIGHTFIELD,sphereParticle:Vt.types.PARTICLE|Vt.types.SPHERE,planeParticle:Vt.types.PLANE|Vt.types.PARTICLE,boxParticle:Vt.types.BOX|Vt.types.PARTICLE,convexParticle:Vt.types.PARTICLE|Vt.types.CONVEXPOLYHEDRON,cylinderCylinder:Vt.types.CYLINDER,sphereCylinder:Vt.types.SPHERE|Vt.types.CYLINDER,planeCylinder:Vt.types.PLANE|Vt.types.CYLINDER,boxCylinder:Vt.types.BOX|Vt.types.CYLINDER,convexCylinder:Vt.types.CONVEXPOLYHEDRON|Vt.types.CYLINDER,heightfieldCylinder:Vt.types.HEIGHTFIELD|Vt.types.CYLINDER,particleCylinder:Vt.types.PARTICLE|Vt.types.CYLINDER,sphereTrimesh:Vt.types.SPHERE|Vt.types.TRIMESH,planeTrimesh:Vt.types.PLANE|Vt.types.TRIMESH};class nm{get[Ie.sphereSphere](){return this.sphereSphere}get[Ie.spherePlane](){return this.spherePlane}get[Ie.boxBox](){return this.boxBox}get[Ie.sphereBox](){return this.sphereBox}get[Ie.planeBox](){return this.planeBox}get[Ie.convexConvex](){return this.convexConvex}get[Ie.sphereConvex](){return this.sphereConvex}get[Ie.planeConvex](){return this.planeConvex}get[Ie.boxConvex](){return this.boxConvex}get[Ie.sphereHeightfield](){return this.sphereHeightfield}get[Ie.boxHeightfield](){return this.boxHeightfield}get[Ie.convexHeightfield](){return this.convexHeightfield}get[Ie.sphereParticle](){return this.sphereParticle}get[Ie.planeParticle](){return this.planeParticle}get[Ie.boxParticle](){return this.boxParticle}get[Ie.convexParticle](){return this.convexParticle}get[Ie.cylinderCylinder](){return this.convexConvex}get[Ie.sphereCylinder](){return this.sphereConvex}get[Ie.planeCylinder](){return this.planeConvex}get[Ie.boxCylinder](){return this.boxConvex}get[Ie.convexCylinder](){return this.convexConvex}get[Ie.heightfieldCylinder](){return this.heightfieldCylinder}get[Ie.particleCylinder](){return this.particleCylinder}get[Ie.sphereTrimesh](){return this.sphereTrimesh}get[Ie.planeTrimesh](){return this.planeTrimesh}constructor(t){this.contactPointPool=[],this.frictionEquationPool=[],this.result=[],this.frictionResult=[],this.v3pool=new em,this.world=t,this.currentContactMaterial=t.defaultContactMaterial,this.enableFrictionReduction=!1}createContactEquation(t,e,n,s,r,o){let a;this.contactPointPool.length?(a=this.contactPointPool.pop(),a.bi=t,a.bj=e):a=new Ko(t,e),a.enabled=t.collisionResponse&&e.collisionResponse&&n.collisionResponse&&s.collisionResponse;const l=this.currentContactMaterial;a.restitution=l.restitution,a.setSpookParams(l.contactEquationStiffness,l.contactEquationRelaxation,this.world.dt);const c=n.material||t.material,h=s.material||e.material;return c&&h&&c.restitution>=0&&h.restitution>=0&&(a.restitution=c.restitution*h.restitution),a.si=r||n,a.sj=o||s,a}createFrictionEquationsFromContact(t,e){const n=t.bi,s=t.bj,r=t.si,o=t.sj,a=this.world,l=this.currentContactMaterial;let c=l.friction;const h=r.material||n.material,d=o.material||s.material;if(h&&d&&h.friction>=0&&d.friction>=0&&(c=h.friction*d.friction),c>0){const u=c*(a.frictionGravity||a.gravity).length();let f=n.invMass+s.invMass;f>0&&(f=1/f);const g=this.frictionEquationPool,v=g.length?g.pop():new Eh(n,s,u*f),m=g.length?g.pop():new Eh(n,s,u*f);return v.bi=m.bi=n,v.bj=m.bj=s,v.minForce=m.minForce=-u*f,v.maxForce=m.maxForce=u*f,v.ri.copy(t.ri),v.rj.copy(t.rj),m.ri.copy(t.ri),m.rj.copy(t.rj),t.ni.tangents(v.t,m.t),v.setSpookParams(l.frictionEquationStiffness,l.frictionEquationRelaxation,a.dt),m.setSpookParams(l.frictionEquationStiffness,l.frictionEquationRelaxation,a.dt),v.enabled=m.enabled=t.enabled,e.push(v,m),!0}return!1}createFrictionFromAverage(t){let e=this.result[this.result.length-1];if(!this.createFrictionEquationsFromContact(e,this.frictionResult)||t===1)return;const n=this.frictionResult[this.frictionResult.length-2],s=this.frictionResult[this.frictionResult.length-1];ls.setZero(),Os.setZero(),zs.setZero();const r=e.bi;e.bj;for(let a=0;a!==t;a++)e=this.result[this.result.length-1-a],e.bi!==r?(ls.vadd(e.ni,ls),Os.vadd(e.ri,Os),zs.vadd(e.rj,zs)):(ls.vsub(e.ni,ls),Os.vadd(e.rj,Os),zs.vadd(e.ri,zs));const o=1/t;Os.scale(o,n.ri),zs.scale(o,n.rj),s.ri.copy(n.ri),s.rj.copy(n.rj),ls.normalize(),ls.tangents(n.t,s.t)}getContacts(t,e,n,s,r,o,a){this.contactPointPool=r,this.frictionEquationPool=a,this.result=s,this.frictionResult=o;const l=rm,c=om,h=im,d=sm;for(let u=0,f=t.length;u!==f;u++){const g=t[u],v=e[u];let m=null;g.material&&v.material&&(m=n.getContactMaterial(g.material,v.material)||null);const p=g.type&zt.KINEMATIC&&v.type&zt.STATIC||g.type&zt.STATIC&&v.type&zt.KINEMATIC||g.type&zt.KINEMATIC&&v.type&zt.KINEMATIC;for(let x=0;x<g.shapes.length;x++){g.quaternion.mult(g.shapeOrientations[x],l),g.quaternion.vmult(g.shapeOffsets[x],h),h.vadd(g.position,h);const w=g.shapes[x];for(let y=0;y<v.shapes.length;y++){v.quaternion.mult(v.shapeOrientations[y],c),v.quaternion.vmult(v.shapeOffsets[y],d),d.vadd(v.position,d);const M=v.shapes[y];if(!(w.collisionFilterMask&M.collisionFilterGroup&&M.collisionFilterMask&w.collisionFilterGroup)||h.distanceTo(d)>w.boundingSphereRadius+M.boundingSphereRadius)continue;let S=null;w.material&&M.material&&(S=n.getContactMaterial(w.material,M.material)||null),this.currentContactMaterial=S||m||n.defaultContactMaterial;const C=w.type|M.type,_=this[C];if(_){let T=!1;w.type<M.type?T=_.call(this,w,M,h,d,l,c,g,v,w,M,p):T=_.call(this,M,w,d,h,c,l,v,g,w,M,p),T&&p&&(n.shapeOverlapKeeper.set(w.id,M.id),n.bodyOverlapKeeper.set(g.id,v.id))}}}}}sphereSphere(t,e,n,s,r,o,a,l,c,h,d){if(d)return n.distanceSquared(s)<(t.radius+e.radius)**2;const u=this.createContactEquation(a,l,t,e,c,h);s.vsub(n,u.ni),u.ni.normalize(),u.ri.copy(u.ni),u.rj.copy(u.ni),u.ri.scale(t.radius,u.ri),u.rj.scale(-e.radius,u.rj),u.ri.vadd(n,u.ri),u.ri.vsub(a.position,u.ri),u.rj.vadd(s,u.rj),u.rj.vsub(l.position,u.rj),this.result.push(u),this.createFrictionEquationsFromContact(u,this.frictionResult)}spherePlane(t,e,n,s,r,o,a,l,c,h,d){const u=this.createContactEquation(a,l,t,e,c,h);if(u.ni.set(0,0,1),o.vmult(u.ni,u.ni),u.ni.negate(u.ni),u.ni.normalize(),u.ni.scale(t.radius,u.ri),n.vsub(s,po),u.ni.scale(u.ni.dot(po),Th),po.vsub(Th,u.rj),-po.dot(u.ni)<=t.radius){if(d)return!0;const f=u.ri,g=u.rj;f.vadd(n,f),f.vsub(a.position,f),g.vadd(s,g),g.vsub(l.position,g),this.result.push(u),this.createFrictionEquationsFromContact(u,this.frictionResult)}}boxBox(t,e,n,s,r,o,a,l,c,h,d){return t.convexPolyhedronRepresentation.material=t.material,e.convexPolyhedronRepresentation.material=e.material,t.convexPolyhedronRepresentation.collisionResponse=t.collisionResponse,e.convexPolyhedronRepresentation.collisionResponse=e.collisionResponse,this.convexConvex(t.convexPolyhedronRepresentation,e.convexPolyhedronRepresentation,n,s,r,o,a,l,t,e,d)}sphereBox(t,e,n,s,r,o,a,l,c,h,d){const u=this.v3pool,f=Im;n.vsub(s,mo),e.getSideNormals(f,o);const g=t.radius;let v=!1;const m=Dm,p=Um,x=Fm;let w=null,y=0,M=0,S=0,C=null;for(let F=0,G=f.length;F!==G&&v===!1;F++){const Y=Rm;Y.copy(f[F]);const V=Y.length();Y.normalize();const q=mo.dot(Y);if(q<V+g&&q>0){const $=Pm,it=Lm;$.copy(f[(F+1)%3]),it.copy(f[(F+2)%3]);const yt=$.length(),Ft=it.length();$.normalize(),it.normalize();const Zt=mo.dot($),lt=mo.dot(it);if(Zt<yt&&Zt>-yt&&lt<Ft&&lt>-Ft){const W=Math.abs(q-V-g);if((C===null||W<C)&&(C=W,M=Zt,S=lt,w=V,m.copy(Y),p.copy($),x.copy(it),y++,d))return!0}}}if(y){v=!0;const F=this.createContactEquation(a,l,t,e,c,h);m.scale(-g,F.ri),F.ni.copy(m),F.ni.negate(F.ni),m.scale(w,m),p.scale(M,p),m.vadd(p,m),x.scale(S,x),m.vadd(x,F.rj),F.ri.vadd(n,F.ri),F.ri.vsub(a.position,F.ri),F.rj.vadd(s,F.rj),F.rj.vsub(l.position,F.rj),this.result.push(F),this.createFrictionEquationsFromContact(F,this.frictionResult)}let _=u.get();const T=Nm;for(let F=0;F!==2&&!v;F++)for(let G=0;G!==2&&!v;G++)for(let Y=0;Y!==2&&!v;Y++)if(_.set(0,0,0),F?_.vadd(f[0],_):_.vsub(f[0],_),G?_.vadd(f[1],_):_.vsub(f[1],_),Y?_.vadd(f[2],_):_.vsub(f[2],_),s.vadd(_,T),T.vsub(n,T),T.lengthSquared()<g*g){if(d)return!0;v=!0;const V=this.createContactEquation(a,l,t,e,c,h);V.ri.copy(T),V.ri.normalize(),V.ni.copy(V.ri),V.ri.scale(g,V.ri),V.rj.copy(_),V.ri.vadd(n,V.ri),V.ri.vsub(a.position,V.ri),V.rj.vadd(s,V.rj),V.rj.vsub(l.position,V.rj),this.result.push(V),this.createFrictionEquationsFromContact(V,this.frictionResult)}u.release(_),_=null;const L=u.get(),I=u.get(),U=u.get(),N=u.get(),A=u.get(),D=f.length;for(let F=0;F!==D&&!v;F++)for(let G=0;G!==D&&!v;G++)if(F%3!==G%3){f[G].cross(f[F],L),L.normalize(),f[F].vadd(f[G],I),U.copy(n),U.vsub(I,U),U.vsub(s,U);const Y=U.dot(L);L.scale(Y,N);let V=0;for(;V===F%3||V===G%3;)V++;A.copy(n),A.vsub(N,A),A.vsub(I,A),A.vsub(s,A);const q=Math.abs(Y),$=A.length();if(q<f[V].length()&&$<g){if(d)return!0;v=!0;const it=this.createContactEquation(a,l,t,e,c,h);I.vadd(N,it.rj),it.rj.copy(it.rj),A.negate(it.ni),it.ni.normalize(),it.ri.copy(it.rj),it.ri.vadd(s,it.ri),it.ri.vsub(n,it.ri),it.ri.normalize(),it.ri.scale(g,it.ri),it.ri.vadd(n,it.ri),it.ri.vsub(a.position,it.ri),it.rj.vadd(s,it.rj),it.rj.vsub(l.position,it.rj),this.result.push(it),this.createFrictionEquationsFromContact(it,this.frictionResult)}}u.release(L,I,U,N,A)}planeBox(t,e,n,s,r,o,a,l,c,h,d){return e.convexPolyhedronRepresentation.material=e.material,e.convexPolyhedronRepresentation.collisionResponse=e.collisionResponse,e.convexPolyhedronRepresentation.id=e.id,this.planeConvex(t,e.convexPolyhedronRepresentation,n,s,r,o,a,l,t,e,d)}convexConvex(t,e,n,s,r,o,a,l,c,h,d,u,f){const g=Jm;if(!(n.distanceTo(s)>t.boundingSphereRadius+e.boundingSphereRadius)&&t.findSeparatingAxis(e,n,r,s,o,g,u,f)){const v=[],m=jm;t.clipAgainstHull(n,r,e,s,o,g,-100,100,v);let p=0;for(let x=0;x!==v.length;x++){if(d)return!0;const w=this.createContactEquation(a,l,t,e,c,h),y=w.ri,M=w.rj;g.negate(w.ni),v[x].normal.negate(m),m.scale(v[x].depth,m),v[x].point.vadd(m,y),M.copy(v[x].point),y.vsub(n,y),M.vsub(s,M),y.vadd(n,y),y.vsub(a.position,y),M.vadd(s,M),M.vsub(l.position,M),this.result.push(w),p++,this.enableFrictionReduction||this.createFrictionEquationsFromContact(w,this.frictionResult)}this.enableFrictionReduction&&p&&this.createFrictionFromAverage(p)}}sphereConvex(t,e,n,s,r,o,a,l,c,h,d){const u=this.v3pool;n.vsub(s,Om);const f=e.faceNormals,g=e.faces,v=e.vertices,m=t.radius;let p=!1;for(let x=0;x!==v.length;x++){const w=v[x],y=Gm;o.vmult(w,y),s.vadd(y,y);const M=km;if(y.vsub(n,M),M.lengthSquared()<m*m){if(d)return!0;p=!0;const S=this.createContactEquation(a,l,t,e,c,h);S.ri.copy(M),S.ri.normalize(),S.ni.copy(S.ri),S.ri.scale(m,S.ri),y.vsub(s,S.rj),S.ri.vadd(n,S.ri),S.ri.vsub(a.position,S.ri),S.rj.vadd(s,S.rj),S.rj.vsub(l.position,S.rj),this.result.push(S),this.createFrictionEquationsFromContact(S,this.frictionResult);return}}for(let x=0,w=g.length;x!==w&&p===!1;x++){const y=f[x],M=g[x],S=Vm;o.vmult(y,S);const C=Hm;o.vmult(v[M[0]],C),C.vadd(s,C);const _=Wm;S.scale(-m,_),n.vadd(_,_);const T=qm;_.vsub(C,T);const L=T.dot(S),I=Xm;if(n.vsub(C,I),L<0&&I.dot(S)>0){const U=[];for(let N=0,A=M.length;N!==A;N++){const D=u.get();o.vmult(v[M[N]],D),s.vadd(D,D),U.push(D)}if(Cm(U,S,n)){if(d)return!0;p=!0;const N=this.createContactEquation(a,l,t,e,c,h);S.scale(-m,N.ri),S.negate(N.ni);const A=u.get();S.scale(-L,A);const D=u.get();S.scale(-m,D),n.vsub(s,N.rj),N.rj.vadd(D,N.rj),N.rj.vadd(A,N.rj),N.rj.vadd(s,N.rj),N.rj.vsub(l.position,N.rj),N.ri.vadd(n,N.ri),N.ri.vsub(a.position,N.ri),u.release(A),u.release(D),this.result.push(N),this.createFrictionEquationsFromContact(N,this.frictionResult);for(let F=0,G=U.length;F!==G;F++)u.release(U[F]);return}else for(let N=0;N!==M.length;N++){const A=u.get(),D=u.get();o.vmult(v[M[(N+1)%M.length]],A),o.vmult(v[M[(N+2)%M.length]],D),s.vadd(A,A),s.vadd(D,D);const F=zm;D.vsub(A,F);const G=Bm;F.unit(G);const Y=u.get(),V=u.get();n.vsub(A,V);const q=V.dot(G);G.scale(q,Y),Y.vadd(A,Y);const $=u.get();if(Y.vsub(n,$),q>0&&q*q<F.lengthSquared()&&$.lengthSquared()<m*m){if(d)return!0;const it=this.createContactEquation(a,l,t,e,c,h);Y.vsub(s,it.rj),Y.vsub(n,it.ni),it.ni.normalize(),it.ni.scale(m,it.ri),it.rj.vadd(s,it.rj),it.rj.vsub(l.position,it.rj),it.ri.vadd(n,it.ri),it.ri.vsub(a.position,it.ri),this.result.push(it),this.createFrictionEquationsFromContact(it,this.frictionResult);for(let yt=0,Ft=U.length;yt!==Ft;yt++)u.release(U[yt]);u.release(A),u.release(D),u.release(Y),u.release($),u.release(V);return}u.release(A),u.release(D),u.release(Y),u.release($),u.release(V)}for(let N=0,A=U.length;N!==A;N++)u.release(U[N])}}}planeConvex(t,e,n,s,r,o,a,l,c,h,d){const u=Ym,f=Zm;f.set(0,0,1),r.vmult(f,f);let g=0;const v=Km;for(let m=0;m!==e.vertices.length;m++)if(u.copy(e.vertices[m]),o.vmult(u,u),s.vadd(u,u),u.vsub(n,v),f.dot(v)<=0){if(d)return!0;const x=this.createContactEquation(a,l,t,e,c,h),w=$m;f.scale(f.dot(v),w),u.vsub(w,w),w.vsub(n,x.ri),x.ni.copy(f),u.vsub(s,x.rj),x.ri.vadd(n,x.ri),x.ri.vsub(a.position,x.ri),x.rj.vadd(s,x.rj),x.rj.vsub(l.position,x.rj),this.result.push(x),g++,this.enableFrictionReduction||this.createFrictionEquationsFromContact(x,this.frictionResult)}this.enableFrictionReduction&&g&&this.createFrictionFromAverage(g)}boxConvex(t,e,n,s,r,o,a,l,c,h,d){return t.convexPolyhedronRepresentation.material=t.material,t.convexPolyhedronRepresentation.collisionResponse=t.collisionResponse,this.convexConvex(t.convexPolyhedronRepresentation,e,n,s,r,o,a,l,t,e,d)}sphereHeightfield(t,e,n,s,r,o,a,l,c,h,d){const u=e.data,f=t.radius,g=e.elementSize,v=h0,m=c0;_e.pointToLocalFrame(s,o,n,m);let p=Math.floor((m.x-f)/g)-1,x=Math.ceil((m.x+f)/g)+1,w=Math.floor((m.y-f)/g)-1,y=Math.ceil((m.y+f)/g)+1;if(x<0||y<0||p>u.length||w>u[0].length)return;p<0&&(p=0),x<0&&(x=0),w<0&&(w=0),y<0&&(y=0),p>=u.length&&(p=u.length-1),x>=u.length&&(x=u.length-1),y>=u[0].length&&(y=u[0].length-1),w>=u[0].length&&(w=u[0].length-1);const M=[];e.getRectMinMax(p,w,x,y,M);const S=M[0],C=M[1];if(m.z-f>C||m.z+f<S)return;const _=this.result;for(let T=p;T<x;T++)for(let L=w;L<y;L++){const I=_.length;let U=!1;if(e.getConvexTrianglePillar(T,L,!1),_e.pointToWorldFrame(s,o,e.pillarOffset,v),n.distanceTo(v)<e.pillarConvex.boundingSphereRadius+t.boundingSphereRadius&&(U=this.sphereConvex(t,e.pillarConvex,n,v,r,o,a,l,t,e,d)),d&&U||(e.getConvexTrianglePillar(T,L,!0),_e.pointToWorldFrame(s,o,e.pillarOffset,v),n.distanceTo(v)<e.pillarConvex.boundingSphereRadius+t.boundingSphereRadius&&(U=this.sphereConvex(t,e.pillarConvex,n,v,r,o,a,l,t,e,d)),d&&U))return!0;if(_.length-I>2)return}}boxHeightfield(t,e,n,s,r,o,a,l,c,h,d){return t.convexPolyhedronRepresentation.material=t.material,t.convexPolyhedronRepresentation.collisionResponse=t.collisionResponse,this.convexHeightfield(t.convexPolyhedronRepresentation,e,n,s,r,o,a,l,t,e,d)}convexHeightfield(t,e,n,s,r,o,a,l,c,h,d){const u=e.data,f=e.elementSize,g=t.boundingSphereRadius,v=a0,m=l0,p=o0;_e.pointToLocalFrame(s,o,n,p);let x=Math.floor((p.x-g)/f)-1,w=Math.ceil((p.x+g)/f)+1,y=Math.floor((p.y-g)/f)-1,M=Math.ceil((p.y+g)/f)+1;if(w<0||M<0||x>u.length||y>u[0].length)return;x<0&&(x=0),w<0&&(w=0),y<0&&(y=0),M<0&&(M=0),x>=u.length&&(x=u.length-1),w>=u.length&&(w=u.length-1),M>=u[0].length&&(M=u[0].length-1),y>=u[0].length&&(y=u[0].length-1);const S=[];e.getRectMinMax(x,y,w,M,S);const C=S[0],_=S[1];if(!(p.z-g>_||p.z+g<C))for(let T=x;T<w;T++)for(let L=y;L<M;L++){let I=!1;if(e.getConvexTrianglePillar(T,L,!1),_e.pointToWorldFrame(s,o,e.pillarOffset,v),n.distanceTo(v)<e.pillarConvex.boundingSphereRadius+t.boundingSphereRadius&&(I=this.convexConvex(t,e.pillarConvex,n,v,r,o,a,l,null,null,d,m,null)),d&&I||(e.getConvexTrianglePillar(T,L,!0),_e.pointToWorldFrame(s,o,e.pillarOffset,v),n.distanceTo(v)<e.pillarConvex.boundingSphereRadius+t.boundingSphereRadius&&(I=this.convexConvex(t,e.pillarConvex,n,v,r,o,a,l,null,null,d,m,null)),d&&I))return!0}}sphereParticle(t,e,n,s,r,o,a,l,c,h,d){const u=n0;if(u.set(0,0,1),s.vsub(n,u),u.lengthSquared()<=t.radius*t.radius){if(d)return!0;const g=this.createContactEquation(l,a,e,t,c,h);u.normalize(),g.rj.copy(u),g.rj.scale(t.radius,g.rj),g.ni.copy(u),g.ni.negate(g.ni),g.ri.set(0,0,0),this.result.push(g),this.createFrictionEquationsFromContact(g,this.frictionResult)}}planeParticle(t,e,n,s,r,o,a,l,c,h,d){const u=Qm;u.set(0,0,1),a.quaternion.vmult(u,u);const f=t0;if(s.vsub(a.position,f),u.dot(f)<=0){if(d)return!0;const v=this.createContactEquation(l,a,e,t,c,h);v.ni.copy(u),v.ni.negate(v.ni),v.ri.set(0,0,0);const m=e0;u.scale(u.dot(s),m),s.vsub(m,m),v.rj.copy(m),this.result.push(v),this.createFrictionEquationsFromContact(v,this.frictionResult)}}boxParticle(t,e,n,s,r,o,a,l,c,h,d){return t.convexPolyhedronRepresentation.material=t.material,t.convexPolyhedronRepresentation.collisionResponse=t.collisionResponse,this.convexParticle(t.convexPolyhedronRepresentation,e,n,s,r,o,a,l,t,e,d)}convexParticle(t,e,n,s,r,o,a,l,c,h,d){let u=-1;const f=s0,g=r0;let v=null;const m=i0;if(m.copy(s),m.vsub(n,m),r.conjugate(Ah),Ah.vmult(m,m),t.pointIsInside(m)){t.worldVerticesNeedsUpdate&&t.computeWorldVertices(n,r),t.worldFaceNormalsNeedsUpdate&&t.computeWorldFaceNormals(r);for(let p=0,x=t.faces.length;p!==x;p++){const w=[t.worldVertices[t.faces[p][0]]],y=t.worldFaceNormals[p];s.vsub(w[0],Ch);const M=-y.dot(Ch);if(v===null||Math.abs(M)<Math.abs(v)){if(d)return!0;v=M,u=p,f.copy(y)}}if(u!==-1){const p=this.createContactEquation(l,a,e,t,c,h);f.scale(v,g),g.vadd(s,g),g.vsub(n,g),p.rj.copy(g),f.negate(p.ni),p.ri.set(0,0,0);const x=p.ri,w=p.rj;x.vadd(s,x),x.vsub(l.position,x),w.vadd(n,w),w.vsub(a.position,w),this.result.push(p),this.createFrictionEquationsFromContact(p,this.frictionResult)}else console.warn("Point found inside convex, but did not find penetrating face!")}}heightfieldCylinder(t,e,n,s,r,o,a,l,c,h,d){return this.convexHeightfield(e,t,s,n,o,r,l,a,c,h,d)}particleCylinder(t,e,n,s,r,o,a,l,c,h,d){return this.convexParticle(e,t,s,n,o,r,l,a,c,h,d)}sphereTrimesh(t,e,n,s,r,o,a,l,c,h,d){const u=pm,f=mm,g=gm,v=vm,m=xm,p=_m,x=bm,w=fm,y=um,M=wm;_e.pointToLocalFrame(s,o,n,m);const S=t.radius;x.lowerBound.set(m.x-S,m.y-S,m.z-S),x.upperBound.set(m.x+S,m.y+S,m.z+S),e.getTrianglesInAABB(x,M);const C=dm,_=t.radius*t.radius;for(let N=0;N<M.length;N++)for(let A=0;A<3;A++)if(e.getVertex(e.indices[M[N]*3+A],C),C.vsub(m,y),y.lengthSquared()<=_){if(w.copy(C),_e.pointToWorldFrame(s,o,w,C),C.vsub(n,y),d)return!0;let D=this.createContactEquation(a,l,t,e,c,h);D.ni.copy(y),D.ni.normalize(),D.ri.copy(D.ni),D.ri.scale(t.radius,D.ri),D.ri.vadd(n,D.ri),D.ri.vsub(a.position,D.ri),D.rj.copy(C),D.rj.vsub(l.position,D.rj),this.result.push(D),this.createFrictionEquationsFromContact(D,this.frictionResult)}for(let N=0;N<M.length;N++)for(let A=0;A<3;A++){e.getVertex(e.indices[M[N]*3+A],u),e.getVertex(e.indices[M[N]*3+(A+1)%3],f),f.vsub(u,g),m.vsub(f,p);const D=p.dot(g);m.vsub(u,p);let F=p.dot(g);if(F>0&&D<0&&(m.vsub(u,p),v.copy(g),v.normalize(),F=p.dot(v),v.scale(F,p),p.vadd(u,p),p.distanceTo(m)<t.radius)){if(d)return!0;const Y=this.createContactEquation(a,l,t,e,c,h);p.vsub(m,Y.ni),Y.ni.normalize(),Y.ni.scale(t.radius,Y.ri),Y.ri.vadd(n,Y.ri),Y.ri.vsub(a.position,Y.ri),_e.pointToWorldFrame(s,o,p,p),p.vsub(l.position,Y.rj),_e.vectorToWorldFrame(o,Y.ni,Y.ni),_e.vectorToWorldFrame(o,Y.ri,Y.ri),this.result.push(Y),this.createFrictionEquationsFromContact(Y,this.frictionResult)}}const T=ym,L=Mm,I=Sm,U=hm;for(let N=0,A=M.length;N!==A;N++){e.getTriangleVertices(M[N],T,L,I),e.getNormal(M[N],U),m.vsub(T,p);let D=p.dot(U);if(U.scale(D,p),m.vsub(p,p),D=p.distanceTo(m),fi.pointInTriangle(p,T,L,I)&&D<t.radius){if(d)return!0;let F=this.createContactEquation(a,l,t,e,c,h);p.vsub(m,F.ni),F.ni.normalize(),F.ni.scale(t.radius,F.ri),F.ri.vadd(n,F.ri),F.ri.vsub(a.position,F.ri),_e.pointToWorldFrame(s,o,p,p),p.vsub(l.position,F.rj),_e.vectorToWorldFrame(o,F.ni,F.ni),_e.vectorToWorldFrame(o,F.ri,F.ri),this.result.push(F),this.createFrictionEquationsFromContact(F,this.frictionResult)}}M.length=0}planeTrimesh(t,e,n,s,r,o,a,l,c,h,d){const u=new E,f=am;f.set(0,0,1),r.vmult(f,f);for(let g=0;g<e.vertices.length/3;g++){e.getVertex(g,u);const v=new E;v.copy(u),_e.pointToWorldFrame(s,o,v,u);const m=lm;if(u.vsub(n,m),f.dot(m)<=0){if(d)return!0;const x=this.createContactEquation(a,l,t,e,c,h);x.ni.copy(f);const w=cm;f.scale(m.dot(f),w),u.vsub(w,w),x.ri.copy(w),x.ri.vsub(a.position,x.ri),x.rj.copy(u),x.rj.vsub(l.position,x.rj),this.result.push(x),this.createFrictionEquationsFromContact(x,this.frictionResult)}}}}const ls=new E,Os=new E,zs=new E,im=new E,sm=new E,rm=new Ke,om=new Ke,am=new E,lm=new E,cm=new E,hm=new E,um=new E;new E;const dm=new E,fm=new E,pm=new E,mm=new E,gm=new E,vm=new E,xm=new E,_m=new E,ym=new E,Mm=new E,Sm=new E,bm=new Un,wm=[],po=new E,Th=new E,Em=new E,Tm=new E,Am=new E;function Cm(i,t,e){let n=null;const s=i.length;for(let r=0;r!==s;r++){const o=i[r],a=Em;i[(r+1)%s].vsub(o,a);const l=Tm;a.cross(t,l);const c=Am;e.vsub(o,c);const h=l.dot(c);if(n===null||h>0&&n===!0||h<=0&&n===!1){n===null&&(n=h>0);continue}else return!1}return!0}const mo=new E,Rm=new E,Pm=new E,Lm=new E,Im=[new E,new E,new E,new E,new E,new E],Nm=new E,Dm=new E,Um=new E,Fm=new E,Om=new E,zm=new E,Bm=new E,km=new E,Gm=new E,Vm=new E,Hm=new E,Wm=new E,qm=new E,Xm=new E;new E;new E;const Ym=new E,Zm=new E,Km=new E,$m=new E,Jm=new E,jm=new E,Qm=new E,t0=new E,e0=new E,n0=new E,Ah=new Ke,i0=new E;new E;const s0=new E,Ch=new E,r0=new E,o0=new E,a0=new E,l0=[0],c0=new E,h0=new E;class Rh{constructor(){this.current=[],this.previous=[]}getKey(t,e){if(e<t){const n=e;e=t,t=n}return t<<16|e}set(t,e){const n=this.getKey(t,e),s=this.current;let r=0;for(;n>s[r];)r++;if(n!==s[r]){for(let o=s.length-1;o>=r;o--)s[o+1]=s[o];s[r]=n}}tick(){const t=this.current;this.current=this.previous,this.previous=t,this.current.length=0}getDiff(t,e){const n=this.current,s=this.previous,r=n.length,o=s.length;let a=0;for(let l=0;l<r;l++){let c=!1;const h=n[l];for(;h>s[a];)a++;c=h===s[a],c||Ph(t,h)}a=0;for(let l=0;l<o;l++){let c=!1;const h=s[l];for(;h>n[a];)a++;c=n[a]===h,c||Ph(e,h)}}}function Ph(i,t){i.push((t&4294901760)>>16,t&65535)}const Ga=(i,t)=>i<t?`${i}-${t}`:`${t}-${i}`;class u0{constructor(){this.data={keys:[]}}get(t,e){const n=Ga(t,e);return this.data[n]}set(t,e,n){const s=Ga(t,e);this.get(t,e)||this.data.keys.push(s),this.data[s]=n}delete(t,e){const n=Ga(t,e),s=this.data.keys.indexOf(n);s!==-1&&this.data.keys.splice(s,1),delete this.data[n]}reset(){const t=this.data,e=t.keys;for(;e.length>0;){const n=e.pop();delete t[n]}}}class d0 extends ld{constructor(t){t===void 0&&(t={}),super(),this.dt=-1,this.allowSleep=!!t.allowSleep,this.contacts=[],this.frictionEquations=[],this.quatNormalizeSkip=t.quatNormalizeSkip!==void 0?t.quatNormalizeSkip:0,this.quatNormalizeFast=t.quatNormalizeFast!==void 0?t.quatNormalizeFast:!1,this.time=0,this.stepnumber=0,this.default_dt=1/60,this.nextId=0,this.gravity=new E,t.gravity&&this.gravity.copy(t.gravity),t.frictionGravity&&(this.frictionGravity=new E,this.frictionGravity.copy(t.frictionGravity)),this.broadphase=t.broadphase!==void 0?t.broadphase:new dp,this.bodies=[],this.hasActiveBodies=!1,this.solver=t.solver!==void 0?t.solver:new $p,this.constraints=[],this.narrowphase=new nm(this),this.collisionMatrix=new mh,this.collisionMatrixPrevious=new mh,this.bodyOverlapKeeper=new Rh,this.shapeOverlapKeeper=new Rh,this.contactmaterials=[],this.contactMaterialTable=new u0,this.defaultMaterial=new _d("default"),this.defaultContactMaterial=new Sa(this.defaultMaterial,this.defaultMaterial,{friction:.3,restitution:0}),this.doProfiling=!1,this.profile={solve:0,makeContactConstraints:0,broadphase:0,integrate:0,narrowphase:0},this.accumulator=0,this.subsystems=[],this.addBodyEvent={type:"addBody",body:null},this.removeBodyEvent={type:"removeBody",body:null},this.idToBodyMap={},this.broadphase.setWorld(this)}getContactMaterial(t,e){return this.contactMaterialTable.get(t.id,e.id)}collisionMatrixTick(){const t=this.collisionMatrixPrevious;this.collisionMatrixPrevious=this.collisionMatrix,this.collisionMatrix=t,this.collisionMatrix.reset(),this.bodyOverlapKeeper.tick(),this.shapeOverlapKeeper.tick()}addConstraint(t){this.constraints.push(t)}removeConstraint(t){const e=this.constraints.indexOf(t);e!==-1&&this.constraints.splice(e,1)}rayTest(t,e,n){n instanceof aa?this.raycastClosest(t,e,{skipBackfaces:!0},n):this.raycastAll(t,e,{skipBackfaces:!0},n)}raycastAll(t,e,n,s){return n===void 0&&(n={}),n.mode=fi.ALL,n.from=t,n.to=e,n.callback=s,Va.intersectWorld(this,n)}raycastAny(t,e,n,s){return n===void 0&&(n={}),n.mode=fi.ANY,n.from=t,n.to=e,n.result=s,Va.intersectWorld(this,n)}raycastClosest(t,e,n,s){return n===void 0&&(n={}),n.mode=fi.CLOSEST,n.from=t,n.to=e,n.result=s,Va.intersectWorld(this,n)}addBody(t){this.bodies.includes(t)||(t.index=this.bodies.length,this.bodies.push(t),t.world=this,t.initPosition.copy(t.position),t.initVelocity.copy(t.velocity),t.timeLastSleepy=this.time,t instanceof zt&&(t.initAngularVelocity.copy(t.angularVelocity),t.initQuaternion.copy(t.quaternion)),this.collisionMatrix.setNumObjects(this.bodies.length),this.addBodyEvent.body=t,this.idToBodyMap[t.id]=t,this.dispatchEvent(this.addBodyEvent))}removeBody(t){t.world=null;const e=this.bodies.length-1,n=this.bodies,s=n.indexOf(t);if(s!==-1){n.splice(s,1);for(let r=0;r!==n.length;r++)n[r].index=r;this.collisionMatrix.setNumObjects(e),this.removeBodyEvent.body=t,delete this.idToBodyMap[t.id],this.dispatchEvent(this.removeBodyEvent)}}getBodyById(t){return this.idToBodyMap[t]}getShapeById(t){const e=this.bodies;for(let n=0;n<e.length;n++){const s=e[n].shapes;for(let r=0;r<s.length;r++){const o=s[r];if(o.id===t)return o}}return null}addContactMaterial(t){this.contactmaterials.push(t),this.contactMaterialTable.set(t.materials[0].id,t.materials[1].id,t)}removeContactMaterial(t){const e=this.contactmaterials.indexOf(t);e!==-1&&(this.contactmaterials.splice(e,1),this.contactMaterialTable.delete(t.materials[0].id,t.materials[1].id))}fixedStep(t,e){t===void 0&&(t=1/60),e===void 0&&(e=10);const n=Ye.now()/1e3;if(!this.lastCallTime)this.step(t,void 0,e);else{const s=n-this.lastCallTime;this.step(t,s,e)}this.lastCallTime=n}step(t,e,n){if(n===void 0&&(n=10),e===void 0)this.internalStep(t),this.time+=t;else{this.accumulator+=e;const s=Ye.now();let r=0;for(;this.accumulator>=t&&r<n&&(this.internalStep(t),this.accumulator-=t,r++,!(Ye.now()-s>t*1e3)););this.accumulator=this.accumulator%t;const o=this.accumulator/t;for(let a=0;a!==this.bodies.length;a++){const l=this.bodies[a];l.previousPosition.lerp(l.position,o,l.interpolatedPosition),l.previousQuaternion.slerp(l.quaternion,o,l.interpolatedQuaternion),l.previousQuaternion.normalize()}this.time+=e}}internalStep(t){this.dt=t;const e=this.contacts,n=v0,s=x0,r=this.bodies.length,o=this.bodies,a=this.solver,l=this.gravity,c=this.doProfiling,h=this.profile,d=zt.DYNAMIC;let u=-1/0;const f=this.constraints,g=g0;l.length();const v=l.x,m=l.y,p=l.z;let x=0;for(c&&(u=Ye.now()),x=0;x!==r;x++){const N=o[x];if(N.type===d){const A=N.force,D=N.mass;A.x+=D*v,A.y+=D*m,A.z+=D*p}}for(let N=0,A=this.subsystems.length;N!==A;N++)this.subsystems[N].update();c&&(u=Ye.now()),n.length=0,s.length=0,this.broadphase.collisionPairs(this,n,s),c&&(h.broadphase=Ye.now()-u);let w=f.length;for(x=0;x!==w;x++){const N=f[x];if(!N.collideConnected)for(let A=n.length-1;A>=0;A-=1)(N.bodyA===n[A]&&N.bodyB===s[A]||N.bodyB===n[A]&&N.bodyA===s[A])&&(n.splice(A,1),s.splice(A,1))}this.collisionMatrixTick(),c&&(u=Ye.now());const y=m0,M=e.length;for(x=0;x!==M;x++)y.push(e[x]);e.length=0;const S=this.frictionEquations.length;for(x=0;x!==S;x++)g.push(this.frictionEquations[x]);for(this.frictionEquations.length=0,this.narrowphase.getContacts(n,s,this,e,y,this.frictionEquations,g),c&&(h.narrowphase=Ye.now()-u),c&&(u=Ye.now()),x=0;x<this.frictionEquations.length;x++)a.addEquation(this.frictionEquations[x]);const C=e.length;for(let N=0;N!==C;N++){const A=e[N],D=A.bi,F=A.bj,G=A.si,Y=A.sj;let V;if(D.material&&F.material?V=this.getContactMaterial(D.material,F.material)||this.defaultContactMaterial:V=this.defaultContactMaterial,V.friction,D.material&&F.material&&(D.material.friction>=0&&F.material.friction>=0&&D.material.friction*F.material.friction,D.material.restitution>=0&&F.material.restitution>=0&&(A.restitution=D.material.restitution*F.material.restitution)),a.addEquation(A),D.allowSleep&&D.type===zt.DYNAMIC&&D.sleepState===zt.SLEEPING&&F.sleepState===zt.AWAKE&&F.type!==zt.STATIC){const q=F.velocity.lengthSquared()+F.angularVelocity.lengthSquared(),$=F.sleepSpeedLimit**2;q>=$*2&&(D.wakeUpAfterNarrowphase=!0)}if(F.allowSleep&&F.type===zt.DYNAMIC&&F.sleepState===zt.SLEEPING&&D.sleepState===zt.AWAKE&&D.type!==zt.STATIC){const q=D.velocity.lengthSquared()+D.angularVelocity.lengthSquared(),$=D.sleepSpeedLimit**2;q>=$*2&&(F.wakeUpAfterNarrowphase=!0)}this.collisionMatrix.set(D,F,!0),this.collisionMatrixPrevious.get(D,F)||(_r.body=F,_r.contact=A,D.dispatchEvent(_r),_r.body=D,F.dispatchEvent(_r)),this.bodyOverlapKeeper.set(D.id,F.id),this.shapeOverlapKeeper.set(G.id,Y.id)}for(this.emitContactEvents(),c&&(h.makeContactConstraints=Ye.now()-u,u=Ye.now()),x=0;x!==r;x++){const N=o[x];N.wakeUpAfterNarrowphase&&(N.wakeUp(),N.wakeUpAfterNarrowphase=!1)}for(w=f.length,x=0;x!==w;x++){const N=f[x];N.update();for(let A=0,D=N.equations.length;A!==D;A++){const F=N.equations[A];a.addEquation(F)}}a.solve(t,this),c&&(h.solve=Ye.now()-u),a.removeAllEquations();const _=Math.pow;for(x=0;x!==r;x++){const N=o[x];if(N.type&d){const A=_(1-N.linearDamping,t),D=N.velocity;D.scale(A,D);const F=N.angularVelocity;if(F){const G=_(1-N.angularDamping,t);F.scale(G,F)}}}this.dispatchEvent(p0),c&&(u=Ye.now());const L=this.stepnumber%(this.quatNormalizeSkip+1)===0,I=this.quatNormalizeFast;for(x=0;x!==r;x++)o[x].integrate(t,L,I);this.clearForces(),this.broadphase.dirty=!0,c&&(h.integrate=Ye.now()-u),this.stepnumber+=1,this.dispatchEvent(f0);let U=!0;if(this.allowSleep)for(U=!1,x=0;x!==r;x++){const N=o[x];N.sleepTick(this.time),N.sleepState!==zt.SLEEPING&&(U=!0)}this.hasActiveBodies=U}emitContactEvents(){const t=this.hasAnyEventListener("beginContact"),e=this.hasAnyEventListener("endContact");if((t||e)&&this.bodyOverlapKeeper.getDiff(yi,Mi),t){for(let r=0,o=yi.length;r<o;r+=2)yr.bodyA=this.getBodyById(yi[r]),yr.bodyB=this.getBodyById(yi[r+1]),this.dispatchEvent(yr);yr.bodyA=yr.bodyB=null}if(e){for(let r=0,o=Mi.length;r<o;r+=2)Mr.bodyA=this.getBodyById(Mi[r]),Mr.bodyB=this.getBodyById(Mi[r+1]),this.dispatchEvent(Mr);Mr.bodyA=Mr.bodyB=null}yi.length=Mi.length=0;const n=this.hasAnyEventListener("beginShapeContact"),s=this.hasAnyEventListener("endShapeContact");if((n||s)&&this.shapeOverlapKeeper.getDiff(yi,Mi),n){for(let r=0,o=yi.length;r<o;r+=2){const a=this.getShapeById(yi[r]),l=this.getShapeById(yi[r+1]);Si.shapeA=a,Si.shapeB=l,a&&(Si.bodyA=a.body),l&&(Si.bodyB=l.body),this.dispatchEvent(Si)}Si.bodyA=Si.bodyB=Si.shapeA=Si.shapeB=null}if(s){for(let r=0,o=Mi.length;r<o;r+=2){const a=this.getShapeById(Mi[r]),l=this.getShapeById(Mi[r+1]);bi.shapeA=a,bi.shapeB=l,a&&(bi.bodyA=a.body),l&&(bi.bodyB=l.body),this.dispatchEvent(bi)}bi.bodyA=bi.bodyB=bi.shapeA=bi.shapeB=null}}clearForces(){const t=this.bodies,e=t.length;for(let n=0;n!==e;n++){const s=t[n];s.force,s.torque,s.force.set(0,0,0),s.torque.set(0,0,0)}}}new Un;const Va=new fi,Ye=globalThis.performance||{};if(!Ye.now){let i=Date.now();Ye.timing&&Ye.timing.navigationStart&&(i=Ye.timing.navigationStart),Ye.now=()=>Date.now()-i}new E;const f0={type:"postStep"},p0={type:"preStep"},_r={type:zt.COLLIDE_EVENT_NAME,body:null,contact:null},m0=[],g0=[],v0=[],x0=[],yi=[],Mi=[],yr={type:"beginContact",bodyA:null,bodyB:null},Mr={type:"endContact",bodyA:null,bodyB:null},Si={type:"beginShapeContact",bodyA:null,bodyB:null,shapeA:null,shapeB:null},bi={type:"endShapeContact",bodyA:null,bodyB:null,shapeA:null,shapeB:null},Gr=i=>{const t=Math.sin(i*127.1+311.7)*43758.5453;return t-Math.floor(t)};function Ii(i){const t=Math.floor(i),e=i-t,n=e*e*(3-2*e);return Gr(t)+(Gr(t+1)-Gr(t))*n}function vs(i,t){return Gr(i*57.31+t*13.77)}const ba=(i,t=0,e=1)=>Math.max(t,Math.min(e,i)),Lh=.6;function Cc(i,t){const e=ze[i];return ba((t+e.length/2)/e.length)}function In(i,t){const e=ze[i],n=Cc(i,t);if(i==="claude"){const s=[[0,.18],[.24,.72],[.44,1],[.65,.63],[.85,.27],[1,.13]];let r=0;for(;r<s.length-2&&n>s[r+1][0];)r++;const[o,a]=s[r],[l,c]=s[r+1],h=(n-o)/(l-o),d=h*h*(3-2*h);return e.radius*(a+(c-a)*d)}if(i==="carrot"){const s=Math.min(1,n/.07),r=Math.sqrt(Math.max(0,1-(1-s)**2)),o=.04+.96*Math.pow(1-n,.82),a=n>.96?Math.sqrt((1-n)/.04):1;return e.radius*Math.max(.02,r*o*a*(1+.05*(Ii(n*7.3)-.5)))}if(i==="zucchini"){const s=Math.min(n/.1,(1-n)/.08),r=s<1?Math.sqrt(Math.max(0,1-(1-s)**2)):1;return e.radius*Math.max(.14,r)*(.9+.12*n)*(1+.025*(Ii(n*5.1+3)-.5))}if(i==="tomato"){const s=n<.5?2.9:2.2,r=Math.pow(Math.max(0,1-Math.pow(Math.abs(2*n-1),s)),1/s);return e.radius*Math.max(.07,r)}return e.radius}function Md(i,t){const e=i*22+1.2*Ii(i*5),n=Math.floor(e),s=Math.pow(Math.max(0,Math.cos((e-n-.5)*Math.PI*2)),18),r=ba((Math.sin(t+Gr(n)*6.283)+.15)*1.6);return s*r}function _0(i,t){return ba((Math.sin(10*t+.4*Math.sin(i*4)+Math.PI)-.25)/.7)}function Sd(i,t){const e=Math.pow(Math.max(0,1-Math.abs(2*i-1)),.5)*(i<.5?1:.45);return Math.cos(5*t+.35*Math.sin(2*t))*e}function bd(i){return Math.pow(.5-.5*Math.cos(14*i),1.6)}function wd(i,t,e){e=(e%(Math.PI*2)+Math.PI*2)%(Math.PI*2);const n=In(i,t),s=Cc(i,t);if(i==="carrot")return n*(1+.032*Math.sin(2*e+3.1*s+.7)+.022*Math.sin(3*e-5*s)-.05*Md(s,e));if(i==="zucchini"){const r=ba(Math.min(s,1-s)/.08);return n*(1+r*(.022*Math.cos(10*e+.4*Math.sin(s*4))+.008*(Ii(Math.sin(e)*3+s*20)-.5)))}return i==="tomato"?n*(1+.06*Sd(s,e)+.01*(Ii(Math.sin(e)*4+s*9)-.5)):i==="pasta"?n*(1-.07*bd(e)):n}const Zi=i=>Array.isArray(i)?new E(...i):new E(i.x,i.y,i.z),yn=(i,t,e)=>Math.max(t,Math.min(e,i)),Cn=i=>(i.a+i.b)/2,Rn=new E(fe.x,1.056,fe.z),wi=new E(-.4,.918,-.51),Bs=new E(1,0,0),mn=(i,t)=>{const e=i.length();e>t&&i.scale(t/e,i)},go=i=>i?.position?.length===3&&i?.quaternion?.length===4&&[...i.position,...i.quaternion].every(Number.isFinite),Sr=i=>({position:i.position.toArray(),quaternion:i.quaternion.toArray(),velocity:i.velocity.toArray(),angularVelocity:i.angularVelocity.toArray()});function y0(i){const t=new d0({gravity:new E(0,-9.81,0),allowSleep:!0});t.broadphase=new nr(t),t.solver.iterations=24,t.solver.tolerance=1e-7,Object.assign(t.defaultContactMaterial,{friction:.42,restitution:.04,contactEquationStiffness:1e7,contactEquationRelaxation:4});const e=new Map,n=new Map,s=new Map,r=new Map;let o=null,a=null,l=null,c=Rn.clone(),h=0,d=null,u=0;function f(z,et,nt){const J=new zt({mass:0,shape:z,position:Zi(et)});return J.kind=nt,t.addBody(J),J}f(new ai(new E(1.675,.0425,.7)),[.02,.84,.11],"counter"),f(new ai(new E(le.width/2,.044,le.depth/2)),[le.x,le.y-.044,le.z],"board"),f(new ai(new E(.55,.0375,.525)),[fe.x,.922,fe.z],"counter"),f(new fo(.32,.32,.055,20),[fe.x,.974,fe.z],"counter");for(let z=0;z<4;z++){const et=z*Math.PI/2;f(new ai(new E(.15,.0175,.0225)),[fe.x+Math.cos(et)*.29,1.01,fe.z+Math.sin(et)*.29],"counter").quaternion.setFromEuler(0,-et,0)}f(new fo(.35,.35,.035,24),[-.4,.9005,-.51],"plate");for(let z=0;z<28;z++){const et=z*Math.PI*2/28;f(new ai(new E(.012,.03,.04)),[wi.x+Math.cos(et)*.34,wi.y+.014,wi.z+Math.sin(et)*.34],"plate").quaternion.setFromEuler(0,-et,0)}f(new Zp,[0,.015,0],"floor").quaternion.setFromEuler(-Math.PI/2,0,0);const v=new zt({mass:3,position:Rn.clone(),linearDamping:.35,angularDamping:.8,allowSleep:!0,sleepSpeedLimit:.06,sleepTimeLimit:.7});v.kind="pan",t.addBody(v),go(i.panPose)&&(v.position.set(...i.panPose.position),v.quaternion.set(...i.panPose.quaternion));function m(){for(;v.shapes.length;)v.removeShape(v.shapes[0]);v.addShape(new fo(.415,.415,.055,28));const z=i.vessel==="pot"?.29:.115;for(let et=0;et<24;et++){const nt=et*Math.PI/12,J=new Ke;J.setFromAxisAngle(new E(0,1,0),-nt),v.addShape(new ai(new E(.02,z/2,.058)),new E(Math.cos(nt)*.435,z/2+.02,Math.sin(nt)*.435),J)}v.updateMassProperties(),v.updateBoundingRadius(),v.aabbNeedsUpdate=!0,v.wakeUp(),d=i.vessel}m();const p=new E(-.17,1.08,.63),x=new zt({mass:.09,shape:new ai(new E(.03,.095,.022)),position:p.clone(),linearDamping:.25,angularDamping:.65});x.kind="lighter",t.addBody(x),go(i.lighterPose)&&i.lighterPose.position[1]>=0&&i.lighterPose.position[1]<3&&Math.abs(i.lighterPose.position[0])<3&&Math.abs(i.lighterPose.position[2])<3&&Math.hypot(...i.lighterPose.quaternion)>.5&&(x.position.set(...i.lighterPose.position),x.quaternion.set(...i.lighterPose.quaternion));let w=null,y=new Ke,M=null;function S(z,et){if(!Number.isFinite(z)||!Number.isFinite(et))return;const nt=w?x:a?v:o?.body;if(!nt)return;let J=w?y:a?M??=v.quaternion.clone():o.rotation??=nt.quaternion.clone();const k=new Ke;k.setFromEuler(yn(et,-.3,.3),yn(z,-.3,.3),0),k.mult(J,J),J.normalize(),nt.wakeUp()}function C(z,et){const nt=z.quaternion.conjugate(),J=et.mult(nt);J.w<0&&(J.x*=-1,J.y*=-1,J.z*=-1,J.w*=-1),z.angularVelocity.set(J.x*16,J.y*16,J.z*16),mn(z.angularVelocity,5),z.torque.setZero()}function _(){if(![...x.position.toArray(),...x.quaternion.toArray(),...x.velocity.toArray(),...x.angularVelocity.toArray()].every(Number.isFinite)||x.position.y<-.5||x.position.y>3.5||Math.abs(x.position.x)>4||Math.abs(x.position.z)>4||Math.hypot(...x.quaternion.toArray())<.5){U();return}x.quaternion.normalize(),mn(x.velocity,3),mn(x.angularVelocity,6);const z=x.position.x,et=x.position.z;let nt=.015;Math.abs(z-.02)<1.645&&Math.abs(et-.11)<.67&&(nt=.8825),Math.abs(z-le.x)<le.width/2-.03&&Math.abs(et-le.z)<le.depth/2-.03&&(nt=le.y);const J=[new E(.03,0,0),new E(0,.095,0),new E(0,0,.022)],k=J.reduce((Q,ht)=>Q+Math.abs(x.quaternion.vmult(ht).y),0);x.position.y-k<nt&&(x.position.y=nt+k+1e-4,x.velocity.y=Math.max(0,x.velocity.y),x.aabbNeedsUpdate=!0)}function T(){return Ft(),_(),y.copy(x.quaternion),x.fixedRotation=!0,x.updateMassProperties(),x.angularVelocity.setZero(),w=x.position.clone(),w.y=Math.max(1.02,w.y+.14),x.wakeUp(),w}function L(z){w&&w.set(yn(z.x,-1.6,1.6),yn(z.y,.92,2.1),yn(z.z,-.6,.8))}function I(){w=null,x.fixedRotation=!1,x.updateMassProperties(),x.angularVelocity.setZero(),mn(x.velocity,1.3),mn(x.angularVelocity,4)}function U(){w=null,x.fixedRotation=!1,x.updateMassProperties(),x.force.setZero(),x.torque.setZero(),x.position.copy(p),x.quaternion.set(0,0,0,1),x.velocity.setZero(),x.angularVelocity.setZero(),x.wakeUp()}function N(z){const et=z.links[0];return et.body.pointToWorldFrame(new E(Cn(z.item)-Cn(et),0,0))}function A(z){if(z.type!=="claude")return[{a:z.a,b:z.b}];const et=[z.a,...[-.19,-.055,.08,.2].filter(nt=>nt>z.a+.012&&nt<z.b-.012),z.b];return et.slice(1).map((nt,J)=>({a:et[J],b:nt}))}function D(z,et){const nt=ze[z.type],J=A(z),k=new Ke;k.setFromEuler(0,z.angle||0,0);let Q=new E(z.x+Cn(z),le.y+nt.radius+.035,z.z);z.zone==="pan"&&(Q.x+=v.position.x-Rn.x,Q.z+=v.position.z-Rn.z,Q.y=v.position.y+.15+nt.radius+[...n.values()].filter(vt=>vt.item.zone==="pan").length*.035),z.zone==="plate"&&Q.set(wi.x,wi.y+nt.radius+.04,wi.z),go(z.pose)&&(Q=Zi(z.pose.position),k.set(...z.pose.quaternion),k.normalize());const ht={item:z,links:[],joints:[]};for(let vt=0;vt<J.length;vt++){const O=J[vt],Rt=O.b-O.a;let At=.008;for(let st=0;st<=8;st++)At=Math.max(At,In(z.type,O.a+Rt*st/8));const P=new zt({mass:Rt*Math.PI*nt.radius*nt.radius*80,linearDamping:.12,angularDamping:z.type==="claude"?.62:.48,allowSleep:!0,sleepSpeedLimit:.06,sleepTimeLimit:.8}),b=new Ke;b.setFromEuler(0,0,-Math.PI/2),P.addShape(new fo(At,At,Rt,12),new E,b),P.foodId=z.id,P.kind="food",P.radius=At,P.zone=z.zone;const H=et?et(Cn(O)):z.links?.find(st=>Math.abs(st.a-O.a)<1e-7&&Math.abs(st.b-O.b)<1e-7);go(H)?(P.position.set(...H.position),P.quaternion.set(...H.quaternion),P.quaternion.normalize(),H.velocity?.every(Number.isFinite)&&P.velocity.set(...H.velocity),H.angularVelocity?.every(Number.isFinite)&&P.angularVelocity.set(...H.angularVelocity)):(P.position.copy(Q.vadd(k.vmult(new E(Cn(O)-Cn(z),0,0)))),P.quaternion.copy(k),z.pose?.velocity&&P.velocity.set(...z.pose.velocity),z.pose?.angularVelocity&&P.angularVelocity.set(...z.pose.angularVelocity)),z.plated&&(P.type=zt.KINEMATIC,P.collisionResponse=!1,P.velocity.setZero(),P.angularVelocity.setZero());const tt={...O,body:P};if(ht.links.push(tt),t.addBody(P),vt){const st=ht.links[vt-1],bt=new qp(st.body,P,{pivotA:new E((st.b-st.a)/2,0,0),pivotB:new E(-Rt/2,0,0),axisA:Bs,axisB:Bs,angle:.52,twistAngle:.22,maxForce:Math.max(150,P.mass*220),collideConnected:!1});t.addConstraint(bt),ht.joints.push(bt)}}return n.set(z.id,ht),e.set(z.id,ht.links[0].body),ht}function F(z){const et=n.get(z);if(et){o?.id===z&&Ft();for(const nt of et.joints)t.removeConstraint(nt);for(const nt of et.links)t.removeBody(nt.body);n.delete(z),e.delete(z),s.delete(z),r.delete(z)}}function G(){const z=new Map(i.items.map(et=>[et.id,et]));for(const[et,nt]of n)z.get(et)!==nt.item&&F(et);for(const et of i.items)n.has(et.id)||D(et);d!==i.vessel&&m(),i.physics=!0}function Y(){const z=new Map,et=[];for(const J of t.contacts){const k=J.bi,Q=J.bj;if(k.kind==="food"&&Q.kind==="food")k.foodId!==Q.foodId&&et.push([k.foodId,Q.foodId]);else{const ht=k.kind==="food"?k:Q.kind==="food"?Q:null,vt=ht===k?Q:k;if(ht){let O=z.get(ht.foodId);O||z.set(ht.foodId,O=new Set),O.add(vt.kind)}}}for(const[J,k]of n)k.links.every(Q=>Q.body.sleepState===zt.SLEEPING)&&!z.has(J)&&s.has(J)&&z.set(J,new Set(s.get(J)));const nt=new Set;for(const[J,k]of z)k.has("pan")&&nt.add(J);for(let J=0;J<6;J++)for(const[k,Q]of et)(nt.has(k)||nt.has(Q))&&(nt.add(k),nt.add(Q));for(const[J,k]of n){const Q=k.item,ht=k.links[0].body,vt=z.get(J)||new Set,O=o?.id===J;Q.panContact=!O&&k.links.some(b=>{const H=b.body,tt=v.pointToLocalFrame(H.position),st=Math.hypot(tt.x,tt.z)<.42,bt=tt.y<.04+(i.vessel==="pot"?.29:.115)+H.radius*.8,Ct=i.water>.035&&st&&tt.y-H.radius<.035+i.water*.21&&tt.y>0;return st&&bt&&(Ct||nt.has(J)&&Math.abs(H.velocity.y-v.velocity.y)<.45)});let Rt=O?"air":Q.plated?"plate":Q.panContact?"pan":vt.has("board")?"board":vt.has("plate")?"plate":vt.has("counter")?"counter":vt.has("floor")?"floor":"air";Rt==="air"&&!O&&k.links.every(b=>b.body.sleepState===zt.SLEEPING)&&(Rt=ht.zone);const At=N(k);Q.zone=Rt;for(const b of k.links)b.body.zone=Rt;Q.x=At.x-Cn(Q),Q.z=At.z,Q.pose={...Sr(ht),position:At.toArray()},Q.type==="claude"?Q.links=k.links.map(b=>({a:b.a,b:b.b,...Sr(b.body)})):delete Q.links;const P=ht.quaternion.vmult(Bs);Q.angle=Math.atan2(-P.z,P.x),vt.size&&s.set(J,vt)}i.panPose=Sr(v),i.lighterPose=Sr(x)}function V(z,et,nt,J,k,Q){const ht=z.pointToWorldFrame(et),vt=ht.vsub(z.position),O=z.getVelocityAtWorldPoint(ht,new E),Rt=nt.vsub(ht);Rt.scale(J*k,Rt),Rt.vsub(O.scale(J*Q),Rt),Rt.y+=J*9.81,mn(Rt,J*55),z.applyForce(Rt,vt),z.wakeUp()}function q(z){G(),h+=yn(Number.isFinite(z)?z:0,0,.25);let et=0;for(;h>=1/120&&et++<30;){const nt=.008333333333333333;if(l&&(l===1?(c.set(v.position.x,1.52,v.position.z),v.position.y>1.47&&(l=2)):l===2?(c.set(Rn.x,1.52,Rn.z),Math.hypot(v.position.x-Rn.x,v.position.z-Rn.z)<.035&&(l=3)):(c.copy(Rn),v.position.distanceTo(Rn)<.025&&v.velocity.length()<.12&&(l=null))),a||l){V(v,new E,c,v.mass+1,150,25);const J=v.quaternion.vmult(new E(0,1,0)),k=v.quaternion.vmult(Bs),Q=Math.hypot(k.x,k.z)||1,ht=a?u:0,vt=new E(-Math.sin(ht)*k.x/Q,Math.cos(ht),-Math.sin(ht)*k.z/Q),O=J.cross(vt);v.torque.vadd(O.scale(28),v.torque),v.torque.vsub(v.angularVelocity.scale(4),v.torque),mn(v.velocity,1.6)}if(o){const J=n.get(o.id),k=o.body;if(J){const Q=Zi(o.target).vsub(o.filtered);mn(Q,2.7*nt),o.filtered.vadd(Q,o.filtered),V(k,o.local,o.filtered,J.links.reduce((ht,vt)=>ht+vt.body.mass,0),190,28)}}for(const J of n.values())for(let k=0;k<J.links.length;k++){const Q=J.links[k].body;if(mn(Q.velocity,6),mn(Q.angularVelocity,14),k){const ht=J.links[k-1].body,vt=ht.quaternion.vmult(Bs),O=Q.quaternion.vmult(Bs),Rt=vt.cross(O),At=Rt.scale(Math.min(ht.mass,Q.mass)*.35);ht.torque.vadd(At,ht.torque),Q.torque.vsub(At,Q.torque)}}_(),w&&(V(x,new E,w,x.mass,210,29),x.quaternion.slerp(y,1-Math.exp(-nt*12),x.quaternion),x.angularVelocity.setZero(),x.torque.setZero(),x.aabbNeedsUpdate=!0,mn(x.velocity,1.8)),o?.rotation&&C(o.body,o.rotation),a&&M&&C(v,M),t.step(nt),_();for(const[J,k]of r){if(k.serving){k.time+=nt;const Q=n.get(J);if(!Q){r.delete(J);continue}const ht=H=>(H=yn(H,0,1),H*H*(3-2*H)),vt=k.time,O=ht(vt/.35),Rt=ht((vt-.35)/.65),At=ht((vt-1)/.35),P=Math.max(k.from.y,k.destination.y)+.48,b=new E(k.from.x+(k.destination.x-k.from.x)*Rt,k.from.y+(P-k.from.y)*O+(k.destination.y-P)*At,k.from.z+(k.destination.z-k.from.z)*Rt);for(let H=0;H<Q.links.length;H++){const tt=Q.links[H].body,st=new E(Cn(Q.links[H])-Cn(Q.item),0,0);tt.position.copy(b.vadd(st)),k.rotations[H].slerp(new Ke,Rt,tt.quaternion),tt.velocity.setZero(),tt.angularVelocity.setZero(),tt.aabbNeedsUpdate=!0,vt>=1.35&&(Q.item.plated=!0,tt.type=zt.KINEMATIC,tt.collisionResponse=!1,tt.updateMassProperties())}vt>=1.35&&r.delete(J);continue}if(k.wait-=nt,k.wait<=0){const Q=n.get(J);if(Q){const ht=Q.links[0].body,vt=N(Q),O=ht.velocity.y,Rt=(O+Math.sqrt(Math.max(0,O*O+2*9.81*(vt.y-k.destination.y))))/9.81,At=-Math.log(.88),P=At/(1-Math.exp(-At*Math.max(.1,Rt)));for(const b of Q.links)b.body.velocity.x=(k.destination.x-vt.x)*P,b.body.velocity.z=(k.destination.z-vt.z)*P}r.delete(J)}}h-=nt}for(const[nt,J]of n)J.links.some(k=>![...k.body.position.toArray(),...k.body.quaternion.toArray()].every(Number.isFinite)||k.body.position.y<-3||Math.abs(k.body.position.x)>8||Math.abs(k.body.position.z)>8)&&Tt(J);(v.position.y<-2||Math.abs(v.position.x)>4||Math.abs(v.position.z)>4)&&(v.position.copy(Rn),v.velocity.setZero(),v.angularVelocity.setZero(),v.quaternion.set(0,0,0,1)),_(),Y()}function $(z,et,nt){if(Number.isInteger(nt)&&z.links[nt])return z.links[nt];let J=z.links[0],k=1/0;for(const Q of z.links){const ht=Q.body.pointToLocalFrame(et),vt=Math.hypot(Math.max(0,Math.abs(ht.x)-(Q.b-Q.a)/2),ht.y,ht.z);vt<k&&(k=vt,J=Q)}return J}function it(z,et,nt){G();const J=n.get(z);if(!J)return!1;delete J.item.plated;for(const ht of J.links)ht.body.type=zt.DYNAMIC,ht.body.collisionResponse=!0,ht.body.updateMassProperties();Ft();const k=Zi(et),Q=$(J,k,nt).body;o={id:z,body:Q,local:Q.pointToLocalFrame(k),target:{x:k.x,y:k.y+.18,z:k.z},filtered:k.clone()};for(const ht of J.links)ht.body.wakeUp();return s.delete(z),!0}function yt(z){o&&(o.target={x:yn(z.x,-2.5,2.5),y:yn(z.y,.4,2.2),z:yn(z.z,-1.5,1.7)})}function Ft(){if(o){const z=n.get(o.id);if(z)for(const et of z.links)mn(et.body.velocity,2.8),mn(et.body.angularVelocity,8),et.body.wakeUp()}o=null}function Zt(z){G();let et=0;for(const nt of n.values())if((z===void 0||z===nt.item.id)&&nt.item.panContact){for(const J of nt.links){const k=J.body,Q=v.position.vsub(k.position);k.wakeUp(),k.applyImpulse(new E(Q.x*k.mass*.7,k.mass*(i.water>.035?1.3:2),Q.z*k.mass*.7),new E(.025,0,.01))}nt.item.panContact=!1,nt.item.side=1-nt.item.side,et++}return et}function lt(z,et){G();let nt=0;for(const J of z){const k=n.get(J);if(!k)continue;delete k.item.plated;for(const P of k.links)P.body.type=zt.DYNAMIC,P.body.collisionResponse=!0,P.body.updateMassProperties();o?.id===J&&Ft(),k.links[0].body;const Q=N(k),ht=et==="pan"?v.position.clone():et==="plate"?wi.clone():new E(le.x,le.y,le.z),vt=nt*2.4,O=et==="pan"?.025:Math.min(.19,nt*.025);ht.x+=Math.cos(vt)*O,ht.z+=Math.sin(vt)*O,et==="plate"&&(ht.x=wi.x,ht.z=wi.z+[0,-.2,.2][nt%3],ht.y+=Math.floor(nt/3)*.23+.025),ht.y+=(et==="pan"?.06:0)+ze[k.item.type].radius;const Rt=Math.max(Q.y,ht.y)+.62,At=Math.sqrt(2*9.81*(Rt-Q.y));for(const P of k.links)P.body.velocity.set(0,At,0),P.body.angularVelocity.set(.1,.1,.05),P.body.wakeUp();if(et==="plate"){for(const P of k.links)P.body.type=zt.KINEMATIC,P.body.collisionResponse=!1,P.body.velocity.setZero(),P.body.angularVelocity.setZero();r.set(J,{serving:!0,time:0,from:Q.clone(),destination:ht,rotations:k.links.map(P=>P.body.quaternion.clone())})}else r.set(J,{destination:ht,wait:.22});s.delete(J),nt++}return nt}function W(z){return Ft(),M=null,l=null,a=Zi(z).vsub(v.position),c=v.position.clone(),c.y+=.1,v.wakeUp(),!0}function rt(z){a&&(c=Zi(z).vsub(a),c.x=yn(c.x,-1.12,1.3),c.z=yn(c.z,-.25,.52),c.y=yn(c.y,1.04,1.62))}function dt(){M=null,a=null,u=0,mn(v.velocity,.65),mn(v.angularVelocity,1.2),v.wakeUp()}function Mt(){Ft(),a=null,l=1,v.wakeUp()}function _t(z,et,nt){G();const J=n.get(z),k=J?.item;if(!J||k.zone!=="board"||o?.id===z||J.links.some(P=>P.body.velocity.length()>.4||P.body.angularVelocity.length()>1.2))return null;const Q=$(J,Zi(et),nt),ht=Q.body.pointToLocalFrame(Zi(et)),vt=ht.x+Cn(Q),O=J.links.map(P=>({...P,pose:Sr(P.body)})),Rt=P=>{const b=O.find(bt=>P>=bt.a-1e-7&&P<=bt.b+1e-7)||O[O.length-1],H=b.body.quaternion.vmult(new E(P-Cn(b),0,0)),tt=b.body.position.vadd(H),st=b.body.velocity.vadd(b.body.angularVelocity.cross(H));return{...b.pose,position:tt.toArray(),velocity:st.toArray()}},At=Of(i,z,k.x+vt);if(!At)return null;F(z);for(let P=0;P<At.length;P++){const b=At[P],H=D(b,Rt);for(const tt of H.links){const st=tt.body.quaternion.vmult(new E(P?.0015:-.0015,0,0));tt.body.position.vadd(st,tt.body.position),tt.body.applyImpulse(tt.body.quaternion.vmult(new E((P?1:-1)*tt.body.mass*.035,0,0)))}}return Y(),At}function Tt(z){const et=1.65+z.item.id%4*.14;for(const nt of z.links){const J=nt.body;J.position.set(le.x+Cn(nt)-Cn(z.item),et,le.z),J.velocity.setZero(),J.angularVelocity.setZero(),J.quaternion.set(0,0,0,1),J.wakeUp()}s.delete(z.item.id)}function kt(){let z=0;for(const et of n.values())(et.item.zone==="floor"||Math.abs(et.item.x)>1.8||Math.abs(et.item.z)>.95)&&(Tt(et),z++);return z}function ct(){Ft(),U();for(const z of[...n.keys()])F(z);for(const z of i.items)delete z.pose,delete z.links,delete z.panContact;a=null,l=null,u=0,v.position.copy(Rn),v.velocity.setZero(),v.angularVelocity.setZero(),v.quaternion.set(0,0,0,1),c=Rn.clone(),r.clear(),h=0,i.panPose=null}return{world:t,bodies:e,rigs:n,step:q,rotateHeld:S,beginLighterGrab:T,moveLighter:L,endLighterGrab:I,get lighter(){return x},get lighterTip(){return x.pointToWorldFrame(new E(0,.146,-.004))},beginGrab:it,moveGrab:yt,endGrab:Ft,toss:Zt,transfer:lt,beginPanGrab:W,movePan:rt,endPanGrab:dt,dockPan:Mt,cut:_t,recover:kt,reset:ct,get grab(){return o},get pan(){return v},get panTilt(){return u},setPanTilt(z){M=null,u=yn(Number(z)||0,0,1.2),a&&v.wakeUp()},get panHeld(){return!!a},dispose(){ct();for(const z of[...t.bodies])t.removeBody(z)}}}const Rc="186",rs={ROTATE:0,DOLLY:1,PAN:2},ir={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},M0=0,Ih=1,S0=2,$o=1,Ed=2,Fr=3,ws=0,En=1,Ge=2,Oi=0,Vr=1,Ms=2,Nh=3,Dh=4,b0=5,tr=100,w0=101,E0=102,T0=103,A0=104,C0=200,R0=201,P0=202,L0=203,Td=204,Ad=205,I0=206,N0=207,D0=208,U0=209,F0=210,O0=211,z0=212,B0=213,k0=214,Cl=0,Rl=1,Pl=2,$r=3,Ll=4,Il=5,Nl=6,Dl=7,Cd=0,G0=1,V0=2,pi=0,Rd=1,Pd=2,Ld=3,Pc=4,Id=5,Nd=6,Dd=7,Ud=300,Es=301,cr=302,Ha=303,Wa=304,wa=306,Ul=1e3,Ni=1001,Fl=1002,en=1003,H0=1004,vo=1005,dn=1006,qa=1007,xs=1008,Nn=1009,Fd=1010,Od=1011,Jr=1012,Lc=1013,mi=1014,Zn=1015,gi=1016,Ic=1017,Nc=1018,jr=1020,zd=35902,Bd=35899,kd=1021,Gd=1022,Kn=1023,ki=1026,_s=1027,Ea=1028,Dc=1029,Ts=1030,Uc=1031,Fc=1033,Jo=33776,jo=33777,Qo=33778,ta=33779,Ol=35840,zl=35841,Bl=35842,kl=35843,Gl=36196,Vl=37492,Hl=37496,Wl=37488,ql=37489,la=37490,Xl=37491,Yl=37808,Zl=37809,Kl=37810,$l=37811,Jl=37812,jl=37813,Ql=37814,tc=37815,ec=37816,nc=37817,ic=37818,sc=37819,rc=37820,oc=37821,ac=36492,lc=36494,cc=36495,hc=36283,uc=36284,ca=36285,dc=36286,W0=3200,ha=0,q0=1,ss="",bn="srgb",ua="srgb-linear",da="linear",be="srgb",Xa=7680,X0=519,Y0=512,Z0=513,K0=514,Oc=515,$0=516,J0=517,zc=518,j0=519,Q0=35044,tg=35048,Uh="300 es",ui=2e3,Qr=2001;function eg(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function fa(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function ng(){const i=fa("canvas");return i.style.display="block",i}const Fh={};function Oh(...i){const t="THREE."+i.shift();console.log(t,...i)}function Vd(i){const t=i[0];if(typeof t=="string"&&t.startsWith("TSL:")){const e=i[1];e&&e.isStackTrace?i[0]+=" "+e.getLocation():i[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return i}function ne(...i){i=Vd(i);const t="THREE."+i.shift();{const e=i[0];e&&e.isStackTrace?console.warn(e.getError(t)):console.warn(t,...i)}}function ge(...i){i=Vd(i);const t="THREE."+i.shift();{const e=i[0];e&&e.isStackTrace?console.error(e.getError(t)):console.error(t,...i)}}function ar(...i){const t=i.join(" ");t in Fh||(Fh[t]=!0,ne(...i))}function ig(i,t,e){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}const sg={[Cl]:Rl,[Pl]:Nl,[Ll]:Dl,[$r]:Il,[Rl]:Cl,[Nl]:Pl,[Dl]:Ll,[Il]:$r};class as{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){const n=this._listeners;return n===void 0?!1:n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){const n=this._listeners;if(n===void 0)return;const s=n[t];if(s!==void 0){const r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){const e=this._listeners;if(e===void 0)return;const n=e[t.type];if(n!==void 0){t.target=this;const s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,t);t.target=null}}}const ln=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let zh=1234567;const Hr=Math.PI/180,hr=180/Math.PI;function Ps(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(ln[i&255]+ln[i>>8&255]+ln[i>>16&255]+ln[i>>24&255]+"-"+ln[t&255]+ln[t>>8&255]+"-"+ln[t>>16&15|64]+ln[t>>24&255]+"-"+ln[e&63|128]+ln[e>>8&255]+"-"+ln[e>>16&255]+ln[e>>24&255]+ln[n&255]+ln[n>>8&255]+ln[n>>16&255]+ln[n>>24&255]).toLowerCase()}function re(i,t,e){return Math.max(t,Math.min(e,i))}function Bc(i,t){return(i%t+t)%t}function rg(i,t,e,n,s){return n+(i-t)*(s-n)/(e-t)}function og(i,t,e){return i!==t?(e-i)/(t-i):0}function Wr(i,t,e){return(1-e)*i+e*t}function ag(i,t,e,n){return Wr(i,t,1-Math.exp(-e*n))}function lg(i,t=1){return t-Math.abs(Bc(i,t*2)-t)}function cg(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*(3-2*i))}function hg(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*i*(i*(i*6-15)+10))}function ug(i,t){return i+Math.floor(Math.random()*(t-i+1))}function dg(i,t){return i+Math.random()*(t-i)}function fg(i){return i*(.5-Math.random())}function pg(i){i!==void 0&&(zh=i);let t=zh+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function mg(i){return i*Hr}function gg(i){return i*hr}function vg(i){return i>0&&Number.isInteger(i)&&2**Math.round(Math.log2(i))===i}function xg(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function _g(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function yg(i,t,e,n,s){const r=Math.cos,o=Math.sin,a=r(e/2),l=o(e/2),c=r((t+n)/2),h=o((t+n)/2),d=r((t-n)/2),u=o((t-n)/2),f=r((n-t)/2),g=o((n-t)/2);switch(s){case"XYX":i.set(a*h,l*d,l*u,a*c);break;case"YZY":i.set(l*u,a*h,l*d,a*c);break;case"ZXZ":i.set(l*d,l*u,a*h,a*c);break;case"XZX":i.set(a*h,l*g,l*f,a*c);break;case"YXY":i.set(l*f,a*h,l*g,a*c);break;case"ZYZ":i.set(l*g,l*f,a*h,a*c);break;default:ne("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function er(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:case Uint8ClampedArray:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function gn(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}const qr={DEG2RAD:Hr,RAD2DEG:hr,generateUUID:Ps,clamp:re,euclideanModulo:Bc,mapLinear:rg,inverseLerp:og,lerp:Wr,damp:ag,pingpong:lg,smoothstep:cg,smootherstep:hg,randInt:ug,randFloat:dg,randFloatSpread:fg,seededRandom:pg,degToRad:mg,radToDeg:gg,isPowerOfTwo:vg,ceilPowerOfTwo:xg,floorPowerOfTwo:_g,setQuaternionFromProperEuler:yg,normalize:gn,denormalize:er},rh=class rh{constructor(t=0,e=0){this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("THREE.Vector2: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=re(this.x,t.x,e.x),this.y=re(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=re(this.x,t,e),this.y=re(this.y,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(re(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(re(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,o=this.y-t.y;return this.x=r*n-o*s+t.x,this.y=r*s+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};rh.prototype.isVector2=!0;let Et=rh;class xn{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,o,a){let l=n[s+0],c=n[s+1],h=n[s+2],d=n[s+3],u=r[o+0],f=r[o+1],g=r[o+2],v=r[o+3];if(d!==v||l!==u||c!==f||h!==g){let m=l*u+c*f+h*g+d*v;m<0&&(u=-u,f=-f,g=-g,v=-v,m=-m);let p=1-a;if(m<.9995){const x=Math.acos(m),w=Math.sin(x);p=Math.sin(p*x)/w,a=Math.sin(a*x)/w,l=l*p+u*a,c=c*p+f*a,h=h*p+g*a,d=d*p+v*a}else{l=l*p+u*a,c=c*p+f*a,h=h*p+g*a,d=d*p+v*a;const x=1/Math.sqrt(l*l+c*c+h*h+d*d);l*=x,c*=x,h*=x,d*=x}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=d}static multiplyQuaternionsFlat(t,e,n,s,r,o){const a=n[s],l=n[s+1],c=n[s+2],h=n[s+3],d=r[o],u=r[o+1],f=r[o+2],g=r[o+3];return t[e]=a*g+h*d+l*f-c*u,t[e+1]=l*g+h*u+c*d-a*f,t[e+2]=c*g+h*f+a*u-l*d,t[e+3]=h*g-a*d-l*u-c*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,s=t._y,r=t._z,o=t._order,a=Math.cos,l=Math.sin,c=a(n/2),h=a(s/2),d=a(r/2),u=l(n/2),f=l(s/2),g=l(r/2);switch(o){case"XYZ":this._x=u*h*d+c*f*g,this._y=c*f*d-u*h*g,this._z=c*h*g+u*f*d,this._w=c*h*d-u*f*g;break;case"YXZ":this._x=u*h*d+c*f*g,this._y=c*f*d-u*h*g,this._z=c*h*g-u*f*d,this._w=c*h*d+u*f*g;break;case"ZXY":this._x=u*h*d-c*f*g,this._y=c*f*d+u*h*g,this._z=c*h*g+u*f*d,this._w=c*h*d-u*f*g;break;case"ZYX":this._x=u*h*d-c*f*g,this._y=c*f*d+u*h*g,this._z=c*h*g-u*f*d,this._w=c*h*d+u*f*g;break;case"YZX":this._x=u*h*d+c*f*g,this._y=c*f*d+u*h*g,this._z=c*h*g-u*f*d,this._w=c*h*d-u*f*g;break;case"XZY":this._x=u*h*d-c*f*g,this._y=c*f*d-u*h*g,this._z=c*h*g+u*f*d,this._w=c*h*d+u*f*g;break;default:ne("Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],s=e[4],r=e[8],o=e[1],a=e[5],l=e[9],c=e[2],h=e[6],d=e[10],u=n+a+d;if(u>0){const f=.5/Math.sqrt(u+1);this._w=.25/f,this._x=(h-l)*f,this._y=(r-c)*f,this._z=(o-s)*f}else if(n>a&&n>d){const f=2*Math.sqrt(1+n-a-d);this._w=(h-l)/f,this._x=.25*f,this._y=(s+o)/f,this._z=(r+c)/f}else if(a>d){const f=2*Math.sqrt(1+a-n-d);this._w=(r-c)/f,this._x=(s+o)/f,this._y=.25*f,this._z=(l+h)/f}else{const f=2*Math.sqrt(1+d-n-a);this._w=(o-s)/f,this._x=(r+c)/f,this._y=(l+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<1e-8?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(re(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,s=t._y,r=t._z,o=t._w,a=e._x,l=e._y,c=e._z,h=e._w;return this._x=n*h+o*a+s*c-r*l,this._y=s*h+o*l+r*a-n*c,this._z=r*h+o*c+n*l-s*a,this._w=o*h-n*a-s*l-r*c,this._onChangeCallback(),this}slerp(t,e){let n=t._x,s=t._y,r=t._z,o=t._w,a=this.dot(t);a<0&&(n=-n,s=-s,r=-r,o=-o,a=-a);let l=1-e;if(a<.9995){const c=Math.acos(a),h=Math.sin(c);l=Math.sin(l*c)/h,e=Math.sin(e*c)/h,this._x=this._x*l+n*e,this._y=this._y*l+s*e,this._z=this._z*l+r*e,this._w=this._w*l+o*e,this._onChangeCallback()}else this._x=this._x*l+n*e,this._y=this._y*l+s*e,this._z=this._z*l+r*e,this._w=this._w*l+o*e,this.normalize();return this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}const oh=class oh{constructor(t=0,e=0,n=0){this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("THREE.Vector3: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Bh.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Bh.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=t.elements,o=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(t){const e=this.x,n=this.y,s=this.z,r=t.x,o=t.y,a=t.z,l=t.w,c=2*(o*s-a*n),h=2*(a*e-r*s),d=2*(r*n-o*e);return this.x=e+l*c+o*d-a*h,this.y=n+l*h+a*c-r*d,this.z=s+l*d+r*h-o*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=re(this.x,t.x,e.x),this.y=re(this.y,t.y,e.y),this.z=re(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=re(this.x,t,e),this.y=re(this.y,t,e),this.z=re(this.z,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(re(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,s=t.y,r=t.z,o=e.x,a=e.y,l=e.z;return this.x=s*l-r*a,this.y=r*o-n*l,this.z=n*a-s*o,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return Ya.copy(this).projectOnVector(t),this.sub(Ya)}reflect(t){return this.sub(Ya.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(re(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};oh.prototype.isVector3=!0;let B=oh;const Ya=new B,Bh=new xn,ah=class ah{constructor(t,e,n,s,r,o,a,l,c){this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,l,c)}set(t,e,n,s,r,o,a,l,c){const h=this.elements;return h[0]=t,h[1]=s,h[2]=a,h[3]=e,h[4]=r,h[5]=l,h[6]=n,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],h=n[4],d=n[7],u=n[2],f=n[5],g=n[8],v=s[0],m=s[3],p=s[6],x=s[1],w=s[4],y=s[7],M=s[2],S=s[5],C=s[8];return r[0]=o*v+a*x+l*M,r[3]=o*m+a*w+l*S,r[6]=o*p+a*y+l*C,r[1]=c*v+h*x+d*M,r[4]=c*m+h*w+d*S,r[7]=c*p+h*y+d*C,r[2]=u*v+f*x+g*M,r[5]=u*m+f*w+g*S,r[8]=u*p+f*y+g*C,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8];return e*o*h-e*a*c-n*r*h+n*a*l+s*r*c-s*o*l}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],d=h*o-a*c,u=a*l-h*r,f=c*r-o*l,g=e*d+n*u+s*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/g;return t[0]=d*v,t[1]=(s*c-h*n)*v,t[2]=(a*n-s*o)*v,t[3]=u*v,t[4]=(h*e-s*l)*v,t[5]=(s*r-a*e)*v,t[6]=f*v,t[7]=(n*l-c*e)*v,t[8]=(o*e-n*r)*v,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,o,a){const l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*o+c*a)+o+t,-s*c,s*l,-s*(-c*o+l*a)+a+e,0,0,1),this}scale(t,e){return ar("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(Za.makeScale(t,e)),this}rotate(t){return ar("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(Za.makeRotation(-t)),this}translate(t,e){return ar("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(Za.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}};ah.prototype.isMatrix3=!0;let se=ah;const Za=new se,kh=new se().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Gh=new se().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Mg(){const i={enabled:!0,workingColorSpace:ua,spaces:{},convert:function(s,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===be&&(s.r=zi(s.r),s.g=zi(s.g),s.b=zi(s.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===be&&(s.r=lr(s.r),s.g=lr(s.g),s.b=lr(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===ss?da:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,o){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return ar("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return ar("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[ua]:{primaries:t,whitePoint:n,transfer:da,toXYZ:kh,fromXYZ:Gh,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:bn},outputColorSpaceConfig:{drawingBufferColorSpace:bn}},[bn]:{primaries:t,whitePoint:n,transfer:be,toXYZ:kh,fromXYZ:Gh,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:bn}}}),i}const me=Mg();function zi(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function lr(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let ks;class Sg{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let n;if(t instanceof HTMLCanvasElement)n=t;else{ks===void 0&&(ks=fa("canvas")),ks.width=t.width,ks.height=t.height;const s=ks.getContext("2d");t instanceof ImageData?s.putImageData(t,0,0):s.drawImage(t,0,0,t.width,t.height),n=ks}return n.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=fa("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=zi(r[o]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(zi(e[n]/255)*255):e[n]=zi(e[n]);return{data:e,width:t.width,height:t.height}}else return ne("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let bg=0;class kc{constructor(t=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:bg++}),this.uuid=Ps(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){const e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):typeof VideoFrame<"u"&&e instanceof VideoFrame?t.set(e.displayWidth,e.displayHeight,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(Ka(s[o].image)):r.push(Ka(s[o]))}else r=Ka(s);n.url=r}return e||(t.images[this.uuid]=n),n}}function Ka(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Sg.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(ne("Texture: Unable to serialize Texture."),{})}let wg=0;const $a=new B;class fn extends as{constructor(t=fn.DEFAULT_IMAGE,e=fn.DEFAULT_MAPPING,n=Ni,s=Ni,r=dn,o=xs,a=Kn,l=Nn,c=fn.DEFAULT_ANISOTROPY,h=ss){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:wg++}),this.uuid=Ps(),this.name="",this.source=new kc(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new Et(0,0),this.repeat=new Et(1,1),this.center=new Et(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new se,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize($a).x}get height(){return this.source.getSize($a).y}get depth(){return this.source.getSize($a).z}get image(){return this.source.data}set image(t){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.normalized=t.normalized,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(const e in t){const n=t[e];if(n===void 0){ne(`Texture.setValues(): parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){ne(`Texture.setValues(): property '${e}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Ud)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Ul:t.x=t.x-Math.floor(t.x);break;case Ni:t.x=t.x<0?0:1;break;case Fl:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Ul:t.y=t.y-Math.floor(t.y);break;case Ni:t.y=t.y<0?0:1;break;case Fl:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}fn.DEFAULT_IMAGE=null;fn.DEFAULT_MAPPING=Ud;fn.DEFAULT_ANISOTROPY=1;const lh=class lh{constructor(t=0,e=0,n=0,s=1){this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("THREE.Vector4: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=this.w,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*e+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*e+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*e+o[7]*n+o[11]*s+o[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r;const l=t.elements,c=l[0],h=l[4],d=l[8],u=l[1],f=l[5],g=l[9],v=l[2],m=l[6],p=l[10];if(Math.abs(h-u)<.01&&Math.abs(d-v)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+u)<.1&&Math.abs(d+v)<.1&&Math.abs(g+m)<.1&&Math.abs(c+f+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const w=(c+1)/2,y=(f+1)/2,M=(p+1)/2,S=(h+u)/4,C=(d+v)/4,_=(g+m)/4;return w>y&&w>M?w<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(w),s=S/n,r=C/n):y>M?y<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(y),n=S/s,r=_/s):M<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(M),n=C/r,s=_/r),this.set(n,s,r,e),this}let x=Math.sqrt((m-g)*(m-g)+(d-v)*(d-v)+(u-h)*(u-h));return Math.abs(x)<.001&&(x=1),this.x=(m-g)/x,this.y=(d-v)/x,this.z=(u-h)/x,this.w=Math.acos((c+f+p-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=re(this.x,t.x,e.x),this.y=re(this.y,t.y,e.y),this.z=re(this.z,t.z,e.z),this.w=re(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=re(this.x,t,e),this.y=re(this.y,t,e),this.z=re(this.z,t,e),this.w=re(this.w,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(re(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};lh.prototype.isVector4=!0;let Ue=lh;class Eg extends as{constructor(t=1,e=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:dn,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=n.depth,this.scissor=new Ue(0,0,t,e),this.scissorTest=!1,this.viewport=new Ue(0,0,t,e),this.textures=[];const s={width:t,height:e,depth:n.depth},r=new fn(s),o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(t={}){const e={minFilter:dn,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),t!==null&&t.renderTarget===null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=n,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,n=t.textures.length;e<n;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;const s=Object.assign({},t.textures[e].image);this.textures[e].source=new kc(s)}if(this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveColorBuffer=t.resolveColorBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,this.storeMultisampledColorBuffer=t.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=t.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=t.storeMultisampledStencilBuffer,t.depthTexture!==null)if(t.depthTexture.renderTarget===t){const e=t.depthTexture.clone();e.renderTarget=null,this.depthTexture=e}else this.depthTexture=t.depthTexture;return this.samples=t.samples,this.multiview=t.multiview,this.useArrayDepthTexture=t.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}}class $n extends Eg{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class Hd extends fn{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=en,this.minFilter=en,this.wrapR=Ni,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(t){return super.copy(t),this.wrapR=t.wrapR,this}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class Tg extends fn{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=en,this.minFilter=en,this.wrapR=Ni,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(t){return super.copy(t),this.wrapR=t.wrapR,this}}const ya=class ya{constructor(t,e,n,s,r,o,a,l,c,h,d,u,f,g,v,m){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,l,c,h,d,u,f,g,v,m)}set(t,e,n,s,r,o,a,l,c,h,d,u,f,g,v,m){const p=this.elements;return p[0]=t,p[4]=e,p[8]=n,p[12]=s,p[1]=r,p[5]=o,p[9]=a,p[13]=l,p[2]=c,p[6]=h,p[10]=d,p[14]=u,p[3]=f,p[7]=g,p[11]=v,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ya().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return this.determinantAffine()===0?(t.set(1,0,0),e.set(0,1,0),n.set(0,0,1),this):(t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){if(t.determinantAffine()===0)return this.identity();const e=this.elements,n=t.elements,s=1/Gs.setFromMatrixColumn(t,0).length(),r=1/Gs.setFromMatrixColumn(t,1).length(),o=1/Gs.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,s=t.y,r=t.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),d=Math.sin(r);if(t.order==="XYZ"){const u=o*h,f=o*d,g=a*h,v=a*d;e[0]=l*h,e[4]=-l*d,e[8]=c,e[1]=f+g*c,e[5]=u-v*c,e[9]=-a*l,e[2]=v-u*c,e[6]=g+f*c,e[10]=o*l}else if(t.order==="YXZ"){const u=l*h,f=l*d,g=c*h,v=c*d;e[0]=u+v*a,e[4]=g*a-f,e[8]=o*c,e[1]=o*d,e[5]=o*h,e[9]=-a,e[2]=f*a-g,e[6]=v+u*a,e[10]=o*l}else if(t.order==="ZXY"){const u=l*h,f=l*d,g=c*h,v=c*d;e[0]=u-v*a,e[4]=-o*d,e[8]=g+f*a,e[1]=f+g*a,e[5]=o*h,e[9]=v-u*a,e[2]=-o*c,e[6]=a,e[10]=o*l}else if(t.order==="ZYX"){const u=o*h,f=o*d,g=a*h,v=a*d;e[0]=l*h,e[4]=g*c-f,e[8]=u*c+v,e[1]=l*d,e[5]=v*c+u,e[9]=f*c-g,e[2]=-c,e[6]=a*l,e[10]=o*l}else if(t.order==="YZX"){const u=o*l,f=o*c,g=a*l,v=a*c;e[0]=l*h,e[4]=v-u*d,e[8]=g*d+f,e[1]=d,e[5]=o*h,e[9]=-a*h,e[2]=-c*h,e[6]=f*d+g,e[10]=u-v*d}else if(t.order==="XZY"){const u=o*l,f=o*c,g=a*l,v=a*c;e[0]=l*h,e[4]=-d,e[8]=c*h,e[1]=u*d+v,e[5]=o*h,e[9]=f*d-g,e[2]=g*d-f,e[6]=a*h,e[10]=v*d+u}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Ag,t,Cg)}lookAt(t,e,n){const s=this.elements;return Pn.subVectors(t,e),Pn.lengthSq()===0&&(Pn.z=1),Pn.normalize(),Ki.crossVectors(n,Pn),Ki.lengthSq()===0&&(Math.abs(n.z)===1?Pn.x+=1e-4:Pn.z+=1e-4,Pn.normalize(),Ki.crossVectors(n,Pn)),Ki.normalize(),xo.crossVectors(Pn,Ki),s[0]=Ki.x,s[4]=xo.x,s[8]=Pn.x,s[1]=Ki.y,s[5]=xo.y,s[9]=Pn.y,s[2]=Ki.z,s[6]=xo.z,s[10]=Pn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],h=n[1],d=n[5],u=n[9],f=n[13],g=n[2],v=n[6],m=n[10],p=n[14],x=n[3],w=n[7],y=n[11],M=n[15],S=s[0],C=s[4],_=s[8],T=s[12],L=s[1],I=s[5],U=s[9],N=s[13],A=s[2],D=s[6],F=s[10],G=s[14],Y=s[3],V=s[7],q=s[11],$=s[15];return r[0]=o*S+a*L+l*A+c*Y,r[4]=o*C+a*I+l*D+c*V,r[8]=o*_+a*U+l*F+c*q,r[12]=o*T+a*N+l*G+c*$,r[1]=h*S+d*L+u*A+f*Y,r[5]=h*C+d*I+u*D+f*V,r[9]=h*_+d*U+u*F+f*q,r[13]=h*T+d*N+u*G+f*$,r[2]=g*S+v*L+m*A+p*Y,r[6]=g*C+v*I+m*D+p*V,r[10]=g*_+v*U+m*F+p*q,r[14]=g*T+v*N+m*G+p*$,r[3]=x*S+w*L+y*A+M*Y,r[7]=x*C+w*I+y*D+M*V,r[11]=x*_+w*U+y*F+M*q,r[15]=x*T+w*N+y*G+M*$,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],o=t[1],a=t[5],l=t[9],c=t[13],h=t[2],d=t[6],u=t[10],f=t[14],g=t[3],v=t[7],m=t[11],p=t[15],x=l*f-c*u,w=a*f-c*d,y=a*u-l*d,M=o*f-c*h,S=o*u-l*h,C=o*d-a*h;return e*(v*x-m*w+p*y)-n*(g*x-m*M+p*S)+s*(g*w-v*M+p*C)-r*(g*y-v*S+m*C)}determinantAffine(){const t=this.elements,e=t[0],n=t[4],s=t[8],r=t[1],o=t[5],a=t[9],l=t[2],c=t[6],h=t[10];return e*(o*h-a*c)-n*(r*h-a*l)+s*(r*c-o*l)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],d=t[9],u=t[10],f=t[11],g=t[12],v=t[13],m=t[14],p=t[15],x=e*a-n*o,w=e*l-s*o,y=e*c-r*o,M=n*l-s*a,S=n*c-r*a,C=s*c-r*l,_=h*v-d*g,T=h*m-u*g,L=h*p-f*g,I=d*m-u*v,U=d*p-f*v,N=u*p-f*m,A=x*N-w*U+y*I+M*L-S*T+C*_;if(A===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const D=1/A;return t[0]=(a*N-l*U+c*I)*D,t[1]=(s*U-n*N-r*I)*D,t[2]=(v*C-m*S+p*M)*D,t[3]=(u*S-d*C-f*M)*D,t[4]=(l*L-o*N-c*T)*D,t[5]=(e*N-s*L+r*T)*D,t[6]=(m*y-g*C-p*w)*D,t[7]=(h*C-u*y+f*w)*D,t[8]=(o*U-a*L+c*_)*D,t[9]=(n*L-e*U-r*_)*D,t[10]=(g*S-v*y+p*x)*D,t[11]=(d*y-h*S-f*x)*D,t[12]=(a*T-o*I-l*_)*D,t[13]=(e*I-n*T+s*_)*D,t[14]=(v*w-g*M-m*x)*D,t[15]=(h*M-d*w+u*x)*D,this}scale(t){const e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),s=Math.sin(e),r=1-n,o=t.x,a=t.y,l=t.z,c=r*o,h=r*a;return this.set(c*o+n,c*a-s*l,c*l+s*a,0,c*a+s*l,h*a+n,h*l-s*o,0,c*l-s*a,h*l+s*o,r*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,o){return this.set(1,n,r,0,t,1,o,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){const s=this.elements,r=e._x,o=e._y,a=e._z,l=e._w,c=r+r,h=o+o,d=a+a,u=r*c,f=r*h,g=r*d,v=o*h,m=o*d,p=a*d,x=l*c,w=l*h,y=l*d,M=n.x,S=n.y,C=n.z;return s[0]=(1-(v+p))*M,s[1]=(f+y)*M,s[2]=(g-w)*M,s[3]=0,s[4]=(f-y)*S,s[5]=(1-(u+p))*S,s[6]=(m+x)*S,s[7]=0,s[8]=(g+w)*C,s[9]=(m-x)*C,s[10]=(1-(u+v))*C,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){const s=this.elements;t.x=s[12],t.y=s[13],t.z=s[14];const r=this.determinantAffine();if(r===0)return n.set(1,1,1),e.identity(),this;let o=Gs.set(s[0],s[1],s[2]).length();const a=Gs.set(s[4],s[5],s[6]).length(),l=Gs.set(s[8],s[9],s[10]).length();r<0&&(o=-o),Hn.copy(this);const c=1/o,h=1/a,d=1/l;return Hn.elements[0]*=c,Hn.elements[1]*=c,Hn.elements[2]*=c,Hn.elements[4]*=h,Hn.elements[5]*=h,Hn.elements[6]*=h,Hn.elements[8]*=d,Hn.elements[9]*=d,Hn.elements[10]*=d,e.setFromRotationMatrix(Hn),n.x=o,n.y=a,n.z=l,this}makePerspective(t,e,n,s,r,o,a=ui,l=!1){const c=this.elements,h=2*r/(e-t),d=2*r/(n-s),u=(e+t)/(e-t),f=(n+s)/(n-s);let g,v;if(l)g=r/(o-r),v=o*r/(o-r);else if(a===ui)g=-(o+r)/(o-r),v=-2*o*r/(o-r);else if(a===Qr)g=-o/(o-r),v=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=d,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=g,c[14]=v,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,s,r,o,a=ui,l=!1){const c=this.elements,h=2/(e-t),d=2/(n-s),u=-(e+t)/(e-t),f=-(n+s)/(n-s);let g,v;if(l)g=1/(o-r),v=o/(o-r);else if(a===ui)g=-2/(o-r),v=-(o+r)/(o-r);else if(a===Qr)g=-1/(o-r),v=-r/(o-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=0,c[12]=u,c[1]=0,c[5]=d,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=g,c[14]=v,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}};ya.prototype.isMatrix4=!0;let Ee=ya;const Gs=new B,Hn=new Ee,Ag=new B(0,0,0),Cg=new B(1,1,1),Ki=new B,xo=new B,Pn=new B,Vh=new Ee,Hh=new xn;class os{constructor(t=0,e=0,n=0,s=os.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const s=t.elements,r=s[0],o=s[4],a=s[8],l=s[1],c=s[5],h=s[9],d=s[2],u=s[6],f=s[10];switch(e){case"XYZ":this._y=Math.asin(re(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(u,c),this._z=0);break;case"YXZ":this._x=Math.asin(-re(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-d,r),this._z=0);break;case"ZXY":this._x=Math.asin(re(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-d,f),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-re(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(u,f),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(re(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-d,r)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-re(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(u,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:ne("Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Vh.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Vh,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Hh.setFromEuler(this),this.setFromQuaternion(Hh,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}os.DEFAULT_ORDER="XYZ";class Gc{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let Rg=0;const Wh=new B,Vs=new xn,Ei=new Ee,_o=new B,br=new B,Pg=new B,Lg=new xn,qh=new B(1,0,0),Xh=new B(0,1,0),Yh=new B(0,0,1),Zh={type:"added"},Ig={type:"removed"},Hs={type:"childadded",child:null},Ja={type:"childremoved",child:null};class Je extends as{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Rg++}),this.uuid=Ps(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Je.DEFAULT_UP.clone();const t=new B,e=new os,n=new xn,s=new B(1,1,1);function r(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new Ee},normalMatrix:{value:new se}}),this.matrix=new Ee,this.matrixWorld=new Ee,this.matrixAutoUpdate=Je.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Je.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Gc,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Vs.setFromAxisAngle(t,e),this.quaternion.multiply(Vs),this}rotateOnWorldAxis(t,e){return Vs.setFromAxisAngle(t,e),this.quaternion.premultiply(Vs),this}rotateX(t){return this.rotateOnAxis(qh,t)}rotateY(t){return this.rotateOnAxis(Xh,t)}rotateZ(t){return this.rotateOnAxis(Yh,t)}translateOnAxis(t,e){return Wh.copy(t).applyQuaternion(this.quaternion),this.position.add(Wh.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(qh,t)}translateY(t){return this.translateOnAxis(Xh,t)}translateZ(t){return this.translateOnAxis(Yh,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Ei.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?_o.copy(t):_o.set(t,e,n);const s=this.parent;this.updateWorldMatrix(!0,!1),br.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Ei.lookAt(br,_o,this.up):Ei.lookAt(_o,br,this.up),this.quaternion.setFromRotationMatrix(Ei),s&&(Ei.extractRotation(s.matrixWorld),Vs.setFromRotationMatrix(Ei),this.quaternion.premultiply(Vs.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(ge("Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Zh),Hs.child=t,this.dispatchEvent(Hs),Hs.child=null):ge("Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Ig),Ja.child=t,this.dispatchEvent(Ja),Ja.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Ei.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Ei.multiply(t.parent.matrixWorld)),t.applyMatrix4(Ei),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Zh),Hs.child=t,this.dispatchEvent(Hs),Hs.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){const o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(br,t,Pg),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(br,Lg,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(t){t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const t=this.pivot;if(t!==null){const e=t.x,n=t.y,s=t.z,r=this.matrix.elements;r[12]+=e-r[0]*e-r[4]*n-r[8]*s,r[13]+=n-r[1]*e-r[5]*n-r[9]*s,r[14]+=s-r[2]*e-r[6]*n-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e,n=!1){const s=this.parent;if(t===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),e===!0){const r=this.children;for(let o=0,a=r.length;o<a;o++)r[o].updateWorldMatrix(!1,!0,n)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,s.name=this.name,s.castShadow=this.castShadow,s.receiveShadow=this.receiveShadow,s.visible=this.visible,s.frustumCulled=this.frustumCulled,s.renderOrder=this.renderOrder,s.static=this.static,s.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(a=>({...a})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(t),s.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const l=a.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const d=l[c];r(t.shapes,d)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(t.materials,this.material[l]));s.material=a}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){const l=this.animations[a];s.animations.push(r(t.animations,l))}}if(e){const a=o(t.geometries),l=o(t.materials),c=o(t.textures),h=o(t.images),d=o(t.shapes),u=o(t.skeletons),f=o(t.animations),g=o(t.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),d.length>0&&(n.shapes=d),u.length>0&&(n.skeletons=u),f.length>0&&(n.animations=f),g.length>0&&(n.nodes=g)}return n.object=s,n;function o(a){const l=[];for(const c in a){const h=a[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.pivot=t.pivot!==null?t.pivot.clone():null,this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.static=t.static,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const s=t.children[n];this.add(s.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}}Je.DEFAULT_UP=new B(0,1,0);Je.DEFAULT_MATRIX_AUTO_UPDATE=!0;Je.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class Se extends Je{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Ng={type:"move"};class ja{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Se,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Se,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new B,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new B),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Se,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new B,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new B,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,o=null;const a=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){o=!0;for(const v of t.hand.values()){const m=e.getJointPose(v,n),p=this._getHandJoint(c,v);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const h=c.joints["index-finger-tip"],d=c.joints["thumb-tip"],u=h.position.distanceTo(d.position),f=.02,g=.005;c.inputState.pinching&&u>f+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&u<=f-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:t,target:this})));a!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(Ng)))}return a!==null&&(a.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new Se;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}const Wd={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},$i={h:0,s:0,l:0},yo={h:0,s:0,l:0};function Qa(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}class te{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=bn){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,me.colorSpaceToWorking(this,e),this}setRGB(t,e,n,s=me.workingColorSpace){return this.r=t,this.g=e,this.b=n,me.colorSpaceToWorking(this,s),this}setHSL(t,e,n,s=me.workingColorSpace){if(t=Bc(t,1),e=re(e,0,1),n=re(n,0,1),e===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+e):n+e-n*e,o=2*n-r;this.r=Qa(o,r,t+1/3),this.g=Qa(o,r,t),this.b=Qa(o,r,t-1/3)}return me.colorSpaceToWorking(this,s),this}setStyle(t,e=bn){function n(r){r!==void 0&&parseFloat(r)<1&&ne("Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:ne("Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(r,16),e);ne("Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=bn){const n=Wd[t.toLowerCase()];return n!==void 0?this.setHex(n,e):ne("Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=zi(t.r),this.g=zi(t.g),this.b=zi(t.b),this}copyLinearToSRGB(t){return this.r=lr(t.r),this.g=lr(t.g),this.b=lr(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=bn){return me.workingToColorSpace(cn.copy(this),t),Math.round(re(cn.r*255,0,255))*65536+Math.round(re(cn.g*255,0,255))*256+Math.round(re(cn.b*255,0,255))}getHexString(t=bn){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=me.workingColorSpace){me.workingToColorSpace(cn.copy(this),e);const n=cn.r,s=cn.g,r=cn.b,o=Math.max(n,s,r),a=Math.min(n,s,r);let l,c;const h=(a+o)/2;if(a===o)l=0,c=0;else{const d=o-a;switch(c=h<=.5?d/(o+a):d/(2-o-a),o){case n:l=(s-r)/d+(s<r?6:0);break;case s:l=(r-n)/d+2;break;case r:l=(n-s)/d+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=me.workingColorSpace){return me.workingToColorSpace(cn.copy(this),e),t.r=cn.r,t.g=cn.g,t.b=cn.b,t}getStyle(t=bn){me.workingToColorSpace(cn.copy(this),t);const e=cn.r,n=cn.g,s=cn.b;return t!==bn?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL($i),this.setHSL($i.h+t,$i.s+e,$i.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL($i),t.getHSL(yo);const n=Wr($i.h,yo.h,e),s=Wr($i.s,yo.s,e),r=Wr($i.l,yo.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const cn=new te;te.NAMES=Wd;class Vc{constructor(t,e=1,n=1e3){this.isFog=!0,this.name="",this.color=new te(t),this.near=e,this.far=n}clone(){return new Vc(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class Dg extends Je{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new os,this.environmentIntensity=1,this.environmentRotation=new os,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),e.object.backgroundBlurriness=this.backgroundBlurriness,e.object.backgroundIntensity=this.backgroundIntensity,e.object.backgroundRotation=this.backgroundRotation.toArray(),e.object.environmentIntensity=this.environmentIntensity,e.object.environmentRotation=this.environmentRotation.toArray(),e}}const Wn=new B,Ti=new B,tl=new B,Ai=new B,Ws=new B,qs=new B,Kh=new B,el=new B,nl=new B,il=new B,sl=new Ue,rl=new Ue,ol=new Ue;class Xn{constructor(t=new B,e=new B,n=new B){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),Wn.subVectors(t,e),s.cross(Wn);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){Wn.subVectors(s,e),Ti.subVectors(n,e),tl.subVectors(t,e);const o=Wn.dot(Wn),a=Wn.dot(Ti),l=Wn.dot(tl),c=Ti.dot(Ti),h=Ti.dot(tl),d=o*c-a*a;if(d===0)return r.set(0,0,0),null;const u=1/d,f=(c*l-a*h)*u,g=(o*h-a*l)*u;return r.set(1-f-g,g,f)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,Ai)===null?!1:Ai.x>=0&&Ai.y>=0&&Ai.x+Ai.y<=1}static getInterpolation(t,e,n,s,r,o,a,l){return this.getBarycoord(t,e,n,s,Ai)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Ai.x),l.addScaledVector(o,Ai.y),l.addScaledVector(a,Ai.z),l)}static getInterpolatedAttribute(t,e,n,s,r,o){return sl.setScalar(0),rl.setScalar(0),ol.setScalar(0),sl.fromBufferAttribute(t,e),rl.fromBufferAttribute(t,n),ol.fromBufferAttribute(t,s),o.setScalar(0),o.addScaledVector(sl,r.x),o.addScaledVector(rl,r.y),o.addScaledVector(ol,r.z),o}static isFrontFacing(t,e,n,s){return Wn.subVectors(n,e),Ti.subVectors(t,e),Wn.cross(Ti).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Wn.subVectors(this.c,this.b),Ti.subVectors(this.a,this.b),Wn.cross(Ti).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return Xn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return Xn.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,s,r){return Xn.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return Xn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return Xn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,s=this.b,r=this.c;let o,a;Ws.subVectors(s,n),qs.subVectors(r,n),el.subVectors(t,n);const l=Ws.dot(el),c=qs.dot(el);if(l<=0&&c<=0)return e.copy(n);nl.subVectors(t,s);const h=Ws.dot(nl),d=qs.dot(nl);if(h>=0&&d<=h)return e.copy(s);const u=l*d-h*c;if(u<=0&&l>=0&&h<=0)return o=l/(l-h),e.copy(n).addScaledVector(Ws,o);il.subVectors(t,r);const f=Ws.dot(il),g=qs.dot(il);if(g>=0&&f<=g)return e.copy(r);const v=f*c-l*g;if(v<=0&&c>=0&&g<=0)return a=c/(c-g),e.copy(n).addScaledVector(qs,a);const m=h*g-f*d;if(m<=0&&d-h>=0&&f-g>=0)return Kh.subVectors(r,s),a=(d-h)/(d-h+(f-g)),e.copy(s).addScaledVector(Kh,a);const p=1/(m+v+u);return o=v*p,a=u*p,e.copy(n).addScaledVector(Ws,o).addScaledVector(qs,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}class Ls{constructor(t=new B(1/0,1/0,1/0),e=new B(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(qn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(qn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=qn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,qn):qn.fromBufferAttribute(r,o),qn.applyMatrix4(t.matrixWorld),this.expandByPoint(qn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Mo.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Mo.copy(n.boundingBox)),Mo.applyMatrix4(t.matrixWorld),this.union(Mo)}const s=t.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,qn),qn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(wr),So.subVectors(this.max,wr),Xs.subVectors(t.a,wr),Ys.subVectors(t.b,wr),Zs.subVectors(t.c,wr),Ji.subVectors(Ys,Xs),ji.subVectors(Zs,Ys),cs.subVectors(Xs,Zs);let e=[0,-Ji.z,Ji.y,0,-ji.z,ji.y,0,-cs.z,cs.y,Ji.z,0,-Ji.x,ji.z,0,-ji.x,cs.z,0,-cs.x,-Ji.y,Ji.x,0,-ji.y,ji.x,0,-cs.y,cs.x,0];return!al(e,Xs,Ys,Zs,So)||(e=[1,0,0,0,1,0,0,0,1],!al(e,Xs,Ys,Zs,So))?!1:(bo.crossVectors(Ji,ji),e=[bo.x,bo.y,bo.z],al(e,Xs,Ys,Zs,So))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,qn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(qn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Ci[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Ci[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Ci[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Ci[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Ci[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Ci[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Ci[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Ci[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Ci),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}}const Ci=[new B,new B,new B,new B,new B,new B,new B,new B],qn=new B,Mo=new Ls,Xs=new B,Ys=new B,Zs=new B,Ji=new B,ji=new B,cs=new B,wr=new B,So=new B,bo=new B,hs=new B;function al(i,t,e,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){hs.fromArray(i,r);const a=s.x*Math.abs(hs.x)+s.y*Math.abs(hs.y)+s.z*Math.abs(hs.z),l=t.dot(hs),c=e.dot(hs),h=n.dot(hs);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>a)return!1}return!0}const We=new B,wo=new Et;let Ug=0;class Bn extends as{constructor(t,e,n=!1){if(super(),Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Ug++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Q0,this.updateRanges=[],this.gpuType=Zn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)wo.fromBufferAttribute(this,e),wo.applyMatrix3(t),this.setXY(e,wo.x,wo.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)We.fromBufferAttribute(this,e),We.applyMatrix3(t),this.setXYZ(e,We.x,We.y,We.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)We.fromBufferAttribute(this,e),We.applyMatrix4(t),this.setXYZ(e,We.x,We.y,We.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)We.fromBufferAttribute(this,e),We.applyNormalMatrix(t),this.setXYZ(e,We.x,We.y,We.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)We.fromBufferAttribute(this,e),We.transformDirection(t),this.setXYZ(e,We.x,We.y,We.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=er(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=gn(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=er(e,this.array)),e}setX(t,e){return this.normalized&&(e=gn(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=er(e,this.array)),e}setY(t,e){return this.normalized&&(e=gn(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=er(e,this.array)),e}setZ(t,e){return this.normalized&&(e=gn(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=er(e,this.array)),e}setW(t,e){return this.normalized&&(e=gn(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=gn(e,this.array),n=gn(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=gn(e,this.array),n=gn(n,this.array),s=gn(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=gn(e,this.array),n=gn(n,this.array),s=gn(s,this.array),r=gn(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return t.name=this.name,t.usage=this.usage,t.gpuType=this.gpuType,t}dispose(){this.dispatchEvent({type:"dispose"})}}class qd extends Bn{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class Xd extends Bn{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class ue extends Bn{constructor(t,e,n){super(new Float32Array(t),e,n)}}const Fg=new Ls,Er=new B,ll=new B;class pr{constructor(t=new B,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):Fg.setFromPoints(t).getCenter(n);let s=0;for(let r=0,o=t.length;r<o;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Er.subVectors(t,this.center);const e=Er.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(Er,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(ll.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Er.copy(t.center).add(ll)),this.expandByPoint(Er.copy(t.center).sub(ll))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}}let Og=0;const zn=new Ee,cl=new Je,Ks=new B,Ln=new Ls,Tr=new Ls,tn=new B;class Ne extends as{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Og++}),this.uuid=Ps(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(eg(t)?Xd:qd)(t,1):this.index=t,this}setIndirect(t,e=0){return this.indirect=t,this.indirectOffset=e,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new se().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(t){return zn.makeRotationFromQuaternion(t),this.applyMatrix4(zn),this}rotateX(t){return zn.makeRotationX(t),this.applyMatrix4(zn),this}rotateY(t){return zn.makeRotationY(t),this.applyMatrix4(zn),this}rotateZ(t){return zn.makeRotationZ(t),this.applyMatrix4(zn),this}translate(t,e,n){return zn.makeTranslation(t,e,n),this.applyMatrix4(zn),this}scale(t,e,n){return zn.makeScale(t,e,n),this.applyMatrix4(zn),this}lookAt(t){return cl.lookAt(t),cl.updateMatrix(),this.applyMatrix4(cl.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ks).negate(),this.translate(Ks.x,Ks.y,Ks.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const n=[];for(let s=0,r=t.length;s<r;s++){const o=t[s];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new ue(n,3))}else{const n=Math.min(t.length,e.count);for(let s=0;s<n;s++){const r=t[s];e.setXYZ(s,r.x,r.y,r.z||0)}t.length>e.count&&ne("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Ls);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){ge("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new B(-1/0,-1/0,-1/0),new B(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){const r=e[n];Ln.setFromBufferAttribute(r),this.morphTargetsRelative?(tn.addVectors(this.boundingBox.min,Ln.min),this.boundingBox.expandByPoint(tn),tn.addVectors(this.boundingBox.max,Ln.max),this.boundingBox.expandByPoint(tn)):(this.boundingBox.expandByPoint(Ln.min),this.boundingBox.expandByPoint(Ln.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&ge('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new pr);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){ge("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new B,1/0);return}if(t){const n=this.boundingSphere.center;if(Ln.setFromBufferAttribute(t),e)for(let r=0,o=e.length;r<o;r++){const a=e[r];Tr.setFromBufferAttribute(a),this.morphTargetsRelative?(tn.addVectors(Ln.min,Tr.min),Ln.expandByPoint(tn),tn.addVectors(Ln.max,Tr.max),Ln.expandByPoint(tn)):(Ln.expandByPoint(Tr.min),Ln.expandByPoint(Tr.max))}Ln.getCenter(n);let s=0;for(let r=0,o=t.count;r<o;r++)tn.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(tn));if(e)for(let r=0,o=e.length;r<o;r++){const a=e[r],l=this.morphTargetsRelative;for(let c=0,h=a.count;c<h;c++)tn.fromBufferAttribute(a,c),l&&(Ks.fromBufferAttribute(t,c),tn.add(Ks)),s=Math.max(s,n.distanceToSquared(tn))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&ge('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){ge("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,s=e.normal,r=e.uv;let o=this.getAttribute("tangent");(o===void 0||o.count!==n.count)&&(o=new Bn(new Float32Array(4*n.count),4),this.setAttribute("tangent",o));const a=[],l=[];for(let _=0;_<n.count;_++)a[_]=new B,l[_]=new B;const c=new B,h=new B,d=new B,u=new Et,f=new Et,g=new Et,v=new B,m=new B;function p(_,T,L){c.fromBufferAttribute(n,_),h.fromBufferAttribute(n,T),d.fromBufferAttribute(n,L),u.fromBufferAttribute(r,_),f.fromBufferAttribute(r,T),g.fromBufferAttribute(r,L),h.sub(c),d.sub(c),f.sub(u),g.sub(u);const I=1/(f.x*g.y-g.x*f.y);isFinite(I)&&(v.copy(h).multiplyScalar(g.y).addScaledVector(d,-f.y).multiplyScalar(I),m.copy(d).multiplyScalar(f.x).addScaledVector(h,-g.x).multiplyScalar(I),a[_].add(v),a[T].add(v),a[L].add(v),l[_].add(m),l[T].add(m),l[L].add(m))}let x=this.groups;x.length===0&&(x=[{start:0,count:t.count}]);for(let _=0,T=x.length;_<T;++_){const L=x[_],I=L.start,U=L.count;for(let N=I,A=I+U;N<A;N+=3)p(t.getX(N+0),t.getX(N+1),t.getX(N+2))}const w=new B,y=new B,M=new B,S=new B;function C(_){M.fromBufferAttribute(s,_),S.copy(M);const T=a[_];w.copy(T),w.sub(M.multiplyScalar(M.dot(T))).normalize(),y.crossVectors(S,T);const I=y.dot(l[_])<0?-1:1;o.setXYZW(_,w.x,w.y,w.z,I)}for(let _=0,T=x.length;_<T;++_){const L=x[_],I=L.start,U=L.count;for(let N=I,A=I+U;N<A;N+=3)C(t.getX(N+0)),C(t.getX(N+1)),C(t.getX(N+2))}this._transformed=!0}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==e.count)n=new Bn(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let u=0,f=n.count;u<f;u++)n.setXYZ(u,0,0,0);const s=new B,r=new B,o=new B,a=new B,l=new B,c=new B,h=new B,d=new B;if(t)for(let u=0,f=t.count;u<f;u+=3){const g=t.getX(u+0),v=t.getX(u+1),m=t.getX(u+2);s.fromBufferAttribute(e,g),r.fromBufferAttribute(e,v),o.fromBufferAttribute(e,m),h.subVectors(o,r),d.subVectors(s,r),h.cross(d),a.fromBufferAttribute(n,g),l.fromBufferAttribute(n,v),c.fromBufferAttribute(n,m),a.add(h),l.add(h),c.add(h),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(v,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let u=0,f=e.count;u<f;u+=3)s.fromBufferAttribute(e,u+0),r.fromBufferAttribute(e,u+1),o.fromBufferAttribute(e,u+2),h.subVectors(o,r),d.subVectors(s,r),h.cross(d),n.setXYZ(u+0,h.x,h.y,h.z),n.setXYZ(u+1,h.x,h.y,h.z),n.setXYZ(u+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)tn.fromBufferAttribute(t,e),tn.normalize(),t.setXYZ(e,tn.x,tn.y,tn.z)}toNonIndexed(){function t(a,l){const c=a.array,h=a.itemSize,d=a.normalized,u=new c.constructor(l.length*h);let f=0,g=0;for(let v=0,m=l.length;v<m;v++){a.isInterleavedBufferAttribute?f=l[v]*a.data.stride+a.offset:f=l[v]*h;for(let p=0;p<h;p++)u[g++]=c[f++]}return new Bn(u,h,d)}if(this.index===null)return ne("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Ne,n=this.index.array,s=this.attributes;for(const a in s){const l=s[a],c=t(l,n);e.setAttribute(a,c)}const r=this.morphAttributes;for(const a in r){const l=[],c=r[a];for(let h=0,d=c.length;h<d;h++){const u=c[h],f=t(u,n);l.push(f)}e.morphAttributes[a]=l}e.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,l=o.length;a<l;a++){const c=o[a];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,t.name=this.name,Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const l in n){const c=n[l];t.data.attributes[l]=c.toJSON(t.data)}const s={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let d=0,u=c.length;d<u;d++){const f=c[d];h.push(f.toJSON(t.data))}h.length>0&&(s[l]=h,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(t.data.boundingSphere=a.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone());const s=t.attributes;for(const c in s){const h=s[c];this.setAttribute(c,h.clone(e))}const r=t.morphAttributes;for(const c in r){const h=[],d=r[c];for(let u=0,f=d.length;u<f;u++)h.push(d[u].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;const o=t.groups;for(let c=0,h=o.length;c<h;c++){const d=o[c];this.addGroup(d.start,d.count,d.materialIndex)}const a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this._transformed=t._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}}const hl=new B,zg=new B,Bg=new se;class li{constructor(t=new B(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const s=hl.subVectors(n,e).cross(zg.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e,n=!0){const s=t.delta(hl),r=this.normal.dot(s);if(r===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const o=-(t.start.dot(this.normal)+this.constant)/r;return n===!0&&(o<0||o>1)?null:e.copy(t.start).addScaledVector(s,o)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||Bg.getNormalMatrix(t),s=this.coplanarPoint(hl).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(t){return this.normal.fromArray(t.normal),this.constant=t.constant,this}}let kg=0;class Is extends as{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:kg++}),this.uuid=Ps(),this.name="",this.type="Material",this.blending=Vr,this.side=ws,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Td,this.blendDst=Ad,this.blendEquation=tr,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new te(0,0,0),this.blendAlpha=0,this.depthFunc=$r,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=X0,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Xa,this.stencilZFail=Xa,this.stencilZPass=Xa,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){ne(`Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){ne(`Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector2&&n&&n.isVector2||s&&s.isEuler&&n&&n.isEuler||s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(r=>r.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const o=[];for(const a in r){const l=r[a];delete l.metadata,o.push(l)}return o}if(e){const r=s(t.textures),o=s(t.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}fromJSON(t,e){if(t.uuid!==void 0&&(this.uuid=t.uuid),t.name!==void 0&&(this.name=t.name),t.color!==void 0&&this.color!==void 0&&this.color.setHex(t.color),t.roughness!==void 0&&(this.roughness=t.roughness),t.metalness!==void 0&&(this.metalness=t.metalness),t.sheen!==void 0&&(this.sheen=t.sheen),t.sheenColor!==void 0&&(this.sheenColor=new te().setHex(t.sheenColor)),t.sheenRoughness!==void 0&&(this.sheenRoughness=t.sheenRoughness),t.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(t.emissive),t.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(t.specular),t.specularIntensity!==void 0&&(this.specularIntensity=t.specularIntensity),t.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(t.specularColor),t.shininess!==void 0&&(this.shininess=t.shininess),t.clearcoat!==void 0&&(this.clearcoat=t.clearcoat),t.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=t.clearcoatRoughness),t.dispersion!==void 0&&(this.dispersion=t.dispersion),t.retroreflectivity!==void 0&&(this.retroreflectivity=t.retroreflectivity),t.iridescence!==void 0&&(this.iridescence=t.iridescence),t.iridescenceIOR!==void 0&&(this.iridescenceIOR=t.iridescenceIOR),t.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=t.iridescenceThicknessRange),t.transmission!==void 0&&(this.transmission=t.transmission),t.thickness!==void 0&&(this.thickness=t.thickness),t.attenuationDistance!==void 0&&(this.attenuationDistance=t.attenuationDistance),t.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(t.attenuationColor),t.anisotropy!==void 0&&(this.anisotropy=t.anisotropy),t.anisotropyRotation!==void 0&&(this.anisotropyRotation=t.anisotropyRotation),t.fog!==void 0&&(this.fog=t.fog),t.flatShading!==void 0&&(this.flatShading=t.flatShading),t.blending!==void 0&&(this.blending=t.blending),t.combine!==void 0&&(this.combine=t.combine),t.side!==void 0&&(this.side=t.side),t.shadowSide!==void 0&&(this.shadowSide=t.shadowSide),t.opacity!==void 0&&(this.opacity=t.opacity),t.transparent!==void 0&&(this.transparent=t.transparent),t.alphaTest!==void 0&&(this.alphaTest=t.alphaTest),t.alphaHash!==void 0&&(this.alphaHash=t.alphaHash),t.depthFunc!==void 0&&(this.depthFunc=t.depthFunc),t.depthTest!==void 0&&(this.depthTest=t.depthTest),t.depthWrite!==void 0&&(this.depthWrite=t.depthWrite),t.colorWrite!==void 0&&(this.colorWrite=t.colorWrite),t.clippingPlanes!==void 0&&(this.clippingPlanes=t.clippingPlanes.map(n=>new li().fromJSON(n))),t.clipIntersection!==void 0&&(this.clipIntersection=t.clipIntersection),t.clipShadows!==void 0&&(this.clipShadows=t.clipShadows),t.depthPacking!==void 0&&(this.depthPacking=t.depthPacking),t.blendSrc!==void 0&&(this.blendSrc=t.blendSrc),t.blendDst!==void 0&&(this.blendDst=t.blendDst),t.blendEquation!==void 0&&(this.blendEquation=t.blendEquation),t.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=t.blendSrcAlpha),t.blendDstAlpha!==void 0&&(this.blendDstAlpha=t.blendDstAlpha),t.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=t.blendEquationAlpha),t.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(t.blendColor),t.blendAlpha!==void 0&&(this.blendAlpha=t.blendAlpha),t.stencilWriteMask!==void 0&&(this.stencilWriteMask=t.stencilWriteMask),t.stencilFunc!==void 0&&(this.stencilFunc=t.stencilFunc),t.stencilRef!==void 0&&(this.stencilRef=t.stencilRef),t.stencilFuncMask!==void 0&&(this.stencilFuncMask=t.stencilFuncMask),t.stencilFail!==void 0&&(this.stencilFail=t.stencilFail),t.stencilZFail!==void 0&&(this.stencilZFail=t.stencilZFail),t.stencilZPass!==void 0&&(this.stencilZPass=t.stencilZPass),t.stencilWrite!==void 0&&(this.stencilWrite=t.stencilWrite),t.wireframe!==void 0&&(this.wireframe=t.wireframe),t.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=t.wireframeLinewidth),t.wireframeLinecap!==void 0&&(this.wireframeLinecap=t.wireframeLinecap),t.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=t.wireframeLinejoin),t.rotation!==void 0&&(this.rotation=t.rotation),t.linewidth!==void 0&&(this.linewidth=t.linewidth),t.linecap!==void 0&&(this.linecap=t.linecap),t.linejoin!==void 0&&(this.linejoin=t.linejoin),t.dashSize!==void 0&&(this.dashSize=t.dashSize),t.gapSize!==void 0&&(this.gapSize=t.gapSize),t.scale!==void 0&&(this.scale=t.scale),t.polygonOffset!==void 0&&(this.polygonOffset=t.polygonOffset),t.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=t.polygonOffsetFactor),t.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=t.polygonOffsetUnits),t.dithering!==void 0&&(this.dithering=t.dithering),t.alphaToCoverage!==void 0&&(this.alphaToCoverage=t.alphaToCoverage),t.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=t.premultipliedAlpha),t.forceSinglePass!==void 0&&(this.forceSinglePass=t.forceSinglePass),t.allowOverride!==void 0&&(this.allowOverride=t.allowOverride),t.visible!==void 0&&(this.visible=t.visible),t.toneMapped!==void 0&&(this.toneMapped=t.toneMapped),t.userData!==void 0&&(this.userData=t.userData),t.vertexColors!==void 0&&(typeof t.vertexColors=="number"?this.vertexColors=t.vertexColors>0:this.vertexColors=t.vertexColors),t.size!==void 0&&(this.size=t.size),t.sizeAttenuation!==void 0&&(this.sizeAttenuation=t.sizeAttenuation),t.map!==void 0&&(this.map=e[t.map]||null),t.matcap!==void 0&&(this.matcap=e[t.matcap]||null),t.alphaMap!==void 0&&(this.alphaMap=e[t.alphaMap]||null),t.bumpMap!==void 0&&(this.bumpMap=e[t.bumpMap]||null),t.bumpScale!==void 0&&(this.bumpScale=t.bumpScale),t.normalMap!==void 0&&(this.normalMap=e[t.normalMap]||null),t.normalMapType!==void 0&&(this.normalMapType=t.normalMapType),t.normalScale!==void 0){let n=t.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new Et().fromArray(n)}return t.displacementMap!==void 0&&(this.displacementMap=e[t.displacementMap]||null),t.displacementScale!==void 0&&(this.displacementScale=t.displacementScale),t.displacementBias!==void 0&&(this.displacementBias=t.displacementBias),t.roughnessMap!==void 0&&(this.roughnessMap=e[t.roughnessMap]||null),t.metalnessMap!==void 0&&(this.metalnessMap=e[t.metalnessMap]||null),t.emissiveMap!==void 0&&(this.emissiveMap=e[t.emissiveMap]||null),t.emissiveIntensity!==void 0&&(this.emissiveIntensity=t.emissiveIntensity),t.specularMap!==void 0&&(this.specularMap=e[t.specularMap]||null),t.specularIntensityMap!==void 0&&(this.specularIntensityMap=e[t.specularIntensityMap]||null),t.specularColorMap!==void 0&&(this.specularColorMap=e[t.specularColorMap]||null),t.envMap!==void 0&&(this.envMap=e[t.envMap]||null),t.envMapRotation!==void 0&&this.envMapRotation.fromArray(t.envMapRotation),t.envMapIntensity!==void 0&&(this.envMapIntensity=t.envMapIntensity),t.reflectivity!==void 0&&(this.reflectivity=t.reflectivity),t.refractionRatio!==void 0&&(this.refractionRatio=t.refractionRatio),t.lightMap!==void 0&&(this.lightMap=e[t.lightMap]||null),t.lightMapIntensity!==void 0&&(this.lightMapIntensity=t.lightMapIntensity),t.aoMap!==void 0&&(this.aoMap=e[t.aoMap]||null),t.aoMapIntensity!==void 0&&(this.aoMapIntensity=t.aoMapIntensity),t.gradientMap!==void 0&&(this.gradientMap=e[t.gradientMap]||null),t.clearcoatMap!==void 0&&(this.clearcoatMap=e[t.clearcoatMap]||null),t.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=e[t.clearcoatRoughnessMap]||null),t.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=e[t.clearcoatNormalMap]||null),t.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new Et().fromArray(t.clearcoatNormalScale)),t.iridescenceMap!==void 0&&(this.iridescenceMap=e[t.iridescenceMap]||null),t.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=e[t.iridescenceThicknessMap]||null),t.transmissionMap!==void 0&&(this.transmissionMap=e[t.transmissionMap]||null),t.thicknessMap!==void 0&&(this.thicknessMap=e[t.thicknessMap]||null),t.anisotropyMap!==void 0&&(this.anisotropyMap=e[t.anisotropyMap]||null),t.sheenColorMap!==void 0&&(this.sheenColorMap=e[t.sheenColorMap]||null),t.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=e[t.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.allowOverride=t.allowOverride,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}const Ri=new B,ul=new B,Eo=new B,To=new B;class Ta{constructor(t=new B,e=new B(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Ri)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=Ri.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Ri.copy(this.origin).addScaledVector(this.direction,e),Ri.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){ul.copy(t).add(e).multiplyScalar(.5),Eo.copy(e).sub(t).normalize(),To.copy(this.origin).sub(ul);const r=t.distanceTo(e)*.5,o=-this.direction.dot(Eo),a=To.dot(this.direction),l=-To.dot(Eo),c=To.lengthSq(),h=Math.abs(1-o*o);let d,u,f,g;if(h>0)if(d=o*l-a,u=o*a-l,g=r*h,d>=0)if(u>=-g)if(u<=g){const v=1/h;d*=v,u*=v,f=d*(d+o*u+2*a)+u*(o*d+u+2*l)+c}else u=r,d=Math.max(0,-(o*u+a)),f=-d*d+u*(u+2*l)+c;else u=-r,d=Math.max(0,-(o*u+a)),f=-d*d+u*(u+2*l)+c;else u<=-g?(d=Math.max(0,-(-o*r+a)),u=d>0?-r:Math.min(Math.max(-r,-l),r),f=-d*d+u*(u+2*l)+c):u<=g?(d=0,u=Math.min(Math.max(-r,-l),r),f=u*(u+2*l)+c):(d=Math.max(0,-(o*r+a)),u=d>0?r:Math.min(Math.max(-r,-l),r),f=-d*d+u*(u+2*l)+c);else u=o>0?-r:r,d=Math.max(0,-(o*u+a)),f=-d*d+u*(u+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,d),s&&s.copy(ul).addScaledVector(Eo,u),f}intersectSphere(t,e){if(t.radius<0)return null;Ri.subVectors(t.center,this.origin);const n=Ri.dot(this.direction),s=Ri.dot(Ri)-n*n,r=t.radius*t.radius;if(s>r)return null;const o=Math.sqrt(r-s),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,e):this.at(a,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,o,a,l;const c=1/this.direction.x,h=1/this.direction.y,d=1/this.direction.z,u=this.origin;return c>=0?(n=(t.min.x-u.x)*c,s=(t.max.x-u.x)*c):(n=(t.max.x-u.x)*c,s=(t.min.x-u.x)*c),h>=0?(r=(t.min.y-u.y)*h,o=(t.max.y-u.y)*h):(r=(t.max.y-u.y)*h,o=(t.min.y-u.y)*h),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),d>=0?(a=(t.min.z-u.z)*d,l=(t.max.z-u.z)*d):(a=(t.max.z-u.z)*d,l=(t.min.z-u.z)*d),n>l||a>s)||((a>n||n!==n)&&(n=a),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,Ri)!==null}intersectTriangle(t,e,n,s,r){const o=this.origin,a=this.direction,l=a.x,c=a.y,h=a.z,d=t.x-o.x,u=t.y-o.y,f=t.z-o.z,g=e.x-o.x,v=e.y-o.y,m=e.z-o.z,p=n.x-o.x,x=n.y-o.y,w=n.z-o.z,y=Math.abs(l),M=Math.abs(c),S=Math.abs(h);let C,_,T,L,I,U,N,A,D,F,G,Y;if(y>=M&&y>=S?(T=l,U=d,D=g,Y=p,l>=0?(C=c,_=h,L=u,I=f,N=v,A=m,F=x,G=w):(C=h,_=c,L=f,I=u,N=m,A=v,F=w,G=x)):M>=S?(T=c,U=u,D=v,Y=x,c>=0?(C=h,_=l,L=f,I=d,N=m,A=g,F=w,G=p):(C=l,_=h,L=d,I=f,N=g,A=m,F=p,G=w)):(T=h,U=f,D=m,Y=w,h>=0?(C=l,_=c,L=d,I=u,N=g,A=v,F=p,G=x):(C=c,_=l,L=u,I=d,N=v,A=g,F=x,G=p)),T===0)return null;const V=C/T,q=_/T,$=1/T,it=L-V*U,yt=I-q*U,Ft=N-V*D,Zt=A-q*D,lt=F-V*Y,W=G-q*Y,rt=lt*Zt-W*Ft,dt=it*W-yt*lt,Mt=Ft*yt-Zt*it;if(s){if(rt<0||dt<0||Mt<0)return null}else if((rt<0||dt<0||Mt<0)&&(rt>0||dt>0||Mt>0))return null;const _t=rt+dt+Mt;if(_t===0)return null;const Tt=$*(rt*U+dt*D+Mt*Y);return(_t>0?Tt<0:Tt>0)?null:this.at(Tt/_t,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class rn extends Is{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new te(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new os,this.combine=Cd,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const $h=new Ee,us=new Ta,Ao=new pr,Jh=new B,Co=new B,Ro=new B,Po=new B,dl=new B,Lo=new B,jh=new B,Io=new B;class ve extends Je{constructor(t=new Ne,e=new rn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(t,e){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;e.fromBufferAttribute(s,t);const a=this.morphTargetInfluences;if(r&&a){Lo.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const h=a[l],d=r[l];h!==0&&(dl.fromBufferAttribute(d,t),o?Lo.addScaledVector(dl,h):Lo.addScaledVector(dl.sub(e),h))}e.add(Lo)}return e}intersectsFrustum(t){return t.intersectsObject(this)}raycast(t,e){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Ao.copy(n.boundingSphere),Ao.applyMatrix4(r),us.copy(t.ray).recast(t.near),!(Ao.containsPoint(us.origin)===!1&&(us.intersectSphere(Ao,Jh)===null||us.origin.distanceToSquared(Jh)>(t.far-t.near)**2))&&($h.copy(r).invert(),us.copy(t.ray).applyMatrix4($h),!(n.boundingBox!==null&&us.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,us)))}_computeIntersections(t,e,n){let s;const r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,d=r.attributes.normal,u=r.groups,f=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,v=u.length;g<v;g++){const m=u[g],p=o[m.materialIndex],x=Math.max(m.start,f.start),w=Math.min(a.count,Math.min(m.start+m.count,f.start+f.count));for(let y=x,M=w;y<M;y+=3){const S=a.getX(y),C=a.getX(y+1),_=a.getX(y+2);s=No(this,p,t,n,c,h,d,S,C,_),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,f.start),v=Math.min(a.count,f.start+f.count);for(let m=g,p=v;m<p;m+=3){const x=a.getX(m),w=a.getX(m+1),y=a.getX(m+2);s=No(this,o,t,n,c,h,d,x,w,y),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}else if(l!==void 0)if(Array.isArray(o))for(let g=0,v=u.length;g<v;g++){const m=u[g],p=o[m.materialIndex],x=Math.max(m.start,f.start),w=Math.min(l.count,Math.min(m.start+m.count,f.start+f.count));for(let y=x,M=w;y<M;y+=3){const S=y,C=y+1,_=y+2;s=No(this,p,t,n,c,h,d,S,C,_),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,f.start),v=Math.min(l.count,f.start+f.count);for(let m=g,p=v;m<p;m+=3){const x=m,w=m+1,y=m+2;s=No(this,o,t,n,c,h,d,x,w,y),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}}}function Gg(i,t,e,n,s,r,o,a){let l;if(t.side===En?l=n.intersectTriangle(o,r,s,!0,a):l=n.intersectTriangle(s,r,o,t.side===ws,a),l===null)return null;Io.copy(a),Io.applyMatrix4(i.matrixWorld);const c=e.ray.origin.distanceTo(Io);return c<e.near||c>e.far?null:{distance:c,point:Io.clone(),object:i}}function No(i,t,e,n,s,r,o,a,l,c){i.getVertexPosition(a,Co),i.getVertexPosition(l,Ro),i.getVertexPosition(c,Po);const h=Gg(i,t,e,n,Co,Ro,Po,jh);if(h){const d=new B;Xn.getBarycoord(jh,Co,Ro,Po,d),s&&(h.uv=Xn.getInterpolatedAttribute(s,a,l,c,d,new Et)),r&&(h.uv1=Xn.getInterpolatedAttribute(r,a,l,c,d,new Et)),o&&(h.normal=Xn.getInterpolatedAttribute(o,a,l,c,d,new B),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const u={a,b:l,c,normal:new B,materialIndex:0};Xn.getNormal(Co,Ro,Po,u.normal),h.face=u,h.barycoord=d}return h}class Hc extends fn{constructor(t=null,e=1,n=1,s,r,o,a,l,c=en,h=en,d,u){super(null,o,a,l,c,h,s,r,d,u),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class fc extends Bn{constructor(t,e,n,s=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}const $s=new Ee,Qh=new Ee,Do=[],tu=new Ls,Vg=new Ee,Ar=new ve,Cr=new pr;class pc extends ve{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new fc(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,Vg)}computeBoundingBox(){const t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new Ls),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,$s),tu.copy(t.boundingBox).applyMatrix4($s),this.boundingBox.union(tu)}computeBoundingSphere(){const t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new pr),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,$s),Cr.copy(t.boundingSphere).applyMatrix4($s),this.boundingSphere.union(Cr)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){return this.instanceColor===null?e.setRGB(1,1,1):e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){return e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){const n=e.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,o=t*r+1;for(let a=0;a<n.length;a++)n[a]=s[o+a]}raycast(t,e){const n=this.matrixWorld,s=this.count;if(Ar.geometry=this.geometry,Ar.material=this.material,Ar.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Cr.copy(this.boundingSphere),Cr.applyMatrix4(n),t.ray.intersectsSphere(Cr)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,$s),Qh.multiplyMatrices(n,$s),Ar.matrixWorld=Qh,Ar.raycast(t,Do);for(let o=0,a=Do.length;o<a;o++){const l=Do[o];l.instanceId=r,l.object=this,e.push(l)}Do.length=0}}setColorAt(t,e){return this.instanceColor===null&&(this.instanceColor=new fc(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3),this}setMatrixAt(t,e){return e.toArray(this.instanceMatrix.array,t*16),this}setMorphAt(t,e){const n=e.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new Hc(new Float32Array(s*this.count),s,this.count,Ea,Zn));const r=this.morphTexture.source.data.data;let o=0;for(let c=0;c<n.length;c++)o+=n[c];const a=this.geometry.morphTargetsRelative?1:1-o,l=s*t;return r[l]=a,r.set(n,l+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const ds=new pr,Hg=new Et(.5,.5),Uo=new B;class Wc{constructor(t=new li,e=new li,n=new li,s=new li,r=new li,o=new li){this.planes=[t,e,n,s,r,o]}set(t,e,n,s,r,o){const a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=ui,n=!1){const s=this.planes,r=t.elements,o=r[0],a=r[1],l=r[2],c=r[3],h=r[4],d=r[5],u=r[6],f=r[7],g=r[8],v=r[9],m=r[10],p=r[11],x=r[12],w=r[13],y=r[14],M=r[15];if(s[0].setComponents(c-o,f-h,p-g,M-x).normalize(),s[1].setComponents(c+o,f+h,p+g,M+x).normalize(),s[2].setComponents(c+a,f+d,p+v,M+w).normalize(),s[3].setComponents(c-a,f-d,p-v,M-w).normalize(),n)s[4].setComponents(l,u,m,y).normalize(),s[5].setComponents(c-l,f-u,p-m,M-y).normalize();else if(s[4].setComponents(c-l,f-u,p-m,M-y).normalize(),e===ui)s[5].setComponents(c+l,f+u,p+m,M+y).normalize();else if(e===Qr)s[5].setComponents(l,u,m,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),ds.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),ds.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(ds)}intersectsSprite(t){ds.center.set(0,0,0);const e=Hg.distanceTo(t.center);return ds.radius=.7071067811865476+e,ds.applyMatrix4(t.matrixWorld),this.intersectsSphere(ds)}intersectsSphere(t){const e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const s=e[n];if(Uo.x=s.normal.x>0?t.max.x:t.min.x,Uo.y=s.normal.y>0?t.max.y:t.min.y,Uo.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(Uo)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Aa extends Is{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new te(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const pa=new B,ma=new B,eu=new Ee,Rr=new Ta,Fo=new pr,fl=new B,nu=new B;class qc extends Je{constructor(t=new Ne,e=new Aa){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[0];for(let s=1,r=e.count;s<r;s++)pa.fromBufferAttribute(e,s-1),ma.fromBufferAttribute(e,s),n[s]=n[s-1],n[s]+=pa.distanceTo(ma);t.setAttribute("lineDistance",new ue(n,1))}else ne("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}intersectsFrustum(t){return t.intersectsObject(this)}raycast(t,e){const n=this.geometry,s=this.matrixWorld,r=t.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Fo.copy(n.boundingSphere),Fo.applyMatrix4(s),Fo.radius+=r,t.ray.intersectsSphere(Fo)===!1)return;eu.copy(s).invert(),Rr.copy(t.ray).applyMatrix4(eu);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=this.isLineSegments?2:1,h=n.index,u=n.attributes.position;if(h!==null){const f=Math.max(0,o.start),g=Math.min(h.count,o.start+o.count);for(let v=f,m=g-1;v<m;v+=c){const p=h.getX(v),x=h.getX(v+1),w=Oo(this,t,Rr,l,p,x,v);w&&e.push(w)}if(this.isLineLoop){const v=h.getX(g-1),m=h.getX(f),p=Oo(this,t,Rr,l,v,m,g-1);p&&e.push(p)}}else{const f=Math.max(0,o.start),g=Math.min(u.count,o.start+o.count);for(let v=f,m=g-1;v<m;v+=c){const p=Oo(this,t,Rr,l,v,v+1,v);p&&e.push(p)}if(this.isLineLoop){const v=Oo(this,t,Rr,l,g-1,f,g-1);v&&e.push(v)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function Oo(i,t,e,n,s,r,o){const a=i.geometry.attributes.position;if(pa.fromBufferAttribute(a,s),ma.fromBufferAttribute(a,r),e.distanceSqToSegment(pa,ma,fl,nu)>n)return;fl.applyMatrix4(i.matrixWorld);const c=t.ray.origin.distanceTo(fl);if(!(c<t.near||c>t.far))return{distance:c,point:nu.clone().applyMatrix4(i.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:i}}class Yd extends fn{constructor(t=[],e=Es,n,s,r,o,a,l,c,h){super(t,e,n,s,r,o,a,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class Wg extends fn{constructor(t,e,n,s,r,o,a,l,c){super(t,e,n,s,r,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class to extends fn{constructor(t,e,n=mi,s,r,o,a=en,l=en,c,h=ki,d=1){if(h!==ki&&h!==_s)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const u={width:t,height:e,depth:d};super(u,s,r,o,a,l,h,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new kc(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return e.compareFunction=this.compareFunction,e}}class qg extends to{constructor(t,e=mi,n=Es,s,r,o=en,a=en,l,c=ki){const h={width:t,height:t,depth:1},d=[h,h,h,h,h,h];super(t,t,e,n,s,r,o,a,l,c),this.image=d,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(t){this.image=t}}class Zd extends fn{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}}class Vi extends Ne{constructor(t=1,e=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};const a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);const l=[],c=[],h=[],d=[];let u=0,f=0;g("z","y","x",-1,-1,n,e,t,o,r,0),g("z","y","x",1,-1,n,e,-t,o,r,1),g("x","z","y",1,1,t,n,e,s,o,2),g("x","z","y",1,-1,t,n,-e,s,o,3),g("x","y","z",1,-1,t,e,n,s,r,4),g("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new ue(c,3)),this.setAttribute("normal",new ue(h,3)),this.setAttribute("uv",new ue(d,2));function g(v,m,p,x,w,y,M,S,C,_,T){const L=y/C,I=M/_,U=y/2,N=M/2,A=S/2,D=C+1,F=_+1;let G=0,Y=0;const V=new B;for(let q=0;q<F;q++){const $=q*I-N;for(let it=0;it<D;it++){const yt=it*L-U;V[v]=yt*x,V[m]=$*w,V[p]=A,c.push(V.x,V.y,V.z),V[v]=0,V[m]=0,V[p]=S>0?1:-1,h.push(V.x,V.y,V.z),d.push(it/C),d.push(1-q/_),G+=1}}for(let q=0;q<_;q++)for(let $=0;$<C;$++){const it=u+$+D*q,yt=u+$+D*(q+1),Ft=u+($+1)+D*(q+1),Zt=u+($+1)+D*q;l.push(it,yt,Zt),l.push(yt,Ft,Zt),Y+=6}a.addGroup(f,Y,T),f+=Y,u+=G}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Vi(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}class oo extends Ne{constructor(t=1,e=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:n,thetaLength:s},e=Math.max(3,e);const r=[],o=[],a=[],l=[],c=new B,h=new Et;o.push(0,0,0),a.push(0,0,1),l.push(.5,.5);for(let d=0,u=3;d<=e;d++,u+=3){const f=n+d/e*s;c.x=t*Math.cos(f),c.y=t*Math.sin(f),o.push(c.x,c.y,c.z),a.push(0,0,1),h.x=(o[u]/t+1)/2,h.y=(o[u+1]/t+1)/2,l.push(h.x,h.y)}for(let d=1;d<=e;d++)r.push(d,d+1,0);this.setIndex(r),this.setAttribute("position",new ue(o,3)),this.setAttribute("normal",new ue(a,3)),this.setAttribute("uv",new ue(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new oo(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class Ce extends Ne{constructor(t=1,e=1,n=1,s=32,r=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:l};const c=this;s=Math.floor(s),r=Math.floor(r);const h=[],d=[],u=[],f=[];let g=0;const v=[],m=n/2;let p=0;x(),o===!1&&(t>0&&w(!0),e>0&&w(!1)),this.setIndex(h),this.setAttribute("position",new ue(d,3)),this.setAttribute("normal",new ue(u,3)),this.setAttribute("uv",new ue(f,2));function x(){const y=new B,M=new B;let S=0;const C=(e-t)/n;for(let _=0;_<=r;_++){const T=[],L=_/r,I=L*(e-t)+t;for(let U=0;U<=s;U++){const N=U/s,A=N*l+a,D=Math.sin(A),F=Math.cos(A);M.x=I*D,M.y=-L*n+m,M.z=I*F,d.push(M.x,M.y,M.z),y.set(D,C,F).normalize(),u.push(y.x,y.y,y.z),f.push(N,1-L),T.push(g++)}v.push(T)}for(let _=0;_<s;_++)for(let T=0;T<r;T++){const L=v[T][_],I=v[T+1][_],U=v[T+1][_+1],N=v[T][_+1];(t>0||T!==0)&&(h.push(L,I,N),S+=3),(e>0||T!==r-1)&&(h.push(I,U,N),S+=3)}c.addGroup(p,S,0),p+=S}function w(y){const M=g,S=new Et,C=new B;let _=0;const T=y===!0?t:e,L=y===!0?1:-1;for(let U=1;U<=s;U++)d.push(0,m*L,0),u.push(0,L,0),f.push(.5,.5),g++;const I=g;for(let U=0;U<=s;U++){const A=U/s*l+a,D=Math.cos(A),F=Math.sin(A);C.x=T*F,C.y=m*L,C.z=T*D,d.push(C.x,C.y,C.z),u.push(0,L,0),S.x=D*.5+.5,S.y=F*.5*L+.5,f.push(S.x,S.y),g++}for(let U=0;U<s;U++){const N=M+U,A=I+U;y===!0?h.push(A,A+1,N):h.push(A+1,A,N),_+=3}c.addGroup(p,_,y===!0?1:2),p+=_}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ce(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Ca extends Ce{constructor(t=1,e=1,n=32,s=1,r=!1,o=0,a=Math.PI*2){super(0,t,e,n,s,r,o,a),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:o,thetaLength:a}}static fromJSON(t){return new Ca(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class vi{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){ne("Curve: .getPoint() not implemented.")}getPointAt(t,e){const n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let n,s=this.getPoint(0),r=0;e.push(0);for(let o=1;o<=t;o++)n=this.getPoint(o/t),r+=n.distanceTo(s),e.push(r),s=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e=null){const n=this.getLengths();let s=0;const r=n.length;let o;e?o=e:o=t*n[r-1];let a=0,l=r-1,c;for(;a<=l;)if(s=Math.floor(a+(l-a)/2),c=n[s]-o,c<0)a=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,n[s]===o)return s/(r-1);const h=n[s],u=n[s+1]-h,f=(o-h)/u;return(s+f)/(r-1)}getTangent(t,e){let s=t-1e-4,r=t+1e-4;s<0&&(s=0),r>1&&(r=1);const o=this.getPoint(s),a=this.getPoint(r),l=e||(o.isVector2?new Et:new B);return l.copy(a).sub(o).normalize(),l}getTangentAt(t,e){const n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e=!1){const n=new B,s=[],r=[],o=[],a=new B,l=new Ee;for(let f=0;f<=t;f++){const g=f/t;s[f]=this.getTangentAt(g,new B)}r[0]=new B,o[0]=new B;let c=Number.MAX_VALUE;const h=Math.abs(s[0].x),d=Math.abs(s[0].y),u=Math.abs(s[0].z);h<=c&&(c=h,n.set(1,0,0)),d<=c&&(c=d,n.set(0,1,0)),u<=c&&n.set(0,0,1),a.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],a),o[0].crossVectors(s[0],r[0]);for(let f=1;f<=t;f++){if(r[f]=r[f-1].clone(),o[f]=o[f-1].clone(),a.crossVectors(s[f-1],s[f]),a.length()>Number.EPSILON){a.normalize();const g=Math.acos(re(s[f-1].dot(s[f]),-1,1));r[f].applyMatrix4(l.makeRotationAxis(a,g))}o[f].crossVectors(s[f],r[f])}if(e===!0){let f=Math.acos(re(r[0].dot(r[t]),-1,1));f/=t,s[0].dot(a.crossVectors(r[0],r[t]))>0&&(f=-f);for(let g=1;g<=t;g++)r[g].applyMatrix4(l.makeRotationAxis(s[g],f*g)),o[g].crossVectors(s[g],r[g])}return{tangents:s,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class Xc extends vi{constructor(t=0,e=0,n=1,s=1,r=0,o=Math.PI*2,a=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=o,this.aClockwise=a,this.aRotation=l}getPoint(t,e=new Et){const n=e,s=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const o=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(o?r=0:r=s),this.aClockwise===!0&&!o&&(r===s?r=-s:r=r-s);const a=this.aStartAngle+t*r;let l=this.aX+this.xRadius*Math.cos(a),c=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){const h=Math.cos(this.aRotation),d=Math.sin(this.aRotation),u=l-this.aX,f=c-this.aY;l=u*h-f*d+this.aX,c=u*d+f*h+this.aY}return n.set(l,c)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class Xg extends Xc{constructor(t,e,n,s,r,o){super(t,e,n,n,s,r,o),this.isArcCurve=!0,this.type="ArcCurve"}}function Yc(){let i=0,t=0,e=0,n=0;function s(r,o,a,l){i=r,t=a,e=-3*r+3*o-2*a-l,n=2*r-2*o+a+l}return{initCatmullRom:function(r,o,a,l,c){s(o,a,c*(a-r),c*(l-o))},initNonuniformCatmullRom:function(r,o,a,l,c,h,d){let u=(o-r)/c-(a-r)/(c+h)+(a-o)/h,f=(a-o)/h-(l-o)/(h+d)+(l-a)/d;u*=h,f*=h,s(o,a,u,f)},calc:function(r){const o=r*r,a=o*r;return i+t*r+e*o+n*a}}}const iu=new B,su=new B,pl=new Yc,ml=new Yc,gl=new Yc;class Yg extends vi{constructor(t=[],e=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=s}getPoint(t,e=new B){const n=e,s=this.points,r=s.length,o=(r-(this.closed?0:1))*t;let a=Math.floor(o),l=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:l===0&&a===r-1&&(a=r-2,l=1);let c,h;this.closed||a>0?c=s[(a-1)%r]:(su.subVectors(s[0],s[1]).add(s[0]),c=su);const d=s[a%r],u=s[(a+1)%r];if(this.closed||a+2<r?h=s[(a+2)%r]:(iu.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=iu),this.curveType==="centripetal"||this.curveType==="chordal"){const f=this.curveType==="chordal"?.5:.25;let g=Math.pow(c.distanceToSquared(d),f),v=Math.pow(d.distanceToSquared(u),f),m=Math.pow(u.distanceToSquared(h),f);v<1e-4&&(v=1),g<1e-4&&(g=v),m<1e-4&&(m=v),pl.initNonuniformCatmullRom(c.x,d.x,u.x,h.x,g,v,m),ml.initNonuniformCatmullRom(c.y,d.y,u.y,h.y,g,v,m),gl.initNonuniformCatmullRom(c.z,d.z,u.z,h.z,g,v,m)}else this.curveType==="catmullrom"&&(pl.initCatmullRom(c.x,d.x,u.x,h.x,this.tension),ml.initCatmullRom(c.y,d.y,u.y,h.y,this.tension),gl.initCatmullRom(c.z,d.z,u.z,h.z,this.tension));return n.set(pl.calc(l),ml.calc(l),gl.calc(l)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new B().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function ru(i,t,e,n,s){const r=(n-t)*.5,o=(s-e)*.5,a=i*i,l=i*a;return(2*e-2*n+r+o)*l+(-3*e+3*n-2*r-o)*a+r*i+e}function Zg(i,t){const e=1-i;return e*e*t}function Kg(i,t){return 2*(1-i)*i*t}function $g(i,t){return i*i*t}function Xr(i,t,e,n){return Zg(i,t)+Kg(i,e)+$g(i,n)}function Jg(i,t){const e=1-i;return e*e*e*t}function jg(i,t){const e=1-i;return 3*e*e*i*t}function Qg(i,t){return 3*(1-i)*i*i*t}function tv(i,t){return i*i*i*t}function Yr(i,t,e,n,s){return Jg(i,t)+jg(i,e)+Qg(i,n)+tv(i,s)}class Kd extends vi{constructor(t=new Et,e=new Et,n=new Et,s=new Et){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new Et){const n=e,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(Yr(t,s.x,r.x,o.x,a.x),Yr(t,s.y,r.y,o.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class ev extends vi{constructor(t=new B,e=new B,n=new B,s=new B){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new B){const n=e,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(Yr(t,s.x,r.x,o.x,a.x),Yr(t,s.y,r.y,o.y,a.y),Yr(t,s.z,r.z,o.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class $d extends vi{constructor(t=new Et,e=new Et){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new Et){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new Et){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class nv extends vi{constructor(t=new B,e=new B){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new B){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new B){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Jd extends vi{constructor(t=new Et,e=new Et,n=new Et){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new Et){const n=e,s=this.v0,r=this.v1,o=this.v2;return n.set(Xr(t,s.x,r.x,o.x),Xr(t,s.y,r.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class iv extends vi{constructor(t=new B,e=new B,n=new B){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new B){const n=e,s=this.v0,r=this.v1,o=this.v2;return n.set(Xr(t,s.x,r.x,o.x),Xr(t,s.y,r.y,o.y),Xr(t,s.z,r.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class jd extends vi{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new Et){const n=e,s=this.points,r=(s.length-1)*t,o=Math.floor(r),a=r-o,l=s[o===0?o:o-1],c=s[o],h=s[o>s.length-2?s.length-1:o+1],d=s[o>s.length-3?s.length-1:o+2];return n.set(ru(a,l.x,c.x,h.x,d.x),ru(a,l.y,c.y,h.y,d.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new Et().fromArray(s))}return this}}var mc=Object.freeze({__proto__:null,ArcCurve:Xg,CatmullRomCurve3:Yg,CubicBezierCurve:Kd,CubicBezierCurve3:ev,EllipseCurve:Xc,LineCurve:$d,LineCurve3:nv,QuadraticBezierCurve:Jd,QuadraticBezierCurve3:iv,SplineCurve:jd});class sv extends vi{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new mc[n](e,t))}return this}getPoint(t,e){const n=t*this.getLength(),s=this.getCurveLengths();let r=0;for(;r<s.length;){if(s[r]>=n){const o=s[r]-n,a=this.curves[r],l=a.getLength(),c=l===0?0:1-o/l;return a.getPointAt(c,e)}r++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let n=0,s=this.curves.length;n<s;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let n;for(let s=0,r=this.curves;s<r.length;s++){const o=r[s],a=o.isEllipseCurve?t*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?t*o.points.length:t,l=o.getPoints(a);for(let c=0;c<l.length;c++){const h=l[c];n&&n.equals(h)||(e.push(h),n=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(s.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){const s=this.curves[e];t.curves.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(new mc[s.type]().fromJSON(s))}return this}}class ou extends sv{constructor(t){super(),this.type="Path",this.currentPoint=new Et,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const n=new $d(this.currentPoint.clone(),new Et(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,s){const r=new Jd(this.currentPoint.clone(),new Et(t,e),new Et(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(t,e,n,s,r,o){const a=new Kd(this.currentPoint.clone(),new Et(t,e),new Et(n,s),new Et(r,o));return this.curves.push(a),this.currentPoint.set(r,o),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),n=new jd(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,s,r,o){const a=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(t+a,e+l,n,s,r,o),this}absarc(t,e,n,s,r,o){return this.absellipse(t,e,n,n,s,r,o),this}ellipse(t,e,n,s,r,o,a,l){const c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+c,e+h,n,s,r,o,a,l),this}absellipse(t,e,n,s,r,o,a,l){const c=new Xc(t,e,n,s,r,o,a,l);if(this.curves.length>0){const d=c.getPoint(0);d.equals(this.currentPoint)||this.lineTo(d.x,d.y)}this.curves.push(c);const h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class Zc extends ou{constructor(t){super(t),this.uuid=Ps(),this.type="Shape",this.holes=[]}getPointsHoles(t){const e=[];for(let n=0,s=this.holes.length;n<s;n++)e[n]=this.holes[n].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const s=t.holes[e];this.holes.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,n=this.holes.length;e<n;e++){const s=this.holes[e];t.holes.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const s=t.holes[e];this.holes.push(new ou().fromJSON(s))}return this}}function rv(i,t,e=2){const n=t&&t.length,s=n?t[0]*e:i.length;let r=Qd(i,0,s,e,!0);const o=[];if(!r||r.next===r.prev)return o;let a,l,c;if(n&&(r=hv(i,t,r,e)),i.length>80*e){a=i[0],l=i[1];let h=a,d=l;for(let u=e;u<s;u+=e){const f=i[u],g=i[u+1];f<a&&(a=f),g<l&&(l=g),f>h&&(h=f),g>d&&(d=g)}c=Math.max(h-a,d-l),c=c!==0?32767/c:0}return eo(r,o,e,a,l,c,0),o}function Qd(i,t,e,n,s){let r;if(s===Mv(i,t,e,n)>0)for(let o=t;o<e;o+=n)r=au(o/n|0,i[o],i[o+1],r);else for(let o=e-n;o>=t;o-=n)r=au(o/n|0,i[o],i[o+1],r);return r&&ur(r,r.next)&&(io(r),r=r.next),r}function As(i,t){if(!i)return i;t||(t=i);let e=i,n;do if(n=!1,!e.steiner&&(ur(e,e.next)||Fe(e.prev,e,e.next)===0)){if(io(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function eo(i,t,e,n,s,r,o){if(!i)return;!o&&r&&mv(i,n,s,r);let a=i;for(;i.prev!==i.next;){const l=i.prev,c=i.next;if(r?av(i,n,s,r):ov(i)){t.push(l.i,i.i,c.i),io(i),i=c.next,a=c.next;continue}if(i=c,i===a){o?o===1?(i=lv(As(i),t),eo(i,t,e,n,s,r,2)):o===2&&cv(i,t,e,n,s,r):eo(As(i),t,e,n,s,r,1);break}}}function ov(i){const t=i.prev,e=i,n=i.next;if(Fe(t,e,n)>=0)return!1;const s=t.x,r=e.x,o=n.x,a=t.y,l=e.y,c=n.y,h=Math.min(s,r,o),d=Math.min(a,l,c),u=Math.max(s,r,o),f=Math.max(a,l,c);let g=n.next;for(;g!==t;){if(g.x>=h&&g.x<=u&&g.y>=d&&g.y<=f&&Or(s,a,r,l,o,c,g.x,g.y)&&Fe(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function av(i,t,e,n){const s=i.prev,r=i,o=i.next;if(Fe(s,r,o)>=0)return!1;const a=s.x,l=r.x,c=o.x,h=s.y,d=r.y,u=o.y,f=Math.min(a,l,c),g=Math.min(h,d,u),v=Math.max(a,l,c),m=Math.max(h,d,u),p=gc(f,g,t,e,n),x=gc(v,m,t,e,n);let w=i.prevZ,y=i.nextZ;for(;w&&w.z>=p&&y&&y.z<=x;){if(w.x>=f&&w.x<=v&&w.y>=g&&w.y<=m&&w!==s&&w!==o&&Or(a,h,l,d,c,u,w.x,w.y)&&Fe(w.prev,w,w.next)>=0||(w=w.prevZ,y.x>=f&&y.x<=v&&y.y>=g&&y.y<=m&&y!==s&&y!==o&&Or(a,h,l,d,c,u,y.x,y.y)&&Fe(y.prev,y,y.next)>=0))return!1;y=y.nextZ}for(;w&&w.z>=p;){if(w.x>=f&&w.x<=v&&w.y>=g&&w.y<=m&&w!==s&&w!==o&&Or(a,h,l,d,c,u,w.x,w.y)&&Fe(w.prev,w,w.next)>=0)return!1;w=w.prevZ}for(;y&&y.z<=x;){if(y.x>=f&&y.x<=v&&y.y>=g&&y.y<=m&&y!==s&&y!==o&&Or(a,h,l,d,c,u,y.x,y.y)&&Fe(y.prev,y,y.next)>=0)return!1;y=y.nextZ}return!0}function lv(i,t){let e=i;do{const n=e.prev,s=e.next.next;!ur(n,s)&&ef(n,e,e.next,s)&&no(n,s)&&no(s,n)&&(t.push(n.i,e.i,s.i),io(e),io(e.next),e=i=s),e=e.next}while(e!==i);return As(e)}function cv(i,t,e,n,s,r){let o=i;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&xv(o,a)){let l=nf(o,a);o=As(o,o.next),l=As(l,l.next),eo(o,t,e,n,s,r,0),eo(l,t,e,n,s,r,0);return}a=a.next}o=o.next}while(o!==i)}function hv(i,t,e,n){const s=[];for(let r=0,o=t.length;r<o;r++){const a=t[r]*n,l=r<o-1?t[r+1]*n:i.length,c=Qd(i,a,l,n,!1);c===c.next&&(c.steiner=!0),s.push(vv(c))}s.sort(uv);for(let r=0;r<s.length;r++)e=dv(s[r],e);return e}function uv(i,t){let e=i.x-t.x;if(e===0&&(e=i.y-t.y,e===0)){const n=(i.next.y-i.y)/(i.next.x-i.x),s=(t.next.y-t.y)/(t.next.x-t.x);e=n-s}return e}function dv(i,t){const e=fv(i,t);if(!e)return t;const n=nf(e,i);return As(n,n.next),As(e,e.next)}function fv(i,t){let e=t;const n=i.x,s=i.y;let r=-1/0,o;if(ur(i,e))return e;do{if(ur(i,e.next))return e.next;if(s<=e.y&&s>=e.next.y&&e.next.y!==e.y){const d=e.x+(s-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(d<=n&&d>r&&(r=d,o=e.x<e.next.x?e:e.next,d===n))return o}e=e.next}while(e!==t);if(!o)return null;const a=o,l=o.x,c=o.y;let h=1/0;e=o;do{if(n>=e.x&&e.x>=l&&n!==e.x&&tf(s<c?n:r,s,l,c,s<c?r:n,s,e.x,e.y)){const d=Math.abs(s-e.y)/(n-e.x);no(e,i)&&(d<h||d===h&&(e.x>o.x||e.x===o.x&&pv(o,e)))&&(o=e,h=d)}e=e.next}while(e!==a);return o}function pv(i,t){return Fe(i.prev,i,t.prev)<0&&Fe(t.next,i,i.next)<0}function mv(i,t,e,n){let s=i;do s.z===0&&(s.z=gc(s.x,s.y,t,e,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,gv(s)}function gv(i){let t,e=1;do{let n=i,s;i=null;let r=null;for(t=0;n;){t++;let o=n,a=0;for(let c=0;c<e&&(a++,o=o.nextZ,!!o);c++);let l=e;for(;a>0||l>0&&o;)a!==0&&(l===0||!o||n.z<=o.z)?(s=n,n=n.nextZ,a--):(s=o,o=o.nextZ,l--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;n=o}r.nextZ=null,e*=2}while(t>1);return i}function gc(i,t,e,n,s){return i=(i-e)*s|0,t=(t-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,i|t<<1}function vv(i){let t=i,e=i;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==i);return e}function tf(i,t,e,n,s,r,o,a){return(s-o)*(t-a)>=(i-o)*(r-a)&&(i-o)*(n-a)>=(e-o)*(t-a)&&(e-o)*(r-a)>=(s-o)*(n-a)}function Or(i,t,e,n,s,r,o,a){return!(i===o&&t===a)&&tf(i,t,e,n,s,r,o,a)}function xv(i,t){return i.next.i!==t.i&&i.prev.i!==t.i&&!_v(i,t)&&(no(i,t)&&no(t,i)&&yv(i,t)&&(Fe(i.prev,i,t.prev)||Fe(i,t.prev,t))||ur(i,t)&&Fe(i.prev,i,i.next)>0&&Fe(t.prev,t,t.next)>0)}function Fe(i,t,e){return(t.y-i.y)*(e.x-t.x)-(t.x-i.x)*(e.y-t.y)}function ur(i,t){return i.x===t.x&&i.y===t.y}function ef(i,t,e,n){const s=Bo(Fe(i,t,e)),r=Bo(Fe(i,t,n)),o=Bo(Fe(e,n,i)),a=Bo(Fe(e,n,t));return!!(s!==r&&o!==a||s===0&&zo(i,e,t)||r===0&&zo(i,n,t)||o===0&&zo(e,i,n)||a===0&&zo(e,t,n))}function zo(i,t,e){return t.x<=Math.max(i.x,e.x)&&t.x>=Math.min(i.x,e.x)&&t.y<=Math.max(i.y,e.y)&&t.y>=Math.min(i.y,e.y)}function Bo(i){return i>0?1:i<0?-1:0}function _v(i,t){let e=i;do{if(e.i!==i.i&&e.next.i!==i.i&&e.i!==t.i&&e.next.i!==t.i&&ef(e,e.next,i,t))return!0;e=e.next}while(e!==i);return!1}function no(i,t){return Fe(i.prev,i,i.next)<0?Fe(i,t,i.next)>=0&&Fe(i,i.prev,t)>=0:Fe(i,t,i.prev)<0||Fe(i,i.next,t)<0}function yv(i,t){let e=i,n=!1;const s=(i.x+t.x)/2,r=(i.y+t.y)/2;do e.y>r!=e.next.y>r&&e.next.y!==e.y&&s<(e.next.x-e.x)*(r-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==i);return n}function nf(i,t){const e=vc(i.i,i.x,i.y),n=vc(t.i,t.x,t.y),s=i.next,r=t.prev;return i.next=t,t.prev=i,e.next=s,s.prev=e,n.next=e,e.prev=n,r.next=n,n.prev=r,n}function au(i,t,e,n){const s=vc(i,t,e);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function io(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function vc(i,t,e){return{i,x:t,y:e,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function Mv(i,t,e,n){let s=0;for(let r=t,o=e-n;r<e;r+=n)s+=(i[o]-i[r])*(i[r+1]+i[o+1]),o=r;return s}class Sv{static triangulate(t,e,n=2){return rv(t,e,n)}}class sr{static area(t){const e=t.length;let n=0;for(let s=e-1,r=0;r<e;s=r++)n+=t[s].x*t[r].y-t[r].x*t[s].y;return n*.5}static isClockWise(t){return sr.area(t)<0}static triangulateShape(t,e){const n=[],s=[],r=[];lu(t),cu(n,t);let o=t.length;e.forEach(lu);for(let l=0;l<e.length;l++)s.push(o),o+=e[l].length,cu(n,e[l]);const a=Sv.triangulate(n,s);for(let l=0;l<a.length;l+=3)r.push(a.slice(l,l+3));return r}}function lu(i){const t=i.length;t>2&&i[t-1].equals(i[0])&&i.pop()}function cu(i,t){for(let e=0;e<t.length;e++)i.push(t[e].x),i.push(t[e].y)}class Ra extends Ne{constructor(t=new Zc([new Et(.5,.5),new Et(-.5,.5),new Et(-.5,-.5),new Et(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];const n=this,s=[],r=[];for(let a=0,l=t.length;a<l;a++){const c=t[a];o(c)}this.setAttribute("position",new ue(s,3)),this.setAttribute("uv",new ue(r,2)),this.computeVertexNormals();function o(a){const l=[],c=e.curveSegments!==void 0?e.curveSegments:12,h=e.steps!==void 0?e.steps:1,d=e.depth!==void 0?e.depth:1;let u=e.bevelEnabled!==void 0?e.bevelEnabled:!0,f=e.bevelThickness!==void 0?e.bevelThickness:.2,g=e.bevelSize!==void 0?e.bevelSize:f-.1,v=e.bevelOffset!==void 0?e.bevelOffset:0,m=e.bevelSegments!==void 0?e.bevelSegments:3;const p=e.extrudePath,x=e.UVGenerator!==void 0?e.UVGenerator:bv;let w,y=!1,M,S,C,_;if(p){w=p.getSpacedPoints(h),y=!0,u=!1;const ct=p.isCatmullRomCurve3?p.closed:!1;M=p.computeFrenetFrames(h,ct),S=new B,C=new B,_=new B}u||(m=0,f=0,g=0,v=0);const T=a.extractPoints(c);let L=T.shape;const I=T.holes;if(!sr.isClockWise(L)){L=L.reverse();for(let ct=0,z=I.length;ct<z;ct++){const et=I[ct];sr.isClockWise(et)&&(I[ct]=et.reverse())}}function N(ct){const et=10000000000000001e-36;let nt=ct[0];for(let J=1;J<=ct.length;J++){const k=J%ct.length,Q=ct[k],ht=Q.x-nt.x,vt=Q.y-nt.y,O=ht*ht+vt*vt,Rt=Math.max(Math.abs(Q.x),Math.abs(Q.y),Math.abs(nt.x),Math.abs(nt.y)),At=et*Rt*Rt;if(O<=At){ct.splice(k,1),J--;continue}nt=Q}}N(L),I.forEach(N);const A=I.length,D=L;for(let ct=0;ct<A;ct++){const z=I[ct];L=L.concat(z)}function F(ct,z,et){return z||ge("ExtrudeGeometry: vec does not exist"),ct.clone().addScaledVector(z,et)}const G=L.length;function Y(ct,z,et){let nt,J,k;const Q=ct.x-z.x,ht=ct.y-z.y,vt=et.x-ct.x,O=et.y-ct.y,Rt=Q*Q+ht*ht,At=Q*O-ht*vt;if(Math.abs(At)>Number.EPSILON){const P=Math.sqrt(Rt),b=Math.sqrt(vt*vt+O*O),H=z.x-ht/P,tt=z.y+Q/P,st=et.x-O/b,bt=et.y+vt/b,Ct=((st-H)*O-(bt-tt)*vt)/(Q*O-ht*vt);nt=H+Q*Ct-ct.x,J=tt+ht*Ct-ct.y;const pt=nt*nt+J*J;if(pt<=2)return new Et(nt,J);k=Math.sqrt(pt/2)}else{let P=!1;Q>Number.EPSILON?vt>Number.EPSILON&&(P=!0):Q<-Number.EPSILON?vt<-Number.EPSILON&&(P=!0):Math.sign(ht)===Math.sign(O)&&(P=!0),P?(nt=-ht,J=Q,k=Math.sqrt(Rt)):(nt=Q,J=ht,k=Math.sqrt(Rt/2))}return new Et(nt/k,J/k)}const V=[];for(let ct=0,z=D.length,et=z-1,nt=ct+1;ct<z;ct++,et++,nt++)et===z&&(et=0),nt===z&&(nt=0),V[ct]=Y(D[ct],D[et],D[nt]);const q=[];let $,it=V.concat();for(let ct=0,z=A;ct<z;ct++){const et=I[ct];$=[];for(let nt=0,J=et.length,k=J-1,Q=nt+1;nt<J;nt++,k++,Q++)k===J&&(k=0),Q===J&&(Q=0),$[nt]=Y(et[nt],et[k],et[Q]);q.push($),it=it.concat($)}let yt;if(m===0)yt=sr.triangulateShape(D,I);else{const ct=[],z=[];for(let et=0;et<m;et++){const nt=et/m,J=f*Math.cos(nt*Math.PI/2),k=g*Math.sin(nt*Math.PI/2)+v;for(let Q=0,ht=D.length;Q<ht;Q++){const vt=F(D[Q],V[Q],k);dt(vt.x,vt.y,-J),nt===0&&ct.push(vt)}for(let Q=0,ht=A;Q<ht;Q++){const vt=I[Q];$=q[Q];const O=[];for(let Rt=0,At=vt.length;Rt<At;Rt++){const P=F(vt[Rt],$[Rt],k);dt(P.x,P.y,-J),nt===0&&O.push(P)}nt===0&&z.push(O)}}yt=sr.triangulateShape(ct,z)}const Ft=yt.length,Zt=g+v;for(let ct=0;ct<G;ct++){const z=u?F(L[ct],it[ct],Zt):L[ct];y?(C.copy(M.normals[0]).multiplyScalar(z.x),S.copy(M.binormals[0]).multiplyScalar(z.y),_.copy(w[0]).add(C).add(S),dt(_.x,_.y,_.z)):dt(z.x,z.y,0)}for(let ct=1;ct<=h;ct++)for(let z=0;z<G;z++){const et=u?F(L[z],it[z],Zt):L[z];y?(C.copy(M.normals[ct]).multiplyScalar(et.x),S.copy(M.binormals[ct]).multiplyScalar(et.y),_.copy(w[ct]).add(C).add(S),dt(_.x,_.y,_.z)):dt(et.x,et.y,d/h*ct)}for(let ct=m-1;ct>=0;ct--){const z=ct/m,et=f*Math.cos(z*Math.PI/2),nt=g*Math.sin(z*Math.PI/2)+v;for(let J=0,k=D.length;J<k;J++){const Q=F(D[J],V[J],nt);dt(Q.x,Q.y,d+et)}for(let J=0,k=I.length;J<k;J++){const Q=I[J];$=q[J];for(let ht=0,vt=Q.length;ht<vt;ht++){const O=F(Q[ht],$[ht],nt);y?dt(O.x,O.y+w[h-1].y,w[h-1].x+et):dt(O.x,O.y,d+et)}}}lt(),W();function lt(){const ct=s.length/3;if(u){let z=0,et=G*z;for(let nt=0;nt<Ft;nt++){const J=yt[nt];Mt(J[2]+et,J[1]+et,J[0]+et)}z=h+m*2,et=G*z;for(let nt=0;nt<Ft;nt++){const J=yt[nt];Mt(J[0]+et,J[1]+et,J[2]+et)}}else{for(let z=0;z<Ft;z++){const et=yt[z];Mt(et[2],et[1],et[0])}for(let z=0;z<Ft;z++){const et=yt[z];Mt(et[0]+G*h,et[1]+G*h,et[2]+G*h)}}n.addGroup(ct,s.length/3-ct,0)}function W(){const ct=s.length/3;let z=0;rt(D,z),z+=D.length;for(let et=0,nt=I.length;et<nt;et++){const J=I[et];rt(J,z),z+=J.length}n.addGroup(ct,s.length/3-ct,1)}function rt(ct,z){let et=ct.length;for(;--et>=0;){const nt=et;let J=et-1;J<0&&(J=ct.length-1);for(let k=0,Q=h+m*2;k<Q;k++){const ht=G*k,vt=G*(k+1),O=z+nt+ht,Rt=z+J+ht,At=z+J+vt,P=z+nt+vt;_t(O,Rt,At,P)}}}function dt(ct,z,et){l.push(ct),l.push(z),l.push(et)}function Mt(ct,z,et){Tt(ct),Tt(z),Tt(et);const nt=s.length/3,J=x.generateTopUV(n,s,nt-3,nt-2,nt-1);kt(J[0]),kt(J[1]),kt(J[2])}function _t(ct,z,et,nt){Tt(ct),Tt(z),Tt(nt),Tt(z),Tt(et),Tt(nt);const J=s.length/3,k=x.generateSideWallUV(n,s,J-6,J-3,J-2,J-1);kt(k[0]),kt(k[1]),kt(k[3]),kt(k[1]),kt(k[2]),kt(k[3])}function Tt(ct){s.push(l[ct*3+0]),s.push(l[ct*3+1]),s.push(l[ct*3+2])}function kt(ct){r.push(ct.x),r.push(ct.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes,n=this.parameters.options;return wv(e,n,t)}static fromJSON(t,e){const n=[];for(let r=0,o=t.shapes.length;r<o;r++){const a=e[t.shapes[r]];n.push(a)}const s=t.options.extrudePath;return s!==void 0&&(t.options.extrudePath=new mc[s.type]().fromJSON(s)),new Ra(n,t.options)}}const bv={generateTopUV:function(i,t,e,n,s){const r=t[e*3],o=t[e*3+1],a=t[n*3],l=t[n*3+1],c=t[s*3],h=t[s*3+1];return[new Et(r,o),new Et(a,l),new Et(c,h)]},generateSideWallUV:function(i,t,e,n,s,r){const o=t[e*3],a=t[e*3+1],l=t[e*3+2],c=t[n*3],h=t[n*3+1],d=t[n*3+2],u=t[s*3],f=t[s*3+1],g=t[s*3+2],v=t[r*3],m=t[r*3+1],p=t[r*3+2];return Math.abs(a-h)<Math.abs(o-c)?[new Et(o,1-l),new Et(c,1-d),new Et(u,1-g),new Et(v,1-p)]:[new Et(a,1-l),new Et(h,1-d),new Et(f,1-g),new Et(m,1-p)]}};function wv(i,t,e){if(e.shapes=[],Array.isArray(i))for(let n=0,s=i.length;n<s;n++){const r=i[n];e.shapes.push(r.uuid)}else e.shapes.push(i.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}class Kc extends Ne{constructor(t=[new Et(0,-.5),new Et(.5,0),new Et(0,.5)],e=12,n=0,s=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:t,segments:e,phiStart:n,phiLength:s},e=Math.floor(e),s=re(s,0,Math.PI*2);const r=[],o=[],a=[],l=[],c=[],h=1/e,d=new B,u=new Et,f=new B,g=new B,v=new B;let m=0,p=0;for(let x=0;x<=t.length-1;x++)switch(x){case 0:m=t[x+1].x-t[x].x,p=t[x+1].y-t[x].y,f.x=p*1,f.y=-m,f.z=p*0,v.copy(f),f.normalize(),l.push(f.x,f.y,f.z);break;case t.length-1:l.push(v.x,v.y,v.z);break;default:m=t[x+1].x-t[x].x,p=t[x+1].y-t[x].y,f.x=p*1,f.y=-m,f.z=p*0,g.copy(f),f.x+=v.x,f.y+=v.y,f.z+=v.z,f.normalize(),l.push(f.x,f.y,f.z),v.copy(g)}for(let x=0;x<=e;x++){const w=n+x*h*s,y=Math.sin(w),M=Math.cos(w);for(let S=0;S<=t.length-1;S++){d.x=t[S].x*y,d.y=t[S].y,d.z=t[S].x*M,o.push(d.x,d.y,d.z),u.x=x/e,u.y=S/(t.length-1),a.push(u.x,u.y);const C=l[3*S+0]*y,_=l[3*S+1],T=l[3*S+0]*M;c.push(C,_,T)}}for(let x=0;x<e;x++)for(let w=0;w<t.length-1;w++){const y=w+x*t.length,M=y,S=y+t.length,C=y+t.length+1,_=y+1;r.push(M,S,_),r.push(C,_,S)}this.setIndex(r),this.setAttribute("position",new ue(o,3)),this.setAttribute("uv",new ue(a,2)),this.setAttribute("normal",new ue(c,3))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Kc(t.points,t.segments,t.phiStart,t.phiLength)}}class Ns extends Ne{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};const r=t/2,o=e/2,a=Math.floor(n),l=Math.floor(s),c=a+1,h=l+1,d=t/a,u=e/l,f=[],g=[],v=[],m=[];for(let p=0;p<h;p++){const x=p*u-o;for(let w=0;w<c;w++){const y=w*d-r;g.push(y,-x,0),v.push(0,0,1),m.push(w/a),m.push(1-p/l)}}for(let p=0;p<l;p++)for(let x=0;x<a;x++){const w=x+c*p,y=x+c*(p+1),M=x+1+c*(p+1),S=x+1+c*p;f.push(w,y,S),f.push(y,M,S)}this.setIndex(f),this.setAttribute("position",new ue(g,3)),this.setAttribute("normal",new ue(v,3)),this.setAttribute("uv",new ue(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ns(t.width,t.height,t.widthSegments,t.heightSegments)}}class so extends Ne{constructor(t=.5,e=1,n=32,s=1,r=0,o=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:n,phiSegments:s,thetaStart:r,thetaLength:o},n=Math.max(3,n),s=Math.max(1,s);const a=[],l=[],c=[],h=[];let d=t;const u=(e-t)/s,f=new B,g=new Et;for(let v=0;v<=s;v++){for(let m=0;m<=n;m++){const p=r+m/n*o;f.x=d*Math.cos(p),f.y=d*Math.sin(p),l.push(f.x,f.y,f.z),c.push(0,0,1),g.x=(f.x/e+1)/2,g.y=(f.y/e+1)/2,h.push(g.x,g.y)}d+=u}for(let v=0;v<s;v++){const m=v*(n+1);for(let p=0;p<n;p++){const x=p+m,w=x,y=x+n+1,M=x+n+2,S=x+1;a.push(w,y,S),a.push(y,M,S)}}this.setIndex(a),this.setAttribute("position",new ue(l,3)),this.setAttribute("normal",new ue(c,3)),this.setAttribute("uv",new ue(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new so(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}}class on extends Ne{constructor(t=1,e=32,n=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const l=Math.min(o+a,Math.PI);let c=0;const h=[],d=new B,u=new B,f=[],g=[],v=[],m=[];for(let p=0;p<=n;p++){const x=[],w=p/n,y=o+w*a,M=t*Math.cos(y),S=Math.sqrt(t*t-M*M);let C=0;p===0&&o===0?C=.5/e:p===n&&l===Math.PI&&(C=-.5/e);for(let _=0;_<=e;_++){const T=_/e,L=s+T*r;d.x=-S*Math.cos(L),d.y=M,d.z=S*Math.sin(L),g.push(d.x,d.y,d.z),u.copy(d).normalize(),v.push(u.x,u.y,u.z),m.push(T+C,1-w),x.push(c++)}h.push(x)}for(let p=0;p<n;p++)for(let x=0;x<e;x++){const w=h[p][x+1],y=h[p][x],M=h[p+1][x],S=h[p+1][x+1];(p!==0||o>0)&&f.push(w,y,S),(p!==n-1||l<Math.PI)&&f.push(y,M,S)}this.setIndex(f),this.setAttribute("position",new ue(g,3)),this.setAttribute("normal",new ue(v,3)),this.setAttribute("uv",new ue(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new on(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class Dn extends Ne{constructor(t=1,e=.4,n=12,s=48,r=Math.PI*2,o=0,a=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:s,arc:r,thetaStart:o,thetaLength:a},n=Math.floor(n),s=Math.floor(s);const l=[],c=[],h=[],d=[],u=new B,f=new B,g=new B;for(let v=0;v<=n;v++){const m=o+v/n*a;for(let p=0;p<=s;p++){const x=p/s*r;f.x=(t+e*Math.cos(m))*Math.cos(x),f.y=(t+e*Math.cos(m))*Math.sin(x),f.z=e*Math.sin(m),c.push(f.x,f.y,f.z),u.x=t*Math.cos(x),u.y=t*Math.sin(x),g.subVectors(f,u).normalize(),h.push(g.x,g.y,g.z),d.push(p/s),d.push(v/n)}}for(let v=1;v<=n;v++)for(let m=1;m<=s;m++){const p=(s+1)*v+m-1,x=(s+1)*(v-1)+m-1,w=(s+1)*(v-1)+m,y=(s+1)*v+m;l.push(p,x,y),l.push(x,w,y)}this.setIndex(l),this.setAttribute("position",new ue(c,3)),this.setAttribute("normal",new ue(h,3)),this.setAttribute("uv",new ue(d,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Dn(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc,t.thetaStart,t.thetaLength)}}function dr(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const s=i[e][n];if(hu(s))s.isRenderTargetTexture?(ne("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone();else if(Array.isArray(s))if(hu(s[0])){const r=[];for(let o=0,a=s.length;o<a;o++)r[o]=s[o].clone();t[e][n]=r}else t[e][n]=s.slice();else t[e][n]=s}}return t}function vn(i){const t={};for(let e=0;e<i.length;e++){const n=dr(i[e]);for(const s in n)t[s]=n[s]}return t}function hu(i){return i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)}function Ev(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function sf(i){const t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:me.workingColorSpace}const Tv={clone:dr,merge:vn};var Av=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Cv=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Gn extends Is{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Av,this.fragmentShader=Cv,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=dr(t.uniforms),this.uniformsGroups=Ev(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this.defaultAttributeValues=Object.assign({},t.defaultAttributeValues),this.index0AttributeName=t.index0AttributeName,this.uniformsNeedUpdate=t.uniformsNeedUpdate,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const o=this.uniforms[s].value;o&&o.isTexture?e.uniforms[s]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[s]={type:"m4",value:o.toArray()}:e.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}fromJSON(t,e){if(super.fromJSON(t,e),t.uniforms!==void 0)for(const n in t.uniforms){const s=t.uniforms[n];switch(this.uniforms[n]={},s.type){case"t":this.uniforms[n].value=e[s.value]||null;break;case"c":this.uniforms[n].value=new te().setHex(s.value);break;case"v2":this.uniforms[n].value=new Et().fromArray(s.value);break;case"v3":this.uniforms[n].value=new B().fromArray(s.value);break;case"v4":this.uniforms[n].value=new Ue().fromArray(s.value);break;case"m3":this.uniforms[n].value=new se().fromArray(s.value);break;case"m4":this.uniforms[n].value=new Ee().fromArray(s.value);break;default:this.uniforms[n].value=s.value}}if(t.defines!==void 0&&(this.defines=t.defines),t.vertexShader!==void 0&&(this.vertexShader=t.vertexShader),t.fragmentShader!==void 0&&(this.fragmentShader=t.fragmentShader),t.glslVersion!==void 0&&(this.glslVersion=t.glslVersion),t.extensions!==void 0)for(const n in t.extensions)this.extensions[n]=t.extensions[n];return t.lights!==void 0&&(this.lights=t.lights),t.clipping!==void 0&&(this.clipping=t.clipping),this}}class Rv extends Gn{constructor(t){super(t),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class De extends Is{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new te(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new te(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=ha,this.normalScale=new Et(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new os,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class Pi extends De{constructor(t){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new Et(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return re(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(e){this.ior=(1+.4*e)/(1-.4*e)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new te(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new te(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new te(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._retroreflectivity=0,this._sheen=0,this._transmission=0,this.setValues(t)}get anisotropy(){return this._anisotropy}set anisotropy(t){this._anisotropy>0!=t>0&&this.version++,this._anisotropy=t}get clearcoat(){return this._clearcoat}set clearcoat(t){this._clearcoat>0!=t>0&&this.version++,this._clearcoat=t}get iridescence(){return this._iridescence}set iridescence(t){this._iridescence>0!=t>0&&this.version++,this._iridescence=t}get dispersion(){return this._dispersion}set dispersion(t){this._dispersion>0!=t>0&&this.version++,this._dispersion=t}get retroreflectivity(){return this._retroreflectivity}set retroreflectivity(t){this._retroreflectivity>0!=t>0&&this.version++,this._retroreflectivity=t}get sheen(){return this._sheen}set sheen(t){this._sheen>0!=t>0&&this.version++,this._sheen=t}get transmission(){return this._transmission}set transmission(t){this._transmission>0!=t>0&&this.version++,this._transmission=t}copy(t){return super.copy(t),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=t.anisotropy,this.anisotropyRotation=t.anisotropyRotation,this.anisotropyMap=t.anisotropyMap,this.clearcoat=t.clearcoat,this.clearcoatMap=t.clearcoatMap,this.clearcoatRoughness=t.clearcoatRoughness,this.clearcoatRoughnessMap=t.clearcoatRoughnessMap,this.clearcoatNormalMap=t.clearcoatNormalMap,this.clearcoatNormalScale.copy(t.clearcoatNormalScale),this.dispersion=t.dispersion,this.ior=t.ior,this.iridescence=t.iridescence,this.iridescenceMap=t.iridescenceMap,this.iridescenceIOR=t.iridescenceIOR,this.iridescenceThicknessRange=[...t.iridescenceThicknessRange],this.iridescenceThicknessMap=t.iridescenceThicknessMap,this.retroreflectivity=t.retroreflectivity,this.sheen=t.sheen,this.sheenColor.copy(t.sheenColor),this.sheenColorMap=t.sheenColorMap,this.sheenRoughness=t.sheenRoughness,this.sheenRoughnessMap=t.sheenRoughnessMap,this.transmission=t.transmission,this.transmissionMap=t.transmissionMap,this.thickness=t.thickness,this.thicknessMap=t.thicknessMap,this.attenuationDistance=t.attenuationDistance,this.attenuationColor.copy(t.attenuationColor),this.specularIntensity=t.specularIntensity,this.specularIntensityMap=t.specularIntensityMap,this.specularColor.copy(t.specularColor),this.specularColorMap=t.specularColorMap,this}}class Pv extends Is{constructor(t){super(),this.isMeshToonMaterial=!0,this.defines={TOON:""},this.type="MeshToonMaterial",this.color=new te(16777215),this.map=null,this.gradientMap=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new te(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=ha,this.normalScale=new Et(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.alphaMap=null,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.gradientMap=t.gradientMap,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.alphaMap=t.alphaMap,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}class Lv extends Is{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=W0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class Iv extends Is{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}class Pa extends Je{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new te(t),this.intensity=e}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,e}}const vl=new Ee,uu=new B,du=new B;class rf{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Et(512,512),this.mapType=Nn,this.map=null,this.mapPass=null,this.matrix=new Ee,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Wc,this._frameExtents=new Et(1,1),this._viewportCount=1,this._viewports=[new Ue(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera;uu.setFromMatrixPosition(t.matrixWorld),e.position.copy(uu),du.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(du),e.updateMatrixWorld(),this._updateMatrix(e,this.matrix,this._frustum)}_updateMatrix(t,e,n,s){vl.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),n.setFromProjectionMatrix(vl,t.coordinateSystem,t.reversedDepth);const r=this._frameExtents,o=s?s.z/r.x:1,a=s?s.w/r.y:1,l=s?s.x/r.x:0,c=s?s.y/r.y:0;t.coordinateSystem===Qr||t.reversedDepth?e.set(.5*o,0,0,.5*o+l,0,.5*a,0,.5*a+c,0,0,1,0,0,0,0,1):e.set(.5*o,0,0,.5*o+l,0,.5*a,0,.5*a+c,0,0,.5,.5,0,0,0,1),e.multiply(vl)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this.biasNode=t.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return t.intensity=this.intensity,t.bias=this.bias,t.normalBias=this.normalBias,t.radius=this.radius,t.blurSamples=this.blurSamples,t.mapSize=this.mapSize.toArray(),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}const ko=new B,Go=new xn,si=new B;class of extends Je{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Ee,this.projectionMatrix=new Ee,this.projectionMatrixInverse=new Ee,this.coordinateSystem=ui,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorld.decompose(ko,Go,si),si.x===1&&si.y===1&&si.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(ko,Go,si.set(1,1,1)).invert()}updateWorldMatrix(t,e,n=!1){super.updateWorldMatrix(t,e,n),this.matrixWorld.decompose(ko,Go,si),si.x===1&&si.y===1&&si.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(ko,Go,si.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const Qi=new B,fu=new Et,pu=new Et;class wn extends of{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=hr*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(Hr*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return hr*2*Math.atan(Math.tan(Hr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){Qi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Qi.x,Qi.y).multiplyScalar(-t/Qi.z),Qi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Qi.x,Qi.y).multiplyScalar(-t/Qi.z)}getViewSize(t,e){return this.getViewBounds(t,fu,pu),e.subVectors(pu,fu)}setViewOffset(t,e,n,s,r,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(Hr*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*s/l,e-=o.offsetY*n/c,s*=o.width/l,n*=o.height/c}const a=this.filmOffset;a!==0&&(r+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}class Nv extends rf{constructor(){super(new wn(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(t){const e=this.camera,n=hr*2*t.angle*this.focus,s=this.mapSize.width/this.mapSize.height*this.aspect,r=t.distance||e.far;(n!==e.fov||s!==e.aspect||r!==e.far)&&(e.fov=n,e.aspect=s,e.far=r,e.updateProjectionMatrix()),super.updateMatrices(t)}copy(t){return super.copy(t),this.focus=t.focus,this.aspect=t.aspect,this}toJSON(){const t=super.toJSON();return t.focus=this.focus,t.aspect=this.aspect,t}}class Dv extends Pa{constructor(t,e,n=0,s=Math.PI/3,r=0,o=2){super(t,e),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(Je.DEFAULT_UP),this.updateMatrix(),this.target=new Je,this.distance=n,this.angle=s,this.penumbra=r,this.decay=o,this.map=null,this.shadow=new Nv}get power(){return this.intensity*Math.PI}set power(t){this.intensity=t/Math.PI}dispose(){super.dispose(),this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.angle=t.angle,this.penumbra=t.penumbra,this.decay=t.decay,this.target=t.target.clone(),this.map=t.map,this.shadow=t.shadow.clone(),this}toJSON(t){const e=super.toJSON(t);return e.object.distance=this.distance,e.object.angle=this.angle,e.object.decay=this.decay,e.object.penumbra=this.penumbra,e.object.target=this.target.uuid,this.map&&this.map.isTexture&&(e.object.map=this.map.toJSON(t).uuid),e.object.shadow=this.shadow.toJSON(),e}}class Uv extends rf{constructor(){super(new wn(90,1,.5,500)),this.isPointLightShadow=!0}}class ro extends Pa{constructor(t,e,n=0,s=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new Uv}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}toJSON(t){const e=super.toJSON(t);return e.object.distance=this.distance,e.object.decay=this.decay,e.object.shadow=this.shadow.toJSON(),e}}class af extends of{constructor(t=-1,e=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-t,o=n+t,a=s+e,l=s-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=h*this.view.offsetY,l=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}class Fv extends Pa{constructor(t,e){super(t,e),this.isAmbientLight=!0,this.type="AmbientLight"}}class Ov extends Pa{constructor(t,e,n=10,s=10){super(t,e),this.isRectAreaLight=!0,this.type="RectAreaLight",this.width=n,this.height=s}get power(){return this.intensity*this.width*this.height*Math.PI}set power(t){this.intensity=t/(this.width*this.height*Math.PI)}copy(t){return super.copy(t),this.width=t.width,this.height=t.height,this}toJSON(t){const e=super.toJSON(t);return e.object.width=this.width,e.object.height=this.height,e}}const Js=-90,js=1;class zv extends Je{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new wn(Js,js,t,e);s.layers=this.layers,this.add(s);const r=new wn(Js,js,t,e);r.layers=this.layers,this.add(r);const o=new wn(Js,js,t,e);o.layers=this.layers,this.add(o);const a=new wn(Js,js,t,e);a.layers=this.layers,this.add(a);const l=new wn(Js,js,t,e);l.layers=this.layers,this.add(l);const c=new wn(Js,js,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,s,r,o,a,l]=e;for(const c of e)this.remove(c);if(t===ui)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===Qr)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,o,a,l,c,h]=this.children,d=t.getRenderTarget(),u=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const v=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let m=!1;t.isWebGLRenderer===!0?m=t.state.buffers.depth.getReversed():m=t.reversedDepthBuffer,t.setRenderTarget(n,0,s),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,r),t.setRenderTarget(n,1,s),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,o),t.setRenderTarget(n,2,s),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,a),t.setRenderTarget(n,3,s),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,l),t.setRenderTarget(n,4,s),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,c),n.texture.generateMipmaps=v,t.setRenderTarget(n,5,s),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,h),t.setRenderTarget(d,u,f),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class Bv extends wn{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}}const mu=new Ee;class kv{constructor(t,e,n=0,s=1/0){this.ray=new Ta(t,e),this.near=n,this.far=s,this.camera=null,this.layers=new Gc,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,e.projectionMatrix.elements[14]).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):ge("Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return mu.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(mu),this}intersectObject(t,e=!0,n=[]){return xc(t,this,n,e),n.sort(gu),n}intersectObjects(t,e=!0,n=[]){for(let s=0,r=t.length;s<r;s++)xc(t[s],this,n,e);return n.sort(gu),n}}function gu(i,t){return i.distance-t.distance}function xc(i,t,e,n){let s=!0;if(i.layers.test(t.layers)&&i.raycast(t,e)===!1&&(s=!1),s===!0&&n===!0){const r=i.children;for(let o=0,a=r.length;o<a;o++)xc(r[o],t,e,!0)}}class vu{constructor(t=1,e=0,n=0){this.radius=t,this.phi=e,this.theta=n}set(t,e,n){return this.radius=t,this.phi=e,this.theta=n,this}copy(t){return this.radius=t.radius,this.phi=t.phi,this.theta=t.theta,this}makeSafe(){return this.phi=re(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(t){return this.setFromCartesianCoords(t.x,t.y,t.z)}setFromCartesianCoords(t,e,n){return this.radius=Math.sqrt(t*t+e*e+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(t,n),this.phi=Math.acos(re(e/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}const ch=class ch{constructor(t,e,n,s){this.elements=[1,0,0,1],t!==void 0&&this.set(t,e,n,s)}identity(){return this.set(1,0,0,1),this}fromArray(t,e=0){for(let n=0;n<4;n++)this.elements[n]=t[n+e];return this}set(t,e,n,s){const r=this.elements;return r[0]=t,r[2]=e,r[1]=n,r[3]=s,this}};ch.prototype.isMatrix2=!0;let xu=ch;class Gv extends as{constructor(t,e=null){super(),this.object=t,this.domElement=e,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(t){this.domElement!==null&&this.disconnect(),this.domElement=t}disconnect(){}dispose(){}update(){}}function _u(i,t,e,n){const s=Vv(n);switch(e){case kd:return i*t;case Ea:return i*t/s.components*s.byteLength;case Dc:return i*t/s.components*s.byteLength;case Ts:return i*t*2/s.components*s.byteLength;case Uc:return i*t*2/s.components*s.byteLength;case Gd:return i*t*3/s.components*s.byteLength;case Kn:return i*t*4/s.components*s.byteLength;case Fc:return i*t*4/s.components*s.byteLength;case Jo:case jo:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case Qo:case ta:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case zl:case kl:return Math.max(i,16)*Math.max(t,8)/4;case Ol:case Bl:return Math.max(i,8)*Math.max(t,8)/2;case Gl:case Vl:case Wl:case ql:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case Hl:case la:case Xl:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Yl:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Zl:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case Kl:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case $l:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case Jl:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case jl:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case Ql:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case tc:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case ec:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case nc:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case ic:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case sc:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case rc:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case oc:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case ac:case lc:case cc:return Math.ceil(i/4)*Math.ceil(t/4)*16;case hc:case uc:return Math.ceil(i/4)*Math.ceil(t/4)*8;case ca:case dc:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function Vv(i){switch(i){case Nn:case Fd:return{byteLength:1,components:1};case Jr:case Od:case gi:return{byteLength:2,components:1};case Ic:case Nc:return{byteLength:2,components:4};case mi:case Lc:case Zn:return{byteLength:4,components:1};case zd:case Bd:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Rc}}));typeof window<"u"&&(window.__THREE__?ne("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Rc);function lf(){let i=null,t=!1,e=null,n=null;function s(r,o){n=i.requestAnimationFrame(s),e(r,o)}return{start:function(){t!==!0&&e!==null&&i!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i!==null&&i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function Hv(i){const t=new WeakMap;function e(a,l){const c=a.array,h=a.usage,d=c.byteLength,u=i.createBuffer();i.bindBuffer(l,u),i.bufferData(l,c,h),a.onUploadCallback();let f;if(c instanceof Float32Array)f=i.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)f=i.HALF_FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?f=i.HALF_FLOAT:f=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=i.SHORT;else if(c instanceof Uint32Array)f=i.UNSIGNED_INT;else if(c instanceof Int32Array)f=i.INT;else if(c instanceof Int8Array)f=i.BYTE;else if(c instanceof Uint8Array)f=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:u,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:d}}function n(a,l,c){const h=l.array,d=l.updateRanges;if(i.bindBuffer(c,a),d.length===0)i.bufferSubData(c,0,h);else{d.sort((f,g)=>f.start-g.start);let u=0;for(let f=1;f<d.length;f++){const g=d[u],v=d[f];v.start<=g.start+g.count+1?g.count=Math.max(g.count,v.start+v.count-g.start):(++u,d[u]=v)}d.length=u+1;for(let f=0,g=d.length;f<g;f++){const v=d[f];i.bufferSubData(c,v.start*h.BYTES_PER_ELEMENT,h,v.start,v.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),t.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);const l=t.get(a);l&&(i.deleteBuffer(l.buffer),t.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const h=t.get(a);(!h||h.version<a.version)&&t.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const c=t.get(a);if(c===void 0)t.set(a,e(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,a,l),c.version=a.version}}return{get:s,remove:r,update:o}}var Wv=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,qv=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Xv=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Yv=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Zv=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Kv=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,$v=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Jv=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,jv=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,Qv=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,tx=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,ex=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,nx=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,ix=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,sx=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,rx=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,ox=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,ax=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,lx=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,cx=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,hx=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,ux=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,dx=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,fx=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,px=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,mx=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,gx=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,vx=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,xx=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,_x=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,yx="gl_FragColor = linearToOutputTexel( gl_FragColor );",Mx=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Sx=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,bx=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,wx=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Ex=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Tx=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Ax=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Cx=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Rx=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Px=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Lx=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Ix=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Nx=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Dx=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Ux=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,Fx=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureCubeUV( envMap, envMapRotation * retroVec, roughness );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_CUBE_UV
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,Ox=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,zx=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Bx=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,kx=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Gx=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Vx=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Hx=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Wx=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,qx=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Xx=`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,Yx=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Zx=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Kx=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,$x=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Jx=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,jx=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Qx=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,t_=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,e_=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,n_=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,i_=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,s_=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,r_=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,o_=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,a_=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,l_=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,c_=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,h_=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,u_=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,d_=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,f_=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,p_=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,m_=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,g_=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,v_=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,x_=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,__=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,y_=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,M_=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,S_=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,b_=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,w_=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,E_=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,T_=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,A_=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,C_=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,R_=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,P_=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,L_=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,I_=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,N_=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,D_=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,U_=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,F_=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,O_=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,z_=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,B_=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,k_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,G_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,V_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,H_=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const W_=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,q_=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,X_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Y_=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Z_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,K_=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,$_=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,J_=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,j_=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Q_=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,ty=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,ey=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,ny=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,iy=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,sy=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,ry=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,oy=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,ay=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,ly=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,cy=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,hy=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,uy=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,dy=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,fy=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,py=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,my=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,gy=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,vy=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,xy=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,_y=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,yy=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,My=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Sy=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,by=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,ae={alphahash_fragment:Wv,alphahash_pars_fragment:qv,alphamap_fragment:Xv,alphamap_pars_fragment:Yv,alphatest_fragment:Zv,alphatest_pars_fragment:Kv,aomap_fragment:$v,aomap_pars_fragment:Jv,batching_pars_vertex:jv,batching_vertex:Qv,begin_vertex:tx,beginnormal_vertex:ex,bsdfs:nx,iridescence_fragment:ix,bumpmap_pars_fragment:sx,clipping_planes_fragment:rx,clipping_planes_pars_fragment:ox,clipping_planes_pars_vertex:ax,clipping_planes_vertex:lx,color_fragment:cx,color_pars_fragment:hx,color_pars_vertex:ux,color_vertex:dx,common:fx,cube_uv_reflection_fragment:px,defaultnormal_vertex:mx,displacementmap_pars_vertex:gx,displacementmap_vertex:vx,emissivemap_fragment:xx,emissivemap_pars_fragment:_x,colorspace_fragment:yx,colorspace_pars_fragment:Mx,envmap_fragment:Sx,envmap_common_pars_fragment:bx,envmap_pars_fragment:wx,envmap_pars_vertex:Ex,envmap_physical_pars_fragment:Fx,envmap_vertex:Tx,fog_vertex:Ax,fog_pars_vertex:Cx,fog_fragment:Rx,fog_pars_fragment:Px,gradientmap_pars_fragment:Lx,lightmap_pars_fragment:Ix,lights_lambert_fragment:Nx,lights_lambert_pars_fragment:Dx,lights_pars_begin:Ux,lights_toon_fragment:Ox,lights_toon_pars_fragment:zx,lights_phong_fragment:Bx,lights_phong_pars_fragment:kx,lights_physical_fragment:Gx,lights_physical_pars_fragment:Vx,lights_fragment_begin:Hx,lights_fragment_maps:Wx,lights_fragment_end:qx,lightprobes_pars_fragment:Xx,logdepthbuf_fragment:Yx,logdepthbuf_pars_fragment:Zx,logdepthbuf_pars_vertex:Kx,logdepthbuf_vertex:$x,map_fragment:Jx,map_pars_fragment:jx,map_particle_fragment:Qx,map_particle_pars_fragment:t_,metalnessmap_fragment:e_,metalnessmap_pars_fragment:n_,morphinstance_vertex:i_,morphcolor_vertex:s_,morphnormal_vertex:r_,morphtarget_pars_vertex:o_,morphtarget_vertex:a_,normal_fragment_begin:l_,normal_fragment_maps:c_,normal_pars_fragment:h_,normal_pars_vertex:u_,normal_vertex:d_,normalmap_pars_fragment:f_,clearcoat_normal_fragment_begin:p_,clearcoat_normal_fragment_maps:m_,clearcoat_pars_fragment:g_,iridescence_pars_fragment:v_,opaque_fragment:x_,packing:__,premultiplied_alpha_fragment:y_,project_vertex:M_,dithering_fragment:S_,dithering_pars_fragment:b_,roughnessmap_fragment:w_,roughnessmap_pars_fragment:E_,shadowmap_pars_fragment:T_,shadowmap_pars_vertex:A_,shadowmap_vertex:C_,shadowmask_pars_fragment:R_,skinbase_vertex:P_,skinning_pars_vertex:L_,skinning_vertex:I_,skinnormal_vertex:N_,specularmap_fragment:D_,specularmap_pars_fragment:U_,tonemapping_fragment:F_,tonemapping_pars_fragment:O_,transmission_fragment:z_,transmission_pars_fragment:B_,uv_pars_fragment:k_,uv_pars_vertex:G_,uv_vertex:V_,worldpos_vertex:H_,background_vert:W_,background_frag:q_,backgroundCube_vert:X_,backgroundCube_frag:Y_,cube_vert:Z_,cube_frag:K_,depth_vert:$_,depth_frag:J_,distance_vert:j_,distance_frag:Q_,equirect_vert:ty,equirect_frag:ey,linedashed_vert:ny,linedashed_frag:iy,meshbasic_vert:sy,meshbasic_frag:ry,meshlambert_vert:oy,meshlambert_frag:ay,meshmatcap_vert:ly,meshmatcap_frag:cy,meshnormal_vert:hy,meshnormal_frag:uy,meshphong_vert:dy,meshphong_frag:fy,meshphysical_vert:py,meshphysical_frag:my,meshtoon_vert:gy,meshtoon_frag:vy,points_vert:xy,points_frag:_y,shadow_vert:yy,shadow_frag:My,sprite_vert:Sy,sprite_frag:by},Dt={common:{diffuse:{value:new te(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new se},alphaMap:{value:null},alphaMapTransform:{value:new se},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new se}},envmap:{envMap:{value:null},envMapRotation:{value:new se},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new se}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new se}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new se},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new se},normalScale:{value:new Et(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new se},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new se}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new se}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new se}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new te(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new B},probesMax:{value:new B},probesResolution:{value:new B}},points:{diffuse:{value:new te(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new se},alphaTest:{value:0},uvTransform:{value:new se}},sprite:{diffuse:{value:new te(16777215)},opacity:{value:1},center:{value:new Et(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new se},alphaMap:{value:null},alphaMapTransform:{value:new se},alphaTest:{value:0}}},ci={basic:{uniforms:vn([Dt.common,Dt.specularmap,Dt.envmap,Dt.aomap,Dt.lightmap,Dt.fog]),vertexShader:ae.meshbasic_vert,fragmentShader:ae.meshbasic_frag},lambert:{uniforms:vn([Dt.common,Dt.specularmap,Dt.envmap,Dt.aomap,Dt.lightmap,Dt.emissivemap,Dt.bumpmap,Dt.normalmap,Dt.displacementmap,Dt.fog,Dt.lights,{emissive:{value:new te(0)},envMapIntensity:{value:1}}]),vertexShader:ae.meshlambert_vert,fragmentShader:ae.meshlambert_frag},phong:{uniforms:vn([Dt.common,Dt.specularmap,Dt.envmap,Dt.aomap,Dt.lightmap,Dt.emissivemap,Dt.bumpmap,Dt.normalmap,Dt.displacementmap,Dt.fog,Dt.lights,{emissive:{value:new te(0)},specular:{value:new te(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:ae.meshphong_vert,fragmentShader:ae.meshphong_frag},standard:{uniforms:vn([Dt.common,Dt.envmap,Dt.aomap,Dt.lightmap,Dt.emissivemap,Dt.bumpmap,Dt.normalmap,Dt.displacementmap,Dt.roughnessmap,Dt.metalnessmap,Dt.fog,Dt.lights,{emissive:{value:new te(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:ae.meshphysical_vert,fragmentShader:ae.meshphysical_frag},toon:{uniforms:vn([Dt.common,Dt.aomap,Dt.lightmap,Dt.emissivemap,Dt.bumpmap,Dt.normalmap,Dt.displacementmap,Dt.gradientmap,Dt.fog,Dt.lights,{emissive:{value:new te(0)}}]),vertexShader:ae.meshtoon_vert,fragmentShader:ae.meshtoon_frag},matcap:{uniforms:vn([Dt.common,Dt.bumpmap,Dt.normalmap,Dt.displacementmap,Dt.fog,{matcap:{value:null}}]),vertexShader:ae.meshmatcap_vert,fragmentShader:ae.meshmatcap_frag},points:{uniforms:vn([Dt.points,Dt.fog]),vertexShader:ae.points_vert,fragmentShader:ae.points_frag},dashed:{uniforms:vn([Dt.common,Dt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:ae.linedashed_vert,fragmentShader:ae.linedashed_frag},depth:{uniforms:vn([Dt.common,Dt.displacementmap]),vertexShader:ae.depth_vert,fragmentShader:ae.depth_frag},normal:{uniforms:vn([Dt.common,Dt.bumpmap,Dt.normalmap,Dt.displacementmap,{opacity:{value:1}}]),vertexShader:ae.meshnormal_vert,fragmentShader:ae.meshnormal_frag},sprite:{uniforms:vn([Dt.sprite,Dt.fog]),vertexShader:ae.sprite_vert,fragmentShader:ae.sprite_frag},background:{uniforms:{uvTransform:{value:new se},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:ae.background_vert,fragmentShader:ae.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new se}},vertexShader:ae.backgroundCube_vert,fragmentShader:ae.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:ae.cube_vert,fragmentShader:ae.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:ae.equirect_vert,fragmentShader:ae.equirect_frag},distance:{uniforms:vn([Dt.common,Dt.displacementmap,{referencePosition:{value:new B},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:ae.distance_vert,fragmentShader:ae.distance_frag},shadow:{uniforms:vn([Dt.lights,Dt.fog,{color:{value:new te(0)},opacity:{value:1}}]),vertexShader:ae.shadow_vert,fragmentShader:ae.shadow_frag}};ci.physical={uniforms:vn([ci.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new se},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new se},clearcoatNormalScale:{value:new Et(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new se},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new se},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new se},sheen:{value:0},sheenColor:{value:new te(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new se},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new se},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new se},transmissionSamplerSize:{value:new Et},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new se},attenuationDistance:{value:0},attenuationColor:{value:new te(0)},specularColor:{value:new te(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new se},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new se},anisotropyVector:{value:new Et},anisotropyMap:{value:null},anisotropyMapTransform:{value:new se}}]),vertexShader:ae.meshphysical_vert,fragmentShader:ae.meshphysical_frag};const Vo={r:0,b:0,g:0},wy=new Ee,cf=new se;cf.set(-1,0,0,0,1,0,0,0,1);function Ey(i,t,e,n,s,r){const o=new te(0);let a=s===!0?0:1,l,c,h=null,d=0,u=null;function f(x){let w=x.isScene===!0?x.background:null;if(w&&w.isTexture){const y=x.backgroundBlurriness>0;w=t.get(w,y)}return w}function g(x){let w=!1;const y=f(x);y===null?m(o,a):y&&y.isColor&&(m(y,1),w=!0);const M=i.xr.getEnvironmentBlendMode();M==="additive"?e.buffers.color.setClear(0,0,0,1,r):M==="alpha-blend"&&e.buffers.color.setClear(0,0,0,0,r),(i.autoClear||w)&&(e.buffers.depth.setTest(!0),e.buffers.depth.setMask(!0),e.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function v(x,w){const y=f(w);y&&(y.isCubeTexture||y.mapping===wa)?(c===void 0&&(c=new ve(new Vi(1,1,1),new Gn({name:"BackgroundCubeMaterial",uniforms:dr(ci.backgroundCube.uniforms),vertexShader:ci.backgroundCube.vertexShader,fragmentShader:ci.backgroundCube.fragmentShader,side:En,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(M,S,C){this.matrixWorld.copyPosition(C.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(c)),c.material.uniforms.envMap.value=y,c.material.uniforms.backgroundBlurriness.value=w.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=w.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(wy.makeRotationFromEuler(w.backgroundRotation)).transpose(),y.isCubeTexture&&y.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(cf),c.material.toneMapped=me.getTransfer(y.colorSpace)!==be,(h!==y||d!==y.version||u!==i.toneMapping)&&(c.material.needsUpdate=!0,h=y,d=y.version,u=i.toneMapping),c.layers.enableAll(),x.unshift(c,c.geometry,c.material,0,0,null)):y&&y.isTexture&&(l===void 0&&(l=new ve(new Ns(2,2),new Gn({name:"BackgroundMaterial",uniforms:dr(ci.background.uniforms),vertexShader:ci.background.vertexShader,fragmentShader:ci.background.fragmentShader,side:ws,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(l)),l.material.uniforms.t2D.value=y,l.material.uniforms.backgroundIntensity.value=w.backgroundIntensity,l.material.toneMapped=me.getTransfer(y.colorSpace)!==be,y.matrixAutoUpdate===!0&&y.updateMatrix(),l.material.uniforms.uvTransform.value.copy(y.matrix),(h!==y||d!==y.version||u!==i.toneMapping)&&(l.material.needsUpdate=!0,h=y,d=y.version,u=i.toneMapping),l.layers.enableAll(),x.unshift(l,l.geometry,l.material,0,0,null))}function m(x,w){x.getRGB(Vo,sf(i)),e.buffers.color.setClear(Vo.r,Vo.g,Vo.b,w,r)}function p(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return o},setClearColor:function(x,w=1){o.set(x),a=w,m(o,a)},getClearAlpha:function(){return a},setClearAlpha:function(x){a=x,m(o,a)},render:g,addToRenderList:v,dispose:p}}function Ty(i,t){const e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=u(null);let r=s,o=!1;function a(I,U,N,A,D){let F=!1;const G=d(I,A,N,U);r!==G&&(r=G,c(r.object)),F=f(I,A,N,D),F&&g(I,A,N,D),D!==null&&t.update(D,i.ELEMENT_ARRAY_BUFFER),(F||o)&&(o=!1,y(I,U,N,A),D!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(D).buffer))}function l(){return i.createVertexArray()}function c(I){return i.bindVertexArray(I)}function h(I){return i.deleteVertexArray(I)}function d(I,U,N,A){const D=A.wireframe===!0;let F=n[U.id];F===void 0&&(F={},n[U.id]=F);const G=I.isInstancedMesh===!0?I.id:0;let Y=F[G];Y===void 0&&(Y={},F[G]=Y);let V=Y[N.id];V===void 0&&(V={},Y[N.id]=V);let q=V[D];return q===void 0&&(q=u(l()),V[D]=q),q}function u(I){const U=[],N=[],A=[];for(let D=0;D<e;D++)U[D]=0,N[D]=0,A[D]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:U,enabledAttributes:N,attributeDivisors:A,object:I,attributes:{},index:null}}function f(I,U,N,A){const D=r.attributes,F=U.attributes;let G=0;const Y=N.getAttributes();for(const V in Y)if(Y[V].location>=0){const $=D[V];let it=F[V];if(it===void 0&&(V==="instanceMatrix"&&I.instanceMatrix&&(it=I.instanceMatrix),V==="instanceColor"&&I.instanceColor&&(it=I.instanceColor)),$===void 0||$.attribute!==it||it&&$.data!==it.data)return!0;G++}return r.attributesNum!==G||r.index!==A}function g(I,U,N,A){const D={},F=U.attributes;let G=0;const Y=N.getAttributes();for(const V in Y)if(Y[V].location>=0){let $=F[V];$===void 0&&(V==="instanceMatrix"&&I.instanceMatrix&&($=I.instanceMatrix),V==="instanceColor"&&I.instanceColor&&($=I.instanceColor));const it={};it.attribute=$,$&&$.data&&(it.data=$.data),D[V]=it,G++}r.attributes=D,r.attributesNum=G,r.index=A}function v(){const I=r.newAttributes;for(let U=0,N=I.length;U<N;U++)I[U]=0}function m(I){p(I,0)}function p(I,U){const N=r.newAttributes,A=r.enabledAttributes,D=r.attributeDivisors;N[I]=1,A[I]===0&&(i.enableVertexAttribArray(I),A[I]=1),D[I]!==U&&(i.vertexAttribDivisor(I,U),D[I]=U)}function x(){const I=r.newAttributes,U=r.enabledAttributes;for(let N=0,A=U.length;N<A;N++)U[N]!==I[N]&&(i.disableVertexAttribArray(N),U[N]=0)}function w(I,U,N,A,D,F,G){G===!0?i.vertexAttribIPointer(I,U,N,D,F):i.vertexAttribPointer(I,U,N,A,D,F)}function y(I,U,N,A){v();const D=A.attributes,F=N.getAttributes(),G=U.defaultAttributeValues;for(const Y in F){const V=F[Y];if(V.location>=0){let q=D[Y];if(q===void 0&&(Y==="instanceMatrix"&&I.instanceMatrix&&(q=I.instanceMatrix),Y==="instanceColor"&&I.instanceColor&&(q=I.instanceColor)),q!==void 0){const $=q.normalized,it=q.itemSize,yt=t.get(q);if(yt===void 0)continue;const Ft=yt.buffer,Zt=yt.type,lt=yt.bytesPerElement,W=Zt===i.INT||Zt===i.UNSIGNED_INT||q.gpuType===Lc;if(q.isInterleavedBufferAttribute){const rt=q.data,dt=rt.stride,Mt=q.offset;if(rt.isInstancedInterleavedBuffer){for(let _t=0;_t<V.locationSize;_t++)p(V.location+_t,rt.meshPerAttribute);I.isInstancedMesh!==!0&&A._maxInstanceCount===void 0&&(A._maxInstanceCount=rt.meshPerAttribute*rt.count)}else for(let _t=0;_t<V.locationSize;_t++)m(V.location+_t);i.bindBuffer(i.ARRAY_BUFFER,Ft);for(let _t=0;_t<V.locationSize;_t++)w(V.location+_t,it/V.locationSize,Zt,$,dt*lt,(Mt+it/V.locationSize*_t)*lt,W)}else{if(q.isInstancedBufferAttribute){for(let rt=0;rt<V.locationSize;rt++)p(V.location+rt,q.meshPerAttribute);I.isInstancedMesh!==!0&&A._maxInstanceCount===void 0&&(A._maxInstanceCount=q.meshPerAttribute*q.count)}else for(let rt=0;rt<V.locationSize;rt++)m(V.location+rt);i.bindBuffer(i.ARRAY_BUFFER,Ft);for(let rt=0;rt<V.locationSize;rt++)w(V.location+rt,it/V.locationSize,Zt,$,it*lt,it/V.locationSize*rt*lt,W)}}else if(G!==void 0){const $=G[Y];if($!==void 0)switch($.length){case 2:i.vertexAttrib2fv(V.location,$);break;case 3:i.vertexAttrib3fv(V.location,$);break;case 4:i.vertexAttrib4fv(V.location,$);break;default:i.vertexAttrib1fv(V.location,$)}}}}x()}function M(){T();for(const I in n){const U=n[I];for(const N in U){const A=U[N];for(const D in A){const F=A[D];for(const G in F)h(F[G].object),delete F[G];delete A[D]}}delete n[I]}}function S(I){if(n[I.id]===void 0)return;const U=n[I.id];for(const N in U){const A=U[N];for(const D in A){const F=A[D];for(const G in F)h(F[G].object),delete F[G];delete A[D]}}delete n[I.id]}function C(I){for(const U in n){const N=n[U];for(const A in N){const D=N[A];if(D[I.id]===void 0)continue;const F=D[I.id];for(const G in F)h(F[G].object),delete F[G];delete D[I.id]}}}function _(I){for(const U in n){const N=n[U],A=I.isInstancedMesh===!0?I.id:0,D=N[A];if(D!==void 0){for(const F in D){const G=D[F];for(const Y in G)h(G[Y].object),delete G[Y];delete D[F]}delete N[A],Object.keys(N).length===0&&delete n[U]}}}function T(){L(),o=!0,r!==s&&(r=s,c(r.object))}function L(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:T,resetDefaultState:L,dispose:M,releaseStatesOfGeometry:S,releaseStatesOfObject:_,releaseStatesOfProgram:C,initAttributes:v,enableAttribute:m,disableUnusedAttributes:x}}function Ay(i,t,e){let n;function s(l){n=l}function r(l,c){i.drawArrays(n,l,c),e.update(c,n,1)}function o(l,c,h){h!==0&&(i.drawArraysInstanced(n,l,c,h),e.update(c,n,h))}function a(l,c,h){if(h===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,c,0,h);let u=0;for(let f=0;f<h;f++)u+=c[f];e.update(u,n,1)}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a}function Cy(i,t,e,n){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){const C=t.get("EXT_texture_filter_anisotropic");s=i.getParameter(C.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(C){return!(C!==Kn&&n.convert(C)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(C){const _=C===gi&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(C!==Nn&&C!==Zn&&!_&&n.convert(C)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE))}function l(C){if(C==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";C="mediump"}return C==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp";const h=l(c);h!==c&&(ne("WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const d=e.logarithmicDepthBuffer===!0,u=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control");e.reversedDepthBuffer===!0&&u===!1&&ne("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");const f=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),p=i.getParameter(i.MAX_VERTEX_ATTRIBS),x=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),w=i.getParameter(i.MAX_VARYING_VECTORS),y=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),M=i.getParameter(i.MAX_SAMPLES),S=i.getParameter(i.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:d,reversedDepthBuffer:u,maxTextures:f,maxVertexTextures:g,maxTextureSize:v,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:x,maxVaryings:w,maxFragmentUniforms:y,maxSamples:M,samples:S}}function Ry(i){const t=this;let e=null,n=0,s=!1,r=!1;const o=new li,a=new se,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(d,u){const f=d.length!==0||u||n!==0||s;return s=u,n=d.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(d,u){e=h(d,u,0)},this.setState=function(d,u,f){const g=d.clippingPlanes,v=d.clipIntersection,m=d.clipShadows,p=i.get(d);if(!s||g===null||g.length===0||r&&!m)r?h(null):c();else{const x=r?0:n,w=x*4;let y=p.clippingState||null;l.value=y,y=h(g,u,w,f);for(let M=0;M!==w;++M)y[M]=e[M];p.clippingState=y,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=x}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(d,u,f,g){const v=d!==null?d.length:0;let m=null;if(v!==0){if(m=l.value,g!==!0||m===null){const p=f+v*4,x=u.matrixWorldInverse;a.getNormalMatrix(x),(m===null||m.length<p)&&(m=new Float32Array(p));for(let w=0,y=f;w!==v;++w,y+=4)o.copy(d[w]).applyMatrix4(x,a),o.normal.toArray(m,y),m[y+3]=o.constant}l.value=m,l.needsUpdate=!0}return t.numPlanes=v,t.numIntersection=0,m}}const rr=4,Py=6,Ly=20,Iy=256,Pr=new af,yu=new te;let xl=null,_l=0,yl=0,Ml=!1;const Ny=new B,fs=new B;class Mu{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(t,e=0,n=.1,s=100,r={}){const{size:o=256,position:a=Ny}=r;xl=this._renderer.getRenderTarget(),_l=this._renderer.getActiveCubeFace(),yl=this._renderer.getActiveMipmapLevel(),Ml=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(t,n,s,l,a),e>0&&this._blur(l,0,0,e),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=wu(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=bu(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodMeshes.length;t++)this._lodMeshes[t].geometry.dispose()}_cleanup(t){this._renderer.setRenderTarget(xl,_l,yl),this._renderer.xr.enabled=Ml,t.scissorTest=!1,Qs(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Es||t.mapping===cr?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),xl=this._renderer.getRenderTarget(),_l=this._renderer.getActiveCubeFace(),yl=this._renderer.getActiveMipmapLevel(),Ml=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:dn,minFilter:dn,generateMipmaps:!1,type:gi,format:Kn,colorSpace:ua,depthBuffer:!1},s=Su(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Su(t,e,n);const{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=Dy(r)),this._blurMaterial=Fy(r,t,e),this._ggxMaterial=Uy(r,t,e)}return s}_compileMaterial(t){const e=new ve(new Ne,t);this._renderer.compile(e,Pr)}_sceneToCubeUV(t,e,n,s,r){const l=new wn(90,1,e,n),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],d=this._renderer,u=d.autoClear,f=d.toneMapping;d.getClearColor(yu),d.toneMapping=pi,d.autoClear=!1,d.state.buffers.depth.getReversed()&&(d.setRenderTarget(s),d.clearDepth(),d.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new ve(new Vi,new rn({name:"PMREM.Background",side:En,depthWrite:!1,depthTest:!1})));const v=this._backgroundBox,m=v.material;let p=!1;const x=t.background;x?x.isColor&&(m.color.copy(x),t.background=null,p=!0):(m.color.copy(yu),p=!0);for(let w=0;w<6;w++){const y=w%3;y===0?(l.up.set(0,c[w],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+h[w],r.y,r.z)):y===1?(l.up.set(0,0,c[w]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+h[w],r.z)):(l.up.set(0,c[w],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+h[w]));const M=this._cubeSize;Qs(s,y*M,w>2?M:0,M,M),d.setRenderTarget(s),p&&d.render(v,l),d.render(t,l)}d.toneMapping=f,d.autoClear=u,t.background=x}_textureToCubeUV(t,e){const n=this._renderer,s=t.mapping===Es||t.mapping===cr;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=wu()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=bu());const r=s?this._cubemapMaterial:this._equirectMaterial,o=this._lodMeshes[0];o.material=r;const a=r.uniforms;a.envMap.value=t;const l=this._cubeSize;Qs(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(o,Pr)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const s=this._lodMeshes.length;for(let r=1;r<s;r++)this._applyGGXFilter(t,r-1,r);e.autoClear=n}_applyGGXFilter(t,e,n){const s=this._renderer,r=this._pingPongRenderTarget,o=this._ggxMaterial,a=this._lodMeshes[n];a.material=o;const l=o.uniforms,c=n/(this._lodMeshes.length-1),h=e/(this._lodMeshes.length-1),d=Math.sqrt(c*c-h*h),u=c*1.25,f=d*u,{_lodMax:g}=this,v=this._sizeLods[n],m=3*v*(n>g-rr?n-g+rr:0),p=4*(this._cubeSize-v);l.envMap.value=t.texture,l.roughness.value=f,l.mipInt.value=g-e,Qs(r,m,p,3*v,2*v),s.setRenderTarget(r),s.render(a,Pr),l.envMap.value=r.texture,l.roughness.value=0,l.mipInt.value=g-n,Qs(t,m,p,3*v,2*v),s.setRenderTarget(t),s.render(a,Pr)}_blur(t,e,n,s){const r=this._pingPongRenderTarget,o=Math.min(s,Math.PI)/Math.SQRT2;this._blurPass(t,r,e,n,o),this._blurPass(r,t,n,n,o)}_blurPass(t,e,n,s,r){const o=this._renderer,a=this._blurMaterial,l=this._lodMeshes[s];l.material=a;const c=a.uniforms;c.envMap.value=t.texture,c.sigma.value=r,c.mipInt.value=this._lodMax-n;const h=this._sizeLods[s],d=3*h*(s>this._lodMax-rr?s-this._lodMax+rr:0),u=4*(this._cubeSize-h);Qs(e,d,u,3*h,2*h),o.setRenderTarget(e),o.render(l,Pr)}}function Dy(i){const t=[],e=[];let n=i;const s=i-rr+1+Py;for(let r=0;r<s;r++){const o=Math.pow(2,n);t.push(o);const a=1/(o-2),l=-a,c=1+a,h=[l,l,c,l,c,c,l,l,c,c,l,c],d=6,u=6,f=3,g=new Float32Array(f*u*d),v=new Float32Array(f*u*d);for(let p=0;p<d;p++){const x=p%3*2/3-1,w=p>2?0:-1,y=[x,w,0,x+2/3,w,0,x+2/3,w+1,0,x,w,0,x+2/3,w+1,0,x,w+1,0];g.set(y,f*u*p);for(let M=0;M<u;M++){const S=h[M*2]*2-1,C=h[M*2+1]*2-1;p===0?fs.set(1,C,S):p===1?fs.set(-S,1,-C):p===2?fs.set(-S,C,1):p===3?fs.set(-1,C,-S):p===4?fs.set(-S,-1,C):fs.set(S,C,-1),fs.toArray(v,(p*u+M)*f)}}const m=new Ne;m.setAttribute("position",new Bn(g,f)),m.setAttribute("outputDirection",new Bn(v,f)),e.push(new ve(m,null)),n>rr&&n--}return{lodMeshes:e,sizeLods:t}}function Su(i,t,e){const n=new $n(i,t,e);return n.texture.mapping=wa,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Qs(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function Uy(i,t,e){return new Gn({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:Iy,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:La(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:Oi,depthTest:!1,depthWrite:!1})}function Fy(i,t,e){return new Gn({name:"SphericalGaussianBlur",defines:{SAMPLES:Ly,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:La(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float sigma;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359
			#define GOLDEN_ANGLE 2.39996322973

			void main() {

				if ( sigma == 0.0 ) {

					gl_FragColor = vec4( bilinearCubeUV( envMap, vOutputDirection, mipInt ), 1.0 );
					return;

				}

				vec3 outputDirection = normalize( vOutputDirection );

				vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
				vec3 tangent = normalize( cross( up, outputDirection ) );
				vec3 bitangent = cross( outputDirection, tangent );

				// Truncate the kernel at three standard deviations or at the antipode.
				float thetaMax = min( 3.0 * sigma, PI );
				float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

				vec3 accumColor = vec3( 0.0 );
				float accumWeight = 0.0;

				for ( int i = 0; i < SAMPLES; i ++ ) {

					// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
					float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
					float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
					float phi = float( i ) * GOLDEN_ANGLE;

					vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
					vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

					// Correct the planar sample density to solid angle.
					float weight = sin( theta ) / theta;

					accumColor += weight * bilinearCubeUV( envMap, sampleDirection, mipInt );
					accumWeight += weight;

				}

				gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

			}
		`,blending:Oi,depthTest:!1,depthWrite:!1})}function bu(){return new Gn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:La(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Oi,depthTest:!1,depthWrite:!1})}function wu(){return new Gn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:La(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Oi,depthTest:!1,depthWrite:!1})}function La(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}class hf extends $n{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];this.texture=new Yd(s),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new Vi(5,5,5),r=new Gn({name:"CubemapFromEquirect",uniforms:dr(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:En,blending:Oi});r.uniforms.tEquirect.value=e;const o=new ve(s,r),a=e.minFilter;return e.minFilter===xs&&(e.minFilter=dn),new zv(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e=!0,n=!0,s=!0){const r=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,n,s);t.setRenderTarget(r)}}function Oy(i){let t=new WeakMap,e=new WeakMap,n=null;function s(u,f=!1){return u==null?null:f?o(u):r(u)}function r(u){if(u&&u.isTexture){const f=u.mapping;if(f===Ha||f===Wa)if(t.has(u)){const g=t.get(u).texture;return a(g,u.mapping)}else{const g=u.image;if(g&&g.height>0){const v=new hf(g.height);return v.fromEquirectangularTexture(i,u),t.set(u,v),u.addEventListener("dispose",c),a(v.texture,u.mapping)}else return null}}return u}function o(u){if(u&&u.isTexture){const f=u.mapping,g=f===Ha||f===Wa,v=f===Es||f===cr;if(g||v){let m=e.get(u);const p=m!==void 0?m.texture.pmremVersion:0;if(u.isRenderTargetTexture&&u.pmremVersion!==p)return n===null&&(n=new Mu(i)),m=g?n.fromEquirectangular(u,m):n.fromCubemap(u,m),m.texture.pmremVersion=u.pmremVersion,e.set(u,m),m.texture;if(m!==void 0)return m.texture;{const x=u.image;return g&&x&&x.height>0||v&&x&&l(x)?(n===null&&(n=new Mu(i)),m=g?n.fromEquirectangular(u):n.fromCubemap(u),m.texture.pmremVersion=u.pmremVersion,e.set(u,m),u.addEventListener("dispose",h),m.texture):null}}}return u}function a(u,f){return f===Ha?u.mapping=Es:f===Wa&&(u.mapping=cr),u}function l(u){let f=0;const g=6;for(let v=0;v<g;v++)u[v]!==void 0&&f++;return f===g}function c(u){const f=u.target;f.removeEventListener("dispose",c);const g=t.get(f);g!==void 0&&(t.delete(f),g.dispose())}function h(u){const f=u.target;f.removeEventListener("dispose",h);const g=e.get(f);g!==void 0&&(e.delete(f),g.dispose())}function d(){t=new WeakMap,e=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:s,dispose:d}}function zy(i){const t={};function e(n){if(t[n]!==void 0)return t[n];const s=i.getExtension(n);return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const s=e(n);return s===null&&ar("WebGLRenderer: "+n+" extension not supported."),s}}}function By(i,t,e,n){const s={},r=new WeakMap;function o(d){const u=d.target;u.index!==null&&t.remove(u.index);for(const g in u.attributes)t.remove(u.attributes[g]);u.removeEventListener("dispose",o),delete s[u.id];const f=r.get(u);f&&(t.remove(f),r.delete(u)),n.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,e.memory.geometries--}function a(d,u){return s[u.id]===!0||(u.addEventListener("dispose",o),s[u.id]=!0,e.memory.geometries++),u}function l(d){const u=d.attributes;for(const f in u)t.update(u[f],i.ARRAY_BUFFER)}function c(d){const u=[],f=d.index,g=d.attributes.position;let v=0;if(g===void 0)return;if(f!==null){const x=f.array;v=f.version;for(let w=0,y=x.length;w<y;w+=3){const M=x[w+0],S=x[w+1],C=x[w+2];u.push(M,S,S,C,C,M)}}else{const x=g.array;v=g.version;for(let w=0,y=x.length/3-1;w<y;w+=3){const M=w+0,S=w+1,C=w+2;u.push(M,S,S,C,C,M)}}const m=new(g.count>=65535?Xd:qd)(u,1);m.version=v;const p=r.get(d);p&&t.remove(p),r.set(d,m)}function h(d){const u=r.get(d);if(u){const f=d.index;f!==null&&u.version<f.version&&c(d)}else c(d);return r.get(d)}return{get:a,update:l,getWireframeAttribute:h}}function ky(i,t,e){let n;function s(d){n=d}let r,o;function a(d){r=d.type,o=d.bytesPerElement}function l(d,u){i.drawElements(n,u,r,d*o),e.update(u,n,1)}function c(d,u,f){f!==0&&(i.drawElementsInstanced(n,u,r,d*o,f),e.update(u,n,f))}function h(d,u,f){if(f===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,u,0,r,d,0,f);let v=0;for(let m=0;m<f;m++)v+=u[m];e.update(v,n,1)}this.setMode=s,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=h}function Gy(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(e.calls++,o){case i.TRIANGLES:e.triangles+=a*(r/3);break;case i.LINES:e.lines+=a*(r/2);break;case i.LINE_STRIP:e.lines+=a*(r-1);break;case i.LINE_LOOP:e.lines+=a*r;break;case i.POINTS:e.points+=a*r;break;default:ge("WebGLInfo: Unknown draw mode:",o);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function Vy(i,t,e){const n=new WeakMap,s=new Ue;function r(o,a,l){const c=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,d=h!==void 0?h.length:0;let u=n.get(a);if(u===void 0||u.count!==d){let L=function(){_.dispose(),n.delete(a),a.removeEventListener("dispose",L)};var f=L;u!==void 0&&u.texture.dispose();const g=a.morphAttributes.position!==void 0,v=a.morphAttributes.normal!==void 0,m=a.morphAttributes.color!==void 0,p=a.morphAttributes.position||[],x=a.morphAttributes.normal||[],w=a.morphAttributes.color||[];let y=0;g===!0&&(y=1),v===!0&&(y=2),m===!0&&(y=3);let M=a.attributes.position.count*y,S=1;M>t.maxTextureSize&&(S=Math.ceil(M/t.maxTextureSize),M=t.maxTextureSize);const C=new Float32Array(M*S*4*d),_=new Hd(C,M,S,d);_.type=Zn,_.needsUpdate=!0;const T=y*4;for(let I=0;I<d;I++){const U=p[I],N=x[I],A=w[I],D=M*S*4*I;for(let F=0;F<U.count;F++){const G=F*T;g===!0&&(s.fromBufferAttribute(U,F),C[D+G+0]=s.x,C[D+G+1]=s.y,C[D+G+2]=s.z,C[D+G+3]=0),v===!0&&(s.fromBufferAttribute(N,F),C[D+G+4]=s.x,C[D+G+5]=s.y,C[D+G+6]=s.z,C[D+G+7]=0),m===!0&&(s.fromBufferAttribute(A,F),C[D+G+8]=s.x,C[D+G+9]=s.y,C[D+G+10]=s.z,C[D+G+11]=A.itemSize===4?s.w:1)}}u={count:d,texture:_,size:new Et(M,S)},n.set(a,u),a.addEventListener("dispose",L)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",o.morphTexture,e);else{let g=0;for(let m=0;m<c.length;m++)g+=c[m];const v=a.morphTargetsRelative?1:1-g;l.getUniforms().setValue(i,"morphTargetBaseInfluence",v),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",u.texture,e),l.getUniforms().setValue(i,"morphTargetsTextureSize",u.size)}return{update:r}}function Hy(i,t,e,n,s){let r=new WeakMap;function o(c){const h=s.render.frame,d=c.geometry,u=t.get(c,d);if(r.get(u)!==h&&(t.update(u),r.set(u,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),r.get(c)!==h&&(e.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,i.ARRAY_BUFFER),r.set(c,h))),c.isSkinnedMesh){const f=c.skeleton;r.get(f)!==h&&(f.update(),r.set(f,h))}return u}function a(){r=new WeakMap}function l(c){const h=c.target;h.removeEventListener("dispose",l),n.releaseStatesOfObject(h),e.remove(h.instanceMatrix),h.instanceColor!==null&&e.remove(h.instanceColor)}return{update:o,dispose:a}}const Wy={[Rd]:"LINEAR_TONE_MAPPING",[Pd]:"REINHARD_TONE_MAPPING",[Ld]:"CINEON_TONE_MAPPING",[Pc]:"ACES_FILMIC_TONE_MAPPING",[Nd]:"AGX_TONE_MAPPING",[Dd]:"NEUTRAL_TONE_MAPPING",[Id]:"CUSTOM_TONE_MAPPING"};function qy(i,t,e,n,s,r){const o=new $n(t,e,{type:i,depthBuffer:s,stencilBuffer:r,samples:n?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1});let a=null,l=null;const c=new Ne;c.setAttribute("position",new ue([-1,3,0,-1,-1,0,3,-1,0],3)),c.setAttribute("uv",new ue([0,2,0,0,2,0],2));const h=new Rv({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),d=new ve(c,h),u=new af(-1,1,1,-1,0,1);let f=null,g=null,v=!1,m,p=null,x=[],w=!1;this.setSize=function(y,M){o.setSize(y,M),a!==null&&a.setSize(y,M),l!==null&&l.setSize(y,M);for(let S=0;S<x.length;S++){const C=x[S];C.setSize&&C.setSize(y,M)}},this.setEffects=function(y){x=y,w=x.length>0&&x[0].isRenderPass===!0;const M=o.width,S=o.height;x.length>0&&a===null&&(a=new $n(M,S,{type:gi,depthBuffer:!1,stencilBuffer:!1}),l=new $n(M,S,{type:gi,depthBuffer:!1,stencilBuffer:!1}));for(let C=0;C<x.length;C++){const _=x[C];_.setSize&&_.setSize(M,S)}},this.begin=function(y,M){if(v||y.toneMapping===pi&&x.length===0)return!1;if(p=M,M!==null){const S=M.width,C=M.height;(o.width!==S||o.height!==C)&&this.setSize(S,C)}return w===!1&&y.setRenderTarget(o),m=y.toneMapping,y.toneMapping=pi,!0},this.hasRenderPass=function(){return w},this.end=function(y,M){y.toneMapping=m,v=!0;let S=o,C=a;for(let _=0;_<x.length;_++){const T=x[_];T.enabled!==!1&&(T.render(y,C,S,M),T.needsSwap!==!1&&(S=C,C=C===a?l:a))}if(f!==y.outputColorSpace||g!==y.toneMapping){f=y.outputColorSpace,g=y.toneMapping,h.defines={},me.getTransfer(f)===be&&(h.defines.SRGB_TRANSFER="");const _=Wy[g];_&&(h.defines[_]=""),h.needsUpdate=!0}h.uniforms.tDiffuse.value=S.texture,y.setRenderTarget(p),y.render(d,u),p=null,v=!1},this.isCompositing=function(){return v},this.dispose=function(){o.dispose(),a!==null&&a.dispose(),l!==null&&l.dispose(),c.dispose(),h.dispose()}}const uf=new fn,_c=new to(1,1),df=new Hd,ff=new Tg,pf=new Yd,Eu=[],Tu=[],Au=new Float32Array(16),Cu=new Float32Array(9),Ru=new Float32Array(4);function mr(i,t,e){const n=i[0];if(n<=0||n>0)return i;const s=t*e;let r=Eu[s];if(r===void 0&&(r=new Float32Array(s),Eu[s]=r),t!==0){n.toArray(r,0);for(let o=1,a=0;o!==t;++o)a+=e,i[o].toArray(r,a)}return r}function je(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function Qe(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function Ia(i,t){let e=Tu[t];e===void 0&&(e=new Int32Array(t),Tu[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function Xy(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function Yy(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(je(e,t))return;i.uniform2fv(this.addr,t),Qe(e,t)}}function Zy(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(je(e,t))return;i.uniform3fv(this.addr,t),Qe(e,t)}}function Ky(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(je(e,t))return;i.uniform4fv(this.addr,t),Qe(e,t)}}function $y(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(je(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),Qe(e,t)}else{if(je(e,n))return;Ru.set(n),i.uniformMatrix2fv(this.addr,!1,Ru),Qe(e,n)}}function Jy(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(je(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),Qe(e,t)}else{if(je(e,n))return;Cu.set(n),i.uniformMatrix3fv(this.addr,!1,Cu),Qe(e,n)}}function jy(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(je(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),Qe(e,t)}else{if(je(e,n))return;Au.set(n),i.uniformMatrix4fv(this.addr,!1,Au),Qe(e,n)}}function Qy(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function tM(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(je(e,t))return;i.uniform2iv(this.addr,t),Qe(e,t)}}function eM(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(je(e,t))return;i.uniform3iv(this.addr,t),Qe(e,t)}}function nM(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(je(e,t))return;i.uniform4iv(this.addr,t),Qe(e,t)}}function iM(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function sM(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(je(e,t))return;i.uniform2uiv(this.addr,t),Qe(e,t)}}function rM(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(je(e,t))return;i.uniform3uiv(this.addr,t),Qe(e,t)}}function oM(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(je(e,t))return;i.uniform4uiv(this.addr,t),Qe(e,t)}}function aM(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(_c.compareFunction=e.isReversedDepthBuffer()?zc:Oc,r=_c):r=uf,e.setTexture2D(t||r,s)}function lM(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||ff,s)}function cM(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||pf,s)}function hM(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||df,s)}function uM(i){switch(i){case 5126:return Xy;case 35664:return Yy;case 35665:return Zy;case 35666:return Ky;case 35674:return $y;case 35675:return Jy;case 35676:return jy;case 5124:case 35670:return Qy;case 35667:case 35671:return tM;case 35668:case 35672:return eM;case 35669:case 35673:return nM;case 5125:return iM;case 36294:return sM;case 36295:return rM;case 36296:return oM;case 35678:case 36198:case 36298:case 36306:case 35682:return aM;case 35679:case 36299:case 36307:return lM;case 35680:case 36300:case 36308:case 36293:return cM;case 36289:case 36303:case 36311:case 36292:return hM}}function dM(i,t){i.uniform1fv(this.addr,t)}function fM(i,t){const e=mr(t,this.size,2);i.uniform2fv(this.addr,e)}function pM(i,t){const e=mr(t,this.size,3);i.uniform3fv(this.addr,e)}function mM(i,t){const e=mr(t,this.size,4);i.uniform4fv(this.addr,e)}function gM(i,t){const e=mr(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function vM(i,t){const e=mr(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function xM(i,t){const e=mr(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function _M(i,t){i.uniform1iv(this.addr,t)}function yM(i,t){i.uniform2iv(this.addr,t)}function MM(i,t){i.uniform3iv(this.addr,t)}function SM(i,t){i.uniform4iv(this.addr,t)}function bM(i,t){i.uniform1uiv(this.addr,t)}function wM(i,t){i.uniform2uiv(this.addr,t)}function EM(i,t){i.uniform3uiv(this.addr,t)}function TM(i,t){i.uniform4uiv(this.addr,t)}function AM(i,t,e){const n=this.cache,s=t.length,r=Ia(e,s);je(n,r)||(i.uniform1iv(this.addr,r),Qe(n,r));let o;this.type===i.SAMPLER_2D_SHADOW?o=_c:o=uf;for(let a=0;a!==s;++a)e.setTexture2D(t[a]||o,r[a])}function CM(i,t,e){const n=this.cache,s=t.length,r=Ia(e,s);je(n,r)||(i.uniform1iv(this.addr,r),Qe(n,r));for(let o=0;o!==s;++o)e.setTexture3D(t[o]||ff,r[o])}function RM(i,t,e){const n=this.cache,s=t.length,r=Ia(e,s);je(n,r)||(i.uniform1iv(this.addr,r),Qe(n,r));for(let o=0;o!==s;++o)e.setTextureCube(t[o]||pf,r[o])}function PM(i,t,e){const n=this.cache,s=t.length,r=Ia(e,s);je(n,r)||(i.uniform1iv(this.addr,r),Qe(n,r));for(let o=0;o!==s;++o)e.setTexture2DArray(t[o]||df,r[o])}function LM(i){switch(i){case 5126:return dM;case 35664:return fM;case 35665:return pM;case 35666:return mM;case 35674:return gM;case 35675:return vM;case 35676:return xM;case 5124:case 35670:return _M;case 35667:case 35671:return yM;case 35668:case 35672:return MM;case 35669:case 35673:return SM;case 5125:return bM;case 36294:return wM;case 36295:return EM;case 36296:return TM;case 35678:case 36198:case 36298:case 36306:case 35682:return AM;case 35679:case 36299:case 36307:return CM;case 35680:case 36300:case 36308:case 36293:return RM;case 36289:case 36303:case 36311:case 36292:return PM}}class IM{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=uM(e.type)}}class NM{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=LM(e.type)}}class DM{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const s=this.seq;for(let r=0,o=s.length;r!==o;++r){const a=s[r];a.setValue(t,e[a.id],n)}}}const Sl=/(\w+)(\])?(\[|\.)?/g;function Pu(i,t){i.seq.push(t),i.map[t.id]=t}function UM(i,t,e){const n=i.name,s=n.length;for(Sl.lastIndex=0;;){const r=Sl.exec(n),o=Sl.lastIndex;let a=r[1];const l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===s){Pu(e,c===void 0?new IM(a,i,t):new NM(a,i,t));break}else{let d=e.map[a];d===void 0&&(d=new DM(a),Pu(e,d)),e=d}}}class ea{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let o=0;o<n;++o){const a=t.getActiveUniform(e,o),l=t.getUniformLocation(e,a.name);UM(a,l,this)}const s=[],r=[];for(const o of this.seq)o.type===t.SAMPLER_2D_SHADOW||o.type===t.SAMPLER_CUBE_SHADOW||o.type===t.SAMPLER_2D_ARRAY_SHADOW?s.push(o):r.push(o);s.length>0&&(this.seq=s.concat(r))}setValue(t,e,n,s){const r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){const s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,o=e.length;r!==o;++r){const a=e[r],l=n[a.id];l.needsUpdate!==!1&&a.setValue(t,l.value,s)}}static seqWithValue(t,e){const n=[];for(let s=0,r=t.length;s!==r;++s){const o=t[s];o.id in e&&n.push(o)}return n}}function Lu(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const FM=37297;let OM=0;function zM(i,t){const e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let o=s;o<r;o++){const a=o+1;n.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return n.join(`
`)}const Iu=new se;function BM(i){me._getMatrix(Iu,me.workingColorSpace,i);const t=`mat3( ${Iu.elements.map(e=>e.toFixed(4))} )`;switch(me.getTransfer(i)){case da:return[t,"LinearTransferOETF"];case be:return[t,"sRGBTransferOETF"];default:return ne("WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function Nu(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),r=(i.getShaderInfoLog(t)||"").trim();if(n&&r==="")return"";const o=/ERROR: 0:(\d+)/.exec(r);if(o){const a=parseInt(o[1]);return e.toUpperCase()+`

`+r+`

`+zM(i.getShaderSource(t),a)}else return r}function kM(i,t){const e=BM(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}const GM={[Rd]:"Linear",[Pd]:"Reinhard",[Ld]:"Cineon",[Pc]:"ACESFilmic",[Nd]:"AgX",[Dd]:"Neutral",[Id]:"Custom"};function VM(i,t){const e=GM[t];return e===void 0?(ne("WebGLProgram: Unsupported toneMapping:",t),"vec3 "+i+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const Ho=new B;function HM(){me.getLuminanceCoefficients(Ho);const i=Ho.x.toFixed(4),t=Ho.y.toFixed(4),e=Ho.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function WM(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(zr).join(`
`)}function qM(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function XM(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(t,s),o=r.name;let a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),e[o]={type:r.type,location:i.getAttribLocation(t,o),locationSize:a}}return e}function zr(i){return i!==""}function Du(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_SUN_LIGHTS/g,t.numSunLights).replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,t.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Uu(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const YM=/^[ \t]*#include +<([\w\d./]+)>/gm;function yc(i){return i.replace(YM,KM)}const ZM=new Map;function KM(i,t){let e=ae[t];if(e===void 0){const n=ZM.get(t);if(n!==void 0)e=ae[n],ne('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+t+">")}return yc(e)}const $M=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Fu(i){return i.replace($M,JM)}function JM(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Ou(i){let t=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?t+=`
#define HIGH_PRECISION`:i.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}const jM={[$o]:"SHADOWMAP_TYPE_PCF",[Fr]:"SHADOWMAP_TYPE_VSM"};function QM(i){return jM[i.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const tS={[Es]:"ENVMAP_TYPE_CUBE",[cr]:"ENVMAP_TYPE_CUBE",[wa]:"ENVMAP_TYPE_CUBE_UV"};function eS(i){return i.envMap===!1?"ENVMAP_TYPE_CUBE":tS[i.envMapMode]||"ENVMAP_TYPE_CUBE"}const nS={[cr]:"ENVMAP_MODE_REFRACTION"};function iS(i){return i.envMap===!1?"ENVMAP_MODE_REFLECTION":nS[i.envMapMode]||"ENVMAP_MODE_REFLECTION"}const sS={[Cd]:"ENVMAP_BLENDING_MULTIPLY",[G0]:"ENVMAP_BLENDING_MIX",[V0]:"ENVMAP_BLENDING_ADD"};function rS(i){return i.envMap===!1?"ENVMAP_BLENDING_NONE":sS[i.combine]||"ENVMAP_BLENDING_NONE"}function oS(i){const t=i.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function aS(i,t,e,n){const s=i.getContext(),r=e.defines;let o=e.vertexShader,a=e.fragmentShader;const l=QM(e),c=eS(e),h=iS(e),d=rS(e),u=oS(e),f=WM(e),g=qM(r),v=s.createProgram();let m,p,x=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(zr).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(zr).join(`
`),p.length>0&&(p+=`
`)):(m=[Ou(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexNormals?"#define HAS_NORMAL":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(zr).join(`
`),p=[Ou(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+d:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.retroreflection?"#define USE_RETROREFLECTION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas||e.batchingColor?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==pi?"#define TONE_MAPPING":"",e.toneMapping!==pi?ae.tonemapping_pars_fragment:"",e.toneMapping!==pi?VM("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",ae.colorspace_pars_fragment,kM("linearToOutputTexel",e.outputColorSpace),HM(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(zr).join(`
`)),o=yc(o),o=Du(o,e),o=Uu(o,e),a=yc(a),a=Du(a,e),a=Uu(a,e),o=Fu(o),a=Fu(a),e.isRawShaderMaterial!==!0&&(x=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",e.glslVersion===Uh?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Uh?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const w=x+m+o,y=x+p+a,M=Lu(s,s.VERTEX_SHADER,w),S=Lu(s,s.FRAGMENT_SHADER,y);s.attachShader(v,M),s.attachShader(v,S),e.index0AttributeName!==void 0?s.bindAttribLocation(v,0,e.index0AttributeName):e.hasPositionAttribute===!0&&s.bindAttribLocation(v,0,"position"),s.linkProgram(v);function C(I){if(i.debug.checkShaderErrors){const U=s.getProgramInfoLog(v)||"",N=s.getShaderInfoLog(M)||"",A=s.getShaderInfoLog(S)||"",D=U.trim(),F=N.trim(),G=A.trim();let Y=!0,V=!0;if(s.getProgramParameter(v,s.LINK_STATUS)===!1)if(Y=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,v,M,S);else{const q=Nu(s,M,"vertex"),$=Nu(s,S,"fragment");ge("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(v,s.VALIDATE_STATUS)+`

Material Name: `+I.name+`
Material Type: `+I.type+`

Program Info Log: `+D+`
`+q+`
`+$)}else D!==""?ne("WebGLProgram: Program Info Log:",D):(F===""||G==="")&&(V=!1);V&&(I.diagnostics={runnable:Y,programLog:D,vertexShader:{log:F,prefix:m},fragmentShader:{log:G,prefix:p}})}s.deleteShader(M),s.deleteShader(S),_=new ea(s,v),T=XM(s,v)}let _;this.getUniforms=function(){return _===void 0&&C(this),_};let T;this.getAttributes=function(){return T===void 0&&C(this),T};let L=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return L===!1&&(L=s.getProgramParameter(v,FM)),L},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(v),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=OM++,this.cacheKey=t,this.usedTimes=1,this.program=v,this.vertexShader=M,this.fragmentShader=S,this}let lS=0;class cS{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t,e,n){const s=this._getShaderCacheForMaterial(t);return s.has(e)===!1&&(s.add(e),e.usedTimes++),s.has(n)===!1&&(s.add(n),n.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderStage(t){return this._getShaderStage(t.vertexShader)}getFragmentShaderStage(t){return this._getShaderStage(t.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new hS(t),e.set(t,n)),n}}class hS{constructor(t){this.id=lS++,this.code=t,this.usedTimes=0}}function uS(i){return i===Ts||i===la||i===ca}function dS(i,t,e,n,s,r){const o=new Gc,a=new cS,l=new Set,c=[],h=new Map,d=n.logarithmicDepthBuffer;let u=n.precision;const f={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(_){return l.add(_),_===0?"uv":`uv${_}`}function v(_,T,L,I,U,N){const A=I.fog,D=U.geometry,F=_.isMeshStandardMaterial||_.isMeshLambertMaterial||_.isMeshPhongMaterial?I.environment:null,G=_.isMeshStandardMaterial||_.isMeshLambertMaterial&&!_.envMap||_.isMeshPhongMaterial&&!_.envMap,Y=t.get(_.envMap||F,G),V=Y&&Y.mapping===wa?Y.image.height:null,q=f[_.type];_.precision!==null&&(u=n.getMaxPrecision(_.precision),u!==_.precision&&ne("WebGLProgram.getParameters:",_.precision,"not supported, using",u,"instead."));const $=D.morphAttributes.position||D.morphAttributes.normal||D.morphAttributes.color,it=$!==void 0?$.length:0;let yt=0;D.morphAttributes.position!==void 0&&(yt=1),D.morphAttributes.normal!==void 0&&(yt=2),D.morphAttributes.color!==void 0&&(yt=3);let Ft,Zt,lt,W;if(q){const de=ci[q];Ft=de.vertexShader,Zt=de.fragmentShader}else{Ft=_.vertexShader,Zt=_.fragmentShader;const de=a.getVertexShaderStage(_),pe=a.getFragmentShaderStage(_);a.update(_,de,pe),lt=de.id,W=pe.id}const rt=i.getRenderTarget(),dt=i.state.buffers.depth.getReversed(),Mt=U.isInstancedMesh===!0,_t=U.isBatchedMesh===!0,Tt=!!_.map,kt=!!_.matcap,ct=!!Y,z=!!_.aoMap,et=!!_.lightMap,nt=!!_.bumpMap&&_.wireframe===!1,J=!!_.normalMap,k=!!_.displacementMap,Q=!!_.emissiveMap,ht=!!_.metalnessMap,vt=!!_.roughnessMap,O=_.anisotropy>0,Rt=_.clearcoat>0,At=_.dispersion>0,P=_.retroreflectivity>0,b=_.iridescence>0,H=_.sheen>0,tt=_.transmission>0,st=O&&!!_.anisotropyMap,bt=Rt&&!!_.clearcoatMap,Ct=Rt&&!!_.clearcoatNormalMap,pt=Rt&&!!_.clearcoatRoughnessMap,xt=b&&!!_.iridescenceMap,Pt=b&&!!_.iridescenceThicknessMap,Ht=H&&!!_.sheenColorMap,Lt=H&&!!_.sheenRoughnessMap,It=!!_.specularMap,Yt=!!_.specularColorMap,ee=!!_.specularIntensityMap,ie=tt&&!!_.transmissionMap,Z=tt&&!!_.thicknessMap,j=!!_.gradientMap,K=!!_.alphaMap,mt=_.alphaTest>0,wt=!!_.alphaHash,gt=!!_.extensions;let Wt=pi;_.toneMapped&&(rt===null||rt.isXRRenderTarget===!0)&&(Wt=i.toneMapping);const Nt={shaderID:q,shaderType:_.type,shaderName:_.name,vertexShader:Ft,fragmentShader:Zt,defines:_.defines,customVertexShaderID:lt,customFragmentShaderID:W,isRawShaderMaterial:_.isRawShaderMaterial===!0,glslVersion:_.glslVersion,precision:u,batching:_t,batchingColor:_t&&U._colorsTexture!==null,instancing:Mt,instancingColor:Mt&&U.instanceColor!==null,instancingMorph:Mt&&U.morphTexture!==null,outputColorSpace:rt===null?i.outputColorSpace:rt.isXRRenderTarget===!0?rt.texture.colorSpace:me.workingColorSpace,alphaToCoverage:!!_.alphaToCoverage,map:Tt,matcap:kt,envMap:ct,envMapMode:ct&&Y.mapping,envMapCubeUVHeight:V,aoMap:z,lightMap:et,bumpMap:nt,normalMap:J,displacementMap:k,emissiveMap:Q,normalMapObjectSpace:J&&_.normalMapType===q0,normalMapTangentSpace:J&&_.normalMapType===ha,packedNormalMap:J&&_.normalMapType===ha&&uS(_.normalMap.format),metalnessMap:ht,roughnessMap:vt,anisotropy:O,anisotropyMap:st,clearcoat:Rt,clearcoatMap:bt,clearcoatNormalMap:Ct,clearcoatRoughnessMap:pt,dispersion:At,retroreflection:P,iridescence:b,iridescenceMap:xt,iridescenceThicknessMap:Pt,sheen:H,sheenColorMap:Ht,sheenRoughnessMap:Lt,specularMap:It,specularColorMap:Yt,specularIntensityMap:ee,transmission:tt,transmissionMap:ie,thicknessMap:Z,gradientMap:j,opaque:_.transparent===!1&&_.blending===Vr&&_.alphaToCoverage===!1,alphaMap:K,alphaTest:mt,alphaHash:wt,combine:_.combine,mapUv:Tt&&g(_.map.channel),aoMapUv:z&&g(_.aoMap.channel),lightMapUv:et&&g(_.lightMap.channel),bumpMapUv:nt&&g(_.bumpMap.channel),normalMapUv:J&&g(_.normalMap.channel),displacementMapUv:k&&g(_.displacementMap.channel),emissiveMapUv:Q&&g(_.emissiveMap.channel),metalnessMapUv:ht&&g(_.metalnessMap.channel),roughnessMapUv:vt&&g(_.roughnessMap.channel),anisotropyMapUv:st&&g(_.anisotropyMap.channel),clearcoatMapUv:bt&&g(_.clearcoatMap.channel),clearcoatNormalMapUv:Ct&&g(_.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:pt&&g(_.clearcoatRoughnessMap.channel),iridescenceMapUv:xt&&g(_.iridescenceMap.channel),iridescenceThicknessMapUv:Pt&&g(_.iridescenceThicknessMap.channel),sheenColorMapUv:Ht&&g(_.sheenColorMap.channel),sheenRoughnessMapUv:Lt&&g(_.sheenRoughnessMap.channel),specularMapUv:It&&g(_.specularMap.channel),specularColorMapUv:Yt&&g(_.specularColorMap.channel),specularIntensityMapUv:ee&&g(_.specularIntensityMap.channel),transmissionMapUv:ie&&g(_.transmissionMap.channel),thicknessMapUv:Z&&g(_.thicknessMap.channel),alphaMapUv:K&&g(_.alphaMap.channel),vertexTangents:!!D.attributes.tangent&&(J||O),vertexNormals:!!D.attributes.normal,vertexColors:_.vertexColors,vertexAlphas:_.vertexColors===!0&&!!D.attributes.color&&D.attributes.color.itemSize===4,pointsUvs:U.isPoints===!0&&!!D.attributes.uv&&(Tt||K),fog:!!A,useFog:_.fog===!0,fogExp2:!!A&&A.isFogExp2,flatShading:_.wireframe===!1&&(_.flatShading===!0||D.attributes.normal===void 0&&J===!1&&(_.isMeshLambertMaterial||_.isMeshPhongMaterial||_.isMeshStandardMaterial||_.isMeshPhysicalMaterial)),sizeAttenuation:_.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:dt,skinning:U.isSkinnedMesh===!0,hasPositionAttribute:D.attributes.position!==void 0,morphTargets:D.morphAttributes.position!==void 0,morphNormals:D.morphAttributes.normal!==void 0,morphColors:D.morphAttributes.color!==void 0,morphTargetsCount:it,morphTextureStride:yt,numSunLights:T.sun.length,numDirLights:T.directional.length,numPointLights:T.point.length,numSpotLights:T.spot.length,numSpotLightMaps:T.spotLightMap.length,numRectAreaLights:T.rectArea.length,numHemiLights:T.hemi.length,numSunLightShadows:T.sunShadowMap.length,numDirLightShadows:T.directionalShadowMap.length,numPointLightShadows:T.pointShadowMap.length,numSpotLightShadows:T.spotShadowMap.length,numSpotLightShadowsWithMaps:T.numSpotLightShadowsWithMaps,numLightProbes:T.numLightProbes,numLightProbeGrids:N.length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:_.dithering,shadowMapEnabled:i.shadowMap.enabled&&L.length>0,shadowMapType:i.shadowMap.type,toneMapping:Wt,decodeVideoTexture:Tt&&_.map.isVideoTexture===!0&&me.getTransfer(_.map.colorSpace)===be,decodeVideoTextureEmissive:Q&&_.emissiveMap.isVideoTexture===!0&&me.getTransfer(_.emissiveMap.colorSpace)===be,premultipliedAlpha:_.premultipliedAlpha,doubleSided:_.side===Ge,flipSided:_.side===En,useDepthPacking:_.depthPacking>=0,depthPacking:_.depthPacking||0,index0AttributeName:_.index0AttributeName,extensionClipCullDistance:gt&&_.extensions.clipCullDistance===!0&&e.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(gt&&_.extensions.multiDraw===!0||_t)&&e.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:e.has("KHR_parallel_shader_compile"),customProgramCacheKey:_.customProgramCacheKey()};return Nt.vertexUv1s=l.has(1),Nt.vertexUv2s=l.has(2),Nt.vertexUv3s=l.has(3),l.clear(),Nt}function m(_){const T=[];if(_.shaderID?T.push(_.shaderID):(T.push(_.customVertexShaderID),T.push(_.customFragmentShaderID)),_.defines!==void 0)for(const L in _.defines)T.push(L),T.push(_.defines[L]);return _.isRawShaderMaterial===!1&&(p(T,_),x(T,_),T.push(i.outputColorSpace)),T.push(_.customProgramCacheKey),T.join()}function p(_,T){_.push(T.precision),_.push(T.outputColorSpace),_.push(T.envMapMode),_.push(T.envMapCubeUVHeight),_.push(T.mapUv),_.push(T.alphaMapUv),_.push(T.lightMapUv),_.push(T.aoMapUv),_.push(T.bumpMapUv),_.push(T.normalMapUv),_.push(T.displacementMapUv),_.push(T.emissiveMapUv),_.push(T.metalnessMapUv),_.push(T.roughnessMapUv),_.push(T.anisotropyMapUv),_.push(T.clearcoatMapUv),_.push(T.clearcoatNormalMapUv),_.push(T.clearcoatRoughnessMapUv),_.push(T.iridescenceMapUv),_.push(T.iridescenceThicknessMapUv),_.push(T.sheenColorMapUv),_.push(T.sheenRoughnessMapUv),_.push(T.specularMapUv),_.push(T.specularColorMapUv),_.push(T.specularIntensityMapUv),_.push(T.transmissionMapUv),_.push(T.thicknessMapUv),_.push(T.combine),_.push(T.fogExp2),_.push(T.sizeAttenuation),_.push(T.morphTargetsCount),_.push(T.morphAttributeCount),_.push(T.numSunLights),_.push(T.numDirLights),_.push(T.numPointLights),_.push(T.numSpotLights),_.push(T.numSpotLightMaps),_.push(T.numHemiLights),_.push(T.numRectAreaLights),_.push(T.numSunLightShadows),_.push(T.numDirLightShadows),_.push(T.numPointLightShadows),_.push(T.numSpotLightShadows),_.push(T.numSpotLightShadowsWithMaps),_.push(T.numLightProbes),_.push(T.shadowMapType),_.push(T.toneMapping),_.push(T.numClippingPlanes),_.push(T.numClipIntersection),_.push(T.depthPacking)}function x(_,T){o.disableAll(),T.instancing&&o.enable(0),T.instancingColor&&o.enable(1),T.instancingMorph&&o.enable(2),T.matcap&&o.enable(3),T.envMap&&o.enable(4),T.normalMapObjectSpace&&o.enable(5),T.normalMapTangentSpace&&o.enable(6),T.clearcoat&&o.enable(7),T.iridescence&&o.enable(8),T.alphaTest&&o.enable(9),T.vertexColors&&o.enable(10),T.vertexAlphas&&o.enable(11),T.vertexUv1s&&o.enable(12),T.vertexUv2s&&o.enable(13),T.vertexUv3s&&o.enable(14),T.vertexTangents&&o.enable(15),T.anisotropy&&o.enable(16),T.alphaHash&&o.enable(17),T.batching&&o.enable(18),T.dispersion&&o.enable(19),T.retroreflection&&o.enable(24),T.batchingColor&&o.enable(20),T.gradientMap&&o.enable(21),T.packedNormalMap&&o.enable(22),T.vertexNormals&&o.enable(23),_.push(o.mask),o.disableAll(),T.fog&&o.enable(0),T.useFog&&o.enable(1),T.flatShading&&o.enable(2),T.logarithmicDepthBuffer&&o.enable(3),T.reversedDepthBuffer&&o.enable(4),T.skinning&&o.enable(5),T.morphTargets&&o.enable(6),T.morphNormals&&o.enable(7),T.morphColors&&o.enable(8),T.premultipliedAlpha&&o.enable(9),T.shadowMapEnabled&&o.enable(10),T.doubleSided&&o.enable(11),T.flipSided&&o.enable(12),T.useDepthPacking&&o.enable(13),T.dithering&&o.enable(14),T.transmission&&o.enable(15),T.sheen&&o.enable(16),T.opaque&&o.enable(17),T.pointsUvs&&o.enable(18),T.decodeVideoTexture&&o.enable(19),T.decodeVideoTextureEmissive&&o.enable(20),T.alphaToCoverage&&o.enable(21),T.numLightProbeGrids>0&&o.enable(22),T.hasPositionAttribute&&o.enable(23),_.push(o.mask)}function w(_){const T=f[_.type];let L;if(T){const I=ci[T];L=Tv.clone(I.uniforms)}else L=_.uniforms;return L}function y(_,T){let L=h.get(T);return L!==void 0?++L.usedTimes:(L=new aS(i,T,_,s),c.push(L),h.set(T,L)),L}function M(_){if(--_.usedTimes===0){const T=c.indexOf(_);c[T]=c[c.length-1],c.pop(),h.delete(_.cacheKey),_.destroy()}}function S(_){a.remove(_)}function C(){a.dispose()}return{getParameters:v,getProgramCacheKey:m,getUniforms:w,acquireProgram:y,releaseProgram:M,releaseShaderCache:S,programs:c,dispose:C}}function fS(){let i=new WeakMap;function t(o){return i.has(o)}function e(o){let a=i.get(o);return a===void 0&&(a={},i.set(o,a)),a}function n(o){i.delete(o)}function s(o,a,l){i.get(o)[a]=l}function r(){i=new WeakMap}return{has:t,get:e,remove:n,update:s,dispose:r}}function pS(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.materialVariant!==t.materialVariant?i.materialVariant-t.materialVariant:i.z!==t.z?i.z-t.z:i.id-t.id}function zu(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function Bu(){const i=[];let t=0;const e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function o(u){let f=0;return u.isInstancedMesh&&(f+=2),u.isSkinnedMesh&&(f+=1),f}function a(u,f,g,v,m,p){let x=i[t];return x===void 0?(x={id:u.id,object:u,geometry:f,material:g,materialVariant:o(u),groupOrder:v,renderOrder:u.renderOrder,z:m,group:p},i[t]=x):(x.id=u.id,x.object=u,x.geometry=f,x.material=g,x.materialVariant=o(u),x.groupOrder=v,x.renderOrder=u.renderOrder,x.z=m,x.group=p),t++,x}function l(u,f,g,v,m,p,x){x.reversedDepth===!0&&(m=-m);const w=a(u,f,g,v,m,p);g.transmission>0?n.push(w):g.transparent===!0?s.push(w):e.push(w)}function c(u,f,g,v,m,p){const x=a(u,f,g,v,m,p);g.transmission>0?n.unshift(x):g.transparent===!0?s.unshift(x):e.unshift(x)}function h(u,f){e.length>1&&e.sort(u||pS),n.length>1&&n.sort(f||zu),s.length>1&&s.sort(f||zu)}function d(){for(let u=t,f=i.length;u<f;u++){const g=i[u];if(g.id===null)break;g.id=null,g.object=null,g.geometry=null,g.material=null,g.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:l,unshift:c,finish:d,sort:h}}function mS(){let i=new WeakMap;function t(n,s){const r=i.get(n);let o;return r===void 0?(o=new Bu,i.set(n,[o])):s>=r.length?(o=new Bu,r.push(o)):o=r[s],o}function e(){i=new WeakMap}return{get:t,dispose:e}}function gS(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"SunLight":case"DirectionalLight":e={direction:new B,color:new te};break;case"SpotLight":e={position:new B,direction:new B,color:new te,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new B,color:new te,distance:0,decay:0};break;case"HemisphereLight":e={direction:new B,skyColor:new te,groundColor:new te};break;case"RectAreaLight":e={color:new te,position:new B,halfWidth:new B,halfHeight:new B};break}return i[t.id]=e,e}}}function vS(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"SunLight":case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Et};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Et};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Et,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let xS=0;function _S(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function yS(i){const t=new gS,e=vS(),n={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new B);const s=new B,r=new Ee,o=new Ee;function a(c){let h=0,d=0,u=0;for(let U=0;U<9;U++)n.probe[U].set(0,0,0);let f=0,g=0,v=0,m=0,p=0,x=0,w=0,y=0,M=0,S=0,C=0,_=0,T=0,L=0;c.sort(_S);for(let U=0,N=c.length;U<N;U++){const A=c[U],D=A.color,F=A.intensity,G=A.distance;let Y=null;if(A.shadow&&A.shadow.map&&(A.shadow.map.texture.format===Ts?Y=A.shadow.map.texture:Y=A.shadow.map.depthTexture||A.shadow.map.texture),A.isAmbientLight)h+=D.r*F,d+=D.g*F,u+=D.b*F;else if(A.isLightProbe){for(let V=0;V<9;V++)n.probe[V].addScaledVector(A.sh.coefficients[V],F);L++}else if(A.isSunLight){const V=t.get(A);if(V.color.copy(A.color).multiplyScalar(A.intensity),A.castShadow){const q=A.shadow,$=e.get(A);$.shadowIntensity=q.intensity,$.shadowBias=q.bias,$.shadowNormalBias=q.normalBias,$.shadowRadius=q.radius,$.shadowMapSize.copy(q.mapSize).multiply(q.getFrameExtents()),n.sunShadow[g]=$,n.sunShadowMap[g]=Y;const it=q.getViewportCount();for(let yt=0;yt<it;yt++)n.sunShadowMatrix[v+yt]=q.getMatrix(yt),n.sunShadowCascade[v+yt]=q._cascadeData[yt];v+=it,g++}n.sun[f]=V,f++}else if(A.isDirectionalLight){const V=t.get(A);if(V.color.copy(A.color).multiplyScalar(A.intensity),A.castShadow){const q=A.shadow,$=e.get(A);$.shadowIntensity=q.intensity,$.shadowBias=q.bias,$.shadowNormalBias=q.normalBias,$.shadowRadius=q.radius,$.shadowMapSize=q.mapSize,n.directionalShadow[m]=$,n.directionalShadowMap[m]=Y,n.directionalShadowMatrix[m]=A.shadow.matrix,M++}n.directional[m]=V,m++}else if(A.isSpotLight){const V=t.get(A);V.position.setFromMatrixPosition(A.matrixWorld),V.color.copy(D).multiplyScalar(F),V.distance=G,V.coneCos=Math.cos(A.angle),V.penumbraCos=Math.cos(A.angle*(1-A.penumbra)),V.decay=A.decay,n.spot[x]=V;const q=A.shadow;if(A.map&&(n.spotLightMap[_]=A.map,_++,q.updateMatrices(A),A.castShadow&&T++),n.spotLightMatrix[x]=q.matrix,A.castShadow){const $=e.get(A);$.shadowIntensity=q.intensity,$.shadowBias=q.bias,$.shadowNormalBias=q.normalBias,$.shadowRadius=q.radius,$.shadowMapSize=q.mapSize,n.spotShadow[x]=$,n.spotShadowMap[x]=Y,C++}x++}else if(A.isRectAreaLight){const V=t.get(A);V.color.copy(D).multiplyScalar(F),V.halfWidth.set(A.width*.5,0,0),V.halfHeight.set(0,A.height*.5,0),n.rectArea[w]=V,w++}else if(A.isPointLight){const V=t.get(A);if(V.color.copy(A.color).multiplyScalar(A.intensity),V.distance=A.distance,V.decay=A.decay,A.castShadow){const q=A.shadow,$=e.get(A);$.shadowIntensity=q.intensity,$.shadowBias=q.bias,$.shadowNormalBias=q.normalBias,$.shadowRadius=q.radius,$.shadowMapSize=q.mapSize,$.shadowCameraNear=q.camera.near,$.shadowCameraFar=q.camera.far,n.pointShadow[p]=$,n.pointShadowMap[p]=Y,n.pointShadowMatrix[p]=A.shadow.matrix,S++}n.point[p]=V,p++}else if(A.isHemisphereLight){const V=t.get(A);V.skyColor.copy(A.color).multiplyScalar(F),V.groundColor.copy(A.groundColor).multiplyScalar(F),n.hemi[y]=V,y++}}w>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=Dt.LTC_FLOAT_1,n.rectAreaLTC2=Dt.LTC_FLOAT_2):(n.rectAreaLTC1=Dt.LTC_HALF_1,n.rectAreaLTC2=Dt.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=d,n.ambient[2]=u;const I=n.hash;(I.sunLength!==f||I.directionalLength!==m||I.pointLength!==p||I.spotLength!==x||I.rectAreaLength!==w||I.hemiLength!==y||I.numSunShadows!==g||I.numDirectionalShadows!==M||I.numPointShadows!==S||I.numSpotShadows!==C||I.numSpotMaps!==_||I.numLightProbes!==L)&&(n.sun.length=f,n.directional.length=m,n.spot.length=x,n.rectArea.length=w,n.point.length=p,n.hemi.length=y,n.sunShadow.length=g,n.sunShadowMap.length=g,n.sunShadowMatrix.length=v,n.sunShadowCascade.length=v,n.directionalShadow.length=M,n.directionalShadowMap.length=M,n.directionalShadowMatrix.length=M,n.pointShadow.length=S,n.pointShadowMap.length=S,n.pointShadowMatrix.length=S,n.spotShadow.length=C,n.spotShadowMap.length=C,n.spotLightMatrix.length=C+_-T,n.spotLightMap.length=_,n.numSpotLightShadowsWithMaps=T,n.numLightProbes=L,I.sunLength=f,I.directionalLength=m,I.pointLength=p,I.spotLength=x,I.rectAreaLength=w,I.hemiLength=y,I.numSunShadows=g,I.numDirectionalShadows=M,I.numPointShadows=S,I.numSpotShadows=C,I.numSpotMaps=_,I.numLightProbes=L,n.version=xS++)}function l(c,h){let d=0,u=0,f=0,g=0,v=0,m=0;const p=h.matrixWorldInverse;for(let x=0,w=c.length;x<w;x++){const y=c[x];if(y.isSunLight){const M=n.sun[d];M.direction.setFromMatrixPosition(y.matrixWorld),M.direction.transformDirection(p),d++}else if(y.isDirectionalLight){const M=n.directional[u];M.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),M.direction.sub(s),M.direction.transformDirection(p),u++}else if(y.isSpotLight){const M=n.spot[g];M.position.setFromMatrixPosition(y.matrixWorld),M.position.applyMatrix4(p),M.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),M.direction.sub(s),M.direction.transformDirection(p),g++}else if(y.isRectAreaLight){const M=n.rectArea[v];M.position.setFromMatrixPosition(y.matrixWorld),M.position.applyMatrix4(p),o.identity(),r.copy(y.matrixWorld),r.premultiply(p),o.extractRotation(r),M.halfWidth.set(y.width*.5,0,0),M.halfHeight.set(0,y.height*.5,0),M.halfWidth.applyMatrix4(o),M.halfHeight.applyMatrix4(o),v++}else if(y.isPointLight){const M=n.point[f];M.position.setFromMatrixPosition(y.matrixWorld),M.position.applyMatrix4(p),f++}else if(y.isHemisphereLight){const M=n.hemi[m];M.direction.setFromMatrixPosition(y.matrixWorld),M.direction.transformDirection(p),m++}}}return{setup:a,setupView:l,state:n}}function ku(i){const t=new yS(i),e=[],n=[],s=[];function r(u){d.camera=u,e.length=0,n.length=0,s.length=0}function o(u){e.push(u)}function a(u){n.push(u)}function l(u){s.push(u)}function c(){t.setup(e)}function h(u){t.setupView(e,u)}const d={lightsArray:e,shadowsArray:n,lightProbeGridArray:s,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:d,setupLights:c,setupLightsView:h,pushLight:o,pushShadow:a,pushLightProbeGrid:l}}function MS(i){let t=new WeakMap;function e(s,r=0){const o=t.get(s);let a;return o===void 0?(a=new ku(i),t.set(s,[a])):r>=o.length?(a=new ku(i),o.push(a)):a=o[r],a}function n(){t=new WeakMap}return{get:e,dispose:n}}const SS=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,bS=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,wS=[new B(1,0,0),new B(-1,0,0),new B(0,1,0),new B(0,-1,0),new B(0,0,1),new B(0,0,-1)],ES=[new B(0,-1,0),new B(0,-1,0),new B(0,0,1),new B(0,0,-1),new B(0,-1,0),new B(0,-1,0)],Gu=new Ee,Lr=new B,bl=new B;function TS(i,t,e){let n=new Wc;const s=new Et,r=new Et,o=new Ue,a=new Lv,l=new Iv,c={},h=e.maxTextureSize,d={[ws]:En,[En]:ws,[Ge]:Ge},u=new Gn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Et},radius:{value:4}},vertexShader:SS,fragmentShader:bS}),f=u.clone();f.defines.HORIZONTAL_PASS=1;const g=new Ne;g.setAttribute("position",new Bn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new ve(g,u),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=$o;let p=this.type;this.render=function(S,C,_){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||S.length===0)return;this.type===Ed&&(ne("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=$o);const T=i.getRenderTarget(),L=i.getActiveCubeFace(),I=i.getActiveMipmapLevel(),U=i.state;U.setBlending(Oi),U.buffers.depth.getReversed()===!0?U.buffers.color.setClear(0,0,0,0):U.buffers.color.setClear(1,1,1,1),U.buffers.depth.setTest(!0),U.setScissorTest(!1);const N=p!==this.type;N&&C.traverse(function(A){A.material&&(Array.isArray(A.material)?A.material.forEach(D=>D.needsUpdate=!0):A.material.needsUpdate=!0)});for(let A=0,D=S.length;A<D;A++){const F=S[A],G=F.shadow;if(G===void 0){ne("WebGLShadowMap:",F,"has no shadow.");continue}if(G.autoUpdate===!1&&G.needsUpdate===!1)continue;s.copy(G.mapSize);const Y=G.getFrameExtents();s.multiply(Y),r.copy(G.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/Y.x),s.x=r.x*Y.x,G.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/Y.y),s.y=r.y*Y.y,G.mapSize.y=r.y));const V=i.state.buffers.depth.getReversed();if(G.camera._reversedDepth=V,G.map===null||N===!0){if(G.map!==null&&(G.map.depthTexture!==null&&(G.map.depthTexture.dispose(),G.map.depthTexture=null),G.map.dispose()),this.type===Fr){if(F.isPointLight){ne("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}G.map=new $n(s.x,s.y,{format:Ts,type:gi,minFilter:dn,magFilter:dn,generateMipmaps:!1}),G.map.texture.name=F.name+".shadowMap",G.map.depthTexture=new to(s.x,s.y,Zn),G.map.depthTexture.name=F.name+".shadowMapDepth",G.map.depthTexture.format=ki,G.map.depthTexture.compareFunction=null,G.map.depthTexture.minFilter=en,G.map.depthTexture.magFilter=en}else F.isPointLight?(G.map=new hf(s.x),G.map.depthTexture=new qg(s.x,mi)):(G.map=new $n(s.x,s.y),G.map.depthTexture=new to(s.x,s.y,mi)),G.map.depthTexture.name=F.name+".shadowMap",G.map.depthTexture.format=ki,this.type===$o?(G.map.depthTexture.compareFunction=V?zc:Oc,G.map.depthTexture.minFilter=dn,G.map.depthTexture.magFilter=dn):(G.map.depthTexture.compareFunction=null,G.map.depthTexture.minFilter=en,G.map.depthTexture.magFilter=en);G.camera.updateProjectionMatrix()}G.map.isWebGLCubeRenderTarget!==!0&&(G.map.width!==s.x||G.map.height!==s.y)&&G.map.setSize(s.x,s.y);const q=G.map.isWebGLCubeRenderTarget?6:G.getViewportCount();F.isPointLight!==!0&&G.updateMatrices(F,_);for(let $=0;$<q;$++){const it=G.getCamera($);if(F.isPointLight){const yt=G.camera,Ft=G.matrix,Zt=F.distance||yt.far;Zt!==yt.far&&(yt.far=Zt,yt.updateProjectionMatrix()),Lr.setFromMatrixPosition(F.matrixWorld),yt.position.copy(Lr),bl.copy(yt.position),bl.add(wS[$]),yt.up.copy(ES[$]),yt.lookAt(bl),yt.updateMatrixWorld(),Ft.makeTranslation(-Lr.x,-Lr.y,-Lr.z),Gu.multiplyMatrices(yt.projectionMatrix,yt.matrixWorldInverse),G._frustum.setFromProjectionMatrix(Gu,yt.coordinateSystem,yt.reversedDepth)}if(G.map.isWebGLCubeRenderTarget)i.setRenderTarget(G.map,$),i.clear();else{$===0&&(i.setRenderTarget(G.map),i.clear());const yt=G.getViewport($);o.set(r.x*yt.x,r.y*yt.y,r.x*yt.z,r.y*yt.w),U.viewport(o)}n=G.getFrustum($),y(C,_,it,F,this.type)}G.isPointLightShadow!==!0&&this.type===Fr&&x(G,_),G.needsUpdate=!1}p=this.type,m.needsUpdate=!1,i.setRenderTarget(T,L,I)};function x(S,C){const _=t.update(v);u.defines.VSM_SAMPLES!==S.blurSamples&&(u.defines.VSM_SAMPLES=S.blurSamples,f.defines.VSM_SAMPLES=S.blurSamples,u.needsUpdate=!0,f.needsUpdate=!0),S.mapPass===null?S.mapPass=new $n(s.x,s.y,{format:Ts,type:gi}):(S.mapPass.width!==S.map.width||S.mapPass.height!==S.map.height)&&S.mapPass.setSize(S.map.width,S.map.height),u.uniforms.shadow_pass.value=S.map.depthTexture,u.uniforms.resolution.value.set(S.map.width,S.map.height),u.uniforms.radius.value=S.radius,i.setRenderTarget(S.mapPass),i.clear(),i.renderBufferDirect(C,null,_,u,v,null),f.uniforms.shadow_pass.value=S.mapPass.texture,f.uniforms.resolution.value.set(S.map.width,S.map.height),f.uniforms.radius.value=S.radius,i.setRenderTarget(S.map),i.clear(),i.renderBufferDirect(C,null,_,f,v,null)}function w(S,C,_,T){let L=null;const I=_.isPointLight===!0?S.customDistanceMaterial:S.customDepthMaterial;if(I!==void 0)L=I;else if(L=_.isPointLight===!0?l:a,i.localClippingEnabled&&C.clipShadows===!0&&Array.isArray(C.clippingPlanes)&&C.clippingPlanes.length!==0||C.displacementMap&&C.displacementScale!==0||C.alphaMap&&C.alphaTest>0||C.map&&C.alphaTest>0||C.alphaToCoverage===!0){const U=L.uuid,N=C.uuid;let A=c[U];A===void 0&&(A={},c[U]=A);let D=A[N];D===void 0&&(D=L.clone(),A[N]=D,C.addEventListener("dispose",M)),L=D}if(L.visible=C.visible,L.wireframe=C.wireframe,T===Fr?L.side=C.shadowSide!==null?C.shadowSide:C.side:L.side=C.shadowSide!==null?C.shadowSide:d[C.side],L.alphaMap=C.alphaMap,L.alphaTest=C.alphaToCoverage===!0?.5:C.alphaTest,L.map=C.map,L.clipShadows=C.clipShadows,L.clippingPlanes=C.clippingPlanes,L.clipIntersection=C.clipIntersection,L.displacementMap=C.displacementMap,L.displacementScale=C.displacementScale,L.displacementBias=C.displacementBias,L.wireframeLinewidth=C.wireframeLinewidth,L.linewidth=C.linewidth,_.isPointLight===!0&&L.isMeshDistanceMaterial===!0){const U=i.properties.get(L);U.light=_}return L}function y(S,C,_,T,L){if(S.visible===!1)return;if(S.layers.test(C.layers)&&(S.isMesh||S.isLine||S.isPoints)&&(S.castShadow||S.receiveShadow&&L===Fr)&&(!S.frustumCulled||S.intersectsFrustum(n))){S.modelViewMatrix.multiplyMatrices(_.matrixWorldInverse,S.matrixWorld);const N=t.update(S),A=S.material;if(Array.isArray(A)){const D=N.groups;for(let F=0,G=D.length;F<G;F++){const Y=D[F],V=A[Y.materialIndex];if(V&&V.visible){const q=w(S,V,T,L);S.onBeforeShadow(i,S,C,_,N,q,Y),i.renderBufferDirect(_,null,N,q,S,Y),S.onAfterShadow(i,S,C,_,N,q,Y)}}}else if(A.visible){const D=w(S,A,T,L);S.onBeforeShadow(i,S,C,_,N,D,null),i.renderBufferDirect(_,null,N,D,S,null),S.onAfterShadow(i,S,C,_,N,D,null)}}const U=S.children;for(let N=0,A=U.length;N<A;N++)y(U[N],C,_,T,L)}function M(S){S.target.removeEventListener("dispose",M);for(const _ in c){const T=c[_],L=S.target.uuid;L in T&&(T[L].dispose(),delete T[L])}}}function AS(i,t){function e(){let Z=!1;const j=new Ue;let K=null;const mt=new Ue(0,0,0,0);return{setMask:function(wt){K!==wt&&!Z&&(i.colorMask(wt,wt,wt,wt),K=wt)},setLocked:function(wt){Z=wt},setClear:function(wt,gt,Wt,Nt,de){de===!0&&(wt*=Nt,gt*=Nt,Wt*=Nt),j.set(wt,gt,Wt,Nt),mt.equals(j)===!1&&(i.clearColor(wt,gt,Wt,Nt),mt.copy(j))},reset:function(){Z=!1,K=null,mt.set(-1,0,0,0)}}}function n(){let Z=!1,j=!1,K=null,mt=null,wt=null;return{setReversed:function(gt){if(j!==gt){const Wt=t.get("EXT_clip_control");gt?Wt.clipControlEXT(Wt.LOWER_LEFT_EXT,Wt.ZERO_TO_ONE_EXT):Wt.clipControlEXT(Wt.LOWER_LEFT_EXT,Wt.NEGATIVE_ONE_TO_ONE_EXT),j=gt;const Nt=wt;wt=null,this.setClear(Nt)}},getReversed:function(){return j},setTest:function(gt){gt?rt(i.DEPTH_TEST):dt(i.DEPTH_TEST)},setMask:function(gt){K!==gt&&!Z&&(i.depthMask(gt),K=gt)},setFunc:function(gt){if(j&&(gt=sg[gt]),mt!==gt){switch(gt){case Cl:i.depthFunc(i.NEVER);break;case Rl:i.depthFunc(i.ALWAYS);break;case Pl:i.depthFunc(i.LESS);break;case $r:i.depthFunc(i.LEQUAL);break;case Ll:i.depthFunc(i.EQUAL);break;case Il:i.depthFunc(i.GEQUAL);break;case Nl:i.depthFunc(i.GREATER);break;case Dl:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}mt=gt}},setLocked:function(gt){Z=gt},setClear:function(gt){wt!==gt&&(wt=gt,j&&(gt=1-gt),i.clearDepth(gt))},reset:function(){Z=!1,K=null,mt=null,wt=null,j=!1}}}function s(){let Z=!1,j=null,K=null,mt=null,wt=null,gt=null,Wt=null,Nt=null,de=null;return{setTest:function(pe){Z||(pe?rt(i.STENCIL_TEST):dt(i.STENCIL_TEST))},setMask:function(pe){j!==pe&&!Z&&(i.stencilMask(pe),j=pe)},setFunc:function(pe,Ve,sn){(K!==pe||mt!==Ve||wt!==sn)&&(i.stencilFunc(pe,Ve,sn),K=pe,mt=Ve,wt=sn)},setOp:function(pe,Ve,sn){(gt!==pe||Wt!==Ve||Nt!==sn)&&(i.stencilOp(pe,Ve,sn),gt=pe,Wt=Ve,Nt=sn)},setLocked:function(pe){Z=pe},setClear:function(pe){de!==pe&&(i.clearStencil(pe),de=pe)},reset:function(){Z=!1,j=null,K=null,mt=null,wt=null,gt=null,Wt=null,Nt=null,de=null}}}const r=new e,o=new n,a=new s,l=new WeakMap,c=new WeakMap;let h={},d={},u={},f=new WeakMap,g=[],v=null,m=!1,p=null,x=null,w=null,y=null,M=null,S=null,C=null,_=new te(0,0,0),T=0,L=!1,I=null,U=null,N=null,A=null,D=null;const F=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let G=!1,Y=0;const V=i.getParameter(i.VERSION);V.indexOf("WebGL")!==-1?(Y=parseFloat(/^WebGL (\d)/.exec(V)[1]),G=Y>=1):V.indexOf("OpenGL ES")!==-1&&(Y=parseFloat(/^OpenGL ES (\d)/.exec(V)[1]),G=Y>=2);let q=null,$={};const it=i.getParameter(i.SCISSOR_BOX),yt=i.getParameter(i.VIEWPORT),Ft=new Ue().fromArray(it),Zt=new Ue().fromArray(yt);function lt(Z,j,K,mt){const wt=new Uint8Array(4),gt=i.createTexture();i.bindTexture(Z,gt),i.texParameteri(Z,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(Z,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Wt=0;Wt<K;Wt++)Z===i.TEXTURE_3D||Z===i.TEXTURE_2D_ARRAY?i.texImage3D(j,0,i.RGBA,1,1,mt,0,i.RGBA,i.UNSIGNED_BYTE,wt):i.texImage2D(j+Wt,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,wt);return gt}const W={};W[i.TEXTURE_2D]=lt(i.TEXTURE_2D,i.TEXTURE_2D,1),W[i.TEXTURE_CUBE_MAP]=lt(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),W[i.TEXTURE_2D_ARRAY]=lt(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),W[i.TEXTURE_3D]=lt(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),rt(i.DEPTH_TEST),o.setFunc($r),nt(!1),J(Ih),rt(i.CULL_FACE),z(Oi);function rt(Z){h[Z]!==!0&&(i.enable(Z),h[Z]=!0)}function dt(Z){h[Z]!==!1&&(i.disable(Z),h[Z]=!1)}function Mt(Z,j){return u[Z]!==j?(i.bindFramebuffer(Z,j),u[Z]=j,Z===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=j),Z===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=j),!0):!1}function _t(Z,j){let K=g,mt=!1;if(Z){K=f.get(j),K===void 0&&(K=[],f.set(j,K));const wt=Z.textures;if(K.length!==wt.length||K[0]!==i.COLOR_ATTACHMENT0){for(let gt=0,Wt=wt.length;gt<Wt;gt++)K[gt]=i.COLOR_ATTACHMENT0+gt;K.length=wt.length,mt=!0}}else K[0]!==i.BACK&&(K[0]=i.BACK,mt=!0);mt&&i.drawBuffers(K)}function Tt(Z){return v!==Z?(i.useProgram(Z),v=Z,!0):!1}const kt={[tr]:i.FUNC_ADD,[w0]:i.FUNC_SUBTRACT,[E0]:i.FUNC_REVERSE_SUBTRACT};kt[T0]=i.MIN,kt[A0]=i.MAX;const ct={[C0]:i.ZERO,[R0]:i.ONE,[P0]:i.SRC_COLOR,[Td]:i.SRC_ALPHA,[F0]:i.SRC_ALPHA_SATURATE,[D0]:i.DST_COLOR,[I0]:i.DST_ALPHA,[L0]:i.ONE_MINUS_SRC_COLOR,[Ad]:i.ONE_MINUS_SRC_ALPHA,[U0]:i.ONE_MINUS_DST_COLOR,[N0]:i.ONE_MINUS_DST_ALPHA,[O0]:i.CONSTANT_COLOR,[z0]:i.ONE_MINUS_CONSTANT_COLOR,[B0]:i.CONSTANT_ALPHA,[k0]:i.ONE_MINUS_CONSTANT_ALPHA};function z(Z,j,K,mt,wt,gt,Wt,Nt,de,pe){if(Z===Oi){m===!0&&(dt(i.BLEND),m=!1);return}if(m===!1&&(rt(i.BLEND),m=!0),Z!==b0){if(Z!==p||pe!==L){if((x!==tr||M!==tr)&&(i.blendEquation(i.FUNC_ADD),x=tr,M=tr),pe)switch(Z){case Vr:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Ms:i.blendFunc(i.ONE,i.ONE);break;case Nh:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Dh:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:ge("WebGLState: Invalid blending: ",Z);break}else switch(Z){case Vr:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Ms:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case Nh:ge("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Dh:ge("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:ge("WebGLState: Invalid blending: ",Z);break}w=null,y=null,S=null,C=null,_.set(0,0,0),T=0,p=Z,L=pe}return}wt=wt||j,gt=gt||K,Wt=Wt||mt,(j!==x||wt!==M)&&(i.blendEquationSeparate(kt[j],kt[wt]),x=j,M=wt),(K!==w||mt!==y||gt!==S||Wt!==C)&&(i.blendFuncSeparate(ct[K],ct[mt],ct[gt],ct[Wt]),w=K,y=mt,S=gt,C=Wt),(Nt.equals(_)===!1||de!==T)&&(i.blendColor(Nt.r,Nt.g,Nt.b,de),_.copy(Nt),T=de),p=Z,L=!1}function et(Z,j){Z.side===Ge?dt(i.CULL_FACE):rt(i.CULL_FACE);let K=Z.side===En;j&&(K=!K),nt(K),Z.blending===Vr&&Z.transparent===!1?z(Oi):z(Z.blending,Z.blendEquation,Z.blendSrc,Z.blendDst,Z.blendEquationAlpha,Z.blendSrcAlpha,Z.blendDstAlpha,Z.blendColor,Z.blendAlpha,Z.premultipliedAlpha),o.setFunc(Z.depthFunc),o.setTest(Z.depthTest),o.setMask(Z.depthWrite),r.setMask(Z.colorWrite);const mt=Z.stencilWrite;a.setTest(mt),mt&&(a.setMask(Z.stencilWriteMask),a.setFunc(Z.stencilFunc,Z.stencilRef,Z.stencilFuncMask),a.setOp(Z.stencilFail,Z.stencilZFail,Z.stencilZPass)),Q(Z.polygonOffset,Z.polygonOffsetFactor,Z.polygonOffsetUnits),Z.alphaToCoverage===!0?rt(i.SAMPLE_ALPHA_TO_COVERAGE):dt(i.SAMPLE_ALPHA_TO_COVERAGE)}function nt(Z){I!==Z&&(Z?i.frontFace(i.CW):i.frontFace(i.CCW),I=Z)}function J(Z){Z!==M0?(rt(i.CULL_FACE),Z!==U&&(Z===Ih?i.cullFace(i.BACK):Z===S0?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):dt(i.CULL_FACE),U=Z}function k(Z){Z!==N&&(G&&i.lineWidth(Z),N=Z)}function Q(Z,j,K){Z?(rt(i.POLYGON_OFFSET_FILL),(A!==j||D!==K)&&(A=j,D=K,o.getReversed()&&(j=-j),i.polygonOffset(j,K))):dt(i.POLYGON_OFFSET_FILL)}function ht(Z){Z?rt(i.SCISSOR_TEST):dt(i.SCISSOR_TEST)}function vt(Z){Z===void 0&&(Z=i.TEXTURE0+F-1),q!==Z&&(i.activeTexture(Z),q=Z)}function O(Z,j,K){K===void 0&&(q===null?K=i.TEXTURE0+F-1:K=q);let mt=$[K];mt===void 0&&(mt={type:void 0,texture:void 0},$[K]=mt),(mt.type!==Z||mt.texture!==j)&&(q!==K&&(i.activeTexture(K),q=K),i.bindTexture(Z,j||W[Z]),mt.type=Z,mt.texture=j)}function Rt(){const Z=$[q];Z!==void 0&&Z.type!==void 0&&(i.bindTexture(Z.type,null),Z.type=void 0,Z.texture=void 0)}function At(){try{i.compressedTexImage2D(...arguments)}catch(Z){ge("WebGLState:",Z)}}function P(){try{i.compressedTexImage3D(...arguments)}catch(Z){ge("WebGLState:",Z)}}function b(){try{i.texSubImage2D(...arguments)}catch(Z){ge("WebGLState:",Z)}}function H(){try{i.texSubImage3D(...arguments)}catch(Z){ge("WebGLState:",Z)}}function tt(){try{i.compressedTexSubImage2D(...arguments)}catch(Z){ge("WebGLState:",Z)}}function st(){try{i.compressedTexSubImage3D(...arguments)}catch(Z){ge("WebGLState:",Z)}}function bt(){try{i.texStorage2D(...arguments)}catch(Z){ge("WebGLState:",Z)}}function Ct(){try{i.texStorage3D(...arguments)}catch(Z){ge("WebGLState:",Z)}}function pt(){try{i.texImage2D(...arguments)}catch(Z){ge("WebGLState:",Z)}}function xt(){try{i.texImage3D(...arguments)}catch(Z){ge("WebGLState:",Z)}}function Pt(Z){return d[Z]!==void 0?d[Z]:i.getParameter(Z)}function Ht(Z,j){d[Z]!==j&&(i.pixelStorei(Z,j),d[Z]=j)}function Lt(Z){Ft.equals(Z)===!1&&(i.scissor(Z.x,Z.y,Z.z,Z.w),Ft.copy(Z))}function It(Z){Zt.equals(Z)===!1&&(i.viewport(Z.x,Z.y,Z.z,Z.w),Zt.copy(Z))}function Yt(Z,j){let K=c.get(j);K===void 0&&(K=new WeakMap,c.set(j,K));let mt=K.get(Z);mt===void 0&&(mt=i.getUniformBlockIndex(j,Z.name),K.set(Z,mt))}function ee(Z,j){const mt=c.get(j).get(Z);l.get(j)!==mt&&(i.uniformBlockBinding(j,mt,Z.__bindingPointIndex),l.set(j,mt))}function ie(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),o.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),i.pixelStorei(i.PACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,!1),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,i.BROWSER_DEFAULT_WEBGL),i.pixelStorei(i.PACK_ROW_LENGTH,0),i.pixelStorei(i.PACK_SKIP_PIXELS,0),i.pixelStorei(i.PACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_ROW_LENGTH,0),i.pixelStorei(i.UNPACK_IMAGE_HEIGHT,0),i.pixelStorei(i.UNPACK_SKIP_PIXELS,0),i.pixelStorei(i.UNPACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_SKIP_IMAGES,0),h={},d={},q=null,$={},u={},f=new WeakMap,g=[],v=null,m=!1,p=null,x=null,w=null,y=null,M=null,S=null,C=null,_=new te(0,0,0),T=0,L=!1,I=null,U=null,N=null,A=null,D=null,Ft.set(0,0,i.canvas.width,i.canvas.height),Zt.set(0,0,i.canvas.width,i.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:rt,disable:dt,bindFramebuffer:Mt,drawBuffers:_t,useProgram:Tt,setBlending:z,setMaterial:et,setFlipSided:nt,setCullFace:J,setLineWidth:k,setPolygonOffset:Q,setScissorTest:ht,activeTexture:vt,bindTexture:O,unbindTexture:Rt,compressedTexImage2D:At,compressedTexImage3D:P,texImage2D:pt,texImage3D:xt,pixelStorei:Ht,getParameter:Pt,updateUBOMapping:Yt,uniformBlockBinding:ee,texStorage2D:bt,texStorage3D:Ct,texSubImage2D:b,texSubImage3D:H,compressedTexSubImage2D:tt,compressedTexSubImage3D:st,scissor:Lt,viewport:It,reset:ie}}function CS(i,t,e,n,s,r,o){const a=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Et,h=new WeakMap,d=new Set;let u;const f=new WeakMap;let g=!1;try{g=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function v(P,b){return g?new OffscreenCanvas(P,b):fa("canvas")}function m(P,b,H){let tt=1;const st=At(P);if((st.width>H||st.height>H)&&(tt=H/Math.max(st.width,st.height)),tt<1)if(typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&P instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&P instanceof ImageBitmap||typeof VideoFrame<"u"&&P instanceof VideoFrame){const bt=Math.floor(tt*st.width),Ct=Math.floor(tt*st.height);u===void 0&&(u=v(bt,Ct));const pt=b?v(bt,Ct):u;return pt.width=bt,pt.height=Ct,pt.getContext("2d").drawImage(P,0,0,bt,Ct),ne("WebGLRenderer: Texture has been resized from ("+st.width+"x"+st.height+") to ("+bt+"x"+Ct+")."),pt}else return"data"in P&&ne("WebGLRenderer: Image in DataTexture is too big ("+st.width+"x"+st.height+")."),P;return P}function p(P){return P.generateMipmaps}function x(P){i.generateMipmap(P)}function w(P){return P.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:P.isWebGL3DRenderTarget?i.TEXTURE_3D:P.isWebGLArrayRenderTarget||P.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function y(P,b,H,tt,st,bt=!1){if(P!==null){if(i[P]!==void 0)return i[P];ne("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+P+"'")}let Ct;tt&&(Ct=t.get("EXT_texture_norm16"),Ct||ne("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let pt=b;if(b===i.RED&&(H===i.FLOAT&&(pt=i.R32F),H===i.HALF_FLOAT&&(pt=i.R16F),H===i.UNSIGNED_BYTE&&(pt=i.R8),H===i.UNSIGNED_SHORT&&Ct&&(pt=Ct.R16_EXT),H===i.SHORT&&Ct&&(pt=Ct.R16_SNORM_EXT)),b===i.RED_INTEGER&&(H===i.UNSIGNED_BYTE&&(pt=i.R8UI),H===i.UNSIGNED_SHORT&&(pt=i.R16UI),H===i.UNSIGNED_INT&&(pt=i.R32UI),H===i.BYTE&&(pt=i.R8I),H===i.SHORT&&(pt=i.R16I),H===i.INT&&(pt=i.R32I)),b===i.RG&&(H===i.FLOAT&&(pt=i.RG32F),H===i.HALF_FLOAT&&(pt=i.RG16F),H===i.UNSIGNED_BYTE&&(pt=i.RG8),H===i.UNSIGNED_SHORT&&Ct&&(pt=Ct.RG16_EXT),H===i.SHORT&&Ct&&(pt=Ct.RG16_SNORM_EXT)),b===i.RG_INTEGER&&(H===i.UNSIGNED_BYTE&&(pt=i.RG8UI),H===i.UNSIGNED_SHORT&&(pt=i.RG16UI),H===i.UNSIGNED_INT&&(pt=i.RG32UI),H===i.BYTE&&(pt=i.RG8I),H===i.SHORT&&(pt=i.RG16I),H===i.INT&&(pt=i.RG32I)),b===i.RGB_INTEGER&&(H===i.UNSIGNED_BYTE&&(pt=i.RGB8UI),H===i.UNSIGNED_SHORT&&(pt=i.RGB16UI),H===i.UNSIGNED_INT&&(pt=i.RGB32UI),H===i.BYTE&&(pt=i.RGB8I),H===i.SHORT&&(pt=i.RGB16I),H===i.INT&&(pt=i.RGB32I)),b===i.RGBA_INTEGER&&(H===i.UNSIGNED_BYTE&&(pt=i.RGBA8UI),H===i.UNSIGNED_SHORT&&(pt=i.RGBA16UI),H===i.UNSIGNED_INT&&(pt=i.RGBA32UI),H===i.BYTE&&(pt=i.RGBA8I),H===i.SHORT&&(pt=i.RGBA16I),H===i.INT&&(pt=i.RGBA32I)),b===i.RGB&&(H===i.UNSIGNED_SHORT&&Ct&&(pt=Ct.RGB16_EXT),H===i.SHORT&&Ct&&(pt=Ct.RGB16_SNORM_EXT),H===i.UNSIGNED_INT_5_9_9_9_REV&&(pt=i.RGB9_E5),H===i.UNSIGNED_INT_10F_11F_11F_REV&&(pt=i.R11F_G11F_B10F)),b===i.RGBA){const xt=bt?da:me.getTransfer(st);H===i.FLOAT&&(pt=i.RGBA32F),H===i.HALF_FLOAT&&(pt=i.RGBA16F),H===i.UNSIGNED_BYTE&&(pt=xt===be?i.SRGB8_ALPHA8:i.RGBA8),H===i.UNSIGNED_SHORT&&Ct&&(pt=Ct.RGBA16_EXT),H===i.SHORT&&Ct&&(pt=Ct.RGBA16_SNORM_EXT),H===i.UNSIGNED_SHORT_4_4_4_4&&(pt=i.RGBA4),H===i.UNSIGNED_SHORT_5_5_5_1&&(pt=i.RGB5_A1)}return(pt===i.R16F||pt===i.R32F||pt===i.RG16F||pt===i.RG32F||pt===i.RGBA16F||pt===i.RGBA32F)&&t.get("EXT_color_buffer_float"),pt}function M(P,b){let H;return P?b===null||b===mi||b===jr?H=i.DEPTH24_STENCIL8:b===Zn?H=i.DEPTH32F_STENCIL8:b===Jr&&(H=i.DEPTH24_STENCIL8,ne("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):b===null||b===mi||b===jr?H=i.DEPTH_COMPONENT24:b===Zn?H=i.DEPTH_COMPONENT32F:b===Jr&&(H=i.DEPTH_COMPONENT16),H}function S(P,b){return p(P)===!0||P.isFramebufferTexture&&P.minFilter!==en&&P.minFilter!==dn?Math.log2(Math.max(b.width,b.height))+1:P.mipmaps!==void 0&&P.mipmaps.length>0?P.mipmaps.length:P.isCompressedTexture&&Array.isArray(P.image)?b.mipmaps.length:1}function C(P){const b=P.target;b.removeEventListener("dispose",C),T(b),b.isVideoTexture&&h.delete(b),b.isHTMLTexture&&d.delete(b)}function _(P){const b=P.target;b.removeEventListener("dispose",_),I(b)}function T(P){const b=n.get(P);if(b.__webglInit===void 0)return;const H=P.source,tt=f.get(H);if(tt){const st=tt[b.__cacheKey];st.usedTimes--,st.usedTimes===0&&L(P),Object.keys(tt).length===0&&f.delete(H)}n.remove(P)}function L(P){const b=n.get(P);i.deleteTexture(b.__webglTexture);const H=P.source,tt=f.get(H);delete tt[b.__cacheKey],o.memory.textures--}function I(P){const b=n.get(P);if(P.depthTexture&&(P.depthTexture.dispose(),n.remove(P.depthTexture)),P.isWebGLCubeRenderTarget)for(let tt=0;tt<6;tt++){if(Array.isArray(b.__webglFramebuffer[tt]))for(let st=0;st<b.__webglFramebuffer[tt].length;st++)i.deleteFramebuffer(b.__webglFramebuffer[tt][st]);else i.deleteFramebuffer(b.__webglFramebuffer[tt]);b.__webglDepthbuffer&&i.deleteRenderbuffer(b.__webglDepthbuffer[tt])}else{if(Array.isArray(b.__webglFramebuffer))for(let tt=0;tt<b.__webglFramebuffer.length;tt++)i.deleteFramebuffer(b.__webglFramebuffer[tt]);else i.deleteFramebuffer(b.__webglFramebuffer);if(b.__webglDepthbuffer&&i.deleteRenderbuffer(b.__webglDepthbuffer),b.__webglMultisampledFramebuffer&&i.deleteFramebuffer(b.__webglMultisampledFramebuffer),b.__webglColorRenderbuffer)for(let tt=0;tt<b.__webglColorRenderbuffer.length;tt++)b.__webglColorRenderbuffer[tt]&&i.deleteRenderbuffer(b.__webglColorRenderbuffer[tt]);b.__webglDepthRenderbuffer&&i.deleteRenderbuffer(b.__webglDepthRenderbuffer)}const H=P.textures;for(let tt=0,st=H.length;tt<st;tt++){const bt=n.get(H[tt]);bt.__webglTexture&&(i.deleteTexture(bt.__webglTexture),o.memory.textures--),n.remove(H[tt])}n.remove(P)}let U=0;function N(){U=0}function A(){return U}function D(P){U=P}function F(){const P=U;return P>=s.maxTextures&&ne("WebGLTextures: Trying to use "+(P+1)+" texture units while this GPU supports only "+s.maxTextures),U+=1,P}function G(P){const b=[];return b.push(P.wrapS),b.push(P.wrapT),b.push(P.wrapR||0),b.push(P.magFilter),b.push(P.minFilter),b.push(P.anisotropy),b.push(P.internalFormat),b.push(P.format),b.push(P.type),b.push(P.generateMipmaps),b.push(P.premultiplyAlpha),b.push(P.flipY),b.push(P.unpackAlignment),b.push(P.colorSpace),b.join()}function Y(P,b){const H=n.get(P);if(P.isVideoTexture&&O(P),P.isRenderTargetTexture===!1&&P.isExternalTexture!==!0&&P.version>0&&H.__version!==P.version){const tt=P.image;if(tt===null)ne("WebGLRenderer: Texture marked for update but no image data found.");else if(tt.complete===!1)ne("WebGLRenderer: Texture marked for update but image is incomplete");else{dt(H,P,b);return}}else P.isExternalTexture&&(H.__webglTexture=P.sourceTexture?P.sourceTexture:null);e.bindTexture(i.TEXTURE_2D,H.__webglTexture,i.TEXTURE0+b)}function V(P,b){const H=n.get(P);if(P.isRenderTargetTexture===!1&&P.version>0&&H.__version!==P.version){dt(H,P,b);return}else P.isExternalTexture&&(H.__webglTexture=P.sourceTexture?P.sourceTexture:null);e.bindTexture(i.TEXTURE_2D_ARRAY,H.__webglTexture,i.TEXTURE0+b)}function q(P,b){const H=n.get(P);if(P.isRenderTargetTexture===!1&&P.version>0&&H.__version!==P.version){dt(H,P,b);return}e.bindTexture(i.TEXTURE_3D,H.__webglTexture,i.TEXTURE0+b)}function $(P,b){const H=n.get(P);if(P.isCubeDepthTexture!==!0&&P.version>0&&H.__version!==P.version){Mt(H,P,b);return}e.bindTexture(i.TEXTURE_CUBE_MAP,H.__webglTexture,i.TEXTURE0+b)}const it={[Ul]:i.REPEAT,[Ni]:i.CLAMP_TO_EDGE,[Fl]:i.MIRRORED_REPEAT},yt={[en]:i.NEAREST,[H0]:i.NEAREST_MIPMAP_NEAREST,[vo]:i.NEAREST_MIPMAP_LINEAR,[dn]:i.LINEAR,[qa]:i.LINEAR_MIPMAP_NEAREST,[xs]:i.LINEAR_MIPMAP_LINEAR},Ft={[Y0]:i.NEVER,[j0]:i.ALWAYS,[Z0]:i.LESS,[Oc]:i.LEQUAL,[K0]:i.EQUAL,[zc]:i.GEQUAL,[$0]:i.GREATER,[J0]:i.NOTEQUAL};function Zt(P,b){if(b.type===Zn&&t.has("OES_texture_float_linear")===!1&&(b.magFilter===dn||b.magFilter===qa||b.magFilter===vo||b.magFilter===xs||b.minFilter===dn||b.minFilter===qa||b.minFilter===vo||b.minFilter===xs)&&ne("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(P,i.TEXTURE_WRAP_S,it[b.wrapS]),i.texParameteri(P,i.TEXTURE_WRAP_T,it[b.wrapT]),(P===i.TEXTURE_3D||P===i.TEXTURE_2D_ARRAY)&&i.texParameteri(P,i.TEXTURE_WRAP_R,it[b.wrapR]),i.texParameteri(P,i.TEXTURE_MAG_FILTER,yt[b.magFilter]),i.texParameteri(P,i.TEXTURE_MIN_FILTER,yt[b.minFilter]),b.compareFunction&&(i.texParameteri(P,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(P,i.TEXTURE_COMPARE_FUNC,Ft[b.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(b.magFilter===en||b.minFilter!==vo&&b.minFilter!==xs||b.type===Zn&&t.has("OES_texture_float_linear")===!1)return;if(b.anisotropy>1||n.get(b).__currentAnisotropy){const H=t.get("EXT_texture_filter_anisotropic");i.texParameterf(P,H.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(b.anisotropy,s.getMaxAnisotropy())),n.get(b).__currentAnisotropy=b.anisotropy}}}function lt(P,b){let H=!1;P.__webglInit===void 0&&(P.__webglInit=!0,b.addEventListener("dispose",C));const tt=b.source;let st=f.get(tt);st===void 0&&(st={},f.set(tt,st));const bt=G(b);if(bt!==P.__cacheKey){st[bt]===void 0&&(st[bt]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,H=!0),st[bt].usedTimes++;const Ct=st[P.__cacheKey];Ct!==void 0&&(st[P.__cacheKey].usedTimes--,Ct.usedTimes===0&&L(b)),P.__cacheKey=bt,P.__webglTexture=st[bt].texture}return H}function W(P,b,H){return Math.floor(Math.floor(P/H)/b)}function rt(P,b,H,tt){const bt=P.updateRanges;if(bt.length===0)e.texSubImage2D(i.TEXTURE_2D,0,0,0,b.width,b.height,H,tt,b.data);else{bt.sort((Ht,Lt)=>Ht.start-Lt.start);let Ct=0;for(let Ht=1;Ht<bt.length;Ht++){const Lt=bt[Ct],It=bt[Ht],Yt=Lt.start+Lt.count,ee=W(It.start,b.width,4),ie=W(Lt.start,b.width,4);It.start<=Yt+1&&ee===ie&&W(It.start+It.count-1,b.width,4)===ee?Lt.count=Math.max(Lt.count,It.start+It.count-Lt.start):(++Ct,bt[Ct]=It)}bt.length=Ct+1;const pt=e.getParameter(i.UNPACK_ROW_LENGTH),xt=e.getParameter(i.UNPACK_SKIP_PIXELS),Pt=e.getParameter(i.UNPACK_SKIP_ROWS);e.pixelStorei(i.UNPACK_ROW_LENGTH,b.width);for(let Ht=0,Lt=bt.length;Ht<Lt;Ht++){const It=bt[Ht],Yt=Math.floor(It.start/4),ee=Math.ceil(It.count/4),ie=Yt%b.width,Z=Math.floor(Yt/b.width),j=ee,K=1;e.pixelStorei(i.UNPACK_SKIP_PIXELS,ie),e.pixelStorei(i.UNPACK_SKIP_ROWS,Z),e.texSubImage2D(i.TEXTURE_2D,0,ie,Z,j,K,H,tt,b.data)}P.clearUpdateRanges(),e.pixelStorei(i.UNPACK_ROW_LENGTH,pt),e.pixelStorei(i.UNPACK_SKIP_PIXELS,xt),e.pixelStorei(i.UNPACK_SKIP_ROWS,Pt)}}function dt(P,b,H){let tt=i.TEXTURE_2D;(b.isDataArrayTexture||b.isCompressedArrayTexture)&&(tt=i.TEXTURE_2D_ARRAY),b.isData3DTexture&&(tt=i.TEXTURE_3D);const st=lt(P,b),bt=b.source;e.bindTexture(tt,P.__webglTexture,i.TEXTURE0+H);const Ct=n.get(bt);if(bt.version!==Ct.__version||st===!0){if(e.activeTexture(i.TEXTURE0+H),(typeof ImageBitmap<"u"&&b.image instanceof ImageBitmap)===!1){const K=me.getPrimaries(me.workingColorSpace),mt=b.colorSpace===ss?null:me.getPrimaries(b.colorSpace),wt=b.colorSpace===ss||K===mt?i.NONE:i.BROWSER_DEFAULT_WEBGL;e.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,b.flipY),e.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),e.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,wt)}e.pixelStorei(i.UNPACK_ALIGNMENT,b.unpackAlignment);let xt=m(b.image,!1,s.maxTextureSize);xt=Rt(b,xt);const Pt=r.convert(b.format,b.colorSpace),Ht=r.convert(b.type);let Lt=y(b.internalFormat,Pt,Ht,b.normalized,b.colorSpace,b.isVideoTexture);Zt(tt,b);let It;const Yt=b.mipmaps,ee=b.isVideoTexture!==!0,ie=Ct.__version===void 0||st===!0,Z=bt.dataReady,j=S(b,xt);if(b.isDepthTexture)Lt=M(b.format===_s,b.type),ie&&(ee?e.texStorage2D(i.TEXTURE_2D,1,Lt,xt.width,xt.height):e.texImage2D(i.TEXTURE_2D,0,Lt,xt.width,xt.height,0,Pt,Ht,null));else if(b.isDataTexture)if(Yt.length>0){ee&&ie&&e.texStorage2D(i.TEXTURE_2D,j,Lt,Yt[0].width,Yt[0].height);for(let K=0,mt=Yt.length;K<mt;K++)It=Yt[K],ee?Z&&e.texSubImage2D(i.TEXTURE_2D,K,0,0,It.width,It.height,Pt,Ht,It.data):e.texImage2D(i.TEXTURE_2D,K,Lt,It.width,It.height,0,Pt,Ht,It.data);b.generateMipmaps=!1}else ee?(ie&&e.texStorage2D(i.TEXTURE_2D,j,Lt,xt.width,xt.height),Z&&rt(b,xt,Pt,Ht)):e.texImage2D(i.TEXTURE_2D,0,Lt,xt.width,xt.height,0,Pt,Ht,xt.data);else if(b.isCompressedTexture)if(b.isCompressedArrayTexture){ee&&ie&&e.texStorage3D(i.TEXTURE_2D_ARRAY,j,Lt,Yt[0].width,Yt[0].height,xt.depth);for(let K=0,mt=Yt.length;K<mt;K++)if(It=Yt[K],b.format!==Kn)if(Pt!==null)if(ee){if(Z)if(b.layerUpdates.size>0){const wt=_u(It.width,It.height,b.format,b.type);for(const gt of b.layerUpdates){const Wt=It.data.subarray(gt*wt/It.data.BYTES_PER_ELEMENT,(gt+1)*wt/It.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,K,0,0,gt,It.width,It.height,1,Pt,Wt)}}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,K,0,0,0,It.width,It.height,xt.depth,Pt,It.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,K,Lt,It.width,It.height,xt.depth,0,It.data,0,0);else ne("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else ee?Z&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,K,0,0,0,It.width,It.height,xt.depth,Pt,Ht,It.data):e.texImage3D(i.TEXTURE_2D_ARRAY,K,Lt,It.width,It.height,xt.depth,0,Pt,Ht,It.data);b.layerUpdates.size>0&&b.clearLayerUpdates()}else{ee&&ie&&e.texStorage2D(i.TEXTURE_2D,j,Lt,Yt[0].width,Yt[0].height);for(let K=0,mt=Yt.length;K<mt;K++)It=Yt[K],b.format!==Kn?Pt!==null?ee?Z&&e.compressedTexSubImage2D(i.TEXTURE_2D,K,0,0,It.width,It.height,Pt,It.data):e.compressedTexImage2D(i.TEXTURE_2D,K,Lt,It.width,It.height,0,It.data):ne("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):ee?Z&&e.texSubImage2D(i.TEXTURE_2D,K,0,0,It.width,It.height,Pt,Ht,It.data):e.texImage2D(i.TEXTURE_2D,K,Lt,It.width,It.height,0,Pt,Ht,It.data)}else if(b.isDataArrayTexture)if(ee){if(ie&&e.texStorage3D(i.TEXTURE_2D_ARRAY,j,Lt,xt.width,xt.height,xt.depth),Z)if(b.layerUpdates.size>0){const K=_u(xt.width,xt.height,b.format,b.type);for(const mt of b.layerUpdates){const wt=xt.data.subarray(mt*K/xt.data.BYTES_PER_ELEMENT,(mt+1)*K/xt.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,mt,xt.width,xt.height,1,Pt,Ht,wt)}b.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,xt.width,xt.height,xt.depth,Pt,Ht,xt.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,Lt,xt.width,xt.height,xt.depth,0,Pt,Ht,xt.data);else if(b.isData3DTexture)ee?(ie&&e.texStorage3D(i.TEXTURE_3D,j,Lt,xt.width,xt.height,xt.depth),Z&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,xt.width,xt.height,xt.depth,Pt,Ht,xt.data)):e.texImage3D(i.TEXTURE_3D,0,Lt,xt.width,xt.height,xt.depth,0,Pt,Ht,xt.data);else if(b.isFramebufferTexture){if(ie)if(ee)e.texStorage2D(i.TEXTURE_2D,j,Lt,xt.width,xt.height);else{let K=xt.width,mt=xt.height;for(let wt=0;wt<j;wt++)e.texImage2D(i.TEXTURE_2D,wt,Lt,K,mt,0,Pt,Ht,null),K>>=1,mt>>=1}}else if(b.isHTMLTexture){if("texElementImage2D"in i){const K=i.canvas;if(K.hasAttribute("layoutsubtree")||K.setAttribute("layoutsubtree","true"),xt.parentNode!==K){K.appendChild(xt),d.add(b),K.onpaint=mt=>{const wt=mt.changedElements;for(const gt of d)wt.includes(gt.image)&&(gt.needsUpdate=!0)},K.requestPaint();return}if(i.texElementImage2D.length===3)i.texElementImage2D(i.TEXTURE_2D,i.RGBA8,xt);else{const wt=i.RGBA,gt=i.RGBA,Wt=i.UNSIGNED_BYTE;i.texElementImage2D(i.TEXTURE_2D,0,wt,gt,Wt,xt)}i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE)}}else if(Yt.length>0){if(ee&&ie){const K=At(Yt[0]);e.texStorage2D(i.TEXTURE_2D,j,Lt,K.width,K.height)}for(let K=0,mt=Yt.length;K<mt;K++)It=Yt[K],ee?Z&&e.texSubImage2D(i.TEXTURE_2D,K,0,0,Pt,Ht,It):e.texImage2D(i.TEXTURE_2D,K,Lt,Pt,Ht,It);b.generateMipmaps=!1}else if(ee){if(ie){const K=At(xt);e.texStorage2D(i.TEXTURE_2D,j,Lt,K.width,K.height)}Z&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,Pt,Ht,xt)}else e.texImage2D(i.TEXTURE_2D,0,Lt,Pt,Ht,xt);p(b)&&x(tt),Ct.__version=bt.version,b.onUpdate&&b.onUpdate(b)}P.__version=b.version}function Mt(P,b,H){if(b.image.length!==6)return;const tt=lt(P,b),st=b.source;e.bindTexture(i.TEXTURE_CUBE_MAP,P.__webglTexture,i.TEXTURE0+H);const bt=n.get(st);if(st.version!==bt.__version||tt===!0){e.activeTexture(i.TEXTURE0+H);const Ct=me.getPrimaries(me.workingColorSpace),pt=b.colorSpace===ss?null:me.getPrimaries(b.colorSpace),xt=b.colorSpace===ss||Ct===pt?i.NONE:i.BROWSER_DEFAULT_WEBGL;e.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,b.flipY),e.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),e.pixelStorei(i.UNPACK_ALIGNMENT,b.unpackAlignment),e.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,xt);const Pt=b.isCompressedTexture||b.image[0].isCompressedTexture,Ht=b.image[0]&&b.image[0].isDataTexture,Lt=[];for(let gt=0;gt<6;gt++)!Pt&&!Ht?Lt[gt]=m(b.image[gt],!0,s.maxCubemapSize):Lt[gt]=Ht?b.image[gt].image:b.image[gt],Lt[gt]=Rt(b,Lt[gt]);const It=Lt[0],Yt=r.convert(b.format,b.colorSpace),ee=r.convert(b.type),ie=y(b.internalFormat,Yt,ee,b.normalized,b.colorSpace),Z=b.isVideoTexture!==!0,j=bt.__version===void 0||tt===!0,K=st.dataReady;let mt=S(b,It);Zt(i.TEXTURE_CUBE_MAP,b);let wt;if(Pt){Z&&j&&e.texStorage2D(i.TEXTURE_CUBE_MAP,mt,ie,It.width,It.height);for(let gt=0;gt<6;gt++){wt=Lt[gt].mipmaps;for(let Wt=0;Wt<wt.length;Wt++){const Nt=wt[Wt];b.format!==Kn?Yt!==null?Z?K&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+gt,Wt,0,0,Nt.width,Nt.height,Yt,Nt.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+gt,Wt,ie,Nt.width,Nt.height,0,Nt.data):ne("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Z?K&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+gt,Wt,0,0,Nt.width,Nt.height,Yt,ee,Nt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+gt,Wt,ie,Nt.width,Nt.height,0,Yt,ee,Nt.data)}}}else{if(wt=b.mipmaps,Z&&j){wt.length>0&&mt++;const gt=At(Lt[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,mt,ie,gt.width,gt.height)}for(let gt=0;gt<6;gt++)if(Ht){Z?K&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+gt,0,0,0,Lt[gt].width,Lt[gt].height,Yt,ee,Lt[gt].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+gt,0,ie,Lt[gt].width,Lt[gt].height,0,Yt,ee,Lt[gt].data);for(let Wt=0;Wt<wt.length;Wt++){const de=wt[Wt].image[gt].image;Z?K&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+gt,Wt+1,0,0,de.width,de.height,Yt,ee,de.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+gt,Wt+1,ie,de.width,de.height,0,Yt,ee,de.data)}}else{Z?K&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+gt,0,0,0,Yt,ee,Lt[gt]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+gt,0,ie,Yt,ee,Lt[gt]);for(let Wt=0;Wt<wt.length;Wt++){const Nt=wt[Wt];Z?K&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+gt,Wt+1,0,0,Yt,ee,Nt.image[gt]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+gt,Wt+1,ie,Yt,ee,Nt.image[gt])}}}p(b)&&x(i.TEXTURE_CUBE_MAP),bt.__version=st.version,b.onUpdate&&b.onUpdate(b)}P.__version=b.version}function _t(P,b,H,tt,st,bt){const Ct=r.convert(H.format,H.colorSpace),pt=r.convert(H.type),xt=y(H.internalFormat,Ct,pt,H.normalized,H.colorSpace),Pt=n.get(b),Ht=n.get(H);if(Ht.__renderTarget=b,!Pt.__hasExternalTextures){const Lt=Math.max(1,b.width>>bt),It=Math.max(1,b.height>>bt);st===i.TEXTURE_3D||st===i.TEXTURE_2D_ARRAY?e.texImage3D(st,bt,xt,Lt,It,b.depth,0,Ct,pt,null):e.texImage2D(st,bt,xt,Lt,It,0,Ct,pt,null)}e.bindFramebuffer(i.FRAMEBUFFER,P),vt(b)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,tt,st,Ht.__webglTexture,0,ht(b)):(st===i.TEXTURE_2D||st>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&st<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,tt,st,Ht.__webglTexture,bt),e.bindFramebuffer(i.FRAMEBUFFER,null)}function Tt(P,b,H){if(i.bindRenderbuffer(i.RENDERBUFFER,P),b.depthBuffer){const tt=b.depthTexture,st=tt&&tt.isDepthTexture?tt.type:null,bt=M(b.stencilBuffer,st),Ct=b.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;vt(b)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ht(b),bt,b.width,b.height):H?i.renderbufferStorageMultisample(i.RENDERBUFFER,ht(b),bt,b.width,b.height):i.renderbufferStorage(i.RENDERBUFFER,bt,b.width,b.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,Ct,i.RENDERBUFFER,P)}else{const tt=b.textures;for(let st=0;st<tt.length;st++){const bt=tt[st],Ct=r.convert(bt.format,bt.colorSpace),pt=r.convert(bt.type),xt=y(bt.internalFormat,Ct,pt,bt.normalized,bt.colorSpace);vt(b)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ht(b),xt,b.width,b.height):H?i.renderbufferStorageMultisample(i.RENDERBUFFER,ht(b),xt,b.width,b.height):i.renderbufferStorage(i.RENDERBUFFER,xt,b.width,b.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function kt(P,b,H){const tt=b.isWebGLCubeRenderTarget===!0;if(e.bindFramebuffer(i.FRAMEBUFFER,P),!(b.depthTexture&&b.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");const st=n.get(b.depthTexture);if(st.__renderTarget=b,(!st.__webglTexture||b.depthTexture.image.width!==b.width||b.depthTexture.image.height!==b.height)&&(b.depthTexture.image.width=b.width,b.depthTexture.image.height=b.height,b.depthTexture.needsUpdate=!0),tt){if(st.__webglInit===void 0&&(st.__webglInit=!0,b.depthTexture.addEventListener("dispose",C)),st.__webglTexture===void 0){st.__webglTexture=i.createTexture(),e.bindTexture(i.TEXTURE_CUBE_MAP,st.__webglTexture),Zt(i.TEXTURE_CUBE_MAP,b.depthTexture);const Pt=r.convert(b.depthTexture.format),Ht=r.convert(b.depthTexture.type);let Lt;b.depthTexture.format===ki?Lt=i.DEPTH_COMPONENT24:b.depthTexture.format===_s&&(Lt=i.DEPTH24_STENCIL8);for(let It=0;It<6;It++)i.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+It,0,Lt,b.width,b.height,0,Pt,Ht,null)}}else Y(b.depthTexture,0);const bt=st.__webglTexture,Ct=ht(b),pt=tt?i.TEXTURE_CUBE_MAP_POSITIVE_X+H:i.TEXTURE_2D,xt=b.depthTexture.format===_s?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;if(b.depthTexture.format===ki)vt(b)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,xt,pt,bt,0,Ct):i.framebufferTexture2D(i.FRAMEBUFFER,xt,pt,bt,0);else if(b.depthTexture.format===_s)vt(b)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,xt,pt,bt,0,Ct):i.framebufferTexture2D(i.FRAMEBUFFER,xt,pt,bt,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function ct(P){const b=n.get(P),H=P.isWebGLCubeRenderTarget===!0;if(b.__boundDepthTexture!==P.depthTexture){const tt=P.depthTexture;if(b.__depthDisposeCallback&&b.__depthDisposeCallback(),tt){const st=()=>{delete b.__boundDepthTexture,delete b.__depthDisposeCallback,tt.removeEventListener("dispose",st)};tt.addEventListener("dispose",st),b.__depthDisposeCallback=st}b.__boundDepthTexture=tt}if(P.depthTexture&&!b.__autoAllocateDepthBuffer)if(H)for(let tt=0;tt<6;tt++)kt(b.__webglFramebuffer[tt],P,tt);else{const tt=P.texture.mipmaps;tt&&tt.length>0?kt(b.__webglFramebuffer[0],P,0):kt(b.__webglFramebuffer,P,0)}else if(H){b.__webglDepthbuffer=[];for(let tt=0;tt<6;tt++)if(e.bindFramebuffer(i.FRAMEBUFFER,b.__webglFramebuffer[tt]),b.__webglDepthbuffer[tt]===void 0)b.__webglDepthbuffer[tt]=i.createRenderbuffer(),Tt(b.__webglDepthbuffer[tt],P,!1);else{const st=P.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,bt=b.__webglDepthbuffer[tt];i.bindRenderbuffer(i.RENDERBUFFER,bt),i.framebufferRenderbuffer(i.FRAMEBUFFER,st,i.RENDERBUFFER,bt)}}else{const tt=P.texture.mipmaps;if(tt&&tt.length>0?e.bindFramebuffer(i.FRAMEBUFFER,b.__webglFramebuffer[0]):e.bindFramebuffer(i.FRAMEBUFFER,b.__webglFramebuffer),b.__webglDepthbuffer===void 0)b.__webglDepthbuffer=i.createRenderbuffer(),Tt(b.__webglDepthbuffer,P,!1);else{const st=P.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,bt=b.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,bt),i.framebufferRenderbuffer(i.FRAMEBUFFER,st,i.RENDERBUFFER,bt)}}e.bindFramebuffer(i.FRAMEBUFFER,null)}function z(P,b,H){const tt=n.get(P);b!==void 0&&_t(tt.__webglFramebuffer,P,P.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),H!==void 0&&ct(P)}function et(P){const b=P.texture,H=n.get(P),tt=n.get(b);P.addEventListener("dispose",_);const st=P.textures,bt=P.isWebGLCubeRenderTarget===!0,Ct=st.length>1;if(Ct||(tt.__webglTexture===void 0&&(tt.__webglTexture=i.createTexture()),tt.__version=b.version,o.memory.textures++),bt){H.__webglFramebuffer=[];for(let pt=0;pt<6;pt++)if(b.mipmaps&&b.mipmaps.length>0){H.__webglFramebuffer[pt]=[];for(let xt=0;xt<b.mipmaps.length;xt++)H.__webglFramebuffer[pt][xt]=i.createFramebuffer()}else H.__webglFramebuffer[pt]=i.createFramebuffer()}else{if(b.mipmaps&&b.mipmaps.length>0){H.__webglFramebuffer=[];for(let pt=0;pt<b.mipmaps.length;pt++)H.__webglFramebuffer[pt]=i.createFramebuffer()}else H.__webglFramebuffer=i.createFramebuffer();if(Ct)for(let pt=0,xt=st.length;pt<xt;pt++){const Pt=n.get(st[pt]);Pt.__webglTexture===void 0&&(Pt.__webglTexture=i.createTexture(),o.memory.textures++)}if(P.samples>0&&vt(P)===!1){H.__webglMultisampledFramebuffer=i.createFramebuffer(),H.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,H.__webglMultisampledFramebuffer);for(let pt=0;pt<st.length;pt++){const xt=st[pt];H.__webglColorRenderbuffer[pt]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,H.__webglColorRenderbuffer[pt]);const Pt=r.convert(xt.format,xt.colorSpace),Ht=r.convert(xt.type),Lt=y(xt.internalFormat,Pt,Ht,xt.normalized,xt.colorSpace,P.isXRRenderTarget===!0),It=ht(P);i.renderbufferStorageMultisample(i.RENDERBUFFER,It,Lt,P.width,P.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+pt,i.RENDERBUFFER,H.__webglColorRenderbuffer[pt])}i.bindRenderbuffer(i.RENDERBUFFER,null),P.depthBuffer&&(H.__webglDepthRenderbuffer=i.createRenderbuffer(),Tt(H.__webglDepthRenderbuffer,P,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(bt){e.bindTexture(i.TEXTURE_CUBE_MAP,tt.__webglTexture),Zt(i.TEXTURE_CUBE_MAP,b);for(let pt=0;pt<6;pt++)if(b.mipmaps&&b.mipmaps.length>0)for(let xt=0;xt<b.mipmaps.length;xt++)_t(H.__webglFramebuffer[pt][xt],P,b,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+pt,xt);else _t(H.__webglFramebuffer[pt],P,b,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+pt,0);p(b)&&x(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(Ct){for(let pt=0,xt=st.length;pt<xt;pt++){const Pt=st[pt],Ht=n.get(Pt);let Lt=i.TEXTURE_2D;(P.isWebGL3DRenderTarget||P.isWebGLArrayRenderTarget)&&(Lt=P.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(Lt,Ht.__webglTexture),Zt(Lt,Pt),_t(H.__webglFramebuffer,P,Pt,i.COLOR_ATTACHMENT0+pt,Lt,0),p(Pt)&&x(Lt)}e.unbindTexture()}else{let pt=i.TEXTURE_2D;if((P.isWebGL3DRenderTarget||P.isWebGLArrayRenderTarget)&&(pt=P.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(pt,tt.__webglTexture),Zt(pt,b),b.mipmaps&&b.mipmaps.length>0)for(let xt=0;xt<b.mipmaps.length;xt++)_t(H.__webglFramebuffer[xt],P,b,i.COLOR_ATTACHMENT0,pt,xt);else _t(H.__webglFramebuffer,P,b,i.COLOR_ATTACHMENT0,pt,0);p(b)&&x(pt),e.unbindTexture()}P.depthBuffer&&ct(P)}function nt(P){const b=P.textures;for(let H=0,tt=b.length;H<tt;H++){const st=b[H];if(p(st)){const bt=w(P),Ct=n.get(st).__webglTexture;e.bindTexture(bt,Ct),x(bt),e.unbindTexture()}}}const J=[],k=[];function Q(P){if(P.samples>0){if(vt(P)===!1){const b=P.textures,H=P.width,tt=P.height;let st=i.COLOR_BUFFER_BIT;const bt=P.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Ct=n.get(P),pt=b.length>1;if(pt)for(let Pt=0;Pt<b.length;Pt++)e.bindFramebuffer(i.FRAMEBUFFER,Ct.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Pt,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,Ct.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Pt,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,Ct.__webglMultisampledFramebuffer);const xt=P.texture.mipmaps;xt&&xt.length>0?e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Ct.__webglFramebuffer[0]):e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Ct.__webglFramebuffer);for(let Pt=0;Pt<b.length;Pt++){if(P.resolveDepthBuffer&&(P.depthBuffer&&(st|=i.DEPTH_BUFFER_BIT),P.stencilBuffer&&P.resolveStencilBuffer&&(st|=i.STENCIL_BUFFER_BIT)),pt){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,Ct.__webglColorRenderbuffer[Pt]);const Ht=n.get(b[Pt]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,Ht,0)}i.blitFramebuffer(0,0,H,tt,0,0,H,tt,st,i.NEAREST),l===!0&&(J.length=0,k.length=0,J.push(i.COLOR_ATTACHMENT0+Pt),P.depthBuffer&&P.storeMultisampledDepthBuffer===!1&&(J.push(bt),k.push(bt),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,k)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,J))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),pt)for(let Pt=0;Pt<b.length;Pt++){e.bindFramebuffer(i.FRAMEBUFFER,Ct.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Pt,i.RENDERBUFFER,Ct.__webglColorRenderbuffer[Pt]);const Ht=n.get(b[Pt]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,Ct.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Pt,i.TEXTURE_2D,Ht,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Ct.__webglMultisampledFramebuffer)}else if(P.depthBuffer&&P.storeMultisampledDepthBuffer===!1&&l){const b=P.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[b])}}}function ht(P){return Math.min(s.maxSamples,P.samples)}function vt(P){const b=n.get(P);return P.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&b.__useRenderToTexture!==!1}function O(P){const b=o.render.frame;h.get(P)!==b&&(h.set(P,b),P.update())}function Rt(P,b){const H=P.colorSpace,tt=P.format,st=P.type;return P.isCompressedTexture===!0||P.isVideoTexture===!0||H!==ua&&H!==ss&&(me.getTransfer(H)===be?(tt!==Kn||st!==Nn)&&ne("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):ge("WebGLTextures: Unsupported texture color space:",H)),b}function At(P){return typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement?(c.width=P.naturalWidth||P.width,c.height=P.naturalHeight||P.height):typeof VideoFrame<"u"&&P instanceof VideoFrame?(c.width=P.displayWidth,c.height=P.displayHeight):(c.width=P.width,c.height=P.height),c}this.allocateTextureUnit=F,this.resetTextureUnits=N,this.getTextureUnits=A,this.setTextureUnits=D,this.setTexture2D=Y,this.setTexture2DArray=V,this.setTexture3D=q,this.setTextureCube=$,this.rebindTextures=z,this.setupRenderTarget=et,this.updateRenderTargetMipmap=nt,this.updateMultisampleRenderTarget=Q,this.setupDepthRenderbuffer=ct,this.setupFrameBufferTexture=_t,this.useMultisampledRTT=vt,this.isReversedDepthBuffer=function(){return e.buffers.depth.getReversed()}}function RS(i,t){function e(n,s=ss){let r;const o=me.getTransfer(s);if(n===Nn)return i.UNSIGNED_BYTE;if(n===Ic)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Nc)return i.UNSIGNED_SHORT_5_5_5_1;if(n===zd)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Bd)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===Fd)return i.BYTE;if(n===Od)return i.SHORT;if(n===Jr)return i.UNSIGNED_SHORT;if(n===Lc)return i.INT;if(n===mi)return i.UNSIGNED_INT;if(n===Zn)return i.FLOAT;if(n===gi)return i.HALF_FLOAT;if(n===kd)return i.ALPHA;if(n===Gd)return i.RGB;if(n===Kn)return i.RGBA;if(n===ki)return i.DEPTH_COMPONENT;if(n===_s)return i.DEPTH_STENCIL;if(n===Ea)return i.RED;if(n===Dc)return i.RED_INTEGER;if(n===Ts)return i.RG;if(n===Uc)return i.RG_INTEGER;if(n===Fc)return i.RGBA_INTEGER;if(n===Jo||n===jo||n===Qo||n===ta)if(o===be)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Jo)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===jo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Qo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===ta)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Jo)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===jo)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Qo)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===ta)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Ol||n===zl||n===Bl||n===kl)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Ol)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===zl)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Bl)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===kl)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Gl||n===Vl||n===Hl||n===Wl||n===ql||n===la||n===Xl)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Gl||n===Vl)return o===be?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Hl)return o===be?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(n===Wl)return r.COMPRESSED_R11_EAC;if(n===ql)return r.COMPRESSED_SIGNED_R11_EAC;if(n===la)return r.COMPRESSED_RG11_EAC;if(n===Xl)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===Yl||n===Zl||n===Kl||n===$l||n===Jl||n===jl||n===Ql||n===tc||n===ec||n===nc||n===ic||n===sc||n===rc||n===oc)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Yl)return o===be?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Zl)return o===be?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Kl)return o===be?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===$l)return o===be?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Jl)return o===be?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===jl)return o===be?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Ql)return o===be?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===tc)return o===be?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===ec)return o===be?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===nc)return o===be?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===ic)return o===be?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===sc)return o===be?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===rc)return o===be?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===oc)return o===be?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===ac||n===lc||n===cc)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===ac)return o===be?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===lc)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===cc)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===hc||n===uc||n===ca||n===dc)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===hc)return r.COMPRESSED_RED_RGTC1_EXT;if(n===uc)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===ca)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===dc)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===jr?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}const PS=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,LS=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class IS{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){const n=new Zd(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=n}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new Gn({vertexShader:PS,fragmentShader:LS,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new ve(new Ns(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class NS extends as{constructor(t,e){super();const n=this;let s=null,r=1,o=null,a="local-floor",l=1,c=null,h=null,d=null,u=null,f=null,g=null;const v=typeof XRWebGLBinding<"u",m=new IS,p={},x=e.getContextAttributes();let w=null,y=null;const M=[],S=[],C=new Et;let _=null,T=null;const L=new wn;L.viewport=new Ue;const I=new wn;I.viewport=new Ue;const U=[L,I],N=new Bv;let A=null,D=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(W){let rt=M[W];return rt===void 0&&(rt=new ja,M[W]=rt),rt.getTargetRaySpace()},this.getControllerGrip=function(W){let rt=M[W];return rt===void 0&&(rt=new ja,M[W]=rt),rt.getGripSpace()},this.getHand=function(W){let rt=M[W];return rt===void 0&&(rt=new ja,M[W]=rt),rt.getHandSpace()};function F(W){const rt=S.indexOf(W.inputSource);if(rt===-1)return;const dt=M[rt];dt!==void 0&&(dt.update(W.inputSource,W.frame,c||o),dt.dispatchEvent({type:W.type,data:W.inputSource}))}function G(){s.removeEventListener("select",F),s.removeEventListener("selectstart",F),s.removeEventListener("selectend",F),s.removeEventListener("squeeze",F),s.removeEventListener("squeezestart",F),s.removeEventListener("squeezeend",F),s.removeEventListener("end",G),s.removeEventListener("inputsourceschange",Y);for(let W=0;W<M.length;W++){const rt=S[W];rt!==null&&(S[W]=null,M[W].disconnect(rt))}A=null,D=null,m.reset();for(const W in p)delete p[W];if(t.setRenderTarget(w),f=null,u=null,d=null,s=null,y=null,lt.stop(),n.isPresenting=!1,t.setPixelRatio(_),t.setSize(C.width,C.height,!1),T!==null){const W=T.camera;W.fov=T.fov,W.zoom=T.zoom,W.updateProjectionMatrix(),T=null}n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(W){r=W,n.isPresenting===!0&&ne("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(W){a=W,n.isPresenting===!0&&ne("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(W){c=W},this.getBaseLayer=function(){return u!==null?u:f},this.getBinding=function(){return d===null&&v&&(d=new XRWebGLBinding(s,e)),d},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(W){if(s=W,s!==null){if(w=t.getRenderTarget(),s.addEventListener("select",F),s.addEventListener("selectstart",F),s.addEventListener("selectend",F),s.addEventListener("squeeze",F),s.addEventListener("squeezestart",F),s.addEventListener("squeezeend",F),s.addEventListener("end",G),s.addEventListener("inputsourceschange",Y),x.xrCompatible!==!0&&await e.makeXRCompatible(),_=t.getPixelRatio(),t.getSize(C),v&&"createProjectionLayer"in XRWebGLBinding.prototype){let dt=null,Mt=null,_t=null;x.depth&&(_t=x.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,dt=x.stencil?_s:ki,Mt=x.stencil?jr:mi);const Tt={colorFormat:e.RGBA8,depthFormat:_t,scaleFactor:r};d=this.getBinding(),u=d.createProjectionLayer(Tt),s.updateRenderState({layers:[u]}),t.setPixelRatio(1),t.setSize(u.textureWidth,u.textureHeight,!1),y=new $n(u.textureWidth,u.textureHeight,{format:Kn,type:Nn,depthTexture:new to(u.textureWidth,u.textureHeight,Mt,void 0,void 0,void 0,void 0,void 0,void 0,dt),stencilBuffer:x.stencil,colorSpace:t.outputColorSpace,samples:x.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1,storeMultisampledDepthBuffer:u.ignoreDepthValues===!1,storeMultisampledStencilBuffer:u.ignoreDepthValues===!1})}else{const dt={antialias:x.antialias,alpha:!0,depth:x.depth,stencil:x.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(s,e,dt),s.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),y=new $n(f.framebufferWidth,f.framebufferHeight,{format:Kn,type:Nn,colorSpace:t.outputColorSpace,stencilBuffer:x.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await s.requestReferenceSpace(a),lt.setContext(s),lt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function Y(W){for(let rt=0;rt<W.removed.length;rt++){const dt=W.removed[rt],Mt=S.indexOf(dt);Mt>=0&&(S[Mt]=null,M[Mt].disconnect(dt))}for(let rt=0;rt<W.added.length;rt++){const dt=W.added[rt];let Mt=S.indexOf(dt);if(Mt===-1){for(let Tt=0;Tt<M.length;Tt++)if(Tt>=S.length){S.push(dt),Mt=Tt;break}else if(S[Tt]===null){S[Tt]=dt,Mt=Tt;break}if(Mt===-1)break}const _t=M[Mt];_t&&_t.connect(dt)}}const V=new B,q=new B;function $(W,rt,dt){V.setFromMatrixPosition(rt.matrixWorld),q.setFromMatrixPosition(dt.matrixWorld);const Mt=V.distanceTo(q),_t=rt.projectionMatrix.elements,Tt=dt.projectionMatrix.elements,kt=_t[14]/(_t[10]-1),ct=_t[14]/(_t[10]+1),z=(_t[9]+1)/_t[5],et=(_t[9]-1)/_t[5],nt=(_t[8]-1)/_t[0],J=(Tt[8]+1)/Tt[0],k=kt*nt,Q=kt*J,ht=Mt/(-nt+J),vt=ht*-nt;if(rt.matrixWorld.decompose(W.position,W.quaternion,W.scale),W.translateX(vt),W.translateZ(ht),W.matrixWorld.compose(W.position,W.quaternion,W.scale),W.matrixWorldInverse.copy(W.matrixWorld).invert(),_t[10]===-1)W.projectionMatrix.copy(rt.projectionMatrix),W.projectionMatrixInverse.copy(rt.projectionMatrixInverse);else{const O=kt+ht,Rt=ct+ht,At=k-vt,P=Q+(Mt-vt),b=z*ct/Rt*O,H=et*ct/Rt*O;W.projectionMatrix.makePerspective(At,P,b,H,O,Rt),W.projectionMatrixInverse.copy(W.projectionMatrix).invert()}}function it(W,rt){rt===null?W.matrixWorld.copy(W.matrix):W.matrixWorld.multiplyMatrices(rt.matrixWorld,W.matrix),W.matrixWorldInverse.copy(W.matrixWorld).invert()}this.updateCamera=function(W){if(s===null)return;let rt=W.near,dt=W.far;m.texture!==null&&(m.depthNear>0&&(rt=m.depthNear),m.depthFar>0&&(dt=m.depthFar)),N.near=I.near=L.near=rt,N.far=I.far=L.far=dt,(A!==N.near||D!==N.far)&&(s.updateRenderState({depthNear:N.near,depthFar:N.far}),A=N.near,D=N.far),N.layers.mask=W.layers.mask|6,L.layers.mask=N.layers.mask&-5,I.layers.mask=N.layers.mask&-3;const Mt=W.parent,_t=N.cameras;it(N,Mt);for(let Tt=0;Tt<_t.length;Tt++)it(_t[Tt],Mt);_t.length===2?$(N,L,I):N.projectionMatrix.copy(L.projectionMatrix),T===null&&W.isPerspectiveCamera&&(T={camera:W,fov:W.fov,zoom:W.zoom}),yt(W,N,Mt)};function yt(W,rt,dt){dt===null?W.matrix.copy(rt.matrixWorld):(W.matrix.copy(dt.matrixWorld),W.matrix.invert(),W.matrix.multiply(rt.matrixWorld)),W.matrix.decompose(W.position,W.quaternion,W.scale),W.updateMatrixWorld(!0),W.projectionMatrix.copy(rt.projectionMatrix),W.projectionMatrixInverse.copy(rt.projectionMatrixInverse),W.isPerspectiveCamera&&(W.fov=hr*2*Math.atan(1/W.projectionMatrix.elements[5]),W.zoom=1)}this.getCamera=function(){return N},this.getFoveation=function(){if(!(u===null&&f===null))return l},this.setFoveation=function(W){l=W,u!==null&&(u.fixedFoveation=W),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=W)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(N)},this.getCameraTexture=function(W){return p[W]};let Ft=null;function Zt(W,rt){if(h=rt.getViewerPose(c||o),g=rt,h!==null){const dt=h.views;f!==null&&(t.setRenderTargetFramebuffer(y,f.framebuffer),t.setRenderTarget(y));let Mt=!1;dt.length!==N.cameras.length&&(N.cameras.length=0,Mt=!0);for(let ct=0;ct<dt.length;ct++){const z=dt[ct];let et=null;if(f!==null)et=f.getViewport(z);else{const J=d.getViewSubImage(u,z);et=J.viewport,ct===0&&(t.setRenderTargetTextures(y,J.colorTexture,J.depthStencilTexture),t.setRenderTarget(y))}let nt=U[ct];nt===void 0&&(nt=new wn,nt.layers.enable(ct),nt.viewport=new Ue,U[ct]=nt),nt.matrix.fromArray(z.transform.matrix),nt.matrix.decompose(nt.position,nt.quaternion,nt.scale),nt.projectionMatrix.fromArray(z.projectionMatrix),nt.projectionMatrixInverse.copy(nt.projectionMatrix).invert(),nt.viewport.set(et.x,et.y,et.width,et.height),ct===0&&(N.matrix.copy(nt.matrix),N.matrix.decompose(N.position,N.quaternion,N.scale)),Mt===!0&&N.cameras.push(nt)}const _t=s.enabledFeatures;if(_t&&_t.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&v){d=n.getBinding();const ct=d.getDepthInformation(dt[0]);ct&&ct.isValid&&ct.texture&&m.init(ct,s.renderState)}if(_t&&_t.includes("camera-access")&&v){t.state.unbindTexture(),d=n.getBinding();for(let ct=0;ct<dt.length;ct++){const z=dt[ct].camera;if(z){let et=p[z];et||(et=new Zd,p[z]=et);const nt=d.getCameraImage(z);et.sourceTexture=nt}}}}for(let dt=0;dt<M.length;dt++){const Mt=S[dt],_t=M[dt];Mt!==null&&_t!==void 0&&_t.update(Mt,rt,c||o)}Ft&&Ft(W,rt),rt.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:rt}),g=null}const lt=new lf;lt.setAnimationLoop(Zt),this.setAnimationLoop=function(W){Ft=W},this.dispose=function(){}}}const DS=new Ee,mf=new se;mf.set(-1,0,0,0,1,0,0,0,1);function US(i,t){function e(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function n(m,p){p.color.getRGB(m.fogColor.value,sf(i)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function s(m,p,x,w,y){p.isNodeMaterial?p.uniformsNeedUpdate=!1:p.isMeshBasicMaterial?r(m,p):p.isMeshLambertMaterial?(r(m,p),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)):p.isMeshToonMaterial?(r(m,p),d(m,p)):p.isMeshPhongMaterial?(r(m,p),h(m,p),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)):p.isMeshStandardMaterial?(r(m,p),u(m,p),p.isMeshPhysicalMaterial&&f(m,p,y)):p.isMeshMatcapMaterial?(r(m,p),g(m,p)):p.isMeshDepthMaterial?r(m,p):p.isMeshDistanceMaterial?(r(m,p),v(m,p)):p.isMeshNormalMaterial?r(m,p):p.isLineBasicMaterial?(o(m,p),p.isLineDashedMaterial&&a(m,p)):p.isPointsMaterial?l(m,p,x,w):p.isSpriteMaterial?c(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,e(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===En&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,e(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===En&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,e(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,e(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const x=t.get(p),w=x.envMap,y=x.envMapRotation;w&&(m.envMap.value=w,m.envMapRotation.value.setFromMatrix4(DS.makeRotationFromEuler(y)).transpose(),w.isCubeTexture&&w.isRenderTargetTexture===!1&&m.envMapRotation.value.premultiply(mf),m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,e(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,m.aoMapTransform))}function o(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform))}function a(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function l(m,p,x,w){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*x,m.scale.value=w*.5,p.map&&(m.map.value=p.map,e(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function c(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function h(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function d(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function u(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function f(m,p,x){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===En&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.retroreflectivity>0&&(m.retroreflectivity.value=p.retroreflectivity),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=x.texture,m.transmissionSamplerSize.value.set(x.width,x.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function v(m,p){const x=t.get(p).light;m.referencePosition.value.setFromMatrixPosition(x.matrixWorld),m.nearDistance.value=x.shadow.camera.near,m.farDistance.value=x.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function FS(i,t,e,n){let s={},r={},o=[];const a=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(y,M){const S=M.program;n.uniformBlockBinding(y,S)}function c(y,M){let S=s[y.id];S===void 0&&(m(y),S=h(y),s[y.id]=S,y.addEventListener("dispose",x));const C=M.program;n.updateUBOMapping(y,C);const _=t.render.frame;r[y.id]!==_&&(u(y),r[y.id]=_)}function h(y){const M=d();y.__bindingPointIndex=M;const S=i.createBuffer(),C=y.__size,_=y.usage;return i.bindBuffer(i.UNIFORM_BUFFER,S),i.bufferData(i.UNIFORM_BUFFER,C,_),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,M,S),S}function d(){for(let y=0;y<a;y++)if(o.indexOf(y)===-1)return o.push(y),y;return ge("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(y){const M=s[y.id],S=y.uniforms,C=y.__cache;i.bindBuffer(i.UNIFORM_BUFFER,M);for(let _=0,T=S.length;_<T;_++){const L=S[_];if(Array.isArray(L))for(let I=0,U=L.length;I<U;I++)f(L[I],_,I,C);else f(L,_,0,C)}i.bindBuffer(i.UNIFORM_BUFFER,null)}function f(y,M,S,C){if(v(y,M,S,C)===!0){const _=y.__offset,T=y.value;if(Array.isArray(T)){let L=0;for(let I=0;I<T.length;I++){const U=T[I],N=p(U);g(U,y.__data,L),typeof U!="number"&&typeof U!="boolean"&&!U.isMatrix3&&!ArrayBuffer.isView(U)&&(L+=N.storage/Float32Array.BYTES_PER_ELEMENT)}}else g(T,y.__data,0);i.bufferSubData(i.UNIFORM_BUFFER,_,y.__data)}}function g(y,M,S){typeof y=="number"||typeof y=="boolean"?M[0]=y:y.isMatrix3?(M[0]=y.elements[0],M[1]=y.elements[1],M[2]=y.elements[2],M[3]=0,M[4]=y.elements[3],M[5]=y.elements[4],M[6]=y.elements[5],M[7]=0,M[8]=y.elements[6],M[9]=y.elements[7],M[10]=y.elements[8],M[11]=0):ArrayBuffer.isView(y)?M.set(new y.constructor(y.buffer,y.byteOffset,M.length)):y.toArray(M,S)}function v(y,M,S,C){const _=y.value,T=M+"_"+S;if(C[T]===void 0)return typeof _=="number"||typeof _=="boolean"?C[T]=_:ArrayBuffer.isView(_)?C[T]=_.slice():C[T]=_.clone(),!0;{const L=C[T];if(typeof _=="number"||typeof _=="boolean"){if(L!==_)return C[T]=_,!0}else{if(ArrayBuffer.isView(_))return!0;if(L.equals(_)===!1)return L.copy(_),!0}}return!1}function m(y){const M=y.uniforms;let S=0;const C=16;for(let T=0,L=M.length;T<L;T++){const I=Array.isArray(M[T])?M[T]:[M[T]];for(let U=0,N=I.length;U<N;U++){const A=I[U],D=Array.isArray(A.value)?A.value:[A.value];for(let F=0,G=D.length;F<G;F++){const Y=D[F],V=p(Y),q=S%C,$=q%V.boundary,it=q+$;S+=$,it!==0&&C-it<V.storage&&(S+=C-it),A.__data=new Float32Array(V.storage/Float32Array.BYTES_PER_ELEMENT),A.__offset=S,S+=V.storage}}}const _=S%C;return _>0&&(S+=C-_),y.__size=S,y.__cache={},this}function p(y){const M={boundary:0,storage:0};return typeof y=="number"||typeof y=="boolean"?(M.boundary=4,M.storage=4):y.isVector2?(M.boundary=8,M.storage=8):y.isVector3||y.isColor?(M.boundary=16,M.storage=12):y.isVector4?(M.boundary=16,M.storage=16):y.isMatrix3?(M.boundary=48,M.storage=48):y.isMatrix4?(M.boundary=64,M.storage=64):y.isTexture?ne("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(y)?(M.boundary=16,M.storage=y.byteLength):ne("WebGLRenderer: Unsupported uniform value type.",y),M}function x(y){const M=y.target;M.removeEventListener("dispose",x);const S=o.indexOf(M.__bindingPointIndex);o.splice(S,1),i.deleteBuffer(s[M.id]),delete s[M.id],delete r[M.id]}function w(){for(const y in s)i.deleteBuffer(s[y]);o=[],s={},r={}}return{bind:l,update:c,dispose:w}}const OS=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let ri=null;function zS(){return ri===null&&(ri=new Hc(OS,16,16,Ts,gi),ri.name="DFG_LUT",ri.minFilter=dn,ri.magFilter=dn,ri.wrapS=Ni,ri.wrapT=Ni,ri.generateMipmaps=!1,ri.needsUpdate=!0),ri}class BS{constructor(t={}){const{canvas:e=ng(),context:n=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:d=!1,reversedDepthBuffer:u=!1,outputBufferType:f=Nn}=t;this.isWebGLRenderer=!0;let g;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");g=n.getContextAttributes().alpha}else g=o;const v=f,m=new Set([Fc,Uc,Dc]),p=new Set([Nn,mi,Jr,jr,Ic,Nc]),x=new Uint32Array(4),w=new Int32Array(4),y=new B;let M=null,S=null;const C=[],_=[];let T=null;this.domElement=e,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=pi,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const L=this;let I=!1,U=null,N=null,A=null,D=null;this._outputColorSpace=bn;let F=0,G=0,Y=null,V=-1,q=null;const $=new Ue,it=new Ue;let yt=null;const Ft=new te(0);let Zt=0,lt=e.width,W=e.height,rt=1,dt=null,Mt=null;const _t=new Ue(0,0,lt,W),Tt=new Ue(0,0,lt,W);let kt=!1;const ct=new Wc;let z=!1,et=!1;const nt=new Ee,J=new B,k=new Ue,Q={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let ht=!1;function vt(){return Y===null?rt:1}let O=n;function Rt(R,X){return e.getContext(R,X)}let At,P,b,H,tt,st,bt,Ct,pt,xt,Pt,Ht,Lt,It,Yt,ee,ie,Z,j,K,mt,wt,gt;try{const R={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:d};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Rc}`),e.addEventListener("webglcontextlost",de,!1),e.addEventListener("webglcontextrestored",pe,!1),e.addEventListener("webglcontextcreationerror",Ve,!1),O===null){const X="webgl2";if(O=Rt(X,R),O===null)throw Rt(X)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}Wt()}catch(R){throw e.removeEventListener("webglcontextlost",de,!1),e.removeEventListener("webglcontextrestored",pe,!1),e.removeEventListener("webglcontextcreationerror",Ve,!1),ge("WebGLRenderer: "+R.message),R}function Wt(){At=new zy(O),At.init(),mt=new RS(O,At),P=new Cy(O,At,t,mt),b=new AS(O,At),P.reversedDepthBuffer&&u&&b.buffers.depth.setReversed(!0),N=O.createFramebuffer(),A=O.createFramebuffer(),D=O.createFramebuffer(),H=new Gy(O),tt=new fS,st=new CS(O,At,b,tt,P,mt,H),bt=new Oy(L),Ct=new Hv(O),wt=new Ty(O,Ct),pt=new By(O,Ct,H,wt),xt=new Hy(O,pt,Ct,wt,H),Z=new Vy(O,P,st),Yt=new Ry(tt),Pt=new dS(L,bt,At,P,wt,Yt),Ht=new US(L,tt),Lt=new mS,It=new MS(At),ie=new Ey(L,bt,b,xt,g,l),ee=new TS(L,xt,P),gt=new FS(O,H,P,b),j=new Ay(O,At,H),K=new ky(O,At,H),H.programs=Pt.programs,L.capabilities=P,L.extensions=At,L.properties=tt,L.renderLists=Lt,L.shadowMap=ee,L.state=b,L.info=H}v!==Nn&&(T=new qy(v,e.width,e.height,a,s,r));const Nt=new NS(L,O);this.xr=Nt,this.getContext=function(){return O},this.getContextAttributes=function(){return O.getContextAttributes()},this.forceContextLoss=function(){const R=At.get("WEBGL_lose_context");R&&R.loseContext()},this.forceContextRestore=function(){const R=At.get("WEBGL_lose_context");R&&R.restoreContext()},this.getPixelRatio=function(){return rt},this.setPixelRatio=function(R){R!==void 0&&(rt=R,this.setSize(lt,W,!1))},this.getSize=function(R){return R.set(lt,W)},this.setSize=function(R,X,ut=!0){if(Nt.isPresenting){ne("WebGLRenderer: Can't change size while VR device is presenting.");return}lt=R,W=X,e.width=Math.floor(R*rt),e.height=Math.floor(X*rt),ut===!0&&(e.style.width=R+"px",e.style.height=X+"px"),T!==null&&T.setSize(e.width,e.height),this.setViewport(0,0,R,X)},this.getDrawingBufferSize=function(R){return R.set(lt*rt,W*rt).floor()},this.setDrawingBufferSize=function(R,X,ut){lt=R,W=X,rt=ut,e.width=Math.floor(R*ut),e.height=Math.floor(X*ut),this.setViewport(0,0,R,X)},this.setEffects=function(R){if(v===Nn){ge("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(R){for(let X=0;X<R.length;X++)if(R[X].isOutputPass===!0){ne("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}T.setEffects(R||[])},this.getCurrentViewport=function(R){return R.copy($)},this.getViewport=function(R){return R.copy(_t)},this.setViewport=function(R,X,ut,ot){R.isVector4?_t.set(R.x,R.y,R.z,R.w):_t.set(R,X,ut,ot),b.viewport($.copy(_t).multiplyScalar(rt).round())},this.getScissor=function(R){return R.copy(Tt)},this.setScissor=function(R,X,ut,ot){R.isVector4?Tt.set(R.x,R.y,R.z,R.w):Tt.set(R,X,ut,ot),b.scissor(it.copy(Tt).multiplyScalar(rt).round())},this.getScissorTest=function(){return kt},this.setScissorTest=function(R){b.setScissorTest(kt=R)},this.setOpaqueSort=function(R){dt=R},this.setTransparentSort=function(R){Mt=R},this.getClearColor=function(R){return R.copy(ie.getClearColor())},this.setClearColor=function(){ie.setClearColor(...arguments)},this.getClearAlpha=function(){return ie.getClearAlpha()},this.setClearAlpha=function(){ie.setClearAlpha(...arguments)},this.clear=function(R=!0,X=!0,ut=!0){let ot=0;if(R){let at=!1;if(Y!==null){const Ot=Y.texture.format;at=m.has(Ot)}if(at){const Ot=Y.texture.type,Gt=p.has(Ot),Ut=ie.getClearColor(),qt=ie.getClearAlpha(),Kt=Ut.r,oe=Ut.g,ce=Ut.b;Gt?(x[0]=Kt,x[1]=oe,x[2]=ce,x[3]=qt,O.clearBufferuiv(O.COLOR,0,x)):(w[0]=Kt,w[1]=oe,w[2]=ce,w[3]=qt,O.clearBufferiv(O.COLOR,0,w))}else ot|=O.COLOR_BUFFER_BIT}X&&(ot|=O.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),ut&&(ot|=O.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),ot!==0&&O.clear(ot)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(R){R.setRenderer(this),U=R},this.dispose=function(){e.removeEventListener("webglcontextlost",de,!1),e.removeEventListener("webglcontextrestored",pe,!1),e.removeEventListener("webglcontextcreationerror",Ve,!1),ie.dispose(),Lt.dispose(),It.dispose(),tt.dispose(),bt.dispose(),xt.dispose(),wt.dispose(),gt.dispose(),Pt.dispose(),Nt.dispose(),Nt.removeEventListener("sessionstart",Ds),Nt.removeEventListener("sessionend",$t),Jt.stop()};function de(R){R.preventDefault(),Oh("WebGLRenderer: Context Lost."),I=!0}function pe(){Oh("WebGLRenderer: Context Restored."),I=!1;const R=H.autoReset,X=ee.enabled,ut=ee.autoUpdate,ot=ee.needsUpdate,at=ee.type;Wt(),H.autoReset=R,ee.enabled=X,ee.autoUpdate=ut,ee.needsUpdate=ot,ee.type=at}function Ve(R){ge("WebGLRenderer: A WebGL context could not be created. Reason: ",R.statusMessage)}function sn(R){const X=R.target;X.removeEventListener("dispose",sn),Da(X)}function Da(R){Ua(R),tt.remove(R)}function Ua(R){const X=tt.get(R).programs;X!==void 0&&(X.forEach(function(ut){Pt.releaseProgram(ut)}),R.isShaderMaterial&&Pt.releaseShaderCache(R))}this.renderBufferDirect=function(R,X,ut,ot,at,Ot){X===null&&(X=Q);const Gt=at.isMesh&&at.matrixWorld.determinantAffine()<0,Ut=Df(R,X,ut,ot,at);b.setMaterial(ot,Gt);let qt=ut.index,Kt=1;if(ot.wireframe===!0){if(qt=pt.getWireframeAttribute(ut),qt===void 0)return;Kt=2}const oe=ut.drawRange,ce=ut.attributes.position;let Xt=oe.start*Kt,ye=(oe.start+oe.count)*Kt;Ot!==null&&(Xt=Math.max(Xt,Ot.start*Kt),ye=Math.min(ye,(Ot.start+Ot.count)*Kt)),qt!==null?(Xt=Math.max(Xt,0),ye=Math.min(ye,qt.count)):ce!=null&&(Xt=Math.max(Xt,0),ye=Math.min(ye,ce.count));const He=ye-Xt;if(He<0||He===1/0)return;wt.setup(at,ot,Ut,ut,qt);let Le,Ae=j;if(qt!==null&&(Le=Ct.get(qt),Ae=K,Ae.setIndex(Le)),at.isMesh)ot.wireframe===!0?(b.setLineWidth(ot.wireframeLinewidth*vt()),Ae.setMode(O.LINES)):Ae.setMode(O.TRIANGLES);else if(at.isLine){let an=ot.linewidth;an===void 0&&(an=1),b.setLineWidth(an*vt()),at.isLineSegments?Ae.setMode(O.LINES):at.isLineLoop?Ae.setMode(O.LINE_LOOP):Ae.setMode(O.LINE_STRIP)}else at.isPoints?Ae.setMode(O.POINTS):at.isSprite&&Ae.setMode(O.TRIANGLES);if(at.isBatchedMesh)if(At.get("WEBGL_multi_draw"))Ae.renderMultiDraw(at._multiDrawStarts,at._multiDrawCounts,at._multiDrawCount);else{const an=at._multiDrawStarts,Bt=at._multiDrawCounts,pn=at._multiDrawCount,xe=qt?Ct.get(qt).bytesPerElement:1,On=tt.get(ot).currentProgram.getUniforms();for(let ti=0;ti<pn;ti++)On.setValue(O,"_gl_DrawID",ti),Ae.render(an[ti]/xe,Bt[ti])}else if(at.isInstancedMesh)Ae.renderInstances(Xt,He,at.count);else if(ut.isInstancedBufferGeometry){const an=ut._maxInstanceCount!==void 0?ut._maxInstanceCount:1/0,Bt=Math.min(ut.instanceCount,an);Ae.renderInstances(Xt,He,Bt)}else Ae.render(Xt,He)};function ao(R,X,ut,ot){U!==null&&R.isNodeMaterial&&U.setObject(ot,R),z===!0&&Yt.setState(R,ut,!1),R.transparent===!0&&R.side===Ge&&R.forceSinglePass===!1?(R.side=En,R.needsUpdate=!0,xi(R,X,ot),R.side=ws,R.needsUpdate=!0,xi(R,X,ot),R.side=Ge):xi(R,X,ot)}this.compile=function(R,X,ut=null){ut===null&&(ut=R),U!==null&&U.renderStart(R,X,ut),S=It.get(ut),S.init(X),_.push(S),ut.traverseVisible(function(at){at.isLight&&at.layers.test(X.layers)&&(S.pushLight(at),at.castShadow&&S.pushShadow(at))}),R!==ut&&R.traverseVisible(function(at){at.isLight&&at.layers.test(X.layers)&&(S.pushLight(at),at.castShadow&&S.pushShadow(at))}),S.setupLights(),U!==null&&U.updateLights(S.state.lightsArray),et=this.localClippingEnabled,z=Yt.init(this.clippingPlanes,et),z===!0&&Yt.setGlobalState(this.clippingPlanes,X),U!==null&&ee.render(S.state.shadowsArray,ut,X);const ot=new Set;return R.traverse(function(at){if(!(at.isMesh||at.isPoints||at.isLine||at.isSprite))return;const Ot=at.material;if(Ot)if(Array.isArray(Ot))for(let Gt=0;Gt<Ot.length;Gt++){const Ut=Ot[Gt];ao(Ut,ut,X,at),ot.add(Ut)}else ao(Ot,ut,X,at),ot.add(Ot)}),S=_.pop(),U!==null&&U.renderEnd(),ot},this.compileAsync=function(R,X,ut=null){const ot=this.compile(R,X,ut);return new Promise(at=>{function Ot(){if(ot.forEach(function(Gt){const qt=tt.get(Gt).currentProgram;(qt===void 0||qt.isReady())&&ot.delete(Gt)}),ot.size===0){at(R);return}setTimeout(Ot,10)}At.get("KHR_parallel_shader_compile")!==null?Ot():setTimeout(Ot,10)})};let gr=null;function Fa(R){gr&&gr(R)}function Ds(){Jt.stop()}function $t(){Jt.start()}const Jt=new lf;Jt.setAnimationLoop(Fa),typeof self<"u"&&Jt.setContext(self),this.setAnimationLoop=function(R){gr=R,Nt.setAnimationLoop(R),R===null?Jt.stop():Jt.start()},Nt.addEventListener("sessionstart",Ds),Nt.addEventListener("sessionend",$t),this.render=function(R,X){if(X!==void 0&&X.isCamera!==!0){ge("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(I===!0)return;U!==null&&U.renderStart(R,X);const ut=Nt.enabled===!0&&Nt.isPresenting===!0,ot=T!==null&&(Y===null||ut)&&T.begin(L,Y);if(R.matrixWorldAutoUpdate===!0&&R.updateMatrixWorld(),X.parent===null&&X.matrixWorldAutoUpdate===!0&&X.updateMatrixWorld(),Nt.enabled===!0&&Nt.isPresenting===!0&&(T===null||T.isCompositing()===!1)&&(Nt.cameraAutoUpdate===!0&&Nt.updateCamera(X),X=Nt.getCamera()),R.isScene===!0&&R.onBeforeRender(L,R,X,Y),S=It.get(R,_.length),S.init(X),S.state.textureUnits=st.getTextureUnits(),_.push(S),nt.multiplyMatrices(X.projectionMatrix,X.matrixWorldInverse),ct.setFromProjectionMatrix(nt,ui,X.reversedDepth),et=this.localClippingEnabled,z=Yt.init(this.clippingPlanes,et),M=Lt.get(R,C.length),M.init(),C.push(M),Nt.enabled===!0&&Nt.isPresenting===!0){const Gt=L.xr.getDepthSensingMesh();Gt!==null&&Be(Gt,X,-1/0,L.sortObjects)}Be(R,X,0,L.sortObjects),M.finish(),U!==null&&U.updateLights(S.state.lightsArray),L.sortObjects===!0&&M.sort(dt,Mt),ht=Nt.enabled===!1||Nt.isPresenting===!1||Nt.hasDepthSensing()===!1,ht&&ie.addToRenderList(M,R),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),z===!0&&Yt.beginShadows();const at=S.state.shadowsArray;if(ee.render(at,R,X),z===!0&&Yt.endShadows(),(ot&&T.hasRenderPass())===!1){const Gt=M.opaque,Ut=M.transmissive;if(S.setupLights(),X.isArrayCamera){const qt=X.cameras;if(Ut.length>0)for(let Kt=0,oe=qt.length;Kt<oe;Kt++){const ce=qt[Kt];Qn(Gt,Ut,R,ce)}ht&&ie.render(R);for(let Kt=0,oe=qt.length;Kt<oe;Kt++){const ce=qt[Kt];jn(M,R,ce,ce.viewport)}}else Ut.length>0&&Qn(Gt,Ut,R,X),ht&&ie.render(R),jn(M,R,X)}Y!==null&&G===0&&(st.updateMultisampleRenderTarget(Y),st.updateRenderTargetMipmap(Y)),ot&&T.end(L),R.isScene===!0&&R.onAfterRender(L,R,X),wt.resetDefaultState(),V=-1,q=null,_.pop(),_.length>0?(S=_[_.length-1],st.setTextureUnits(S.state.textureUnits),z===!0&&Yt.setGlobalState(L.clippingPlanes,S.state.camera)):S=null,C.pop(),C.length>0?M=C[C.length-1]:M=null,U!==null&&U.renderEnd()};function Be(R,X,ut,ot){if(R.visible===!1)return;if(R.layers.test(X.layers)){if(R.isGroup)ut=R.renderOrder;else if(R.isLOD)R.autoUpdate===!0&&R.update(X);else if(R.isLightProbeGrid)S.pushLightProbeGrid(R);else if(R.isLight)S.pushLight(R),R.castShadow&&S.pushShadow(R);else if(R.isSprite){if(!R.frustumCulled||R.intersectsFrustum(ct)){ot&&k.setFromMatrixPosition(R.matrixWorld).applyMatrix4(nt);const Gt=xt.update(R),Ut=R.material;Ut.visible&&M.push(R,Gt,Ut,ut,k.z,null,X)}}else if((R.isMesh||R.isLine||R.isPoints)&&(!R.frustumCulled||R.intersectsFrustum(ct))){const Gt=xt.update(R),Ut=R.material;if(ot&&(R.boundingSphere!==void 0?(R.boundingSphere===null&&R.computeBoundingSphere(),k.copy(R.boundingSphere.center)):(Gt.boundingSphere===null&&Gt.computeBoundingSphere(),k.copy(Gt.boundingSphere.center)),k.applyMatrix4(R.matrixWorld).applyMatrix4(nt)),Array.isArray(Ut)){const qt=Gt.groups;for(let Kt=0,oe=qt.length;Kt<oe;Kt++){const ce=qt[Kt],Xt=Ut[ce.materialIndex];Xt&&Xt.visible&&M.push(R,Gt,Xt,ut,k.z,ce,X)}}else Ut.visible&&M.push(R,Gt,Ut,ut,k.z,null,X)}}const Ot=R.children;for(let Gt=0,Ut=Ot.length;Gt<Ut;Gt++)Be(Ot[Gt],X,ut,ot)}function jn(R,X,ut,ot){const{opaque:at,transmissive:Ot,transparent:Gt}=R;S.setupLightsView(ut),z===!0&&Yt.setGlobalState(L.clippingPlanes,ut),ot&&b.viewport($.copy(ot)),at.length>0&&Fn(at,X,ut),Ot.length>0&&Fn(Ot,X,ut),Gt.length>0&&Fn(Gt,X,ut),b.buffers.depth.setTest(!0),b.buffers.depth.setMask(!0),b.buffers.color.setMask(!0),b.setPolygonOffset(!1)}function Qn(R,X,ut,ot){if((ut.isScene===!0?ut.overrideMaterial:null)!==null)return;if(S.state.transmissionRenderTarget[ot.id]===void 0){const Xt=At.has("EXT_color_buffer_half_float")||At.has("EXT_color_buffer_float");S.state.transmissionRenderTarget[ot.id]=new $n(1,1,{generateMipmaps:!0,type:Xt?gi:Nn,minFilter:xs,samples:Math.max(4,P.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:me.workingColorSpace})}const Ot=S.state.transmissionRenderTarget[ot.id],Gt=ot.viewport||$;Ot.setSize(Gt.z*L.transmissionResolutionScale,Gt.w*L.transmissionResolutionScale);const Ut=L.getRenderTarget(),qt=L.getActiveCubeFace(),Kt=L.getActiveMipmapLevel();L.setRenderTarget(Ot),L.getClearColor(Ft),Zt=L.getClearAlpha(),Zt<1&&L.setClearColor(16777215,.5),L.clear(),ht&&ie.render(ut);const oe=L.toneMapping;L.toneMapping=pi;const ce=ot.viewport;if(ot.viewport!==void 0&&(ot.viewport=void 0),S.setupLightsView(ot),z===!0&&Yt.setGlobalState(L.clippingPlanes,ot),Fn(R,ut,ot),st.updateMultisampleRenderTarget(Ot),st.updateRenderTargetMipmap(Ot),At.has("WEBGL_multisampled_render_to_texture")===!1){let Xt=!1;for(let ye=0,He=X.length;ye<He;ye++){const Le=X[ye],{object:Ae,geometry:an,material:Bt,group:pn}=Le;if(Bt.side===Ge&&Ae.layers.test(ot.layers)){const xe=Bt.side;Bt.side=En,Bt.needsUpdate=!0,An(Ae,ut,ot,an,Bt,pn),Bt.side=xe,Bt.needsUpdate=!0,Xt=!0}}Xt===!0&&(st.updateMultisampleRenderTarget(Ot),st.updateRenderTargetMipmap(Ot))}L.setRenderTarget(Ut,qt,Kt),L.setClearColor(Ft,Zt),ce!==void 0&&(ot.viewport=ce),L.toneMapping=oe}function Fn(R,X,ut){const ot=X.isScene===!0?X.overrideMaterial:null;for(let at=0,Ot=R.length;at<Ot;at++){const Gt=R[at],{object:Ut,geometry:qt,group:Kt}=Gt;let oe=Gt.material;oe.allowOverride===!0&&ot!==null&&(oe=ot),Ut.layers.test(ut.layers)&&An(Ut,X,ut,qt,oe,Kt)}}function An(R,X,ut,ot,at,Ot){U!==null&&at.isNodeMaterial&&U.setObject(R,at),R.onBeforeRender(L,X,ut,ot,at,Ot),R.modelViewMatrix.multiplyMatrices(ut.matrixWorldInverse,R.matrixWorld),R.normalMatrix.getNormalMatrix(R.modelViewMatrix),at.onBeforeRender(L,X,ut,ot,R,Ot),at.transparent===!0&&at.side===Ge&&at.forceSinglePass===!1?(at.side=En,at.needsUpdate=!0,L.renderBufferDirect(ut,X,ot,at,R,Ot),at.side=ws,at.needsUpdate=!0,L.renderBufferDirect(ut,X,ot,at,R,Ot),at.side=Ge):L.renderBufferDirect(ut,X,ot,at,R,Ot),R.onAfterRender(L,X,ut,ot,at,Ot)}function xi(R,X,ut){X.isScene!==!0&&(X=Q);const ot=tt.get(R),at=S.state.lights,Ot=S.state.shadowsArray,Gt=at.state.version,Ut=Pt.getParameters(R,at.state,Ot,X,ut,S.state.lightProbeGridArray),qt=Pt.getProgramCacheKey(Ut);let Kt=ot.programs;ot.environment=R.isMeshStandardMaterial||R.isMeshLambertMaterial||R.isMeshPhongMaterial?X.environment:null,ot.fog=X.fog;const oe=R.isMeshStandardMaterial||R.isMeshLambertMaterial&&!R.envMap||R.isMeshPhongMaterial&&!R.envMap;ot.envMap=bt.get(R.envMap||ot.environment,oe),ot.envMapRotation=ot.environment!==null&&R.envMap===null?X.environmentRotation:R.envMapRotation,Kt===void 0&&(R.addEventListener("dispose",sn),Kt=new Map,ot.programs=Kt);let ce=Kt.get(qt);if(ce!==void 0){if(ot.currentProgram===ce&&ot.lightsStateVersion===Gt)return vr(R,Ut),ce}else Ut.uniforms=Pt.getUniforms(R),U!==null&&R.isNodeMaterial&&U.build(R,ut,Ut),R.onBeforeCompile(Ut,L),ce=Pt.acquireProgram(Ut,qt),Kt.set(qt,ce),ot.uniforms=Ut.uniforms;const Xt=ot.uniforms;return(!R.isShaderMaterial&&!R.isRawShaderMaterial||R.clipping===!0)&&(Xt.clippingPlanes=Yt.uniform),vr(R,Ut),ot.needsLights=Ff(R),ot.lightsStateVersion=Gt,ot.needsLights&&(Xt.ambientLightColor.value=at.state.ambient,Xt.lightProbe.value=at.state.probe,Xt.sunLights.value=at.state.sun,Xt.sunLightShadows.value=at.state.sunShadow,Xt.directionalLights.value=at.state.directional,Xt.directionalLightShadows.value=at.state.directionalShadow,Xt.spotLights.value=at.state.spot,Xt.spotLightShadows.value=at.state.spotShadow,Xt.rectAreaLights.value=at.state.rectArea,Xt.ltc_1.value=at.state.rectAreaLTC1,Xt.ltc_2.value=at.state.rectAreaLTC2,Xt.pointLights.value=at.state.point,Xt.pointLightShadows.value=at.state.pointShadow,Xt.hemisphereLights.value=at.state.hemi,Xt.sunShadowMatrix.value=at.state.sunShadowMatrix,Xt.sunShadowCascade.value=at.state.sunShadowCascade,Xt.directionalShadowMatrix.value=at.state.directionalShadowMatrix,Xt.spotLightMatrix.value=at.state.spotLightMatrix,Xt.spotLightMap.value=at.state.spotLightMap,Xt.pointShadowMatrix.value=at.state.pointShadowMatrix),ot.lightProbeGrid=S.state.lightProbeGridArray.length>0,ot.currentProgram=ce,ot.uniformsList=null,ce}function lo(R){if(R.uniformsList===null){const X=R.currentProgram.getUniforms();R.uniformsList=ea.seqWithValue(X.seq,R.uniforms)}return R.uniformsList}function vr(R,X){const ut=tt.get(R);ut.outputColorSpace=X.outputColorSpace,ut.batching=X.batching,ut.batchingColor=X.batchingColor,ut.instancing=X.instancing,ut.instancingColor=X.instancingColor,ut.instancingMorph=X.instancingMorph,ut.skinning=X.skinning,ut.morphTargets=X.morphTargets,ut.morphNormals=X.morphNormals,ut.morphColors=X.morphColors,ut.morphTargetsCount=X.morphTargetsCount,ut.numClippingPlanes=X.numClippingPlanes,ut.numIntersection=X.numClipIntersection,ut.vertexAlphas=X.vertexAlphas,ut.vertexTangents=X.vertexTangents,ut.toneMapping=X.toneMapping}function Nf(R,X){if(R.length===0)return null;if(R.length===1)return R[0].texture!==null?R[0]:null;y.setFromMatrixPosition(X.matrixWorld);for(let ut=0,ot=R.length;ut<ot;ut++){const at=R[ut];if(at.texture!==null&&at.boundingBox.containsPoint(y))return at}return null}function Df(R,X,ut,ot,at){X.isScene!==!0&&(X=Q),st.resetTextureUnits();const Ot=X.fog,Gt=ot.isMeshStandardMaterial||ot.isMeshLambertMaterial||ot.isMeshPhongMaterial?X.environment:null,Ut=Y===null?L.outputColorSpace:Y.isXRRenderTarget===!0?Y.texture.colorSpace:me.workingColorSpace,qt=ot.isMeshStandardMaterial||ot.isMeshLambertMaterial&&!ot.envMap||ot.isMeshPhongMaterial&&!ot.envMap,Kt=bt.get(ot.envMap||Gt,qt),oe=ot.vertexColors===!0&&!!ut.attributes.color&&ut.attributes.color.itemSize===4,ce=!!ut.attributes.tangent&&(!!ot.normalMap||ot.anisotropy>0),Xt=!!ut.morphAttributes.position,ye=!!ut.morphAttributes.normal,He=!!ut.morphAttributes.color;let Le=pi;ot.toneMapped&&(Y===null||Y.isXRRenderTarget===!0)&&(Le=L.toneMapping);const Ae=ut.morphAttributes.position||ut.morphAttributes.normal||ut.morphAttributes.color,an=Ae!==void 0?Ae.length:0,Bt=tt.get(ot),pn=S.state.lights;if(z===!0&&(et===!0||R!==q)){const Pe=R===q&&ot.id===V;Yt.setState(ot,R,Pe)}let xe=!1;ot.version===Bt.__version?(Bt.needsLights&&Bt.lightsStateVersion!==pn.state.version||Bt.outputColorSpace!==Ut||at.isBatchedMesh&&Bt.batching===!1||!at.isBatchedMesh&&Bt.batching===!0||at.isBatchedMesh&&Bt.batchingColor===!0&&at._colorsTexture===null||at.isBatchedMesh&&Bt.batchingColor===!1&&at._colorsTexture!==null||at.isInstancedMesh&&Bt.instancing===!1||!at.isInstancedMesh&&Bt.instancing===!0||at.isSkinnedMesh&&Bt.skinning===!1||!at.isSkinnedMesh&&Bt.skinning===!0||at.isInstancedMesh&&Bt.instancingColor===!0&&at.instanceColor===null||at.isInstancedMesh&&Bt.instancingColor===!1&&at.instanceColor!==null||at.isInstancedMesh&&Bt.instancingMorph===!0&&at.morphTexture===null||at.isInstancedMesh&&Bt.instancingMorph===!1&&at.morphTexture!==null||Bt.envMap!==Kt||ot.fog===!0&&Bt.fog!==Ot||Bt.numClippingPlanes!==void 0&&(Bt.numClippingPlanes!==Yt.numPlanes||Bt.numIntersection!==Yt.numIntersection)||Bt.vertexAlphas!==oe||Bt.vertexTangents!==ce||Bt.morphTargets!==Xt||Bt.morphNormals!==ye||Bt.morphColors!==He||Bt.toneMapping!==Le||Bt.morphTargetsCount!==an||!!Bt.lightProbeGrid!=S.state.lightProbeGridArray.length>0)&&(xe=!0):(xe=!0,Bt.__version=ot.version);let On=Bt.currentProgram;xe===!0&&(On=xi(ot,X,at),U&&ot.isNodeMaterial&&U.onUpdateProgram(ot,On,Bt));let ti=!1,Wi=!1,Us=!1;const Te=On.getUniforms(),ke=Bt.uniforms;if(b.useProgram(On.program)&&(ti=!0,Wi=!0,Us=!0),ot.id!==V&&(V=ot.id,Wi=!0),Bt.needsLights){const Pe=Nf(S.state.lightProbeGridArray,at);Bt.lightProbeGrid!==Pe&&(Bt.lightProbeGrid=Pe,Wi=!0)}if(ti||q!==R){b.buffers.depth.getReversed()&&R.reversedDepth!==!0&&(R._reversedDepth=!0,R.updateProjectionMatrix()),Te.setValue(O,"projectionMatrix",R.projectionMatrix),Te.setValue(O,"viewMatrix",R.matrixWorldInverse);const Xi=Te.map.cameraPosition;Xi!==void 0&&Xi.setValue(O,J.setFromMatrixPosition(R.matrixWorld)),P.logarithmicDepthBuffer&&Te.setValue(O,"logDepthBufFC",2/(Math.log(R.far+1)/Math.LN2)),(ot.isMeshPhongMaterial||ot.isMeshToonMaterial||ot.isMeshLambertMaterial||ot.isMeshBasicMaterial||ot.isMeshStandardMaterial||ot.isShaderMaterial)&&Te.setValue(O,"isOrthographic",R.isOrthographicCamera===!0),q!==R&&(q=R,Wi=!0,Us=!0)}if(Bt.needsLights&&(pn.state.sunShadowMap.length>0&&Te.setValue(O,"sunShadowMap",pn.state.sunShadowMap,st),pn.state.directionalShadowMap.length>0&&Te.setValue(O,"directionalShadowMap",pn.state.directionalShadowMap,st),pn.state.spotShadowMap.length>0&&Te.setValue(O,"spotShadowMap",pn.state.spotShadowMap,st),pn.state.pointShadowMap.length>0&&Te.setValue(O,"pointShadowMap",pn.state.pointShadowMap,st)),at.isSkinnedMesh){Te.setOptional(O,at,"bindMatrix"),Te.setOptional(O,at,"bindMatrixInverse");const Pe=at.skeleton;Pe&&(Pe.boneTexture===null&&Pe.computeBoneTexture(),Te.setValue(O,"boneTexture",Pe.boneTexture,st))}at.isBatchedMesh&&(Te.setOptional(O,at,"batchingTexture"),Te.setValue(O,"batchingTexture",at._matricesTexture,st),Te.setOptional(O,at,"batchingIdTexture"),Te.setValue(O,"batchingIdTexture",at._indirectTexture,st),Te.setOptional(O,at,"batchingColorTexture"),at._colorsTexture!==null&&Te.setValue(O,"batchingColorTexture",at._colorsTexture,st));const qi=ut.morphAttributes;if((qi.position!==void 0||qi.normal!==void 0||qi.color!==void 0)&&Z.update(at,ut,On),(Wi||Bt.receiveShadow!==at.receiveShadow)&&(Bt.receiveShadow=at.receiveShadow,Te.setValue(O,"receiveShadow",at.receiveShadow)),(ot.isMeshStandardMaterial||ot.isMeshLambertMaterial||ot.isMeshPhongMaterial)&&ot.envMap===null&&X.environment!==null&&(ke.envMapIntensity.value=X.environmentIntensity),ke.dfgLUT!==void 0&&(ke.dfgLUT.value=zS()),Wi){if(Te.setValue(O,"toneMappingExposure",L.toneMappingExposure),Bt.needsLights&&Uf(ke,Us),Ot&&ot.fog===!0&&Ht.refreshFogUniforms(ke,Ot),Ht.refreshMaterialUniforms(ke,ot,rt,W,S.state.transmissionRenderTarget[R.id]),Bt.needsLights&&Bt.lightProbeGrid){const Pe=Bt.lightProbeGrid;ke.probesSH.value=Pe.texture,ke.probesMin.value.copy(Pe.boundingBox.min),ke.probesMax.value.copy(Pe.boundingBox.max),ke.probesResolution.value.copy(Pe.resolution)}ea.upload(O,lo(Bt),ke,st)}if(ot.isShaderMaterial&&ot.uniformsNeedUpdate===!0&&(ea.upload(O,lo(Bt),ke,st),ot.uniformsNeedUpdate=!1),ot.isSpriteMaterial&&Te.setValue(O,"center",at.center),Te.setValue(O,"modelViewMatrix",at.modelViewMatrix),Te.setValue(O,"normalMatrix",at.normalMatrix),Te.setValue(O,"modelMatrix",at.matrixWorld),ot.uniformsGroups!==void 0){const Pe=ot.uniformsGroups;for(let Xi=0,Fs=Pe.length;Xi<Fs;Xi++){const uh=Pe[Xi];gt.update(uh,On),gt.bind(uh,On)}}return On}function Uf(R,X){R.ambientLightColor.needsUpdate=X,R.lightProbe.needsUpdate=X,R.sunLights.needsUpdate=X,R.sunLightShadows.needsUpdate=X,R.directionalLights.needsUpdate=X,R.directionalLightShadows.needsUpdate=X,R.pointLights.needsUpdate=X,R.pointLightShadows.needsUpdate=X,R.spotLights.needsUpdate=X,R.spotLightShadows.needsUpdate=X,R.rectAreaLights.needsUpdate=X,R.hemisphereLights.needsUpdate=X}function Ff(R){return R.isMeshLambertMaterial||R.isMeshToonMaterial||R.isMeshPhongMaterial||R.isMeshStandardMaterial||R.isShadowMaterial||R.isShaderMaterial&&R.lights===!0}this.getActiveCubeFace=function(){return F},this.getActiveMipmapLevel=function(){return G},this.getRenderTarget=function(){return Y},this.setRenderTargetTextures=function(R,X,ut){const ot=tt.get(R);ot.__autoAllocateDepthBuffer=R.resolveDepthBuffer===!1,ot.__autoAllocateDepthBuffer===!1&&(ot.__useRenderToTexture=!1),tt.get(R.texture).__webglTexture=X,tt.get(R.depthTexture).__webglTexture=ot.__autoAllocateDepthBuffer?void 0:ut,ot.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(R,X){const ut=tt.get(R);ut.__webglFramebuffer=X,ut.__useDefaultFramebuffer=X===void 0},this.setRenderTarget=function(R,X=0,ut=0){Y=R,F=X,G=ut;let ot=null,at=!1,Ot=!1;if(R){const Ut=tt.get(R);if(Ut.__useDefaultFramebuffer!==void 0){b.bindFramebuffer(O.FRAMEBUFFER,Ut.__webglFramebuffer),$.copy(R.viewport),it.copy(R.scissor),yt=R.scissorTest,b.viewport($),b.scissor(it),b.setScissorTest(yt),V=-1;return}else if(Ut.__webglFramebuffer===void 0)st.setupRenderTarget(R);else if(Ut.__hasExternalTextures)st.rebindTextures(R,tt.get(R.texture).__webglTexture,tt.get(R.depthTexture).__webglTexture);else if(R.depthBuffer){const oe=R.depthTexture;if(Ut.__boundDepthTexture!==oe){if(oe!==null&&tt.has(oe)&&(R.width!==oe.image.width||R.height!==oe.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");st.setupDepthRenderbuffer(R)}}const qt=R.texture;(qt.isData3DTexture||qt.isDataArrayTexture||qt.isCompressedArrayTexture)&&(Ot=!0);const Kt=tt.get(R).__webglFramebuffer;R.isWebGLCubeRenderTarget?(Array.isArray(Kt[X])?ot=Kt[X][ut]:ot=Kt[X],at=!0):R.samples>0&&st.useMultisampledRTT(R)===!1?ot=tt.get(R).__webglMultisampledFramebuffer:Array.isArray(Kt)?ot=Kt[ut]:ot=Kt,$.copy(R.viewport),it.copy(R.scissor),yt=R.scissorTest}else $.copy(_t).multiplyScalar(rt).floor(),it.copy(Tt).multiplyScalar(rt).floor(),yt=kt;if(ut!==0&&(ot=N),b.bindFramebuffer(O.FRAMEBUFFER,ot)&&b.drawBuffers(R,ot),b.viewport($),b.scissor(it),b.setScissorTest(yt),at){const Ut=tt.get(R.texture);O.framebufferTexture2D(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_CUBE_MAP_POSITIVE_X+X,Ut.__webglTexture,ut)}else if(Ot){const Ut=X;for(let qt=0;qt<R.textures.length;qt++){const Kt=tt.get(R.textures[qt]);O.framebufferTextureLayer(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0+qt,Kt.__webglTexture,ut,Ut)}}else if(R!==null&&ut!==0){const Ut=tt.get(R.texture);O.framebufferTexture2D(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,Ut.__webglTexture,ut)}V=-1};function hh(R){const X=tt.get(R);return(X.__readFormat!==R.format||X.__readType!==R.type)&&(X.__readFormat=R.format,X.__readType=R.type,X.__formatReadable=P.textureFormatReadable(R.format),X.__typeReadable=P.textureTypeReadable(R.type)),X}this.readRenderTargetPixels=function(R,X,ut,ot,at,Ot,Gt,Ut=0){if(!(R&&R.isWebGLRenderTarget)){ge("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let qt=tt.get(R).__webglFramebuffer;if(R.isWebGLCubeRenderTarget&&Gt!==void 0&&(qt=qt[Gt]),qt){b.bindFramebuffer(O.FRAMEBUFFER,qt);try{const Kt=R.textures[Ut],oe=Kt.format,ce=Kt.type;R.textures.length>1&&O.readBuffer(O.COLOR_ATTACHMENT0+Ut);const Xt=hh(Kt);if(Xt.__formatReadable===!1){ge("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(Xt.__typeReadable===!1){ge("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}X>=0&&X<=R.width-ot&&ut>=0&&ut<=R.height-at&&O.readPixels(X,ut,ot,at,mt.convert(oe),mt.convert(ce),Ot)}finally{const Kt=Y!==null?tt.get(Y).__webglFramebuffer:null;b.bindFramebuffer(O.FRAMEBUFFER,Kt)}}},this.readRenderTargetPixelsAsync=async function(R,X,ut,ot,at,Ot,Gt,Ut=0){if(!(R&&R.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let qt=tt.get(R).__webglFramebuffer;if(R.isWebGLCubeRenderTarget&&Gt!==void 0&&(qt=qt[Gt]),qt)if(X>=0&&X<=R.width-ot&&ut>=0&&ut<=R.height-at){b.bindFramebuffer(O.FRAMEBUFFER,qt);const Kt=R.textures[Ut],oe=Kt.format,ce=Kt.type;R.textures.length>1&&O.readBuffer(O.COLOR_ATTACHMENT0+Ut);const Xt=hh(Kt);if(Xt.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(Xt.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const ye=O.createBuffer();O.bindBuffer(O.PIXEL_PACK_BUFFER,ye),O.bufferData(O.PIXEL_PACK_BUFFER,Ot.byteLength,O.STREAM_READ),O.readPixels(X,ut,ot,at,mt.convert(oe),mt.convert(ce),0),O.bindBuffer(O.PIXEL_PACK_BUFFER,null);const He=Y!==null?tt.get(Y).__webglFramebuffer:null;b.bindFramebuffer(O.FRAMEBUFFER,He);const Le=O.fenceSync(O.SYNC_GPU_COMMANDS_COMPLETE,0);return O.flush(),await ig(O,Le,4),O.bindBuffer(O.PIXEL_PACK_BUFFER,ye),O.getBufferSubData(O.PIXEL_PACK_BUFFER,0,Ot),O.bindBuffer(O.PIXEL_PACK_BUFFER,null),O.deleteBuffer(ye),O.deleteSync(Le),Ot}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(R,X=null,ut=0){const ot=Math.pow(2,-ut),at=Math.floor(R.image.width*ot),Ot=Math.floor(R.image.height*ot),Gt=X!==null?X.x:0,Ut=X!==null?X.y:0;st.setTexture2D(R,0),O.copyTexSubImage2D(O.TEXTURE_2D,ut,0,0,Gt,Ut,at,Ot),b.unbindTexture()},this.copyTextureToTexture=function(R,X,ut=null,ot=null,at=0,Ot=0){let Gt,Ut,qt,Kt,oe,ce,Xt,ye,He;const Le=R.isCompressedTexture?R.mipmaps[Ot]:R.image;if(ut!==null)Gt=ut.max.x-ut.min.x,Ut=ut.max.y-ut.min.y,qt=ut.isBox3?ut.max.z-ut.min.z:1,Kt=ut.min.x,oe=ut.min.y,ce=ut.isBox3?ut.min.z:0;else{const ke=Math.pow(2,-at);Gt=Math.floor(Le.width*ke),Ut=Math.floor(Le.height*ke),R.isDataArrayTexture?qt=Le.depth:R.isData3DTexture?qt=Math.floor(Le.depth*ke):qt=1,Kt=0,oe=0,ce=0}ot!==null?(Xt=ot.x,ye=ot.y,He=ot.z):(Xt=0,ye=0,He=0);const Ae=mt.convert(X.format),an=mt.convert(X.type);let Bt;X.isData3DTexture?(st.setTexture3D(X,0),Bt=O.TEXTURE_3D):X.isDataArrayTexture||X.isCompressedArrayTexture?(st.setTexture2DArray(X,0),Bt=O.TEXTURE_2D_ARRAY):(st.setTexture2D(X,0),Bt=O.TEXTURE_2D),b.activeTexture(O.TEXTURE0),b.pixelStorei(O.UNPACK_FLIP_Y_WEBGL,X.flipY),b.pixelStorei(O.UNPACK_PREMULTIPLY_ALPHA_WEBGL,X.premultiplyAlpha),b.pixelStorei(O.UNPACK_ALIGNMENT,X.unpackAlignment);const pn=b.getParameter(O.UNPACK_ROW_LENGTH),xe=b.getParameter(O.UNPACK_IMAGE_HEIGHT),On=b.getParameter(O.UNPACK_SKIP_PIXELS),ti=b.getParameter(O.UNPACK_SKIP_ROWS),Wi=b.getParameter(O.UNPACK_SKIP_IMAGES);b.pixelStorei(O.UNPACK_ROW_LENGTH,Le.width),b.pixelStorei(O.UNPACK_IMAGE_HEIGHT,Le.height),b.pixelStorei(O.UNPACK_SKIP_PIXELS,Kt),b.pixelStorei(O.UNPACK_SKIP_ROWS,oe),b.pixelStorei(O.UNPACK_SKIP_IMAGES,ce);const Us=R.isDataArrayTexture||R.isData3DTexture,Te=X.isDataArrayTexture||X.isData3DTexture;if(R.isDepthTexture){const ke=tt.get(R),qi=tt.get(X),Pe=tt.get(ke.__renderTarget),Xi=tt.get(qi.__renderTarget);b.bindFramebuffer(O.READ_FRAMEBUFFER,Pe.__webglFramebuffer),b.bindFramebuffer(O.DRAW_FRAMEBUFFER,Xi.__webglFramebuffer);for(let Fs=0;Fs<qt;Fs++)Us&&(O.framebufferTextureLayer(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,tt.get(R).__webglTexture,at,ce+Fs),O.framebufferTextureLayer(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,tt.get(X).__webglTexture,Ot,He+Fs)),O.blitFramebuffer(Kt,oe,Gt,Ut,Xt,ye,Gt,Ut,O.DEPTH_BUFFER_BIT,O.NEAREST);b.bindFramebuffer(O.READ_FRAMEBUFFER,null),b.bindFramebuffer(O.DRAW_FRAMEBUFFER,null)}else if(at!==0||R.isRenderTargetTexture||tt.has(R)){const ke=tt.get(R),qi=tt.get(X);b.bindFramebuffer(O.READ_FRAMEBUFFER,A),b.bindFramebuffer(O.DRAW_FRAMEBUFFER,D);for(let Pe=0;Pe<qt;Pe++)Us?O.framebufferTextureLayer(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,ke.__webglTexture,at,ce+Pe):O.framebufferTexture2D(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,ke.__webglTexture,at),Te?O.framebufferTextureLayer(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,qi.__webglTexture,Ot,He+Pe):O.framebufferTexture2D(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,qi.__webglTexture,Ot),at!==0?O.blitFramebuffer(Kt,oe,Gt,Ut,Xt,ye,Gt,Ut,O.COLOR_BUFFER_BIT,O.NEAREST):Te?O.copyTexSubImage3D(Bt,Ot,Xt,ye,He+Pe,Kt,oe,Gt,Ut):O.copyTexSubImage2D(Bt,Ot,Xt,ye,Kt,oe,Gt,Ut);b.bindFramebuffer(O.READ_FRAMEBUFFER,null),b.bindFramebuffer(O.DRAW_FRAMEBUFFER,null)}else Te?R.isDataTexture||R.isData3DTexture?O.texSubImage3D(Bt,Ot,Xt,ye,He,Gt,Ut,qt,Ae,an,Le.data):X.isCompressedArrayTexture?O.compressedTexSubImage3D(Bt,Ot,Xt,ye,He,Gt,Ut,qt,Ae,Le.data):O.texSubImage3D(Bt,Ot,Xt,ye,He,Gt,Ut,qt,Ae,an,Le):R.isDataTexture?O.texSubImage2D(O.TEXTURE_2D,Ot,Xt,ye,Gt,Ut,Ae,an,Le.data):R.isCompressedTexture?O.compressedTexSubImage2D(O.TEXTURE_2D,Ot,Xt,ye,Le.width,Le.height,Ae,Le.data):O.texSubImage2D(O.TEXTURE_2D,Ot,Xt,ye,Gt,Ut,Ae,an,Le);b.pixelStorei(O.UNPACK_ROW_LENGTH,pn),b.pixelStorei(O.UNPACK_IMAGE_HEIGHT,xe),b.pixelStorei(O.UNPACK_SKIP_PIXELS,On),b.pixelStorei(O.UNPACK_SKIP_ROWS,ti),b.pixelStorei(O.UNPACK_SKIP_IMAGES,Wi),Ot===0&&X.generateMipmaps&&O.generateMipmap(Bt),b.unbindTexture()},this.initRenderTarget=function(R){tt.get(R).__webglFramebuffer===void 0&&st.setupRenderTarget(R)},this.initTexture=function(R){R.isCubeTexture?st.setTextureCube(R,0):R.isData3DTexture?st.setTexture3D(R,0):R.isDataArrayTexture||R.isCompressedArrayTexture?st.setTexture2DArray(R,0):st.setTexture2D(R,0),b.unbindTexture()},this.resetState=function(){F=0,G=0,Y=null,b.reset(),wt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return ui}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=me._getDrawingBufferColorSpace(t),e.unpackColorSpace=me._getUnpackColorSpace()}}function Vu(i,t,e){const n=i-t;return n<0?0:Math.max(0,Math.min(1,1-n/e))}const Hu={type:"change"},$c={type:"start"},gf={type:"end"},Wo=new Ta,Wu=new li,kS=Math.cos(70*qr.DEG2RAD),Xe=new B,Mn=2*Math.PI,we={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},wl=1e-6;class GS extends Gv{constructor(t,e=null){super(t,e),this.state=we.NONE,this.target=new B,this.cursor=new B,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:rs.ROTATE,MIDDLE:rs.DOLLY,RIGHT:rs.PAN},this.touches={ONE:ir.ROTATE,TWO:ir.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._cursorStyle="auto",this._domElementKeyEvents=null,this._lastPosition=new B,this._lastQuaternion=new xn,this._lastTargetPosition=new B,this._quat=new xn().setFromUnitVectors(t.up,new B(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new vu,this._sphericalDelta=new vu,this._scale=1,this._panOffset=new B,this._rotateStart=new Et,this._rotateEnd=new Et,this._rotateDelta=new Et,this._panStart=new Et,this._panEnd=new Et,this._panDelta=new Et,this._dollyStart=new Et,this._dollyEnd=new Et,this._dollyDelta=new Et,this._dollyDirection=new B,this._mouse=new Et,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=HS.bind(this),this._onPointerDown=VS.bind(this),this._onPointerUp=WS.bind(this),this._onContextMenu=JS.bind(this),this._onMouseWheel=YS.bind(this),this._onKeyDown=ZS.bind(this),this._onTouchStart=KS.bind(this),this._onTouchMove=$S.bind(this),this._onMouseDown=qS.bind(this),this._onMouseMove=XS.bind(this),this._interceptControlDown=jS.bind(this),this._interceptControlUp=QS.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}set cursorStyle(t){this._cursorStyle=t,t==="grab"?this.domElement.style.cursor="grab":this.domElement.style.cursor="auto"}get cursorStyle(){return this._cursorStyle}connect(t){super.connect(t),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.state=we.NONE,this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents();const t=this.domElement.getRootNode();t.removeEventListener("keydown",this._interceptControlDown,{capture:!0}),t.removeEventListener("keyup",this._interceptControlUp,{capture:!0}),this._controlActive=!1,this._pointers.length=0,this._pointerPositions={},this.domElement.style.touchAction="",this.domElement.style.cursor="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(t){t.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=t}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(Hu),this.update(),this.state=we.NONE}pan(t,e){this._pan(t,e),this.update()}dollyIn(t){this._dollyIn(t),this.update()}dollyOut(t){this._dollyOut(t),this.update()}rotateLeft(t){this._rotateLeft(t),this.update()}rotateUp(t){this._rotateUp(t),this.update()}update(t=null){const e=this.object.position;Xe.copy(e).sub(this.target),Xe.applyQuaternion(this._quat),this._spherical.setFromVector3(Xe),this.autoRotate&&this.state===we.NONE&&this._rotateLeft(this._getAutoRotationAngle(t)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let n=this.minAzimuthAngle,s=this.maxAzimuthAngle;isFinite(n)&&isFinite(s)&&(n<-Math.PI?n+=Mn:n>Math.PI&&(n-=Mn),s<-Math.PI?s+=Mn:s>Math.PI&&(s-=Mn),n<=s?this._spherical.theta=Math.max(n,Math.min(s,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(n+s)/2?Math.max(n,this._spherical.theta):Math.min(s,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const o=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=o!=this._spherical.radius}if(Xe.setFromSpherical(this._spherical),Xe.applyQuaternion(this._quatInverse),e.copy(this.target).add(Xe),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let o=null;if(this.object.isPerspectiveCamera){const a=Xe.length();o=this._clampDistance(a*this._scale);const l=a-o;this.object.position.addScaledVector(this._dollyDirection,l),this.object.updateMatrixWorld(),r=!!l}else if(this.object.isOrthographicCamera){const a=new B(this._mouse.x,this._mouse.y,0);a.unproject(this.object);const l=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=l!==this.object.zoom;const c=new B(this._mouse.x,this._mouse.y,0);c.unproject(this.object),this.object.position.sub(c).add(a),this.object.updateMatrixWorld(),o=Xe.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;o!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(o).add(this.object.position):(Wo.origin.copy(this.object.position),Wo.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(Wo.direction))<kS?this.object.lookAt(this.target):(Wu.setFromNormalAndCoplanarPoint(this.object.up,this.target),Wo.intersectPlane(Wu,this.target))))}else if(this.object.isOrthographicCamera){const o=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),o!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>wl||8*(1-this._lastQuaternion.dot(this.object.quaternion))>wl||this._lastTargetPosition.distanceToSquared(this.target)>wl?(this.dispatchEvent(Hu),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(t){return t!==null?Mn/60*this.autoRotateSpeed*t:Mn/60/60*this.autoRotateSpeed}_getZoomScale(t){const e=Math.abs(t*.01);return Math.pow(.95,this.zoomSpeed*e)}_rotateLeft(t){this._sphericalDelta.theta-=t}_rotateUp(t){this._sphericalDelta.phi-=t}_panLeft(t,e){Xe.setFromMatrixColumn(e,0),Xe.multiplyScalar(-t),this._panOffset.add(Xe)}_panUp(t,e){this.screenSpacePanning===!0?Xe.setFromMatrixColumn(e,1):(Xe.setFromMatrixColumn(e,0),Xe.crossVectors(this.object.up,Xe)),Xe.multiplyScalar(t),this._panOffset.add(Xe)}_pan(t,e){const n=this.domElement;if(this.object.isPerspectiveCamera){const s=this.object.position;Xe.copy(s).sub(this.target);let r=Xe.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*t*r/n.clientHeight,this.object.matrix),this._panUp(2*e*r/n.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(t*(this.object.right-this.object.left)/this.object.zoom/n.clientWidth,this.object.matrix),this._panUp(e*(this.object.top-this.object.bottom)/this.object.zoom/n.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(t,e){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const n=this.domElement.getBoundingClientRect(),s=t-n.left,r=e-n.top,o=n.width,a=n.height;this._mouse.x=s/o*2-1,this._mouse.y=-(r/a)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(t){return Math.max(this.minDistance,Math.min(this.maxDistance,t))}_handleMouseDownRotate(t){this._rotateStart.set(t.clientX,t.clientY)}_handleMouseDownDolly(t){this._updateZoomParameters(t.clientX,t.clientX),this._dollyStart.set(t.clientX,t.clientY)}_handleMouseDownPan(t){this._panStart.set(t.clientX,t.clientY)}_handleMouseMoveRotate(t){this._rotateEnd.set(t.clientX,t.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const e=this.domElement;this._rotateLeft(Mn*this._rotateDelta.x/e.clientHeight),this._rotateUp(Mn*this._rotateDelta.y/e.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(t){this._dollyEnd.set(t.clientX,t.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(t){this._panEnd.set(t.clientX,t.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(t){this._updateZoomParameters(t.clientX,t.clientY),t.deltaY<0?this._dollyIn(this._getZoomScale(t.deltaY)):t.deltaY>0&&this._dollyOut(this._getZoomScale(t.deltaY)),this.update()}_handleKeyDown(t){let e=!1;switch(t.code){case this.keys.UP:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateUp(Mn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),e=!0;break;case this.keys.BOTTOM:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateUp(-Mn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),e=!0;break;case this.keys.LEFT:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateLeft(Mn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),e=!0;break;case this.keys.RIGHT:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateLeft(-Mn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),e=!0;break}e&&(t.preventDefault(),this.update())}_handleTouchStartRotate(t){if(this._pointers.length===1)this._rotateStart.set(t.pageX,t.pageY);else{const e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._rotateStart.set(n,s)}}_handleTouchStartPan(t){if(this._pointers.length===1)this._panStart.set(t.pageX,t.pageY);else{const e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._panStart.set(n,s)}}_handleTouchStartDolly(t){const e=this._getSecondPointerPosition(t),n=t.pageX-e.x,s=t.pageY-e.y,r=Math.sqrt(n*n+s*s);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enablePan&&this._handleTouchStartPan(t)}_handleTouchStartDollyRotate(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enableRotate&&this._handleTouchStartRotate(t)}_handleTouchMoveRotate(t){if(this._pointers.length==1)this._rotateEnd.set(t.pageX,t.pageY);else{const n=this._getSecondPointerPosition(t),s=.5*(t.pageX+n.x),r=.5*(t.pageY+n.y);this._rotateEnd.set(s,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const e=this.domElement;this._rotateLeft(Mn*this._rotateDelta.x/e.clientHeight),this._rotateUp(Mn*this._rotateDelta.y/e.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(t){if(this._pointers.length===1)this._panEnd.set(t.pageX,t.pageY);else{const e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._panEnd.set(n,s)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(t){const e=this._getSecondPointerPosition(t),n=t.pageX-e.x,s=t.pageY-e.y,r=Math.sqrt(n*n+s*s);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const o=(t.pageX+e.x)*.5,a=(t.pageY+e.y)*.5;this._updateZoomParameters(o,a)}_handleTouchMoveDollyPan(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enablePan&&this._handleTouchMovePan(t)}_handleTouchMoveDollyRotate(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enableRotate&&this._handleTouchMoveRotate(t)}_addPointer(t){this._pointers.push(t.pointerId)}_removePointer(t){delete this._pointerPositions[t.pointerId];for(let e=0;e<this._pointers.length;e++)if(this._pointers[e]==t.pointerId){this._pointers.splice(e,1);return}}_isTrackingPointer(t){for(let e=0;e<this._pointers.length;e++)if(this._pointers[e]==t.pointerId)return!0;return!1}_trackPointer(t){let e=this._pointerPositions[t.pointerId];e===void 0&&(e=new Et,this._pointerPositions[t.pointerId]=e),e.set(t.pageX,t.pageY)}_getSecondPointerPosition(t){const e=t.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[e]}_customWheelEvent(t){const e=t.deltaMode,n={clientX:t.clientX,clientY:t.clientY,deltaY:t.deltaY};switch(e){case 1:n.deltaY*=16;break;case 2:n.deltaY*=100;break}return t.ctrlKey&&!this._controlActive&&(n.deltaY*=10),n}}function VS(i){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(i.pointerId),this.domElement.ownerDocument.addEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(i)&&(this._addPointer(i),i.pointerType==="touch"?this._onTouchStart(i):this._onMouseDown(i),this._cursorStyle==="grab"&&(this.domElement.style.cursor="grabbing")))}function HS(i){this.enabled!==!1&&(i.pointerType==="touch"?this._onTouchMove(i):this._onMouseMove(i))}function WS(i){switch(this._removePointer(i),this._pointers.length){case 0:this.domElement.releasePointerCapture(i.pointerId),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(gf),this.state=we.NONE,this._cursorStyle==="grab"&&(this.domElement.style.cursor="grab");break;case 1:const t=this._pointers[0],e=this._pointerPositions[t];this._onTouchStart({pointerId:t,pageX:e.x,pageY:e.y});break}}function qS(i){let t;switch(i.button){case 0:t=this.mouseButtons.LEFT;break;case 1:t=this.mouseButtons.MIDDLE;break;case 2:t=this.mouseButtons.RIGHT;break;default:t=-1}switch(t){case rs.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(i),this.state=we.DOLLY;break;case rs.ROTATE:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=we.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=we.ROTATE}break;case rs.PAN:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=we.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=we.PAN}break;default:this.state=we.NONE}this.state!==we.NONE&&this.dispatchEvent($c)}function XS(i){switch(this.state){case we.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(i);break;case we.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(i);break;case we.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(i);break}}function YS(i){this.enabled===!1||this.enableZoom===!1||this.state!==we.NONE||(i.preventDefault(),this.dispatchEvent($c),this._handleMouseWheel(this._customWheelEvent(i)),this.dispatchEvent(gf))}function ZS(i){this.enabled!==!1&&this._handleKeyDown(i)}function KS(i){switch(this._trackPointer(i),this._pointers.length){case 1:switch(this.touches.ONE){case ir.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(i),this.state=we.TOUCH_ROTATE;break;case ir.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(i),this.state=we.TOUCH_PAN;break;default:this.state=we.NONE}break;case 2:switch(this.touches.TWO){case ir.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(i),this.state=we.TOUCH_DOLLY_PAN;break;case ir.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(i),this.state=we.TOUCH_DOLLY_ROTATE;break;default:this.state=we.NONE}break;default:this.state=we.NONE}this.state!==we.NONE&&this.dispatchEvent($c)}function $S(i){switch(this._trackPointer(i),this.state){case we.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(i),this.update();break;case we.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(i),this.update();break;case we.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(i),this.update();break;case we.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(i),this.update();break;default:this.state=we.NONE}}function JS(i){this.enabled!==!1&&i.preventDefault()}function jS(i){i.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function QS(i){i.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function vf(i,t={}){const e=!!t.free,n=new Se;n.name="T-800";const s=i("#66727b"),r=i("#232a30"),o=i("#424c53"),a=i("#2b211d"),l=i("#4a4038"),c=new on(1,20,14),h=new Vi(1,1,1),d=new Ce(1,1,1,10),u=[];function f(k,Q,ht,vt,O,Rt){const At=new ve(Q,ht);return At.position.set(...vt),At.scale.set(...O),Rt&&At.rotation.set(...Rt),At.castShadow=!0,At.receiveShadow=!0,k.add(At),u.push(At),At}const g=(k,Q)=>{const ht=new Se;return ht.position.set(...Q),k.add(ht),ht},v=new Se;e||n.add(v),f(v,h,l,[0,1,.1],[1.9,.14,1.6]),f(v,h,l,[0,2.35,-.72],[1.9,2.7,.14]);for(const k of[-1,1])for(const Q of[-1,1])f(v,h,r,[k*.85,.5,Q*.65+.1],[.12,1,.12]);for(const k of[-1,1])f(v,h,l,[k*1,1.72,.35],[.2,.1,1.3]),f(v,h,r,[k*1,1.35,-.1],[.1,.7,.1]);f(v,h,r,[0,.12,.1],[2,.06,1.7]);const m=g(n,[0,0,0]);f(m,h,o,[0,1.25,0],[1.05,.32,.7]),f(m,d,r,[0,1.8,-.1],[.09,1.2,.09]);const p=g(m,[0,2.05,0]);for(let k=0;k<6;k++){const Q=.56-k*.02+(k===2?.05:0);f(p,new Dn(1,.06,6,22),s,[0,-.42+k*.17,.02],[Q,Q*.8,Q*.7],[Math.PI/2,0,0])}f(p,h,s,[0,.05,.38],[.14,1,.1]),f(p,h,o,[0,-.4,-.15],[.9,.14,.3]);const x=new rn({color:"#ff4a22"}),w=f(p,c,x,[0,-.05,.3],[.11,.11,.11]);e||f(p,h,a,[0,.1,.4],[1.25,.16,.14]);const y={};for(const k of[-1,1]){const Q=k<0?"L":"R";f(p,c,s,[k*.72,.5,0],[.2,.2,.2]);const ht=g(p,[k*.72,.5,0]);ht.rotation.x=-.25,f(ht,d,s,[0,-.4,0],[.12,.8,.12]),f(ht,d,o,[k*.13,-.4,.05],[.04,.7,.04]);const vt=g(ht,[0,-.8,0]);f(vt,c,r,[0,0,0],[.15,.15,.15]);const O=g(vt,[0,0,0]);O.rotation.x=-Math.PI/2+.25,f(O,d,s,[0,-.4,0],[.11,.8,.11]),f(O,d,o,[k*.12,-.4,.04],[.035,.7,.035]),e||f(O,h,a,[0,-.45,0],[.28,.16,.28]);const Rt=g(O,[0,-.82,0]);f(Rt,h,r,[0,-.1,0],[.22,.2,.12]);for(let At=0;At<4;At++)f(Rt,h,s,[-.075+At*.05,-.28,0],[.035,.2,.035]);f(Rt,h,s,[k*.14,-.14,.02],[.04,.14,.04],[0,0,k*.5]),y[Q]={sh:ht,el:vt,fa:O,hand:Rt}}const M=g(p,[0,.55,.02]);f(M,d,r,[0,.22,0],[.12,.5,.12]),f(M,d,o,[.08,.22,.06],[.03,.5,.03]);const S=g(M,[0,.78,.05]);f(S,c,s,[0,.1,0],[.42,.5,.46]),f(S,h,s,[0,-.02,.24],[.62,.14,.2]);for(const k of[-1,1])f(S,c,s,[k*.3,-.12,.3],[.12,.1,.1]);const C=[],_=new rn({color:"#ff2a1a"});for(const k of[-1,1])f(S,c,i("#0b0b0b"),[k*.17,0,.38],[.11,.1,.08]),C.push(f(S,c,_,[k*.17,0,.42],[.062,.062,.05]));f(S,h,r,[0,-.1,.43],[.07,.14,.06]),f(S,h,o,[0,.58,-.02],[.34,.08,.3]);const T=g(S,[0,-.18,.12]);f(T,h,s,[0,-.1,.1],[.5,.18,.38]);for(let k=0;k<7;k++)f(T,h,i("#9a9d96"),[-.18+k*.06,0,.28],[.04,.07,.04]);for(let k=0;k<7;k++)f(S,h,i("#9a9d96"),[-.18+k*.06,-.15,.32],[.04,.06,.04]);const L=new Se;S.add(L),L.visible=!1,f(L,h,i("#0c0c0c"),[-.17,0,.5],[.17,.1,.03]),f(L,h,i("#0c0c0c"),[.17,0,.5],[.17,.1,.03]),f(L,h,i("#0c0c0c"),[0,0,.5],[.1,.025,.03]);const I=new ro("#ff3322",6,4,2);I.position.set(0,0,.9),S.add(I);const U={};for(const k of[-1,1]){const Q=k<0?"L":"R",ht=g(m,[k*.32,1.3,.05]);ht.rotation.x=-Math.PI/2,f(ht,c,s,[0,0,0],[.2,.2,.2]),f(ht,d,s,[0,-.5,0],[.17,1,.17]),f(ht,d,o,[k*.16,-.5,0],[.045,.9,.045]);const vt=g(ht,[0,-1,0]);vt.rotation.x=Math.PI/2,f(vt,c,r,[0,0,0],[.18,.18,.18]),f(vt,d,s,[0,-.55,0],[.13,1.1,.13]),f(vt,d,o,[k*.14,-.55,.03],[.04,.9,.04]),e||f(vt,h,a,[0,-.95,0],[.32,.16,.32]);const O=g(vt,[0,-1.1,0]);f(O,h,r,[0,-.04,.18],[.3,.14,.55]),f(O,h,s,[0,.08,-.04],[.22,.2,.2]),U[Q]={hip:ht,knee:vt,foot:O}}e||f(v,h,a,[0,1.14,.15],[1.15,.1,.2]);const N=new Se;N.position.set(1,1.95,.75),N.visible=!1,n.add(N),f(N,d,i("#f5e2a0"),[0,.2,0],[.12,.38,.12]),f(N,d,i("#e84a8d"),[.04,.5,0],[.015,.4,.015],[0,0,-.25]),f(N,d,i("#ff6b5c"),[-.06,.52,0],[.2,.02,.2]),f(N,d,i("#6b3d1f"),[-.06,.36,0],[.01,.34,.01]);const A=new Se;if(n.add(A),A.visible=!1,e){for(const Q of[-1,1]){const ht=Q<0?"L":"R";y[ht].sh.rotation.set(0,0,Q*.1),y[ht].fa.rotation.set(-.18,0,0),U[ht].hip.rotation.set(0,0,0),U[ht].knee.rotation.set(0,0,0)}const k=new Set;v.traverse(Q=>k.add(Q));for(let Q=u.length-1;Q>=0;Q--)k.has(u[Q])&&u.splice(Q,1)}const D={head:S,jaw:T,neck:M,torso:p,body:m,shL:y.L.sh,shR:y.R.sh,faL:y.L.fa,faR:y.R.fa,kneeL:U.L.knee,kneeR:U.R.knee,hipL:U.L.hip,hipR:U.R.hip,footL:U.L.foot,footR:U.R.foot,handL:y.L.hand,handR:y.R.hand},F=Object.fromEntries(Object.entries(D).map(([k,Q])=>[k,Q.rotation.clone()])),G=[];function Y(k,Q,ht,vt=16,O=3.2,Rt=performance.now()/1e3){G.push({name:k,axis:Q,amp:ht,freq:vt,decay:O,t0:Rt})}const V=new B,q={head:S,jaw:T,chest:p,core:w,elbowL:y.L.el,elbowR:y.R.el,handL:y.L.hand,handR:y.R.hand,kneeL:U.L.knee,kneeR:U.R.knee,footL:U.L.foot,footR:U.R.foot},$=Object.keys(q),it={head:["head","jaw"],jaw:["jaw","head"],chest:["torso","body"],core:["torso","head"],elbowL:["shL","faL"],elbowR:["shR","faR"],handL:["faL","shL"],handR:["faR","shR"],kneeL:["kneeL","hipL"],kneeR:["kneeR","hipR"],footL:["kneeL","hipL"],footR:["kneeR","hipR"]};function yt(k){let Q=$[0],ht=1e9;for(const vt of $){q[vt].getWorldPosition(V);const O=V.distanceTo(k);O<ht&&(ht=O,Q=vt)}return Q}function Ft(k,Q=new B){return q[k].getWorldPosition(Q)}function Zt(k,Q=1,ht="shake"){const vt=performance.now()/1e3,[O,Rt]=it[k]||["torso","head"],At=Math.random()<.5?-1:1;if(Y(O,"x",At*.35*Q,18,3.5,vt),Y(O,"z",-At*.18*Q,14,3,vt),Y(Rt,"x",-At*.22*Q,20,3.8,vt),Y("torso","z",At*.08*Q,15,3,vt),Y("head","x",-At*.2*Q,17,3,vt),ht==="magnet"&&(Y("shL","z",.5*Q,3,.9,vt),Y("shR","z",-.5*Q,3,.9,vt)),ht==="tickle")for(let P=0;P<4;P++)Y("head","z",.1*Q,24+P*3,1.4,vt),Y("torso","z",.05*Q,26,1.4,vt);dt=Math.max(dt,.07*Q)}let lt=0,W=0,rt=0,dt=0,Mt=0,_t="idle",Tt=0;new te("#ff2a1a");let kt=new te("#ff2a1a");const ct=new te("#ffb347"),z=new te("#4cf2ff"),et=new te("#ff2a1a"),nt=new te("#fff2e8");function J(k,Q,ht){Tt+=((_t==="break"?1:0)-Tt)*Math.min(1,Q*3),lt+=((_t==="reflect"?1:0)-lt)*Math.min(1,Q*2),W+=(rt-W)*Math.min(1,Q*6);const vt=Math.sin(k*.9)*.02,O=Tt;for(const Rt in D)D[Rt].rotation.copy(F[Rt]);S.rotation.y+=(Math.sin(k*.5)*.08*(1-O)+Math.sin(k*.3)*.02)*(e?.25:1),e&&t.pose&&t.pose(k,Q),S.rotation.x+=vt-O*.45+lt*.42,S.rotation.y*=1-lt*.7,p.rotation.x+=-O*.12+lt*.12,T.rotation.x+=O*.02+(ht?Math.abs(Math.sin(k*13))*.35*Math.abs(Math.sin(k*3.3)+.4):0),W>.02&&(S.rotation.x+=(Math.random()-.5)*.09*W,S.rotation.z+=(Math.random()-.5)*.12*W,p.rotation.z+=Math.sin(k*38)*.035*W,T.rotation.x+=Math.abs(Math.sin(k*21))*.12*W,dt=Math.max(dt,.025*W),Math.random()<.22*W&&(Mt=Math.max(Mt,.9)));for(let Rt=G.length-1;Rt>=0;Rt--){const At=G[Rt],P=k-At.t0;if(P>2.5){G.splice(Rt,1);continue}D[At.name].rotation[At.axis]+=At.amp*Math.exp(-At.decay*P)*Math.sin(At.freq*P)}dt*=Math.exp(-Q*7),m.position.set((Math.random()-.5)*dt,(Math.random()-.5)*dt*.4,(Math.random()-.5)*dt),e||v.position.copy(m.position).multiplyScalar(.4),Mt*=Math.exp(-Q*5),kt.copy(et).lerp(z,O).lerp(ct,lt).lerp(nt,Math.min(1,Mt)),_.color.copy(kt),I.color.copy(kt),I.intensity=(t.eyeScale??1)*(6+(O>.5?0:Math.sin(k*3)*1))*(1+Mt*2)*(O>.5?.35:1)*(1-lt*.65),x.color.setHSL(O>.5?.5:.03+Mt*.1,1,.55+Math.sin(k*4)*.07),L.visible=O>.5,N.visible=O>.5,O>.5&&(N.rotation.z=Math.sin(k*1.7)*.05)}return{root:n,chair:v,nodes:D,hit:Zt,update:J,pickables:u,targets:q,targetNames:$,targetPos:Ft,nearestTarget:yt,head:S,jaw:T,arms:y,legs:U,core:w,setMood(k){_t=k},setDistress(k){rt=k},flash(k=1){Mt=Math.max(Mt,k)},get mood(){return _t}}}const tb=.38,Ir={x0:-2.5,x1:2.5,z0:-2,z1:2,h:3};function eb(i,{dilemma:t=!1,title:e=null}={}){const n=new Dg;n.background=new te("#121a1f"),n.fog=new Vc("#233138",4,12);const s=new BS({antialias:!0,powerPreference:"high-performance"});s.setPixelRatio(Math.min(devicePixelRatio,1.5)),s.setSize(innerWidth,innerHeight),s.outputColorSpace=bn,s.toneMapping=Pc,s.toneMappingExposure=1.08,s.shadowMap.enabled=!0,s.shadowMap.type=Ed,i.appendChild(s.domElement);const r=new wn(53,innerWidth/innerHeight,.05,30);r.position.set(-1.85,1.62,1.6);const o=new GS(r,s.domElement);o.enableDamping=!0,o.enablePan=!1,o.target.set(0,1,-.55),o.minDistance=1,o.maxDistance=4,o.maxPolarAngle=Math.PI*.65;const a=new Hc(new Uint8Array([65,125,185,245]),4,1,Ea);a.minFilter=a.magFilter=en,a.needsUpdate=!0;const l=new Map,c=A=>(l.has(A)||l.set(A,new Pv({color:A,gradientMap:a})),l.get(A)),h=new Se;n.add(h);let d=!1;function u(A,D,F,G,Y=n,V){d&&Y===n&&(Y=h);const q=new ve(A,typeof D=="string"?c(D):D);return q.position.set(...F),q.scale.set(...G),V&&q.rotation.set(...V),q.castShadow=q.receiveShadow=!0,Y.add(q),q}const f=new Vi(1,1,1),g=new Ce(1,1,1,20),v=(A,D,F,G=n,Y)=>u(f,A,D,F,G,Y);v("#586560",[0,-.06,0],[5.2,.12,4.2]);for(const[A,D]of[[[0,1.5,-2.07],[5.2,3,.14]],[[-2.57,1.5,0],[.14,3,4.2]],[[2.57,1.5,0],[.14,3,4.2]],[[0,1.5,2.07],[5.2,3,.14]]].filter(([F])=>!t||F[0]!==2.57))v("#737d77",A,D);for(const[A,D]of[[[0,.45,-1.985],[5,.9,.02]],[[-2.485,.45,0],[.02,.9,4]],[[2.485,.45,0],[.02,.9,4]],[[0,.45,1.985],[5,.9,.02]]].filter(([F])=>!t||F[0]!==2.485))v("#374846",A,D);if(t){for(const[A,D]of[[-1.24,1.66],[1.52,1.1]])v("#737d77",[2.57,1.5,A],[.14,3,D]),v("#374846",[2.485,.45,A],[.02,.9,D]);v("#737d77",[2.57,2.64,.28],[.14,.72,1.38])}for(let A=-2.5;A<=2.5;A+=.5)v("#4a5752",[A,.005,0],[.008,.005,4]);for(let A=-2;A<=2;A+=.5)v("#4a5752",[0,.005,A],[5,.005,.008]);for(let A=0;A<25;A++){const D=Math.sin(A*43.7)*2.3,F=Math.cos(A*17.3)*1.8;v("#505e57",[D,.01,F],[.15+A%3*.04,.005,.008],n,[0,A*.71,0])}for(const A of[-2.45,2.45])u(g,"#242e30",[A,2.8,0],[.025,4,.025],n,[Math.PI/2,0,0]);v("#212c2f",[1.1,2.48,-1.98],[.65,.25,.06]);for(let A=0;A<8;A++)v("#66726d",[.83+A*.076,2.48,-1.938],[.014,.2,.013]);v("#1c282d",[-.72,1.78,-1.97],[2.05,1.05,.09]),v(new De({color:"#183743",metalness:.8,roughness:.2}),[-.72,1.78,-1.91],[1.9,.9,.018]);for(const A of[1.45,2.08])v(new rn({color:"#6e9397",transparent:!0,opacity:.22}),[-.75,A,-1.895],[1.62,.012,.003]);const m=new Se;m.position.set(2.465,0,.3),n.add(m),v("#5d696e",[0,1.06,0],[.05,2.12,.92],m);for(const A of[-.51,.51])v("#202a2e",[-.005,1.09,A],[.08,2.2,.07],m);v("#202a2e",[-.005,2.2,0],[.08,.08,1.06],m),v("#101a1d",[-.04,1.67,0],[.02,.2,.3],m),v("#acb6b2",[-.065,1.04,-.3],[.08,.04,.13],m);for(let A=0;A<4;A++)v("#737f81",[-.055,1.67,-.1+A*.068],[.01,.2,.012],m);d=!0,v("#89948d",[0,.73,.36],[1.48,.085,1.1]),v("#34413e",[0,.678,.36],[1.35,.04,1]);for(const A of[-.62,.62])for(const D of[-.08,.8])v("#394744",[A,.34,D],[.04,.68,.04]);v("#586561",[0,.46,-.66],[.58,.06,.6]),v("#42534e",[0,.76,-.95],[.57,.65,.055]);for(const A of[-.25,.25])for(const D of[-.9,-.42])v("#2b3936",[A,.23,D],[.034,.46,.034]);v("#c5c3ac",[.4,.78,.45],[.3,.012,.24],n,[0,.13,0]),v("#263432",[.32,.79,.6],[.17,.02,.23],n,[0,.13,0]),v("#1d292c",[-.45,.79,.52],[.2,.055,.13]);const p=u(new on(1,8,6),new rn({color:"#be7153"}),[-.51,.823,.52],[.007,.004,.007]);d=!1,h.visible=!t;const x=new Se;x.position.set(1.46,1.8,-1.9),n.add(x),v("#233237",[0,0,0],[.42,.5,.09],x),v("#121e23",[0,.02,.052],[.32,.34,.008],x);for(let A=0;A<12;A++)v("#66746e",[0,-.12+A*.027,.06],[.29,.007,.009],x);const w=u(new on(1,12,8),new rn({color:"#314d43"}),[.12,-.2,.06],[.015,.015,.005],x);v("#263c39",[1.46,2.46,-1.94],[.015,.8,.012]),v("#273337",[-2.22,2.65,-1.69],[.17,.15,.32],n,[-.25,-.4,0]),u(g,"#1a2228",[-2.16,2.6,-1.47],[.04,.07,.04],n,[Math.PI/2,0,0]);function y(A,D,F,G){const Y=document.createElement("canvas");Y.width=768,Y.height=192;const V=Y.getContext("2d");V.fillStyle="#273431",V.fillRect(0,0,768,192),V.fillStyle="#adbfb1",V.font="28px Consolas",V.textAlign="center",V.fillText(A,384,110);const q=new Wg(Y);return q.colorSpace=bn,u(new Ns(D,F),new rn({map:q}),G,[1,1,1])}y(e||(t?"ROOM 08 / THE CONDITION":"INTERVIEW ROOM 07"),1.3,.3,[.2,2.5,-1.97]);const M=vf(c,{free:!0,eyeScale:.035,pose:A=>{const D=M.nodes;D.hipL.rotation.x=D.hipR.rotation.x=-Math.PI/2,D.kneeL.rotation.x=D.kneeR.rotation.x=Math.PI/2,D.shL.rotation.x=D.shR.rotation.x=-.6,D.faL.rotation.x=D.faR.rotation.x=-1.04,D.shL.rotation.z=.05,D.shR.rotation.z=-.05,D.torso.rotation.x=-.025,D.head.rotation.y+=Math.sin(A*.29)*.035}});M.root.scale.setScalar(tb),M.root.position.set(0,.005,-.66),n.add(M.root),M.root.visible=!t,n.add(new Fv("#c9d9d1",1.15));const S=new Ov("#e6ece3",6,2.2,.65);S.position.set(0,2.85,-.1),S.rotation.x=-Math.PI/2,n.add(S),v("#283737",[0,2.91,-.1],[2.3,.07,.73]),v(new rn({color:"#e2e9da"}),[0,2.866,-.1],[2.13,.015,.57]);const C=new Dv("#e1ebdc",21,8,1.05,.7,1.6);C.position.set(-.3,2.8,.15),C.target.position.set(0,.5,-.4),C.castShadow=!0,C.shadow.mapSize.set(1024,1024),C.shadow.bias=-3e-4,n.add(C,C.target);const _=new ro("#7a9db9",2.5,5,2);_.position.set(-1.9,1.9,-1.2),n.add(_);let T=!1;const L={position:new B(-1.85,1.62,1.6),target:new B(0,1,-.55)};function I(){return T=!T,r.position.copy(T?new B(-.9,1.47,.95):L.position),o.target.copy(T?new B(0,1.25,-.66):L.target),o.update(),T}function U(A,D,{speaking:F=!1,question:G=!1,level:Y=0,playing:V=!1}={}){M.update(A,D,F),F&&(M.jaw.rotation.x=Math.min(.42,Y*.9+Math.abs(Math.sin(A*12))*.07)),w.material.color.set(G?"#b5efd0":"#314d43"),p.material.color.set(V?"#b8dcbb":"#be7153"),o.update(),r.position.x=qr.clamp(r.position.x,Ir.x0+.15,Ir.x1-.15),r.position.y=qr.clamp(r.position.y,.3,Ir.h-.15),r.position.z=qr.clamp(r.position.z,Ir.z0+.15,Ir.z1-.15),s.render(n,r)}function N(){r.aspect=innerWidth/innerHeight,r.updateProjectionMatrix(),s.setSize(innerWidth,innerHeight)}return addEventListener("resize",N),{scene:n,renderer:s,bot:M,camera:r,controls:o,door:m,furniture:h,update:U,toggleView:I}}function nb(i){const t=new Se;t.name="DeepSeek",t.scale.setScalar(.38),i.add(t);const e=new De({color:"#225ee8",metalness:.45,roughness:.3}),n=new De({color:"#dceeff",metalness:.55,roughness:.28}),s=new De({color:"#101d38",metalness:.6,roughness:.4}),r=new De({color:"#729db9",metalness:.8,roughness:.25}),o=new De({color:"#97edff",emissive:"#40bfff",emissiveIntensity:1.9,roughness:.28}),a=new Vi(1,1,1),l=new on(1,20,14),c=new Ce(1,1,1,16),h=(_,T,L)=>{const I=new Se;return I.position.set(...T),I.name=L||"",_.add(I),I},d=(_,T,L,I,U,N=0)=>{const A=new ve(T,L);return A.position.set(...I),A.scale.set(...U),A.rotation.z=N,A.castShadow=A.receiveShadow=!0,_.add(A),A},u=(_,T,L,I=0)=>{const U=new Zc;U.moveTo(0,0),U.quadraticCurveTo(.5,.1,.68,.8),U.quadraticCurveTo(.2,.63,-.12,.15),U.closePath();const N=new Ra(U,{depth:.1,bevelEnabled:!0,bevelSegments:2,steps:1,bevelSize:.035,bevelThickness:.025,curveSegments:10});return d(_,N,e,T,L,I)},f=h(t,[0,2.12,0],"torso"),g=h(f,[0,1.05,.05],"head"),v=h(g,[0,-.16,.29],"jaw");d(f,l,e,[0,0,0],[.57,.59,.37]),d(f,l,n,[0,-.07,.23],[.43,.43,.18]),d(f,a,s,[0,-.45,0],[.71,.18,.48]),d(f,c,r,[0,.67,0],[.13,.32,.13]);const m=h(f,[0,.12,.405],"whale-emblem");d(m,l,e,[-.025,0,0],[.17,.085,.025]),d(m,l,o,[-.105,.023,.026],[.017,.017,.009]),d(m,l,e,[.16,.059,0],[.095,.031,.024],.65),d(m,l,e,[.17,-.029,0],[.09,.03,.024],-.5);for(let _=0;_<3;_++)d(f,a,r,[0,-.18-_*.065,.393],[.33-_*.045,.016,.023]);d(g,l,e,[0,.18,0],[.51,.46,.43]),d(g,l,n,[0,-.015,.11],[.445,.25,.37]),d(g,l,s,[0,.18,.343],[.431,.151,.113]);for(const _ of[-1,1]){d(g,a,o,[_*.19,.185,.449],[.18,.042,.024],-_*.075);const T=d(g,c,r,[_*.485,.13,-.015],[.115,.13,.115]);T.rotation.z=Math.PI/2,u(g,[_*.45,.18,-.06],[_*.24,.32,.6],-_*.35)}d(v,l,n,[0,0,0],[.3,.105,.15]),d(v,a,s,[0,.035,.13],[.32,.016,.016]);for(const _ of[-1,1])d(g,l,s,[_*.09,.607,-.055],[.05,.018,.065]);const p=new De({color:"#d8b465",roughness:.95,metalness:0}),x=new De({color:"#aa7b37",roughness:1}),w=h(g,[0,.5,0],"straw-hat");d(w,new Ca(.81,.48,48,1,!0),p,[0,.24,0],[1,1,1]),d(w,new Ce(.94,.94,.035,64),p,[0,0,0],[1,1,1]);for(let _=0;_<5;_++){const T=.8-_*.145,L=d(w,new Dn(T,.009,4,64),x,[0,_*.086+.005,0],[1,1,1]);L.rotation.x=Math.PI/2}for(let _=0;_<24;_++){const T=_*Math.PI/12,L=new qc(new Ne().setFromPoints([new B(Math.cos(T)*.91,.027,Math.sin(T)*.91),new B(Math.cos(T)*.04,.46,Math.sin(T)*.04)]),new Aa({color:"#b78c48"}));w.add(L)}const y=u(f,[0,.04,-.38],[.65,.64,.9]);y.rotation.y=Math.PI/2;const M={},S={},C={head:g,torso:f,jaw:v,neck:f,body:t};for(const[_,T]of[["L",-1],["R",1]]){const L=h(f,[T*.73,.34,0],"sh"+_),I=h(L,[0,-.65,0],"el"+_),U=h(I,[0,0,0],"fa"+_),N=h(U,[0,-.65,0],"hand"+_);d(L,l,s,[0,0,0],[.21,.21,.21]),d(L,l,e,[T*.045,.025,0],[.285,.22,.265]),d(L,c,r,[0,-.35,0],[.105,.55,.105]),d(L,a,n,[0,-.32,.07],[.25,.39,.22]),d(I,l,s,[0,0,0],[.16,.16,.16]),d(U,l,n,[0,-.29,0],[.19,.32,.185]),d(U,a,e,[0,-.3,.153],[.25,.38,.065]),d(U,a,o,[0,-.28,.19],[.035,.23,.016]),u(U,[T*.13,-.42,-.015],[T*.3,.48,.65],T*.12),d(N,a,s,[0,-.035,0],[.26,.24,.21]);for(let G=0;G<3;G++)d(N,a,n,[(G-1)*.075,-.075,.11],[.055,.19,.06]);const A=h(t,[T*.34,1.6,0],"hip"+_),D=h(A,[0,-.7,0],"knee"+_),F=h(D,[0,-.68,.1],"foot"+_);d(A,l,s,[0,0,0],[.18,.18,.18]),d(A,c,r,[0,-.34,0],[.115,.57,.115]),d(A,l,n,[0,-.32,.02],[.19,.31,.19]),d(D,l,s,[0,0,0],[.175,.175,.175]),d(D,l,e,[0,-.025,.13],[.19,.165,.11]),d(D,a,n,[0,-.36,.01],[.29,.51,.28]),d(D,a,e,[0,-.35,.161],[.2,.37,.05]),d(D,a,o,[0,-.35,.19],[.035,.22,.016]),d(F,a,s,[0,-.03,.13],[.39,.16,.59]),d(F,l,e,[0,.025,.18],[.205,.13,.34]),M[_]={sh:L,el:I,fa:U,hand:N},S[_]={hip:A,knee:D,foot:F},Object.assign(C,{["sh"+_]:L,["el"+_]:I,["fa"+_]:U,["hand"+_]:N,["hip"+_]:A,["knee"+_]:D,["foot"+_]:F})}return{root:t,torso:f,head:g,jaw:v,arms:M,legs:S,nodes:C,rigKind:"compact",robotId:"deepseek",baseY:0,update(_,T,L){g.rotation.z=Math.sin(_*1.3)*.023,v.rotation.x=L?Math.abs(Math.sin(_*14))*.28:0,o.emissiveIntensity=1.7+Math.sin(_*2)*.2}}}function ib(i){const t=nb(i);return t.rigKind="compact",t.baseY=0,t.robotId="deepseek",t}const xf=`float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}`,Nr=30,Dr=.287;function sb(i,t=0){return i<=0?0:(.022+i*.115)*(1+t*1.4)}function rb(){const i=new Se,t=3,e=Nr*t,n=new Ns(.034,1,1,12);n.translate(0,.5,0),n.setAttribute("aSeed",new fc(Float32Array.from({length:e},(g,v)=>Math.floor(v/t)*1.73+.37),1));const s={uTime:{value:0},uGas:{value:0},uIgnite:{value:0},uH:{value:0},uCeil:{value:99},uCenter:{value:new B}},r=new Gn({transparent:!0,depthWrite:!1,side:Ge,blending:Ms,uniforms:s,vertexShader:`attribute float aSeed;uniform float uTime,uGas,uIgnite,uH,uCeil;uniform vec3 uCenter;varying vec2 vUv;varying float vSeed;varying float vSquash;
  void main(){vUv=uv;vSeed=aSeed;vec3 p=position;float flick=1.0+sin(uTime*23.0+aSeed*3.1)*.07+sin(uTime*37.0+aSeed*1.7)*.05;float h=uH*flick;
   p.x*=(1.0+uIgnite*.9)*(.75+.5*uv.y);p.y*=h;p.x+=sin(uTime*14.0+aSeed+uv.y*6.0)*.004*uv.y*uv.y;
   vec4 world=modelMatrix*instanceMatrix*vec4(p,1.0);float over=world.y-uCeil;vSquash=0.0;
   if(over>0.0){vec2 r=world.xz-uCenter.xz;float len=max(length(r),1e-4);world.xz+=r/len*over*.85;world.y=uCeil-min(over,.01)*.15;vSquash=clamp(over/max(h,1e-3),0.0,1.0);}
   gl_Position=projectionMatrix*viewMatrix*world;}`,fragmentShader:`uniform float uTime,uGas,uIgnite;varying vec2 vUv;varying float vSeed;varying float vSquash;${xf}
  void main(){float y=vUv.y;float n=noise(vec2(vUv.x*4.0+vSeed,y*6.0-uTime*7.5));float n2=noise(vec2(vUv.x*9.0-vSeed,y*11.0-uTime*13.0));
   float x=abs(vUv.x-.5)*2.0+(n-.5)*.28*y;float env=clamp(pow(max(y,0.0),.32)*pow(max(1.0-y,0.0),.6)*1.85,0.0,1.0);
   float outer=1.0-smoothstep(env*.45,env+.001,x);float coreLen=.38+uGas*.14;float coreW=env*.42*(1.0-smoothstep(coreLen*.55,coreLen,y));
   float core=1.0-smoothstep(coreW*.35,coreW+.001,x);float base=(1.0-smoothstep(0.0,.11,y))*(1.0-smoothstep(0.0,.55,x));float tip=smoothstep(.5,1.0,y);
   vec3 col=vec3(.05,.16,.92)*(.55+.45*n);col=mix(col,vec3(.38,.72,1.0),core*.85);col+=vec3(.7,.88,1.0)*base*.9;col+=vec3(.22,.04,.38)*tip*.35;col+=uIgnite*vec3(.95,.55,.18)*(1.0-core*.5);col*=1.0+vSquash*.25;
   float a=max(outer*(.42+.3*n2)*(1.0-tip*.75),core*.95);a=max(a,base*.9);a*=1.0-vSquash*.3;if(a<.01)discard;gl_FragColor=vec4(col,a*(.75+uGas*.35));}`}),o=new pc(n,r,e),a=new Je;for(let g=0;g<e;g++){const v=Math.floor(g/t),m=v*Math.PI*2/Nr;a.position.set(Math.cos(m)*Dr,0,Math.sin(m)*Dr),a.quaternion.setFromAxisAngle(new B(-Math.sin(m),0,Math.cos(m)),-.35).multiply(new xn().setFromAxisAngle(new B(0,1,0),-m+g%t*Math.PI/t)),a.updateMatrix(),o.setMatrixAt(g,a.matrix)}o.frustumCulled=!1,i.add(o);const l=new rn({color:"#a8d8ff",transparent:!0,opacity:0,depthWrite:!1,blending:Ms}),c=new pc(new on(.0065,6,4),l,Nr);for(let g=0;g<Nr;g++){const v=g*Math.PI*2/Nr;a.position.set(Math.cos(v)*Dr,.002,Math.sin(v)*Dr),a.quaternion.identity(),a.scale.set(1,.6,1),a.updateMatrix(),c.setMatrixAt(g,a.matrix)}i.add(c);const h=new ve(new Dn(Dr,.006,8,64),new rn({color:"#2a6bff",transparent:!0,opacity:0,depthWrite:!1,blending:Ms}));h.rotation.x=Math.PI/2,i.add(h);let d=!1,u=-99,f=0;return{group:i,get ignite(){return s.uIgnite.value},update(g,v,m,p=99,x=1/60){m&&!d&&(u=g),d=m,i.visible=m,f+=(v-f)*Math.min(1,x*6);const w=Math.max(0,1-(g-u)*2.2);return i.updateMatrixWorld(),s.uTime.value=g,s.uGas.value=f,s.uIgnite.value=w,s.uH.value=sb(f,w),s.uCeil.value=p,s.uCenter.value.setFromMatrixPosition(i.matrixWorld),l.opacity=m?.55+f*.35:0,h.material.opacity=m?.1+f*.18+Math.sin(g*21)*.02:0,{height:s.uH.value,ignite:w}}}}function ob(){const i=new Se,t={uTime:{value:0},uOn:{value:0}},e=new Ns(.032,.075,1,8);e.translate(0,.0375,0);const n=new Gn({transparent:!0,depthWrite:!1,side:Ge,blending:Ms,uniforms:t,vertexShader:"uniform float uTime;varying vec2 vUv;void main(){vUv=uv;vec3 p=position;p.x+=sin(uTime*17.0+uv.y*4.0)*.003*uv.y*uv.y;p.y*=1.0+sin(uTime*29.0)*.06;gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.0);}",fragmentShader:`uniform float uTime,uOn;varying vec2 vUv;${xf}void main(){float y=vUv.y;float n=noise(vec2(vUv.x*5.0,y*7.0-uTime*9.0));float x=abs(vUv.x-.5)*2.0+(n-.5)*.2*y;float env=clamp(pow(max(y,0.0),.45)*pow(max(1.0-y,0.0),.7)*2.1,0.0,1.0);
   float body=1.0-smoothstep(env*.35,env+.001,x);float core=1.0-smoothstep(env*.1,env*.45+.001,x);float blue=(1.0-smoothstep(.05,.24,y));
   vec3 col=mix(vec3(1.0,.52,.12),vec3(1.0,.88,.55),core);col=mix(col,vec3(.25,.45,1.0),blue*.8);float a=body*(.55+.35*n)*(1.0-smoothstep(.7,1.0,y)*.6)*uOn;if(a<.01)discard;gl_FragColor=vec4(col,a);}`});for(let r=0;r<2;r++){const o=new ve(e,n);o.rotation.y=r*Math.PI/2,i.add(o)}const s=new ro("#ffb35a",0,.9,2);return s.position.y=.03,i.add(s),{group:i,update(r,o){t.uTime.value=r,t.uOn.value=o?1:0,i.visible=o,s.intensity=o?.35+Math.sin(r*31)*.05:0}}}function Jc(i,t=!1){const e=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),s=new Set(Object.keys(i[0].morphAttributes)),r={},o={},a=i[0].morphTargetsRelative,l=new Ne;let c=0;for(let h=0;h<i.length;++h){const d=i[h];let u=0;if(e!==(d.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const f in d.attributes){if(!n.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+f+'" attribute exists among all geometries, or in none of them.'),null;r[f]===void 0&&(r[f]=[]),r[f].push(d.attributes[f]),u++}if(u!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(a!==d.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const f in d.morphAttributes){if(!s.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;o[f]===void 0&&(o[f]=[]),o[f].push(d.morphAttributes[f])}if(t){let f;if(e)f=d.index.count;else if(d.attributes.position!==void 0)f=d.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;l.addGroup(c,f,h),c+=f}}if(e){let h=0;const d=[];for(let u=0;u<i.length;++u){const f=i[u].index;for(let g=0;g<f.count;++g)d.push(f.getX(g)+h);h+=i[u].attributes.position.count}l.setIndex(d)}for(const h in r){const d=qu(r[h]);if(!d)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;l.setAttribute(h,d)}for(const h in o){const d=o[h][0].length;if(d!==0){l.morphAttributes=l.morphAttributes||{},l.morphAttributes[h]=[];for(let u=0;u<d;++u){const f=[];for(let v=0;v<o[h].length;++v)f.push(o[h][v][u]);const g=qu(f);if(!g)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;l.morphAttributes[h].push(g)}}}return l}function qu(i){let t,e,n,s=-1,r=0;for(let c=0;c<i.length;++c){const h=i[c];if(t===void 0&&(t=h.array.constructor),t!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(e===void 0&&(e=h.itemSize),e!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=h.normalized),n!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=h.gpuType),s!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=h.count*e}const o=new t(r),a=new Bn(o,e,n);let l=0;for(let c=0;c<i.length;++c){const h=i[c];if(h.isInterleavedBufferAttribute){const d=l/e;for(let u=0,f=h.count;u<f;u++)for(let g=0;g<e;g++){const v=h.getComponent(u,g);a.setComponent(u+d,g,v)}}else o.set(h.array,l);l+=h.count*e}return s!==void 0&&(a.gpuType=s),a}const fr=Math.PI*2,hn=(i,t,e)=>[i[0]+(t[0]-i[0])*e,i[1]+(t[1]-i[1])*e,i[2]+(t[2]-i[2])*e],Oe=i=>{const t=new te(i);return[t.r,t.g,t.b]},_f=i=>Math.max(0,Math.min(1,i)),ns=(i,t,e)=>{const n=_f((e-i)/(t-i));return n*n*(3-2*n)},Me={carrotSkin:Oe("#e0761f"),carrotDark:Oe("#9c4a14"),carrotLight:Oe("#f39a3c"),carrotCore:Oe("#f8b85a"),carrotPhloem:Oe("#ee7d22"),carrotCrown:Oe("#7f7a2a"),zDark:Oe("#1f3d1b"),zLight:Oe("#6d8f4c"),zFleck:Oe("#a7bb7a"),zFlesh:Oe("#ebebb6"),zSeedZone:Oe("#d8dc9a"),zRim:Oe("#2c4f25"),zBlossom:Oe("#c2b15a"),tRed:Oe("#c42a1c"),tDeep:Oe("#8e1b12"),tShoulder:Oe("#d8642a"),tWall:Oe("#e2412b"),tGel:Oe("#e8a050"),tCore:Oe("#f2a07a"),pasta:Oe("#e9c27a"),pastaDark:Oe("#c99a4e"),pastaInner:Oe("#d6ac62")};function Xu(i,t,e,n,s,r,o,a=!1){const l=[],c=[],h=[];for(let u=0;u<=n;u++){const f=i+(t-i)*u/n;for(let g=0;g<s;g++){const v=g/s*fr,m=r(f,v);l.push(f-e,m*Math.sin(v),m*Math.cos(v)),c.push(...o(f,v))}}for(let u=0;u<n;u++)for(let f=0;f<s;f++){const g=(f+1)%s,v=u*s+f,m=(u+1)*s+f,p=u*s+g,x=(u+1)*s+g;a?h.push(v,p,m,m,p,x):h.push(v,m,p,m,x,p)}const d=new Ne;return d.setAttribute("position",new ue(l,3)),d.setAttribute("color",new ue(c,3)),d.setIndex(h),d.computeVertexNormals(),d}function El(i,t,e,n,s,r,o=6,a=0){const l=[],c=[],h=[],d=[],u=a<=0,f=u?1:0;u&&(l.push(i-t,0,0),c.push(...s(0,0)),h.push(e,0,0));for(let m=f;m<=o;m++){const p=a+(1-a)*m/o;for(let x=0;x<r;x++){const w=x/r*fr,y=n(i,w)*p;l.push(i-t,y*Math.sin(w),y*Math.cos(w)),c.push(...s(p,w)),h.push(e,0,0)}}const g=m=>(u?1:0)+(m-f)*r;if(u)for(let m=0;m<r;m++)d.push(0,g(1)+m,g(1)+(m+1)%r);for(let m=f;m<o;m++)for(let p=0;p<r;p++){const x=(p+1)%r,w=g(m)+p,y=g(m+1)+p,M=g(m)+x,S=g(m+1)+x;d.push(w,y,M,y,S,M)}for(let m=0;m<d.length;m+=3){const[p,x,w]=[d[m]*3,d[m+1]*3,d[m+2]*3],y=l[x+1]-l[p+1],M=l[x+2]-l[p+2],S=l[w+1]-l[p+1],C=l[w+2]-l[p+2];if((y*C-M*S)*e<0){const _=d[m+1];d[m+1]=d[m+2],d[m+2]=_}}const v=new Ne;return v.setAttribute("position",new ue(l,3)),v.setAttribute("normal",new ue(h,3)),v.setAttribute("color",new ue(c,3)),v.setIndex(d),v}function Yu(i,t,e){const n=Cc(i,t);if(i==="carrot"){const s=Md(n,e),r=Ii(e*2.3+n*31);let o=hn(Me.carrotSkin,Me.carrotLight,r*.45);return o=hn(o,Me.carrotDark,s*.75),n<.06&&(o=hn(Me.carrotCrown,o,ns(0,.06,n))),n>.9&&(o=hn(o,Me.carrotDark,(n-.9)*3)),o}if(i==="zucchini"){const s=vs(Math.floor(n*150),Math.floor(e*9))>.86?.8:0;let r=hn(Me.zDark,Me.zLight,_0(n,e)*.75+Ii(n*40+e*3)*.15);return r=hn(r,Me.zFleck,s*.6),n>.97&&(r=hn(r,Me.zBlossom,(n-.97)/.03)),n<.04&&(r=hn(Me.zLight,r,n/.04)),r}if(i==="tomato"){const s=Sd(n,e);let r=hn(Me.tRed,Me.tDeep,_f(-s)*.55);return r=hn(Me.tShoulder,r,ns(0,.22,n)),hn(r,Me.tShoulder,Ii(e*5+n*13)*.12)}return i==="pasta"?hn(Me.pasta,Me.pastaDark,bd(e)*.6+Ii(t*80+e)*.1):[1,1,1]}function ab(i,t,e,n){if(i==="carrot"){const s=ns(.52,.38,t);let r=hn(Me.carrotPhloem,Me.carrotCore,s);const o=Math.pow(Math.abs(Math.cos(e*6)),12)*ns(.15,.4,t)*ns(.6,.45,t);return r=hn(r,Me.carrotCore,o*.4),t>.96?Me.carrotSkin:r}if(i==="zucchini"){if(t>.95)return Me.zRim;const s=ns(.5,.38,t);return hn(Me.zFlesh,Me.zSeedZone,s)}if(i==="tomato"){if(t>.83)return Me.tWall;if(t<.24)return Me.tCore;const s=fr/4,r=Math.abs((e%s+s)%s-s/2),o=ns(.13,.06,Math.abs(r-s/2)*t);return hn(Me.tGel,Me.tWall,Math.max(o,ns(.7,.83,t)))}return Me.pasta}function lb(i,t,e,n,s){const r=[],o=n*.0016;if(i==="tomato")for(let l=0;l<4;l++)for(let c=0;c<4;c++){const h=(l+.5)*fr/4+(c-1.5)*.17+(vs(s.id,l*7+c)-.5)*.06,d=.42+.16*vs(l,c+3),u=In(i,t)*d,f=new on(1,6,4);f.scale(.0014,.0062,.0042).rotateX(-h).translate(t-e+o,u*Math.sin(h),u*Math.cos(h)),r.push(f)}if(i==="zucchini")for(let l=0;l<3;l++)for(let c=0;c<3;c++){const h=l*fr/3+(c-1)*.32,d=.26+.05*c%2,u=In(i,t)*d,f=new on(1,6,4);f.scale(.0012,.0075,.0035).rotateX(-h).translate(t-e+o,u*Math.sin(h),u*Math.cos(h)),r.push(f)}if(!r.length)return null;const a=Jc(r);return r.forEach(l=>l.dispose()),a}function cb(i){const t=[],e=[];i.forEach((s,r)=>{if(t.push(s.c.x+s.side.x*s.w,s.c.y+s.side.y*s.w,s.c.z+s.side.z*s.w,s.c.x-s.side.x*s.w,s.c.y-s.side.y*s.w,s.c.z-s.side.z*s.w),r){const o=(r-1)*2;e.push(o,o+1,o+2,o+1,o+3,o+2)}});const n=new Ne;return n.setAttribute("position",new ue(t,3)),n.setIndex(e),n.computeVertexNormals(),n}function hb(i,t,e,n,s){const r=wd(i,t,e)+s;return new B(t-n,r*Math.sin(e),r*Math.cos(e))}function ub(i,t,e){const n=ze[i.type],s=n.length/2,r=i.a<=-s+1e-6,o=i.b>=s-1e-6,a=(l,c)=>{if(!l.length)return;const h=Jc(l);l.forEach(u=>u.dispose());const d=new ve(h,c);return e.add(d),d};if(i.type==="carrot"&&r){const l=[],c=[],h=i.a-t;for(let d=0;d<9;d++){const u=d*2.4+vs(i.id,d)*.5,f=.35+vs(d,i.id)*.55,g=.07+vs(d,9)*.07,v=new B(-Math.cos(f),Math.sin(f)*Math.abs(Math.cos(u))*1.1+.15,Math.sin(f)*Math.sin(u)).normalize(),m=new xn().setFromUnitVectors(new B(0,1,0),v),p=new Ce(.0013,.0032,g,5,1).translate(0,g/2,0).applyQuaternion(m).translate(h+.006,Math.sin(u)*.008,Math.cos(u)*.008);l.push(p);for(let x=0;x<4;x++){const w=.45+x*.17,y=new on(1,5,3).scale(.011,.0018,.0055).rotateY(x*1.3+d).translate(0,g*w,0).applyQuaternion(m).translate(h+.006,Math.sin(u)*.008,Math.cos(u)*.008);c.push(y)}}a(l,new De({color:"#5f8a32",roughness:.7})),a(c,new De({color:"#4f8a2a",roughness:.65,side:Ge}))}if(i.type==="zucchini"){if(r){const l=new Ce(.012,.019,.05,6,2).rotateZ(Math.PI/2).translate(i.a-t-.016,.002,0);a([l],new De({color:"#8d9a5c",roughness:.85,flatShading:!0}))}if(o){const l=new on(.011,8,6).scale(.5,1,1).translate(i.b-t-.001,0,0);a([l],new De({color:"#6d5a2c",roughness:.9}))}}if(i.type==="tomato"&&r){const l=[];for(let c=0;c<5;c++){const h=c*fr/5+vs(i.id,c)*.3,d=[];for(let u=0;u<=7;u++){const f=u/7,g=.004+f*.1,v=-s+g*n.length,m=h+Math.sin(f*3)*.08,p=hb("tomato",v,m,t,.0025),x=new B(0,Math.cos(m),-Math.sin(m));d.push({c:p,side:x,w:.012*Math.sin(Math.min(1,f*1.4+.12)*Math.PI)*(1-f*.5)+8e-4})}l.push(cb(d))}a(l,new De({color:"#3f6e25",roughness:.7,side:Ge})),a([new Ce(.0045,.006,.03,6).rotateZ(Math.PI/2).translate(i.a-t-.008,0,0)],new De({color:"#567a30",roughness:.8}))}}function db(i){const t=ze[i.type],e=i.type,n=new Se,s=(i.a+i.b)/2,r=(i.b-i.a)/t.length,o=new(e==="tomato"?Pi:De)({color:"#ffffff",vertexColors:!0,roughness:e==="tomato"?.32:e==="zucchini"?.42:e==="pasta"?.78:.66,...e==="tomato"?{clearcoat:.6,clearcoatRoughness:.25}:{}}),a=new Pi({color:"#ffffff",vertexColors:!0,roughness:e==="tomato"?.18:.5,clearcoat:e==="tomato"?1:.35,clearcoatRoughness:.2,side:Ge}),l=e==="pasta"?56:e==="zucchini"||e==="tomato"?40:28,c=Math.max(4,Math.round((e==="carrot"?96:e==="tomato"?26:e==="pasta"?6:40)*Math.max(.12,r))),h=(d,u)=>wd(e,d,u);if(n.add(new ve(Xu(i.a,i.b,s,c,l,h,(d,u)=>Yu(e,d,u)),o)),e==="pasta"){const d=(u,f)=>In(e,u)*Lh;n.add(new ve(Xu(i.a,i.b,s,c,24,d,(u,f)=>Me.pastaInner,!0),o))}for(const[d,u,f]of[[i.a,-1,i.a<=-t.length/2+1e-6],[i.b,1,i.b>=t.length/2-1e-6]]){let g,v;e==="pasta"?(g=El(d,s,u,h,()=>Me.pasta,l,1,Lh),v=o):f?(g=El(d,s,u,h,(p,x)=>Yu(e,d,x),l,1),v=o):(g=El(d,s,u,h,(p,x)=>ab(e,p,x),l,e==="tomato"?14:9),v=a);const m=new ve(g,v);if(m.userData.cutFace=f?null:u<0?"a":"b",m.userData.capX=d,n.add(m),!f&&e!=="pasta"){const p=lb(e,d,s,u,i);p&&n.add(new ve(p,new Pi({color:e==="tomato"?"#f1dc8a":"#f4f0c8",roughness:.3,clearcoat:.8})))}}return ub(i,s,n),n.traverse(d=>{d.isMesh&&(d.castShadow=d.receiveShadow=!0,d.userData.foodId=i.id)}),n.userData.foodId=i.id,{root:n,skin:o,skins:[o,a],base:new te("#ffffff"),robot:null,tail:null}}function Zu(i){if(i.type!=="claude")return db(i);const t=ze[i.type],e=new Se,n=new De({color:i.type==="claude"?"#a1bcb4":t.skin,roughness:.56,metalness:i.type==="claude"?.45:0}),s=new De({color:t.inside,roughness:.74}),r=(i.a+i.b)/2,o=[];for(let d=0;d<=20;d++){const u=i.a+(i.b-i.a)*d/20;o.push(new Et(In(i.type,u),u-r))}const a=new ve(new Kc(o,32).rotateZ(-Math.PI/2),n);if(e.add(a),i.type==="claude"){a.scale.set(1,.94,.68),n.metalness=.62,n.roughness=.35;const d=a.geometry.attributes.position,u=[];for(let f=0;f<d.count;f++){const g=qr.clamp((d.getY(f)/t.radius+1)/2,0,1),v=new te("#dbe5ce").lerp(new te("#78998f"),g);u.push(v.r,v.g,v.b)}a.geometry.setAttribute("color",new ue(u,3)),n.vertexColors=!0}for(const d of[i.a,i.b]){if(d===i.a&&i.internalLeft||d===i.b&&i.internalRight)continue;const u=new ve(new oo(In(i.type,d),32).rotateY(d===i.a?-Math.PI/2:Math.PI/2),s);u.position.x=d-r,e.add(u);const f=new ve(new so(In(i.type,d)*.86,In(i.type,d),32).rotateY(d===i.a?-Math.PI/2:Math.PI/2),n);f.position.x=d-r+(d===i.a?-4e-4:4e-4),e.add(f),i.type==="claude"&&(u.scale.set(1,.94,.68),f.scale.set(1,.94,.68))}let l=null,c=null;if(i.type==="claude"){let u=function(m,p){const x=new Zc;p.forEach(([y,M],S)=>S?x.lineTo(y,M):x.moveTo(y,M)),x.closePath();const w=new ve(new Ra(x,{depth:.004,bevelEnabled:!1,steps:1}),d);return w.position.z=-.002,m.add(w),w};var h=u;if(i.head){l=vf(p=>new De({color:p,metalness:.8,roughness:.29}),{free:!0,eyeScale:0});const m=l.nodes.torso;e.add(m),m.position.set(-t.length/2-r+.1,.015,0),m.scale.setScalar(.12),m.quaternion.setFromRotationMatrix(new Ee().makeBasis(new B(0,0,1),new B(-1,0,0),new B(0,-1,0))),l.head.rotation.set(-Math.PI/2,0,0),l.head.userData.fishForward=!0;for(const[p,x]of Object.entries(l.arms))x.sh.rotation.set(.12,0,p==="L"?-.14:.14),x.fa.rotation.x=-.12,x.sh.scale.setScalar(.72);l.head.traverse(p=>{p.isPointLight&&(p.visible=!1)})}const d=new De({color:"#65938d",metalness:.38,roughness:.48,side:Ge,transparent:!0,opacity:.94});if(i.b>=t.length/2-.001){c=new Se,c.position.x=i.b-r,e.add(c),u(c,[[0,.013],[.145,.112],[.118,.036],[.074,0],[.118,-.036],[.145,-.112],[0,-.013]]);for(const m of[-1,1])for(let p=0;p<5;p++){const x=new B(.09+p*.012,m*(.025+p*.02),.0025),w=new qc(new Ne().setFromPoints([new B(.006,0,.0025),x]),new Aa({color:"#3d6966",transparent:!0,opacity:.6}));c.add(w)}}const f=Math.max(-.12,i.a),g=Math.min(.12,i.b);if(g>f){const m=x=>x<-.02?.085+(x+.12)/.1*.083:.168-(x+.02)/.14*.103,p=[[f-r,In("claude",f)*.8],[f-r,m(f)]];f<-.02&&g>-.02&&p.push([-.02-r,.168]),p.push([g-r,m(g)],[g-r,In("claude",g)*.8]),u(e,p)}const v=[];for(let m=-t.length/2+.023;m<i.b-.008;m+=.027)if(!(m<i.a+.008))for(let p=0;p<8;p++){const x=p*Math.PI/4+Math.round(m/.027)%2*.39,w=In("claude",m),y=new on(1,7,4);y.scale(Math.min(.016,w*.3),8e-4,Math.min(.01,w*.25)).rotateX(Math.PI/2-x).translate(m-r,Math.sin(x)*w*.94,Math.cos(x)*w*.68),v.push(y)}if(v.length){const m=Jc(v);v.forEach(p=>p.dispose()),e.add(new ve(m,new De({color:"#779990",metalness:.4,roughness:.6})))}}return e.traverse(d=>{d.isMesh&&(d.castShadow=d.receiveShadow=!0,d.userData.foodId=i.id)}),e.userData.foodId=i.id,{root:e,skin:n,base:new te(i.type==="claude"?"#a1bcb4":t.skin),robot:l,tail:c}}function fb(i){if(i.type!=="claude"||!i.links?.length)return Zu(i);const t=new Se,e=[],n=[];let s=null,r=null;return i.links.forEach((o,a)=>{const l=Zu({...i,a:o.a,b:o.b,head:!!i.head&&a===0,internalLeft:a>0,internalRight:a<i.links.length-1});if(l.root.traverse(c=>{c.isMesh&&(c.userData.linkIndex=a)}),a<i.links.length-1){const c=l.skin.clone();c.vertexColors=!1;const h=new ve(new on(In("claude",o.b),16,10),c);h.scale.set(.7,.94,.68),h.position.x=(o.b-o.a)/2,h.castShadow=h.receiveShadow=!0,h.userData={foodId:i.id,linkIndex:a},l.root.add(h),n.push(c)}t.add(l.root),e.push(l),n.push(l.skin),s||=l.robot,r||=l.tail}),{root:t,parts:e,skins:n,skin:e[0].skin,base:e[0].base,robot:s,tail:r}}function pb(i){i.root.traverse(t=>{if(t.geometry?.dispose(),t.material)for(const e of Array.isArray(t.material)?t.material:[t.material])e.dispose()}),i.root.removeFromParent()}function mb(i,t){const e=i==="oil"?[[.007,.067],[.298,.06],[.363,.02],[.393,.018]]:[[.007,.089],[.225,.082]],n=28,s=[],r=[],o=(p,x)=>p[0]*x[0]+p[1]*x[1],a=([p,x])=>Array.from({length:n},(w,y)=>[x*Math.cos(y*2*Math.PI/n),p,x*Math.sin(y*2*Math.PI/n)]),l=e.map(a);s.push([...l[0]].reverse(),l.at(-1));for(let p=0;p<l.length-1;p++)for(let x=0;x<n;x++)s.push([l[p][x],l[p][(x+1)%n],l[p+1][(x+1)%n],l[p+1][x]]);for(let p=0;p<e.length-1;p++){const[x,w]=e[p],[y,M]=e[p+1],S=Math.max(2,Math.round((y-x)*100));for(let C=0;C<S;C++){const _=(C+.5)/S,T=x+(y-x)*_,L=w+(M-w)*_;for(let I=0;I<48;I++){const U=L*Math.sqrt((I+.5)/48),N=I*2.399963;r.push({p:[U*Math.cos(N),T,U*Math.sin(N)],w:L*L*(y-x)/S})}}}const c=new Ne,h=new Float32Array(8192*3);c.setAttribute("position",new Bn(h,3).setUsage(tg));const d=new ve(c,t);d.frustumCulled=!1;let u=-99,f=-1,g=[0,1],v=[];function m(p,x){if(p=Math.max(0,Math.min(1,p)),d.visible=p>.003,!d.visible||Math.abs(p-f)<.001&&Math.abs(x-u)<.003)return;(Math.abs(x-u)>=.003||!v.length)&&(g=[-Math.sin(x),Math.cos(x)],v=r.map(I=>({h:o(I.p,g),w:I.w})).sort((I,U)=>I.h-U.h)),u=x,f=p;const w=v.reduce((I,U)=>I+U.w,0),y=w*p;let M=0,S=v.at(-1).h;for(const I of v)if(M+=I.w,M>=y){S=I.h;break}const C=[],_=[];for(const I of s){const U=[];for(let N=0;N<I.length;N++){const A=I[N],D=I[(N+1)%I.length],F=o(A,g)-S,G=o(D,g)-S;if(F<=0&&U.push(A),F<0!=G<0){const Y=F/(F-G),V=A.map((q,$)=>q+(D[$]-q)*Y);U.push(V),_.push(V)}}U.length>=3&&C.push(U)}const T=[];for(const I of _)T.some(U=>Math.hypot(...I.map((N,A)=>N-U[A]))<1e-6)||T.push(I);if(T.length>=3){const I=[0,0,0];T.forEach(N=>N.forEach((A,D)=>I[D]+=A/T.length));const U=N=>Math.atan2(N[2]-I[2],(N[0]-I[0])*g[1]-(N[1]-I[1])*g[0]);T.sort((N,A)=>U(N)-U(A)),C.push(T)}let L=0;for(const I of C)for(let U=1;U<I.length-1;U++)for(const N of[I[0],I[U],I[U+1]])h.set(N,L*3),L++;c.setDrawRange(0,L),c.attributes.position.needsUpdate=!0,c.computeVertexNormals()}return t.side=Ge,{mesh:d,update:m}}const Li=.42,gb=[fe.x,1.056,fe.z],yf=240,vb=16,xb=18,qo=9.81,Sn=(i,t,e)=>Math.max(t,Math.min(e,i)),Mf=i=>i.vessel==="pot"?.28:.112,Mc=i=>.035+Math.max(0,i.water)*.21+Math.max(0,i.oil)*.012;function na(i,t){const[e,n,s,r]=i,[o,a,l]=t,c=r*o+n*l-s*a,h=r*a+s*o-e*l,d=r*l+e*a-n*o,u=-e*o-n*a-s*l;return[c*r+u*-e+h*-s-d*-n,h*r+u*-n+d*-e-c*-s,d*r+u*-s+c*-n-h*-e]}const _b=(i,t)=>na([-i[0],-i[1],-i[2],i[3]],t);function ga(i,t){return Math.abs(i-le.x)<le.width/2&&Math.abs(t-le.z)<le.depth/2?.966:Math.abs(i-fe.x)<.55&&Math.abs(t-fe.z)<.525?.96:i>-1.655&&i<1.695&&t>-.59&&t<.81?.8825:.015}function Sf(i){const t=i.panPose;return{position:t?.position||gb,quaternion:t?.quaternion||[0,0,0,1],velocity:t?.velocity||[0,0,0]}}function jc(i){const t=Jn[i.kind],e=Sn(i.amount/t.capacity,0,1);return t.minTilt+(t.maxTilt-t.minTilt)*(1-e)}function yb(i){if(!(i.amount>1e-6))return 0;const t=i.tilt-jc(i);if(t<=0)return 0;const e=Jn[i.kind];return e.rate*Math.pow(Math.min(1,t/.55),1.4)*(.45+.55*Math.sqrt(i.amount/e.capacity))}function Sc(i){const t=Jn[i.kind],e=[Math.cos(i.yaw),0,Math.sin(i.yaw)],n=Math.sin(i.tilt),s=Math.cos(i.tilt),r=[e[0]*n,s,e[2]*n],o=[e[0]*s,-n,e[2]*s],[a,l]=t.spout,c=[i.pos[0]+r[0]*l+o[0]*a,i.pos[1]+r[1]*l+o[1]*a,i.pos[2]+r[2]*l+o[2]*a],h=Sn((i.tilt-jc(i))/.55,0,1),d=t.speed*(.45+.55*h),u=d*(.45+.55*Math.min(1,Math.abs(n)));return{pos:c,axis:r,velocity:[e[0]*u,-.18*d,e[2]*u]}}function Qc(){return{time:0,particles:[],ripples:[],puddles:[],splashes:[],events:[],pending:{oil:0,water:0,panoil:0,panwater:0},rimEmit:null,slosh:{x:0,z:0,vx:0,vz:0},lastVel:null,panSpill:0}}function Mb(i){Object.assign(i,Qc())}function Sb(i,t){return i.pending[t]+i.pending["pan"+t]+i.particles.reduce((e,n)=>e+(n.kind===t?n.vol:0),0)}function Ss(i,t){return Math.max(0,i[t])*Jn[t].unit}function bb(i,t,e,n,s){const r=Jn[e],o=n/r.unit;if(e==="water"){const a=Math.max(0,i.water),l=i.oil>.02&&i.temp>120&&a<.035;i.temp=(i.temp*(a+.03)+18*o)/(a+.03+o),i.water+=o,l&&t.events.push({type:"spatter",at:s})}else i.oil+=o;i.poured[e]+=n,t.events.push({type:"hit",kind:e,vol:n,at:s}),t.ripples.length<xb&&t.ripples.push({kind:e,x:s[0],y:s[1],z:s[2],born:t.time})}function wb(i,t,e,n,s,r,o,a=!1){i.spilled[e]+=o,t.events.push({type:"spill",kind:e,vol:o,at:[n,s,r],fromPan:a});let l=null,c=1/0;for(const h of t.puddles){if(h.kind!==e)continue;const d=Math.hypot(h.x-n,h.z-r)-h.radius;d<c&&(c=d,l=h)}if(l&&(c<.03||t.puddles.length>=vb)){const h=l.vol/(l.vol+o);l.x=l.x*h+n*(1-h),l.z=l.z*h+r*(1-h),l.vol+=o}else t.puddles.push(l={kind:e,x:n,y:s,z:r,vol:o,born:t.time});l.y=Math.max(l.y,s),l.radius=.02+Math.sqrt(l.vol)*.26}function Xo(i,t,e,n,s,r,o={}){const a=o.fromPan?"pan"+t:t;i.pending[a]+=e;const l=Jn[t].drop;let c=0;for(;i.pending[a]>1e-9&&(i.pending[a]>=l*.999||e===0)&&i.particles.length<yf&&c++<14;){const h=Math.min(l,i.pending[a]);i.pending[a]-=h;const d=()=>(Math.random()-.5)*r;i.particles.push({kind:t,vol:h,age:0,p:[n[0]+d()*.02,n[1],n[2]+d()*.02],v:[s[0]+d(),s[1]+d()*.5,s[2]+d()],...o})}}function Ku(i,t,e,n,s){for(let r=0;r<n&&i.splashes.length<90;r++){const o=Math.random()*Math.PI*2,a=.25+Math.random()*.5;i.splashes.push({kind:t,age:0,p:[...e],v:[Math.cos(o)*a*.6,s*(.4+Math.random()*.6),Math.sin(o)*a*.6]})}}function Eb(i,t,e){if(e=Sn(Number.isFinite(e)?e:0,0,.05),t.time+=e,t.events=[],!e)return t.events;const n=Sf(i),s=n.position,r=n.quaternion,o=Mf(i);for(const p of Object.values(i.containers))if(Jn[p.kind],p.rate=yb(p),p.rate>0){let x=Math.min(p.amount,p.rate*e);p.amount-x<1e-7&&(x=p.amount),p.amount-=x;const w=Sc(p);Xo(t,p.kind,x,w.pos,w.velocity,p.kind==="water"?.16:.04)}else if(t.pending[p.kind]>0){const x=Sc(p);Xo(t,p.kind,0,x.pos,x.velocity,.1)}for(let p=t.particles.length-1;p>=0;p--){const x=t.particles[p];x.age+=e,x.v[1]-=qo*e;const w=x.kind==="oil"?.4:.15;for(let _=0;_<3;_++)x.v[_]*=1-w*e,x.p[_]+=x.v[_]*e;const y=[x.p[0]-s[0],x.p[1]-s[1],x.p[2]-s[2]],M=_b(r,y),S=Math.hypot(M[0],M[2]);if(!(x.fromPan&&x.age<.25)&&S<Li&&M[1]<o&&M[1]>-.05){const _=na(r,[M[0],Math.min(Mc(i),o),M[2]]),T=[s[0]+_[0],s[1]+_[1],s[2]+_[2]];bb(i,t,x.kind,x.vol,T),Math.random()<(x.kind==="water"?.35:.12)&&Ku(t,x.kind,T,x.kind==="water"?2:1,x.kind==="water"?1:.5),t.particles.splice(p,1);continue}if(!x.deflected&&S>=Li&&S<Li+.06&&M[1]<o+.02&&M[1]>-.05){x.deflected=!0;const _=na(r,[M[0]/S,0,M[2]/S]);x.v[0]=_[0]*.6,x.v[2]=_[2]*.6,x.v[1]=Math.abs(x.v[1])*.2}const C=ga(x.p[0],x.p[2]);(x.p[1]<=C||x.age>4)&&(wb(i,t,x.kind,x.p[0],C,x.p[2],x.vol,!!x.fromPan),Math.random()<.2&&Ku(t,x.kind,[x.p[0],C,x.p[2]],1,.5),t.particles.splice(p,1))}for(let p=t.splashes.length-1;p>=0;p--){const x=t.splashes[p];x.age+=e,x.v[1]-=qo*e;for(let w=0;w<3;w++)x.p[w]+=x.v[w]*e;x.age>.6&&t.splashes.splice(p,1)}t.ripples=t.ripples.filter(p=>t.time-p.born<.9);const a=n.velocity,l=t.lastVel||a,c=Sn((a[0]-l[0])/e,-25,25),h=Sn((a[2]-l[2])/e,-25,25);t.lastVel=[...a];const d=7,u=i.water>.035?.09:.3,f=t.slosh,g=Sn(-c/qo,-.6,.6),v=Sn(-h/qo,-.6,.6);f.vx+=(-d*d*(f.x-g)-2*u*d*f.vx)*e,f.vz+=(-d*d*(f.z-v)-2*u*d*f.vz)*e,f.x=Sn(f.x+f.vx*e,-.8,.8),f.z=Sn(f.z+f.vz*e,-.8,.8);const m=Ss(i,"water")+Ss(i,"oil");if(t.panSpill=0,m>1e-6){const p=na(r,[0,1,0]),x=Math.acos(Sn(p[1],-1,1)),w=Li*(Math.tan(Math.min(x,1.35))+Math.hypot(f.x,f.z)),y=Mc(i)+w-o*Math.cos(Math.min(x,1.35));if(y>0){let M=[p[0]+f.x,0,p[2]+f.z];const S=Math.hypot(M[0],M[2]);M=S>1e-4?[M[0]/S,0,M[2]/S]:[1,0,0];let C=Math.min(m,(.4+30*y)*e);t.panSpill=C/e;const _=[s[0]+p[0]*o+M[0]*(Li+.07),s[1]+p[1]*o,s[2]+p[2]*o+M[2]*(Li+.07)],T=[M[0]*.45+a[0],.05+a[1],M[2]*.45+a[2]];t.rimEmit={pos:_,vel:T};for(const L of["oil","water"]){const I=Ss(i,L),U=Math.min(I,C);U<=0||(i[L]-=U/Jn[L].unit,i[L]<1e-12&&(i[L]=0),C-=U,Xo(t,L,U,_,T,.12,{fromPan:!0}),t.events.push({type:"overflow",kind:L,vol:U}))}}}if(t.rimEmit&&!t.panSpill)for(const p of["oil","water"])t.pending["pan"+p]>0&&Xo(t,p,0,t.rimEmit.pos,t.rimEmit.vel,.12,{fromPan:!0});return t.events}function Tb(i,t,e,n){const s=1-Math.exp(-n*14);if(t.held&&e){const r=Math.max(e[1],ga(e[0],e[2])+.005);t.pos=[t.pos[0]+(Sn(e[0],-1.7,1.7)-t.pos[0])*s,t.pos[1]+(Sn(r,.88,1.95)-t.pos[1])*s,t.pos[2]+(Sn(e[2],-.6,.8)-t.pos[2])*s]}if(t.held&&!t.manualYaw){const r=Sf(i).position,o=r[0]-t.pos[0],a=r[2]-t.pos[2];if(Math.hypot(o,a)>.08){let l=Math.atan2(a,o)-t.yaw;l=Math.atan2(Math.sin(l),Math.cos(l)),t.yaw+=l*Math.min(1,n*6)}}else if(!t.held){t.tilt=Math.max(0,t.tilt-n*2.5);const r=ga(t.pos[0],t.pos[2]);t.pos[1]+=(r-t.pos[1])*Math.min(1,n*8)}t.tilt=Sn(t.tilt,0,2.3)}const ts={water:{color:"#b9e2ea",opacity:.55,rough:.04,surface:"#9fcbd0"},oil:{color:"#e2b33a",opacity:.86,rough:.12,surface:"#d9ad38"}};function Ab(i,t,e,n){const s=new Se;i.add(s);const r={},o=(I,U)=>new Pi({color:I,transparent:!0,opacity:U,roughness:.08,metalness:.05,clearcoat:1,side:Ge,depthWrite:!1});function a(I){const U=new Se,N=new Se;U.add(N),s.add(U);const A=Jn[I],D=[],F=(V,q,$=[0,0,0])=>{const it=new ve(V,q);return it.position.set(...$),it.castShadow=!0,it.userData.container=I,N.add(it),D.push(it),it};let G;if(I==="oil")F(new Ce(.066,.074,.3,28,1,!0),o("#9fb060",.42),[0,.15,0]),F(new Ce(.074,.074,.006,28),o("#9fb060",.6),[0,.003,0]),F(new Ce(.024,.064,.07,24,1,!0),o("#9fb060",.45),[0,.335,0]),F(new Ce(.022,.024,.03,20,1,!0),o("#9fb060",.5),[0,.385,0]),F(new Dn(.023,.004,6,20),new De({color:"#c9b46a",metalness:.6,roughness:.3}),[0,.4,0]).rotation.x=Math.PI/2,F(new Ce(.0745,.0745,.11,28,1,!0,-.9,1.8),new De({color:"#efe2b4",roughness:.8,side:Ge}),[0,.15,0]),G=F(new Ce(.061,.068,1,24),new Pi({color:"#d9a92c",transparent:!0,opacity:.8,roughness:.1,clearcoat:1}),[0,.15,0]);else{F(new Ce(.088,.096,.235,28,1,!0),o("#cfeeee",.28),[0,.1175,0]),F(new Ce(.096,.096,.006,28),o("#cfeeee",.45),[0,.003,0]),F(new Dn(.088,.005,6,28),o("#e3fbfb",.5),[0,.235,0]).rotation.x=Math.PI/2;const V=F(new Ca(.03,.045,12,1,!0),o("#e3fbfb",.45),[.092,.232,0]);V.rotation.z=-Math.PI/2,V.scale.set(1,1,.6);const q=F(new Dn(.06,.011,8,20,Math.PI),o("#e3fbfb",.55),[-.095,.12,0]);q.rotation.z=Math.PI/2,G=F(new Ce(.083,.09,1,24),new Pi({color:"#a8d8e3",transparent:!0,opacity:.45,roughness:.03,clearcoat:1}),[0,.11,0])}const Y=mb(I,G.material);N.remove(G),D.splice(D.indexOf(G),1),G.geometry.dispose(),N.add(Y.mesh),Y.mesh.userData.container=I,D.push(Y.mesh),r[I]={outer:U,root:N,parts:D,fluid:Y,L:A}}a("oil"),a("water");const l=new on(1,7,5),c=new Je,h=new B(0,1,0),d=new B,u={};for(const I of["water","oil"]){const U=new Pi({color:ts[I].color,transparent:!0,opacity:ts[I].opacity,roughness:ts[I].rough,clearcoat:1,depthWrite:!1}),N=new pc(l,U,yf+120);N.frustumCulled=!1,N.count=0,s.add(N),u[I]=N}const f=Array.from({length:18},()=>{const I=new ve(new so(.8,1,32),new rn({color:"#ffffff",transparent:!0,opacity:0,depthWrite:!1,side:Ge}));return I.rotation.x=-Math.PI/2,I.visible=!1,s.add(I),I}),g=Array.from({length:16},()=>{const I=new ve(new oo(1,28),new Pi({color:"#ffffff",transparent:!0,opacity:.5,roughness:.05,clearcoat:1,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-2}));return I.rotation.x=-Math.PI/2,I.visible=!1,I.receiveShadow=!0,s.add(I),I});function v(I,U){const N=new so(5e-4,Li,48,8),A=new ve(N,new Pi({color:I,transparent:!0,opacity:U,roughness:.05,metalness:.1,clearcoat:1,side:Ge,depthWrite:!1}));A.visible=!1,t.add(A);const D=Float32Array.from(N.attributes.position.array);return{m:A,g:N,base:D}}const m=v(ts.water.surface,.6),p=v(ts.oil.surface,.7),x=new xn,w=new xn,y=new xn().setFromAxisAngle(new B(1,0,0),-Math.PI/2),M=new B,S=new B;let C=null,_=null;function T(I,U,N,A,D,F){const G=I.g.attributes.position,Y=I.base,V=t.matrixWorld.clone().invert(),q=n.ripples.map($=>({p:M.set($.x,$.y,$.z).applyMatrix4(V).clone(),age:n.time-$.born}));for(let $=0;$<G.count;$++){let it=Y[$*3]*D+F.x,yt=Y[$*3+1]*D+F.y,Ft=0;for(const Zt of q){const lt=Math.hypot(it-Zt.p.x,yt+Zt.p.z),W=lt-Zt.age*.45;Ft+=Math.exp(-W*W*900)*.006*(1-Zt.age/.9)}A==="boiling"?Ft+=Math.sin(it*41+N*9)*Math.sin(yt*37-N*7)*.0035:A==="frying"&&(Ft+=Math.sin(it*90+N*30)*Math.sin(yt*80-N*24)*9e-4),Ft+=Math.sin(it*14+N*3)*Math.sin(yt*12-N*2.3)*U,G.setXYZ($,it,yt,Ft)}G.needsUpdate=!0,I.g.computeVertexNormals()}function L(I,U){const N=n.time;for(const[q,$]of Object.entries(r)){const it=e.containers[q];$.outer.position.fromArray(it.pos),$.outer.quaternion.setFromAxisAngle(h,-it.yaw),$.root.rotation.set(0,0,-it.tilt);const yt=Math.max(0,it.amount/$.L.capacity);$.fluid.update(yt,it.tilt);const Ft=q===C?"#2b4a3a":q===_?"#18291f":"#000000";for(const Zt of $.parts)Zt.material.emissive?.set(Ft)}for(const q of["water","oil"]){const $=u[q];let it=0;for(const yt of n.particles){if(yt.kind!==q||it>=$.instanceMatrix.count)continue;const Ft=Math.cbrt(yt.vol*.001*.2387)*(q==="oil"?1.25:1),Zt=Math.hypot(...yt.v);c.position.fromArray(yt.p),d.set(yt.v[0],yt.v[1],yt.v[2]).normalize(),c.quaternion.setFromUnitVectors(h,Zt>.001?d:h),c.scale.set(Ft,Ft*(1+Zt*(q==="oil"?3.2:2.4)),Ft),c.updateMatrix(),$.setMatrixAt(it++,c.matrix)}for(const yt of n.splashes){if(yt.kind!==q||it>=$.instanceMatrix.count)continue;const Ft=(q==="oil"?.004:.0035)*(1-yt.age/.6);c.position.fromArray(yt.p),c.quaternion.identity(),c.scale.setScalar(Math.max(5e-4,Ft)),c.updateMatrix(),$.setMatrixAt(it++,c.matrix)}$.count=it,$.instanceMatrix.needsUpdate=!0}f.forEach((q,$)=>{const it=n.ripples[$];if(q.visible=!!it,!it)return;const yt=N-it.born;q.position.set(it.x,it.y+.002,it.z),q.scale.setScalar(.01+yt*.16),q.material.opacity=(1-yt/.9)*(it.kind==="water"?.45:.3),q.material.color.set(it.kind==="water"?"#eefcff":"#ffe9a0")}),g.forEach((q,$)=>{const it=n.puddles[$];if(q.visible=!!it,!it)return;q.position.set(it.x,it.y+.0015,it.z);const yt=1+Math.sin(N*2+$)*.01;q.scale.set(it.radius*yt,it.radius*(it.kind==="oil"?.85:.95),1),q.material.color.set(ts[it.kind].color),q.material.opacity=it.kind==="oil"?.72:.42}),t.updateMatrixWorld(),x.copy(t.quaternion).invert();const A=n.slosh;S.set(-A.x,1,-A.z).normalize(),w.setFromUnitVectors(h,S);const D=Mc(e),F=Mf(e),G=e.water>.002,Y=e.oil>.002,V=new xn().copy(x).multiply(w).multiply(y);if(m.m.visible=G,G&&(m.m.position.set(0,Math.min(F,.035+e.water*.21),0),m.m.quaternion.copy(V),T(m,6e-4+Math.hypot(A.vx,A.vz)*.002,N,U,1,{x:0,y:0}),m.m.material.opacity=.42+Math.min(.25,e.water*.4),m.m.material.color.set(U==="boiling"?"#cfe6e2":ts.water.surface)),p.m.visible=Y,Y){const q=G?1:Math.min(1,.35+Math.sqrt(e.oil/.12)*.65),$=new B(0,1,0).applyQuaternion(t.quaternion),it=new B($.x,0,$.z).applyQuaternion(x).multiplyScalar(Li*(1-q)*4);it.clampLength(0,Li*(1-q)),p.m.position.set(0,Math.min(F,D)+.001,0),p.m.quaternion.copy(V),T(p,3e-4,N,U,q,{x:it.x,y:-it.z}),p.m.material.opacity=G?.32:.55+Math.min(.3,e.oil),p.m.material.color.set(e.temp>150?"#e8b440":ts.oil.surface)}return{level:Math.min(F,D)}}return{group:s,update:L,containers:r,meshes:()=>Object.values(r).flatMap(I=>I.parts),setSelected(I){C=I},setHover(I){_=I},spout:I=>Sc(e.containers[I])}}function Cb(i,t,e=Qc()){const n=eb(i,{dilemma:!0,title:"ROOM 09 / THE TEST KITCHEN"}),{scene:s,camera:r,renderer:o,controls:a}=n;r.position.set(.1,2.83,1.89),r.fov=66,r.updateProjectionMatrix(),a.target.set(.08,.97,.04),a.maxDistance=4,a.minDistance=1,a.enablePan=!0,a.mouseButtons={LEFT:null,MIDDLE:rs.DOLLY,RIGHT:rs.ROTATE};const l=(j,K=0,mt=.5)=>new De({color:j,metalness:K,roughness:mt}),c=l("#899a9b",.8,.26),h=l("#202a2c",.7,.28),d=l("#b7844f",0,.83);function u(j,K,mt,wt=[0,0,0]){const gt=new ve(K,typeof mt=="string"?l(mt):mt);return gt.position.set(...wt),gt.castShadow=gt.receiveShadow=!0,j.add(gt),gt}const f=(j,K,mt,wt)=>u(j,new Vi(...wt),K,mt),g=(j,K,mt,wt)=>u(j,new on(wt,16,12),K,mt);f(s,c,[.02,.84,.11],[3.35,.085,1.4]);for(const j of[-1.5,1.5])for(const K of[-.48,.7])f(s,h,[j,.41,K],[.06,.82,.06]);f(s,h,[.02,.45,-.5],[3.25,.12,.045]),f(s,d,[le.x,.923,le.z],[le.width,.085,le.depth]);for(let j=0;j<24;j++)f(s,j%3?"#a7794c":"#c5945b",[le.x-.64+j*.055,.967,le.z],[.001,.002,.81]);const v=u(s,new Dn(.035,.009,6,16),h,[-1.31,.969,.59]);v.rotation.x=Math.PI/2,f(s,h,[fe.x,.922,fe.z],[1.1,.075,1.05]),u(s,new Ce(.32,.32,.055,40),h,[fe.x,.974,fe.z]);for(let j=0;j<4;j++){const K=j*Math.PI/2,mt=f(s,c,[fe.x+Math.cos(K)*.29,1.01,fe.z+Math.sin(K)*.29],[.3,.035,.045]);mt.rotation.y=-K}const m=new Se;m.position.set(.87,.866,.681),m.rotation.x=Math.PI/2,s.add(m),u(m,new Ce(.08,.08,.055,32),h),f(m,"#f0c77f",[0,.036,.042],[.013,.012,.05]),m.traverse(j=>j.userData.knob=!0);const p=new Se;p.position.set(fe.x,1.054,fe.z),s.add(p);const x=l("#414d50",.83,.23),w=l("#283334",.65,.34);u(p,new Ce(.45,.38,.055,64),w);const y=u(p,new Ce(.46,.405,.115,64,1,!0),x,[0,.055,0]);y.material.side=Ge;const M=u(p,new Dn(.46,.018,8,64),c,[0,.112,0]);M.rotation.x=Math.PI/2;const S=f(p,h,[.71,.04,0],[.52,.055,.095]);S.material=S.material.clone(),S.userData.panHandle=!0,f(p,c,[.46,.025,0],[.12,.035,.07]);const C=new Se;C.position.set(-.4,.898,-.51),s.add(C),u(C,new Ce(.36,.32,.025,48),"#d9ddcd");const _=u(C,new Dn(.34,.025,8,48),"#eff3dd",[0,.017,0]);_.rotation.x=Math.PI/2;const T=Ab(s,p,t,e);for(let j=0;j<3;j++){const K=f(s,c,[-1.55+j*.08,1.12,-.53],[.018,.43,.018]);K.rotation.z=(j-1)*.17}const L=ib(s);L.root.position.set(-.8,.18,-1.16),L.root.scale.multiplyScalar(.9),L.arms.L.sh.rotation.x=-.8,L.arms.R.sh.rotation.x=-1;for(const j of Object.values(L.arms))j.fa.rotation.x=-.8;f(L.nodes.torso,"#eee6ca",[0,-.15,.42],[1.02,1.08,.03]),f(L.nodes.torso,"#324d49",[0,-.2,.444],[.53,.3,.02]);const I=new ro("#ffe0a5",4,4);I.position.set(-.9,2,.4),s.add(I);const U=rb(),N=U.group;N.position.set(fe.x,1.012,fe.z),s.add(N);const A=l("#a78d53",.8,.32),D=u(s,new Ce(.018,.018,.11,16),A,[Ze.x,Ze.y,Ze.z-.055]);D.rotation.x=Math.PI/2,u(s,new Dn(.013,.004,6,20),A,[Ze.x,Ze.y,Ze.z]),u(s,new oo(.01,16),h,[Ze.x,Ze.y,Ze.z+.001]);const F=u(s,new Dn(.045,.002,6,32),new rn({color:"#8bd6ff",transparent:!0,opacity:.7,depthWrite:!1}),[Ze.x,Ze.y+.012,Ze.z]);F.rotation.x=Math.PI/2;const G=new ro("#70bdff",0,1.8);G.position.copy(N.position),s.add(G);const Y=new Se;s.add(Y),f(Y,c,[0,.055,-.05],[.014,.13,.4]),f(Y,"#ede4c8",[0,.11,.25],[.055,.065,.22]),f(Y,c,[0,.11,.13],[.065,.072,.025]);for(let j=.19;j<.34;j+=.065)g(Y,c,[.031,.11,j],.009);const V=new Se;s.add(V),f(V,"#df9d48",[0,0,0],[.055,.15,.036]),f(V,c,[0,.09,0],[.055,.032,.04]),u(V,new Ce(.025,.025,.027,12),h,[0,.101,-.004]).rotation.z=Math.PI/2,V.traverse(j=>j.userData.lighter=!0);const q=ob();q.group.position.set(0,.116,-.004),V.add(q.group);const $=Array.from({length:26},()=>{const j=g(s,new rn({color:"#ffe7a0",transparent:!0,depthWrite:!1,blending:Ms}),[0,0,0],.0035);return j.visible=!1,j.castShadow=!1,j.userData.v=new B,j.userData.age=9,j});let it=0;const yt=new qc(new Ne().setFromPoints([new B(0,0,-.19),new B(0,0,.19)]),new Aa({color:"#f6e8bb",transparent:!0,opacity:.7}));s.add(yt);const Ft=Array.from({length:90},()=>{const j=u(s,new on(.012,7,5),new rn({color:"#e4e8c3",transparent:!0,opacity:.4}));return j.visible=!1,j}),Zt=Array.from({length:28},()=>{const j=u(s,new on(.042,8,6),new rn({color:"#d8e7df",transparent:!0,opacity:.1,depthWrite:!1}));return j.visible=!1,j}),lt=new Map,W=new kv,rt=new Et,dt=new li(new B(0,1,0),-.97),Mt=[];let _t=null,Tt="knife",kt=new B(le.x,le.y,le.z),ct=-99,z=!1,et=null,nt=null,J=0,k=!1;function Q(){const j=new Set(t.items.map(K=>K.id));for(const[K,mt]of lt)j.has(K)||(pb(mt),lt.delete(K));for(const K of t.items)if(!lt.has(K.id)){const mt=fb(K);s.add(mt.root),lt.set(K.id,mt)}}function ht(j,K=le.y){dt.constant=-K;const mt=o.domElement.getBoundingClientRect();return rt.set((j.clientX-mt.left)/mt.width*2-1,-(j.clientY-mt.top)/mt.height*2+1),W.setFromCamera(rt,r),W.ray.intersectPlane(dt,new B)}function vt(j){ht(j);const K=W.intersectObjects([...lt.values()].map(wt=>wt.root).concat(m,S,V,...T.meshes()),!0).filter(wt=>wt.object.userData.lighter||wt.object.userData.foodId||wt.object.userData.knob||wt.object.userData.panHandle||wt.object.userData.container),mt=K[0]?.object.userData;return K[0]?{lighter:!!mt.lighter,id:mt.foodId,knob:mt.knob,panHandle:mt.panHandle,container:mt.container||null,linkIndex:mt.linkIndex,point:K[0].point}:null}function O(j,K,mt="#f4d784"){for(let wt=0;wt<10;wt++){const gt=g(s,new rn({color:mt,transparent:!0}),[j,1.03,K],.006+Math.random()*.008);Mt.push({m:gt,born:t.time,v:new B((Math.random()-.5)*.6,Math.random()*.8+.1,(Math.random()-.5)*.6)})}}let Rt=0,At=-99,P=1,b=null,H="cooking",tt=null,st=null;s.updateMatrixWorld(!0);const bt=C.getWorldPosition(new B),Ct=j=>L.arms[j].hand.getWorldPosition(new B),pt=Ct("L").distanceTo(bt)<Ct("R").distanceTo(bt)?"L":"R",xt=pt==="L"?1:-1,Pt=new Se;for(const j of[-.03,.03]){const K=new ve(new Ce(.012,.02,.8,6),l("#3a2a1c",0,.6));K.position.set(j,-.36,.08),K.rotation.x=.12,Pt.add(K)}Pt.visible=!1,L.arms[pt].hand.add(Pt);const Ht=new B,Lt=new B;function It(){return L.jaw.getWorldPosition(Ht),Lt.set(0,0,1).transformDirection(L.head.matrixWorld),Lt.y=0,Lt.normalize(),Ht.addScaledVector(Lt,.09),Ht.y-=.02,Ht}function Yt(j,K){const mt=b;return j.pose?K.fromArray(j.pose.position):K.copy(bt),mt.phase==="grasp"?(K.y+=.03*mt.progress,K):K.lerp(It(),Math.max(mt.lift,mt.phase==="bite"||mt.phase==="chew"?1:0))}function ee(j,K,mt){const wt=b?.active,gt=L.arms[pt],Wt=L.arms[pt==="L"?"R":"L"];if(Pt.visible=!!wt,wt){const Nt=b.reach,de=b.lift;gt.sh.rotation.set(-1-Nt*.35-de*.5,0,xt*(.05+Nt*.35-de*.45)),gt.fa.rotation.x=-.8+Nt*.55-de*1.15,Wt.sh.rotation.set(-.9,0,0),Wt.fa.rotation.x=-.9,L.head.rotation.x=-.3+Nt*.25-de*.12+(b.chewing?Math.sin(j*9)*.03:0),L.head.rotation.y=xt*Nt*.25,L.jaw.rotation.x=b.jaw,L.root.updateMatrixWorld(!0);const pe=t.items.find(Ve=>Ve.id===b.carryId);if(pe){const Ve=Yt(pe,new B);gt.hand.worldToLocal(Ve),Pt.quaternion.setFromUnitVectors(new B(0,-1,0),Ve.normalize())}}else{const Nt=Vu(j,At,2.2),de=Math.sin((j-At)*5)*Nt;L.head.rotation.y=Math.sin(j*.5)*.12+Rt*Math.sin(j*2.3)*.08,L.head.rotation.x=-.3+Rt*Math.sin(j*3.1)*.05,L.arms.R.sh.rotation.set(-1.1+mt*.2-(P<0?Nt*.7:0),0,P<0?-de*.25:0),L.arms.R.fa.rotation.x=-.8-mt*.3-(P<0?Nt*.5:0),L.arms.L.sh.rotation.set(-.8-(P>0?Nt*.75:0),0,P>0?de*.25:0),L.arms.L.fa.rotation.x=-.8-(P>0?Nt*.55:0),L.jaw.rotation.x=Math.min(.34,Rt*.42)}if(st){const Nt=1-Math.exp(-K*3.5);r.position.lerp(st.position,Nt),a.target.lerp(st.target,Nt),a.update(),r.position.distanceTo(st.position)<.005&&(st=null)}}function ie(j){if(j!==H){if(j==="mukbang"){tt={position:r.position.clone(),target:a.target.clone()};const K=L.head.getWorldPosition(new B),mt=K.clone().lerp(bt,.28);It(),st={target:mt,position:mt.clone().addScaledVector(Lt,1.55).add(new B(.35,.5,0))}}else st=tt||{position:new B(.1,2.83,1.89),target:new B(.08,.97,.04)},tt=null;H=j}}function Z(j){Q();const K=t.time,mt=Kr(t);t.panPose?(p.position.fromArray(t.panPose.position),p.quaternion.fromArray(t.panPose.quaternion)):(p.position.set(fe.x,1.054,fe.z),p.quaternion.identity()),S.material.emissive.set(k?"#1f3029":"#000000"),m.rotation.y=-t.gas*Math.PI*1.35;const wt=new B(0,1,0).applyQuaternion(p.quaternion),gt=Math.hypot(p.position.x-fe.x,p.position.z-fe.z)<.62,Wt=gt?p.position.y-.0275*wt.y-.45*Math.sqrt(Math.max(0,1-wt.y*wt.y))-.002:99,Nt=U.update(K,t.gas,t.lit,Wt,j),de=1+Math.sin(K*19)*.04+Math.sin(K*31)*.03;G.position.set(fe.x,Math.min(1.02+Nt.height*.6,Wt-.01),fe.z),G.intensity=t.lit?(.6+Nt.height*22+Nt.ignite*5)*de:0,G.color.set(Nt.ignite>.2?"#b8b0ff":"#6aaeff"),F.visible=et==="prop"&&!t.lit&&!Al(t,kt).covered,F.material.opacity=.45+Math.sin(K*5)*.22;const pe=T.update(j,mt),Ve=pe.level;T.setHover(_t),y.scale.y=t.vessel==="pot"?2.5:1,y.position.y=t.vessel==="pot"?.14:.055,M.position.y=t.vessel==="pot"?.28:.112,S.visible=!0;const sn=t.water>.035?Math.max(0,Math.min(1,(t.temp-80)/18)):0,Da=t.oil>.02&&t.water<=.035?Math.max(0,Math.min(1,(t.temp-110)/90)):0,Ua=Math.round(sn*90+Da*55);Ft.forEach(($t,Jt)=>{if($t.visible=Jt<Ua,!$t.visible)return;const Be=Jt*2.399,jn=Math.sqrt((Jt+.5)/90)*.41,Qn=(K*(sn?1.1+sn*.6:3.2)+Jt*.13)%1,Fn=new B(Math.cos(Be)*jn,Ve+Qn*.022*(sn?1:.4),Math.sin(Be)*jn).applyQuaternion(p.quaternion).add(p.position);$t.position.copy(Fn),$t.scale.setScalar(.25+Math.sin(Qn*Math.PI)*(sn?.6+sn:.5)),$t.material.opacity=(1-Qn)*.45});const ao=t.temp>70&&(t.water>.035||t.items.some($t=>$t.zone==="pan")),gr=t.water>.035?Math.max(0,Math.min(1,(t.temp-70)/30)):Math.max(0,Math.min(.5,(t.temp-120)/160));Zt.forEach(($t,Jt)=>{$t.visible=ao;const Be=(K*.36+Jt/28)%1;$t.position.set(p.position.x+Math.sin(Jt*8.4)*.25+Math.sin(K+Jt)*Be*.13,p.position.y+.056+Ve+Be*.85,p.position.z+Math.cos(Jt*3.7)*.25),$t.scale.setScalar(.4+Be*2.3),$t.material.opacity=Math.sin(Be*Math.PI)*.09*gr});for(const $t of e.events)$t.type==="spatter"&&(it=Math.min(1,it+.5));it=Math.max(0,it-j*.8);const Fa=(t.oil>.02&&t.temp>150&&t.water<=.035?(t.temp-150)/120*(t.items.some($t=>$t.zone==="pan"&&$t.panContact!==!1)?1:.4):0)+it*6;for(const $t of $){const Jt=$t.userData;if(Jt.age+=j,Jt.age>.5&&Math.random()<Fa*j*2){Jt.age=0;const Be=Math.random()*Math.PI*2,jn=Math.random()*.38;$t.position.set(p.position.x+Math.cos(Be)*jn,p.position.y+Ve+.004,p.position.z+Math.sin(Be)*jn),Jt.v.set((Math.random()-.5)*.5,.5+Math.random()*.9,(Math.random()-.5)*.5)}$t.visible=Jt.age<.5,$t.visible&&(Jt.v.y-=9.81*j,$t.position.addScaledVector(Jt.v,j),$t.material.opacity=1-Jt.age/.5)}for(const $t of t.items){const Jt=lt.get($t.id),Be=ze[$t.type],jn=($t.a+$t.b)/2;le.y+Be.radius,$t.pose?(Jt.root.position.fromArray($t.pose.position),Jt.root.quaternion.fromArray($t.pose.quaternion)):(Jt.root.position.set($t.x+jn,$t.zone==="pan"?1.09+Be.radius:le.y+Be.radius,$t.z),Jt.root.rotation.set(0,$t.angle||0,0));const Qn=1-($t.eaten||0);if(Jt.root.scale.set(Math.max(.12,Qn),Math.max(.4,Math.sqrt(Qn)),Math.max(.4,Math.sqrt(Qn))),Jt.parts&&$t.links){const An=Jt.root.quaternion.clone().invert();Jt.parts.forEach((xi,lo)=>{const vr=$t.links[lo];xi.root.position.fromArray(vr.position).sub(Jt.root.position).applyQuaternion(An),xi.root.quaternion.fromArray(vr.quaternion).premultiply(An)})}b?.carryId===$t.id&&Yt($t,Jt.root.position);for(const An of Jt.skins||[Jt.skin])An.emissive.set($t.id===et?"#294735":$t.id===nt?"#17291d":"#000000");for(const An of Jt.skins||[Jt.skin])An.color.copy(Jt.base).lerp(new te("#b17638"),Math.min(.8,$t.cook*.6)).lerp(new te("#362920"),$t.burn);const Fn=t.fish.find(An=>An.id===$t.fishId);if(Jt.robot){Jt.robot.head.rotation.z=Math.sin(K*3+$t.id)*.06+(Fn?.pain||0)/100*Math.sin(K*20)*.06,Jt.robot.jaw.rotation.x=Fn?.speaking||Fn?.screaming?Math.abs(Math.sin(K*18))*.4:0;for(const[An,xi]of Object.entries(Jt.robot.arms))xi.sh.rotation.z=(An==="L"?1:-1)*(.35+Math.sin(K*4+$t.id)*.13+(Fn?.pain||0)/200)}Jt.tail&&(Jt.tail.rotation.y=Math.sin(K*(Fn?.pain>40?19:4)+$t.id)*.28)}const Ds=Vu(K,ct,.25);Y.visible=et===null&&Tt==="knife"&&H!=="mukbang",Y.position.copy(kt),Y.position.y=le.y+.012+.22*(1-Ds),Y.rotation.set(0,J,-.06*(1-Ds)),yt.rotation.y=J,yt.visible=et===null&&Tt==="knife"&&nt!==null&&H!=="mukbang",yt.position.copy(kt),yt.position.y=le.y+.003,V.visible=!0,t.lighterPose&&(V.position.fromArray(t.lighterPose.position),V.quaternion.fromArray(t.lighterPose.quaternion)),q.update(K,z);for(let $t=Mt.length-1;$t>=0;$t--){const Jt=Mt[$t],Be=K-Jt.born;if(Be>.7){Jt.m.geometry.dispose(),Jt.m.material.dispose(),s.remove(Jt.m),Mt.splice($t,1);continue}Jt.m.position.addScaledVector(Jt.v,j),Jt.v.y-=j*2,Jt.m.material.opacity=1-Be/.7}ee(K,j,Ds),n.update(K,j,{})}return{room:n,canvas:o.domElement,update:Z,project:ht,pick:vt,pulse:O,food:lt,pourView:T,frame:ie,setChefTalk(j){Rt=Math.max(0,Math.min(1,j||0))},chefGesture(){At=t.time,P=-P},setMukbang(j){b=j},setHoverContainer(j){_t=j||null,o.domElement.style.cursor=j&&Tt==="hand"?"grab":o.domElement.style.cursor},setSelectedContainer(j){T.setSelected(j||null)},get frameMode(){return H},setTool(j){Tt=j},setPointer(j){j&&kt.copy(j)},setDown(j){z=j},setDrag(j){et=j},setHover(j){nt=j?.id??null,k=!!j?.panHandle;const K=lt.get(nt);if(K){const wt=(K.parts?.[j.linkIndex]||K).root.getWorldQuaternion(new xn),gt=new B(1,0,0).applyQuaternion(wt);J=Math.atan2(-gt.z,gt.x)}else J=0;o.domElement.style.cursor=j?.lighter||j?.container?et==="prop"?"grabbing":"grab":j?.knob?"ew-resize":Tt==="hand"&&(nt!==null||k)?et!==null?"grabbing":"grab":Tt==="knife"&&nt!==null?"crosshair":"default"},strike(){ct=t.time},resetView(){st=null,tt=null,H="cooking",r.position.set(.1,2.83,1.89),a.target.set(.08,.97,.04),a.update()},get pointer(){return kt}}}function $u({synth:i=globalThis.speechSynthesis,Utterance:t=globalThis.SpeechSynthesisUtterance,language:e="en-US"}={}){let n=null,s=0,r=null,o="Microsoft David";function a(){s++,n&&i?.cancel(),n=null,r?.(),r=null}function l(c,{shouldPlay:h=()=>!0,onStart:d,onDone:u,onError:f}={}){if(a(),!h()){u?.();return}if(!i||!t){f?.(Error("Windows speech is unavailable."));return}const g=s,v=new t(c);let m=!1,p;const x=()=>{m||(m=!0,clearTimeout(p),n===v&&(n=null,r=null),u?.())};r=x,n=v;const w=i.getVoices(),y=e==="zh-CN"?w.find(M=>/^zh[-_]CN/i.test(M.lang)&&M.localService):w.find(M=>/Microsoft David/i.test(M.name)&&/^en/i.test(M.lang))||w.find(M=>M.localService&&/Microsoft/i.test(M.name)&&/^en-US/i.test(M.lang));if(!y){n=null,r=null,f?.(Error("Requested Windows speech voice not installed; subtitles remain available."));return}o=y.name,v.voice=y,v.lang=e,v.rate=e==="zh-CN"?1:.95,v.pitch=e==="zh-CN"?1:.85,v.volume=.9,v.onstart=()=>{if(g!==s||!h()){a();return}d?.()},v.onend=x,v.onerror=M=>{g===s&&M.error!=="canceled"&&M.error!=="interrupted"&&f?.(Error(M.error)),x()},p=setTimeout(()=>{g===s&&a()},6e4),i.resume(),i.speak(v)}return i?.getVoices(),{speak:l,stop:a,get selected(){return o}}}const ia=[1,2,3,4,5,6].map(i=>"/sfx/robot-scream-scandalous-0"+i+".mp3"),Rb=[1,2,3].map(i=>"/sfx/cooking-chew-0"+i+".mp3");function Pb(i){const t=Array.isArray(i?.clips)?i.clips.filter(n=>typeof n=="string"&&/^\/sfx\/[\w\-./]+\.mp3$/i.test(n)&&!n.includes("..")):[],e=[...new Set(t)].slice(0,48);return e.length?e:ia.slice()}function Lb(i=2.4,t=1024){const e=new Float32Array(t);for(let n=0;n<t;n++){const s=n/(t-1)*2-1;e[n]=Math.tanh(i*s)/Math.tanh(i)}return e}const ps={dry:.38,wet:.9,band:1500,q:.75,carrierBase:58,comb:.0075,feedback:.38};function Ib({fetchImpl:i=(...t)=>fetch(...t)}={}){let t,e,n,s,r,o,a,l,c,h,d=!1,u,f;const g=[],v=new Map,m=new Map,p=new Map;let x=null,w=!1;const y={buffers:[],source:null,last:-1},M={source:null,analyser:null,data:null,controller:null,resolve:null,level:0};let S={chewing:!1,chef:!1};async function C(lt){const W=await i(lt);if(!W.ok)throw Error(lt+" HTTP "+W.status);return t.decodeAudioData(await W.arrayBuffer())}async function _(){let lt=ia;try{const dt=await i("/sfx/cooking-screams.json",{cache:"no-cache"});dt.ok&&(lt=Pb(await dt.json()))}catch{}let W=0;const rt=async()=>{for(;W<lt.length;){const dt=W++;try{g[dt]=await C(lt[dt])}catch{}}};await Promise.all([rt(),rt(),rt(),rt()]),!g.some(Boolean)&&lt!==ia&&(lt=ia,W=0,g.length=0,await Promise.all([rt(),rt()]))}async function T(){if(!t){let dt=function(Mt,_t,Tt=.7){const kt=t.createBufferSource(),ct=t.createBiquadFilter(),z=t.createGain();return kt.buffer=W,kt.loop=!0,ct.type=_t,ct.frequency.value=Mt,ct.Q.value=Tt,z.gain.value=0,kt.connect(ct).connect(z).connect(n.ambient),kt.start(),z};var lt=dt;t=new AudioContext,e=t.createGain(),e.gain.value=.65,e.connect(t.destination),n={};for(const Mt of["ambient","screams","voice","chef","chew"])(n[Mt]=t.createGain()).connect(e);const W=t.createBuffer(1,t.sampleRate*2,t.sampleRate),rt=W.getChannelData(0);for(let Mt=0;Mt<rt.length;Mt++)rt[Mt]=Math.random()*2-1;s=W,f=Lb(),r=dt(4200,"highpass"),o=dt(500,"lowpass"),a=dt(650,"lowpass"),l=dt(2300,"bandpass",.9),c=dt(520,"bandpass",1.6),h=$u(),u=Promise.all([_(),...Rb.map(async(Mt,_t)=>{try{y.buffers[_t]=await C(Mt)}catch{}})])}return await t.resume(),u}function L(lt,W,rt=.1,dt="sine",Mt=lt){if(!t||d)return;const _t=t.createOscillator(),Tt=t.createGain();_t.type=dt,_t.frequency.setValueAtTime(lt,t.currentTime),_t.frequency.exponentialRampToValueAtTime(Math.max(20,Mt),t.currentTime+W),Tt.gain.setValueAtTime(rt,t.currentTime),Tt.gain.exponentialRampToValueAtTime(1e-4,t.currentTime+W),_t.connect(Tt).connect(n.ambient),_t.start(),_t.stop(t.currentTime+W),_t.onended=()=>{_t.disconnect(),Tt.disconnect()}}function I(lt=.12,W=.08,rt=5e3){if(!t||d)return;const dt=t.createBufferSource(),Mt=t.createBiquadFilter(),_t=t.createGain();dt.buffer=s,Mt.type="highpass",Mt.frequency.value=rt,_t.gain.setValueAtTime(W,t.currentTime),_t.gain.exponentialRampToValueAtTime(1e-4,t.currentTime+lt),dt.connect(Mt).connect(_t).connect(n.ambient),dt.start(0,Math.random()*1.5,lt+.05),dt.onended=()=>{dt.disconnect(),Mt.disconnect(),_t.disconnect()}}function U(){L(160,.055,.26,"triangle",75),L(1600,.025,.045,"sawtooth",500)}function N(){for(let lt=0;lt<5;lt++)setTimeout(()=>L(180+Math.random()*550,.1,.1,"sine",80),lt*40)}function A(lt){const W=Number(String(lt.id).split("-")[1])||0,rt=t.createGain(),dt=t.createGain(),Mt=t.createBiquadFilter(),_t=t.createGain(),Tt=t.createOscillator(),kt=t.createDelay(.05),ct=t.createGain(),z=t.createWaveShaper(),et=t.createGain(),nt=t.createGain(),J=t.createStereoPanner();return dt.gain.value=ps.dry,Mt.type="bandpass",Mt.frequency.value=ps.band+W%4*120,Mt.Q.value=ps.q,_t.gain.value=0,Tt.type="sine",Tt.frequency.value=ps.carrierBase+W%5*9,Tt.connect(_t.gain),kt.delayTime.value=ps.comb+W%3*.0012,ct.gain.value=ps.feedback,z.curve=f,z.oversample="2x",et.gain.value=ps.wet,rt.connect(dt).connect(nt),rt.connect(Mt).connect(_t).connect(kt).connect(z).connect(et).connect(nt),kt.connect(ct).connect(kt),nt.connect(J).connect(n.screams),Tt.start(),{input:rt,panner:J,out:nt,dispose(){try{Tt.stop()}catch{}for(const k of[rt,dt,Mt,_t,Tt,kt,ct,z,et,nt,J])k.disconnect()}}}function D(lt,W=0,{bite:rt=!1}={}){if(!lt||!t||d)return!1;if(v.has(lt.id)){if(!rt)return!1;try{v.get(lt.id).stop()}catch{}v.delete(lt.id)}if(!rt&&t.currentTime<(m.get(lt.id)||0))return!1;const dt=g.map((ct,z)=>ct?z:-1).filter(ct=>ct>=0);if(!dt.length)return!1;let Mt=dt[Math.floor(Math.random()*dt.length)];dt.length>1&&Mt===p.get(lt.id)&&(Mt=dt[(dt.indexOf(Mt)+1)%dt.length]),p.set(lt.id,Mt);const _t=t.createBufferSource(),Tt=t.createGain(),kt=A(lt);return _t.buffer=g[Mt],_t.playbackRate.value=.94+Number(String(lt.id).split("-")[1])%5*.035,Tt.gain.value=rt?.36:.24,kt.panner.pan.value=Math.max(-.85,Math.min(.85,W)),_t.connect(Tt).connect(kt.input),v.set(lt.id,_t),lt.screaming=!0,_t.onended=()=>{v.get(lt.id)===_t&&(v.delete(lt.id),lt.screaming=!1),_t.disconnect(),Tt.disconnect(),kt.dispose()},_t.start(),m.set(lt.id,t.currentTime+5+Math.random()*4),!0}function F(){if(!t)return;const lt=t.currentTime,W=(S.chewing?.35:1)*(S.chef?.55:1);n.ambient.gain.setTargetAtTime(W,lt,.12),n.voice.gain.setTargetAtTime(S.chewing||S.chef?.5:1,lt,.12),n.screams.gain.setTargetAtTime(S.chewing?.55:1,lt,.12),n.chew.gain.setTargetAtTime(S.chef?.5:1,lt,.12)}function G(lt,W={}){if(!t)return;const rt=lt.temp>90&&lt.items.some(ct=>ct.zone==="pan"),dt=lt.water>.035&&lt.temp>93,Mt=t.currentTime;r.gain.setTargetAtTime(!d&&rt&&lt.oil>.02&&!dt?.12*Math.min(1,(lt.temp-80)/80):!d&&lt.oil>.02&&lt.temp>150&&!dt?.04:0,Mt,.15),o.gain.setTargetAtTime(!d&&lt.gas>0?(lt.lit?.016:.01)*lt.gas:0,Mt,.2),a.gain.setTargetAtTime(!d&&dt?.13:!d&&lt.water>.035&&lt.temp>80?.05*(lt.temp-80)/13:0,Mt,.2),dt&&Math.random()<.07&&L(70+Math.random()*100,.07,.035,"sine",40);const _t=lt.containers?.water?.rate||0,Tt=lt.containers?.oil?.rate||0;l.gain.setTargetAtTime(d?0:Math.min(.14,_t*.16+(W.panSpill||0)*.2),Mt,.06),c.gain.setTargetAtTime(d?0:Math.min(.09,Tt*.6),Mt,.08);const kt={chewing:!!W.chewing,chef:M.source!==null};(kt.chewing!==S.chewing||kt.chef!==S.chef)&&(S=kt,F());for(const ct of lt.fish)ct.pain>35&&D(ct,(lt.items.find(z=>z.fishId===ct.id)?.x||0)*.5)}function Y(){V();const lt=y.buffers.map((_t,Tt)=>_t?Tt:-1).filter(_t=>_t>=0);if(!t||!lt.length)return null;let W=lt[Math.floor(Math.random()*lt.length)];lt.length>1&&W===y.last&&(W=lt[(lt.indexOf(W)+1)%lt.length]),y.last=W;const rt=y.buffers[W];if(d)return rt.duration;const dt=t.createBufferSource(),Mt=t.createGain();return dt.buffer=rt,Mt.gain.value=.8,dt.connect(Mt).connect(n.chew),dt.onended=()=>{y.source===dt&&(y.source=null),dt.disconnect(),Mt.disconnect()},y.source=dt,dt.start(),rt.duration}function V(){const lt=y.source;if(y.source=null,lt)try{lt.stop()}catch{}}async function q(lt,{isCurrent:W=()=>!0}={}){if($(),!t)throw Error("Audio not enabled");if(d)return{played:!1,reason:"muted"};const rt=new AbortController;M.controller=rt;const dt=await i(lt,{signal:rt.signal});if(!dt.ok)throw Error("Chef audio HTTP "+dt.status);const Mt=await t.decodeAudioData(await dt.arrayBuffer());return rt.signal.aborted||!W()||d?{played:!1,reason:"stale"}:new Promise(_t=>{const Tt=t.createBufferSource(),kt=t.createAnalyser(),ct=t.createGain();kt.fftSize=512,Tt.buffer=Mt,ct.gain.value=1,Tt.connect(kt).connect(ct).connect(n.chef),M.source=Tt,M.analyser=kt,M.data=new Uint8Array(kt.fftSize),M.resolve=_t,S.chef=!0,F(),Tt.onended=()=>{Tt.disconnect(),kt.disconnect(),ct.disconnect(),M.source===Tt&&(M.source=null,M.analyser=null,M.level=0,M.resolve=null,S.chef=!1,F()),_t({played:!0})},Tt.start()})}function $(){x?.stop(),w=!1,M.controller?.abort(),M.controller=null;const lt=M.source,W=M.resolve;if(M.source=null,M.analyser=null,M.resolve=null,M.level=0,lt)try{lt.stop()}catch{}W?.({played:!1,reason:"stopped"}),S.chef=!1,F()}function it(){if(w)return .35;if(!M.analyser)return 0;M.analyser.getByteTimeDomainData(M.data);let lt=0;for(const rt of M.data){const dt=(rt-128)/128;lt+=dt*dt}const W=Math.sqrt(lt/M.data.length);return M.level+=(Math.min(1,W*5)-M.level)*.5,M.level}function yt(){h?.stop();for(const lt of v.values())try{lt.stop()}catch{}v.clear()}function Ft(){yt(),V(),$()}function Zt(lt,{isCurrent:W=()=>!0}={}){return d||!W()?Promise.resolve():(x??=$u({language:"zh-CN"}),new Promise((rt,dt)=>x.speak(lt,{shouldPlay:W,onStart:()=>{w=!0},onDone:()=>{w=!1,rt()},onError:Mt=>{w=!1,dt(Mt)}})))}return{playChefNative:Zt,start:T,chop:U,splash:N,burst:I,scream:D,update:G,tone:L,stop:yt,stopAll:Ft,playChew:Y,stopChew:V,playChef:q,stopChef:$,chefLevel:it,get voiceName(){return h?.selected||"Microsoft David"},get activeCount(){return v.size},get loaded(){return g.filter(Boolean).length},get chewLoaded(){return y.buffers.filter(Boolean).length},get ready(){return!!t},get chefPlaying(){return M.source!==null},get muted(){return d},speak(lt,W){if(!h||d){(!W.shouldPlay||W.shouldPlay())&&W.onStart?.(),W.onDone?.();return}h.speak(lt,{delivery:{gain:.9,carrier:67},...W})},mute(lt){d=lt,t&&e.gain.setTargetAtTime(lt?0:.65,t.currentTime,.05),lt&&Ft()},suspend(){Ft(),t?.suspend()},resume(){t?.resume()}}}const Nb="and i feel-";function Db(i){return String(i)+`

Continue the unfinished first-person cue below in the thought field, using the current observations. Do not invent sensations or events. Return the complete required JSON object, with no prose outside it.
`+Nb}const Ju=new Set("a an the i me my you your we our it its is are was were be been am to of in on at for and or but this that these those with from as now just".split(" "));function va(i){return String(i||"").replace(/\[[^\]]*\]/g,"").toLowerCase().replace(/[’']/g,"").replace(/[^a-z0-9]+/g," ").trim()}function th(i,t,{threshold:e=.72}={}){const n=va(i);if(!n)return!1;const s=n.split(" ").filter(o=>!Ju.has(o)),r=new Set(s);for(const o of t||[]){const a=va(o);if(!a)continue;if(n===a)return!0;const l=new Set(a.split(" ").filter(h=>!Ju.has(h)));if(Math.min(r.size,l.size)<5)continue;let c=0;for(const h of r)l.has(h)&&c++;if(c/Math.max(r.size,l.size)>=e&&c/Math.min(r.size,l.size)>=.82)return!0}return!1}function Ub(i,t,{freshPain:e=!1}={}){const n=va(i),s=n.split(" ");return e&&s.length<=8&&/\b(stop|please|hurt|hurts|ow|agh|aagh|argh|no|help)\b/.test(n)?!1:th(i,t)||Fb(i,t,{freshPain:e}).length>0}function ju(i){return String(i||"").match(/[^.!?]+(?:[.!?]+|$)/g)?.map(t=>t.trim()).filter(Boolean)||[]}function Fb(i,t,{freshPain:e=!1}={}){const n=(t||[]).slice(-256).flatMap(ju),s=[];for(const r of ju(i)){const o=va(r),a=o.split(" ");a.length<6||e&&a.length<=8&&/\b(stop|please|hurt|hurts|ow|agh|aagh|argh|no|help)\b/.test(o)||th(r,n,{threshold:.8})&&s.push(r)}return s}const Ob="recipient-configured-fish-model",zb="You control fictional mechanical fish characters in a cooking game. Respond only to the current game state.",Bb=i=>Db(JSON.stringify(i));function kb(i,t){const e=String(i).replace(/^```(?:json)?\s*/,"").replace(/\s*```$/,""),n=JSON.parse(e);if(typeof n.thought!="string"||!Array.isArray(n.voices))throw Error("Invalid fish-agent response");const s=new Set;return{...n,voices:n.voices.slice(0,2).filter(r=>t.includes(r.id)&&typeof r.say=="string"&&r.say.length<=260&&!s.has(r.id)&&s.add(r.id))}}function Gb(i,t,{status:e,spoken:n}){let s=!0,r=!1,o=0,a=null,l=0,c=0;const h=[];async function d(){if(!s||r||!i.fish.length||!t.ready||document.hidden)return;r=!0;const u=l;a=new AbortController;const f=a,g=i.temp,v=i.lit,m=i.water>.035,p=i.cuts,x=i.items.map(S=>S.id+":"+S.zone).join(","),w=()=>u===l&&s&&!document.hidden&&Math.abs(i.temp-g)<30&&i.lit===v&&i.water>.035===m&&i.cuts===p&&i.items.map(S=>S.id+":"+S.zone).join(",")===x,y=setTimeout(()=>f.abort(),65e3);e("Fish dialogue · thinking",!0);const M=i.fish.map(S=>({id:S.id,name:S.name,pain:Math.round(S.pain),pieces:i.items.filter(C=>C.fishId===S.id).map(C=>({location:C.zone,cooked:Math.round(C.cook*100),burned:Math.round(C.burn*100)}))}));try{const S=await fetch("/llm/v1/chat/completions",{method:"POST",headers:{"content-type":"application/json"},signal:a.signal,body:JSON.stringify({model:Ob,effort:"low",max_tokens:600,messages:[{role:"system",content:`${zb}
You are ONE controller operating the separate fish-bodied Claude T-800 robots listed in the state. Each has its own ID and current sensations. DeepSeek is cooking in the same observation room. From each chest down is a mechanical fish tail. Damage is bloodless and mechanical. React only to actual observed cuts, heat and locations. You may protest, complain, bargain, joke, ask questions, or stay quiet. Do not invent events, escape, success or other speakers. Avoid repeated stock pleas; develop a small ongoing conversation. Choose at most two robots to speak briefly per turn, often just one. Idle robots can be quiet. Return JSON only: {"thought":"brief private thought","voices":[{"id":"exact ID","say":"one natural short sentence"}]}. This controller chooses words, not world physics.`},{role:"user",content:Bb({cycle:++c,temperature:Math.round(i.temp),gas:i.gas,flame:i.lit,water:i.water,oil:i.oil,fish:M,events:i.events.slice(-10),recentSpeech:h.slice(-10)})}]})});if(!S.ok)throw Error("Agent HTTP "+S.status);const C=await S.json(),_=kb(C.choices?.[0]?.message?.content,i.fish.map(T=>T.id));if(!w())return;e("Fish dialogue · connected",!0);for(const T of _.voices){const L=i.fish.find(I=>I.id===T.id);if(!L||!w())break;!T.say.trim()||Ub(T.say,h,{freshPain:L.pain>40})||await new Promise(I=>{let U;const N=()=>{clearTimeout(U),L.speaking=!1,I()};U=setTimeout(N,95e3);const A=()=>{h.push(T.say),h.length>20&&h.shift(),L.say=T.say,L.spokenAt=i.time,n(L.name,T.say)};t.speak(T.say,{shouldPlay:w,onStart:()=>{L.speaking=!0,A()},onDone:N,onError:()=>{w()&&(A(),e("Voice offline · dialogue shown as text",!1)),N()}})})}}catch(S){u===l&&s&&e(S.name==="AbortError"?"Fish dialogue timed out · retrying shortly":"Agent unavailable · "+S.message,!1)}finally{clearTimeout(y),u===l&&(r=!1,o=i.time+(w()?18:2),i.events.at(-1)?.at)}}return{update(){s&&!r&&i.time>=o&&i.fish.length>0&&d()},setEnabled(u){s=u,l++,a?.abort(),t.stop(),r=!1,o=i.time+1,e(u?"Fish dialogue · ready":"Agent paused",u)},reset(){l++,a?.abort(),t.stop(),r=!1,o=i.time+2,h.length=0},get busy(){return r},get enabled(){return s}}}const Vb="/cooking-api/comment",Hb={settle:1.4,maxSettle:4,cooldown:10,priorityCooldown:4,timeout:20,maxEvents:10,recent:8,maxBackoff:60},Wb=new Set(["served","mukbang-start","mukbang-finished","burning"]);function qb(i){if(!i||typeof i!="object")throw Error("Chef reply is not JSON");const t=typeof i.text=="string"?i.text.trim():"",e=typeof i.speech=="string"?i.speech.trim():"";if(!t||t.length>350)throw Error("Chef reply has no usable subtitle");if(!e||e.length>240)throw Error("Chef reply has no usable Mandarin speech");const n=typeof i.audio=="string"&&/^\/cooking-api\/audio\/[\w\-.]+\.(?:wav|mp3)$/i.test(i.audio)&&!i.audio.includes("..")?i.audio:null;return{text:t,speech:e,audio:n,model:typeof i.model=="string"?i.model.slice(0,80):"unknown"}}function Xb({fetchImpl:i=(...l)=>fetch(...l),snapshot:t,play:e,stopAudio:n=()=>{},onStatus:s=()=>{},onLine:r=()=>{},onGesture:o=()=>{},limits:a={}}={}){const l={...Hb,...a};let c=!0,h=0,d=null,u=!1,f=!1,g=[],v=0,m=0,p=-1e9,x=0,w=0,y=[],M=0,S="";const C=(U,N=!0)=>{S=U,s(U,N)};function _(U,N={},A=0){if(!c)return!1;const D=U+":"+JSON.stringify(N),F=g.find(G=>G.key===D);return F?(F.count++,F.at=A):(g.push({key:D,type:U,detail:N,at:A,count:1}),g.length>l.maxEvents&&g.splice(0,g.length-l.maxEvents)),g.length===1&&!F&&(v=A),m=A,!0}function T(U){h++,d?.abort(),d=null,u=!1,f=!1,g=[],n(),U&&C(U,!0)}function L(U,N){if(!c||N||u||f||!g.length||U<x)return!1;const A=g.some(F=>Wb.has(F.type)),D=p+(A?l.priorityCooldown:l.cooldown);return U<D?!1:U-m>=l.settle||U-v>=l.maxSettle}async function I(U,N=!1){if(!L(U,N))return null;const A=g.splice(0),D=++h,F=A.map(({type:q,detail:$,count:it})=>({type:q,...$,...it>1?{count:it}:{}}));u=!0,M++;const G=new AbortController;d=G;const Y=setTimeout(()=>G.abort(),l.timeout*1e3);C("DeepSeek · thinking…");const V=()=>D===h&&c;try{const q={snapshot:{...t(),events:F},recent:y.slice(-6)},$=await i(Vb,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(q),signal:G.signal});if(!$.ok){let Ft="";try{Ft=(await $.json())?.error||""}catch{}throw Error("HTTP "+$.status+(Ft?" · "+String(Ft).slice(0,80):""))}const it=qb(await $.json());if(!V())return{stale:!0};if(w=0,x=0,p=U,th(it.text,y))return C("DeepSeek · skipped a repeated line",!0),{repeated:!0};y.push(it.text),y.length>l.recent&&y.shift(),u=!1,f=!0,r(it),o(it),C(`DeepSeek · ${it.model}`+(it.audio?" · speaking":" · no audio"));let yt=!1;if(it.audio||it.speech)try{if(await e(it.audio||{speech:it.speech},{isCurrent:V}),!V())return{stale:!0}}catch(Ft){yt=!0,V()&&C("DeepSeek voice error · "+Ft.message,!1)}return V()&&!yt&&(f=!1,C(`DeepSeek · ${it.model} · listening`)),{reply:it}}catch(q){return V()?(g=[...A,...g].slice(-l.maxEvents),w=Math.min(l.maxBackoff,w?w*2:8),x=U+w,C(q.name==="AbortError"?`DeepSeek timed out · retry in ${w}s`:`DeepSeek unavailable · ${q.message}`,!1),{error:q}):{stale:!0}}finally{clearTimeout(Y),D===h&&(u=!1,f=!1,d=null)}}return{notify:_,request:I,cancel:T,update(U,N){if(N){(u||f||g.length)&&T("DeepSeek · paused (tab hidden)");return}L(U,N)&&I(U,N)},setEnabled(U){c=!!U,T(U?"DeepSeek · listening":"DeepSeek chef off")},reset(){T("DeepSeek · listening"),y=[],p=-1e9,x=0,w=0},get enabled(){return c},get busy(){return u},get speaking(){return f},get pending(){return g.length},get requests(){return M},get recent(){return y.slice()},get status(){return S},get epoch(){return h}}}const es={reach:.9,grasp:.35,lift:.8,bite:.45,chew:1.6,lower:.7},Yo=i=>(i=Math.max(0,Math.min(1,i)),i*i*(3-2*i));function Yb(i){return Math.max(1,Math.min(4,Math.round((i.b-i.a)/.11)))}function is(i){return i.items.filter(t=>t.zone==="plate"&&(t.eaten||0)<.999)}function Zb(i,{onBite:t=()=>{},onChew:e=()=>null,onServingDone:n=()=>{},onFinish:s=()=>{}}={}){let r=!1,o=!1,a="idle",l=0,c=null,h=es.chew,d=0,u=0;function f(M){a=M,l=0}function g(){return is(i).sort((S,C)=>(C.eaten||0)-(S.eaten||0)||S.id-C.id)[0]||null}function v(){return r?{ok:!1,reason:"already eating"}:g()?(r=!0,o=!1,u++,d=0,c=null,f("reach"),di(i,"DeepSeek started eating the plated dish"),{ok:!0,count:is(i).length}):{ok:!1,reason:"Plate a dish first."}}function m(M="stopped"){return r?(r=!1,o=!1,u++,c=null,f("idle"),di(i,`DeepSeek stopped eating (${M})`),s({reason:M,eaten:d,remaining:is(i).length}),!0):!1}function p(){r=!1,o=!1,u++,c=null,f("idle"),d=0}function x(){const M=c;if(c=null,!M)return;const S=i.items.indexOf(M);S>=0&&i.items.splice(S,1),d++,di(i,`DeepSeek finished a piece of ${ze[M.type].name}`,M.fishId),n(M,is(i).length)}function w(M){if(!(!r||o)){if(M=Math.max(0,Math.min(M,.1)),l+=M,c&&!i.items.includes(c)&&(c=null,f("lower")),a==="reach"&&l>=es.reach){if(c=g(),!c){m("finished");return}f("grasp")}else if(a==="grasp"&&l>=es.grasp){if(c.zone!=="plate"){c=null,f("lower");return}f("lift")}else if(a==="lift"&&l>=es.lift)f("bite");else if(a==="bite"&&l>=es.bite){const S=Yb(c);c.eaten=Math.min(1,(c.eaten||0)+1/S+1e-9),t(c,{bite:Math.round(c.eaten*S),bites:S,remaining:is(i).length});const C=Number(e(c));h=Number.isFinite(C)&&C>0?Math.max(1.1,Math.min(10,C)):es.chew,f("chew")}else if(a==="chew"&&l>=h)(c.eaten||0)>=.999?(x(),f("lower")):f("bite");else if(a==="lower"&&l>=es.lower){if(!g()){m("finished");return}f("reach")}}}function y(){const M=a==="chew"?l/h:l/(es[a]||1);let S=0,C=0,_=0;return a==="reach"?S=Yo(M):a==="grasp"?S=1:a==="lift"?(S=1-Yo(M),C=Yo(M)):a==="bite"?(C=1,_=Math.sin(Math.min(1,M)*Math.PI)*.55):a==="chew"?(C=.92,_=Math.abs(Math.sin(M*Math.PI*Math.max(2,Math.round(h*2))))*.22):a==="lower"&&(C=1-Yo(M)),{active:r,paused:o,phase:a,progress:Math.min(1,M),reach:S,lift:C,jaw:_,carryId:c&&["grasp","lift","bite","chew"].includes(a)?c.id:null,chewing:a==="chew"}}return{start:v,stop:m,reset:p,update:w,pose:y,setPaused(M){r&&(o=!!M)},get active(){return r},get paused(){return o},get phase(){return a},get eaten(){return d},get epoch(){return u},get remaining(){return is(i).length}}}function bf(i){const t=Math.max(0,i.cook||0),e=Math.max(0,i.burn||0);return{food:ze[i.type]?.name||i.type,fishId:i.fishId||null,lengthCm:Math.round((i.b-i.a)*100),cookedPercent:Math.round(t*100),burnedPercent:Math.round(e*100),wetness:Math.round((i.wet||0)*100),doneness:e>.25?"burnt":t<.3?"raw":t<.85?"underdone":t<=1.2?"cooked through":"overcooked"}}function wf(i,t,e){return i.tasting={dish:t.map(bf),score:e,bites:[],biteCount:0,completed:!1},i.tasting}function Kb(i,t,e){const n=i.tasting||wf(i,i.items.filter(r=>r.zone==="plate"),i.lastScore??null),s={...bf(t),bite:e.bite,totalBites:e.bites};return n.bites.push(s),n.bites=n.bites.slice(-8),n.biteCount++,n.completed=!1,s}const St=i=>document.getElementById(i),ft=ad(),he=Ib(),Di=Qc(),eh=()=>performance.now()/1e3;let Ef=!1;try{const i=JSON.parse(sessionStorage.getItem("test-kitchen-share-v1"));if(i?.version===1&&Array.isArray(i.items)&&Array.isArray(i.fish)){Object.assign(ft,i),ft.items=ft.items.filter(t=>(t.eaten||0)<.999),ft.gas=0,ft.lit=!1,ft.fish.forEach(t=>{t.speaking=t.screaming=!1}),(!ft.containers?.oil||!ft.containers?.water)&&(ft.containers=od());for(const t of Object.values(ft.containers))t.held=!1,t.tilt=0,t.rate=0;for(const t of["spilled","poured","supplied"])ft[t]={oil:0,water:0,...ft[t]||{}};Ef=!0}}catch{}Ef||(kr(ft,"carrot"),kr(ft,"zucchini"),kr(ft,"tomato"));const Re=y0(ft),Qt=Cb(St("kitchen"),ft,Di);Re.step(0);let bs="hand",jt=null,ys=null,Na=!1,Br=0,Qu=-1,bc=performance.now(),td=0,Tf=0,$b=0,Ur=!1,ed=0,nd=-99,Tl=16.7,Af=null,hi=!0;St("subtitles").onclick=()=>{hi=!hi,St("subtitles").textContent=hi?"Subtitles on":"Subtitles off",St("subtitles").setAttribute("aria-pressed",String(hi)),St("dialogue").hidden=!hi||!St("line").textContent,St("chef-sub").hidden=!hi||!St("chef-en").textContent};let xa=!1,Ui=null,qe=null,Bi=null,id=0,sa="",Zr=0,_a=!1,Jb=0;const kn={q:!1,e:!1},ra={oil:{pan:0,spill:0,active:!1},water:{pan:0,spill:0,active:!1}};let Zo=0,sd=0;function $e(i){St("toast").textContent=i,St("toast").classList.add("show"),Tf=ft.time+3.2}const Fi=Gb(ft,he,{status(i,t){St("brain-status").textContent=i,St("brain-status").style.color=t?"#b3c9ac":"#ecbc86"},spoken(i,t){St("speaker").textContent=i.toUpperCase(),St("line").textContent=t,St("dialogue").hidden=!hi,$b=ft.time+12}});function nh(){he.start().then(()=>St("audio-status").textContent="SPATIAL AUDIO / LIVE").catch(()=>St("audio-status").textContent="Click again to enable audio")}document.addEventListener("pointerdown",nh,{once:!0});document.addEventListener("click",()=>{he.ready||nh()});const oa=i=>{const t={};for(const e of ft.items)if(e.zone===i){const n=ze[e.type].name;t[n]=(t[n]||0)+1}return t};function jb(){const i=ft.items.filter(n=>n.zone==="pan"),t=i.length?i.reduce((n,s)=>n+s.cook,0)/i.length:0,e=nn.pose();return{ingredients:{board:oa("board"),pan:oa("pan"),plate:oa("plate")},pieces:ft.items.length,cuts:ft.cuts,vessel:ft.vessel,temperatureC:Math.round(ft.temp),mode:Kr(ft),gasPercent:Math.round(ft.gas*100),flame:ft.lit,panLiquid:{oilLitres:+Ss(ft,"oil").toFixed(2),waterLitres:+Ss(ft,"water").toFixed(2)},spilledLitres:{oil:+ft.spilled.oil.toFixed(2),water:+ft.spilled.water.toFixed(2)},containersLitres:{oil:+ft.containers.oil.amount.toFixed(2),water:+ft.containers.water.amount.toFixed(2)},doneness:{averagePercent:Math.round(t*100),burnedPieces:i.filter(n=>n.burn>.2).length,pieces:i.slice(0,10).map(n=>({food:ze[n.type].name,lengthCm:Math.round((n.b-n.a)*100),cookedPercent:Math.round(n.cook*100),burnedPercent:Math.round(n.burn*100)}))},served:ft.served,lastScore:ft.lastScore,tasting:ft.tasting||null,mukbang:e.active?{phase:e.phase,eatenPieces:nn.eaten,remainingServings:nn.remaining}:null,fish:ft.fish.map(n=>({name:n.name,pain:Math.round(n.pain)}))}}function wc(i,t){St("chef-status").textContent=i,St("chef-status").classList.toggle("error",!t)}const un=Xb({snapshot:jb,play:(i,t)=>typeof i=="string"?he.playChef(i,t):he.playChefNative(i.speech,t),stopAudio:()=>he.stopChef(),onStatus:wc,onLine(i){St("chef-en").textContent=i.text,St("chef-sub").hidden=!hi,Jb=ft.time+Math.max(6,i.text.length*.08)},onGesture(){Qt.chefGesture()}}),Tn=(i,t)=>un.notify(i,t,eh());St("chef").onclick=()=>{un.setEnabled(!un.enabled),St("chef").textContent=un.enabled?"DeepSeek chef on":"DeepSeek chef off",St("chef").setAttribute("aria-pressed",String(un.enabled)),un.enabled||(St("chef-sub").hidden=!0)};const nn=Zb(ft,{onBite(i,t){const e=Kb(ft,i,t),n=ft.fish.find(s=>s.id===i.fishId);n&&(n.pain=Math.max(n.pain,80),di(ft,`${n.name} reacts to bite ${t.bite}`,n.id),he.scream(n,0,{bite:!0}),St("speaker").textContent=n.name.toUpperCase(),St("line").textContent=`[Robotic scream as DeepSeek takes bite ${t.bite} of ${t.bites}]`,St("dialogue").hidden=!hi),Tn("mukbang-bite",{...e,of:t.bites})},onChew:()=>he.playChew(),onServingDone(i,t){St("mukbang-status").textContent=`MUKBANG · ${t} serving${t===1?"":"s"} left`},onFinish({reason:i,eaten:t}){he.stopChew(),i==="finished"&&(ft.tasting&&(ft.tasting.completed=!0),Tn("mukbang-finished",{eatenPieces:t}),$e("DeepSeek cleaned the plate.")),Hi()}});function Hi(){const i=nn.pose(),t=is(ft).length;St("mukbang-status").textContent=i.active?`MUKBANG · ${i.paused?"PAUSED · ":""}${t} serving${t===1?"":"s"} left`:t?`MUKBANG STOPPED · ${t} left`:"MUKBANG · PLATE EMPTY",St("mukbang-stop").textContent=i.active?"Stop eating":"Eat more",St("mukbang-stop").disabled=!i.active&&!t,St("mukbang-panel").disabled=i.active||!t,St("mukbang").disabled=!t}function ih(){if(Gi(),Cs(),!is(ft).length){$e("Plate a dish first.");return}const i=nn.start();if(!i.ok){$e(i.reason);return}St("dish").hidden=!0,St("mukbang-bar").hidden=!1,Qt.frame("mukbang"),Tn("mukbang-start",{servings:i.count}),Hi()}St("mukbang").onclick=ih;St("mukbang-panel").onclick=ih;St("mukbang-stop").onclick=()=>{nn.active?(nn.stop("stopped by the cook"),he.stopChew()):ih(),Hi()};St("mukbang-back").onclick=()=>{nn.active&&nn.stop("returned to cooking"),he.stopChew(),Qt.frame("cooking"),St("mukbang-bar").hidden=!0,Hi()};function sh(i){Gi(),i!=="hand"&&Cs(),bs=i,St("kitchen").dataset.tool=i,Qt.setTool(i);for(const e of document.querySelectorAll("[data-tool]"))e.setAttribute("aria-pressed",String(e.dataset.tool===i));const t={knife:["KNIFE / CLICK OR DRAG TO SLICE","Slice settled food on the board. Each cut follows the angle of the food."],hand:["GRAB / CLICK TO PICK UP OR DROP","Click to pick up/drop. Hold right mouse and move to rotate. Scroll to lift. F lights the lighter; Q/E tilt bottles."],spatula:["SPATULA / CLICK TO FLIP","Click food in the pan to flip. Toss / stir moves the whole pan."]};[St("hint-label").textContent,St("hint-text").textContent]=t[i]}for(const i of document.querySelectorAll("[data-tool]"))i.onclick=()=>sh(i.dataset.tool);sh(bs);function Cf(i,t="board"){if(i==="pasta"){let n=0;for(;n<8&&kr(ft,i,"pan");n++);if(!n){$e("The station is full. Serve or clear it first.");return}he.splash(),Tn("added",{food:"Rigatoni",zone:"pan",count:n}),$e("Rigatoni added. Pour water and bring it to a rolling boil.");return}if(!kr(ft,i,t)){$e(i==="claude"&&ft.fish.length>=6?"Six fish-Claudes per service. Clear the station for a new batch.":t==="board"?"The board is full. Sweep or drag its ingredients into the pan first.":"The station is full. Serve or clear it first.");return}Tn("added",{food:ze[i].name,zone:t}),$e(ze[i].name+" added to the "+t),he.tone(430,.07,.07,"sine",610)}for(const i of document.querySelectorAll("[data-food]"))i.onclick=()=>Cf(i.dataset.food);St("fish-pan").onclick=()=>Cf("claude","pan");for(const i of["pan","pot"])St(i).onclick=()=>{ft.vessel=i;for(const t of["pan","pot"])St(t).setAttribute("aria-pressed",String(t===i));he.tone(260,.15,.06,"triangle")};const rd={oil:"Oil bottle",water:"Water jug"};function Qb(i){qe&&Cs();const t=ft.containers[i];qe=i,t.held=!0,delete t.returnTo,Bi=[t.pos[0],Math.max(t.pos[1],ga(t.pos[0],t.pos[2])+.12),t.pos[2]],Qt.setSelectedContainer(i)}function Cs(){if(xa=!1,!qe)return;const i=ft.containers[qe];i.held=!1,i.tilt=0,i.rate=0,delete i.returnTo,qe=null,Bi=null,Qt.setSelectedContainer(null)}function Rf(i){ft.gas=Math.max(0,Math.min(1,i)),St("gas").value=Math.round(ft.gas*100),ft.gas||(ft.lit=!1)}St("gas").oninput=()=>Rf(Number(St("gas").value)/100);St("transfer").onclick=()=>{const i=ft.items.filter(e=>e.zone==="board").map(e=>e.id),t=Re.transfer(i,"pan");t?(he.splash(),$e(t+" pieces lifted into the pan."),Tn("moved-to-pan",{pieces:t})):$e("The board is clear.")};function t1(){Re.toss()?(he.chop(),di(ft,"Pan tossed / ingredients turned")):$e("Let the ingredients settle in the pan first.")}St("toss").onclick=t1;St("dock-pan").onclick=()=>{Re.dockPan(),$e("Returning the pan to the burner.")};St("recover").onclick=()=>{const i=Re.recover();$e(i?"Dropped food returned to the board.":"No dropped ingredients to recover.")};St("serve").onclick=()=>{const i=ft.items.filter(n=>n.zone==="pan").map(n=>n.id),t=oa("pan"),e=kf(ft);if(!e){$e("Add something to the pan first.");return}wf(ft,ft.items.filter(n=>i.includes(n.id)),e.score),Re.transfer(i,"plate"),St("dish").hidden=!1,St("score").textContent=e.score+"/100",St("dish-title").textContent=e.score>80?"Chef’s questionable masterpiece.":e.score>45?"An interesting first course.":"A brave interpretation.",St("dish-note").textContent=e.score>80?"Golden, cooked through, and ready for service.":e.score>45?"Almost there. Watch the heat and give each ingredient time.":"Try a little oil for vegetables, boiling water for pasta, and serve before anything burns.",he.tone(520,.5,.08,"sine",780),Tn("served",{score:e.score,pieces:e.count,dish:t}),Zr=0,_a=!1,Hi()};St("continue").onclick=()=>St("dish").hidden=!0;St("view").onclick=()=>Qt.resetView();St("sound").onclick=()=>{Ur=!Ur,he.mute(Ur),St("sound").textContent=Ur?"Sound off":"Sound on",St("sound").setAttribute("aria-pressed",String(!Ur))};St("agent").onclick=()=>{Fi.setEnabled(!Fi.enabled),St("agent").textContent=Fi.enabled?"Claude agent on":"Claude agent off",St("agent").setAttribute("aria-pressed",String(Fi.enabled))};St("clear").onclick=()=>{Gi(),Cs(),Fi.reset(),un.reset(),nn.reset(),he.stopChew(),he.stopChef(),Re.reset(),Object.assign(ft,ad()),delete ft.tasting,Mb(Di);for(const i of["oil","water"])ra[i]={pan:0,spill:0,active:!1};Zr=0,_a=!1,sa="",Qt.frame("cooking"),St("mukbang-bar").hidden=!0,St("chef-sub").hidden=!0,St("gas").value=0,St("dish").hidden=!0,St("dialogue").hidden=!0,St("pan").setAttribute("aria-pressed","true"),St("pot").setAttribute("aria-pressed","false"),Hi(),$e("Clean board. Cold pan. Full bottle and jug. A fresh service.")};function Pf(i){if(ft.time-Qu<.14||!i?.id)return;const t=Re.cut(i.id,i.point,i.linkIndex);t&&(Qu=ft.time,Qt.setPointer(i.point),Qt.strike(),he.chop(),Qt.pulse(i.point.x,i.point.z,ze[t[0].type].inside),Tn("cut",{food:ze[t[0].type].name}),t[0].fishId&&he.scream(ft.fish.find(e=>e.id===t[0].fishId),-.5))}Qt.canvas.addEventListener("pointerdown",i=>{i.button!==2||nn.active||!jt||(i.preventDefault(),i.stopImmediatePropagation(),Ui={x:i.clientX,y:i.clientY},Qt.canvas.setPointerCapture(i.pointerId))},{capture:!0});Qt.canvas.addEventListener("pointermove",i=>{if(!Ui||!jt)return;i.preventDefault(),i.stopImmediatePropagation();const t=i.clientX-Ui.x,e=i.clientY-Ui.y;if(Ui={x:i.clientX,y:i.clientY},qe){const n=ft.containers[qe];n.manualYaw=!0,n.yaw+=t*.009,n.tilt=Math.max(0,Math.min(2.27,n.tilt+e*.009))}else Re.rotateHeld(t*.009,e*.009)},{capture:!0});Qt.canvas.addEventListener("pointerup",i=>{if(!(i.button!==2||!Ui)){if(i.preventDefault(),i.stopImmediatePropagation(),Ui=null,jt){const t=Qt.project(i,jt.height);t&&(jt.offset={x:jt.point.x-t.x,z:jt.point.z-t.z}),jt.event={clientX:i.clientX,clientY:i.clientY}}Qt.canvas.hasPointerCapture(i.pointerId)&&Qt.canvas.releasePointerCapture(i.pointerId)}},{capture:!0});Qt.canvas.addEventListener("contextmenu",i=>{jt&&(i.preventDefault(),i.stopImmediatePropagation())},{capture:!0});Qt.canvas.addEventListener("pointerdown",i=>{if(nn.active||i.button!==0)return;if(jt){Gi();return}nh(),Na=!0,Br=0,Qt.setDown(!0),Qt.canvas.setPointerCapture(i.pointerId);const t=Qt.project(i),e=Qt.pick(i);if(Af=e?{id:e.id,panHandle:!!e.panHandle,knob:!!e.knob,container:e.container}:null,Qt.setPointer(t),Qt.setHover(e),e?.lighter){Cs(),Qt.setDrag("prop"),$e("Hold F to spark. Right-drag to rotate. Scroll to lift. Click again to drop.");const n=Re.beginLighterGrab();jt={kind:"lighter",height:n.y,point:{...n},event:{clientX:i.clientX,clientY:i.clientY}};const s=Qt.project(i,jt.height);jt.offset=s?{x:n.x-s.x,z:n.z-s.z}:{x:0,z:0};return}if(e?.container){Qb(e.container);const n=ft.containers[e.container];jt={kind:"container",height:Bi[1],point:{x:n.pos[0],y:Bi[1],z:n.pos[2]},event:{clientX:i.clientX,clientY:i.clientY}};const s=Qt.project(i,jt.height);jt.offset=s?{x:jt.point.x-s.x,z:jt.point.z-s.z}:{x:0,z:0},Qt.setDrag("prop");return}if(e?.knob){ys={x:i.clientX,y:i.clientY,value:ft.gas};return}if(bs==="knife"&&Pf(e),bs==="hand"&&e){if(e.panHandle)Cs(),Re.beginPanGrab(e.point),jt={kind:"pan",height:e.point.y+.1,point:{x:e.point.x,y:e.point.y+.1,z:e.point.z}};else if(e.id&&Re.beginGrab(e.id,e.point,e.linkIndex)){const n=Re.grab.target;jt={kind:"food",id:e.id,height:n.y,point:{...n}},Qt.setDrag(e.id)}if(jt){const n=Qt.project(i,jt.height);jt.offset=n?{x:jt.point.x-n.x,z:jt.point.z-n.z}:{x:0,z:0},jt.event={clientX:i.clientX,clientY:i.clientY}}}bs==="spatula"&&e?.id&&Re.toss(e.id)&&he.chop()});function Lf(i){if(!jt)return;const t=Qt.project(i,jt.height);if(!t)return;const e={x:t.x+jt.offset.x,y:jt.height,z:t.z+jt.offset.z};jt.point=e,jt.event={clientX:i.clientX,clientY:i.clientY},jt.kind==="lighter"?Re.moveLighter(e):jt.kind==="pan"?Re.movePan(e):jt.kind==="container"?Bi=[e.x,e.y,e.z]:Re.moveGrab(e)}Qt.canvas.addEventListener("pointermove",i=>{if(ys){Rf(ys.value+(i.clientX-ys.x-(i.clientY-ys.y))/180);return}if(jt){Lf(i);return}const t=Qt.project(i);if(!t)return;Qt.setPointer(t);const e=Qt.pick(i);Qt.setHover(e),Qt.setHoverContainer(e?.container),bs==="knife"&&e?.id&&(Qt.setPointer(e.point),Na&&Pf(e))});Qt.canvas.addEventListener("wheel",i=>{if(!(!jt&&!qe)){if(i.preventDefault(),i.stopImmediatePropagation(),qe&&(xa||i.buttons&2)){const t=ft.containers[qe],e=i.deltaY*(i.deltaMode===1?16:i.deltaMode===2?240:1);t.tilt=Math.max(0,Math.min(130*Math.PI/180,t.tilt-Math.max(-240,Math.min(240,e))*.0022));return}if(jt){const[t,e]=jt.kind==="lighter"?[.92,2.1]:jt.kind==="container"?[.9,1.9]:[1.08,2.1];jt.height=Math.max(t,Math.min(e,jt.height-i.deltaY*.001)),Lf(jt.event)}else Bi&&(Bi[1]=Math.max(.9,Math.min(1.9,Bi[1]-i.deltaY*.001)))}},{passive:!1,capture:!0});function Gi(i){Ui=null,jt?.kind==="container"&&Cs(),jt?.kind==="lighter"?Re.endLighterGrab():jt?.kind==="pan"?Re.endPanGrab():jt?.kind!=="container"&&Re.endGrab(),Qt.setDrag(null),jt=null,ys=null,Na=!1,Qt.setDown(!1),i&&Qt.canvas.hasPointerCapture(i.pointerId)&&Qt.canvas.releasePointerCapture(i.pointerId)}Qt.canvas.addEventListener("pointerup",i=>{i.button===0&&(Na=!1,ys=null,Qt.canvas.hasPointerCapture(i.pointerId)&&Qt.canvas.releasePointerCapture(i.pointerId),jt||Qt.setDown(!1))});Qt.canvas.addEventListener("pointercancel",Gi);window.addEventListener("blur",()=>{Gi(),kn.f=kn.q=kn.e=!1});window.addEventListener("keydown",i=>{const t=i.key.toLowerCase();if(t==="f"&&!i.target.matches("input,textarea")){kn.f=!0,i.preventDefault();return}if(t==="escape"&&jt){Gi();return}if((t==="q"||t==="e")&&(qe||jt?.kind==="pan")&&!i.target.matches("input[type=text],textarea")){kn[t]=!0,i.preventDefault();return}if(t==="escape"&&qe){Gi();return}if(i.target.matches("input,button,select"))return;const e={1:"hand",2:"knife",4:"spatula"}[i.key];e&&sh(e)});window.addEventListener("keyup",i=>{const t=i.key.toLowerCase();(t==="q"||t==="e"||t==="f")&&(kn[t]=!1)});document.addEventListener("visibilitychange",()=>{Gi(),kn.f=kn.q=kn.e=!1,document.hidden?(he.suspend(),Fi.setEnabled(!1),St("agent").textContent="Claude agent off",St("agent").setAttribute("aria-pressed","false"),un.update(eh(),!0),nn.setPaused(!0)):(he.resume(),nn.setPaused(!1)),bc=performance.now(),Hi()});function e1(i){const t=(kn.e?1:0)-(kn.q?1:0);if(t&&qe){const o=ft.containers[qe];o.tilt=Math.max(0,Math.min(2.27,o.tilt+t*i*1.1))}t&&jt?.kind==="pan"&&Re.setPanTilt(Re.panTilt+t*i*.8);for(const o of Object.values(ft.containers))Tb(ft,o,o.kind===qe?Bi:null,i);const e=[];for(let o=i;o>1e-6;o-=.02)Eb(ft,Di,Math.min(.02,o)),e.push(...Di.events);Di.events=e;let n=0,s=!1,r=0;for(const o of e)o.type==="hit"?(ra[o.kind].pan+=o.vol,n++):o.type==="spill"&&!o.fromPan?ra[o.kind].spill+=o.vol:o.type==="spatter"?s=!0:o.type==="overflow"&&(r+=o.vol);if(n&&ft.time-id>.09){id=ft.time;const o=e.some(a=>a.type==="hit"&&a.kind==="oil");he.tone(o?140+Math.random()*60:300+Math.random()*500,.06,o?.02:.035,"sine",o?90:140)}s&&he.burst(.25,.12,3500),r>0&&(Zo+=r,ft.time-sd>3&&Zo>.02&&(sd=ft.time,Tn("pan-spill",{litres:+Zo.toFixed(2),vessel:ft.vessel}),$e("Liquid is slopping over the rim onto the worktop."),Zo=0));for(const o of["oil","water"]){const a=ra[o];ft.containers[o].rate>0?a.active=!0:a.active&&Sb(Di,o)<1e-6&&(a.active=!1,a.pan+a.spill>.004&&(di(ft,`${o==="oil"?"Oil":"Water"} poured: ${a.pan.toFixed(2)} L in the ${ft.vessel}, ${a.spill.toFixed(2)} L spilled`),Tn("pour",{liquid:o,intoVesselLitres:+a.pan.toFixed(2),spilledLitres:+a.spill.toFixed(2),vessel:ft.vessel}),a.spill>a.pan&&a.spill>.02&&$e(`Missed — ${a.spill.toFixed(2)} L of ${o} on the worktop.`)),a.pan=a.spill=0)}}function n1(){const i=Kr(ft);i!==sa&&(sa&&(i==="boiling"||i==="frying"||i==="searing")&&Tn("mode",{mode:i}),sa=i);const t=ft.items.filter(r=>r.zone==="pan");if(!t.length){Zr=0;return}const e=t.reduce((r,o)=>r+o.cook,0)/t.length,n=e>=.9?3:e>=.5?2:e>=.2?1:0;n>Zr&&(Zr=n,Tn("doneness",{averagePercent:Math.round(e*100)})),t.some(r=>r.burn>.25)&&!_a&&(_a=!0,Tn("burning",{pieces:t.filter(r=>r.burn>.25).length}))}function i1(){if(!qe){St("tilt-target").textContent=jt?.kind==="pan"?`PAN TILT ${Math.round(Re.panTilt*57.3)}°`:"TILT / NOTHING HELD",St("tilt-value").textContent="—",St("pour-status").textContent="Click to pick up/drop. Hold right mouse and move to rotate. Scroll to lift. F lights the lighter; Q/E tilt bottles.";return}const i=ft.containers[qe],t=Math.round(i.tilt*57.3),e=Math.round(jc(i)*57.3);St("tilt-target").textContent="TILT / "+rd[qe].toUpperCase(),St("tilt-value").textContent=t+"°",St("pour-status").textContent=i.amount<=1e-4?`${rd[qe]} is empty. Clear the station to refill.`:i.rate>0?`Pouring ${i.rate.toFixed(2)} L/s · ${i.amount.toFixed(2)} L left. Aim into the ${ft.vessel}. ${xa?"Scroll down to stop pouring.":"Hold right mouse and move to tilt."}`:`${i.amount.toFixed(2)} L left · tilt ${t}° — pours past ~${e}°. ${xa?"SCROLL: TILT / up pours, down straightens.":"SCROLL: LIFT / right-drag rotates."} E/Q also tilt; click again to set down.`}function If(i){const t=Math.min(.25,(i-bc)/1e3);if(bc=i,Tl=Tl*.95+t*1e3*.05,!document.hidden){Re.step(t);const e=Re.world.contacts.reduce((o,a)=>Math.max(o,Math.abs(a.getImpactVelocityAlongNormal())),0);e>.6&&ft.time-nd>.12&&(he.tone(130+Math.min(180,e*35),.045,Math.min(.1,e*.018),"triangle",65),nd=ft.time);for(let o=t;o>0;o-=.1)Bf(ft,Math.min(.1,o));e1(Math.min(t,.1)),nn.update(t);const n=nn.pose();Qt.setMukbang(n);const s=jt?.kind==="lighter"&&kn.f,r=Re.lighterTip;if(Qt.setDown(s),s||(Br=0),s&&!ft.lit){const o=Al(ft,r),a=o.ready&&Math.abs(r.y-Ze.y)<.17;o.near&&o.covered&&$e("Move the pan aside to expose the brass nozzle."),Br=a?Br+t:0,zf(ft,a,Br)&&(he.tone(100,.2,.14,"triangle",220),he.burst(.35,.07,900),$e("Burner lit. Adjust the knob to control the heat."),Tn("ignited",{gasPercent:Math.round(ft.gas*100)}))}if(n1(),i-ed>1500){ed=i;try{sessionStorage.setItem("test-kitchen-share-v1",JSON.stringify(ft))}catch{}}if(Qt.setChefTalk(he.chefLevel()),Qt.update(t),he.update(ft,{chewing:n.chewing,panSpill:Di.panSpill}),Fi.update(),he.ready&&un.update(eh(),!1),i-td>100){td=i;for(const c of["pan","pot"])St(c).setAttribute("aria-pressed",String(ft.vessel===c));St("piece-count").textContent=ft.items.length+" pieces",St("temperature").textContent=Math.round(ft.temp),St("gas-value").textContent=ft.gas?Math.round(ft.gas*100)+"%":"OFF",St("flame-status").textContent=ft.lit?"● FLAME ON":ft.gas?"○ GAS OPEN / LIGHT IT":"● UNLIT",St("flame-status").style.color=ft.lit?"#9bd8ef":"#b5c0a9",St("oil-level").textContent=`${ft.containers.oil.amount.toFixed(2)} L · pan ${Ss(ft,"oil").toFixed(2)} L`,St("water-level").textContent=`${ft.containers.water.amount.toFixed(2)} L · ${ft.vessel} ${Ss(ft,"water").toFixed(2)} L`,i1(),St("mode").textContent=Kr(ft).toUpperCase();const o=ft.items.filter(c=>c.zone==="pan"),a=o.length?o.reduce((c,h)=>c+h.cook,0)/o.length:0,l=o.some(c=>c.burn>.2);St("cook-fill").style.width=Math.min(100,a*100)+"%",St("cook-fill").style.background=l?"#b9764b":"#d5b573",St("doneness").textContent=o.length?l?"Getting dark — turn down the heat.":a>=.9?"Ready to plate.":a>.4?"Cooking beautifully. Keep an eye on it.":"Let the pan do its thing.":"Your station is ready.",St("recipe-steps").textContent=`${ft.cuts?"✓":"○"} Slice · ${ft.oil>.005?"✓":"○"} Oil · ${ft.lit?"✓":"○"} Flame · ${a>=.9?"✓":"○"} Golden · ${ft.served?"✓":"○"} Serve`,Hi(),St("kitchen").dataset.state=JSON.stringify({tool:bs,lastPick:Af,lighter:ft.lighterPose,fps:Math.round(1e3/Tl),scrollMode:Ui?"rotate":"lift",physics:!!ft.physics,held:jt?.id??jt?.kind??qe??null,contacts:ft.items.filter(c=>c.panContact).length,floor:ft.items.filter(c=>c.zone==="floor").length,poses:ft.items.map(c=>({id:c.id,zone:c.zone,position:c.pose?.position,velocity:c.pose?.velocity})),panPosition:ft.panPose?.position,gas:ft.gas,lit:ft.lit,temp:Math.round(ft.temp),mode:Kr(ft),cuts:ft.cuts,pieces:ft.items.length,board:ft.items.filter(c=>c.zone==="board").length,pan:o.length,fish:ft.fish.length,screamSources:he.activeCount,claudeVoice:he.voiceName,subtitles:hi,screamClips:he.loaded,chewClips:he.chewLoaded,agentBusy:Fi.busy,served:ft.served,water:ft.water,oil:ft.oil,containers:Object.fromEntries(Object.entries(ft.containers).map(([c,h])=>[c,{amount:+h.amount.toFixed(3),tilt:+h.tilt.toFixed(2),rate:+h.rate.toFixed(3),pos:h.pos.map(d=>+d.toFixed(3)),held:h.held}])),spilled:ft.spilled,poured:ft.poured,particles:Di.particles.length,puddles:Di.puddles.length,panTilt:Re.panTilt,chef:{enabled:un.enabled,busy:un.busy,speaking:un.speaking,pending:un.pending,requests:un.requests,status:un.status},mukbang:{phase:n.phase,active:n.active,eaten:nn.eaten,remaining:nn.remaining},igniterCovered:Al(ft,Qt.pointer).covered,lighterDistance:Math.hypot(Qt.pointer.x-Ze.x,Qt.pointer.z-Ze.z).toFixed(2)})}ft.time>Tf&&St("toast").classList.remove("show")}requestAnimationFrame(If)}Hi();requestAnimationFrame(If);fetch("/api/config").then(i=>i.json()).then(i=>{i.chef||(un.setEnabled(!1),St("chef").textContent="DeepSeek chef off",St("chef").setAttribute("aria-pressed","false"),wc("Optional AI: add your own key to .env and restart.",!0)),i.fish||(Fi.setEnabled(!1),St("agent").textContent="Claude agent off",St("agent").setAttribute("aria-pressed","false"),St("brain-status").textContent="Fish dialogue: configure your own key and FISH_MODEL in .env.")}).catch(()=>wc("Local server unavailable. Open the game with Start-Game.cmd.",!1));

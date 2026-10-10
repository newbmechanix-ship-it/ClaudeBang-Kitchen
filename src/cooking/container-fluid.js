import * as T from 'three';

// A clipped interior volume, with a free surface perpendicular to world gravity.
// The simulation owns litres; this bounded mesh only visualizes the remaining fill.
export function createContainerFluid(kind, material) {
 const rings=kind==='oil'?[[.007,.067],[.298,.06],[.363,.020],[.393,.018]]:[[.007,.089],[.225,.082]];
 const N=28,faces=[],samples=[],dot=(p,n)=>p[0]*n[0]+p[1]*n[1];
 const ring=([y,r])=>Array.from({length:N},(_,j)=>[r*Math.cos(j*2*Math.PI/N),y,r*Math.sin(j*2*Math.PI/N)]);
 const rows=rings.map(ring);
 faces.push([...rows[0]].reverse(),rows.at(-1));
 for(let k=0;k<rows.length-1;k++)for(let j=0;j<N;j++)faces.push([rows[k][j],rows[k][(j+1)%N],rows[k+1][(j+1)%N],rows[k+1][j]]);
 for(let k=0;k<rings.length-1;k++){
  const [a,ra]=rings[k],[b,rb]=rings[k+1],steps=Math.max(2,Math.round((b-a)*100));
  for(let h=0;h<steps;h++){const t=(h+.5)/steps,y=a+(b-a)*t,r=ra+(rb-ra)*t;
   for(let j=0;j<48;j++){const rad=r*Math.sqrt((j+.5)/48),theta=j*2.399963;samples.push({p:[rad*Math.cos(theta),y,rad*Math.sin(theta)],w:r*r*(b-a)/steps});}
  }
 }
 const geometry=new T.BufferGeometry(),positions=new Float32Array(8192*3);
 geometry.setAttribute('position',new T.BufferAttribute(positions,3).setUsage(T.DynamicDrawUsage));
 const mesh=new T.Mesh(geometry,material);mesh.frustumCulled=false;
 let lastTilt=-99,lastFraction=-1,normal=[0,1],weighted=[];
 function update(fraction,tilt){
  fraction=Math.max(0,Math.min(1,fraction));mesh.visible=fraction>.003;
  if(!mesh.visible||Math.abs(fraction-lastFraction)<.001&&Math.abs(tilt-lastTilt)<.003)return;
  if(Math.abs(tilt-lastTilt)>=.003||!weighted.length){normal=[-Math.sin(tilt),Math.cos(tilt)];weighted=samples.map(s=>({h:dot(s.p,normal),w:s.w})).sort((a,b)=>a.h-b.h);}
  lastTilt=tilt;lastFraction=fraction;
  const total=weighted.reduce((v,s)=>v+s.w,0),target=total*fraction;let sum=0,level=weighted.at(-1).h;
  for(const s of weighted){sum+=s.w;if(sum>=target){level=s.h;break;}}
  const clipped=[],edge=[];
  for(const face of faces){const poly=[];for(let j=0;j<face.length;j++){
   const a=face[j],b=face[(j+1)%face.length],da=dot(a,normal)-level,db=dot(b,normal)-level;
   if(da<=0)poly.push(a);
   if((da<0)!==(db<0)){const t=da/(da-db),p=a.map((v,k)=>v+(b[k]-v)*t);poly.push(p);edge.push(p);}
  }if(poly.length>=3)clipped.push(poly);}
  const rim=[];for(const p of edge)if(!rim.some(q=>Math.hypot(...p.map((v,k)=>v-q[k]))<1e-6))rim.push(p);
  if(rim.length>=3){const c=[0,0,0];rim.forEach(p=>p.forEach((v,k)=>c[k]+=v/rim.length));const angle=p=>Math.atan2(p[2]-c[2],(p[0]-c[0])*normal[1]-(p[1]-c[1])*normal[0]);rim.sort((a,b)=>angle(a)-angle(b));clipped.push(rim);}
  let count=0;for(const poly of clipped)for(let j=1;j<poly.length-1;j++)for(const p of [poly[0],poly[j],poly[j+1]]){positions.set(p,count*3);count++;}
  geometry.setDrawRange(0,count);geometry.attributes.position.needsUpdate=true;geometry.computeVertexNormals();
 }
 material.side=T.DoubleSide;
 return {mesh,update};
}

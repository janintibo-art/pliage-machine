(function(root){'use strict';
const G=typeof module!=='undefined'&&module.exports?require('./flat'):root.FlatGeometry;
const EPS=1e-8, TOL=.002, sub=(a,b)=>a.map((v,i)=>v-b[i]), dot=(a,b)=>a.reduce((n,v,i)=>n+v*b[i],0), cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]], lerp=(a,b,t)=>a.map((v,i)=>v+(b[i]-v)*t), xyz=p=>[p[0],p[1],0], len=p=>Math.hypot(...p), signed=(b,p)=>((b.b[0]-b.a[0])*(p[1]-b.a[1])-(b.b[1]-b.a[1])*(p[0]-b.a[0]))/len(sub(b.b,b.a));
const moving=(b,p)=>signed(b,p)*(b.side==='left'?1:-1)>0;
const edges=p=>p.map((a,i)=>[a,p[(i+1)%p.length]]);
function unique(xs){return xs.sort((a,b)=>a-b).filter((x,i,a)=>!i||x-a[i-1]>EPS)}
function rotate(p,a,u,t){const v=sub(p,a),c=Math.cos(t),s=Math.sin(t),k=cross(u,v),d=dot(u,v)*(1-c);return a.map((x,i)=>x+c*v[i]+s*k[i]+d*u[i])}
// Only a single uninterrupted boundary-to-boundary chord can be a hinge in V13.
function checkAxis(m,b,i,holes){const a=b.a,d=b.b,L=len(sub(d,a)),u=sub(d,a).map(x=>x/L),at=t=>lerp(a,d,t/L),ts=[];if(!G.edgePoint(m.contour,a)||!G.edgePoint(m.contour,d))throw Error(`P${i+1} : axe partiel, rabattement non résolu.`);
 for(const [p,q] of edges(m.contour)){const x=signed(b,p),y=signed(b,q);if(Math.abs(x)<TOL)ts.push(dot(sub(p,a),u));if(x*y<0)ts.push(dot(sub(lerp(p,q,x/(x-y)),a),u));}
 const breaks=unique([0,L,...ts]);for(let j=1;j<breaks.length;j++){const x=breaks[j-1],y=breaks[j];if(y-x>TOL&&(x<-TOL||y>L+TOL)&&G.inside(m.contour,at((x+y)/2)))throw Error(`P${i+1} : prolongement traverse une autre zone de matière.`)}
 for(const p of holes){let lo=Infinity,hi=-Infinity;for(const q of p){const x=signed(b,q);lo=Math.min(lo,x);hi=Math.max(hi,x)}if(lo<=TOL&&hi>=-TOL)throw Error(`P${i+1} : axe rencontre une découpe, rabattement non résolu.`)}
 for(let j=0;j<i;j++){const k=m.bends[j],x=signed(b,k.a),y=signed(b,k.b),v=signed(k,a),w=signed(k,d);if(Math.min(x,y)<=TOL&&Math.max(x,y)>=-TOL&&Math.min(v,w)<=TOL&&Math.max(v,w)>=-TOL){const common=[a,d].some(p=>[k.a,k.b].some(q=>len(sub(p,q))<=TOL));const noncollinear=Math.max(Math.abs(x),Math.abs(y))>TOL&&Math.max(Math.abs(v),Math.abs(w))>TOL;if(!common||!noncollinear)throw Error(`P${j+1} / P${i+1} : axes en contact ou en intersection.`);}}
 if(b.kind==='hem')throw Error(`P${i+1} : pli écrasé · prépli ${b.preAngle}° et fermeture enregistrés, simulation non modélisée.`);
 if(b.angle<1)throw Error(`P${i+1} : pli fermé / écrasé non modélisé.`);
}
function prepare(m){const err=G.validate(m);if(err)throw Error(err);const bs=m.bends||[],holes=m.cuts.map(G.cutPoly);bs.forEach((b,i)=>checkAxis(m,b,i,holes));const boundary=[m.contour,...holes].flatMap(edges),segs=[...boundary.map(([a,b])=>({a,b,boundary:true})),...bs.map(b=>({a:b.a,b:b.b,boundary:false}))];const xs=unique(segs.flatMap(s=>[s.a[0],s.b[0]])),groups=new Map();let count=0,area=0;
 function group(p){const sides=bs.map(b=>moving(b,p)),key=sides.map(Number).join('');if(!groups.has(key))groups.set(key,{sides,triangles:[],edges:[]});return groups.get(key)}
 function triangle(a,b,c){const A=((b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]))/2;if(A<=EPS)return;if(++count>65000)throw Error('Maillage trop détaillé pour cet aperçu (65 000 triangles).');area+=A;const mid=a.map((x,i)=>(x+b[i]+c[i])/3);group(mid).triangles.push([a,b,c].map(xyz));}
 const yAt=(s,x)=>s.a[1]+(s.b[1]-s.a[1])*(x-s.a[0])/(s.b[0]-s.a[0]);
 for(let i=1;i<xs.length;i++){const l=xs[i-1],r=xs[i],mid=(l+r)/2;if(r-l<=EPS)continue;const hits=segs.filter(s=>mid>Math.min(s.a[0],s.b[0])&&mid<Math.max(s.a[0],s.b[0])).map(s=>({s,y:yAt(s,mid)})).sort((a,b)=>a.y-b.y);let inside=false;for(let j=0;j<hits.length-1;j++){const a=hits[j],b=hits[j+1];if(a.s.boundary)inside=!inside;if(!inside||b.y-a.y<EPS)continue;const p=[l,yAt(a.s,l)],q=[r,yAt(a.s,r)],v=[r,yAt(b.s,r)],w=[l,yAt(b.s,l)];triangle(p,q,v);triangle(p,v,w)}}
 const expected=Math.abs(G.area(m.contour))-holes.reduce((n,p)=>n+Math.abs(G.area(p)),0);if(!count||Math.abs(area-expected)>Math.max(.001,expected*1e-7))throw Error('Maillage incomplet : aperçu refusé.');
 // Split outline where an axis meets the boundary, so it follows the appropriate face.
 for(const [a,b] of boundary){const ts=[0,1];for(const k of bs){const x=signed(k,a),y=signed(k,b);if(x*y<0)ts.push(x/(x-y))}const t=unique(ts);for(let j=1;j<t.length;j++){const p=lerp(a,b,t[j-1]),q=lerp(a,b,t[j]);group(lerp(p,q,.5)).edges.push([xyz(p),xyz(q)])}}
 return {bends:bs.map(b=>G.copy(b)),groups:[...groups.values()],area,count};
}
function pose(model,progress=model.bends.length){const bs=model.bends,p=Math.max(0,Math.min(bs.length,Number(progress)||0)),ops=[];
 const transform=(q,sides)=>{for(const o of ops)if(sides[o.i])q=rotate(q,o.a,o.u,o.t);return q};
 for(let i=0;i<Math.ceil(p);i++){const b=bs[i],mid=lerp(b.a,b.b,.5),sides=bs.map(k=>moving(k,mid)),a=transform(xyz(b.a),sides),d=transform(xyz(b.b),sides),v=sub(d,a),u=v.map(x=>x/len(v));ops.push({i,a,u,t:b.sign*(180-b.angle)*Math.PI/180*Math.min(1,p-i)})}
 return {faces:model.groups.map((g,i)=>({id:i,triangles:g.triangles.map(t=>t.map(q=>transform(q,g.sides))),edges:g.edges.map(t=>t.map(q=>transform(q,g.sides)))})),axes:bs.map((b,i)=>{const sides=bs.map(k=>moving(k,lerp(b.a,b.b,.5)));sides[i]=false;return [transform(xyz(b.a),sides),transform(xyz(b.b),sides)]}),progress:p};
}
// Orthographic software depth buffer. Coordinates are already projected in pixels.
function raster(faces,w,h,rgba){const depth=new Float32Array(w*h);depth.fill(-Infinity);for(const f of faces){const [a,b,c]=f.p,det=(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);if(Math.abs(det)<1e-8)continue;const x0=Math.max(0,Math.floor(Math.min(a[0],b[0],c[0]))),x1=Math.min(w-1,Math.ceil(Math.max(a[0],b[0],c[0]))),y0=Math.max(0,Math.floor(Math.min(a[1],b[1],c[1]))),y1=Math.min(h-1,Math.ceil(Math.max(a[1],b[1],c[1])));const rgb=[1,3,5].map(i=>parseInt(f.col.slice(i,i+2),16));for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){const px=x+.5-a[0],py=y+.5-a[1],u=(px*(c[1]-a[1])-py*(c[0]-a[0]))/det,v=((b[0]-a[0])*py-(b[1]-a[1])*px)/det;if(u< -1e-7||v< -1e-7||u+v>1+1e-7)continue;const z=a[2]+u*(b[2]-a[2])+v*(c[2]-a[2]),k=y*w+x;if(z<depth[k])continue;depth[k]=z;rgba[k*4]=rgb[0];rgba[k*4+1]=rgb[1];rgba[k*4+2]=rgb[2];rgba[k*4+3]=255}}return rgba}
const api={prepare,pose,rotate,raster};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.SheetFold3D=api;
})(typeof window!=='undefined'?window:globalThis);

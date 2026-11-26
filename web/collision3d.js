(function(root){'use strict';
// Solid intersections between convex triangular prisms. Units mm. No safety validation.
const TOL=.02, sub=(a,b)=>a.map((x,i)=>x-b[i]), add=(a,b)=>a.map((x,i)=>x+b[i]), mul=(a,k)=>a.map(x=>x*k), dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0), cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]], unit=a=>{const l=Math.hypot(...a);return l>1e-10?mul(a,1/l):null};
function bounds(v){return [0,1,2].map(i=>[Math.min(...v.map(q=>q[i])),Math.max(...v.map(q=>q[i]))]);}
function overlap(a,b,t=TOL){return a.every((r,i)=>Math.min(r[1],b[i][1])-Math.max(r[0],b[i][0])>t);}
function prism(tr,delta){const n=unit(cross(sub(tr[1],tr[0]),sub(tr[2],tr[0])));if(!n||Math.abs(dot(n,delta))<1e-9)return null;const edges=[sub(tr[1],tr[0]),sub(tr[2],tr[1]),sub(tr[0],tr[2]),delta].map(unit).filter(Boolean),axes=[n,...edges.slice(0,3).map(e=>unit(cross(e,delta))).filter(Boolean)],v=[...tr,...tr.map(q=>add(q,delta))];return {v,axes,edges,box:bounds(v)};}
function sheetPrism(tr,t){const n=unit(cross(sub(tr[1],tr[0]),sub(tr[2],tr[0])));return n?prism(tr.map(q=>add(q,mul(n,-t/2))),mul(n,t)):null;}
function span(v,n){let lo=Infinity,hi=-Infinity;for(const q of v){const d=dot(q,n);lo=Math.min(lo,d);hi=Math.max(hi,d)}return [lo,hi]}
function intersects(a,b,t=TOL){if(!overlap(a.box,b.box,t))return false;function sep(n){if(!n)return false;const x=span(a.v,n),y=span(b.v,n);return Math.min(x[1],y[1])-Math.max(x[0],y[0])<=t;}
for(const n of [...a.axes,...b.axes])if(sep(n))return false;for(const e of a.edges)for(const f of b.edges)if(sep(unit(cross(e,f))))return false;return true;}
function union(items){return [0,1,2].map(i=>[items.reduce((n,p)=>Math.min(n,p.box[i][0]),Infinity),items.reduce((n,p)=>Math.max(n,p.box[i][1]),-Infinity)]);}
function check(frame,t,opts={}){
 const result={hits:[],faceIds:[],objectNames:[],complete:true,checks:0,tolerance:TOL};const max=opts.maxChecks??350000,maxTriangles=opts.maxTriangles??12000;
 const count=frame.faces.reduce((n,f)=>n+f.triangles.length,0);if(!Number.isFinite(t)||t<=0||count>maxTriangles){result.complete=false;result.reason='Maillage trop dense ou épaisseur invalide : contrôle incomplet.';return result;}
 const sheets=frame.faces.map(f=>{const p=f.triangles.map(tr=>sheetPrism(tr,t)).filter(Boolean);return {id:f.id,p,box:union(p)}}),tools=frame.objects.map(o=>{const p=(o.prisms||[]).map(v=>prism(v.tr,v.delta)).filter(Boolean);if(!p.length){result.complete=false;result.reason='Un solide machine ne peut pas être contrôlé.'}return {name:o.name,p,box:union(p)}});
 function pair(a,b){if(!overlap(a.box,b.box))return false;for(const x of a.p)for(const y of b.p){if(++result.checks>max){result.complete=false;result.reason='Limite de comparaisons atteinte : contrôle incomplet.';return null}if(intersects(x,y))return true;}return false;}
 function hit(a,b){result.hits.push(b.name?{kind:'machine',face:a.id,object:b.name}:{kind:'self',face:a.id,other:b.id});}
 outer:for(let i=0;i<sheets.length;i++){const a=sheets[i];for(const b of tools){const h=pair(a,b);if(h===null)break outer;if(h)hit(a,b)}for(let j=i+1;j<sheets.length;j++){const b=sheets[j],h=pair(a,b);if(h===null)break outer;if(h)hit(a,b)}}
 result.faceIds=[...new Set(result.hits.flatMap(h=>h.kind==='self'?[h.face,h.other]:[h.face]))];result.objectNames=[...new Set(result.hits.filter(h=>h.kind==='machine').map(h=>h.object))];return result;
}
const api={prism,sheetPrism,intersects,check,TOL};if(typeof module==='object')module.exports=api;else root.SheetCollision3D=api;
})(typeof window!=='undefined'?window:globalThis);

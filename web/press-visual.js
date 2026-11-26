(function(root){'use strict';
// Visual-only fittings. Never passed to SheetCollision3D or the sequence search.
const M=typeof module==='object'?require('./webgl'):root.PressGL;
const rect=(a,b,c,d)=>[[a,b],[c,b],[c,d],[a,d]];
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const norm=v=>{const l=Math.hypot(...v)||1;return v.map(x=>x/l)};
const dot=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0);
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const palette={'Poinçon':'#b3a381','Matrice':'#a8aeb1','Tablier':'#c1cbd3','Table':'#8295a3','Serrage':'#a2adb6','Montant arrière':'#a8b5bf','Butée indicative':'#a78fc4'};
function details(f,m,full){const out=[],L=f.span,ph=Math.max(...m.punch.poly.map(q=>q[1])),dh=-Math.min(...m.die.poly.map(q=>q[1])),top=f.tip+ph,bt=m.beamWidth/2,bb=m.bedWidth/2;
 function extrude(name,poly,len,x,col,link=null){if(len<=.01)return;const mesh=M.mesh(poly,len,x,col,'steel');if(mesh)out.push({name,col,link,triangles:mesh.triangles.map(t=>t.v.map(q=>[q[2],q[0],q[1]]))});}
 function box(name,x,len,y1,y2,z1,z2,col,link=null){if(y2>y1&&z2>z1)extrude(name,rect(y1,z1,y2,z2),len,x,col,link)}
 function bolt(x,y,z,r,link){const tris=[],n=12;for(let j=0;j<n;j++){const a=j*2*Math.PI/n,b=(j+1)*2*Math.PI/n,p=[x+r*Math.cos(a),y,z+r*Math.sin(a)],q=[x+r*Math.cos(b),y,z+r*Math.sin(b)],p2=[p[0],y+3,p[2]],q2=[q[0],y+3,q[2]];tris.push([[x,y,z],q,p],[p,q,q2],[p,q2,p2],[[x,y+3,z],p2,q2]);}out.push({name:'Vis de serrage',link,col:'#dce3e8',triangles:tris});}
 // Fascias and rails follow the moving tablier, and never change nominal tool dimensions.
 box('Façade tablier',0,L,-bt-2,-bt-.5,top+35,top+96,'#d4dce1','Tablier');
 box('Rail de serrage',0,L,-bt-9,-bt-7,top+7,top+28,'#536879','Serrage');
 box('Liseré supérieur',0,L,-bt-3,-bt-2,top+88,top+94,'#34566e','Tablier');
 box('Rail inférieur',0,L,-bb-3,-bb-.5,-dh-19,-dh-5,'#c4d0d9','Table');
 box('Façade table',0,L,-bb-3,-bb-.5,-dh-85,-dh-24,'#375970','Table');
 const n=Math.min(30,Math.max(1,Math.ceil(L/100))),pitch=L/n;
 for(let j=0;j<n;j++){const x=-L/2+(j+.5)*pitch,r=Math.min(5,pitch*.12),len=Math.max(.1,pitch-8);box('Plaque de bride',x,len,-bt-11,-bt-9,top+9,top+27,'#aebbc5','Serrage');for(const dx of [-pitch*.27,pitch*.27])bolt(x+dx,-bt-14,top+18,r,'Serrage');box('Rainure table',x,Math.max(.1,pitch-6),-bb-4,-bb-3,-dh-18,-dh-16,'#273d4c','Table');}
 if(full){const base=-dh-90,roof=m.opening+ph+100,side=Math.max(15,Math.min(95,L*.08)),reach=m.throat,back=reach+85,topFixed=roof+Math.max(120,Math.min(300,L*.09)),floor=base-Math.max(130,Math.min(320,L*.10));
 // Outer casing is outside the modelled work zone; no overlapping coplanar panels.
 box('Socle carrossé',0,L+2*side,-bb-22,back,floor,base-2,'#385b73');box('Bande de socle',0,L+2*side,-bb-24,-bb-22,floor+14,floor+38,'#182f40');
 box('Traverse haute fixe',0,L+2*side,-bt-13,back,roof+5,topFixed,'#d0d9df');box('Bandeau supérieur',0,L+2*side,-bt-15,-bt-13,topFixed-62,topFixed-35,'#375d77');
 for(const x of [-L/2-side/2,L/2+side/2]){const profile=[[-bb,base-2],[back,base-2],[back,roof+5],[-bt-12,roof+5],[-bt-12,roof-12],[reach,roof-12],[reach,base+18],[-bb,base+18]];extrude('Carénage latéral',profile,side*.96,x,'#b6c4cf');}
 const cx=L/2+side*.5,arm=Math.min(110,L*.12);box('Support pupitre',cx,Math.min(side*.7,55),-bt-90,-bt-14,roof+20,roof+38,'#425663');box('Pupitre',cx,Math.min(arm,side),-bt-110,-bt-88,roof-12,roof+104,'#354957');box('Écran pupitre',cx,Math.min(arm,side)*.8,-bt-112,-bt-110,roof+24,roof+93,'#162d3c');box('Touche pupitre',cx,Math.min(arm,side)*.6,-bt-113,-bt-112,roof+2,roof+12,'#64a6ab');

 }
 return out;
}
// The display skin follows the exact triangulated face, including the holes.
function skin(face,t){const triangles=face.triangles;if(!triangles.length||!(t>0))return triangles;const tr=triangles.find(q=>Math.hypot(...cross(q[1].map((v,i)=>v-q[0][i]),q[2].map((v,i)=>v-q[0][i])))>1e-9);if(!tr)return triangles;const n=norm(cross(tr[1].map((v,i)=>v-tr[0][i]),tr[2].map((v,i)=>v-tr[0][i]))),shift=(q,k)=>q.map((v,i)=>v+n[i]*t*.5*k),key=q=>q.map(v=>Math.round(v*1e6)).join(','),edges=new Map(),out=[];for(const q of triangles){out.push(q.map(v=>shift(v,1)),[...q].reverse().map(v=>shift(v,-1)));for(let j=0;j<3;j++){const a=q[j],b=q[(j+1)%3],id=[key(a),key(b)].sort().join('|'),old=edges.get(id);if(old)old.count++;else edges.set(id,{a,b,count:1})}}for(const {a,b,count} of edges.values())if(count===1){const a1=shift(a,1),a2=shift(a,-1),b1=shift(b,1),b2=shift(b,-1);out.push([a1,a2,b2],[a1,b2,b1])}return out;}
function tone(hex,triangle,yaw,pitch,metal=true,alert=false){const u=triangle[1].map((x,i)=>x-triangle[0][i]),v=triangle[2].map((x,i)=>x-triangle[0][i]),n=norm(cross(u,v));const view=[Math.sin(yaw)*Math.cos(pitch),-Math.cos(yaw)*Math.cos(pitch),Math.sin(pitch)];if(dot(n,view)<0)for(let i=0;i<3;i++)n[i]*=-1;const l=norm([-.35,-.65,.8]),fill=norm([.6,.25,.7]),h=norm(l.map((x,i)=>x+view[i]));const diffuse=Math.max(0,dot(n,l)),bounce=Math.max(0,dot(n,fill)),spec=Math.pow(Math.max(0,dot(n,h)),metal?18:8);const gain=.49+.53*diffuse+.24*bounce,glint=alert?0:spec*(metal?52:18);return '#'+[1,3,5].map(i=>clamp(Math.round(parseInt(hex.slice(i,i+2),16)*gain+glint),0,255).toString(16).padStart(2,'0')).join('');}
const api={details,tone,palette,skin};if(typeof module==='object')module.exports=api;else root.PressVisual=api;
})(typeof window!=='undefined'?window:globalThis);

(function(root){'use strict';
const G=typeof module==='object'&&module.exports?require('./flat'):root.FlatGeometry;
const FORMAT='pliage-machine.exchange', VERSION=1, MAX=3000000;
const fail=m=>{throw Error(m)}, obj=x=>x!==null&&typeof x==='object'&&!Array.isArray(x), bounded=(x,a,b)=>typeof x==='number'&&Number.isFinite(x)&&x>=a&&x<=b;
const pick=(x,keys)=>Object.fromEntries(keys.map(k=>[k,x[k]]));
function profile(p){if(!obj(p)||!Array.isArray(p.lengths)||p.lengths.length<2||p.lengths.length>31||!p.lengths.every(x=>bounded(x,.1,10000)))fail('Longueurs de profil invalides.');const n=p.lengths.length-1;
if(!Array.isArray(p.turns)||p.turns.length!==n||!p.turns.every(x=>bounded(x,-170,170)))fail('Angles de profil invalides.');
if(!Array.isArray(p.order)||p.order.length!==n||new Set(p.order).size!==n||!p.order.every(x=>Number.isInteger(x)&&x>=0&&x<n))fail('Ordre de pliage invalide.');
if(!Array.isArray(p.flips)||p.flips.length!==n||!p.flips.every(x=>typeof x==='boolean'))fail('Orientations invalides.');
if(!bounded(p.t,.1,50)||!bounded(p.width,1,10000)||!['Acier','Inox','Aluminium','Autre'].includes(p.material))fail('Épaisseur, longueur de pli ou matière invalide.');
return pick(p,['lengths','turns','order','flips','t','width','material']);}
function flat(p){if(!obj(p))fail('Tôle absente.');const err=G.validate(p);if(err)fail(err);return {name:p.name,thickness:p.thickness,contour:p.contour,cuts:p.cuts.map(c=>pick(c,c.kind==='poly'?['kind','points']:c.kind==='circle'?['kind','x','y','d']:['kind','x','y','w','h','r'])),bends:(p.bends||[]).map(b=>pick(b,b.kind==='hem'?['a','b','angle','sign','side','kind','preAngle']:['a','b','angle','sign','side']))};}
function normalize(x){if(!obj(x)||x.format!==FORMAT||x.version!==VERSION)fail('Format d’échange ou version non pris en charge.');if(x.units!=='mm-deg')fail('Unités attendues : mm-deg.');if(!['profile','flat'].includes(x.kind))fail('Type de pièce inconnu.');const piece=x.kind==='profile'?profile(x.piece):flat(x.piece);return JSON.parse(JSON.stringify({format:FORMAT,version:VERSION,units:'mm-deg',kind:x.kind,piece}));}
function fromProject(s,kind){return normalize({format:FORMAT,version:VERSION,units:'mm-deg',kind,piece:kind==='flat'?s.flat:s});}
function parse(raw){if(typeof raw!=='string'||raw.length>MAX)fail('Fichier trop volumineux.');return normalize(JSON.parse(raw));}
function merge(s,packet){const x=normalize(packet);return x.kind==='flat'?{...s,flat:x.piece}:{...s,...x.piece};}
function summary(packet){const x=normalize(packet),p=x.piece;if(x.kind==='profile')return `Profil simple · ${p.lengths.length} côtés · ${p.turns.length} plis · ép. ${p.t} mm · longueur de pli ${p.width} mm · ${p.material}`;return `${p.name} · ${p.contour.length} sommets · ${p.cuts.length} découpes · ${p.bends.length} plis · ép. ${p.thickness} mm`;}
const api={fromProject,parse,merge,summary,normalize};if(typeof module==='object'&&module.exports)module.exports=api;else root.PieceExchange=api;
})(typeof window==='undefined'?globalThis:window);

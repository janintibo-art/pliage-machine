(function(root){'use strict';
const dist=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]), rot=(p,a)=>[p[0]*Math.cos(a)-p[1]*Math.sin(a),p[0]*Math.sin(a)+p[1]*Math.cos(a)];
function fit(width,height,box){const [x0,y0,x1,y1]=box,scale=Math.min(Math.max(1,x1-x0)/width,Math.max(1,y1-y0)/height);return {width,height,scale,angle:0,origin:[(x0+x1-width*scale)/2,(y0+y1+height*scale)/2]}}
function world(p,xy){const q=rot([xy[0]*p.scale,-xy[1]*p.scale],p.angle);return [p.origin[0]+q[0],p.origin[1]+q[1]]}
function pixels(p,xy){const q=rot([xy[0]-p.origin[0],xy[1]-p.origin[1]],-p.angle);return [q[0]/p.scale,-q[1]/p.scale]}
function bounds(p){const a=[[0,0],[p.width,0],[p.width,p.height],[0,p.height]].map(q=>world(p,q));return [Math.min(...a.map(q=>q[0])),Math.min(...a.map(q=>q[1])),Math.max(...a.map(q=>q[0])),Math.max(...a.map(q=>q[1]))]}
function calibrate(p,a,b,length,angle=null){const d=dist(a,b);if(!Number.isFinite(length)||length<.1||length>10000||d<1e-6)throw Error('Deux points distincts et une cote de 0,1 à 10 000 mm sont nécessaires.');if(angle!==null&&!Number.isFinite(angle))throw Error('Angle cible invalide.');const factor=length/d,delta=angle===null?0:angle*Math.PI/180-Math.atan2(b[1]-a[1],b[0]-a[0]),q=rot([(p.origin[0]-a[0])*factor,(p.origin[1]-a[1])*factor],delta),next={...p,scale:p.scale*factor,angle:p.angle+delta,origin:[a[0]+q[0],a[1]+q[1]]};if(!bounds(next).every(v=>Number.isFinite(v)&&Math.abs(v)<100000))throw Error('Échelle trop grande : choisir une cote plus longue sur la photo.');return next}
const api={fit,world,pixels,bounds,calibrate};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.PlanPhoto=api;
})(typeof window!=='undefined'?window:globalThis);

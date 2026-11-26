'use strict';
// Independent renderer: visual meshes only, never used for collision decisions.
(function(root){
const cross=(a,b,c)=>(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);
function triangulate(input){
 let p=input.map(q=>q.slice());
 const extent=Math.max(1,...p.flat().map(Math.abs)), eps=1e-10*extent*extent;
 // Remove duplicate and collinear intermediate vertices (caps only).
 let change=true;while(change&&p.length>3){change=false;for(let i=0;i<p.length;i++){const a=p[(i+p.length-1)%p.length],b=p[i],c=p[(i+1)%p.length];if(Math.hypot(a[0]-b[0],a[1]-b[1])<1e-8||Math.abs(cross(a,b,c))<=eps){p.splice(i,1);change=true;break}}}
 let area=0;for(let i=0;i<p.length;i++){let a=p[i],b=p[(i+1)%p.length];area+=a[0]*b[1]-a[1]*b[0]}
 if(Math.abs(area)<=eps||p.length<3)return null;if(area<0)p.reverse();
 const ix=p.map((_,i)=>i),out=[];while(ix.length>3){let found=false;for(let j=0;j<ix.length;j++){const a=p[ix[(j+ix.length-1)%ix.length]],b=p[ix[j]],c=p[ix[(j+1)%ix.length]];if(cross(a,b,c)<=eps)continue;let inside=false;for(const k of ix){const q=p[k];if(q===a||q===b||q===c)continue;if(cross(a,b,q)>=-eps&&cross(b,c,q)>=-eps&&cross(c,a,q)>=-eps){inside=true;break}}if(inside)continue;out.push([a,b,c]);ix.splice(j,1);found=true;break}if(!found)return null}out.push(ix.map(i=>p[i]));return out;
}
function mesh(poly,len,center,color,finish){
 const cap=triangulate(poly);if(!cap)return null;let area=0;for(let i=0;i<poly.length;i++){const q=poly[i],r=poly[(i+1)%poly.length];area+=q[0]*r[1]-q[1]*r[0]}if(area<0)poly=[...poly].reverse();
 const lo=center-len/2,hi=center+len/2,triangles=[];
 const v=(q,z)=>[q[0],q[1],z];
 for(const t of cap){triangles.push({v:t.map(q=>v(q,hi)),n:[0,0,1]},{v:[...t].reverse().map(q=>v(q,lo)),n:[0,0,-1]})}
 for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length],dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy);if(l<1e-8)continue;const n=[dy/l,-dx/l,0],q=v(a,lo),r=v(b,lo),s=v(b,hi),t=v(a,hi);triangles.push({v:[q,r,s],n},{v:[q,s,t],n})}
 return {triangles,color,finish};
}
function create(canvas){
 let gl;try{gl=canvas.getContext('webgl',{alpha:false,antialias:true,depth:true,preserveDrawingBuffer:false});if(!gl||typeof gl.createShader!=='function'||!gl.getParameter(gl.VERSION))return null;}catch(e){return null}
 const vs='precision mediump float;attribute vec3 aPosition;attribute vec3 aNormal;attribute vec3 aColor;attribute float aMetal;varying vec3 vNormal;varying vec3 vColor;varying float vMetal;uniform vec3 uView;void main(){gl_Position=vec4(aPosition,1.0);vNormal=aNormal;vColor=aColor;vMetal=aMetal;}';
 const fs='precision mediump float;varying vec3 vNormal;varying vec3 vColor;varying float vMetal;uniform vec3 uView;void main(){vec3 n=normalize(vNormal);vec3 l=normalize(vec3(-0.65,0.85,0.5));vec3 l2=normalize(vec3(0.7,0.35,-0.8));float diffuse=max(0.0,dot(n,l));float fill=max(0.0,dot(n,l2));vec3 h=normalize(l+uView);float spec=pow(max(0.0,dot(n,h)),mix(18.0,55.0,vMetal));vec3 base=vColor*(0.47+0.55*diffuse+0.22*fill);base+=vec3(0.9,0.95,1.0)*spec*mix(0.12,0.45,vMetal);gl_FragColor=vec4(clamp(base,0.0,1.0),1.0);}';
 function shader(type,src){const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s}
 let program,buffer,locs,view;try{program=gl.createProgram();const a=shader(gl.VERTEX_SHADER,vs),b=shader(gl.FRAGMENT_SHADER,fs);gl.attachShader(program,a);gl.attachShader(program,b);gl.linkProgram(program);gl.deleteShader(a);gl.deleteShader(b);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program));buffer=gl.createBuffer();locs=['aPosition','aNormal','aColor','aMetal'].map(k=>gl.getAttribLocation(program,k));view=gl.getUniformLocation(program,'uView');}catch(e){console.warn('WebGL indisponible',e);return null}
 let lost=false;canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();lost=true;});canvas.addEventListener('webglcontextrestored',()=>{lost=true;});
 return {draw(meshes,project,depth,w,h,yaw,pitch){if(lost||gl.isContextLost()||!meshes.length||meshes.some(m=>!m))return false;
 const dpr=Math.min(root.devicePixelRatio||1,2),ww=Math.max(1,Math.round(w*dpr)),hh=Math.max(1,Math.round(h*dpr));if(canvas.width!==ww)canvas.width=ww;if(canvas.height!==hh)canvas.height=hh;
 let lo=Infinity,hi=-Infinity;for(const m of meshes)for(const t of m.triangles)for(const q of t.v){const z=depth([q[0],q[1]],q[2]);lo=Math.min(lo,z);hi=Math.max(hi,z)}
 const dz=Math.max(1,hi-lo),data=[];for(const m of meshes){const rgb=[1,3,5].map(i=>parseInt(m.color.slice(i,i+2),16)/255);for(const t of m.triangles)for(const q of t.v){const p=project([q[0],q[1]],q[2]),z=depth([q[0],q[1]],q[2]);data.push(2*p[0]/w-1,1-2*p[1]/h,.95-1.9*(z-lo)/dz,...t.n,...rgb,m.finish==='steel'?1:0)}}
 gl.viewport(0,0,ww,hh);gl.clearColor(.065,.102,.135,1);gl.clearDepth(1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);gl.disable(gl.CULL_FACE);gl.useProgram(program);gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(data),gl.DYNAMIC_DRAW);let offset=0;for(let i=0;i<4;i++){const n=i===3?1:3;gl.enableVertexAttribArray(locs[i]);gl.vertexAttribPointer(locs[i],n,gl.FLOAT,false,40,offset*4);offset+=n}gl.uniform3f(view,-Math.sin(yaw)*Math.cos(pitch),Math.sin(pitch),Math.cos(yaw)*Math.cos(pitch));gl.drawArrays(gl.TRIANGLES,0,data.length/10);return gl.getError()===gl.NO_ERROR;
 }};
}
const api={triangulate,mesh,create};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.PressGL=api;
})(typeof window!=='undefined'?window:globalThis);

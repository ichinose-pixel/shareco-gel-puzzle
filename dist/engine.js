(function(root){'use strict';
const levels=[{rows:['.....','.#...','...#.','.....'],name:'ひと筆で、すべての白いマスをピンクに。'}];
const vectors={right:[1,0],down:[0,1],left:[-1,0],up:[0,-1]};
function create(i=0){const cells=[];levels[i].rows.forEach((r,y)=>[...r].forEach((c,x)=>{if(c==='.')cells.push([x,y])}));return {level:i,cells,pos:0,path:[0],mask:1,moves:0};}
function step(s,index){if(index===s.pos)return {state:s,kind:'same'};const a=s.cells[s.pos],b=s.cells[index];if(!b||Math.abs(a[0]-b[0])+Math.abs(a[1]-b[1])!==1)return {state:s,kind:'blocked'};const previous=s.path[s.path.length-2];if(index===previous){const path=s.path.slice(0,-1);return {state:{...s,pos:index,path,mask:s.mask&~(1<<s.pos),moves:s.moves+1},kind:'undo'}}if(s.mask&(1<<index))return {state:s,kind:'visited'};return {state:{...s,pos:index,path:[...s.path,index],mask:s.mask|(1<<index),moves:s.moves+1},kind:'paint'};}
function move(s,dir){const v=vectors[dir];if(!v)throw Error('Invalid direction');const a=s.cells[s.pos];return step(s,s.cells.findIndex(c=>c[0]===a[0]+v[0]&&c[1]===a[1]+v[1]));}
function complete(s){return s.path.length===s.cells.length}
function solve(s){const full=(1<<s.cells.length)-1,dead=new Set(),adj=s.cells.map(a=>s.cells.map((b,i)=>Math.abs(a[0]-b[0])+Math.abs(a[1]-b[1])===1?i:-1).filter(i=>i>=0));
 function visit(pos,mask){if(mask===full)return [];const key=pos+':'+mask;if(dead.has(key))return null;for(const n of adj[pos]){if(mask&(1<<n))continue;const rest=visit(n,mask|(1<<n));if(rest)return [n,...rest]}dead.add(key);return null}return visit(s.pos,s.mask);}
function hint(s){let t=s;for(let rewind=0;rewind<s.path.length;rewind++){const route=solve(t);if(route)return {rewind,index:rewind?s.path[s.path.length-2]:route[0],route};t=step(t,t.path[t.path.length-2]).state}return null;}
const api={levels,vectors,create,step,move,complete,solve,hint};if(typeof module!=='undefined')module.exports=api;root.GelEngine=api;
})(typeof window!=='undefined'?window:globalThis);

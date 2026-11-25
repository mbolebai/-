// maps time in the short video -> time in the original timeline
const fs=require('fs');const path=require('path');
const C=JSON.parse(fs.readFileSync(path.join(__dirname,'cuts.json')));
const KEEP=JSON.parse(fs.readFileSync(path.join(__dirname,'keep.json')));
const KEPT=KEEP.reduce((s,[a,b])=>s+b-a,0);
function toOrig(T){let k=T*C.speed;if(k>=KEPT)return C.end+(k-KEPT);for(const [a,b] of KEEP){if(k<=b-a)return a+k;k-=b-a}return C.end}
function toNew(o){let k=0;for(const [a,b] of KEEP){if(o<a)return k/C.speed;if(o<=b)return (k+o-a)/C.speed;k+=b-a}return k/C.speed+(o-C.end)/C.speed}
module.exports={C,KEEP,KEPT,toOrig,toNew,DURATION:KEPT/C.speed+C.tail};

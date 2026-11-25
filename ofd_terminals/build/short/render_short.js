const {chromium}=require('playwright');const {spawn}=require('child_process');const m=require('./timemap.js');
(async()=>{
 const FPS=30,N=Math.round(m.DURATION*FPS);
 const out=__dirname+'/video_short_noaudio.mp4';
 const ff=spawn('ffmpeg',['-y','-v','error','-f','image2pipe','-framerate',String(FPS),'-c:v','mjpeg','-i','-','-c:v','libx264','-preset','medium','-crf','18','-pix_fmt','yuv420p',out],{stdio:['pipe','inherit','inherit']});
 const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
 await p.goto('file://'+__dirname+'/../reel.html');
 await p.evaluate(drop=>{for(let i=CUES.length-1;i>=0;i--) if(drop.some(d=>Math.abs(d-CUES[i][0])<.05)) CUES.splice(i,1);},m.C.drop_cues_starting);
 // header progress bar should follow the short duration
 await p.evaluate(d=>{window.__dur=d},m.DURATION);
 const t0=Date.now();
 for(let i=0;i<N;i++){
  const T=i/FPS;
  await p.evaluate(([o,T,d])=>{render(o);const bar=[...document.querySelectorAll('rect')].find(r=>r.getAttribute('y')==='292');if(bar)bar.setAttribute('width',(1080*T/d).toFixed(1));},[m.toOrig(T),T,m.DURATION]);
  const buf=await p.screenshot({type:'jpeg',quality:93});
  if(!ff.stdin.write(buf)) await new Promise(r=>ff.stdin.once('drain',r));
  if(i%300==0) console.log(i,'/',N,((Date.now()-t0)/1000).toFixed(0)+'s');
 }
 ff.stdin.end();await new Promise(r=>ff.on('close',r));await b.close();console.log('done');
})();

/* Portfolio cursor: smoothly-drawn wavy tail + negative-color hover reactions. */
(()=>{
  if(!matchMedia('(hover:hover) and (pointer:fine) and (min-width:901px) and (prefers-reduced-motion:no-preference)').matches) return;
  const svg=document.getElementById('wavy-cursor');
  if(!svg)return;
  const path=svg.querySelector('.ink-path');
  const head=svg.querySelector('.ink-head');
  const ring=svg.querySelector('.head-ring');
  const text=svg.querySelector('.hover-action');
  const mouse={x:innerWidth/2,y:innerHeight/2};
  const points=Array.from({length:12},()=>({...mouse}));
  let active=false,hoverTarget=null,hoverType='',radius=10,phase=0,clickTime=0,raf=0;
  const interactive='a,button,summary,video,[role="button"],.project,.tile,.card-hit,.featured-card,.work-card,.idea-card,.frame a,.detail-poster a';
  const closest=(node)=>node?.closest?.(interactive)||null;
  function labelFor(target){
    if(!target)return '';
    if(target.matches('video, [data-cursor="PLAY"]')||target.closest('video')||target.closest('[data-kind="video"]')||target.closest('[data-kind="video-download"]'))return 'PLAY ↗';
    if(target.closest('.project,.tile,.featured-card,.work-card,.frame')||target.matches('.project,.tile,.featured-card,.work-card'))return 'VIEW ↗';
    if(target.closest('.idea,.card-hit')||target.matches('.card-hit'))return 'OPEN ↗';
    if(target.matches('summary'))return 'OPEN ↗';
    if(target.closest('nav,header'))return 'GO ↗';
    if(target.matches('button,[role="button"]'))return 'TRY ↗';
    return 'GO ↗';
  }
  function setHover(target){
    if(target===hoverTarget)return;
    hoverTarget=target;
    hoverType=labelFor(target);
    text.textContent=hoverType;
    svg.classList.toggle('is-hovering',!!target);
  }
  function move(e){
    mouse.x=e.clientX;mouse.y=e.clientY;
    if(!active){for(const p of points){p.x=mouse.x;p.y=mouse.y;} active=true;svg.classList.add('is-visible');}
    setHover(closest(e.target));
  }
  document.addEventListener('pointermove',e=>{if(e.pointerType==='mouse')move(e);},{passive:true});
  // Deliberately do not add a solid cursor background: difference blending must work on images and text.
  document.addEventListener('pointerover',e=>{if(e.pointerType==='mouse')setHover(closest(e.target));},{passive:true});
  document.addEventListener('pointerout',e=>{if(e.pointerType==='mouse'&&!e.relatedTarget)setHover(null);},{passive:true});
  document.addEventListener('mouseleave',()=>{active=false;setHover(null);svg.classList.remove('is-visible');});
  window.addEventListener('blur',()=>{active=false;setHover(null);svg.classList.remove('is-visible');});
  document.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse')return;clickTime=performance.now();svg.classList.add('is-clicking');},{passive:true});
  document.addEventListener('pointerup',e=>{if(e.pointerType==='mouse')svg.classList.remove('is-clicking');},{passive:true});
  // The fixed SVG must always match the viewport so the head never drifts after zoom or resize.
  function draw(now){
    if(active){
      const headPoint=points[0];
      headPoint.x+=(mouse.x-headPoint.x)*.53;
      headPoint.y+=(mouse.y-headPoint.y)*.53;
      for(let i=1;i<points.length;i++){
        const p=points[i],prev=points[i-1],ease=.38-i*.011;
        p.x+=(prev.x-p.x)*ease;p.y+=(prev.y-p.y)*ease;
      }
      const dx=mouse.x-points[points.length-1].x,dy=mouse.y-points[points.length-1].y;
      const speed=Math.min(1,Math.hypot(dx,dy)/130);
      const wobble=hoverType.startsWith('VIEW')?3.3:hoverType?2.1:1.2;
      phase+=.075;
      const ux=dx/(Math.hypot(dx,dy)||1),uy=dy/(Math.hypot(dx,dy)||1);
      const coords=points.map((p,i)=>{
        const ripple=i===0?0:Math.sin(phase-i*.85)*wobble*speed*Math.sin(Math.PI*i/(points.length-1));
        return {x:p.x-uy*ripple,y:p.y+ux*ripple};
      });
      let d=`M ${coords[0].x.toFixed(2)} ${coords[0].y.toFixed(2)}`;
      for(let i=1;i<coords.length-1;i++){
        const a=coords[i],b=coords[i+1];
        d+=` Q ${a.x.toFixed(2)} ${a.y.toFixed(2)} ${((a.x+b.x)/2).toFixed(2)} ${((a.y+b.y)/2).toFixed(2)}`;
      }
      const last=coords[coords.length-1];d+=` L ${last.x.toFixed(2)} ${last.y.toFixed(2)}`;
      path.setAttribute('d',d);
      head.setAttribute('transform',`translate(${mouse.x.toFixed(2)} ${mouse.y.toFixed(2)})`);
      const targetRadius=hoverType.startsWith('VIEW')?29:hoverType?23:9;
      radius+=(targetRadius-radius)*.2;
      ring.setAttribute('r',radius.toFixed(2));
      const stroke=hoverType?3.1:2.1;path.style.strokeWidth=stroke;
      const left=mouse.x>innerWidth-115;
      text.setAttribute('x',left?(-radius-12):(radius+11));
      text.setAttribute('text-anchor',left?'end':'start');
      text.setAttribute('y',mouse.y<32?radius+12:-radius-7);
      if(now-clickTime>200)svg.classList.remove('is-clicking');
    }
    raf=requestAnimationFrame(draw);
  }
  raf=requestAnimationFrame(draw);
  const media=matchMedia('(hover:hover) and (pointer:fine) and (min-width:901px) and (prefers-reduced-motion:no-preference)');
  const stopIfDisabled=()=>{if(!media.matches){svg.classList.remove('is-visible');active=false;cancelAnimationFrame(raf);}};
  media.addEventListener?.('change',stopIfDisabled);
})();

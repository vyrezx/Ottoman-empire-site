import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {SplitText} from 'gsap/SplitText';

const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp=gsap.utils.clamp;
export function setupGestures(root,selectEvent){
 for(const view of root.querySelectorAll('.view')){
  const input=view.querySelector('.gesture');
  const object=view.querySelector('.movable');
  let x=0,y=0,scale=1,angle=0,drag,velocityX=0,velocityY=0;
  const render=(duration=0)=>gsap.to(object,{x,y,scale,rotation:angle,rotationY:view.dataset.mode==='object'?clamp(-29,29,x/5):0,duration:reduced()?0:duration,overwrite:true,ease:'power2.out'});
  const limit=()=>{x=clamp(-330,330,x);y=clamp(-245,245,y);scale=clamp(.8,3.2,scale)};
  input.addEventListener('pointerdown',e=>{
   if(e.button!==0||drag)return;
   input.setPointerCapture(e.pointerId);
   drag={id:e.pointerId,x:e.clientX,y:e.clientY,time:e.timeStamp};
   velocityX=velocityY=0;
   input.classList.add('dragging');
  });
  input.addEventListener('pointermove',e=>{
   if(!drag||e.pointerId!==drag.id)return;
   const dx=e.clientX-drag.x,dy=e.clientY-drag.y,dt=Math.max(e.timeStamp-drag.time,12);
   x+=dx;y+=dy;velocityX=dx/dt;velocityY=dy/dt;
   drag={id:e.pointerId,x:e.clientX,y:e.clientY,time:e.timeStamp};
   limit();render();
  });
  const finish=e=>{
   if(!drag||e.pointerId!==drag.id)return;
   if(e.type==='pointerup'&&e.timeStamp-drag.time<80&&!reduced()){
    x+=clamp(-110,110,velocityX*115);y+=clamp(-110,110,velocityY*115);
   }
   drag=null;
   input.classList.remove('dragging');limit();render(.38);
  };
  ['pointerup','pointercancel','lostpointercapture'].forEach(name=>input.addEventListener(name,finish));
  input.addEventListener('keydown',e=>{
   const delta={ArrowUp:[0,-24],ArrowDown:[0,24],ArrowLeft:[-24,0],ArrowRight:[24,0]}[e.key];
   if(!delta)return;
   e.preventDefault();x+=delta[0];y+=delta[1];limit();render(.18);
  });
  view.querySelectorAll('[data-transform]').forEach(button=>button.addEventListener('click',()=>{
   switch(button.dataset.transform){
    case 'plus':scale+=.25;break;
    case 'minus':scale-=.25;break;
    case 'rotate':angle=(angle+30)%360;break;
    case 'reset':x=y=angle=0;scale=1;break;
   }
   limit();render(.35);
  }));
  view.parentElement.querySelectorAll('[data-city]').forEach(button=>button.addEventListener('click',()=>{
   [x,y]={damascus:[35,58],beirut:[111,42],aleppo:[-22,146]}[button.dataset.city];
   scale=1.65;render(.6);
  }));
 }
 for(const line of root.querySelectorAll('.timeline.draggable')){
  let drag;
  line.addEventListener('pointerdown',e=>{
   if(e.button!==0)return;
   drag={id:e.pointerId, x:e.clientX, index:Number(line.querySelector('[aria-pressed=true]').dataset.event)};
  });
  line.addEventListener('pointermove',e=>{
   if(!drag||drag.id!==e.pointerId)return;
   const distance=e.clientX-drag.x;
   if(Math.abs(distance)<15&&!line.hasPointerCapture(e.pointerId))return;
   line.setPointerCapture(e.pointerId);
   selectEvent(line.closest('section'),clamp(0,line.children.length-1,drag.index+Math.round(distance/52)));
  });
  const stop=()=>{drag=null};
  ['pointerup','pointercancel','pointerleave','lostpointercapture'].forEach(name=>line.addEventListener(name,stop));
 }
}
export function setupMotion(rail,nav){
 const sections=[...document.querySelectorAll('main section')];
 const active=i=>{
  for(const list of [rail,nav])for(const [n,a] of [...list.children].entries()){
   if(n===i)a.setAttribute('aria-current','step');else a.removeAttribute('aria-current');
  }
 };
 active(0);
 const observer=new IntersectionObserver(entries=>{
  for(const entry of entries)if(entry.isIntersecting)active(sections.indexOf(entry.target));
 },{rootMargin:'-44% 0px -50% 0px'});
 sections.forEach(section=>observer.observe(section));
 const media=gsap.matchMedia();
 media.add('(prefers-reduced-motion: no-preference)',()=>{
  const hero=document.querySelector('.hero');
  const heading=hero.querySelector('h1');
  const split=SplitText.create(heading,{type:'words,chars',charsClass:'letter'});
  gsap.from(split.chars,{yPercent:95,rotateX:-58,stagger:.018,duration:.86,ease:'power3.out'});
  gsap.timeline({scrollTrigger:{trigger:hero,start:'top top',end:'bottom top',scrub:.55}})
   .to('.hero-art',{scale:1.27,yPercent:9,ease:'none'},0)
   .to('.hero-art',{opacity:.42,ease:'none'},.36)
   .to('.hero-document',{yPercent:-110,xPercent:-67,rotation:-18,ease:'none'},0)
   .to('.hero-grid',{opacity:.76,scale:1.06,ease:'none'},.24)
   .to('.hero-atmosphere',{xPercent:14,yPercent:-4,ease:'none'},0)
   .to('.hero-copy',{yPercent:-16,ease:'none'},0);
  const listen=new AbortController();
  for(const section of sections){
   const artwork=section.querySelector('.hero-art,.visual');
   const ghost=section.querySelector('.ghost,.hero-document');
   const moveX=gsap.quickTo(artwork,'rotationY',{duration:.55,ease:'power3.out'});
   const moveY=gsap.quickTo(artwork,'rotationX',{duration:.55,ease:'power3.out'});
   const moveGhost=gsap.quickTo(ghost,'x',{duration:.7,ease:'power3.out'});
   section.addEventListener('pointermove',e=>{
    if(e.pointerType!=='mouse'||e.buttons)return;
    const r=section.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
    moveX(x*6);moveY(-y*5);moveGhost(x*35);
   },{passive:true,signal:listen.signal});
   section.addEventListener('pointerleave',()=>{moveX(0);moveY(0);moveGhost(0)},{signal:listen.signal});
   if(section===hero)continue;
   const backdrop=section.querySelector('.scene-landscape');
   const title=section.querySelector('h2');
   const cam=gsap.timeline({scrollTrigger:{trigger:section,start:'top 94%',end:'bottom 8%',scrub:.5}});
   cam.fromTo(ghost,{y:55,scale:1.08},{y:-96,scale:.92,ease:'none'},0)
      .fromTo(backdrop,{yPercent:-7,scale:1.13},{yPercent:8,scale:1.25,ease:'none'},0)
      .fromTo(artwork,{y:35,scale:.94},{y:-25,scale:1.015,ease:'none'},0);
   gsap.fromTo(title,{clipPath:'inset(0 0 92% 0)'},{clipPath:'inset(0 0 0% 0)',duration:.72,ease:'power2.out',scrollTrigger:{trigger:title,start:'top 91%',toggleActions:'play none none reverse'}});
   section.querySelectorAll('.route').forEach(path=>{
    const length=path.getTotalLength();
    gsap.fromTo(path,{strokeDasharray:length,strokeDashoffset:length},{strokeDashoffset:0,ease:'none',scrollTrigger:{trigger:section,start:'top 87%',end:'center 54%',scrub:true}});
   });
  }
  const oil=document.querySelector('.oil');
  gsap.timeline({scrollTrigger:{trigger:oil,start:'top 80%',end:'center 38%',scrub:.55}})
    .fromTo(oil.querySelector('.oil-strata'),{y:65,clipPath:'inset(0 0 90% 0)'},{y:0,clipPath:'inset(0 0 0% 0)'},0)
    .fromTo(oil.querySelector('.oil-machinery'),{y:30,opacity:.25},{y:0,opacity:1},.15);
  const saudi=document.querySelector('.saudi');
  gsap.timeline({scrollTrigger:{trigger:saudi,start:'top 82%',end:'center 48%',scrub:true}})
   .fromTo(saudi.querySelector('.hejaz'),{x:-33},{x:0},0).fromTo(saudi.querySelector('.nejd'),{x:33},{x:0},0)
   .fromTo(saudi.querySelector('.union-label'),{opacity:0},{opacity:1},.55);
  gsap.fromTo('.suez .gesture',{rotationX:14,transformOrigin:'50% 70%'},{rotationX:-8,scrollTrigger:{trigger:'.suez',start:'top 85%',end:'bottom 20%',scrub:true}});
  return ()=>{listen.abort();split.revert()};
 });
 media.add('(min-width: 1020px) and (min-height: 740px) and (prefers-reduced-motion: no-preference)',()=>{
  for(const section of document.querySelectorAll('.oil,.suez')){
   const layout=section.querySelector('.scene-layout');
   ScrollTrigger.create({trigger:layout,start:'top 15%',end:'+=240',pin:true});
  }
 });
 window.addEventListener('pagehide',event=>{
  if(event.persisted)return;
  observer.disconnect();
  media.revert();
 },{once:true});
 document.fonts.ready.then(()=>ScrollTrigger.refresh());
}

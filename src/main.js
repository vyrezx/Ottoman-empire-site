import './style.css';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {SplitText} from 'gsap/SplitText';
import {scenes, people, countries, quiz, links} from './history.js';
import {art,paper} from './art.js';
import {setupMotion, setupGestures} from './motion.js';

gsap.registerPlugin(ScrollTrigger, SplitText);
const fileModules=import.meta.glob('../assets/*.webp',{eager:true,query:'?url',import:'default'});
const imageUrl=name=>fileModules['../assets/'+name+'.webp'];
const image=(name,alt,cls='')=>imageUrl(name)?`<img class="${cls}" src="${imageUrl(name)}" alt="${alt}" loading="lazy" decoding="async">`:'';
const main=document.querySelector('main');
main.querySelector('.hero-grid').innerHTML=art('intro');
const nav=document.querySelector('.chapters');
const rail=document.querySelector('.rail');
const panel=document.querySelector('#panel');
const body=document.querySelector('#panel-body');
const num=n=>String(n).padStart(2,'0');
const controls=(rotate=false)=>`<div class="stage-controls"><button data-transform="minus" aria-label="Кішірейту">−</button><button data-transform="plus" aria-label="Үлкейту">+</button>${rotate?'<button data-transform="rotate" aria-label="Бұру">↻</button>':''}<button data-transform="reset" aria-label="Қалпына келтіру">⟲</button></div>`;
function mounted(content,label,mode='map'){
 return `<div class="view" data-mode="${mode}"><div class="gesture" tabindex="0" aria-label="${label}. Жылжыту үшін көрсеткілерді басыңыз."><div class="movable">${content}</div></div>${controls(mode==='object')}<p class="gesture-note">${label} <span>·</span> Сүйреңіз</p></div>`;
}
const portrait=(key)=>`<button class="portrait-button" data-person="${key}">${image(people[key][2],'')}<span>${people[key][0]}</span><b aria-hidden="true">↗</b></button>`;
const documentStage=(kind)=>mounted(
 kind==='quincy'?paper('1943','Ленд-лиз'):paper('1936','Франция мен Ливан'),
 'Құжатты бұрыңыз','object');
function visual(scene){
 const {kind}=scene;
 switch(kind){
 case 'mandate':
  return `<div class="flow"><svg viewBox="0 0 600 420" aria-hidden="true"><path class="route" d="M140 105H450Q511 105 511 181V249Q511 309 450 309H145" fill="none" stroke="#d9ad65" stroke-width="2" stroke-dasharray="5 8"/></svg>${scene.events.map(([year,label],i)=>`<button class="node" data-event="${i}"><strong>${year}</strong><span>${label}</span></button>`).join('')}</div><div class="powers"><span>ФРАНЦИЯ <b>Сирия · Ливан</b></span><span>ҰЛЫБРИТАНИЯ <b>Ирак · Палестина</b></span></div>`;
 case 'quincy':
  return `<figure class="quincy"><div class="photo-frame">${image('quincy','Абдул-Азиз ибн Сауд пен Франклин Рузвельт USS Quincy кемесінде, 1945 жыл')}</div><figcaption>АҚШ армиясының архиві · 14 ақпан 1945 жыл</figcaption></figure><button class="exhibit-link" data-document="quincy">Ленд-лиз құжатын қарау ↗</button>`;
 case 'lebanon':
  return `${documentStage(kind)}<div class="diplomatic"><span>ФРАНЦИЯ</span><i></i><span>ЛИВАН</span></div><button class="exhibit-link" data-document="lebanon">Құжатты ашу ↗</button>`;
 case 'syria':
  return `<div class="archive-composition"><div class="timeline-paper">${paper('1925','Ұлттық көтеріліс')}</div><div class="timeline-photo">${image('portrait','Хашим әл-Атаси')}</div></div>${portrait('portrait')}`;
 case 'egypt':
  return `<div class="cairo-collage">${image('cairo','Тарихи Каирдің көркем панорамасы','cairo-photo')}<div class="timeline-paper">${paper('1882','Араби паша қозғалысы')}</div></div><div class="portraits">${['urabi','zaghlul','fuad'].map(portrait).join('')}</div>`;
 case 'saudi':
  return mounted(art(kind),'Шартты карта')+portrait('saud');
 case 'levant':
  return mounted(art(kind),'Шартты карта')+`<div class="city-controls"><button data-city="damascus">Дамаск</button><button data-city="beirut">Бейрут</button><button data-city="aleppo">Алеппо</button>${imageUrl('beirut-archive')?'<button data-archive="beirut">Бейруттың архивтік фотосы ↗</button>':''}</div>`;
 case 'oil':
  return mounted(art(kind),'Кен орнының шартты қимасы','object');
 case 'suez':
  return mounted(art(kind),'Суэц каналының шартты картасы');
 case 'final':
  return mounted(art(kind),'Төрт елдің шартты картасы');
 default:
  return mounted(art(kind),'Тарихи аймақтардың шартты картасы');
 }
}
function tabs(scene){
 if(!scene.events)return '';
 const initial=scene.kind==='oil'?1:0;
 const states=scene.events.map(([year,label],i)=>`<button data-event="${i}" aria-pressed="${i===initial}">${scene.kind==='oil'?label:year}</button>`).join('');
 const drag=['syria','egypt'].includes(scene.kind);
 return `<div class="timeline${drag?' draggable':''}" aria-label="Оқиғалар">${states}</div>${drag?'<p class="timeline-hint">Жылдарды басыңыз немесе уақыт сызығын сүйреңіз</p>':''}<div class="event" aria-live="polite"><h3>${scene.events[initial][1]}</h3><p>${scene.events[initial][2]}</p></div>`;
}
function finale(){
 return `<div class="comparison"><h3>Елдерді салыстырыңыз</h3><div class="timeline" aria-label="Елдер">${countries.map(([n],i)=>`<button data-country="${i}" aria-pressed="${i===0}">${n}</button>`).join('')}</div><dl class="country-details" aria-live="polite"></dl></div>
 <details class="all-years"><summary>Ортақ хронология</summary><ol>${[[1918,'Мудрос бітімі'],[1919,'Париж конференциясы және Египеттегі қозғалыс'],[1920,'Сан-Ремо және Ұлы Ливан'],[1922,'Сұлтандықтың жойылуы және Египет тәуелсіздігінің мойындалуы'],[1932,'Сауд Арабиясы Корольдігінің құрылуы'],[1936,'Сирия мен Ливанның Франциямен шарттары және ағылшын-египет шарты'],[1938,'Даммамда мұнайдың табылуы'],[1943,'Ливанның тәуелсіздік күні және АҚШ-тың ленд-лиз шешімі'],[1945,'USS Quincy кездесуі және БҰҰ-ның құрылуы']].map(([y,t])=>`<li><strong>${y}</strong> ${t}</li>`).join('')}</ol></details>
 <div class="end-actions"><button class="start" data-quiz>Білімді тексеру <span aria-hidden="true">↗</span></button><a href="#s1">Қайта бастау ↑</a><button data-sources>Дереккөздер ↗</button></div>`;
}
for (const [i,scene] of scenes.entries()){
 const target='#s'+(i+1);
 nav.insertAdjacentHTML('beforeend',`<a href="${target}"><span>${num(i+1)}</span>${scene.title}</a>`);
 rail.insertAdjacentHTML('beforeend',`<a href="${target}" aria-label="${scene.title}"><span>${num(i+1)}</span></a>`);
 if(!i)continue;
 const backdrop=` style="--tone:${scene.tone};${scene.art&&imageUrl(scene.art)?`--scene-photo:url('${imageUrl(scene.art)}')`:''}"`;
 main.insertAdjacentHTML('beforeend',`<section class="scene ${scene.kind}" id="s${i+1}" data-color="${scene.tone}" data-kind="${scene.kind}" data-state="${scene.kind==='oil'?1:0}"${backdrop}><div class="scene-landscape" aria-hidden="true"></div><div class="ghost" aria-hidden="true">${scene.date}</div>
 <div class="scene-layout"><div class="story-copy"><div class="eyebrow"><span></span> ${num(i+1)} / 12 <b> / </b> ${scene.region}</div><h2>${scene.title}</h2><p class="intro">${scene.intro}</p>${tabs(scene)}</div><div class="visual">${visual(scene)}</div></div>${scene.kind==='final'?finale():''}<div class="scene-footer"><a href="#s${i}">↑ Алдыңғы бөлім</a>${i<11?`<a href="#s${i+2}">Келесі бөлім ↓</a>`:''}</div></section>`);
}
const setCountry=(i)=>{
 const section=document.querySelector('.final');
 const labels=['Саяси жағдайы','Шетелдік ықпал','Ұлт-азаттық қозғалыстар','Тәуелсіздікке ұмтылыс','Экономикалық өзгерістер','Тарихи маңызы'];
 section.dataset.country=i;
 section.querySelectorAll('[data-country]').forEach((el,index)=>el.setAttribute('aria-pressed',i===index));
 section.querySelector('.country-details').innerHTML=labels.map((label,index)=>`<div><dt>${label}</dt><dd>${countries[i][index+1]}</dd></div>`).join('');
};
setCountry(0);
const eventChanges=new WeakMap();
function selectEvent(section,i){
 const scene=scenes[Number(section.id.slice(1))-1];
 const [year,title,description]=scene.events[i];
 if(section.dataset.state===String(i))return;
 section.dataset.state=i;
 section.querySelectorAll('[data-event]').forEach(el=>el.setAttribute('aria-pressed',Number(el.dataset.event)===i));
 section.querySelector('.event').innerHTML=`<h3>${title}</h3><p>${description}</p>`;
 section.querySelector('.ghost').textContent=year.length===4?year:scene.date;
 const document=section.querySelector('.timeline-paper');
 if(document)document.innerHTML=paper(year,title);
 const picture=section.querySelector('.timeline-photo');
 if(picture)picture.innerHTML=image(i>=3?'atassi':'portrait',i>=3?'Хашим әл-Атасидің президенттік қызметке кірісуі':'Хашим әл-Атаси');
 if(!matchMedia('(prefers-reduced-motion: reduce)').matches){
  eventChanges.get(section)?.kill();
  eventChanges.set(section,gsap.fromTo(section.querySelector('.event'),{clipPath:'inset(0 0 85% 0)'},{clipPath:'inset(0 0 0% 0)',duration:.35,ease:'power2.out'}));
 }
}
function open(html){
 body.innerHTML=html;
 if(!panel.open)panel.showModal();
 panel.scrollTop=0;
}
function quizForm(){
 open(`<h2>Білімді тексеру</h2><form id="quiz-form">${quiz.map(([question,options],i)=>`<fieldset><legend>${i+1}. ${question}</legend>${options.map((answer,j)=>`<label><input type="radio" name="q${i}" value="${j}" required> ${answer}</label>`).join('')}<p class="answer" hidden></p></fieldset>`).join('')}<button class="start" type="submit">Нәтижені көру</button> <button type="button" data-quiz>Қайта тапсыру</button><p class="score" tabindex="-1" role="status"></p></form>`);
 panel.scrollTop=0;
}
document.addEventListener('submit',event=>{
 if(event.target.id!=='quiz-form')return;
 event.preventDefault();
 const form=event.target;
 const values=new FormData(form);
 let score=0;
 form.querySelectorAll('fieldset').forEach((field,i)=>{
  const correct=Number(values.get('q'+i))===quiz[i][2];
  score+=Number(correct);
  const explanation=field.querySelector('.answer');
  explanation.hidden=false;
  explanation.textContent=(correct?'Дұрыс. ':'Қате. ')+quiz[i][3];
  explanation.classList.toggle('wrong',!correct);
 });
 const result=form.querySelector('.score');
 result.textContent=`Нәтиже: ${score} / 7`;
 result.focus();
});
const menu=document.querySelector('.contents');
const toggle=(show)=>{nav.hidden=!show;menu.setAttribute('aria-expanded',show)};
menu.addEventListener('click',()=>toggle(nav.hidden));
nav.addEventListener('click',event=>{if(event.target.closest('a'))toggle(false)});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!nav.hidden){toggle(false);menu.focus()}});
document.addEventListener('click',event=>{
 const el=event.target.closest('button');
 if(!el)return;
 if(el.dataset.event!==undefined)selectEvent(el.closest('section'),Number(el.dataset.event));
 if(el.dataset.country!==undefined)setCountry(Number(el.dataset.country));
 if(el.dataset.person){
  const [n,text,img]=people[el.dataset.person];
  open(`<h2>${n}</h2><div class="bio">${image(img,n)}<p>${text}</p></div>`);
 }
 if(el.dataset.document){
  const kind=el.dataset.document;
  const scene=scenes[kind==='quincy'?5:8];
  open(`<h2>${kind==='quincy'?'Ленд-лиз':'Франция мен Ливан'}</h2>${documentStage(kind)}<p>Құжаттың көркем макеті.</p><dl class="document-facts">${scene.events.map(([year,title,detail])=>`<dt>${year} · ${title}</dt><dd>${detail}</dd>`).join('')}</dl>`);
  setupGestures(body);
 }
 if(el.dataset.archive==='beirut')open(`<h2>Бейрут айлағы</h2><figure class="quincy">${image('beirut-archive','Бейрут айлағының тарихи фотосы')}<figcaption>Конгресс кітапханасы · Матсон жинағы</figcaption></figure>`);
 if(el.hasAttribute('data-quiz'))quizForm();
 if(el.hasAttribute('data-sources'))open(`<h2>Дереккөздер</h2><p>Негізгі дереккөз — оқулық. Тарихи мерзімдер мен архивтік фотолар қосымша дереккөздер арқылы нақтыланды.</p><ul class="sources">${links.map(([n,url])=>`<li><a href="${url}" target="_blank" rel="noopener noreferrer">${n} ↗</a></li>`).join('')}</ul><p>Қалалар — көркем иллюстрациялар. Карталар, қималар мен құжаттар — оқу үшін жасалған шартты сызбалар мен макеттер.</p>`);
});
setupGestures(main,selectEvent);
setupMotion(rail,nav);

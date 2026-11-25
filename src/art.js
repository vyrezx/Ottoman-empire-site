const texture = id => `<defs><pattern id="grid-${id}" width="34" height="34" patternUnits="userSpaceOnUse"><path d="M0 0H34V34" fill="none" stroke="#e7d4ad" stroke-opacity=".17" stroke-width="1"/></pattern><pattern id="hatch-${id}" width="6" height="6" patternUnits="userSpaceOnUse"><path d="M0 6L6 0" stroke="#191b17" stroke-opacity=".35" stroke-width="1"/></pattern></defs><path fill="url(#grid-${id})" d="M0 0H720V510H0Z"/>`;
const wrap = (id,content) => `<svg viewBox="0 0 720 510" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${texture(id)}${content}</svg>`;
const shape = (d,fill,extra='') => `<path d="${d}" fill="${fill}" stroke="#edcea0" stroke-width="1.6" vector-effect="non-scaling-stroke" ${extra}/>`;
const point = (x,y,label,anchor='start') => `<circle cx="${x}" cy="${y}" r="4" fill="#f4d397"/><text x="${x+(anchor==='end'?-10:10)}" y="${y-10}" text-anchor="${anchor}" class="city">${label}</text>`;
const compass = `<g transform="translate(625 99)" stroke="#e7d4ad" fill="none" opacity=".7"><circle r="39"/><circle r="32"/><path d="M0-52L5-5 52 0 5 5 0 52-5 5-52 0-5-5Z"/><path fill="#e7d4ad" d="M0-52L5-5 0 0Z"/><text y="-59" text-anchor="middle" fill="#e7d4ad" stroke="none">С</text></g>`;
const peninsula='M285 210l58-6 55 30 31 30 19 42 42 16 39-14 37 74-39 48-82 42-62-25-40-54-17-60-25-55Z';
const egypt='M120 242l103 3 27 36 26 78-26 49H121Z';
const syria='M260 151l55-14 58 16-10 30-48 40-44-11-17-21Z';
const lebanon='M250 165l13 5-2 25-13 16-8-10Z';
const anatolia='M139 88l52-17 30 14 75-29 44 12 68-10 48 30-68 39-43-4-45 15-52-8-32 14-20-24-41-3Z';
const iraq='M373 151l31 12 27 29 16 60 37 46-36 8-19-42-31-30-55-30 20-22Z';
const nile='M194 398c-1-31-17-43-16-69s17-44 13-76l-18-10m18 10 20-7';
const desertLines=(color, y=340)=> Array.from({length:12},(_,j)=>`<path d="M0 ${y+j*13}Q150 ${y-55+j*11} 310 ${y+j*14}T720 ${y+j*12}" stroke="${color}" stroke-opacity=".38" fill="none"/>`).join('');
function atlas(kind) {
 if(kind==='levant') return wrap(kind,`
 <g transform="translate(-245 -260) scale(2.04)">
 ${shape('M255 137l60-17 53 14 36 32-26 37-65 50-52-27-23 4-2-24 17-39Z','#9f563e')}
 <g class="division">${shape('M255 137l60-17 53 14-35 46-64 3-16-16Z','#b67a4b')}${shape('M266 183l67-3 35-46 36 32-26 37-65 50-52-27Z','#864332')}${shape('M260 188l7 5-5 36-16 12-8-11 6-19Z','#418078')}</g>
 ${point(285,204,'Дамаск')}${point(246,219,'Бейрут','end')}${point(302,153,'Алеппо')}${point(279,225,'Жәбәл-Друз')}
 </g>${compass}<text x="40" y="459" class="map-note">ЖЕРОРТА ТЕҢІЗІ</text>`);
 return wrap(kind,`
 ${shape('M0 136l94 12 67 93 62 4 40-65-14-32-48-8-48-23-44 7L0 85Z','#8a7049')}
 ${shape(anatolia,'#85503a','class="territory"')}${shape(iraq,'#876647','class="territory british"')}
 ${shape(peninsula,'#8d7149','class="territory arabia"')}${shape(egypt,'#866849','class="territory british egypt-region"')}
 ${shape(syria,'#9f593f','class="territory french syria-region"')}${shape(lebanon,'#40817a','class="territory french lebanon-region"')}
 <path d="${nile}" fill="none" stroke="#79a6a5" stroke-width="3"/>
 <path d="M135 188Q278 248 371 333T625 420" fill="none" stroke="#eed296" stroke-opacity=".6" stroke-dasharray="4 8" class="route"/>
 ${point(175,95,'Ыстамбұл','end')}${point(277,177,'Дамаск')}${point(243,182,'Бейрут','end')}${point(179,264,'Каир','end')}${point(408,329,'Эр-Рияд')}${point(339,326,'Мекке','end')}
 ${compass}<text x="40" y="457" class="map-note">ТАЯУ ШЫҒЫС</text><path d="M41 470h104" stroke="#e7d4ad"/>`);
}
function saudi() {
 return wrap('saudi',`
 <g transform="translate(-290 -221) scale(1.58)">
 <g class="hejaz">${shape('M285 210l49-5 26 57 29 59-15 95-30-22-17-61-25-55Z','#a4783c')}${point(339,327,'Мекке','end')}<text x="325" y="292" class="map-note">ХИДЖАЗ</text></g>
 <g class="nejd">${shape('M334 205l64 29 31 30 19 42 42 16 39-14 37 74-39 48-82 42-62-25-9-31 15-95-29-59Z','#56744d')}${point(421,325,'Эр-Рияд')}<text x="413" y="372" class="map-note">НЕДЖД</text></g>
 </g><g class="union-label">${point(330,420,'Сауд Арабиясы Корольдігі')}</g>${compass}`);
}
const derrick=(x,y,s)=>`<g class="derrick" transform="translate(${x} ${y}) scale(${s})" fill="none" stroke="#f1d2a0" stroke-width="3"><path d="M-54 0L-11-155H11L54 0M-11-155V-171H11V-155M-15-133H15M-25-98H25M-34-67H34M-43-35H43M-54 0H54M-15-133L25-98-34-67 43-35-54 0M15-133L-25-98 34-67-43-35 54 0M0-171v-26"/><path d="M-68 1H69" stroke-width="7"/></g>`;
const ship = `<g fill="#e7d4ad" stroke="#291f16" stroke-width="1.6"><path d="M-40 0L-27 12H26L43-3Z" fill="#2b2822" stroke="#e7d4ad"/><path d="M-22 0V-7H22V0M-15-7v-6H9v6M-4-13v-10H3v10M18-7v-15M18-19l12 5H18"/><path d="M-46 16H35M-33 21H22" fill="none" stroke="#c5dece" stroke-opacity=".5"/></g>`;
function oil() {
 return wrap('oil',`
 <path fill="#aa8351" d="M0 230Q160 132 332 213T720 197V304H0Z"/>
 ${desertLines('#e0bf83',218)}
 <g class="oil-strata">
 ${shape('M0 302Q170 251 350 302T720 268V510H0Z','#442c24')}
 ${shape('M0 315Q170 268 358 319T720 289V319Q523 370 363 347T0 345Z','#bf8b52')}
 ${shape('M0 359Q170 315 358 365T720 335V375Q523 408 363 398T0 394Z','#87513b')}
 ${shape('M0 400Q170 356 358 409T720 387V427Q523 449 363 443T0 434Z','#aa704a')}
 <path d="M161 430Q271 388 443 440T596 448Q500 491 365 464T161 430Z" fill="#171d1b" stroke="#e9bb6f" stroke-dasharray="3 6"/>
 ${point(289,447,'Мұнайлы қабат')}
 </g>
 <g class="oil-machinery">${derrick(315,298,1.16)}${derrick(497,292,.66)}
 <path d="M315 294v99m4-99H550q26 0 40-23l21-33" fill="none" stroke="#edb971" stroke-width="4"/>
 <path d="M559 294l161-34v62l-166 20Z" fill="#31575b" stroke="#e7d4ad"/>
 <g transform="translate(640 290) scale(.73)">${ship}</g>${point(522,210,'Даммам')}</g>
 <path d="M322 284Q475 150 651 263" class="route oil-export" fill="none" stroke="#f5d59c" stroke-width="2" stroke-dasharray="6 7"/>
 <text x="36" y="71" class="map-note">АРАБИЯ · ШАРТТЫ ҚИМА</text>`);
}
function suez() {
 const d='M302 45C286 125 350 137 318 210S345 310 411 352 432 425 458 501';
 return wrap('suez',`
 <path d="M0 76Q145 95 240 49T520 61L720 117V510H0Z" fill="#a88351"/>
 ${desertLines('#e9c791',190)}
 <path d="M0 0H720V117L601 75Q475 44 364 63T110 92L0 76Z" fill="#385f68"/>
 <path d="M446 388Q420 465 720 398V510H389Z" fill="#385f68"/>
 <path d="${d}" stroke="#e8c484" stroke-width="32" fill="none"/>
 <path d="${d}" stroke="#315d66" stroke-width="23" fill="none"/>
 <path d="${d}" stroke="#f9dca0" stroke-width="2" stroke-dasharray="4 7" fill="none" class="route"/>
 <g class="moving-ship" style="offset-path:path('${d}')">${ship}</g>
 ${point(302,87,'Порт-Саид','end')}${point(318,211,'Исмаилия')}${point(411,352,'Суэц','end')}
 <text x="418" y="42" class="map-note">ЖЕРОРТА ТЕҢІЗІ</text><text x="516" y="466" class="map-note">ҚЫЗЫЛ ТЕҢІЗ</text>${compass}`);
}
export function art(kind) {
 if(kind==='oil') return oil();
 if(kind==='suez') return suez();
 if(kind==='saudi') return saudi();
 return atlas(kind);
}
export function paper(date,title,other='') {
 return `<div class="paper"><div class="paper-border"><span>ТАРИХИ ҚҰЖАТ</span><strong>${date}</strong><h3>${title}</h3><i></i><i></i><i></i><i></i><div class="seal" aria-hidden="true">✦</div><small>${other || 'Көркем макет'}</small></div></div>`;
}

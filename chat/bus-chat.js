// BUS Whisky website-chatbot en widgetknoppen. Bron: github.com/dhurkmans716/buswhisky-data/chat/
// Dit is alleen de lader. De echte widgetcode staat in bus-chat-core.js.
// BUS_AGE_GATE_COOKIEBOT_V3
(function(){
  const KEY='bus_age_18plus_v3', MAX=365*24*60*60*1000;
  const COOKIEBOT_IDS=[
    'CybotCookiebotDialogBodyButtonAccept',
    'CybotCookiebotDialogBodyButtonDecline',
    'CybotCookiebotDialogBodyLevelButtonAccept',
    'CybotCookiebotDialogBodyLevelButtonLevelOptinDeclineAll',
    'CybotCookiebotDialogBodyLevelButtonLevelOptinAllowallSelection',
    'CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll'
  ];
  function ageOK(){
    try{const v=JSON.parse(localStorage.getItem(KEY)||'null');return !!(v&&v.ok===true&&Date.now()-Number(v.ts||0)<MAX)}catch(e){return false}
  }
  function remember(){try{localStorage.setItem(KEY,JSON.stringify({ok:true,ts:Date.now()}))}catch(e){}}
  const forceAgeTest=new URLSearchParams(location.search).get('agecheck')==='test';
  if(forceAgeTest){try{localStorage.removeItem(KEY)}catch(e){}}
  if(ageOK()) return;
  document.documentElement.classList.add('bus-age-pending');

  const lang=(document.documentElement.lang||navigator.language||'nl').slice(0,2).toLowerCase();
  const T={
    nl:{brand:'BUS WHISKY',title:'Welkom bij BUS',intro:'Goede whisky heeft tijd nodig. Jij ook.',year:'In welk jaar ben je geboren?',yearPh:'Geboortejaar',go:'Verder',almost:'Bijna geregeld',date:'Omdat dit geboortejaar 17 óf 18 kan betekenen, hebben we nog je dag en maand nodig.',day:'Dag',month:'Maand',enter:'18+ bevestigd',under:'Deze website is voor 18+',underText:'Je kunt BUS Whisky pas bezoeken als je 18 jaar of ouder bent.',nix:'Meer over NIX18',foot:'Geniet verantwoord. NIX18.',bad:'Vul een geldige geboortedatum in.',cookies:'Kies daarna hieronder je cookievoorkeuren.'},
    en:{brand:'BUS WHISKY',title:'Welcome to BUS',intro:'Good whisky takes time. So do you.',year:'What year were you born?',yearPh:'Year of birth',go:'Continue',almost:'Almost there',date:'Because this birth year can mean 17 or 18, we still need your day and month.',day:'Day',month:'Month',enter:'18+ confirmed',under:'This website is for 18+',underText:'You can visit BUS Whisky when you are 18 or older.',nix:'Learn more about NIX18',foot:'Enjoy responsibly. 18+ only.',bad:'Enter a valid date of birth.',cookies:'Then choose your cookie preferences below.'},
    de:{brand:'BUS WHISKY',title:'Willkommen bei BUS',intro:'Guter Whisky braucht Zeit. Du auch.',year:'In welchem Jahr bist du geboren?',yearPh:'Geburtsjahr',go:'Weiter',almost:'Fast geschafft',date:'Da dieses Geburtsjahr 17 oder 18 bedeuten kann, benötigen wir noch Tag und Monat.',day:'Tag',month:'Monat',enter:'18+ bestätigt',under:'Diese Website ist ab 18',underText:'Du kannst BUS Whisky besuchen, wenn du 18 Jahre oder älter bist.',nix:'Mehr über NIX18',foot:'Verantwortungsvoll genießen. 18+.',bad:'Bitte gib ein gültiges Geburtsdatum ein.',cookies:'Wähle danach unten deine Cookie-Einstellungen.'},
    fr:{brand:'BUS WHISKY',title:'Bienvenue chez BUS',intro:'Un bon whisky demande du temps. Vous aussi.',year:'En quelle année êtes-vous né(e) ?',yearPh:'Année de naissance',go:'Continuer',almost:'Presque terminé',date:'Comme cette année de naissance peut correspondre à 17 ou 18 ans, indiquez encore le jour et le mois.',day:'Jour',month:'Mois',enter:'18+ confirmé',under:'Ce site est réservé aux 18+',underText:'Vous pourrez visiter BUS Whisky à partir de 18 ans.',nix:'En savoir plus sur NIX18',foot:'À consommer avec modération. 18+.',bad:'Saisissez une date de naissance valide.',cookies:'Choisissez ensuite vos préférences de cookies ci-dessous.'},
    es:{brand:'BUS WHISKY',title:'Bienvenido a BUS',intro:'Un buen whisky necesita tiempo. Tú también.',year:'¿En qué año naciste?',yearPh:'Año de nacimiento',go:'Continuar',almost:'Casi listo',date:'Como este año de nacimiento puede significar 17 o 18 años, necesitamos también el día y el mes.',day:'Día',month:'Mes',enter:'18+ confirmado',under:'Este sitio es para mayores de 18',underText:'Podrás visitar BUS Whisky cuando tengas 18 años o más.',nix:'Más sobre NIX18',foot:'Disfruta con responsabilidad. 18+.',bad:'Introduce una fecha de nacimiento válida.',cookies:'Después elige tus preferencias de cookies abajo.'}
  };
  const t=T[lang]||T.nl;
  const style=document.createElement('style');
  style.id='bus-age-cookiebot-style';
  style.textContent=`
    html.bus-age-pending body{overflow:hidden!important}
    #bus-age-cookiebot{grid-column:1/-1!important;width:100%!important;box-sizing:border-box!important;justify-self:stretch!important;background:#111;color:#fff;padding:22px 24px 18px;border-bottom:1px solid rgba(255,255,255,.16);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif;text-align:center}
    #bus-age-cookiebot .bus-brand{font-size:13px;letter-spacing:.24em;font-weight:800;margin-bottom:10px}
    #bus-age-cookiebot h2{font-size:25px;line-height:1.15;margin:0 0 6px;color:#fff}
    #bus-age-cookiebot p{font-size:14px;line-height:1.45;margin:0 0 14px;color:#ddd}
    #bus-age-cookiebot .bus-q{font-weight:750;color:#fff;margin:0 0 8px}
    #bus-age-cookiebot .bus-fields{display:grid;grid-template-columns:1fr;gap:8px;max-width:360px;margin:0 auto 8px}
    #bus-age-cookiebot .bus-fields.two{grid-template-columns:1fr 1fr}
    #bus-age-cookiebot input{box-sizing:border-box;width:100%;height:46px;border-radius:8px;border:1px solid #777;background:#fff;color:#111;font:700 17px -apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif;text-align:center;padding:0 10px}
    #bus-age-cookiebot button{width:100%;max-width:360px;min-height:44px;border:1px solid #fff;border-radius:8px;background:#fff;color:#111;font-weight:800;font-size:14px;cursor:pointer;padding:0 12px}#CybotCookiebotDialog #bus-age-go,#CybotCookiebotDialog #bus-age-enter{display:inline-flex!important;align-items:center;justify-content:center}
    #bus-age-cookiebot .bus-err{min-height:17px;color:#ffb4a8;font-size:12px;margin-top:6px}
    #bus-age-cookiebot .bus-foot{font-size:11px;color:#aaa;margin-top:7px}
    #bus-age-cookiebot .bus-cookie-note{font-size:12px;color:#bbb;margin:10px 0 0}
    #bus-age-fallback{position:fixed;inset:0;z-index:2147483647;background:rgba(0,0,0,.94);display:flex;align-items:center;justify-content:center;padding:18px}
    #bus-age-fallback .bus-fallback-card{width:min(500px,100%);background:#111;border:1px solid rgba(255,255,255,.2);border-radius:16px;overflow:hidden;box-shadow:0 24px 70px rgba(0,0,0,.55)}
    html.bus-age-pending [data-bus-age-locked="1"]{opacity:.45!important;pointer-events:none!important}
    #CybotCookiebotDialog{display:flex!important;flex-direction:column!important;align-items:stretch!important}\n    #bus-age-cookiebot{order:-1!important;align-self:stretch!important;width:100%!important;max-width:none!important;box-sizing:border-box!important;background:#f3f3f3!important;color:#111!important;border-bottom:1px solid #d2d2d2!important}\n    #bus-age-cookiebot .bus-brand,#bus-age-cookiebot h2,#bus-age-cookiebot p,#bus-age-cookiebot .bus-q,#bus-age-cookiebot .bus-cookie-note,#bus-age-cookiebot .bus-foot{color:#111!important}\n    #bus-age-cookiebot .bus-cookie-note,#bus-age-cookiebot .bus-foot{opacity:.8!important}\n    #bus-age-cookiebot input{background:#fff!important;color:#111!important;border-color:#888!important}\n    @media(max-width:560px){#bus-age-cookiebot{padding:18px 16px 14px}#bus-age-cookiebot h2{font-size:22px}}
  `;
  (document.head||document.documentElement).appendChild(style);

  function lockCookiebot(){}
  function cleanup(panel){
    remember();
    document.documentElement.classList.remove('bus-age-pending');
    lockCookiebot(false);
    if(panel&&panel.parentNode) panel.remove();
    const fb=document.getElementById('bus-age-fallback');if(fb)fb.remove();
    if(style&&style.parentNode) style.remove();
  }
  function deny(panel){
    panel.innerHTML='<div class="bus-brand">'+t.brand+'</div><h2>'+t.under+'</h2><p>'+t.underText+'</p><a href="https://www.nix18.nl/" target="_blank" rel="noopener" style="color:#fff;text-decoration:underline">'+t.nix+'</a><div class="bus-foot">'+t.foot+'</div>';
    lockCookiebot(true);
  }
  function dateScreen(panel,yr){
    panel.innerHTML='<div class="bus-brand">'+t.brand+'</div><h2>'+t.almost+'</h2><p>'+t.date+'</p><div class="bus-fields two"><input id="bus-age-day" inputmode="numeric" maxlength="2" placeholder="'+t.day+'"><input id="bus-age-month" inputmode="numeric" maxlength="2" placeholder="'+t.month+'"></div><button id="bus-age-enter" type="button">'+t.enter+'</button><div class="bus-err" id="bus-age-err"></div><div class="bus-cookie-note">'+t.cookies+'</div><div class="bus-foot">'+t.foot+'</div>';
    const d=panel.querySelector('#bus-age-day'),m=panel.querySelector('#bus-age-month'),err=panel.querySelector('#bus-age-err');
    const check=()=>{const day=Number(d.value),mon=Number(m.value),test=new Date(yr,mon-1,day,12);if(!(mon>=1&&mon<=12&&day>=1&&day<=31&&test.getFullYear()===yr&&test.getMonth()===mon-1&&test.getDate()===day)){err.textContent=t.bad;return}const now=new Date(),birthday=new Date(now.getFullYear(),mon-1,day);now>=birthday?cleanup(panel):deny(panel)};
    const finish=()=>{const day=Number(d.value),mon=Number(m.value),test=new Date(yr,mon-1,day,12);if(!(mon>=1&&mon<=12&&day>=1&&day<=31&&test.getFullYear()===yr&&test.getMonth()===mon-1&&test.getDate()===day)){err.textContent=t.bad;return}const now=new Date(),birthday=new Date(now.getFullYear(),mon-1,day);if(now<birthday)return deny(panel);remember();document.documentElement.classList.remove('bus-age-pending');const mode=panel.dataset.busConsentMode||'all';const accept=document.getElementById(mode==='necessary'?'CybotCookiebotDialogBodyButtonDecline':'CybotCookiebotDialogBodyButtonAccept')||document.getElementById(mode==='necessary'?'CybotCookiebotDialogBodyLevelButtonLevelOptinDeclineAll':'CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll');if(accept)accept.click();cleanup(panel)};
    panel.querySelector('#bus-age-enter').onclick=finish;[d,m].forEach(x=>x.addEventListener('keydown',e=>{if(e.key==='Enter')finish()}));setTimeout(()=>d.focus(),40);
  }
  function yearScreen(panel){
    panel.innerHTML='<div class="bus-brand">'+t.brand+'</div><h2>'+t.title+'</h2><p>'+t.intro+'</p><div class="bus-q">'+t.year+'</div><div class="bus-fields"><input id="bus-age-year" inputmode="numeric" autocomplete="bday-year" maxlength="4" placeholder="'+t.yearPh+'"></div><button id="bus-age-go" type="button">18+ en alles toestaan</button><button id="bus-age-necessary" type="button" style="margin-top:8px;background:transparent;border-color:#c9a227;color:#111">Alleen noodzakelijke cookies</button><div class="bus-err" id="bus-age-err"></div><div class="bus-cookie-note">Je cookiekeuze en leeftijd worden met één klik bevestigd.</div><div class="bus-foot">'+t.foot+'</div>';
    const y=panel.querySelector('#bus-age-year'),err=panel.querySelector('#bus-age-err');
    const check=(mode)=>{const now=new Date(),cy=now.getFullYear(),boundary=cy-18,yr=Number(y.value);if(!/^\d{4}$/.test(y.value)||yr<1900||yr>cy){err.textContent=t.bad;return}if(yr>boundary)return deny(panel);if(yr===boundary){panel.dataset.busConsentMode=mode;return dateScreen(panel,yr)}remember();document.documentElement.classList.remove('bus-age-pending');const accept=document.getElementById(mode==='necessary'?'CybotCookiebotDialogBodyButtonDecline':'CybotCookiebotDialogBodyButtonAccept')||document.getElementById(mode==='necessary'?'CybotCookiebotDialogBodyLevelButtonLevelOptinDeclineAll':'CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll');if(accept)accept.click();cleanup(panel)};
    panel.querySelector('#bus-age-go').onclick=()=>check('all');const nec=panel.querySelector('#bus-age-necessary');if(nec)nec.onclick=()=>check('necessary');y.addEventListener('keydown',e=>{if(e.key==='Enter')check('all')});setTimeout(()=>y.focus(),40);
  }
  function integrate(){
    if(ageOK()){document.documentElement.classList.remove('bus-age-pending');return true}
    const dialog=document.getElementById('CybotCookiebotDialog');
    if(!dialog) return false;
    const cs=getComputedStyle(dialog),rect=dialog.getBoundingClientRect();
    if(cs.display==='none'||cs.visibility==='hidden'||rect.width<10||rect.height<10) return false;
    let panel=document.getElementById('bus-age-cookiebot');
    if(!panel){panel=document.createElement('div');panel.id='bus-age-cookiebot';dialog.insertBefore(panel,dialog.firstChild);yearScreen(panel)}
    lockCookiebot(true);
    return true;
  }
  function fallback(){
    if(ageOK()||document.getElementById('bus-age-fallback')||document.getElementById('bus-age-cookiebot'))return;
    const wrap=document.createElement('div');wrap.id='bus-age-fallback';wrap.innerHTML='<div class="bus-fallback-card"><div id="bus-age-cookiebot"></div></div>';document.body.appendChild(wrap);yearScreen(wrap.querySelector('#bus-age-cookiebot'));const p=wrap.querySelector('#bus-age-cookiebot');const n=p&&p.querySelector('.bus-cookie-note');if(n)n.style.display='none';
  }
  function validateAgeFromPanel(panel){
    if(!panel)return false;
    const err=panel.querySelector('#bus-age-err');
    const d=panel.querySelector('#bus-age-day'),m=panel.querySelector('#bus-age-month');
    if(d&&m){const yr=new Date().getFullYear()-18,day=Number(d.value),mon=Number(m.value),test=new Date(yr,mon-1,day,12);if(!(mon>=1&&mon<=12&&day>=1&&day<=31&&test.getFullYear()===yr&&test.getMonth()===mon-1&&test.getDate()===day)){if(err)err.textContent=t.bad;return false}const now=new Date(),birthday=new Date(now.getFullYear(),mon-1,day);if(now>=birthday)return true;deny(panel);return false}
    const y=panel.querySelector('#bus-age-year'),now=new Date(),cy=now.getFullYear(),boundary=cy-18,yr=Number(y&&y.value);if(!y||!/^\\d{4}$/.test(y.value)||yr<1900||yr>cy){if(err)err.textContent=t.bad;return false}if(yr<boundary)return true;if(yr>boundary){deny(panel);return false}dateScreen(panel,yr);return false;
  }
  document.addEventListener('click',e=>{const btn=e.target&&e.target.closest?e.target.closest('#'+COOKIEBOT_IDS.join(',#')):null;if(!btn||ageOK())return;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();const panel=document.getElementById('bus-age-cookiebot');if(validateAgeFromPanel(panel)){cleanup(panel);setTimeout(()=>btn.click(),0)}},true);
  const obs=new MutationObserver(()=>integrate());
  obs.observe(document.documentElement,{childList:true,subtree:true});
  window.addEventListener('CookiebotOnDialogInit',()=>setTimeout(integrate,0));
  window.addEventListener('CookiebotOnDialogDisplay',()=>setTimeout(integrate,0));
  if(document.body){if(!integrate())setTimeout(fallback,1800)}else document.addEventListener('DOMContentLoaded',()=>{if(!integrate())setTimeout(fallback,1800)},{once:true});
  setTimeout(()=>{integrate();lockCookiebot(true)},100);
})();
import('https://cdn.jsdelivr.net/gh/dhurkmans716/buswhisky-data@main/chat/bus-chat-core.js?v=' + Math.floor(Date.now() / 3600000));

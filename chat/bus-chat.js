// BUS_CORE_V4_PRIORITY_LOADER - leeftijd en consent vóór overige widgets
// BUS_UNIFIED_AGE_CONSENT_V4
(function(){
'use strict';
if(window.__busUnifiedAgeConsentV4)return;
window.__busUnifiedAgeConsentV4=true;
var KEY='bus_age_18plus_v3', YEAR_MS=365*24*60*60*1000;
var modal=null,style=null,closing=false,submitted=false;
var __busCoreStarted=false;
function loadCore(){if(__busCoreStarted)return;__busCoreStarted=true;import('https://cdn.jsdelivr.net/gh/dhurkmans716/buswhisky-data@main/chat/bus-chat-core.js?v='+Math.floor(Date.now()/3600000)).catch(function(e){console.error('[BUS] widget core loading failed',e)})}

function ageOK(){try{var o=JSON.parse(localStorage.getItem(KEY)||'null');return !!(o&&o.ok===true&&Number(o.ts)>0&&Date.now()-Number(o.ts)<YEAR_MS)}catch(e){return false}}
function recordAge(){try{localStorage.setItem(KEY,JSON.stringify({ok:true,ts:Date.now()}))}catch(e){}}
function consentOK(){return !!(window.Cookiebot&&(Cookiebot.hasResponse||Cookiebot.consented||Cookiebot.declined))}
function hideNative(){if(document.getElementById('bus-unified-hide-native'))return;var s=document.createElement('style');s.id='bus-unified-hide-native';s.textContent='#CybotCookiebotDialog,#CybotCookiebotDialogBodyUnderlay,#CybotCookiebotDialogPoweredByText,#CookiebotWidget{display:none!important}';document.head.appendChild(s)}
function removeNativeHide(){var s=document.getElementById('bus-unified-hide-native');if(s)s.remove()}
function removeModal(){if(modal){modal.remove();modal=null}if(style){style.remove();style=null}closing=false}
function esc(t){return String(t).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function build(){
 if(!document.body||modal)return;
 hideNative();
 style=document.createElement('style');style.id='bus-unified-v4-style';
 style.textContent='#bus-unified-overlay{position:fixed!important;inset:0!important;z-index:2147483646!important;background:rgba(0,0,0,.78)!important;display:flex!important;align-items:center!important;justify-content:center!important;padding:16px!important;box-sizing:border-box!important;overflow:auto!important;font-family:Arial,Helvetica,sans-serif!important}#bus-unified-card{background:#171717!important;color:#fff!important;border:1px solid #bd9c27!important;border-radius:15px!important;padding:23px 22px!important;box-sizing:border-box!important;width:min(100%,440px)!important;max-height:calc(100dvh - 32px)!important;overflow:auto!important;box-shadow:0 12px 50px #0008!important}#bus-unified-card *{box-sizing:border-box!important}#bus-unified-card h2{font-size:29px!important;line-height:1.15!important;color:#fff!important;margin:9px 0!important;font-weight:500!important}#bus-unified-card p{font-size:14px!important;line-height:1.45!important;color:#ddd!important;margin:7px 0 18px!important}#bus-unified-card .bus-brand{font-size:15px!important;letter-spacing:3px!important;font-weight:bold!important;color:#d8b435!important}#bus-unified-card label{color:#fff!important;font-weight:600!important;font-size:15px!important}#bus-unified-year,#bus-unified-day,#bus-unified-month{background:#fff!important;color:#111!important;width:100%!important;min-height:49px!important;border-radius:8px!important;border:2px solid #bbb!important;padding:9px 11px!important;font-size:19px!important;margin:8px 0 12px!important}#bus-unified-card .bus-cookie-row{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:12px!important;padding:10px 0!important;border-bottom:1px solid #555!important}#bus-unified-card .bus-cookie-row span{font-size:15px!important;color:#fff!important}#bus-unified-card input[type=checkbox]{appearance:auto!important;accent-color:#d5ac27!important;width:24px!important;height:24px!important;min-width:24px!important;cursor:pointer!important}#bus-unified-next{display:block!important;width:100%!important;background:#d5ac27!important;border:0!important;border-radius:26px!important;color:#111!important;font-size:19px!important;font-weight:700!important;min-height:51px!important;margin-top:18px!important;cursor:pointer!important}#bus-unified-error{min-height:0!important;color:#ffc0c0!important;font-size:14px!important;margin:8px 0!important}#bus-unified-card .bus-foot{margin:12px 0 0!important;color:#bbb!important;font-size:12px!important}#bus-unified-card .bus-subtitle{font-weight:600!important;color:#eee!important;margin:14px 0 5px!important}';
 document.head.appendChild(style);
 modal=document.createElement('div');modal.id='bus-unified-overlay';modal.setAttribute('role','dialog');modal.setAttribute('aria-modal','true');modal.setAttribute('aria-label','Leeftijdscheck en cookievoorkeuren');
 var co=window.Cookiebot&&Cookiebot.consent||{};
 modal.innerHTML='<div id="bus-unified-card"><div class="bus-brand">BUS WHISKY</div><h2>Welkom bij BUS</h2><p>Goede whisky heeft tijd nodig. Jij ook.</p><label for="bus-unified-year">In welk jaar ben je geboren?</label><input id="bus-unified-year" type="text" inputmode="numeric" autocomplete="bday-year" maxlength="4" placeholder="Geboortejaar" aria-required="true"><div id="bus-unified-date" style="display:none"><p>Vul ook je geboortedag en -maand in om je leeftijd te bevestigen.</p><div style="display:flex;gap:12px"><div style="width:50%"><label for="bus-unified-day">Dag</label><input id="bus-unified-day" inputmode="numeric" type="number" min="1" max="31" placeholder="DD"></div><div style="width:50%"><label for="bus-unified-month">Maand</label><input id="bus-unified-month" inputmode="numeric" type="number" min="1" max="12" placeholder="MM"></div></div></div><div class="bus-subtitle">Cookievoorkeuren</div><div class="bus-cookie-row"><span>Noodzakelijk</span><input type="checkbox" checked disabled aria-label="Noodzakelijk, altijd actief"></div><div class="bus-cookie-row"><span>Voorkeuren</span><input id="bus-cookie-preferences" type="checkbox" '+(co.preferences?'checked':'')+'></div><div class="bus-cookie-row"><span>Statistieken</span><input id="bus-cookie-statistics" type="checkbox" '+(co.statistics?'checked':'')+'></div><div class="bus-cookie-row"><span>Marketing</span><input id="bus-cookie-marketing" type="checkbox" '+(co.marketing?'checked':'')+'></div><div id="bus-unified-error" role="alert"></div><button id="bus-unified-next" type="button">Verder</button><p class="bus-foot">Met Verder bevestig je dat je 18+ bent en sla je je gekozen cookievoorkeuren op. Geniet verantwoord. NIX18.</p></div>';
 document.body.appendChild(modal);
 var y=modal.querySelector('#bus-unified-year');
 if(ageOK()){y.value=String(new Date().getFullYear()-25)}
 modal.querySelector('#bus-unified-next').addEventListener('click',submit);
 y.addEventListener('input',function(){var yr=Number(y.value);modal.querySelector('#bus-unified-date').style.display=(y.value.length===4&&yr===new Date().getFullYear()-18)?'block':'none'});
 y.addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();submit()}});
}
function error(msg){var a=modal&&modal.querySelector('#bus-unified-error');if(a)a.textContent=msg}
function submit(){
 if(!modal||closing)return;
 error('');
 var y=modal.querySelector('#bus-unified-year'),val=y.value.trim(),year=Number(val),now=new Date(),cy=now.getFullYear(),boundary=cy-18;
 if(!/^[0-9]{4}$/.test(val)||year<1900||year>cy){error('Vul een geldig geboortejaar in.');y.focus();return}
 if(year>boundary){error('Je moet minimaal 18 jaar zijn om de website te bezoeken.');return}
 if(year===boundary){
  modal.querySelector('#bus-unified-date').style.display='block';
  var day=Number(modal.querySelector('#bus-unified-day').value),month=Number(modal.querySelector('#bus-unified-month').value),date=new Date(year,month-1,day,12);
  if(!day||!month||date.getFullYear()!==year||date.getMonth()!==month-1||date.getDate()!==day){error('Vul je geboortedag en -maand in.');return}
  if(new Date(year,month-1,day)>now){error('Je moet minimaal 18 jaar zijn om de website te bezoeken.');return}
 }
 if(!window.Cookiebot||typeof Cookiebot.submitCustomConsent!=='function'){error('Cookievoorkeuren worden nog geladen. Probeer het opnieuw.');return}
 closing=true;var button=modal.querySelector('#bus-unified-next');button.disabled=true;button.textContent='Opslaan…';
 var pref=modal.querySelector('#bus-cookie-preferences').checked,stat=modal.querySelector('#bus-cookie-statistics').checked,mark=modal.querySelector('#bus-cookie-marketing').checked;
 try{
  Cookiebot.submitCustomConsent(pref,stat,mark);
  // Cookiebot owns consent storage; age verification is stored only after invoking its API successfully.
  recordAge();submitted=true;
  removeModal();removeNativeHide();loadCore();
 }catch(e){closing=false;button.disabled=false;button.textContent='Verder';error('Cookievoorkeuren opslaan is niet gelukt. Probeer opnieuw.')}
}
function start(){
 if(!document.body){document.addEventListener('DOMContentLoaded',start,{once:true});return}
 if(ageOK()&&consentOK()){removeNativeHide();loadCore();return}
 build();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
window.addEventListener('CookiebotOnDialogDisplay',function(){if(modal)hideNative()});
window.addEventListener('CookiebotOnConsentReady',function(){if(modal)hideNative()});
})();

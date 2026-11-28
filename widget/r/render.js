/* BUS reserveerwidget-renderer, automatisch gebouwd uit n8n-workflow TDOHm6WLSfFVNSEo (versie 2470bc17-2273-439e-b21f-7543e9f5b64b).
   Niet met de hand wijzigen: de subflow "BUS Widget renderer publiceren" bouwt hem elk kwartier opnieuw. */
(function (G) {
  "use strict";
  var S = {};
  S["engine"] = async function ($input, $, DateTime, $vars, $getWorkflowStaticData) {
// Levert de BUS Engine-catalogus aan Bouw preview (uit cache of vers van de adapter) en vult de cache.
// 22 nov 2026: uitsluitend BUS Engine-velden; raw_guestplan wordt hier verwijderd zodat geen enkele widgetnode het nog kan lezen.
const inp=$input.first().json||{};

// 9 nov 2026 (executiebudget): deeplink naar een arrangement dat vandaag niet kan liet de browser meteen
// herladen naar de eerste mogelijke dag (tweede webhook-run). Die dag nu hier al bepalen; de bouwnodes gebruiken hem.
function __startDatum(data){try{
 const q=($('GET BUS Booking Widget').first().json||{}).query||{};
 if(q.date)return '';const code=String(q.arrangement||q.service_code||q.service||'').trim();if(!code)return '';
 const cat=String(q.category||q.type||'').toLowerCase();if(['bedrijfsuitjes','vergaderingen','bruiloften'].includes(cat))return '';
 const s=(data&&Array.isArray(data.experiences)?data.experiences:[]).find(x=>String(x.service_code||'')===code);if(!s)return '';
 const r=s.engine||{};const S={wd:Array.isArray(s.week_days)?s.week_days:[],a:s.local_start_date||'',z:s.local_end_date||'',min:s.min_party_size||1,max:s.max_party_size||0,b:(r.blackouts||[]).map(x=>[x.start_date||'',x.end_date||''])};
 const __d=Math.max(S.min,S.max?Math.min(2,S.max):2);const p=Math.max(1,Math.min(50,parseInt(q.pax||String(__d),10)||__d)); /* 27 nov 2026: standaardaantal binnen min/max */
 const el=k=>{if(p<S.min)return false;if(S.max&&p>S.max)return false;if(S.a&&k<S.a)return false;if(S.z&&k>S.z)return false;if(S.wd.length&&!S.wd.includes(DateTime.fromISO(k).weekday))return false;for(const b of S.b){if(b[0]&&b[1]&&k>=b[0]&&k<=b[1])return false}return true};
 const t0=DateTime.now().setZone('Europe/Amsterdam').startOf('day');if(code!=='CewjJvV'&&el(t0.toFormat('yyyy-MM-dd')))return ''; // restaurant: minimaal 24 uur vooraf, dus vandaag nooit
 for(let n=1;n<=240;n++){const k=t0.plus({days:n}).toFormat('yyyy-MM-dd');if(el(k))return k}
}catch(e){}return ''}
function __engineOnly(d){if(!d||!Array.isArray(d.experiences))return d;return Object.assign({},d,{experiences:d.experiences.filter(s=>s&&s.engine).map(({raw_guestplan,...s})=>s)})}
if(inp.__hit&&inp.__data){inp.__data=__engineOnly(inp.__data);const sd=__startDatum(inp.__data);return [{json:sd?{...inp.__data,__startDatum:sd}:inp.__data}];}
const inpE=__engineOnly(inp);
let key='';try{key=$('Cache lezen').first().json.__cacheKey||''}catch(e){}
if(inp.ok&&key){const st=$getWorkflowStaticData('global');st.gpCache=st.gpCache||{};const now=Date.now();for(const k of Object.keys(st.gpCache)){if(!st.gpCache[k]||now-st.gpCache[k].t>600000)delete st.gpCache[k]}st.gpCache[key]={t:now,d:inpE}}
{const sd=__startDatum(inpE);return [{json:sd?{...inpE,__startDatum:sd}:inpE}];}
  };
  S["k0"] = async function ($input, $, DateTime, $vars, $getWorkflowStaticData) {
// 8 nov 2026: oude Guestplan-API (interne app-API) uitgeschakeld op eis van Guestplan; ombouwen naar officiele Booking API oude-boekings-API/v1.
const items=$input.all().map(i=>i.json||{});let q={};try{q=$('GET BUS Booking Widget').first().json.query||{}}catch(e){}try{const __sd=$('BUS Engine services').first().json.__startDatum;if(__sd&&!q.date)q=Object.assign({},q,{date:__sd})}catch(__e){}const pax=(()=>{let d=2;try{const c=String(q.arrangement||q.service_code||q.service||'').trim();const ex=(items.find(x=>Array.isArray(x.experiences))||{}).experiences||[];const s=c&&ex.find(x=>String(x.service_code||'')===c);if(s){const mn=Number(s.min_party_size||1),mx=Number(s.max_party_size||0);if(d<mn)d=mn;if(mx&&d>mx)d=mx}}catch(e){}return Math.max(1,Math.min(50,parseInt(q.pax||String(d),10)||d))})(); /* 27 nov 2026: zonder pax start een deeplink op het toegestane aantal (1-persoonskamer = 1) */const now=DateTime.now().setZone('Europe/Amsterdam');const today=now.toFormat('yyyy-MM-dd');const nowTime=now.toFormat('HH:mm');const date=/^\d{4}-\d{2}-\d{2}$/.test(q.date||'')?q.date:today;let chosen=/^\d{2}:\d{2}$/.test(q.time||'')?q.time:'';const requestedCode=String(q.arrangement||q.service_code||q.service||'').trim();const services=items.find(x=>Array.isArray(x.experiences))?.experiences||[];const avMap={rondleiding:items.find(x=>x.soort==='rondleiding'&&x.status!=='VRIJE_DATUMS'&&x.status!=='GEEN_VRIJE_DATUMS')||{},proeverij:items.find(x=>x.soort==='proeverij'&&x.status!=='VRIJE_DATUMS'&&x.status!=='GEEN_VRIJE_DATUMS')||{},restaurant:items.find(x=>x.soort==='restaurant'&&x.status!=='VRIJE_DATUMS'&&x.status!=='GEEN_VRIJE_DATUMS')||{}};const scanMap={rondleiding:items.find(x=>x.soort==='rondleiding'&&Array.isArray(x.vrijeDatums))||{},proeverij:items.find(x=>x.soort==='proeverij'&&Array.isArray(x.vrijeDatums))||{},restaurant:items.find(x=>x.soort==='restaurant'&&Array.isArray(x.vrijeDatums))||{}};const codes={restaurant:['CewjJvV','4cSbXnj'],rondleiding:['42SA1mn'],proeverij:['Fc7ZW1']};const day=DateTime.fromISO(date).weekday;
// 19 nov 2026: geen zware externe restaurant availability call op het algemene overzicht.
// Alleen expliciete restaurant-deeplinks vragen live tijden op. Het overzicht blijft fail-closed voor tijden.
let liveRestaurantTimes=requestedCode?null:[];
// Guestplan service metadata lists only its first time (12:00), not live dinner slots.
if((['CewjJvV','4cSbXnj'].includes(requestedCode))&&date.length===10){
 // 9 nov 2026: restauranttijden via de officiele Booking API (etender-connect availability per dag, tab 117004 restaurant, duur 240 = service 44557).
 try{
  const [yy,mm,dd]=date.split('-').map(Number);
  const resp=await this.helpers.httpRequest({method:'GET',url:((()=>{try{return String($vars.BUS_ENGINE_LIVE||'')==='true'}catch(e){return false}})()?'https://buswhiskyevents.app.n8n.cloud/webhook/bus-engine-etender?p=':'https://buswhiskyevents.app.n8n.cloud/webhook/bus-nappkin-rest?p=/v1/restaurants/54224')+'/availability/'+yy+'/'+mm+'/'+dd+'?partysize='+pax+'&sectionId=117004&duration=240',headers:{Authorization:'AccessKey 7d419ba4c783b5392f74a49242a0a84e2c1167a5',Accept:'application/json'},json:true,timeout:9000});
  if(Array.isArray(resp)){liveRestaurantTimes=[...new Set(resp.filter(x=>x&&x.isAvailable===true&&/^\d{2}:\d{2}$/.test(String(x.localTime||''))&&(!Array.isArray(x.availablePartySizes)||!x.availablePartySizes.length||x.availablePartySizes.includes(pax))).map(x=>String(x.localTime)))].sort();}
 }catch(e){liveRestaurantTimes=[];/* fail closed: nooit een tijd als boekbaar tonen zonder live controle */}
}
function kindFor(s){const c=String(s.service_code||'');if(codes.restaurant.includes(c))return 'restaurant';if(codes.rondleiding.includes(c))return 'rondleiding';if(codes.proeverij.includes(c))return 'proeverij';return 'arrangement'}function dateEligible(s){const r=s.engine||{};if(pax<(s.min_party_size||1))return false;if(s.max_party_size&&pax>s.max_party_size)return false;if(s.local_start_date&&date<s.local_start_date)return false;if(s.local_end_date&&date>s.local_end_date)return false;if(Array.isArray(s.week_days)&&s.week_days.length&&!s.week_days.includes(day))return false;for(const b of (r.blackouts||[])){if(b.start_date&&b.end_date&&date>=b.start_date&&date<=b.end_date)return false}return true}const isPromoted=s=>s.engine?.promoted===true;let visible=requestedCode?services.filter(s=>String(s.service_code||'')===requestedCode):services.filter(isPromoted); /* 27 nov 2026 (Dennis): overzicht toont alleen arrangementen die bij het aantal gasten passen (1 gast: 1-persoonskamer, 2+: 2-persoonskamer) */ if(!requestedCode)visible=visible.filter(s=>kindFor(s)!=='arrangement'||(pax>=Number(s.min_party_size||1)&&(!s.max_party_size||pax<=Number(s.max_party_size))));const requestedFound=!requestedCode||services.some(s=>String(s.service_code||'')===requestedCode);if(!requestedCode){const restaurants=visible.filter(s=>kindFor(s)==='restaurant');const primaryRestaurant=restaurants.find(s=>String(s.service_code)===(day===2||day===3?'4cSbXnj':'CewjJvV'))||restaurants[0];visible=visible.filter(s=>kindFor(s)!=='restaurant');if(primaryRestaurant)visible.unshift(primaryRestaurant);visible.sort((a,b)=>{const ka=kindFor(a)==='restaurant'?-1000:Number(a.engine?.order??999);const kb=kindFor(b)==='restaurant'?-1000:Number(b.engine?.order??999);return ka-kb})}const esc=x=>String(x??'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]));const euro=c=>c==null?'':new Intl.NumberFormat('nl-NL',{style:'currency',currency:'EUR'}).format(Number(c)/100);function priceInfo(s){const r=s.engine||{};const nums=v=>{if(Array.isArray(v))return v.flatMap(nums);if(v&&typeof v==='object')return Object.values(v).flatMap(nums);const n=Number(v);return Number.isFinite(n)&&n>0?[n]:[]};const currentCandidates=[s.price_cents,r.price_cents].flatMap(nums);const cur=currentCandidates.length?Math.min(...currentCandidates):null;const regularCandidates=[r.original_price_cents].flatMap(nums).filter(x=>!cur||x>cur);return {now:cur,was:regularCandidates.length?Math.max(...regularCandidates):null}}function futureTimes(ts){return (ts||[]).filter(t=>date!==today||t>nowTime)}function serviceTimes(s,kind){if(kind==='restaurant'&&liveRestaurantTimes!==null)return futureTimes(liveRestaurantTimes);if(kind==='restaurant'||kind==='rondleiding'||kind==='proeverij'){const av=avMap[kind]||{};const live=futureTimes(Array.isArray(av.vrijeTijden)?av.vrijeTijden:[]);if(live.length)return live}const r=s.engine||{};const vals=[];for(const v of [r.start_time]){if(typeof v==='string'&&/^\d{2}:\d{2}/.test(v))vals.push(v.slice(0,5))}if(Array.isArray(r.times))for(const t of r.times){if(typeof t==='string'&&/^\d{2}:\d{2}/.test(t))vals.push(t.slice(0,5))}/* 4 nov 2026 (Dennis): rondleidingservices met een tijdvenster (groepsrondleiding 10:00-17:30) tonen elk half uur binnen dat venster. */const enT=(typeof r.end_time==='string'&&/^\d{2}:\d{2}/.test(r.end_time))?r.end_time.slice(0,5):'';if(vals[0]&&enT&&enT>vals[0]&&r.half_hour_window===true){let [h,m]=vals[0].split(':').map(Number);const [eh,em]=enT.split(':').map(Number);while(h*60+m<=eh*60+em){vals.push(String(h).padStart(2,'0')+':'+String(m).padStart(2,'0'));m+=30;if(m>=60){h++;m-=60}}}return futureTimes([...new Set(vals)].sort())}const proposals=visible.map(s=>{const kind=kindFor(s),times=serviceTimes(s,kind),pr=priceInfo(s);const av=avMap[kind]||{};const scan=scanMap[kind]||{};const known=['restaurant','rondleiding','proeverij'].includes(kind);const eligible=dateEligible(s);const available=known?(['BESCHIKBAAR','VANDAAG_INLOOP','VRIJ'].includes(av.status)&&times.length>0):eligible;const firstDate=known&&!available&&Array.isArray(scan.vrijeDatums)?scan.vrijeDatums.find(d=>d>date)||scan.vrijeDatums[0]||'':'';const idx=firstDate&&Array.isArray(scan.vrijeDatums)?scan.vrijeDatums.indexOf(firstDate):-1;const firstDateText=idx>=0&&Array.isArray(scan.vrijeDatumsTekst)?scan.vrijeDatumsTekst[idx]:firstDate;const fullTimes=kind==='rondleiding'?futureTimes(Array.isArray(av.wachtlijst)?av.wachtlijst:[]):[];return{kind,code:s.service_code,title:s.title,sub:s.description,image:s.image,price:pr.now,was:pr.was,pp:s.price_per_person,times,fullTimes,available,firstDate,firstDateText,status:known?(av.status||''):'ENGINE',order:s.engine?.order??999}});const allTimes=[...new Set(proposals.filter(x=>x.available).flatMap(x=>x.times))].sort();if(chosen&&!allTimes.includes(chosen))chosen='';if(!chosen&&allTimes.length)chosen=allTimes[0];const badge=s=>s.price==null?'':s.was?`<div class="price sale"><span class="was">van ${euro(s.was)}</span><span class="now">voor ${euro(s.price)}${s.pp?' p.p.':''}</span></div>`:`<div class="price"><span class="now">${euro(s.price)}${s.pp?' p.p.':''}</span></div>`;const cards=proposals.map(s=>{const reserve=s.available?`<a class="book" href="#">Bekijk & reserveer</a>`:'';const next=!s.available?`<button type="button" class="nextdate"${s.firstDate?` data-date="${esc(s.firstDate)}"`:''}>${s.firstDate?`Wel mogelijk: <strong>${esc(s.firstDateText)}</strong> →`:'Selecteer datum'}</button>`:'';return `<article class="card ${s.available?'':'unavailable'}" data-kind="${esc(s.kind)}" data-code="${esc(s.code)}" data-title="${esc(s.title)}" data-price="${s.price||0}" data-times="${s.times.join(',')}" data-full-times="${s.fullTimes.join(',')}"><div class="media">${s.image?`<img class="photo" src="${esc(s.image)}" alt="${esc(s.title)}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><div class="photo fallback" style="display:none"><span>BUS WHISKY</span></div>`:`<div class="photo fallback"><span>BUS WHISKY</span></div>`}${badge(s)}</div><div class="body"><h2>${esc(s.title)}</h2><p>${esc(s.sub)}</p>${reserve}${next}</div></article>`}).join('');const empty=requestedCode&&!requestedFound?'<div class="notnow">Dit arrangement bestaat niet of is niet meer beschikbaar.</div>':'<div class="notnow">Geen arrangementen gevonden.</div>';const heading=requestedCode?'Reserveer dit arrangement':'Ons aanbod';const html=`<!doctype html><html lang="nl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>BUS reserveren</title><style>*{box-sizing:border-box}body{margin:0;background:#02061b;color:#fff;font:16px -apple-system,BlinkMacSystemFont,"Segoe UI",Arial}.app{max-width:520px;margin:auto;padding:14px 16px 38px}.brand{text-align:center;font-size:18px;font-weight:700;padding:4px 0 16px}.filters{background:#0d142b;border:1px solid #202a47;border-radius:7px;overflow:hidden}.filter{min-height:58px;display:grid;grid-template-columns:34px 1fr 26px;align-items:center;padding:0 14px;border-bottom:1px solid #28314b}.filter:last-child{border:0}.ico{font-size:21px;color:#d6d9e3}.filter select,.filter input{width:100%;border:0;background:transparent;color:#fff;font:inherit;font-size:19px;outline:none;min-height:46px}.filter select option{color:#111}.arr{font-size:22px;color:#d9dce5}.divider{display:flex;align-items:center;gap:12px;color:#d5d7df;margin:20px 0 14px}.divider:before,.divider:after{content:'';height:1px;background:#30374e;flex:1}.card{background:#fff;color:#151515;border-radius:8px;overflow:hidden;margin-bottom:14px}.card.unavailable{opacity:.92}.media{position:relative}.photo{display:block;width:100%;height:155px;object-fit:cover}.fallback{display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#8a673f,#26201b);min-height:155px}.fallback span{font:700 20px Georgia;color:#fff;letter-spacing:.1em}.price{position:absolute;right:10px;bottom:10px;background:#07102d;color:#fff;border-radius:8px;padding:7px 10px;box-shadow:0 3px 12px #0004;display:flex;align-items:baseline;gap:7px}.price .was{font-size:13px;color:#ffb3b3;text-decoration-line:line-through;text-decoration-color:#e00000;text-decoration-thickness:3px;opacity:1}.price .now{font-size:16px;font-weight:800;white-space:nowrap}.body{padding:11px 13px 13px}.body h2{font-size:19px;line-height:1.15;margin:0 0 5px;text-align:center}.body p{color:#555;line-height:1.25;margin:0 0 9px;text-align:center;font-size:14px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.book,.nextdate{display:block;width:100%;border:0;text-align:center;text-decoration:none;background:#07102d;color:#fff;border-radius:6px;padding:11px;font:inherit;font-weight:700;cursor:pointer}.nextdate{background:#eef0f4;color:#07102d;margin-bottom:8px}.notnow{background:#f1f2f4;color:#555;padding:12px;border-radius:6px;text-align:center;font-size:13px}.note{text-align:center;color:#9fa6ba;font-size:12px;margin-top:10px}</style></head><body><main class="app"><div class="brand">Bus Whisky</div><form class="filters"><label class="filter"><span class="ico">♙</span><select id="pax">${Array.from({length:25},(_,i)=>i+1).map(n=>`<option value="${n}"${n===pax?' selected':''}>${n} ${n===1?'gast':'gasten'}</option>`).join('')}</select><span class="arr">⌄</span></label><label class="filter"><span class="ico">▣</span><input id="date" type="date" min="${today}" value="${esc(date)}"><span class="arr">⌄</span></label><label class="filter"><span class="ico">◷</span><select id="time">${allTimes.length?allTimes.map(t=>`<option value="${esc(t)}"${t===chosen?' selected':''}>${esc(t)}</option>`).join(''):'<option value="">Tijdstip volgt bij reserveren</option>'}</select><span class="arr">⌄</span></label></form><div class="divider">${heading}</div><section id="cards">${cards||empty}</section></main><script>const pax=document.getElementById('pax'),date=document.getElementById('date'),time=document.getElementById('time');function goDate(d){const u=new URL(location.href);u.searchParams.set('pax',pax.value);u.searchParams.set('date',d);u.searchParams.delete('time');location.href=u}function reload(){goDate(date.value)}pax.addEventListener('change',reload);date.addEventListener('change',reload);time.addEventListener('change',()=>{const u=new URL(location.href);time.value?u.searchParams.set('time',time.value):u.searchParams.delete('time');history.replaceState({},'',u)});document.querySelectorAll('.nextdate[data-date]').forEach(b=>b.addEventListener('click',()=>goDate(b.dataset.date)));</script></body></html>`;return [{json:{html}}];
  };
  S["k1"] = async function ($input, $, DateTime, $vars, $getWorkflowStaticData) {
// 19 nov 2026 (BUS Engine fase 4, snelheid): de 49 losse nabewerkingsnodes na 'Bouw preview' zijn samengevoegd tot deze
// ene node (elke losse node kostte ~20 ms opstarttijd). Volgorde en code zijn ongewijzigd; elk blok krijgt de uitvoer
// van het vorige blok als $input. Naam bewust gelijk aan de laatste oude node: Toon preview en HTML-cache opslaan lezen hem.
const __norm=a=>(Array.isArray(a)?a:[a]).filter(x=>x!=null).map(x=>(x&&typeof x==='object'&&'json' in x)?x:{json:x});
const __mk=items=>({first:()=>items[0],last:()=>items[items.length-1],all:()=>items,item:items[0]});
let __items=__norm($input.all());
const __self=this;
// ===== Price-off labels herstellen =====
__items=__norm(await (async function($input){
const j=$input.first().json||{};let h=String(j.html||'');let services=[];try{services=$('BUS Engine services').first().json.experiences||[]}catch(e){};const cur=s=>Number(s.price_cents||s.engine?.price_cents||0)||0;const byCode=Object.fromEntries(services.map(s=>[String(s.service_code||''),s]));const campaignWas={Ltnx4j2:17950,'5qXESKN':18950,RJxp2qM:19950,BgwoU5b:19950,UXR9vGC:19950};const old=(s,code)=>{const r=s.engine||{},c=cur(s);const vals=[r.original_price_cents,campaignWas[code]].map(Number).filter(v=>Number.isFinite(v)&&v>c);return vals.length?Math.max(...vals):0};const euro=c=>new Intl.NumberFormat('nl-NL',{style:'currency',currency:'EUR'}).format(c/100);h=h.replace(/<article class="card ([^"]*)" data-kind="([^"]*)" data-code="([^"]*)" data-title="([^"]*)" data-price="([0-9.]+)"([^>]*)>([\s\S]*?)<\/article>/g,(all,cls,kind,code,titleEsc,pRaw,rest,inside)=>{const c=Number(pRaw)||0,w=old(byCode[code]||{},code);let body=inside;if(!c)return all;const pp=inside.includes(' p.p.</span>')?' p.p.':'';const badge=w>c?`<div class="price sale"><span class="was">van ${euro(w)}</span><span class="now">voor ${euro(c)}${pp}</span></div>`:`<div class="price"><span class="now">${euro(c)}${pp}</span></div>`;body=body.replace(/<div class="price(?: sale)?">[\s\S]*?<\/div>/,badge);return `<article class="card ${cls}" data-kind="${kind}" data-code="${code}" data-title="${titleEsc}" data-price="${pRaw}"${rest}>${body}</article>`});return [{json:{...j,html:h}}];
}).call(__self,__mk(__items)));
// ===== Schuine prijsstreep herstellen =====
__items=__norm(await (async function($input){
const j = $input.first().json || {};
let h = String(j.html || '');
const css = '<style>.price .was{position:relative!important;text-decoration:none!important;color:#ffb3b3!important;display:inline-block!important}.price .was:after{content:"";position:absolute;left:-3%;right:-3%;top:50%;height:2px;background:#e00000;transform:rotate(-16deg);transform-origin:center;pointer-events:none}</style>';
h = h.replace('</head>', css + '</head>');
return [{ json: { ...j, html: h } }];
}).call(__self,__mk(__items)));
// ===== Fix UX en boekformulier =====
__items=__norm(await (async function($input){
const j=$input.first().json||{};let h=String(j.html||'');
const gift=`<section class="gift-buy" id="giftBuy"><div class="gift-card"><div class="gift-bus-logo"><span class="gift-logo-main">BUS WHISKY</span><span class="gift-logo-sub">GRAIN TO GLASS · TOP OF ITS CLASS</span></div><div class="gift-title">Cadeaubon <strong id="giftCardAmount"></strong></div><div class="gift-ribbon gift-ribbon-v"></div><div class="gift-ribbon gift-ribbon-h"></div><div class="gift-bow">◆</div><div class="gift-code">**** &nbsp; ****</div><div class="gift-expiry">2 jaar geldig na aankoop</div></div><form id="giftForm"><section class="gift-step active" data-step="1"><h2>Selecteer bedrag</h2><div class="gift-amounts"><button type="button" data-v="25">€ 25</button><button type="button" data-v="50">€ 50</button><button type="button" data-v="75">€ 75</button><button type="button" data-v="100">€ 100</button><button type="button" data-v="150">€ 150</button><button type="button" data-v="250">€ 250</button></div><label class="gift-custom">Ander bedrag<input name="amount" type="number" min="10" max="500" placeholder="€"></label><button class="gift-next" type="button">Doorgaan</button></section><section class="gift-step" data-step="2"><h2>Personaliseer</h2><label class="switch-row"><input type="checkbox" name="send_other"><span class="switch"></span><b>Stuur de cadeaubon naar iemand anders</b></label><div class="recipient-fields" hidden><input name="recipient_name" placeholder="Volledige naam"><input name="recipient_email" type="email" placeholder="E-mailadres"><textarea name="personal_message" placeholder="Persoonlijk bericht"></textarea><label class="switch-row"><input type="checkbox" name="send_later"><span class="switch"></span><b>Later verzenden?</b></label><div class="later-fields" hidden><p>De cadeaubon wordt verzonden op de door jou opgegeven datum, bijvoorbeeld voor een verjaardag of een andere gelegenheid.</p><div class="date-time"><input name="delivery_date" type="date"><input name="delivery_time" type="time"></div></div></div><div class="gift-nav"><button type="button" class="gift-back">‹ Terug</button><button class="gift-next" type="button">Doorgaan</button></div></section><section class="gift-step" data-step="3"><div class="gift-total">Totaal: <strong id="giftTotal">€ 0</strong></div><h2>Vul je contactgegevens in:</h2><input name="buyer_first_name" placeholder="Voornaam" required><input name="buyer_last_name" placeholder="Achternaam" required><input name="buyer_email" type="email" placeholder="E-mailadres" required><input name="buyer_phone" type="tel" placeholder="Telefoonnummer"><label class="gift-news"><input type="checkbox" name="newsletter" checked> Ik wil nieuwsbrieven ontvangen</label><div class="gift-nav"><button type="button" class="gift-back">‹ Terug</button><button class="gift-pay" type="submit">Verder naar betaling</button></div><div class="gift-msg" hidden></div></section></form></section>`;
if(!h.includes('id="giftBuy"')) h=h.replace('</main>',gift+'</main>');
h=h.replace('</head>',`<style>body{background:#f7f4ee!important;color:#1d1d1b!important}.brand{color:#1d1d1b!important}.filters{background:#fff!important;border-color:#d8d1c7!important}.filter{border-bottom-color:#d8d1c7!important}.filter select,.filter input{color:#1d1d1b!important}.ico,.arr{color:#8a673f!important}.divider{color:#625d56!important}.divider:before,.divider:after{background:#d8d1c7!important}.price,.book{background:#1d1d1b!important;color:#fff!important}.gift-buy{margin:26px 0;background:#fff;color:#1d1d1b;border:1px solid #d8d1c7;border-radius:10px;padding:18px;overflow:hidden}.gift-card{position:relative;aspect-ratio:1.65/1;border:2px solid #eee;border-radius:20px;background:linear-gradient(145deg,#fff,#f5f5f3);box-shadow:0 8px 18px #0002;overflow:hidden;margin:0 0 22px}.gift-bus-logo{position:absolute;left:5%;top:17%;width:34%;z-index:2;display:flex;flex-direction:column;color:#111;line-height:1}.gift-logo-main{font:900 clamp(18px,4.2vw,31px)/1 Arial,Helvetica,sans-serif;letter-spacing:-1.4px;white-space:nowrap}.gift-logo-sub{font:700 clamp(5px,1vw,7px)/1.25 Arial,Helvetica,sans-serif;letter-spacing:.1px;margin-top:4px;white-space:nowrap}.gift-title{position:absolute;right:6%;top:9%;font-size:clamp(22px,7vw,38px)}.gift-title strong{display:block;text-align:right;font-size:1.05em}.gift-ribbon{position:absolute;background:#d51f2b}.gift-ribbon-v{width:4%;height:100%;left:49%;top:0}.gift-ribbon-h{height:6%;width:100%;left:0;top:48%}.gift-bow{position:absolute;left:43%;top:42%;font-size:46px;color:#b91624;z-index:2}.gift-code{position:absolute;left:34%;bottom:19%;font:700 20px monospace;letter-spacing:4px}.gift-expiry{position:absolute;left:28%;bottom:10%;font:12px monospace;letter-spacing:1px}.gift-step{display:none}.gift-step.active{display:block}.gift-step h2{text-align:center;font-size:22px;margin:12px 0 20px}.gift-amounts{display:grid;grid-template-columns:repeat(3,1fr);gap:9px}.gift-amounts button{border:1px solid #ddd;background:#fff;border-radius:7px;padding:13px 4px;font-size:16px}.gift-amounts button.selected{background:#1d1d1b;color:#fff;border-color:#1d1d1b}.gift-custom{display:block;margin:14px 0 0;font-size:13px;color:#666}.gift-buy input,.gift-buy textarea{width:100%;padding:13px;margin:6px 0;border:1px solid #ddd;border-radius:7px;font:inherit}.gift-buy textarea{min-height:90px}.gift-next,.gift-pay{width:100%;border:0;border-radius:7px;background:#1d1d1b;color:#fff;padding:14px;font:inherit;font-weight:800;margin-top:18px}.gift-nav{display:grid;grid-template-columns:auto 1fr;gap:8px;align-items:end}.gift-back{border:0;background:transparent;text-decoration:underline;padding:14px 8px;color:#555;font:inherit}.switch-row{display:flex;align-items:center;gap:10px;margin:14px 0;cursor:pointer}.switch-row input{display:none}.switch{width:42px;height:24px;border-radius:20px;background:#e4e4e4;position:relative;flex:none}.switch:after{content:"";position:absolute;width:20px;height:20px;left:2px;top:2px;border-radius:50%;background:#fff;box-shadow:0 1px 3px #0003}.switch-row input:checked+.switch{background:#1d1d1b}.switch-row input:checked+.switch:after{left:20px}.recipient-fields,.later-fields{margin-top:8px}.date-time{display:grid;grid-template-columns:1fr 1fr;gap:8px}.gift-total{text-align:center;border-top:1px dashed #ddd;border-bottom:1px dashed #ddd;padding:14px;font-size:20px;margin:4px 0 18px}.gift-news{display:flex;gap:8px;align-items:center;margin:8px 0;font-size:14px}.gift-news input{width:auto}.gift-msg{margin-top:10px;padding:10px}.gift-msg.err{background:#f5e6e3;color:#7a2020}@media(max-width:390px){.gift-amounts{grid-template-columns:repeat(3,1fr)}.gift-code{font-size:16px}.gift-expiry{font-size:10px}}</style></head>`);
const s=`<script>(function(){var f=document.getElementById('giftForm');if(!f)return;var step=1,amount=0;function euro(v){return new Intl.NumberFormat('nl-NL',{style:'currency',currency:'EUR',maximumFractionDigits:0}).format(v)}function show(n){step=n;f.querySelectorAll('.gift-step').forEach(x=>x.classList.toggle('active',Number(x.dataset.step)===n));document.getElementById('giftTotal').textContent=euro(amount);document.getElementById('giftCardAmount').textContent=amount?euro(amount):'';if(window.BUSBookingWidget&&window.BUSBookingWidget.resize)setTimeout(window.BUSBookingWidget.resize,0)}function setAmount(v){amount=Number(v)||0;f.elements.amount.value=amount||'';f.querySelectorAll('.gift-amounts button').forEach(b=>b.classList.toggle('selected',Number(b.dataset.v)===amount));document.getElementById('giftCardAmount').textContent=amount?euro(amount):''}f.querySelectorAll('.gift-amounts button').forEach(b=>b.onclick=()=>setAmount(b.dataset.v));f.elements.amount.oninput=()=>setAmount(f.elements.amount.value);var so=f.elements.send_other,sl=f.elements.send_later,rf=f.querySelector('.recipient-fields'),lf=f.querySelector('.later-fields');so.onchange=function(){rf.hidden=!so.checked;if(!so.checked){sl.checked=false;lf.hidden=true}};sl.onchange=function(){lf.hidden=!sl.checked};f.querySelectorAll('.gift-next').forEach(b=>b.onclick=function(){if(step===1){if(amount<10||amount>500){alert('Kies een bedrag van €10 t/m €500.');return}show(2);return}if(step===2&&so.checked){if(!f.elements.recipient_name.value.trim()||!/^\\S+@\\S+\\.\\S+$/.test(f.elements.recipient_email.value)){alert('Vul naam en e-mailadres van de ontvanger in.');return}}show(3)});f.querySelectorAll('.gift-back').forEach(b=>b.onclick=()=>show(Math.max(1,step-1)));f.onsubmit=async function(e){e.preventDefault();var q=f.querySelector('.gift-pay'),m=f.querySelector('.gift-msg');if(!f.reportValidity())return;q.disabled=true;q.textContent='Betaallink maken…';var delivery='';if(so.checked&&sl.checked)delivery=f.elements.delivery_date.value+'T'+f.elements.delivery_time.value;try{var r=await fetch(location.origin+'/webhook/bus-booking-widget-preview/giftcard',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({amount:amount,buyer_email:f.elements.buyer_email.value,buyer_first_name:f.elements.buyer_first_name.value,buyer_last_name:f.elements.buyer_last_name.value,buyer_phone:f.elements.buyer_phone.value,newsletter:f.elements.newsletter.checked,recipient_name:so.checked?f.elements.recipient_name.value:'',recipient_email:so.checked?f.elements.recipient_email.value:f.elements.buyer_email.value,personal_message:so.checked?f.elements.personal_message.value:'',delivery_at:delivery})});var o=await r.json();if(r.ok&&o.checkoutUrl){location.href=o.checkoutUrl;return}m.hidden=false;m.className='gift-msg err';m.textContent=o.error||'Betaling kon niet worden gestart.'}catch(x){m.hidden=false;m.className='gift-msg err';m.textContent='Betaling kon niet worden gestart.'}q.disabled=false;q.textContent='Verder naar betaling'};show(1)})();</script>`;h=h.replace('</body>',s+'</body>');return [{json:{html:h}}];
}).call(__self,__mk(__items)));
// ===== Officieel BUS logo cadeaubon =====
__items=__norm(await (async function($input){
const j=$input.first().json||{};let h=String(j.html||'');const logo='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAXkAAAEgAQAAAAB5+T6vAAAI+UlEQVR42u1bT4gcWRn/vVc10+XYTtcG2W0xZErJycPa4B+CJEx5iycjLri3DPEgwgqzF9nVJPuiC+5BcUART9rrWSSCBw/uWhMXnIOaZg8i4mLFHdhBonmd6TU1nar3eaj/1a96XiE5uJm6TE9X/973933v933VzQidrhscHa/3ImDKahd/LIz+fwTYzTesuPJPsnK8BPvxdeu4K0AGfkeVgi3TwAEA1Ffe94dOEuI5TndTyUrcuAOAHohY7HUATKxZjy745oDX+xdpTqE54BRCdQMdAKFgK/e7eEkFh7f223KD6pfsESk5GDwQm0QUs8ZtErpIzx/85RkIK7ZNVbKHa/HKxlvXO0R6Es/CM98xB4w3nz7Eq983B2xf/fBdyGeN0zu4zPG53oR3CRwO9vF+Y8AbI2Dw7ogLHYA1mMD0qYj4dfaa9fmpcGWyogyYgLoOwH8igDBV6UaAWHhiesl8x40ZRAjX0K2xdQXzaTgavPCKmQQLo6354V5LCdIZjRnw8+GQTAEPNi9gtINYX2A1gMEteLaHVZqYeimIDgjq7VXjDXS79w3Pf/WL541zaQeXr+KXAfqGAHoG4S/gBudMJfxJIJDYGt81BfwK+Anu3/Z/pAxT46sxfeTK9Mpg/vXvmkk4BeWLtQ+88fsfGqoUAc8joLO37xoC7GHcH3H+0s010zj8Dbh5KFRAhkbLJ985jcHuz2AZSnAsD6fDLT4zTg3LfpNjZP/ZFODinxDAwYo5E7jzhf0+gi91OHbDa/B2hnPjwI0ho7cO9Itp3mTPn6dVzI6UaaR7P3gWX0OAFdMigKsfVC4E6KbpjhMu+i9iA3vGhSzeByDfNnYrXTwjMHhh3RTAFEOA0flXAJAJgLNbn/XhP/k7AMxIpd+y3QDi24YEKwbWrmHCKPyWb5p8H/sMOXzmwzf1Uu8hfoN7AgKxGcCJ8br4lzAkWBYRvaNgrUcxUbRIsLQp7Kgt7M6vduBLn/oxnpoyI4ADAHgzxhNnz2rX44upBySzu4C8D0Sm9AchJEZd2L1nO3puogd8AkOMZWAGyBL6aMewf0hzSwKXnwMgbUMbxgAmXVqa56LBbmgG4BBpMETqX0MJDnCpEvjjAavAtnHDkblfVF4vA7Dm4fII2uOqZ4QBoP4Zz0CCXMir5QC/sw1RKUZp4P+7l7y4WmfFI5DgVphexMynDq6xBIfKcEv+KEYtdsUzoW0kIdC8WgLglXQVjgGAVdd2jVSSy5JVAxBF9inNdtAA/HhprrdM6UQvPeNNJHgqIwSIjPY0XAIICoBkRhIcCKgNpa+sLX0ckhAAAm4EsBFiNbXcNgLwPHKkqd06AMtPZ6XdRRo1RVxQLTOAr/IC5ZnS0DwJfTOAl30w1HIBbYeSRsxnpk1T6lcy7h/s1K/KeOrAMQeAmTZuWu4tKHXSyDT5Uoo7bjlbaPEKMSAi7S09DXURAQmYaWrAwRyYwXxGtgoSmOinFFoASy12zQlWgIME2DIHeJjP0IWGDkGXWpykB9hAkBUCM4CViunAKoWWyCwBbLWcV62AIfQzimWsst8JwERL99B6sG+1mdAGON1DN4A17AhomfTj5BHhCeAEcAKovE605GJaL+P8iNnAHQc3fOwnAsDUxh0/YcQwdRIGuPsghoQlTID54EDiF8OJ8WJRIiQ1XXhlgiGqnW5+zdPjJWYVG2YF1YsAOKrZy47z05jgg2cjpfRPXBRK1uhXIs5KCVTwVFUZD5ZFVlYPP1629VFbOxZlY51QLQSOlnV1onRWsKy9Z6l+TkZbOKxccWn9GmKhKxLrYWaKn0lQLA+UvZrrVY2H6+Y9oIwzlYSGCJS2eU6pNa8ZHTotBEallMgrjNbYGjWbPwEgihb3Q9C6D/yMF+mHkZGupXDLOEiDnSaAWC6q5OfL2Rq7Aad5Q9tB9xQBLB+w8RY+1rjiok/jS6ceNVfYCFvLTCwbno5qTsyc70VZdiq0NepeeyFz6rxGAuAUNJJvri2Hsr4AB6ecomqdKiqPtIQPcCS8aEwyYGBXrUhEphcrpefpuq+ZiPiNR7yVquGkixXtMfPKZYLazmKF58aLEywPST5OEbmEsszKvFCEVaRfHfRUSiUrAurUAxJWU7lSKhEUFZJqNFxWa2fFaIwyWVGDhkfVD1eDup6u7NdJ7naxg7wUxKLcaUxbAtbr4weOSnc0ypUT8ACS5TJ2kbK86sR+4UrRnB8VZaNWKnmREkFjCrlWS41KYILWrSGqix5fl9zlg5DFalvK5stKabmdveO63QW86Mxmwm4AoVNpV9euUra7fLls+tPW6baq5B/HyNzjK7gX1SS4bSODShFZLMaQS5QpvunGtSM6d7kNAgDBz/e+00iiiNcBnAAoBSBSOotDiSqx41D34Tl0FfDms+p4Jr8OxoskYTMCQGE2nopAkpECyV4MAtBToBjpl9IEPy5QQhtpG2BwS02cluOrqHy89j7TpAnPRRXlnhdUxW5uJrcpYRVMwE7P7oWcLHI3KO84gA8HTDvxcVKtWHWpbcDDCAh0+2AVTGgGgzEj3dNoIqJgoBsMWioNkObalCd93OMJOGJdLh+8R12u4CQOjw9AYTJT0QQAHmY9hIQHyLA4BVT6oJoU7gP8oYs/PuxjPMeN/3gbApj6pxK5e20YJJOJfwB/AuDdjdeOXO+bzr30GY79sg0AjMnvfXkOKxzgHADEEfnhsDgBXLKx/1PGWYi/WucA4AxPC/R2PxkPRAQW5gcZrDBmIaxza02jZf0AUyULYOnNNL3L8nzhGH7FUkArqUw0XzzhAIrvdAaar+6MisN0CEQpIOvf/pHsfBQAJvvAVLgAHgBKAEDiReQB+FAK+LiosslEsFq7UWjSB4bpbCbj6GeyJwhbLjAQsnqeWmHq5NVG05H6vHxQzsW4Yooq3NpKExzslR6Bk81mFn9OUbZMAcW19nisbWxL1RnOs1pDdM8HJw//biaFtRUBMvvxQCSyTs8GPg1wOPikAKYvuXdKW/aOBKYvX8TffcRHAUCeR25GDYnosFI8j4iIaIOIiDaz95Li7pQEew/8tuy/VBTX+Qg8YC8AAAAASUVORK5CYII=';h=h.replace(/<div class="gift-bus-logo">[\s\S]*?<\/div><div class="gift-title">/,'<div class="gift-bus-logo"><img src="'+logo+'" alt="BUS Whisky"></div><div class="gift-title">');h=h.replace('</head>','<style>.gift-bus-logo{left:6%!important;top:14%!important;width:22%!important;height:auto!important}.gift-bus-logo img{display:block!important;width:100%!important;height:auto!important;max-height:118px!important;object-fit:contain!important;object-position:left top!important}.gift-logo-main,.gift-logo-sub{display:none!important}@media(max-width:600px){.gift-bus-logo{width:21%!important;top:13%!important}}</style></head>');return [{json:{...j,html:h}}];
}).call(__self,__mk(__items)));
// ===== iPhone booking hardening =====
__items=__norm(await (async function($input){
const j=$input.first().json||{};let h=String(j.html||'');
let scan={};try{scan=$('Eerstvolgende rondleiding').first().json||{}}catch(e){}const days=Array.isArray(scan.dagStatussen)?scan.dagStatussen:[];
let av={};try{av=$('Guestplan rondleiding').first().json||{}}catch(e){};
const all=Array.isArray(av.alleTijden)?av.alleTijden:[];
const timeOptions=all.map(x=>{const t=String(x.time||''),s=String(x.status||'').toUpperCase(),ok=s==='AVAILABLE';return '<option value="'+t+'"'+(ok?'':' disabled')+'>'+t+(ok?'':' — '+(s==='WAITLIST'?'VOLGEBOEKT':'VOLGEBOEKT'))+'</option>'}).join('');
if(timeOptions)h=h.replace(/<select id="time">[\s\S]*?<\/select>/,'<select id="time">'+timeOptions+'</select>');
h=h.replace(/<span class="arr">⌄<\/span>/g,'<span class="arr arr-empty"></span>');
const data=JSON.stringify(days).replace(/</g,'\\u003c');
h=h.replace(/<label class="filter"><span class="ico">▣<\/span><input id="date"([^>]*)><span class="arr arr-empty"><\/span><\/label>/,m=>'<div class="filter date-filter" id="dateTrigger"><span class="ico">▣</span>'+m.match(/<input id="date"[^>]*>/)[0]+'<span class="date-cal-ico">▣</span></div><div id="busCal" class="bus-cal" hidden></div>');
h=h.replace('</head>',`<style>
.arr-empty{display:block!important;width:1px!important;overflow:hidden!important;color:transparent!important}.filter{grid-template-columns:34px 1fr 26px!important}.date-filter{cursor:pointer}.date-filter #date{pointer-events:none!important;cursor:pointer!important}.date-cal-ico{font-size:18px;text-align:right;color:#111}.bus-cal{background:#fff;color:#1d1d1b;border-top:1px solid #d8d1c7;padding:12px 14px}.cal-head{display:grid;grid-template-columns:36px 1fr 36px;align-items:center;margin-bottom:8px}.cal-head button{border:0;background:transparent;font-size:24px;cursor:pointer}.cal-title{text-align:center;font-weight:800}.cal-week,.cal-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:4px}.cal-week span{text-align:center;font-size:11px;color:#777;padding:4px}.cal-day{border:0;border-radius:50%;aspect-ratio:1;background:#eee;color:#777;font:inherit;cursor:default}.cal-day.open{background:#218739;color:#fff;cursor:pointer}.cal-day.full,.cal-day.waitlist,.cal-day.closed{background:#c93b32;color:#fff;cursor:pointer}.cal-day.unknown{background:#eee;color:#999}.cal-day.selected{outline:3px solid #111;outline-offset:1px}.cal-empty{visibility:hidden}.time-full{color:#111}.time-full option:disabled{color:#111;background:#fff}.card.unavailable .nextdate{display:block!important;background:#218739!important;color:#fff!important;border:1px solid #218739!important}.book.soldout{display:none!important}#date.date-open{color:#167b2d!important;font-weight:700}#date.date-full{color:#111!important;font-weight:700}.booking-form textarea[name="notes"]::placeholder{font-style:normal}.booking-form input[name="giftCards"]::placeholder{font-style:italic}
</style></head>`);
const cal=`<script>(function(){const DAYS=${data};const map=Object.fromEntries(DAYS.map(x=>[x.date,x]));const input=document.getElementById('date'),tr=document.getElementById('dateTrigger'),box=document.getElementById('busCal');if(!input||!tr||!box)return;let view=new Date((input.value||new Date().toISOString().slice(0,10))+'T12:00:00');const names=['ma','di','wo','do','vr','za','zo'],months=['januari','februari','maart','april','mei','juni','juli','augustus','september','oktober','november','december'];function iso(y,m,d){return y+'-'+String(m+1).padStart(2,'0')+'-'+String(d).padStart(2,'0')}function render(){const y=view.getFullYear(),m=view.getMonth(),first=new Date(y,m,1),last=new Date(y,m+1,0).getDate(),off=(first.getDay()+6)%7;let z='<div class="cal-head"><button type="button" id="calPrev">‹</button><div class="cal-title">'+months[m]+' '+y+'</div><button type="button" id="calNext">›</button></div><div class="cal-week">'+names.map(n=>'<span>'+n+'</span>').join('')+'</div><div class="cal-grid">';for(let i=0;i<off;i++)z+='<button class="cal-day cal-empty"></button>';for(let d=1;d<=last;d++){const k=iso(y,m,d),o=map[k],state=o?o.state:'unknown';z+='<button type="button" class="cal-day '+state+(k===input.value?' selected':'')+'" data-date="'+k+'">'+d+'</button>'}z+='</div>';box.innerHTML=z;box.querySelector('#calPrev').onclick=()=>{view=new Date(y,m-1,1);render()};box.querySelector('#calNext').onclick=()=>{view=new Date(y,m+1,1);render()};box.querySelectorAll('.cal-day[data-date]').forEach(b=>b.onclick=()=>{const k=b.dataset.date;if(!map[k])return;const u=new URL(location.href);u.searchParams.set('pax',document.getElementById('pax').value);u.searchParams.set('date',k);u.searchParams.delete('time');location.href=u})}tr.onclick=function(e){e.preventDefault();box.hidden=!box.hidden;if(!box.hidden)render()};render()})();</script>`;h=h.replace('</body>',cal+'</body>');
const isFull=/<article class="card unavailable"/.test(h);h=h.replace('</body>',`<script>(function(){var d=document.getElementById('date');if(d)d.classList.add('${isFull?'date-full':'date-open'}');})();</script></body>`);
const p=`<script>(function(){const K='busBookingProfileV2',S='busBookingSpecificV2';function load(f){try{const a=JSON.parse(localStorage.getItem(K)||'{}'),c=JSON.parse(sessionStorage.getItem(S)||'{}');['firstName','lastName','email','phone'].forEach(k=>{if(a[k]&&f.elements[k])f.elements[k].value=a[k]});['notes','giftCards','discountCode'].forEach(k=>{if(c[k]&&f.elements[k])f.elements[k].value=c[k]})}catch(e){}}function save(f){try{const a={},c={};['firstName','lastName','email','phone'].forEach(k=>a[k]=f.elements[k]?.value||'');['notes','giftCards','discountCode'].forEach(k=>c[k]=f.elements[k]?.value||'');localStorage.setItem(K,JSON.stringify(a));sessionStorage.setItem(S,JSON.stringify(c))}catch(e){}}document.querySelectorAll('.card').forEach(function(r){let b=r.querySelector('.book:not(.soldout)');if(!b||r.classList.contains('unavailable'))return;const n=document.createElement('button');n.type='button';n.className='book';n.textContent='Reserveren';b.replaceWith(n);const f=document.createElement('form');f.className='booking-form';f.style.display='none';f.innerHTML='<div class="name-row"><input name="firstName" placeholder="Voornaam" required><input name="lastName" placeholder="Achternaam"></div><input name="email" type="email" placeholder="E-mailadres" required><input name="phone" type="tel" placeholder="Telefoonnummer" required><textarea name="notes" placeholder="Opmerkingen of dieetwensen"></textarea><div class="credit-box"><label>Waardebon</label><input name="giftCards" autocomplete="off" placeholder="Meer dan 1 waardebon? Gebruik ; of ,"><button type="button" class="discount-toggle">Ik heb een kortingscode</button><div class="discount-wrap"><input name="discountCode" autocomplete="off" placeholder="Kortingscode (optioneel)"></div></div><button class="book" type="submit">Reserveer</button><div class="booking-msg" hidden></div>';r.querySelector('.body').appendChild(f);load(f);n.onclick=()=>{f.style.display='block';n.style.display='none'};f.addEventListener('input',()=>save(f));f.onsubmit=async function(e){e.preventDefault();save(f);const sel=document.getElementById('time'),tm=sel?.value||'';const q=f.querySelector('button[type=submit]'),m=f.querySelector('.booking-msg');q.disabled=true;const body={service_code:r.dataset.code||'',camper_guest:(new URLSearchParams(location.search).get('camper')==='1'&&['42SA1mn','79BAxWL'].includes(r.dataset.code)),service_title:r.dataset.title||'',booking_kind:r.dataset.kind||'arrangement',date:document.getElementById('date').value,time:tm,pax:Number(document.getElementById('pax').value),unit_price_cents:Number(r.dataset.price||0),firstName:f.elements.firstName.value,lastName:f.elements.lastName.value,email:f.elements.email.value,phone:f.elements.phone.value,notes:f.elements.notes.value,voucher_code:f.elements.giftCards.value,discount_code:f.elements.discountCode.value,upsell_kind:f.elements.busUpsell?.checked?(f.dataset.busUpsellKind||''):'',upsell_time:f.elements.busUpsell?.checked?(f.dataset.busUpsellTime||''):'',source:'pilot_widget',meta:(function(){try{var c=document.cookie,g=function(k){var m=c.match(new RegExp('(?:^|; )'+k+'=([^;]*)'));return m?decodeURIComponent(m[1]):''};var pu='';try{pu=window.top.location.href}catch(e){pu=document.referrer||location.href}var fbc=g('_fbc');if(!fbc){var fm=(pu.match(/[?&]fbclid=([^&#]+)/)||[])[1];if(fm)fbc='fb.1.'+Date.now()+'.'+fm}return {fbp:g('_fbp'),fbc:fbc,url:pu,ua:navigator.userAgent}}catch(e){return {}}})()};try{var tw=window.top;if(tw&&typeof tw.fbq==='function')tw.fbq('track','InitiateCheckout',{currency:'EUR',content_ids:[body.service_code],num_items:body.pax})}catch(e){}try{const x=await fetch(location.origin+'/webhook/bus-checkout/start',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}),o=await x.json();if(o.status==='PAYMENT_REQUIRED'&&o.checkoutUrl){location.href=o.checkoutUrl;return}if(o.status==='READY_TO_BOOK'&&o.checkout_id){const z=await fetch(location.origin+'/webhook/bus-checkout/finalize',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({checkout_id:o.checkout_id})}),zo=await z.json();m.hidden=false;m.textContent=(zo.status==='BOOKED'||zo.ok===true)?'Reservering gelukt.':(zo.message||'Reserveren lukt nu niet.');return}m.hidden=false;m.textContent=o.message||'Checkout kon niet worden gestart.'}catch(e){m.hidden=false;m.textContent='Reserveren lukt nu niet.'}q.disabled=false}})})();</script>`;h=h.replace('</body>',p+'</body>');return [{json:{html:h}}];
}).call(__self,__mk(__items)));
// ===== BUS Upsell restaurant vinkje =====
__items=__norm(await (async function($input){
const j=$input.first().json||{};let h=String(j.html||'');
const css="<style id=\"bw-upsell-style\">.bw-upsell{display:none!important;background:#f5f0e7;border:1px solid #d6c4a6;border-radius:8px;padding:12px;margin:12px 0;color:#151515!important;line-height:1.4}.bw-upsell.on{display:block!important}.bw-upsell{box-sizing:border-box!important;max-width:100%!important;min-width:0!important;overflow:hidden}.bw-upsell-check{display:grid!important;grid-template-columns:20px minmax(0,1fr)!important;gap:10px!important;align-items:start!important;width:100%!important;max-width:100%!important;font-weight:600;cursor:pointer;box-sizing:border-box!important}.bw-upsell .bw-upsell-check input[type=checkbox]{display:block!important;box-sizing:border-box!important;appearance:auto!important;-webkit-appearance:checkbox!important;accent-color:#07102d!important;width:20px!important;min-width:20px!important;max-width:20px!important;height:20px!important;min-height:20px!important;margin:1px 0 0!important;padding:0!important;flex:none!important;position:static!important;transform:none!important}.bw-upsell .bw-upsell-title{display:block!important;min-width:0!important;width:auto!important;white-space:normal!important;overflow-wrap:break-word!important;line-height:1.4!important}.bw-upsell-detail{display:block;margin:8px 0 0 30px;color:#555;font-size:13px;white-space:normal}.bw-upsell-price{display:none!important;margin:10px 0 0;font-weight:600;font-size:14px;line-height:1.6}.bw-upsell.selected .bw-upsell-price{display:block!important}.bw-upsell.unavailable-offer .bw-upsell-check{display:block!important;cursor:default!important;color:#615d54!important;font-weight:500!important}.bw-upsell.unavailable-offer .bw-upsell-check input[type=checkbox]{display:none!important}.bw-upsell.unavailable-offer .bw-upsell-detail{display:none!important}.bw-upsell-price span{float:right}.bw-upsell-price:after{content:\"\";display:block;clear:both}\n.bw-upsell.weekend>label.bw-upsell-check{display:none!important}\n.bw-upsell-alternatives{display:none!important}\n.bw-upsell.weekend .bw-upsell-alternatives{display:block!important}\n.bw-upsell .bw-upsell-alternatives .bw-upsell-check{margin:6px 0!important;padding:5px 0!important}\n.bw-upsell .bw-upsell-alternatives input[type=checkbox]{appearance:auto!important;-webkit-appearance:checkbox!important;width:20px!important;max-width:20px!important;min-width:20px!important;height:20px!important;min-height:20px!important;margin:1px 0 0!important;padding:0!important}\n.bw-upsell .bw-upsell-alternatives input:disabled+span{color:#716d67!important;font-weight:400!important}\n.bw-upsell-caption{margin:0 0 8px!important;font-size:14px!important;font-weight:650!important}\n</style>";
const script="<script id=\"bw-upsell-script\">(function(){\nconst API='https://buswhiskyevents.app.n8n.cloud/webhook/bus-upsell-availability';\nlet seq=0;\n// 9 nov 2026 executiebudget: pas na interactie en alleen voor een zichtbaar formulier, antwoord 5 min in sessionStorage.\nconst MEM={};\nasync function haal(url){const k='bwUp:'+url;const nu=Date.now();try{const c=MEM[k]||JSON.parse(sessionStorage.getItem(k)||'null');if(c&&nu-c.t<300000)return c.a;}catch(e){}\n const resp=await fetch(url,{cache:'no-store'});const a=resp.ok?await resp.json():null;if(a){const c={t:nu,a};MEM[k]=c;try{sessionStorage.setItem(k,JSON.stringify(c))}catch(e){}}return a;}\nfunction zichtbaar(r){const f=r.querySelector('form.booking-form');return !!(f&&f.offsetParent!==null&&f.getClientRects().length);}\nlet actief=false;\nfunction euros(c){return new Intl.NumberFormat('nl-NL',{style:'currency',currency:'EUR'}).format(c/100)}\nfunction pick(r){\n const code=r.dataset.code||'',t=document.getElementById('time')?.value||'';\n if(code==='42SA1mn'&&t==='16:00')return {kind:'rondleiding',time:t};\n if(code==='79BAxWL'&&t==='14:30')return {kind:'rondleiding',time:t};\n if(r.dataset.kind==='restaurant'&&code==='CewjJvV'&&t>='17:30'&&t<='20:00')return {kind:'restaurant',time:t};\n return null;\n}\nfunction ensure(r){\n const f=r.querySelector('form.booking-form');if(!f)return null;\n let el=f.querySelector('.bw-upsell');if(el)return el;\n el=document.createElement('div');el.className='bw-upsell';\n el.innerHTML=\"<label class=\\\"bw-upsell-check\\\"><input type=\\\"checkbox\\\" name=\\\"busUpsell\\\"><span class=\\\"bw-upsell-title\\\"></span></label><div class=\\\"bw-upsell-alternatives\\\"><p class=\\\"bw-upsell-caption\\\">Wil je ook een tafel reserveren? Kies maximaal één optie:</p><label class=\\\"bw-upsell-check\\\"><input type=\\\"checkbox\\\" name=\\\"bwUpsellLunch\\\" data-time=\\\"12:30\\\"><span data-label=\\\"12:30\\\">Lunch om 12.30 uur, vóór de rondleiding</span></label><label class=\\\"bw-upsell-check\\\"><input type=\\\"checkbox\\\" name=\\\"bwUpsellDinner\\\" data-time=\\\"16:00\\\"><span data-label=\\\"16:00\\\">Vroeg diner om 16.00 uur, na de rondleiding</span></label></div><small class=\\\"bw-upsell-detail\\\">Tafelreservering gratis. Geen menukeuze of aanbetaling; eten en drinken betaal je ter plaatse.</small><div class=\\\"bw-upsell-price\\\"></div>\";\n const sub=f.querySelector('button[type=\"submit\"]');sub?.before(el);\n el.querySelector('input[name=\"busUpsell\"]').addEventListener('change',(ev)=>{el.classList.toggle('selected',!!ev.target.checked)});\n for(const option of el.querySelectorAll('.bw-upsell-alternatives input[type=\"checkbox\"]')){\n   option.addEventListener('change',()=>{\n     const choices=el.querySelectorAll('.bw-upsell-alternatives input[type=\"checkbox\"]');\n     if(option.checked)for(const other of choices)if(other!==option)other.checked=false;\n     const picked=el.querySelector('.bw-upsell-alternatives input:checked');\n     const main=el.querySelector('input[name=\"busUpsell\"]');\n     main.checked=!!picked;\n     f.dataset.busUpsellTime=picked?String(picked.dataset.time):'';\n     f.dataset.busUpsellKind=picked?'table':'';\n     el.classList.toggle('selected',!!picked);\n   });\n }\n return el;\n}\nasync function sync(){\n const id=++seq, date=document.getElementById('date')?.value||'',pax=Number(document.getElementById('pax')?.value||0);\n for(const r of document.querySelectorAll('#cards .card')){\n   const el=ensure(r);if(!el)continue;\n   const cb=el.querySelector('input[name=\"busUpsell\"]');cb.checked=false;cb.disabled=false;el.classList.remove('on','selected','unavailable-offer','weekend');\n   for(const alt of el.querySelectorAll('.bw-upsell-alternatives input')){alt.checked=false;alt.disabled=true;}\n   const form=r.querySelector('form.booking-form');form.dataset.busUpsellTime='';form.dataset.busUpsellKind='';\n   const selected=pick(r);\n   if(!selected){if(r.dataset.code==='CewjJvV'&&date&&pax){el.classList.add('on','unavailable-offer');cb.disabled=true;el.querySelector('.bw-upsell-title').textContent='Ook een rondleiding om 16:00 uur vóór het diner? Kies een dinertijd vanaf 17:30 uur.';el.querySelector('.bw-upsell-price').textContent='';}continue;}\n   if(!date||!pax||r.classList.contains('unavailable')||!actief||!zichtbaar(r))continue;\n   const url=API+'?'+new URLSearchParams({date,pax:String(pax),kind:selected.kind,time:selected.time}).toString();\n   try{\n     const a=await haal(url);\n     if(id!==seq)return;\n     if(r.dataset.code==='79BAxWL'&&selected.time==='14:30'){\n       el.classList.add('on','weekend');\n       const options=(a&&a.ok===true&&Array.isArray(a.options))?a.options:[];\n       const choices=[{time:'12:30',name:'bwUpsellLunch',text:'Lunch om 12.30 uur, vóór de rondleiding'},{time:'16:00',name:'bwUpsellDinner',text:'Vroeg diner om 16.00 uur, na de rondleiding'}];\n       for(const x of choices){\n         const input=el.querySelector('input[name=\"'+x.name+'\"]');\n         const data=options.find(o=>o&&o.time===x.time);\n         input.disabled=!(data&&data.available===true);\n         input.nextElementSibling.textContent=x.text+(input.disabled?' — niet beschikbaar':'');\n       }\n       el.querySelector('.bw-upsell-detail').textContent='Kies eventueel één extra tafel. De reservering is gratis; eten en drinken betaal je ter plaatse.';\n       el.querySelector('.bw-upsell-price').innerHTML='Rondleiding '+pax+' × '+euros(Number(r.dataset.price||0))+' <span>'+euros(pax*Number(r.dataset.price||0))+'</span><br>Extra tafel voor '+pax+' personen <span>'+euros(0)+'</span><br>Nu te betalen <span>'+euros(pax*Number(r.dataset.price||0))+'</span>';\n       continue;\n     }\n     if(!a||a.ok!==true||a.offer!==true||!['lunch_table','dinner_table','tour'].includes(a.kind)||!Number.isInteger(a.price_cents)){\n      cb.disabled=true;el.classList.add('on','unavailable-offer');\n      const msg=selected.kind==='restaurant'?'De rondleiding om 16:00 uur is op deze datum niet beschikbaar. Je kunt het diner wel reserveren.':selected.time==='14:30'?'Voor deze rondleiding is online geen vrije lunchtafel om 12:30 uur gevonden.':'Voor deze rondleiding is online geen vrije dinertafel om 17:30 uur gevonden.';\n      el.querySelector('.bw-upsell-title').textContent=msg;el.querySelector('.bw-upsell-price').textContent='';continue;\n     }\n     const target=String(a.time||'');if(!/^\\d{2}:\\d{2}$/.test(target))continue;\n     r.querySelector('form.booking-form').dataset.busUpsellTime=target;r.querySelector('form.booking-form').dataset.busUpsellKind=a.kind==='tour'?'tour':'table';\n     el.querySelector('.bw-upsell-title').textContent=a.kind==='lunch_table'?'Ja, ik wil vóór de rondleiding om '+target+' uur een tafeltje voor lunch reserveren':a.kind==='dinner_table'?'Ja, ik wil na de rondleiding om '+target+' uur een tafeltje voor diner reserveren':'Ja, ik wil vóór het diner om '+target+' uur een rondleiding reserveren ('+euros(a.price_cents)+' p.p.)';\n     el.querySelector('.bw-upsell-price').innerHTML=a.kind==='tour'?'Rondleiding '+pax+' × '+euros(a.price_cents)+' <span>'+euros(pax*a.price_cents)+'</span><br>Restauranttafel <span>'+euros(0)+'</span><br>Nu te betalen <span>'+euros(pax*a.price_cents)+'</span>':'Rondleiding '+pax+' × '+euros(Number(r.dataset.price||0))+' <span>'+euros(pax*Number(r.dataset.price||0))+'</span><br>Extra tafel voor '+pax+' personen <span>'+euros(0)+'</span><br>Nu te betalen <span>'+euros(pax*Number(r.dataset.price||0))+'</span>'; el.querySelector('.bw-upsell-detail').textContent=a.kind==='tour'?'De rondleiding betaal je bij het reserveren vooruit. Voor het restaurant betaal je geen aanbetaling; eten en drinken reken je ter plaatse af.':'Tafelreservering gratis. Geen menukeuze of aanbetaling; eten en drinken betaal je ter plaatse.';\n     el.classList.add('on');\n   }catch(e){}\n }\n}\n// Check programmatic time/date updates as well as user changes; only fetch on changed selection.\nlet lastKey='';\nfunction check(){const d=document.getElementById('date'),t=document.getElementById('time'),p=document.getElementById('pax');\n const key=[d?.value||'',t?.value||'',p?.value||'',...Array.from(document.querySelectorAll('#cards .card')).map(r=>(r.dataset.code||'')+':'+(r.classList.contains('unavailable')?'0':'1')+(zichtbaar(r)?'v':'h'))].join('|')+(actief?'|a':'');\n if(key!==lastKey){lastKey=key;sync();}\n}\nfor(const ev of ['pointerdown','keydown','focusin','touchstart'])document.addEventListener(ev,()=>{if(!actief){actief=true;check();}},true);\nfor(const el of [document.getElementById('time'),document.getElementById('pax'),document.getElementById('date')])if(el){el.addEventListener('change',check,true);el.addEventListener('input',check,true);}\nconst timeEl=document.getElementById('time');if(timeEl)new MutationObserver(check).observe(timeEl,{childList:true,subtree:true,attributes:true});\ncheck();\nsetInterval(check,500);\n})();</script>";
h=h.replace('</head>',css+'</head>');h=h.replace('</body>',script+'</body>');return [{json:{...j,html:h}}];
}).call(__self,__mk(__items)));
// ===== Bedankpagina na nulbetaling =====
__items=__norm(await (async function($input){
// 1 nov 2026 (Dennis): een boeking die volledig met cadeaubon of korting is betaald gaat niet via Mollie. Die gast kreeg alleen
// 'Reservering gelukt.' in de widget. Nu gaat hij net als een betalende gast naar de eigen bedankpagina /bedankt?bw_co=<checkout_id>
// (bus-chat-core.js), met zijn voorpretcode voor de webshop. Mislukt het boeken, dan blijft de melding in de widget staan.
const j = $input.first().json || {}; let h = String(j.html || '');
const A = "m.hidden=false;m.textContent=(zo.status==='BOOKED'||zo.ok===true)?'Reservering gelukt.':(zo.message||'Reserveren lukt nu niet.');return}";
const B = "if(zo.status==='BOOKED'||zo.ok===true){var bu='https://buswhisky.com/bedankt?bw_co='+encodeURIComponent(o.checkout_id);try{window.top.location.assign(bu)}catch(e){location.assign(bu)}return}m.hidden=false;m.textContent=zo.message||'Reserveren lukt nu niet.';return}";
if (h.split(A).length === 2) h = h.replace(A, () => B);
return [{ json: { ...j, html: h } }];

}).call(__self,__mk(__items)));
// ===== Kalender status corrigeren =====
__items=__norm(await (async function($input){
const j=$input.first().json||{};let h=String(j.html||'');let q={};try{q=$('GET BUS Booking Widget').first().json.query||{}}catch(e){}const requestedCode=String(q.arrangement||q.service_code||q.service||'').trim();const TODAY=DateTime.now().setZone('Europe/Amsterdam').toFormat('yyyy-MM-dd');let services=[];try{services=$('BUS Engine services').first().json.experiences||[]}catch(e){};const svc=requestedCode?(services.find(s=>String(s.service_code||'')===requestedCode)||{}):{};
if(requestedCode&&svc.service_code){const r=svc.engine||{};const vals=[];for(const v of [r.start_time]){if(typeof v==='string'&&/^\d{2}:\d{2}/.test(v))vals.push(v.slice(0,5))}if(Array.isArray(r.times))for(const t of r.times){if(typeof t==='string'&&/^\d{2}:\d{2}/.test(t))vals.push(t.slice(0,5))}let own=[...new Set(vals)].sort();
// Directe restaurantlinks: gebruik uitsluitend live beschikbaarheid uit de kaart, niet de 12:00-metadata.
if(['CewjJvV','4cSbXnj'].includes(requestedCode)){
 const card=h.match(/<article\b[^>]*\bdata-code="(?:CewjJvV|4cSbXnj)"[^>]*\bdata-times="([^"]*)"/i);
 own=card?card[1].split(',').map(x=>x.trim()).filter(x=>/^\d{2}:\d{2}$/.test(x)):[];
}
const restaurantTime=['CewjJvV','4cSbXnj'].includes(requestedCode);
const requestedTime=/^\d{2}:\d{2}$/.test(String(q.time||''))?String(q.time):'';
const selected=restaurantTime?(own.includes(requestedTime)?requestedTime:''):(own.includes(requestedTime)?requestedTime:own[0]||'');
const hint=requestedTime&&!own.includes(requestedTime)?requestedTime+' is vol of niet beschikbaar — kies een ander tijdstip':'Kies een tijdstip';
const opts=own.length?(restaurantTime?'<option value=""'+(!selected?' selected':'')+'>'+hint+'</option>':'')+own.map(t=>'<option value="'+t+'"'+(t===selected?' selected':'')+'>'+t+'</option>').join(''):'<option value="">Geen vrije tijdstippen</option>';
h=h.replace(/<select id="time">[\s\S]*?<\/select>/,'<select id="time">'+opts+'</select>')}
h=h.replace(/<article class="card ([^"]*)"([^>]*)data-times="([^"]*)"([^>]*)>([\s\S]*?)<\/article>/g,(all,cls,a,times,b,inside)=>{const isUnavailable=/(^|\s)unavailable(\s|$)/.test(cls);const first=String(times||'').split(',').map(x=>x.trim()).filter(Boolean)[0]||'';const label=!isUnavailable&&first?`Beschikbaar vanaf ${first}`:'Reserveer voor later';let body=inside;body=body.replace(/<div class="media">/,`<div class="media"><span class="availability-tag">${label}</span>`);return `<article class="card ${cls}"${a}data-times="${times}"${b}>${body}</article>`});h=h.replace(/Wel mogelijk:\s*/gi,'');const general=!requestedCode;const base='.book,.nextdate,.card.unavailable .nextdate,.gift-next,.gift-pay{background:#1d1d1b!important;color:#fff!important;border-color:#1d1d1b!important}.price.sale{display:flex!important;flex-direction:column!important;align-items:flex-end!important;gap:1px!important}.price.sale .was{display:block!important;visibility:visible!important;opacity:1!important}.price.sale .now{display:block!important;visibility:visible!important}.media{position:relative!important}.availability-tag{position:absolute!important;right:8px!important;bottom:8px!important;z-index:5!important;background:#07102d!important;color:#fff!important;border-radius:4px!important;padding:5px 8px!important;font-size:12px!important;font-weight:700!important;line-height:1.1!important;white-space:nowrap!important}.media .price{z-index:4!important;bottom:34px!important}.card.unavailable .nextdate{display:block!important;background:#f7f7f8!important;color:#1d1d1b!important;border:1px solid #e1e1e5!important;padding:13px!important;margin:8px 0 0!important;border-radius:5px!important;font-weight:800!important}.card[data-code]{cursor:pointer}.card.detail-open{cursor:default}.card.detail-open .body p{display:block!important;-webkit-line-clamp:unset!important;overflow:visible!important;white-space:pre-line!important;text-align:left!important;font-size:15px!important;line-height:1.45!important;margin:12px 8px 18px!important}.booking-form,.booking-form input,.booking-form textarea,.booking-form button{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif!important}.booking-form input,.booking-form textarea{font-size:13px!important;font-weight:400!important;line-height:1.4!important}.booking-form textarea[name="notes"]::placeholder{font-style:normal}.booking-form input[name="giftCards"]::placeholder{font-style:italic}';h=h.replace('</head>',`<style>${base}.cal-day{position:relative!important;border:0!important;border-radius:0!important;background:transparent!important;aspect-ratio:1!important;line-height:1!important}.cal-day.past{color:#aaa!important;cursor:default!important;pointer-events:none!important}.cal-day.selected{outline:2px solid #111!important;outline-offset:-3px!important;border-radius:50%!important}${general?'.cal-day{color:#111!important;font-size:24px!important;cursor:pointer!important}':'.cal-day{color:#aaa!important;font-size:18px!important;cursor:default!important}.cal-day.open{color:#111!important;font-size:24px!important;cursor:pointer!important}'}</style></head>`);
const wd=Array.isArray(svc.week_days)?svc.week_days:[],start=String(svc.local_start_date||''),end=String(svc.local_end_date||''),blackouts=Array.isArray(svc.engine?.blackouts)?svc.engine.blackouts:[];h=h.replace('</body>',`<script>(function(){var TODAY=${JSON.stringify(TODAY)},general=${JSON.stringify(general)},code=${JSON.stringify(requestedCode)},wd=${JSON.stringify(wd)},start=${JSON.stringify(start)},end=${JSON.stringify(end)},black=${JSON.stringify(blackouts)};function eligible(k){if(k<TODAY)return false;if(general)return true;if(start&&k<start)return false;if(end&&k>end)return false;var d=new Date(k+'T12:00:00'),x=d.getDay(),iso=x===0?7:x;if(wd.length&&!wd.includes(iso))return false;for(var i=0;i<black.length;i++){var b=black[i]||{},a=b.start_date||'',z=b.end_date||'';if(a&&z&&k>=a&&k<=z)return false}return true}function apply(){document.querySelectorAll('.cal-day[data-date]').forEach(function(b){var yes=eligible(b.dataset.date);b.classList.toggle('past',b.dataset.date<TODAY);b.classList.toggle('open',yes);b.disabled=!yes;b.style.pointerEvents=yes?'auto':'none'})}var box=document.getElementById('busCal');if(box){new MutationObserver(apply).observe(box,{childList:true,subtree:true});apply();box.addEventListener('click',function(e){var b=e.target.closest('.cal-day[data-date]');if(!b||!eligible(b.dataset.date))return;e.preventDefault();e.stopImmediatePropagation();var u=new URL(location.href);u.searchParams.set('pax',document.getElementById('pax').value);if(code)u.searchParams.set('arrangement',code);u.searchParams.set('date',b.dataset.date);u.searchParams.delete('time');u.searchParams.delete('choose_date');location.href=u},true)}})();</script></body>`);h=h.replace('</body>',`<script>(function(){document.querySelectorAll('.card.unavailable').forEach(function(card){var b=card.querySelector('.nextdate');if(!b)return;b.textContent='Selecteer datum';b.removeAttribute('data-date');b.onclick=function(e){e.preventDefault();e.stopImmediatePropagation();var u=new URL(location.href);u.searchParams.set('pax',document.getElementById('pax').value);u.searchParams.set('arrangement',card.dataset.code||'');u.searchParams.delete('date');u.searchParams.delete('time');u.searchParams.set('choose_date','1');location.href=u}});if(new URL(location.href).searchParams.get('choose_date')==='1'){setTimeout(function(){var box=document.getElementById('busCal'),tr=document.getElementById('dateTrigger');if(box&&tr&&box.hidden)tr.click()},20)}})();</script></body>`);if(general){h=h.replace('</body>',`<script>(function(){document.querySelectorAll('.card[data-code]').forEach(function(card){card.setAttribute('role','link');card.setAttribute('tabindex','0');function openDetail(){var u=new URL(location.href);u.searchParams.set('pax',document.getElementById('pax').value);u.searchParams.set('arrangement',card.dataset.code||'');u.searchParams.delete('time');u.searchParams.delete('choose_date');location.href=u}card.addEventListener('click',function(e){if(e.target.closest('button,a,input,select,textarea,form'))return;openDetail()});card.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();openDetail()}})})})();</script></body>`)}else h=h.replace('</body>',`<script>document.querySelectorAll('.card[data-code]').forEach(function(c){c.classList.add('detail-open')})</script></body>`);return [{json:{...j,html:h}}];
}).call(__self,__mk(__items)));
// ===== Arrangement opmaak herstellen =====
__items=__norm(await (async function($input){
const j=$input.first().json||{};
let h=String(j.html||'');
let q={}; try{q=$('GET BUS Booking Widget').first().json.query||{}}catch(e){}
const code=String(q.arrangement||q.service_code||q.service||'').trim();
if(!code) return [{json:{...j,html:h}}];
let services=[]; try{services=$('BUS Engine services').first().json.experiences||[]}catch(e){}
const svc=services.find(s=>String(s.service_code||'')===code);
if(!svc) return [{json:{...j,html:h}}];
let rich=String(svc.description_html||svc.engine?.description_html||'').trim();
if(!rich) return [{json:{...j,html:h}}];
// Opmaak uit de BUS Engine-catalogus behouden, maar uitsluitend presentatie-tags toelaten.
rich=rich.replace(/<\/?(?:script|style|iframe|object|embed|form|input|button|a)\b[^>]*>/gi,'');
rich=rich.replace(/<(\/)?([a-z0-9]+)(?:\s[^>]*)?>/gi,(m,slash,tag)=>{
  tag=tag.toLowerCase();
  return ['p','br','strong','b','em','i','ul','ol','li','h3','h4'].includes(tag)?'<'+(slash?'/':'')+tag+'>':'';
});
const articleRe=new RegExp('(<article class="card [^"]*"[^>]*data-code="'+code.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'"[^>]*>[\\s\\S]*?<div class="body">[\\s\\S]*?<h2>[\\s\\S]*?<\\/h2>)(<p>[\\s\\S]*?<\\/p>)([\\s\\S]*?<\\/div><\\/article>)');
h=h.replace(articleRe,(all,a,old,b)=>a+'<div class="arrangement-description">'+rich+'</div>'+b);
h=h.replace('</head>',`<style>
.card.detail-open .arrangement-description{color:#333;text-align:left;font-size:15px;line-height:1.5;margin:14px 8px 18px}
.card.detail-open .arrangement-description p{display:block!important;margin:0 0 14px!important;text-align:left!important;color:#333!important;font-size:15px!important;line-height:1.5!important;overflow:visible!important;-webkit-line-clamp:unset!important}
.card.detail-open .arrangement-description br{display:block;content:"";margin-top:7px}
.card.detail-open .arrangement-description ul,.card.detail-open .arrangement-description ol{margin:8px 0 16px 22px;padding:0}
.card.detail-open .arrangement-description li{margin:0 0 7px;padding-left:2px}
.card.detail-open .arrangement-description h3,.card.detail-open .arrangement-description h4{font-size:16px;margin:18px 0 8px;color:#1d1d1b}
.card.detail-open .arrangement-description strong,.card.detail-open .arrangement-description b{font-weight:700}
.card.detail-open .arrangement-description em,.card.detail-open .arrangement-description i{font-style:italic}
</style></head>`);
return [{json:{...j,html:h}}];
}).call(__self,__mk(__items)));
// ===== Kortingscode toggle repareren =====
__items=__norm(await (async function($input){
const j=$input.first().json||{};let h=String(j.html||'');
// De kortingscode-link werd wel gerenderd maar kreeg nergens een click-handler.
// Delegation werkt ook voor formulieren die later dynamisch in de kaart worden geplaatst.
const fix=`<script>(function(){document.addEventListener('click',function(e){var b=e.target.closest('.discount-toggle');if(!b)return;e.preventDefault();e.stopPropagation();var box=b.closest('.credit-box');if(!box)return;var wrap=box.querySelector('.discount-wrap');if(!wrap)return;var open=wrap.classList.toggle('open');b.setAttribute('aria-expanded',open?'true':'false');b.textContent=open?'Kortingscode verbergen':'Ik heb een kortingscode';if(open){var inp=wrap.querySelector('input[name="discountCode"]');if(inp)setTimeout(function(){inp.focus()},0)}});})();</script>`;
h=h.replace('</body>',fix+'</body>');
return [{json:{...j,html:h}}];
}).call(__self,__mk(__items)));
// ===== Cadeaubon modal launcher =====
__items=__norm(await (async function($input){
const j=$input.first().json||{};let h=String(j.html||'');
const css=`<style>.gift-modal-backdrop{position:fixed;inset:0;background:#0008;z-index:2147483640;display:none;align-items:center;justify-content:center;padding:18px}.gift-modal-backdrop.open{display:flex!important}.gift-modal{width:min(760px,98vw);max-height:94dvh;overflow:auto;background:#1d1d1b;border-radius:10px;padding:14px;box-shadow:0 10px 35px #0007}.gift-modal-head{height:42px;color:#fff;display:flex;align-items:center;justify-content:center;position:relative;font-weight:800}.gift-modal-close{position:absolute;right:0;top:-3px;border:0;background:transparent;color:#fff;font-size:27px;cursor:pointer}.gift-modal .gift-buy{display:block!important;margin:0!important;border-radius:5px!important;padding:20px!important}.gift-modal .gift-card{margin:2px auto 24px;max-width:680px}.gift-modal .gift-title{font-size:clamp(20px,5vw,36px)!important}.gift-modal .gift-expiry{left:26%!important}.gift-modal .gift-amounts{display:grid!important;grid-template-columns:repeat(6,minmax(0,1fr))!important;gap:8px!important}.gift-modal .gift-amounts button{padding:12px 2px!important;min-width:0!important}.gift-modal .gift-bus-logo{left:5%!important;top:18%!important;width:42%!important;line-height:1!important}.gift-modal .gift-logo-main{font-family:Arial,Helvetica,sans-serif!important;font-size:clamp(18px,4.2vw,30px)!important;font-weight:900!important;letter-spacing:-1.4px!important;white-space:nowrap!important}.gift-modal .gift-logo-sub{font-size:clamp(5px,1vw,7px)!important;font-weight:700!important;letter-spacing:.15px!important;white-space:nowrap!important}@media(max-width:620px){.gift-modal-backdrop{padding:8px}.gift-modal{width:100%;padding:9px}.gift-modal .gift-buy{padding:14px!important}.gift-modal .gift-amounts{grid-template-columns:repeat(6,minmax(0,1fr))!important;gap:4px!important}.gift-modal .gift-amounts button{font-size:13px!important;padding:11px 0!important}}</style>`;h=h.replace('</head>',css+'</head>');const modal=`<div class="gift-modal-backdrop" id="giftModalBackdrop" aria-hidden="true"><div class="gift-modal" role="dialog" aria-modal="true" aria-label="BUS Whisky cadeaubon"><div class="gift-modal-head">Bus Whisky<button type="button" class="gift-modal-close" aria-label="Sluiten">×</button></div><div id="giftModalMount"></div></div></div>`;h=h.replace('</body>',modal+'</body>');const js=`<script>(function(){var gift=document.getElementById('giftBuy'),bd=document.getElementById('giftModalBackdrop'),mount=document.getElementById('giftModalMount');if(!gift||!bd||!mount)return;var home=gift.parentNode,next=gift.nextSibling;function openGift(){document.documentElement.classList.remove('bus-launcher');var shell=document.getElementById('busLauncher');if(shell)shell.style.display='none';var app=document.querySelector('.app');if(app)app.style.display='none';mount.appendChild(gift);gift.style.display='block';bd.classList.add('open');bd.setAttribute('aria-hidden','false');document.documentElement.style.overflow='hidden';setTimeout(function(){var x=gift.querySelector('button,input');if(x)x.focus()},30)}function closeGift(){bd.classList.remove('open');bd.setAttribute('aria-hidden','true');document.documentElement.style.overflow='';if(next&&next.parentNode===home)home.insertBefore(gift,next);else home.appendChild(gift);var u=new URL(location.href);u.searchParams.delete('gift');u.searchParams.delete('giftcard');u.searchParams.delete('modal');u.searchParams.set('launcher','1');location.href=u.toString()}bd.querySelector('.gift-modal-close').onclick=closeGift;bd.addEventListener('click',function(e){if(e.target===bd)closeGift()});document.addEventListener('keydown',function(e){if(e.key==='Escape'&&bd.classList.contains('open'))closeGift()});var qs=new URLSearchParams(location.search);if(qs.get('giftcard')==='1'||qs.get('gift')==='1')setTimeout(openGift,40);window.BUSGiftcard={open:openGift,close:closeGift};})();</script>`;h=h.replace('</body>',js+'</body>');return [{json:{...j,html:h}}];
}).call(__self,__mk(__items)));
// ===== Popup bridge hardening =====
__items=__norm(await (async function($input){
const j=$input.first().json||{};let h=String(j.html||'');
h=h.replace('</head>',`<style>html.bus-modal,html.bus-modal body{background:#f7f4ee!important;min-height:100%;overflow-x:hidden}.bus-modal .app{max-width:760px!important;margin:0 auto!important;padding:18px 18px 40px!important}.bus-modal .brand{padding-top:0!important}.bus-modal-close{position:fixed;top:12px;right:12px;z-index:9999;width:42px;height:42px;border:0;border-radius:50%;background:#1d1d1b;color:#fff;font-size:27px;line-height:42px;text-align:center;cursor:pointer;box-shadow:0 3px 14px #0003}.bus-modal-close:focus{outline:3px solid #fff;outline-offset:2px}@media(max-width:767px){html.bus-modal,html.bus-modal body{width:100%;min-height:100dvh}.bus-modal .app{max-width:none!important;padding:12px 12px 32px!important}.bus-modal-close{top:8px;right:8px}}</style></head>`);
h=h.replace('<body>','<body><button type="button" class="bus-modal-close" id="busModalClose" aria-label="Sluiten" title="Sluiten" hidden>×</button>');
const bridge=`<script>(function(){var qs=new URLSearchParams(location.search);var embedded=qs.get('modal')==='1'||qs.get('embed')==='1'||window.self!==window.top;if(embedded)document.documentElement.classList.add('bus-modal');var close=document.getElementById('busModalClose');if(close)close.hidden=!embedded;function send(type,data){try{window.parent.postMessage(Object.assign({source:'bus-booking-widget',type:type},data||{}),'*')}catch(e){}}function height(){var d=document.documentElement,b=document.body;return Math.max(d.scrollHeight,b?b.scrollHeight:0)}var last=0;function resize(){var n=height();if(n!==last){last=n;send('BUS_BOOKING_RESIZE',{height:n})}}if(embedded){send('BUS_BOOKING_READY',{url:location.href});resize();if(window.ResizeObserver)new ResizeObserver(resize).observe(document.body);else setInterval(resize,400)}function requestClose(){send('BUS_BOOKING_CLOSE');if(window.self===window.top){var u=new URL(location.href);u.search='';location.href=u.toString();return}setTimeout(function(){try{if(window.parent&&window.parent.BUSBookingWidgetHost&&typeof window.parent.BUSBookingWidgetHost.close==='function')window.parent.BUSBookingWidgetHost.close()}catch(e){}},0)}if(close)close.addEventListener('click',requestClose);document.addEventListener('keydown',function(e){if(embedded&&e.key==='Escape'){e.preventDefault();requestClose()}});window.addEventListener('popstate',function(){send('BUS_BOOKING_STATE',{url:location.href})});window.BUSBookingWidget={close:requestClose,resize:resize,getState:function(){return {url:location.href,service:qs.get('service')||qs.get('service_code')||qs.get('arrangement')||''}}};})();</script>`;h=h.replace('</body>',bridge+'</body>');return [{json:{...j,html:h}}];
}).call(__self,__mk(__items)));
// ===== Ingevouwen launcher modus =====
__items=__norm(await (async function($input){
const j=$input.first().json||{};let h=String(j.html||'');
const css=`<style>html.bus-launcher,html.bus-launcher body{background:transparent!important;min-height:0!important}.bus-launcher body{overflow:hidden!important}.bus-launcher .app,.bus-launcher .bus-modal-close,.bus-launcher .gift-modal-backdrop{display:none!important}.bus-launcher-shell{display:none;position:fixed;right:18px;bottom:18px;z-index:2147483000;align-items:center;gap:10px;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif}.bus-launcher .bus-launcher-shell{display:flex}.bus-launcher-btn{height:50px;border:0;background:#1d1d1b;color:#fff;box-shadow:0 4px 14px #0003;cursor:pointer}.bus-launcher-book{border-radius:28px;padding:0 19px 0 14px;display:flex;align-items:center;gap:9px;font-weight:800;font-size:14px}.bus-launcher-gift{width:50px;border-radius:50%;display:grid;place-items:center}.bus-launcher-icon{width:25px;height:25px;display:grid;place-items:center;border:2px solid #fff;border-radius:50%;font-size:14px}.bus-launcher-gift svg{width:25px;height:25px;fill:none;stroke:#fff;stroke-width:1.8}@media(max-width:480px){.bus-launcher-shell{right:12px;bottom:12px;gap:8px}.bus-launcher-btn{height:48px}.bus-launcher-gift{width:48px}.bus-launcher-book{padding-right:16px}}</style>`;h=h.replace('</head>',css+'</head>');const shell=`<div class="bus-launcher-shell" id="busLauncher"><button type="button" class="bus-launcher-btn bus-launcher-book" id="busLauncherBook"><span class="bus-launcher-icon">▣</span><span>RESERVEREN</span></button><button type="button" class="bus-launcher-btn bus-launcher-gift" id="busLauncherGift" title="Cadeaubon"><svg viewBox="0 0 24 24"><path d="M4 10h16v10H4zM3 7h18v4H3zM12 7v13M7.5 7C5.5 7 5 4 7 4c2.2 0 5 3 5 3M16.5 7c2 0 2.5-3 .5-3-2.2 0-5 3-5 3"/></svg></button></div>`;h=h.replace('<body>','<body>'+shell);const js=`<script>(function(){var qs=new URLSearchParams(location.search);var direct=qs.get('modal')==='1'||qs.get('embed')==='1'||qs.get('gift')==='1'||qs.get('giftcard')==='1'||qs.has('service')||qs.has('service_code')||qs.has('arrangement')||qs.get('open')==='1';var launcher=qs.get('launcher')!=='0'&&!direct;if(!launcher)return;document.documentElement.classList.add('bus-launcher');function openBooking(){var u=new URL(location.href);u.searchParams.set('launcher','0');u.searchParams.set('modal','1');u.searchParams.delete('gift');u.searchParams.delete('giftcard');location.href=u.toString()}function openGift(){if(window.BUSGiftcard&&typeof window.BUSGiftcard.open==='function'){document.documentElement.classList.remove('bus-launcher');var app=document.querySelector('.app');if(app)app.style.display='none';window.BUSGiftcard.open();return}var u=new URL(location.href);u.searchParams.set('launcher','0');u.searchParams.set('modal','1');u.searchParams.set('gift','1');u.searchParams.delete('giftcard');location.href=u.toString()}var b=document.getElementById('busLauncherBook'),g=document.getElementById('busLauncherGift');if(b)b.onclick=openBooking;if(g)g.onclick=openGift;try{window.parent.postMessage({source:'bus-booking-widget',type:'BUS_BOOKING_LAUNCHER_READY',height:86},'*')}catch(e){}})();</script>`;h=h.replace('</body>',js+'</body>');return [{json:{...j,html:h}}];
}).call(__self,__mk(__items)));
// ===== Cadeaubon naamvelden 1 regel =====
__items=__norm(await (async function($input){
const j=$input.first().json||{};let h=String(j.html||'');h=h.split('> Ik wil nieuwsbrieven ontvangen</label>').join('> Ik wil nieuwsbrieven en aanbiedingen ontvangen</label>');h=h.replace('</head>',`<style>.gift-step[data-step="3"] input[name="buyer_first_name"],.gift-step[data-step="3"] input[name="buyer_last_name"]{width:calc(50% - 6px)!important;display:inline-block!important;vertical-align:top!important}.gift-step[data-step="3"] input[name="buyer_first_name"]{margin-right:8px!important}.gift-news input[type="checkbox"]{accent-color:#C9A227!important}</style></head>`);return [{json:{...j,html:h}}];
}).call(__self,__mk(__items)));
// ===== Cadeaubon logo exact centreren =====
__items=__norm(await (async function($input){
// Cadeaubon-artwork in de widget (30 okt 2026).
// Bron: afbeelding van Guestplan-service 68413 / N7XnBFA ("Cadeaubon dummy", active:false, niet boekbaar).
// De publieke services-API geeft inactieve services niet terug; daarom staat de CDN-URL van 68413 hier ook vast.
// Upload ging via hulptool 5DC1r49ORvgIX3Pt pad uploadImage; nieuw artwork = opnieuw uploaden, img op 68413 patchen en GIFT_ART_URL aanpassen.
// Het bestand is exact 2:1 (1184x592, bijgesneden via WordPress media/edit); de 2:1-box met object-fit:cover toont het onvervormd.
// Geen placeholder: laadt de afbeelding niet, dan verdwijnt het artworkblok helemaal (nooit broken-image, nooit bruine BUS WHISKY-tekst).
const GIFT_ART_URL = 'https://wordpress.buswhisky.com/wp-content/uploads/bus-cadeaubon-2x1-logo.jpeg';
const j = $input.first().json || {};
let html = String(j.html || '');
let services = [];
try { services = $('BUS Engine services').first().json.experiences || []; } catch (e) {}
// 22 nov 2026: artwork staat vast op eigen WordPress-media; geen Guestplan-dummyservice meer.
const art = GIFT_ART_URL;
const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const blok = '<div class="gift-card bus-gift-art" id="busGiftArt"><img class="bus-gift-art-img" src="' + esc(art) + '" alt="BUS Whisky cadeaubon" width="1184" height="592" decoding="async" fetchpriority="high" onerror="var c=this.parentNode;if(c)c.style.setProperty(\'display\',\'none\',\'important\')"><span id="giftCardAmount" hidden></span></div>';
const voor = html.length;
html = html.replace(/<div class="gift-card">[\s\S]*?<\/div><form id="giftForm">/, blok + '<form id="giftForm">');
const vervangen = html.length !== voor || html.indexOf('id="busGiftArt"') >= 0;
const css = '<style>'
  + '.gift-buy .bus-gift-art,.gift-modal .bus-gift-art{position:relative!important;display:block!important;width:100%!important;max-width:680px!important;height:auto!important;min-height:0!important;padding:0!important;aspect-ratio:2/1!important;margin:2px auto 22px!important;border:0!important;border-radius:18px!important;background:transparent!important;box-shadow:0 8px 18px rgba(0,0,0,.18)!important;overflow:hidden!important;isolation:isolate;-webkit-mask-image:-webkit-radial-gradient(white,black);transform:translateZ(0)}'
  + '.bus-gift-art::before,.bus-gift-art::after{content:none!important;display:none!important}'
  + '.bus-gift-art .bus-gift-art-img{position:absolute!important;left:0!important;top:0!important;width:100%!important;height:100%!important;max-width:none!important;min-height:0!important;margin:0!important;padding:0!important;border:0!important;border-radius:0!important;display:block!important;object-fit:cover!important;object-position:50% 50%!important}'
  + '@supports not (aspect-ratio:2/1){.gift-buy .bus-gift-art,.gift-modal .bus-gift-art{height:0!important;padding:0 0 50% 0!important;max-width:none!important}}'
  + '@media(max-width:620px){.gift-modal .bus-gift-art{max-width:100%!important;margin:2px auto 16px!important;border-radius:12px!important}}'
  + '</style>';
html = html.replace('</head>', css + '</head>');
return [{ json: { ...j, html, gift_art_source: 'bus_wordpress', gift_art_url: art, gift_art_ingevoegd: vervangen } }];
}).call(__self,__mk(__items)));
// ===== Voucher bedragen op één regel =====
__items=__norm(await (async function($input){
const j=$input.first().json||{};let h=String(j.html||'');h=h.replace('</head>','<style>.gift-amounts{display:grid!important;grid-template-columns:repeat(6,minmax(0,1fr))!important;gap:8px!important}.gift-amounts button{min-width:0!important;padding-left:2px!important;padding-right:2px!important}@media(max-width:560px){.gift-amounts{grid-template-columns:repeat(3,minmax(0,1fr))!important}}</style></head>');return [{json:{...j,html:h}}];
}).call(__self,__mk(__items)));
// ===== Niet automatisch openen =====
__items=__norm(await (async function($input){
const j=$input.first().json||{};let h=String(j.html||'');
// Rosegaar-host (buswhisky.com) opent het reserveringspaneel automatisch bij het eerste bezoek per sessie.
// Dennis 30 okt 2026: niet automatisch openen. Avond 30 okt: userActivation-uitzondering eruit (iPhone: elke tik op de pagina hield het paneel open); alleen klik op een open-knop, focus op het kruisje of boeklink-intent houdt het open. Dit script draait als eerste in de iframe (zelfde origin)
// en sluit het paneel meteen als het niet door een klik van de bezoeker is geopend.
// Een boeklink (BUSBoekLink) zet intent=1 en window.__busBoekIntent: dan nooit sluiten (30 okt 2026).
// 30 okt 2026: de boeklink-handler wordt hier OOK in de parent gezet. bus-chat.js (jsDelivr) kan tot 7 dagen
// gecachet zijn in browsers; deze iframe komt altijd vers van n8n. Guard __busBoekLinks voorkomt dubbel laden.
// 31 okt 2026: heeft de pagina een verouderde gecachete bus-chat.js (geen __busBuild of lager dan de huidige build), dan laadt de iframe de actuele kern (bus-chat-core.js) in de parent; alle blokken hebben een guard, dus alleen ontbrekende onderdelen (flesknop, eerste-tikfix) komen erbij.
// Oud: Draait de chat niet (kapotte gecachete bus-chat.js), dan laadt de iframe een vastgepinde, werkende versie (commit 709c6644, laatste versie van bus-chat.js op 30 okt 2026) en wist de wegklik-vlag bij het verlaten van de pagina,
// zodat op de volgende pagina de iframe weer laadt (en meteen sluit) en het vangnet opnieuw draait.
const BOEK="\n// === BOEKLINKS NAAR DE EIGEN BUS-WIDGET (30 okt 2026) ===\n// Vangt elke boeklink op de site op en opent ons eigen reserveringspaneel (#booking-widget, /reserveren/widget)\n// op het juiste arrangement. Ondersteunt permanent de oude Guestplan-ankers en het nieuwe formaat:\n//   #gstpln_openWidget?serviceCode=CODE[&partySize=N]   (oud, Guestplan)\n//   #gstpln_openGiftCardWidget                           (oud, Guestplan cadeaubon)\n//   #reserveren?arrangement=CODE[&pax=N]  of  #reserveren (nieuw, algemeen overzicht)\n//   #cadeaubon                                           (nieuw, cadeaubon)\n//   /pad?arrangement=CODE#reserveren                     (nieuw, van buiten de site)\n//   widget.guestplan.com/?...serviceCode=CODE            (oude directe Guestplan-link)\n// Werkt ook bij het laden van een pagina met zo'n hash of ?arrangement= in de URL.\n(function () {\n  if (window.__busBoekLinks) return;\n  window.__busBoekLinks = true;\n\n  function lees(href) {\n    if (!href) return null;\n    var u;\n    try { u = new URL(href, location.href); } catch (e) { return null; }\n    var hash = (u.hash || '').replace(/^#/, '');\n    var hq = new URLSearchParams(hash.indexOf('?') >= 0 ? hash.slice(hash.indexOf('?') + 1) : '');\n    var hnaam = hash.split('?')[0].toLowerCase();\n    var sq = u.searchParams;\n    var eigen = u.origin === location.origin;\n    if (/guestplan\\.com$/i.test(u.hostname)) {\n      if (sq.get('openGiftCardWidget')) return { soort: 'gift' };\n      var gc = sq.get('serviceCode');\n      return gc ? { soort: 'book', code: gc, pax: sq.get('partySize') } : { soort: 'book' };\n    }\n    if (hnaam === 'gstpln_opengiftcardwidget' || hnaam === 'cadeaubon') return eigen ? { soort: 'gift' } : null;\n    if (hnaam === 'gstpln_openwidget') return eigen ? { soort: 'book', code: hq.get('serviceCode') || hq.get('arrangement'), pax: hq.get('partySize') || hq.get('pax') } : null;\n    if (hnaam === 'reserveren') {\n      if (!eigen) return null;\n      return { soort: 'book', code: hq.get('arrangement') || sq.get('arrangement'), pax: hq.get('pax') || sq.get('pax') };\n    }\n    return null;\n  }\n\n  function open(d, poging) {\n    poging = poging || 0;\n    var host = document.getElementById('booking-widget');\n    var ifr = host && host.querySelector('iframe');\n    var knop = host && host.querySelector('[data-booking-widget-open=\"' + d.soort + '\"]');\n    var p = new URLSearchParams();\n    if (d.soort === 'gift') { p.set('gift', '1'); } else { if (d.code) p.set('arrangement', d.code); if (d.pax) p.set('pax', d.pax); }\n    p.set('launcher', '0'); p.set('modal', '1'); p.set('intent', '1');\n    var lang = (document.documentElement.lang || '').slice(0, 2).toLowerCase();\n    if (lang && lang !== 'nl') p.set('lang', lang);\n    var url = ((host && host.dataset.url) || '/reserveren/widget') + '?' + p.toString();\n    if (!host || !ifr || !knop) {\n      if (poging < 20) { setTimeout(function () { open(d, poging + 1); }, 250); return; }\n      location.href = url.replace('modal=1', 'modal=0');\n      return;\n    }\n    window.__busBoekIntent = Date.now();\n    if (!host.classList.contains('is-open')) knop.click();\n    if (!host.classList.contains('is-open') && poging < 20) { setTimeout(function () { open(d, poging + 1); }, 250); return; }\n    if ((ifr.getAttribute('src') || '') === url) return;\n    host.classList.remove('is-ready');\n    ifr.src = url;\n  }\n\n  window.BUSBoekLink = { open: open, lees: lees };\n\n  document.addEventListener('click', function (e) {\n    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;\n    var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;\n    if (!a) return;\n    var href = a.getAttribute('href') || '';\n    var d = lees(href);\n    if (!d) return;\n    // Herkende boeklink: altijd ter plekke openen, ook als de link naar een andere pagina wijst (zoals Guestplan deed).\n    e.preventDefault();\n    e.stopImmediatePropagation();\n    open(d);\n  }, true);\n\n  var bijStart = lees(location.href);\n  if (!bijStart) {\n    var sa = new URLSearchParams(location.search);\n    if (sa.get('arrangement')) bijStart = { soort: 'book', code: sa.get('arrangement'), pax: sa.get('pax') };\n  }\n  if (bijStart) window.__busBoekIntent = Date.now();\n  function bijLaden() {\n    if (!bijStart) return;\n    window.__busBoekIntent = Date.now();\n    setTimeout(function () { open(bijStart); zeker(bijStart, 0); }, 400);\n  }\n  // Bij het laden kan de host het paneel daarna nog op het standaardoverzicht zetten: controleren en zo nodig opnieuw.\n  function zeker(d, n) {\n    setTimeout(function () {\n      var host = document.getElementById('booking-widget');\n      var ifr = host && host.querySelector('iframe');\n      var l = '';\n      l = (ifr && ifr.getAttribute('src')) || '';\n      var goed = d.soort === 'gift' ? /[?&]gift=1/.test(l) : (!d.code || l.indexOf('arrangement=' + d.code) >= 0);\n      if (!goed && n < 5) { open(d); zeker(d, n + 1); }\n    }, 1500);\n  }\n  if (document.readyState !== 'loading') bijLaden(); else document.addEventListener('DOMContentLoaded', bijLaden, {once:true});\n  window.addEventListener('hashchange', function () { var d = lees(location.href); if (d) open(d); });\n})();\n";
const inj='<script>(function(){try{var p=window.parent;if(p===window)return;if(!p.__busKlikMerk){p.__busKlikMerk=1;p.document.addEventListener("click",function(e){var t=e.target&&e.target.closest?e.target.closest("[data-booking-widget-open]"):null;if(t)p.__busOpenKlik=Date.now();},true);}if((!p.__busBuild||p.__busBuild<2026103102)&&!p.__busChatHerstel){p.__busChatHerstel=1;var m=p.document.createElement("script");m.type="module";m.src="https://cdn.jsdelivr.net/gh/dhurkmans716/buswhisky-data@main/chat/bus-chat-core.js?v="+Math.floor(Date.now()/3600000);p.document.head.appendChild(m);p.addEventListener("pagehide",function(){try{p.sessionStorage.removeItem("booking-widget-dismissed")}catch(e){}});}if(p.__busBoekLinks)return;var sc=p.document.createElement("script");sc.textContent='+JSON.stringify(BOEK).replace(/<\//g,'<\\/')+';p.document.head.appendChild(sc);}catch(e){}})();</script>';
const s='<script>(function(){try{if(window.self===window.top)return;var p=window.parent,pd=p.document;var host=pd.getElementById("booking-widget");if(!host||!host.classList.contains("is-open"))return;if(/[?&]intent=1(&|$)/.test(location.search))return;if(p.__busBoekIntent&&Date.now()-p.__busBoekIntent<20000)return;var x=host.querySelector("[data-booking-widget-close]");if(x&&pd.activeElement===x)return;if(p.__busOpenKlik&&Date.now()-p.__busOpenKlik<20000)return;if(x)x.click();}catch(e){}})();</script>';
const i=h.search(/<head[^>]*>/i);
if(i>=0){const m=h.slice(i).match(/<head[^>]*>/i)[0];h=h.slice(0,i+m.length)+inj+s+h.slice(i+m.length);}
return [{json:{...j,html:h}}];
}).call(__self,__mk(__items)));
// ===== Webshop terug in widget =====
__items=__norm(await (async function($input){
// 31 okt 2026 (Dennis): webshop-afrekenen en betalen blijven in de widget, de hele journey, net als bij reserveren.
// Zet IN de parent (eigen realm; een functie uit de iframe sterft na wegnavigeren) een load-luisteraar in de capture-fase op #booking-widget
// (de site vervangt de iframe soms). Belangrijk: app.js van de site sluit het paneel zodra de iframe een eigen pagina zonder modal=1 laadt;
// tijdens een webshopbestelling (sessionStorage bw-shop-order) stoppen we dat event (stopImmediatePropagation) zodat het paneel open blijft.
// Mollie (ander domein) blijft zichtbaar. Driver-bedanktpagina -> widget besteld=1 (bevestiging, bestelnummer); /winkelwagen of /bestellen
// -> shopfout=1 met de foutmelding van Driver (msg); andere tussenpagina: spinner, na 9 s zonder verdere navigatie -> shopfout=1.
// 1 nov 2026: vangnet als het paneel toch dichtgaat (bv. iOS): MutationObserver zet is-open terug zolang de bestelvlag staat en de gast niet zelf
// op sluiten/inklappen/Escape drukte. Diagnose: elke stap stuurt een pixel naar de widget-URL met diag=... (zichtbaar in de n8n-executies).
// 1 nov 2026 (Dennis): de webshop mag NOOIT in de reserveringswidget staan. Een echte klik op Reserveren terwijl de iframe op shop=1 staat
// (app.js laadt dan niet opnieuw omdat het paneel al 'book' is) zet de iframe terug op het arrangementenoverzicht en wist de bestelvlag.
// 1 nov 2026: diagnose op Dennis' iPhone (iOS 26): direct na Bestellen en betalen kwamen spookklikken op de flesknop (iframe herladen, gegevens weg)
// en op sluiten/inklappen (paneel dicht, vlag gewist). Klikken op die knoppen binnen 2,5 s na het versturen worden nu genegeerd (diag spookklik:...).
// 1 nov 2026 (Dennis): geen flits van de reserveringswidget bij een tik op de flesknop: de iframe gaat onzichtbaar (laadicoon) tot de webshop geladen is.
// Sinds kern-build 2026110101 laadt de kern de webshop vooraf in een eigen iframe #bwShopFrame (window.__busShopVoor); deze node laat die met rust.
// 1 nov 2026: fouten() leest ook Driver's $notify-melding (afkeuring op /bestellen) en vertaalt de Engelse veldnamen.
// 1 nov 2026: iframe met data-bw-sub (onzichtbaar sinds versturen) wordt zichtbaar bij Mollie (ander domein) of een widgetpagina;
// een bewaker (elk beeldframe) maakt hem direct weer onzichtbaar zodra hij op een Driver-pagina staat (bv. bedankpagina na Mollie), dus nooit een flits.
// Zie ook node 'Webshop afrekenen in widget'.
const j=$input.first().json||{};let h=String(j.html||'');
const P="(function(){try{var p=window;if(p.__busShopTerug)return;var hw=p.document.getElementById(\"booking-widget\");if(!hw)return;p.__busShopTerug=1;var tm=null,dicht=0;\nfunction diag(x){var u=((hw.dataset&&hw.dataset.url)||\"/reserveren/widget\")+\"?launcher=0&modal=1&shop=1&diag=\"+encodeURIComponent(String(x).slice(0,180)+\"|\"+(Date.now()%1e7));try{fetch(u,{keepalive:true,credentials:\"omit\"})}catch(e){try{(new Image()).src=u}catch(e2){}}}\nfunction vers(){var t=0;try{t=+p.sessionStorage.getItem(\"bw-shop-order\")||0}catch(e){}return t&&Date.now()-t<2500}\np.addEventListener(\"click\",function(e){if(!vers())return;var t=e.target&&e.target.closest&&e.target.closest(\"[data-booking-widget-close],#bwCollapse,#bwShopLauncher,[data-booking-widget-open],.chat-window-toggle,#bwChatKnop\");if(!t)return;e.preventDefault();e.stopImmediatePropagation();diag(\"spookklik:\"+String(t.id||t.getAttribute(\"data-booking-widget-open\")||t.className||\"\").slice(0,40))},true);\np.addEventListener(\"click\",function(e){if(p.__busShopVoor)return;var t=e.target&&e.target.closest&&e.target.closest(\"#bwShopLauncher\");if(!t)return;var fr=hw.querySelector(\"iframe\");if(fr){fr.style.visibility=\"hidden\";setTimeout(function(){fr.style.visibility=\"\"},5000)}hw.classList.remove(\"is-ready\")},true);\np.addEventListener(\"pagehide\",function(){if(vlag())diag(\"pagehide-top\")});\np.document.addEventListener(\"click\",function(e){var t=e.target&&e.target.closest&&e.target.closest(\"[data-booking-widget-close],#bwCollapse\");if(t){dicht=Date.now();try{p.sessionStorage.removeItem(\"bw-shop-order\")}catch(x){}}},true);\np.document.addEventListener(\"keydown\",function(e){if(e.key===\"Escape\")dicht=Date.now()},true);\np.document.addEventListener(\"click\",function(e){if(!e.isTrusted)return;var b=e.target&&e.target.closest&&e.target.closest(\"[data-booking-widget-open=\\\"book\\\"]\");if(!b)return;var fr=hw.querySelector(\"iframe\");if(!fr)return;var q=\"\";try{q=fr.contentWindow.location.search}catch(x){q=\"\"}var src=fr.getAttribute(\"src\")||\"\";if(!/[?&]shop=1/.test(q+\"&\"+src)&&!vlag())return;try{p.sessionStorage.removeItem(\"bw-shop-order\")}catch(x){}setTimeout(function(){var u=new URLSearchParams(p.location.search);[\"gift\",\"giftcard\",\"shop\",\"besteld\",\"shopfout\",\"msg\",\"nr\",\"intent\"].forEach(function(k){u.delete(k)});u.set(\"launcher\",\"0\");u.set(\"modal\",\"1\");hw.classList.remove(\"is-ready\");fr.src=((hw.dataset&&hw.dataset.url)||\"/reserveren/widget\")+\"?\"+u.toString()},0)},true);\nnew MutationObserver(function(){if(!hw.classList.contains(\"is-open\")){var fr0=hw.querySelector(\"iframe\"),s0=fr0&&fr0.getAttribute(\"src\")||\"\";if(vlag()||/shop=1/.test(s0))diag(\"dicht|vlag=\"+(vlag()?1:0)+\"|gast=\"+(Date.now()-dicht<1500?1:0))}if(hw.classList.contains(\"is-open\")||!vlag()||Date.now()-dicht<1500)return;diag(\"heropen\");hw.classList.add(\"is-open\");p.document.documentElement.classList.add(\"booking-widget-open\");var dl=hw.querySelector(\"[role=dialog]\");if(dl)dl.setAttribute(\"aria-hidden\",\"false\")}).observe(hw,{attributes:true,attributeFilter:[\"class\"]});\n(function bew(){var fs=hw.querySelectorAll(\"iframe[data-bw-sub]\");for(var i=0;i<fs.length;i++){var f=fs[i],pp=null;try{pp=f.contentWindow.location.pathname}catch(x){continue}if(pp&&pp!==\"blank\"&&pp.indexOf(\"/reserveren/widget\")!==0&&f.style.visibility!==\"hidden\"){f.style.visibility=\"hidden\";hw.classList.remove(\"is-ready\")}}if(fs.length)p.requestAnimationFrame(bew);else setTimeout(bew,250)})();\nfunction vlag(){var t=0;try{t=+p.sessionStorage.getItem(\"bw-shop-order\")||0}catch(e){}return t&&Date.now()-t<7200000}\nfunction terug(fr,q){clearTimeout(tm);try{p.sessionStorage.removeItem(\"bw-shop-order\")}catch(e){}var lg=(p.document.documentElement.lang||\"\").slice(0,2).toLowerCase();if(lg&&lg!==\"nl\")q+=\"&lang=\"+lg;hw.classList.remove(\"is-ready\");if(!hw.classList.contains(\"is-open\")){hw.classList.add(\"is-open\");p.document.documentElement.classList.add(\"booking-widget-open\")}fr.src=((hw.dataset&&hw.dataset.url)||\"/reserveren/widget\")+\"?launcher=0&modal=1&intent=1&shop=1&\"+q}\nfunction fouten(doc){try{var s=[],seen={};doc.querySelectorAll(\".invalid-feedback,.error,.errors li,[class*=error],[class*=invalid],[class*=text-red],[role=alert],.alert\").forEach(function(e){if(e.closest&&e.closest(\".hidden,[hidden]\"))return;var t=(e.textContent||\"\").replace(/[ \\t\\r\\n]+/g,\" \").trim();if(t&&t.length<160&&!seen[t]){seen[t]=1;s.push(t)}});var hm=(doc.documentElement&&doc.documentElement.innerHTML)||\"\",nm=hm.match(/[$]notify[(][{] *message: *'([^']{1,600})'/);if(nm)s=[nm[1]];var r=s.slice(0,3).join(\" \");var V=[[\"Invoice salutation\",\"Aanhef\"],[\"Invoice first name\",\"Voornaam\"],[\"Invoice last name\",\"Achternaam\"],[\"Invoice email\",\"E-mailadres\"],[\"Invoice street\",\"Straat\"],[\"Invoice house number\",\"Huisnummer\"],[\"Invoice zip\",\"Postcode\"],[\"Invoice city\",\"Plaats\"],[\"Invoice country\",\"Land\"],[\"Invoice phone\",\"Telefoonnummer\"],[\"Shipping method\",\"Verzendmethode\"],[\"Payment method\",\"Betaalmethode\"]];V.forEach(function(v){r=r.split(v[0]).join(v[1])});return r.slice(0,300)}catch(e){return \"\"}}\nhw.addEventListener(\"load\",function(ev){var fr=ev.target;if(!fr||fr.tagName!==\"IFRAME\")return;if(fr.getAttribute(\"data-bw-sub\")){var zw=0,za=0;try{zw=fr.contentWindow.location.pathname.indexOf(\"/reserveren/widget\")===0}catch(x){za=1}if(zw){fr.removeAttribute(\"data-bw-sub\");fr.style.visibility=\"\"}else if(za){fr.style.visibility=\"\"}}if(fr.id!==\"bwShopFrame\"&&fr.style.visibility===\"hidden\"){var uu=\"\";try{uu=fr.contentWindow.location.href}catch(x){uu=\"shop=1\"}if(uu.indexOf(\"shop=1\")>-1)fr.style.visibility=\"\"}var L,pa;try{L=fr.contentWindow.location;pa=L.pathname}catch(e){if(vlag())diag(\"load:anderdomein\");clearTimeout(tm);hw.classList.add(\"is-ready\");return}\nif(!pa||L.href===\"about:blank\"||pa.indexOf(\"/reserveren/widget\")===0)return;if(!vlag())return;\nev.stopImmediatePropagation();diag(\"load:\"+pa+(L.search||\"\").slice(0,60));\nvar doc=null,tx=\"\";try{doc=fr.contentDocument;tx=doc.body.innerText||\"\"}catch(e){}\nvar ok=/bedankt voor je bestelling|bestelling (is )?bevestigd|thank you for your order|order (is )?confirmed|vielen dank|merci pour votre commande|gracias por tu pedido/i.test(tx)||/bedankt|thank|success|danke|bevestig|confirm/i.test(pa);\nvar fout=!ok&&[\"/winkelwagen\",\"/bestellen\",\"/cart\",\"/checkout\"].indexOf(pa.replace(/[/]$/,\"\"))>=0;\nif(ok){var m=tx.match(/(?:bestel(?:ling|nummer)|order(?:nummer| number)?)[^0-9]{0,25}#?[ ]*([0-9]{4,})/i);terug(fr,\"besteld=1\"+(m?\"&nr=\"+m[1]:\"\"));return}\nif(fout){var f=doc?fouten(doc):\"\";terug(fr,\"shopfout=1\"+(f?\"&msg=\"+encodeURIComponent(f):\"\"));return}\nhw.classList.remove(\"is-ready\");var href=L.href;clearTimeout(tm);tm=setTimeout(function(){var h2=\"\";try{h2=fr.contentWindow.location.href}catch(e){return}if(h2===href){var f2=\"\";try{f2=fouten(fr.contentDocument)}catch(e){}terug(fr,\"shopfout=1\"+(f2?\"&msg=\"+encodeURIComponent(f2):\"\"))}},9000)},true)}catch(e){}})();";
const W='<script id="bw-shop-terug">(function(){try{var p=window.parent;if(p===window||p.__busShopTerug)return;var sc=p.document.createElement("script");sc.textContent='+JSON.stringify(P).replace(/<\//g,'<\\/')+';p.document.head.appendChild(sc)}catch(e){}})();</script>';
const i=h.search(/<head[^>]*>/i);
if(i>=0&&h.indexOf('id="bw-shop-terug"')<0){const m=h.slice(i).match(/<head[^>]*>/i)[0];h=h.slice(0,i+m.length)+W+h.slice(i+m.length);}
return [{json:{...j,html:h}}];
}).call(__self,__mk(__items)));
// ===== Powered by-regel =====
__items=__norm(await (async function($input){
const j=$input.first().json||{};let h=String(j.html||'');
// Powered by-regel onderin het reserverings- en cadeaubonpaneel (Dennis 30 okt 2026). Alleen zichtbaar in de pop-up op de site (html.bus-modal). Tekst zonder 's en icoon voor en na (Dennis 30 okt 2026).
const css="<style>.bw-powered{display:none}html.bus-modal:not(.bus-launcher) .bw-powered{display:flex;position:fixed;left:0;right:0;bottom:0;z-index:2147483641;align-items:center;justify-content:center;gap:6px;background:#000;color:#fff;font:500 11px/1.2 -apple-system,BlinkMacSystemFont,\"Segoe UI\",Arial,sans-serif;letter-spacing:.02em;padding:6px 10px;padding-bottom:calc(6px + env(safe-area-inset-bottom));margin:0}.bw-powered svg{width:13px;height:13px;flex:none}.bw-powered svg.bw-pow-end{transform:scaleX(-1)}html.bus-modal:not(.bus-launcher) body{padding-bottom:calc(26px + env(safe-area-inset-bottom))!important}</style>";
const ico=function(c){return "<svg"+(c?" class=\""+c+"\"":"")+" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path fill=\"#C9A227\" d=\"M12 2l1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8z\"/><path fill=\"#C9A227\" d=\"M19 14l.9 2.1L22 17l-2.1.9L19 20l-.9-2.1L16 17l2.1-.9z\"/><path fill=\"#C9A227\" d=\"M5 14.5l.7 1.6 1.6.7-1.6.7L5 19.1l-.7-1.6-1.6-.7 1.6-.7z\"/></svg>";};
const bar="<div class=\"bw-powered\">"+ico('')+"<span>Powered by Bus Whisky Angels’ Share</span>"+ico('bw-pow-end')+"</div>";
if(h.indexOf('</head>')>=0)h=h.replace('</head>',()=>css+'</head>');
const i=h.lastIndexOf('</body>');if(i>=0)h=h.slice(0,i)+bar+h.slice(i);
return [{json:{...j,html:h}}];
}).call(__self,__mk(__items)));
// ===== Cadeaubon kortingscode en responsive =====
__items=__norm(await (async function($input){
// n8n Code node: "Cadeaubon kortingscode + responsive"
const j=$input.first().json||{};let h=String(j.html||'');
// 1. Kortingscodeveld in stap 3, direct onder het totaal
const blok='<div class="gift-discount"><button type="button" class="gift-discount-toggle" aria-expanded="false">Ik heb een kortingscode</button><div class="gift-discount-wrap" hidden><div class="gift-discount-row"><input name="discount_code" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="Kortingscode"><button type="button" class="gift-discount-apply">Toepassen</button></div><div class="gift-discount-msg" hidden></div></div><div class="gift-discount-note" hidden></div></div>';
const totaal='<strong id="giftTotal">€ 0</strong></div>';
if(h.indexOf('class="gift-discount"')<0){
  if(h.indexOf(totaal)>=0)h=h.replace(totaal,()=>totaal+blok);
  else h=h.replace('<h2>Vul je contactgegevens in:</h2>',()=>blok+'<h2>Vul je contactgegevens in:</h2>');
}
if(h.indexOf('class="gift-discount"')<0)throw new Error('Kortingscodeveld kon niet in het cadeaubonformulier worden gezet');
// 2. Totaal via korting laten lopen en de code meesturen naar de checkout
h=h.replace("document.getElementById('giftTotal').textContent=euro(amount);",()=>"(window.busGiftTotal?window.busGiftTotal(amount,euro):(document.getElementById('giftTotal').textContent=euro(amount)));");
h=h.replace('delivery_at:delivery})',()=>"delivery_at:delivery,discount_code:(window.busGiftDiscountCode?window.busGiftDiscountCode():'')})");
if(h.indexOf('busGiftDiscountCode()')<0)throw new Error('Checkout-aanroep cadeaubon niet gevonden');
// 3. Geen zichtbare scrollbalken, responsive modal
const css=`<style id="busGiftResponsive">
html,body,.app,.gift-modal,.gift-modal-backdrop{scrollbar-width:none!important;-ms-overflow-style:none!important}
html::-webkit-scrollbar,body::-webkit-scrollbar,.app::-webkit-scrollbar,.gift-modal::-webkit-scrollbar,.gift-modal-backdrop::-webkit-scrollbar{width:0!important;height:0!important;display:none!important;background:transparent!important}
html,body{overflow-x:hidden!important}
.gift-modal{overscroll-behavior:contain;-webkit-overflow-scrolling:touch;background:#F7F4EE!important;padding:0!important;border-radius:16px!important;width:min(600px,96vw)!important;max-height:min(92dvh,960px)!important;box-shadow:0 18px 50px rgba(0,0,0,.35)!important}
.gift-modal-head{position:sticky!important;top:0;z-index:5;background:#F7F4EE!important;color:#1d1d1b!important;height:auto!important;padding:16px 56px 14px!important;font:700 18px/1.2 -apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif!important;text-align:center!important;border:0!important;display:block!important}
.gift-modal-close{color:#1d1d1b!important;right:8px!important;top:8px!important;width:40px;height:40px;border-radius:50%;line-height:1}
.gift-modal-close:hover{background:#f1ede7!important}
.gift-modal .gift-buy{border:0!important;border-radius:0!important;margin:0 auto!important;padding:4px 24px 26px!important;max-width:620px!important;background:#F7F4EE!important;color:#1d1d1b!important;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif!important}
.gift-buy input,.gift-buy textarea{border-color:#d8d1c7!important;background:#fff!important;color:#1d1d1b!important}
.gift-buy .gift-step h2{font-size:20px!important;margin:8px 0 16px!important}
.gift-buy .gift-custom{color:#625d56!important}
.gift-buy .gift-amounts{grid-template-columns:repeat(6,minmax(0,1fr))!important;gap:6px!important}
.gift-buy .gift-amounts button{min-width:0!important;padding:12px 0!important;font-size:15px!important;white-space:nowrap!important;border:1px solid #d8d1c7!important;background:#fff!important;color:#1d1d1b!important}
.gift-buy .gift-amounts button.selected{background:#1d1d1b!important;color:#fff!important;border-color:#1d1d1b!important}
.gift-buy .gift-amounts button:focus{outline:none!important}
.gift-buy .gift-amounts button:focus-visible{box-shadow:0 0 0 2px #C9A227!important}
@media(max-width:420px){.gift-buy .gift-amounts{gap:4px!important}.gift-buy .gift-amounts button{font-size:13px!important;padding:11px 0!important}}
.gift-buy input,.gift-buy textarea,.gift-buy select{font-size:16px!important}
.gift-buy textarea{resize:vertical}
.gift-discount{margin:-6px 0 16px;text-align:center}
.gift-discount [hidden],.gift-discount[hidden]{display:none!important}
.gift-discount-toggle{border:0;background:none;color:#555;text-decoration:underline;font:inherit;font-size:14px;cursor:pointer;padding:4px}
.gift-discount-row{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;align-items:center;margin-top:6px}
.gift-buy .gift-discount-row input{margin:0!important;text-transform:uppercase}
.gift-discount-apply{border:1px solid #1d1d1b;background:#fff;color:#1d1d1b;border-radius:7px;padding:13px 16px;font:inherit;font-weight:700;cursor:pointer;white-space:nowrap}
.gift-discount-apply:disabled{opacity:.6}
.gift-discount-msg{margin-top:6px;font-size:14px;text-align:left}.gift-discount-msg.ok{color:#2f6b3a}.gift-discount-msg.err{color:#7a2020}
.gift-discount-note{font-size:14px;color:#2f6b3a;margin-top:8px}
.gift-old{color:#8a857c;font-weight:400;margin-right:6px}
@media(max-width:600px){
.gift-modal-backdrop{padding:0!important;align-items:stretch!important}
.gift-modal{width:100%!important;max-height:none!important;height:100dvh!important;border-radius:0!important;box-shadow:none!important}
.gift-modal .gift-buy{padding:16px 16px 64px!important}
.gift-nav{gap:4px!important}
}
html.bus-modal .gift-modal-backdrop{padding:0!important;background:#F7F4EE!important;align-items:stretch!important}
html.bus-modal body:not(#bwx),html.bus-modal:not(#bwx){background:#F7F4EE!important}
html.bus-modal .gift-modal{width:100%!important;height:100dvh!important;max-height:none!important;border-radius:0!important;box-shadow:none!important}
html.bus-modal .gift-modal-close,html.bus-modal .bus-modal-close{display:none!important}
html.bus-modal .gift-modal .gift-buy{padding-bottom:64px!important}
</style>`;
if(h.indexOf('id="busGiftResponsive"')<0)h=h.replace('</head>',()=>css+'</head>');
// 4. Logica kortingscode
const js=String.raw`<script>(function(){var f=document.getElementById('giftForm');if(!f)return;var st=null,last=0;
function fmt(v){return new Intl.NumberFormat('nl-NL',{style:'currency',currency:'EUR',minimumFractionDigits:(Math.round(v)===v?0:2),maximumFractionDigits:2}).format(v)}
function calc(a){if(!st)return 0;var k=st.soort==='PERCENTAGE'?Math.round(a*st.percentage)/100:st.korting_cent/100;return Math.max(0,Math.min(a,k))}
function rs(){if(window.BUSBookingWidget&&window.BUSBookingWidget.resize)setTimeout(window.BUSBookingWidget.resize,0)}
window.busGiftTotal=function(a){last=Number(a)||0;var el=document.getElementById('giftTotal');if(!el)return;var k=calc(last),pay=Math.round((last-k)*100)/100;
if(st&&k>0)el.innerHTML='<s class="gift-old">'+fmt(last)+'</s>'+fmt(pay);else el.textContent=fmt(last);
var n=f.querySelector('.gift-discount-note');if(n){if(st&&k>0){var t='Korting '+st.code+': -'+fmt(k);if(st.soort!=='PERCENTAGE'&&st.korting_cent/100>last)t+='. De restwaarde van de code vervalt.';n.textContent=t;n.hidden=false}else n.hidden=true}
var q=f.querySelector('.gift-pay');if(q&&!q.disabled)q.textContent=(st&&pay<=0)?'Cadeaubon aanvragen':'Verder naar betaling';rs()};
window.busGiftDiscountCode=function(){var i=f.elements.discount_code;return st?st.code:(i?i.value.trim():'')};
var tg=f.querySelector('.gift-discount-toggle'),wr=f.querySelector('.gift-discount-wrap'),inp=f.elements.discount_code,ap=f.querySelector('.gift-discount-apply'),msg=f.querySelector('.gift-discount-msg');if(!tg||!wr||!inp||!ap)return;
function say(t,ok){msg.hidden=!t;msg.textContent=t||'';msg.className='gift-discount-msg'+(ok?' ok':' err');rs()}
tg.addEventListener('click',function(e){e.preventDefault();wr.hidden=!wr.hidden;tg.setAttribute('aria-expanded',wr.hidden?'false':'true');tg.textContent=wr.hidden?'Ik heb een kortingscode':'Kortingscode verbergen';if(!wr.hidden)setTimeout(function(){inp.focus()},0);rs()});
inp.addEventListener('input',function(){if(st){st=null;window.busGiftTotal(last)}say('')});
inp.addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();ap.click()}});
ap.addEventListener('click',async function(){var c=inp.value.trim();if(!c){say('Vul een kortingscode in.');return}ap.disabled=true;ap.textContent='Controleren…';
try{var r=await fetch(location.origin+'/webhook/bus-booking-widget-preview/giftcard',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({actie:'check_korting',code:c,amount:last})});var o=await r.json();
if(o&&o.ok){st={code:o.code,soort:o.soort,korting_cent:Number(o.korting_cent||0),percentage:Number(o.percentage||0)};inp.value=o.code;say('')}else{st=null;say((o&&o.reden)||'Deze kortingscode is niet geldig.')}}catch(x){st=null;say('Controleren lukte niet. Probeer het opnieuw.')}
ap.disabled=false;ap.textContent='Toepassen';window.busGiftTotal(last)});
var kb=false;document.addEventListener('keydown',function(e){if(e.key==='Tab')kb=true},true);document.addEventListener('mousedown',function(){kb=false},true);document.addEventListener('focusin',function(e){var t=e.target;if(!kb&&t&&t.closest&&t.closest('.gift-amounts')&&!t.classList.contains('selected')&&!t.matches(':hover'))setTimeout(function(){if(document.activeElement===t&&!kb)t.blur()},0)},true);})();</script>`;
const i=h.lastIndexOf('</body>');h=i>=0?h.slice(0,i)+js+h.slice(i):h+js;

// 5. Omlijsting op buswhisky.com gelijk aan de chat: inklappijl, geen kruisje, lichte achtergrond (30 okt 2026)
const hostJs=String.raw`<script>(function(){try{if(window.self===window.top)return;var pd=window.parent.document;var host=pd.getElementById('booking-widget');if(!host)return;
var css='#booking-widget [data-booking-widget-close]{display:grid!important;top:12px!important;right:12px!important;width:28px!important;height:28px!important;z-index:20!important}'+
'#booking-widget-panel,#booking-widget.is-gift #booking-widget-panel{background:#F7F4EE!important;box-shadow:0 25px 50px -12px rgba(0,0,0,.45)!important}'+
'@media(min-width:640px){#booking-widget-panel{right:24px!important;bottom:88px!important;border-radius:8px!important;height:min(640px,calc(100dvh - 112px))!important}#booking-widget.is-gift #booking-widget-panel{height:min(640px,calc(100dvh - 112px))!important}}'+
'@media(max-width:639px){#booking-widget-panel{top:0!important;left:0!important;right:0!important;bottom:auto!important;height:calc(100dvh - 80px)!important;border-radius:0 0 8px 8px!important}}'+
'#bwCollapse{position:fixed;right:16px;bottom:16px;z-index:60;width:48px;height:48px;border:0;border-radius:50%;background:#C9A227;color:#fff;display:none;place-items:center;cursor:pointer;padding:0;box-shadow:0 4px 16px rgba(0,0,0,.45),0 0 0 2px #000;transition:transform .2s,background .2s}'+
'#bwCollapse:hover{background:#b8931f;transform:scale(1.05)}#bwCollapse:focus-visible{outline:2px solid #fff;outline-offset:2px}'+
'@media(min-width:768px){#bwCollapse{right:24px;bottom:24px}}#booking-widget.is-open #bwCollapse{display:grid}#bwCollapse svg{width:32px;height:32px}';
var st=pd.getElementById('bw-unify-host');if(!st){st=pd.createElement('style');st.id='bw-unify-host';pd.head.appendChild(st)}st.textContent=css;
var old=pd.getElementById('bwCollapse');if(old)old.remove();var b=pd.createElement('button');b.id='bwCollapse';b.type='button';b.setAttribute('aria-label','Inklappen');b.title='Inklappen';
b.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7.41 8.58L12 13.17l4.59-4.59L18 10l-6 6l-6-6z"/></svg>';
b.setAttribute('onclick',"var h=document.getElementById('booking-widget'),x=h&&h.querySelector('[data-booking-widget-close]');if(x)x.click();");host.appendChild(b);
}catch(e){}})();</script>`;
if(h.indexOf('bw-unify-host')<0){const k=h.lastIndexOf('</body>');h=k>=0?h.slice(0,k)+hostJs+h.slice(k):h+hostJs;}
return [{json:{...j,html:h}}];

}).call(__self,__mk(__items)));
// ===== Kortingscode-linkje in stap 2 =====
__items=__norm(await (async function($input){
// 30 okt 2026 (Dennis): kortingscode bij de cadeaubon identiek aan de arrangementen:
// klein grijs linkje "Ik heb een kortingscode" in een beige vak, in stap 2 boven Terug/Doorgaan.
const j=$input.first().json||{};let h=String(j.html||'');
const start='<div class="gift-discount"><button type="button" class="gift-discount-toggle"';
const eind='<div class="gift-discount-note" hidden></div></div>';
const a=h.indexOf(start);if(a<0)throw new Error('Kortingscodeblok cadeaubon niet gevonden');
const b=h.indexOf(eind,a);if(b<0)throw new Error('Einde kortingscodeblok niet gevonden');
const blok=h.slice(a,b+eind.length);
h=h.slice(0,a)+h.slice(b+eind.length);
const s2=h.indexOf('data-step="2"');if(s2<0)throw new Error('Stap 2 cadeaubon niet gevonden');
const nav=h.indexOf('<div class="gift-nav">',s2);if(nav<0)throw new Error('Knoppen stap 2 niet gevonden');
h=h.slice(0,nav)+blok+h.slice(nav);
const css='<style id="busGiftDiscountStap2">.gift-buy .gift-discount{margin:12px 0 12px;padding:10px;border:1px solid #ece6dc;border-radius:8px;background:#faf7f2;text-align:left}.gift-buy .gift-discount-toggle{display:inline-block;width:auto;margin:2px 0 0;padding:4px 0;border:0;background:none!important;color:#555!important;font-size:14px;text-decoration:underline;cursor:pointer;box-shadow:none}.gift-buy .gift-discount-row{margin-top:8px}.gift-buy .gift-discount-note{text-align:left}</style>';
h=h.indexOf('</head>')>=0?h.replace('</head>',()=>css+'</head>'):css+h;
return [{json:{...j,html:h}}];

}).call(__self,__mk(__items)));
// ===== Boekformulier opmaak =====
__items=__norm(await (async function($input){
const j=$input.first().json||{};let h=String(j.html||'');
// Boekformulier in de arrangementkaart: nette velden, waardebon-label boven het veld,
// kortingscode pas zichtbaar na klik op de link (de toggle zet .open op .discount-wrap).
const css=`<style id="bw-bookform">
.booking-form{margin-top:12px;display:none}
.booking-form .name-row{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.booking-form input,.booking-form textarea{display:block;width:100%;margin:0 0 8px;padding:12px 13px;border:1px solid #d8d1c7;border-radius:7px;background:#fff;color:#1d1d1b;font-size:16px!important;line-height:1.3!important;outline:none;-webkit-appearance:none;appearance:none}
.booking-form .name-row input{margin-bottom:8px}
.booking-form input:focus,.booking-form textarea:focus{border-color:#1d1d1b;box-shadow:0 0 0 2px rgba(29,29,27,.08)}
.booking-form input::placeholder,.booking-form textarea::placeholder{color:#8a8478;font-style:normal!important}
.booking-form textarea{min-height:78px;resize:vertical}
.booking-form .credit-box{margin:4px 0 12px;padding:10px;border:1px solid #ece6dc;border-radius:8px;background:#faf7f2}
.booking-form .credit-box label{display:block;margin:0 0 6px;font-size:14px;font-weight:700;color:#1d1d1b}
.booking-form .credit-box input{margin-bottom:4px}
.booking-form input[name=giftCards]{padding-left:11px;padding-right:8px}
.booking-form input[name=giftCards]::placeholder{font-size:12.5px;letter-spacing:-.1px}
.booking-form .discount-toggle{display:inline-block;width:auto;margin:2px 0 0;padding:4px 0;border:0;background:none!important;color:#555!important;font-size:14px;text-decoration:underline;cursor:pointer;box-shadow:none}
.booking-form .discount-wrap{display:none;margin-top:8px}
.booking-form .discount-wrap.open{display:block}
.booking-form .discount-wrap input{margin-bottom:0}
.booking-form button.book[type=submit]{display:block;width:100%;margin:0;padding:15px;border:0;border-radius:8px;font-size:17px;font-weight:700;cursor:pointer}
.booking-form .booking-msg{margin-top:10px;font-size:14px}
@media(max-width:360px){.booking-form .name-row{grid-template-columns:1fr;gap:0}}
@media(max-width:380px){.booking-form input[name=giftCards]::placeholder{font-size:11px;letter-spacing:-.2px}}
</style>`;
h=h.split('placeholder="Meer dan 1 waardebon? Gebruik ; of ,">').join('placeholder="Meer dan 1 waardebon? Scheid de codes met ; of ,">');
h=h.includes('</body>')?h.replace('</body>',css+'</body>'):h+css;
return [{json:{...j,html:h}}];

}).call(__self,__mk(__items)));
// ===== Arrangement eerst bij deeplink =====
__items=__norm(await (async function($input){
const j=$input.first().json||{};let h=String(j.html||'');
// Dennis 30 okt 2026: bij een deeplink naar EEN arrangement eerst foto, titel en omschrijving,
// daaronder pas gasten, datum, tijd en het boekformulier. Alleen in die modus; het overzicht blijft ongewijzigd.
// Dennis 2 nov 2026: bij een deeplink staat de omschrijving standaard UITGEKLAPT ("Lees meer" al open), knop "Lees minder" klapt in.
const css='<style id="bw-arr-eerst">'
+'body.bw-single .card .filters{margin:12px 0 12px;box-shadow:none}'
+'body.bw-single .card .arrangement-description.bw-ingeklapt{max-height:118px;overflow:hidden;position:relative}'
+'body.bw-single .card .arrangement-description.bw-ingeklapt:after{content:"";position:absolute;left:0;right:0;bottom:0;height:42px;background:linear-gradient(rgba(255,255,255,0),#fff)}'
+'body.bw-single .bw-meer{display:block;margin:2px auto 4px;border:0;background:none;color:inherit;text-decoration:underline;font:inherit;font-size:14px;cursor:pointer}'
+'</style>';
const js='<script id="bw-arr-eerst-js">(function(){function run(){try{var q=new URLSearchParams(location.search);'
+'if(!(q.get("arrangement")||q.get("service_code")||q.get("service")))return;'
+'var cards=document.querySelectorAll("#cards .card");if(cards.length!==1)return;'
+'var card=cards[0],body=card.querySelector(".body"),f=document.querySelector("form.filters");if(!body||!f)return;'
+'document.body.classList.add("bw-single");'
+'var desc=body.querySelector(".arrangement-description")||body.querySelector("p");'
+'var anker=desc||body.querySelector("h2");'
+'if(anker&&anker.parentNode===body)anker.after(f);else body.insertBefore(f,body.firstChild);'
// 16 nov 2026 (opdracht Dennis, globale standaard voor alle arrangementen): datum VOOR aantal personen.
+'var px=f.querySelector("#pax"),pl=px&&px.closest(".filter"),dt=f.querySelector("#dateTrigger")||(f.querySelector("#date")&&f.querySelector("#date").closest(".filter")),cal=f.querySelector("#busCal");'
+'if(pl&&dt&&(pl.compareDocumentPosition(dt)&4)){pl.parentNode.insertBefore(dt,pl);if(cal&&cal.parentNode===pl.parentNode)pl.parentNode.insertBefore(cal,pl);}'
+'if(desc&&desc.scrollHeight>150){var b=document.createElement("button");b.type="button";b.className="bw-meer";b.textContent="Lees minder";b.setAttribute("aria-expanded","true");'
+'b.addEventListener("click",function(){var dicht=desc.classList.toggle("bw-ingeklapt");b.textContent=dicht?"Lees meer":"Lees minder";b.setAttribute("aria-expanded",dicht?"false":"true");});desc.after(b);}'
+'}catch(e){}}if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",function(){setTimeout(run,0)});else setTimeout(run,0);})();</script>';
h=h.replace(/<\/head>/i,css+'</head>');
const k=h.lastIndexOf('</body>');
h=k>=0?h.slice(0,k)+js+h.slice(k):h+js;
return [{json:{...j,html:h}}];

}).call(__self,__mk(__items)));
// ===== Snelle datumkeuze =====
__items=__norm(await (async function($input){
const j=$input.first().json||{};let h=String(j.html||'');
// Dennis 30 okt 2026: snelheid. Een datum- of personenkeuze laadde de hele widget opnieuw (n8n + Guestplan, 1-3 s).
// Nu: (1) de klik reageert meteen (datum geselecteerd, laadindicatie), (2)+(3) als de keuze niets verandert aan welke
// kaarten boekbaar zijn, wordt alles in de browser bijgewerkt zonder serververzoek (de regels per arrangement staan in de pagina).
// Alleen als de kaarten echt veranderen (overzicht, of vandaag) laadt de pagina opnieuw, met laadindicatie.
let q={};try{q=$('GET BUS Booking Widget').first().json.query||{}}catch(e){}try{const __sd=$('BUS Engine services').first().json.__startDatum;if(__sd&&!q.date)q=Object.assign({},q,{date:__sd})}catch(__e){}
let services=[];try{services=$('BUS Engine services').first().json.experiences||[]}catch(e){}
const code=String(q.arrangement||q.service_code||q.service||'').trim();
const TODAY=DateTime.now().setZone('Europe/Amsterdam').toFormat('yyyy-MM-dd');
const kinds={CewjJvV:'restaurant','4cSbXnj':'restaurant','42SA1mn':'rondleiding',Fc7ZW1:'proeverij'};
const S={};for(const s of services){const r=s.engine||{};S[String(s.service_code||'')]={k:kinds[s.service_code]||'arrangement',wd:Array.isArray(s.week_days)?s.week_days:[],a:s.local_start_date||'',z:s.local_end_date||'',min:s.min_party_size||1,max:s.max_party_size||0,b:(r.blackouts||[]).map(x=>[x.start_date||'',x.end_date||''])}}
// 30 okt 2026: rondleiding, proeverij en restaurant kregen altijd "Selecteer datum" (live-beschikbaarheidsnodes staan los,
// avMap leeg) waardoor reserveren onmogelijk was. Zonder live status: boekbaar als de dag/periode/personen kloppen en er een tijd is.
const DATE=/^\d{4}-\d{2}-\d{2}$/.test(q.date||'')?q.date:TODAY;const PAX=(()=>{let d=2;try{const s=code&&services.find(x=>String(x.service_code||'')===code);if(s){const mn=Number(s.min_party_size||1),mx=Number(s.max_party_size||0);if(d<mn)d=mn;if(mx&&d>mx)d=mx}}catch(e){}return Math.max(1,Math.min(50,parseInt(q.pax||String(d),10)||d))})(); /* 27 nov 2026 */
const wdag=k=>DateTime.fromISO(k).weekday;
function eligS(s,k,p){if(!s)return true;if(p<s.min)return false;if(s.max&&p>s.max)return false;if(s.a&&k<s.a)return false;if(s.z&&k>s.z)return false;if(s.wd.length&&!s.wd.includes(wdag(k)))return false;for(const b of s.b){if(b[0]&&b[1]&&k>=b[0]&&k<=b[1])return false}return true}
h=h.replace(/<article class="card unavailable"([^>]*?)data-kind="(restaurant|rondleiding|proeverij)"([^>]*?)data-code="([^"]*)"([^>]*?)data-times="([^"]*)"([^>]*)>([\s\S]*?)<\/article>/g,(all,a,kind,b,c,d,times,e,body)=>{
  const first=String(times||'').split(',').map(x=>x.trim()).filter(Boolean)[0]||'';
  if(!first||!eligS(S[c],DATE,PAX))return all;
  body=body.replace(/<button type="button" class="nextdate"[^>]*>[\s\S]*?<\/button>/,'<a class="book" href="#">Bekijk &amp; reserveer</a>').replace('Reserveer voor later','Beschikbaar vanaf '+first);
  return '<article class="card "'+a+'data-kind="'+kind+'"'+b+'data-code="'+c+'"'+d+'data-times="'+times+'"'+e+'>'+body+'</article>'});
if(!/<article class="card unavailable"/.test(h))h=h.replace("classList.add('date-full')","classList.add('date-open')");
const data=JSON.stringify({S,TODAY,code,general:!code}).replace(/</g,'\\u003c');
const css='<style id="bw-snel">#cards{transition:opacity .15s}body.bw-laden #cards{opacity:.45;pointer-events:none}'
+'body.bw-laden .divider:after{content:"";flex:none;width:16px;height:16px;margin-left:8px;border:2px solid #d8d1c7;border-top-color:#1d1d1b;border-radius:50%;animation:bwdraai .7s linear infinite;background:none}'
+'@keyframes bwdraai{to{transform:rotate(360deg)}}#date.bw-flits{animation:bwflits .6s ease}@keyframes bwflits{0%{background:#e8f3ea}100%{background:transparent}}</style>';
const js='<script id="bw-snel-js">(function(){var D='+data+';'
+'function wdag(k){var x=new Date(k+"T12:00:00").getDay();return x===0?7:x}'
+'function elig(s,k,p){if(!s)return true;if(p<s.min)return false;if(s.max&&p>s.max)return false;if(s.a&&k<s.a)return false;if(s.z&&k>s.z)return false;if(s.wd.length&&s.wd.indexOf(wdag(k))<0)return false;for(var i=0;i<s.b.length;i++){if(s.b[i][0]&&s.b[i][1]&&k>=s.b[i][0]&&k<=s.b[i][1])return false}return true}'
+'function groep(k){var w=wdag(k);return (w===2||w===3)?1:0}'
+'function kan(oud,nieuw,po,pn){if(oud===D.TODAY||nieuw===D.TODAY)return false;if(D.general&&groep(oud)!==groep(nieuw))return false;'
+'var c=document.querySelectorAll("#cards .card[data-code]");for(var i=0;i<c.length;i++){var s=D.S[c[i].dataset.code];if(!s)continue;if(elig(s,oud,po)!==elig(s,nieuw,pn))return false}return true}'
+'function laden(){document.body.classList.add("bw-laden")}'
+'window.addEventListener("beforeunload",laden);window.addEventListener("pageshow",function(){document.body.classList.remove("bw-laden")});'
+'function zetUrl(k,p){try{var u=new URL(location.href);u.searchParams.set("date",k);u.searchParams.set("pax",p);u.searchParams.delete("time");history.replaceState({},"",u)}catch(e){}}'
+'function naar(k,p){var u=new URL(location.href);u.searchParams.set("pax",p);u.searchParams.set("date",k);if(D.code)u.searchParams.set("arrangement",D.code);u.searchParams.delete("time");u.searchParams.delete("choose_date");laden();location.href=u}'
+'document.addEventListener("click",function(e){var b=e.target&&e.target.closest?e.target.closest("#busCal .cal-day[data-date]"):null;if(!b)return;'
+'var k=b.dataset.date,inp=document.getElementById("date"),pe=document.getElementById("pax");if(!inp||!pe)return;'
+'if(k<D.TODAY||b.disabled||b.classList.contains("past"))return;if(!D.general&&!elig(D.S[D.code],k,Number(pe.value)))return;'
+'e.preventDefault();e.stopImmediatePropagation();var box=document.getElementById("busCal");'
+'box.querySelectorAll(".cal-day.selected").forEach(function(x){x.classList.remove("selected")});b.classList.add("selected");'
+'var oud=inp.value;inp.value=k;if(k===oud){box.hidden=true;return}'
+'if(kan(oud,k,Number(pe.value),Number(pe.value))){box.hidden=true;zetUrl(k,pe.value);inp.classList.remove("bw-flits");void inp.offsetWidth;inp.classList.add("bw-flits");return}'
+'naar(k,pe.value)},true);'
+'document.addEventListener("change",function(e){var pe=e.target;if(!pe||pe.id!=="pax")return;var inp=document.getElementById("date");if(!inp)return;'
+'var oudP=Number(pe.getAttribute("data-bw-p")||pe.defaultValue||pe.value),nieuwP=Number(pe.value);e.stopImmediatePropagation();'
+'if(kan(inp.value,inp.value,oudP,nieuwP)&&inp.value!==D.TODAY){pe.setAttribute("data-bw-p",nieuwP);zetUrl(inp.value,nieuwP);return}naar(inp.value,nieuwP)},true);'
+'var pe0=document.getElementById("pax");if(pe0)pe0.setAttribute("data-bw-p",pe0.value);'
// Deeplink naar een arrangement dat vandaag niet kan (bijv. Maandagactie op vrijdag): meteen naar de eerste mogelijke dag.
+'if(!D.general&&!new URLSearchParams(location.search).get("date")&&(function(c){return c&&c.dataset.times})(document.querySelector("#cards .card.unavailable[data-code]"))){var pe1=document.getElementById("pax"),p1=pe1?Number(pe1.value):2,s1=D.S[D.code];if(s1){for(var n=1;n<=240;n++){var dt=new Date(D.TODAY+"T12:00:00");dt.setDate(dt.getDate()+n);var k1=dt.getFullYear()+"-"+String(dt.getMonth()+1).padStart(2,"0")+"-"+String(dt.getDate()).padStart(2,"0");if(elig(s1,k1,p1)){naar(k1,p1);break}}}}'
+'})();</script>';
h=h.replace(/<\/head>/i,css+'</head>');
const k=h.lastIndexOf('</body>');h=k>=0?h.slice(0,k)+js+h.slice(k):h+js;
return [{json:{...j,html:h}}];

}).call(__self,__mk(__items)));
// ===== Reserveerknop en vaste tijd =====
__items=__norm(await (async function($input){
const j=$input.first().json||{};let h=String(j.html||'');
let q0={};try{q0=$('GET BUS Booking Widget').first().json.query||{}}catch(e){}
let svcs=[];try{svcs=$('BUS Engine services').first().json.experiences||[]}catch(e){}
const TODAY=DateTime.now().setZone('Europe/Amsterdam').toFormat('yyyy-MM-dd');
const DATUM=/^\d{4}-\d{2}-\d{2}$/.test(q0.date||'')&&q0.date>=TODAY?q0.date:TODAY;
const PAX=(()=>{let d=2;try{const c=String(q0.arrangement||q0.service_code||q0.service||'').trim();const s=c&&svcs.find(x=>String(x.service_code||'')===c);if(s){const mn=Number(s.min_party_size||1),mx=Number(s.max_party_size||0);if(d<mn)d=mn;if(mx&&d>mx)d=mx}}catch(e){}return Math.max(1,Math.min(50,parseInt(q0.pax||String(d),10)||d))})(); /* 27 nov 2026 */
function elig(s,k){if(PAX<(s.min_party_size||1))return false;if(s.max_party_size&&PAX>s.max_party_size)return false;if(s.local_start_date&&k<s.local_start_date)return false;if(s.local_end_date&&k>s.local_end_date)return false;const wd=Array.isArray(s.week_days)?s.week_days:[];if(wd.length&&!wd.includes(DateTime.fromISO(k).weekday))return false;for(const b of ((s.engine||{}).blackouts||[])){if(b.start_date&&b.end_date&&k>=b.start_date&&k<=b.end_date)return false}return true}
// Eerstvolgende mogelijke dag per arrangement: is de gekozen dag zelf mogelijk (maar vol of voorbij), dan vanaf de dag erna.
const NEXT={};for(const s of svcs){const c=String(s.service_code||'');if(!c)continue;let d=DateTime.fromISO(DATUM);if(elig(s,DATUM))d=d.plus({days:1});for(let n=0;n<400;n++){const k=d.plus({days:n}).toFormat('yyyy-MM-dd');if(elig(s,k)){NEXT[c]=k;break}}}
// Dennis 30 okt 2026:
// (1) Overzicht: geen tijdstip-blok, wel datum; onder elk arrangement de knop "Reserveer" (geen "Selecteer datum").
// (2) Klik op Reserveer = hetzelfde scherm als de deeplink van dat arrangement, met gasten en datum meegenomen.
// (3) Deeplinkscherm: geen extra Reserveren-knop, het boekformulier staat meteen open.
// (4) Precies 1 beschikbaar tijdstip: geen pulldown maar een vaste tijd.
// (6) Kan het arrangement niet op de gekozen dag: Reserveer kiest de eerstvolgende mogelijke dag (zonder melding, Dennis 30 okt).
// (8) Datum altijd links uitgelijnd (iOS centreert een datumveld standaard).
// (7) Mobiel: widget schermvullend, geen gele inklapknop (alleen het kruisje), chatknop weg zolang de widget open is.
// (5) Wordt het paneel gesloten terwijl een arrangement open staat: terug naar het verse overzicht (ook als bus-chat.js nog oud in de browsercache zit).
const css='<style id="bw-reserveer">'
+'body.bw-overzicht form.filters label.bw-tijdrij{display:none!important}'
+'body.bw-overzicht #cards .card .nextdate,body.bw-overzicht #cards .card.unavailable .nextdate,body.bw-overzicht #cards .card .book,body.bw-overzicht #cards .card .booking-form{display:none!important}'
+'body.bw-overzicht #cards .card button.bw-reserveer{display:block!important;width:100%;margin:12px 0 0;padding:14px;border:0;border-radius:8px;background:#1d1d1b!important;color:#fff!important;font:inherit;font-size:16px;font-weight:700;cursor:pointer}'
+'body.bw-overzicht #cards .card button.bw-reserveer:hover{background:#000!important}'
+'body.bw-single #cards .card .body>button.book{display:none!important}'
+'body.bw-single #cards .card .booking-form{display:block!important}'
+'label.bw-tijdrij.bw-vast select#time{display:none!important}'
+'label.bw-tijdrij .bw-tijd-vast{display:none;align-self:center;font-size:16px;color:#1d1d1b}'
+'label.bw-tijdrij.bw-vast .bw-tijd-vast{display:block}'
+'body.bw-single #cards .card .nextdate{background:#1d1d1b!important;color:#fff!important;border-color:#1d1d1b!important}'
+'#date{text-align:left!important}#date::-webkit-date-and-time-value{text-align:left!important;margin:0!important}'
+'</style>';
const js='<script id="bw-reserveer-js">(function(){var NEXT='+JSON.stringify(NEXT).replace(/</g,'')+';'
+'function fmt(k){try{return new Date(k+"T12:00:00").toLocaleDateString("nl-NL",{weekday:"short",day:"numeric",month:"short"})}catch(e){return k}}'
+'function naarDatum(code,k,gekozen){var u=new URL(location.href);var pe=document.getElementById("pax");u.searchParams.set("arrangement",code);if(pe&&pe.value)u.searchParams.set("pax",pe.value);u.searchParams.set("date",k);u.searchParams.delete("gekozen");u.searchParams.delete("time");u.searchParams.delete("choose_date");u.searchParams.set("intent","1");document.body.classList.add("bw-laden");location.href=u.toString()}'
+'try{var hd=parent.document;if(window.parent!==window&&!hd.getElementById("bw-mobiel-host")){var ms=hd.createElement("style");ms.id="bw-mobiel-host";ms.textContent="@media(max-width:639px){#booking-widget-panel{top:0!important;left:0!important;right:0!important;bottom:0!important;height:100dvh!important;max-height:none!important;border-radius:0!important}#booking-widget #bwCollapse{display:none!important}html.booking-widget-open .chat-window-wrapper{display:none!important}}";hd.head.appendChild(ms)}}catch(x){}'
+'var q=new URLSearchParams(location.search);var single=!!(q.get("arrangement")||q.get("service_code")||q.get("service"));'
+'var t=document.getElementById("time");var rij=t&&t.closest?t.closest("label"):null;if(rij)rij.classList.add("bw-tijdrij");'
+'function vast(){if(!t||!rij)return;var opts=[].filter.call(t.options,function(o){return o.value&&!o.disabled});'
+'var sp=rij.querySelector(".bw-tijd-vast");if(!sp){sp=document.createElement("span");sp.className="bw-tijd-vast";t.after(sp)}'
+'if(opts.length===1){t.value=opts[0].value;sp.textContent=opts[0].value;rij.classList.add("bw-vast")}else{rij.classList.remove("bw-vast")}}'
+'vast();if(t){t.addEventListener("change",vast);new MutationObserver(vast).observe(t,{childList:true,subtree:true,attributes:true})}'
+'if(single){document.body.classList.add("bw-single");'
+'try{if(window.parent!==window){var host=parent.document.getElementById("booking-widget");if(host&&host.classList.contains("is-open")){var mo=new MutationObserver(function(){if(host.classList.contains("is-open"))return;mo.disconnect();var u=new URL(location.href);["arrangement","service_code","service","pax","date","time","intent","choose_date"].forEach(function(x){u.searchParams.delete(x)});location.replace(u.toString())});mo.observe(host,{attributes:true,attributeFilter:["class"]})}}}catch(x){}'
+'document.querySelectorAll("#cards .card .booking-form").forEach(function(f){f.style.display="block"});'
+'document.querySelectorAll("#cards .card .body>button.book").forEach(function(b){b.style.display="none"});'
+'document.querySelectorAll("#cards .card .nextdate").forEach(function(b0){var b=b0.cloneNode(true);b0.replaceWith(b);b.removeAttribute("data-date");b.textContent="Reserveer";var card=b.closest(".card"),code=card&&card.dataset.code,de=document.getElementById("date");b.onclick=function(e){e.preventDefault();e.stopImmediatePropagation();if(code&&NEXT[code]&&de){naarDatum(code,NEXT[code],de.value);return}var tr=document.getElementById("dateTrigger"),box=document.getElementById("busCal");if(tr&&box&&box.hidden)tr.click();try{(tr||b).scrollIntoView({block:"center",behavior:"smooth"})}catch(x){}}});'
+'return}'
+'if(!document.getElementById("cards"))return;document.body.classList.add("bw-overzicht");'
+'document.querySelectorAll("#cards .card[data-code]").forEach(function(c){var body=c.querySelector(".body");if(!body||body.querySelector(".bw-reserveer"))return;'
+'var b=document.createElement("button");b.type="button";b.className="bw-reserveer";b.textContent="Reserveer";body.appendChild(b);'
+'b.addEventListener("click",function(e){e.preventDefault();e.stopPropagation();var de=document.getElementById("date"),k=de&&de.value,code=c.dataset.code;'
+'if(c.classList.contains("unavailable")&&NEXT[code]){naarDatum(code,NEXT[code],k);return}naarDatum(code,k,"")})});'
+'})();</script>';
h=h.replace(/<\/head>/i,css+'</head>');
const k=h.lastIndexOf('</body>');h=k>=0?h.slice(0,k)+js+h.slice(k):h+js;
return [{json:{...j,html:h}}];

}).call(__self,__mk(__items)));
// ===== Categorieën en M&E pilot =====
__items=__norm(await (async function($input){
// 31 okt 2026: categorieen + EEN centrale M&E-renderer (bedrijfsuitjes, vergaderingen, bruiloften).
// Vervangt de losse patchnodes (endpoint-fix, host-gedrag, detail-UX, restaurantlink, datumveld, veldhoogte).
// Een state (datum + personen) voor overzicht en aanvraag, een productrequest (cache), beschikbaarheid alleen bij optie.
// KMT blijft de bron: alle data komt uit BtwBGSkEZqKKhJOf (productcache), min/optie worden daar ook server-side afgedwongen.
const j = $input.first().json || {}; let h = String(j.html || ''); let q = {};
try { q = $('GET BUS Booking Widget').first().json.query || {}; } catch (e) {}
const lang = String(q.lang || 'nl').slice(0, 2).toLowerCase();
// 31 okt 2026 (Dennis): Bruiloften voorlopig uit deze widget; Tours & B&B gesplitst in 'B&B arrangementen' en 'Tours, tastings & workshops'.
const CATS = ['restaurant', 'bb', 'tours', 'bedrijfsuitjes', 'vergaderingen', 'whisky'];
let cat = String(q.category || q.type || '').toLowerCase();
if (!CATS.includes(cat)) cat = 'bb';
const D = {
nl:{what:'Wat wil je doen bij BUS?',restaurant:'Restaurant',tours:'Tours & B&B',outings:'Bedrijfsuitjes',meetings:'Vergaderingen',weddings:'Bruiloften',shop:'Whisky kopen',offer:'Vraag offerte',option:'Vraag optie aan',proposal:'Ontvang direct jouw voorstel',sendOption:'Plaats mijn optie',date:'Datum',people:'Aantal personen',company:'Bedrijfsnaam',first:'Voornaam',last:'Achternaam',email:'E-mailadres',phone:'Telefoonnummer',checking:'Beschikbaarheid controleren...',loading:'Arrangementen laden...',sending:'Aanvraag versturen...',noProducts:'Geen arrangementen gevonden.',selectDate:'Kies eerst een datum.',fillPax:'Vul het aantal personen in.',minPeople:'Vanaf {n} personen',belowMin:'Dit arrangement is te boeken vanaf {n} personen.',more:'Lees meer',less:'Lees minder',reviews:'beoordelingen',restLink:'Klik hier voor meer informatie over ons restaurant',notAvail:'Op deze datum is dit arrangement niet beschikbaar voor een optie. Je kunt wel een offerte aanvragen.',available:'Beschikbaar op deze datum.',sentOffer:'Bedankt! Je offerte-aanvraag is ontvangen. Het voorstel komt per mail.',sentOption:'Bedankt! Je optie is geplaatst. De bevestiging komt per mail.',error:'Er ging iets mis. Probeer het opnieuw of bel 0413 229 153.',check:'Controleer de ingevulde gegevens.',video:'Bekijk de video',program:'PROGRAMMA',pers:'pers',recent:'Laatste reviews',bb:'Bed & Breakfast',toursNew:'Tours, tastings & workshops',cancel:'Annuleren'},
en:{what:'What would you like to do at BUS?',restaurant:'Restaurant',tours:'Tours & B&B',outings:'Company outings',meetings:'Meetings',weddings:'Weddings',shop:'Buy whisky',offer:'Request quote',option:'Request option',proposal:'Receive your proposal instantly',sendOption:'Place my option',date:'Date',people:'Number of people',company:'Company name',first:'First name',last:'Last name',email:'Email address',phone:'Phone number',checking:'Checking availability...',loading:'Loading packages...',sending:'Sending request...',noProducts:'No packages found.',selectDate:'Please choose a date first.',fillPax:'Please enter the number of people.',minPeople:'From {n} people',belowMin:'This package is available from {n} people.',more:'Read more',less:'Read less',reviews:'reviews',restLink:'Click here for more information about our restaurant',notAvail:'This package is not available for an option on this date. You can still request a quote.',available:'Available on this date.',sentOffer:'Thank you! Your quote request has been received. The proposal will follow by email.',sentOption:'Thank you! Your option has been placed. The confirmation will follow by email.',error:'Something went wrong. Please try again or call +31 413 229 153.',check:'Please check the details you entered.',video:'Watch the video',program:'PROGRAMME',pers:'people',recent:'Latest reviews',bb:'Bed & Breakfast',toursNew:'Tours, tastings & workshops',cancel:'Cancel'},
de:{what:'Was möchten Sie bei BUS machen?',restaurant:'Restaurant',tours:'Touren & B&B',outings:'Betriebsausflüge',meetings:'Tagungen',weddings:'Hochzeiten',shop:'Whisky kaufen',offer:'Angebot anfragen',option:'Option anfragen',proposal:'Erhalten Sie sofort Ihren Vorschlag',sendOption:'Option platzieren',date:'Datum',people:'Personenzahl',company:'Firmenname',first:'Vorname',last:'Nachname',email:'E-Mail-Adresse',phone:'Telefonnummer',checking:'Verfügbarkeit wird geprüft...',loading:'Arrangements werden geladen...',sending:'Anfrage wird gesendet...',noProducts:'Keine Arrangements gefunden.',selectDate:'Bitte zuerst ein Datum wählen.',fillPax:'Bitte die Personenzahl angeben.',minPeople:'Ab {n} Personen',belowMin:'Dieses Arrangement ist ab {n} Personen buchbar.',more:'Mehr lesen',less:'Weniger lesen',reviews:'Bewertungen',restLink:'Hier klicken für mehr Informationen über unser Restaurant',notAvail:'Dieses Arrangement ist an diesem Datum nicht für eine Option verfügbar. Sie können aber ein Angebot anfragen.',available:'An diesem Datum verfügbar.',sentOffer:'Vielen Dank! Ihre Angebotsanfrage ist eingegangen. Der Vorschlag folgt per E-Mail.',sentOption:'Vielen Dank! Ihre Option ist platziert. Die Bestätigung folgt per E-Mail.',error:'Etwas ist schiefgelaufen. Bitte erneut versuchen oder +31 413 229 153 anrufen.',check:'Bitte prüfen Sie Ihre Angaben.',video:'Video ansehen',program:'PROGRAMM',pers:'Pers.',recent:'Neueste Bewertungen',bb:'Bed & Breakfast',toursNew:'Touren, Tastings & Workshops',cancel:'Abbrechen'},
fr:{what:'Que souhaitez-vous faire chez BUS ?',restaurant:'Restaurant',tours:'Visites & B&B',outings:'Sorties d’entreprise',meetings:'Réunions',weddings:'Mariages',shop:'Acheter du whisky',offer:'Demander un devis',option:'Demander une option',proposal:'Recevez immédiatement votre proposition',sendOption:'Placer mon option',date:'Date',people:'Nombre de personnes',company:'Nom de l’entreprise',first:'Prénom',last:'Nom',email:'Adresse e-mail',phone:'Numéro de téléphone',checking:'Vérification de la disponibilité...',loading:'Chargement des formules...',sending:'Envoi de la demande...',noProducts:'Aucune formule trouvée.',selectDate:'Choisissez d’abord une date.',fillPax:'Indiquez le nombre de personnes.',minPeople:'À partir de {n} personnes',belowMin:'Cette formule est réservable à partir de {n} personnes.',more:'Lire plus',less:'Lire moins',reviews:'avis',restLink:'Cliquez ici pour plus d’informations sur notre restaurant',notAvail:'Cette formule n’est pas disponible en option à cette date. Vous pouvez toutefois demander un devis.',available:'Disponible à cette date.',sentOffer:'Merci ! Votre demande de devis a bien été reçue. La proposition suit par e-mail.',sentOption:'Merci ! Votre option est placée. La confirmation suit par e-mail.',error:'Une erreur est survenue. Réessayez ou appelez le +31 413 229 153.',check:'Vérifiez les informations saisies.',video:'Voir la vidéo',program:'PROGRAMME',pers:'pers.',recent:'Derniers avis',bb:'Formules B&B',toursNew:'Visites, dégustations & ateliers',cancel:'Annuler'},
es:{what:'¿Qué quieres hacer en BUS?',restaurant:'Restaurante',tours:'Tours y B&B',outings:'Eventos de empresa',meetings:'Reuniones',weddings:'Bodas',shop:'Comprar whisky',offer:'Solicitar presupuesto',option:'Solicitar opción',proposal:'Recibe tu propuesta al instante',sendOption:'Reservar mi opción',date:'Fecha',people:'Número de personas',company:'Empresa',first:'Nombre',last:'Apellidos',email:'Correo electrónico',phone:'Teléfono',checking:'Comprobando disponibilidad...',loading:'Cargando paquetes...',sending:'Enviando solicitud...',noProducts:'No se encontraron paquetes.',selectDate:'Elige primero una fecha.',fillPax:'Indica el número de personas.',minPeople:'Desde {n} personas',belowMin:'Este paquete se puede reservar a partir de {n} personas.',more:'Leer más',less:'Leer menos',reviews:'opiniones',restLink:'Haz clic aquí para más información sobre nuestro restaurante',notAvail:'Este paquete no está disponible como opción en esta fecha. Sí puedes solicitar un presupuesto.',available:'Disponible en esta fecha.',sentOffer:'¡Gracias! Hemos recibido tu solicitud de presupuesto. La propuesta llegará por correo.',sentOption:'¡Gracias! Tu opción está reservada. La confirmación llegará por correo.',error:'Algo salió mal. Inténtalo de nuevo o llama al +31 413 229 153.',check:'Revisa los datos introducidos.',video:'Ver el vídeo',program:'PROGRAMA',pers:'pers.',recent:'Últimas opiniones',bb:'Paquetes B&B',toursNew:'Visitas, catas y talleres',cancel:'Cancelar'},
zh:{what:'您想在 BUS 做什么？',restaurant:'餐厅',tours:'参观与住宿',outings:'企业活动',meetings:'会议',weddings:'婚礼',shop:'购买威士忌',offer:'索取报价',option:'申请预留',proposal:'立即获取您的方案',sendOption:'提交预留',date:'日期',people:'人数',company:'公司名称',first:'名字',last:'姓氏',email:'电子邮箱',phone:'电话号码',checking:'正在检查可用性...',loading:'正在加载套餐...',sending:'正在发送...',noProducts:'未找到套餐。',selectDate:'请先选择日期。',fillPax:'请填写人数。',minPeople:'{n} 人起',belowMin:'此套餐最少 {n} 人可订。',more:'阅读更多',less:'收起',reviews:'条评价',restLink:'点击此处了解我们餐厅的更多信息',notAvail:'该日期此套餐无法预留。您仍可索取报价。',available:'该日期可预订。',sentOffer:'谢谢！我们已收到您的报价请求，方案将通过电子邮件发送。',sentOption:'谢谢！您的预留已提交，确认将通过电子邮件发送。',error:'出现问题。请重试或致电 +31 413 229 153。',check:'请检查填写的信息。',video:'观看视频',program:'行程',pers:'人',recent:'最新评价',bb:'住宿套餐',toursNew:'参观、品鉴与工作坊',cancel:'取消'},
pl:{what:'Co chcesz zrobić w BUS?',restaurant:'Restauracja',tours:'Wycieczki i B&B',outings:'Imprezy firmowe',meetings:'Spotkania',weddings:'Wesela',shop:'Kup whisky',offer:'Poproś o ofertę',option:'Poproś o opcję',proposal:'Otrzymaj propozycję od razu',sendOption:'Złóż opcję',date:'Data',people:'Liczba osób',company:'Nazwa firmy',first:'Imię',last:'Nazwisko',email:'Adres e-mail',phone:'Telefon',checking:'Sprawdzanie dostępności...',loading:'Ładowanie pakietów...',sending:'Wysyłanie...',noProducts:'Nie znaleziono pakietów.',selectDate:'Najpierw wybierz datę.',fillPax:'Podaj liczbę osób.',minPeople:'Od {n} osób',belowMin:'Ten pakiet można zarezerwować od {n} osób.',more:'Czytaj więcej',less:'Zwiń',reviews:'opinii',restLink:'Kliknij tutaj, aby dowiedzieć się więcej o naszej restauracji',notAvail:'Ten pakiet nie jest dostępny jako opcja w tym dniu. Możesz jednak poprosić o ofertę.',available:'Dostępne w tym dniu.',sentOffer:'Dziękujemy! Otrzymaliśmy prośbę o ofertę. Propozycja przyjdzie e-mailem.',sentOption:'Dziękujemy! Opcja została złożona. Potwierdzenie przyjdzie e-mailem.',error:'Coś poszło nie tak. Spróbuj ponownie lub zadzwoń +31 413 229 153.',check:'Sprawdź wprowadzone dane.',video:'Obejrzyj film',program:'PROGRAM',pers:'os.',recent:'Najnowsze opinie',bb:'Pakiety B&B',toursNew:'Zwiedzanie, degustacje i warsztaty',cancel:'Anuluj'},
cs:{what:'Co chcete v BUS podniknout?',restaurant:'Restaurace',tours:'Prohlídky a B&B',outings:'Firemní akce',meetings:'Porady',weddings:'Svatby',shop:'Koupit whisky',offer:'Vyžádat nabídku',option:'Vyžádat opci',proposal:'Získejte návrh okamžitě',sendOption:'Zadat opci',date:'Datum',people:'Počet osob',company:'Název firmy',first:'Jméno',last:'Příjmení',email:'E-mail',phone:'Telefon',checking:'Ověřujeme dostupnost...',loading:'Načítání balíčků...',sending:'Odesílání...',noProducts:'Nebyly nalezeny žádné balíčky.',selectDate:'Nejprve zvolte datum.',fillPax:'Zadejte počet osob.',minPeople:'Od {n} osob',belowMin:'Tento balíček lze rezervovat od {n} osob.',more:'Číst více',less:'Číst méně',reviews:'hodnocení',restLink:'Klikněte zde pro více informací o naší restauraci',notAvail:'Tento balíček není v tento den dostupný jako opce. Můžete si však vyžádat nabídku.',available:'V tento den dostupné.',sentOffer:'Děkujeme! Vaši žádost o nabídku jsme přijali. Návrh přijde e-mailem.',sentOption:'Děkujeme! Vaše opce je zadána. Potvrzení přijde e-mailem.',error:'Něco se pokazilo. Zkuste to znovu nebo volejte +31 413 229 153.',check:'Zkontrolujte zadané údaje.',video:'Přehrát video',program:'PROGRAM',pers:'os.',recent:'Nejnovější hodnocení',bb:'Balíčky B&B',toursNew:'Prohlídky, degustace a workshopy',cancel:'Zrušit'},
ko:{what:'BUS에서 무엇을 하고 싶으신가요?',restaurant:'레스토랑',tours:'투어 & B&B',outings:'기업 행사',meetings:'회의',weddings:'웨딩',shop:'위스키 구매',offer:'견적 요청',option:'옵션 요청',proposal:'즉시 제안서를 받아보세요',sendOption:'옵션 신청',date:'날짜',people:'인원',company:'회사명',first:'이름',last:'성',email:'이메일',phone:'전화번호',checking:'가능 여부 확인 중...',loading:'상품 불러오는 중...',sending:'요청 전송 중...',noProducts:'상품을 찾을 수 없습니다.',selectDate:'먼저 날짜를 선택하세요.',fillPax:'인원을 입력하세요.',minPeople:'{n}명부터',belowMin:'이 상품은 {n}명부터 예약할 수 있습니다.',more:'더 보기',less:'접기',reviews:'개의 리뷰',restLink:'레스토랑에 대한 자세한 정보는 여기를 클릭하세요',notAvail:'이 날짜에는 이 상품의 옵션이 불가합니다. 견적은 요청하실 수 있습니다.',available:'이 날짜에 가능합니다.',sentOffer:'감사합니다! 견적 요청이 접수되었습니다. 제안서는 이메일로 발송됩니다.',sentOption:'감사합니다! 옵션이 신청되었습니다. 확인은 이메일로 발송됩니다.',error:'문제가 발생했습니다. 다시 시도하거나 +31 413 229 153으로 전화하세요.',check:'입력한 정보를 확인하세요.',video:'동영상 보기',program:'프로그램',pers:'명',recent:'최근 리뷰',bb:'B&B 패키지',toursNew:'투어, 시음 & 워크숍',cancel:'취소'},
vi:{what:'Bạn muốn làm gì tại BUS?',restaurant:'Nhà hàng',tours:'Tour & B&B',outings:'Sự kiện công ty',meetings:'Họp',weddings:'Đám cưới',shop:'Mua whisky',offer:'Yêu cầu báo giá',option:'Yêu cầu giữ chỗ',proposal:'Nhận đề xuất ngay lập tức',sendOption:'Gửi yêu cầu giữ chỗ',date:'Ngày',people:'Số người',company:'Tên công ty',first:'Tên',last:'Họ',email:'Email',phone:'Số điện thoại',checking:'Đang kiểm tra...',loading:'Đang tải gói...',sending:'Đang gửi...',noProducts:'Không tìm thấy gói phù hợp.',selectDate:'Vui lòng chọn ngày trước.',fillPax:'Vui lòng nhập số người.',minPeople:'Từ {n} người',belowMin:'Gói này đặt được từ {n} người.',more:'Xem thêm',less:'Thu gọn',reviews:'đánh giá',restLink:'Nhấn vào đây để biết thêm về nhà hàng của chúng tôi',notAvail:'Gói này không thể giữ chỗ vào ngày này. Bạn vẫn có thể yêu cầu báo giá.',available:'Còn chỗ vào ngày này.',sentOffer:'Cảm ơn! Chúng tôi đã nhận yêu cầu báo giá. Đề xuất sẽ được gửi qua email.',sentOption:'Cảm ơn! Yêu cầu giữ chỗ đã được ghi nhận. Xác nhận sẽ được gửi qua email.',error:'Đã xảy ra lỗi. Vui lòng thử lại hoặc gọi +31 413 229 153.',check:'Vui lòng kiểm tra thông tin.',video:'Xem video',program:'CHƯƠNG TRÌNH',pers:'người',recent:'Đánh giá mới nhất',bb:'Gói B&B',toursNew:'Tour, thử rượu & workshop',cancel:'Hủy'}
};
const t = D[lang] || D.nl;
h = h.replace(/<html lang="[^"]*"/i, '<html lang="' + lang + '"');
const opts = [['restaurant', t.restaurant], ['bb', t.bb], ['tours', t.toursNew], ['bedrijfsuitjes', t.outings], ['vergaderingen', t.meetings], ['whisky', t.shop]]
  .map(x => '<option value="' + x[0] + '"' + (x[0] === cat ? ' selected' : '') + '>' + x[1] + '</option>').join('');
// Bij een deeplink is het arrangement al gekozen: verberg alleen de categorie-selector.
 // Laat de select in de DOM staan voor taal-sync en bestaande client-side navigatielogica.
const directArrangement = !!String(q.arrangement || q.service_code || q.service || '').trim();
const row = '<label class="filter bw-category"' + (directArrangement ? ' style="display:none!important"' : '') + '><span class="ico">◆</span><select id="bwCategory" aria-label="' + t.what + '">' + opts + '</select><span class="arr arr-empty"></span></label>';
const ME = ['bedrijfsuitjes', 'vergaderingen'].includes(cat);
h = h.replace('<form class="filters">', '<form class="filters">' + row + (ME ? '<div class="bw-sel-top" id="bwSelTop"></div>' : ''));
const API = 'https://buswhiskyevents.app.n8n.cloud/webhook/bus-me-widget/';
const cfg = JSON.stringify({ lang, cat, me: ME, api: API, t }).replace(/</g, '\\u003c');

// Categoriekeuze (alle categorieen) en Guestplan-filter voor restaurant/tours: ongewijzigd gedrag.
const baseJs = `<script id="bw-cat-js">(function(){var C=${cfg};var sel=document.getElementById('bwCategory');if(!sel)return;sel.addEventListener('change',function(){var u=new URL(location.href);u.searchParams.set('category',this.value);u.searchParams.set('lang',C.lang);u.searchParams.set('intent','1');try{window.parent.__busBoekIntent=Date.now()}catch(e){}['arrangement','service','service_code'].forEach(function(k){u.searchParams.delete(k)});location.href=u.toString()});try{if(window.parent!==window){var pl=(window.parent.document.documentElement.lang||'').slice(0,2).toLowerCase();if(pl&&pl!==C.lang){var u=new URL(location.href);u.searchParams.set('lang',pl);location.replace(u.toString());return}}}catch(e){}if(['restaurant','bb','tours'].includes(C.cat)){var G={restaurant:['CewjJvV','4cSbXnj','GhDVYP4'],tours:['42SA1mn','Fc7ZW1','8qDW2f7','VQqxkyQ','PW7hBwF','Uc6FXYq']};function groep(c){var k=c.dataset.kind||'',code=c.dataset.code||'',t=(c.dataset.title||'').toLowerCase();if(k==='restaurant'||G.restaurant.indexOf(code)>=0)return 'restaurant';if(k==='rondleiding'||k==='proeverij'||G.tours.indexOf(code)>=0)return 'tours';if(/workshop|proeverij|tasting|rondleiding|stoken|event/.test(t))return 'tours';if(/lunch/.test(t))return 'restaurant';return 'bb'}var q=new URLSearchParams(location.search),dl=q.get('arrangement')||q.get('service_code')||q.get('service');var cs=[].slice.call(document.querySelectorAll('#cards .card'));if(dl){var hit=cs.filter(function(c){return c.dataset.code===dl})[0];if(hit){var g=groep(hit);if(sel.value!==g){sel.value=g;if(window.__bwDdSync)window.__bwDdSync()}}}else{cs.forEach(function(c){c.style.display=groep(c)===C.cat?'':'none'})}var dv=document.querySelector('.divider');if(dv&&!dl)dv.textContent=sel.options[sel.selectedIndex].text}})();</script>`;
if (!ME) { h = h.replace('</body>', baseJs + '</body>'); return [{ json: { ...j, html: h } }]; }

// ---------- M&E ----------
h = h.replace(/<html([^>]*)>/i, (m, a) => /class="/.test(a) ? m.replace('class="', 'class="bw-me ') : '<html' + a + ' class="bw-me">');
h = h.replace('<section id="cards">', '<section id="cards"><div class="bw-me-msg">' + t.loading + '</div>');
// Deeplink met categorie (pagina-URL bevat category=): reserveerpaneel niet laten wegklikken door de auto-open-bewaking.
const early = `<script id="bw-me-intent">(function(){try{var p=window.parent;if(p===window)return;if(/[?&]category=(bedrijfsuitjes|vergaderingen|bruiloften)\\b/.test(p.location.search))p.__busBoekIntent=Date.now()}catch(e){}})();</script>`;
h = h.replace(/<head([^>]*)>/i, m => m + early);
const css = `<style id="bw-me-css">
html.bw-me #cards>:not(.bw-me-card):not(.bw-me-msg){display:none!important}
html.bw-me .filters .filter:not(.bw-category){display:none!important}
html.bw-me .note,html.bw-me .gift-buy,html.bw-me .gift-modal-backdrop{display:none!important}
.bw-sel-top{padding:12px 14px;border-top:1px solid #d8d1c7}
.bw-sel{display:grid;grid-template-columns:1fr 1fr;gap:8px;text-align:left}
.bw-sel.single{grid-template-columns:1fr}
.bw-sel label{display:block;font-size:12px;font-weight:700;color:#625d56;margin:0}
.bw-sel input{display:block;box-sizing:border-box;width:100%;height:50px;min-height:50px;margin:5px 0 0;padding:0 12px;border:1px solid #d8d1c7;border-radius:7px;background:#fff;color:#1d1d1b;font:600 16px/48px -apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif;text-align:left;-webkit-appearance:none;appearance:none;box-shadow:none}
.bw-sel input::-webkit-date-and-time-value{text-align:left;margin:0}
.bw-sel input.bw-bad{border-color:#8b2727;background:#fff6f6}
.bw-warn{grid-column:1/-1;color:#8b2727;font-size:13px;font-weight:700;margin:2px 0 0}
.bw-me-msg{text-align:center;padding:25px;color:#625d56}
.bw-me-card .media{position:relative}
html.bw-me .bw-me-card .media.has-rev .price{bottom:45px!important}
.bw-rev{position:absolute;right:10px;bottom:10px;z-index:6;display:flex;align-items:center;gap:6px;background:rgba(17,17,17,.82);color:#fff;border-radius:8px;padding:6px 9px;font-size:13px;line-height:1;box-shadow:0 3px 12px #0004;max-width:calc(100% - 20px)}
.bw-rev b{font-size:15px;font-weight:800}.bw-rev .st{color:#C9A227;font-size:14px}.bw-rev span{opacity:.9;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.bw-min{display:flex;justify-content:center;flex-wrap:nowrap;gap:0 12px;font-size:13px;font-weight:600;line-height:1.3;color:#5f7a62;margin:0 0 6px;min-width:0;white-space:nowrap}.bw-min .mi{display:inline-flex;align-items:center;gap:4px;white-space:nowrap;flex:none;min-width:0}.bw-min .mi.ms{flex:0 1 auto;overflow:hidden}.bw-min .ms .t{overflow:hidden;text-overflow:ellipsis;min-width:0}.bw-min svg{width:15px;height:15px;flex:none;opacity:.9}@media(max-width:380px){.bw-min{gap:0 9px;font-size:12px}.bw-min svg{width:14px;height:14px}}
.bw-me-detail-acts{margin:12px 0 0}.bw-me-detail-acts .bw-me-actions{margin:0}
.bw-recent{margin:12px 0 0;padding:12px 14px;background:#fff;border:1px solid #e6dfd5;border-radius:8px;text-align:left}.bw-recent .rt{font-weight:800;margin:0 0 10px;color:#1d1d1b;font-size:14px}.bw-recent .ri+.ri{margin-top:10px;padding-top:10px;border-top:1px solid #eee7dc}.bw-recent .rm{font-size:12px;line-height:1.35;color:#6f6a63;margin:0 0 3px}.bw-recent .rx{font-size:14px;line-height:1.45;color:#333;white-space:pre-line}
.bw-me-more{display:block;margin:2px auto 8px;border:0;background:transparent;color:#555;text-decoration:underline;font:inherit;font-size:14px;cursor:pointer;padding:4px 8px}
.bw-me-detail{margin:6px 2px 12px}
.bw-prog{padding:12px 14px;background:#faf7f2;border:1px solid #e6dfd5;border-radius:8px;color:#333;font-size:14px;line-height:1.5;text-align:left}
.bw-prog .pt{font-weight:800;margin:0 0 12px}.bw-prog .it{margin:0 0 14px}.bw-prog .tm{font-weight:800}.bw-prog .op{font-weight:800;margin:10px 0 2px}.bw-prog .tx{margin:2px 0 0}.bw-prog .dis{margin:14px 0 2px;font-style:italic;color:#555}
.bw-prog .rl{margin:12px 0 14px}.bw-prog .rl a{color:#8a673f;text-decoration:underline;text-underline-offset:3px;font-weight:800}
.bw-yt{position:relative;display:block;width:100%;aspect-ratio:16/9;margin:10px 0 0;border:0;border-radius:8px;overflow:hidden;background:#000 center/cover no-repeat;cursor:pointer;padding:0}
.bw-yt:before{content:'';position:absolute;left:50%;top:50%;width:64px;height:44px;margin:-22px 0 0 -32px;border-radius:12px;background:rgba(17,17,17,.85)}
.bw-yt:after{content:'';position:absolute;left:50%;top:50%;margin:-10px 0 0 -6px;border-style:solid;border-width:10px 0 10px 17px;border-color:transparent transparent transparent #fff}
.bw-yt span{position:absolute;left:0;right:0;bottom:0;padding:8px 10px;color:#fff;font-size:13px;font-weight:700;text-align:left;background:linear-gradient(transparent,rgba(0,0,0,.7))}
iframe.bw-yt{cursor:auto}iframe.bw-yt:before,iframe.bw-yt:after{display:none}
.bw-me-status{font-size:13px;font-weight:700;margin:7px 0;text-align:center}.bw-me-status.ok{color:#24783b}.bw-me-status.no{color:#8b2727}.bw-me-status:empty{display:none}
.bw-me-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px}
.bw-me-actions button,.bw-me-form button[type=submit]{border:0;border-radius:7px;background:#1d1d1b;color:#fff;padding:13px 8px;font:inherit;font-weight:800;cursor:pointer}
.bw-me-form{margin-top:10px}.bw-me-form[hidden],.bw-me-actions[hidden],.bw-me-detail[hidden],.bw-warn[hidden]{display:none!important}
.bw-me-form .bw-sel{margin:0 0 10px}
.bw-me-form .row2{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.bw-me-form .fld{width:100%;box-sizing:border-box;height:50px;padding:0 12px;margin:0 0 8px;border:1px solid #d8d1c7;border-radius:7px;font:inherit;font-size:16px;background:#fff}
.bw-me-form button[type=submit]{width:100%;padding:14px}.bw-me-form button[disabled]{opacity:.6}
.bw-me-cancel{display:block;margin:8px auto 0;border:0;background:transparent;color:#625d56;text-decoration:underline;font:inherit;font-size:13px;cursor:pointer}
@media(max-width:360px){.bw-sel,.bw-me-form .row2{grid-template-columns:1fr}}
</style>`;
h = h.replace('</head>', css + '</head>');

const meJs = `<script id="bw-me-js">(function(){
var C=${cfg},T=C.t,W=C.cat==='bruiloften',doc=document;
var cards=doc.getElementById('cards'),topSel=doc.getElementById('bwSelTop');if(!cards)return;
var div=doc.querySelector('.divider');if(div)div.textContent=C.cat==='bedrijfsuitjes'?T.outings:T.meetings;
function esc(x){return String(x==null?'':x).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function fmt(s,n){return String(s).replace('{n}',n)}
function today(){var d=new Date();d.setMinutes(d.getMinutes()-d.getTimezoneOffset());return d.toISOString().slice(0,10)}
// ---- centrale state: datum + personen, een bron voor overzicht en aanvraag ----
var url=new URL(location.href),ss={};try{ss=JSON.parse(sessionStorage.getItem('bwMeSel')||'{}')}catch(e){}
var S={date:'',pax:'',products:[],byId:{},check:{}};
var qd=url.searchParams.get('date')||ss.date||'';S.date=/^\\d{4}-\\d{2}-\\d{2}$/.test(qd)&&qd>=today()?qd:'';
var qp=parseInt(url.searchParams.get('pax')||ss.pax||'',10);S.pax=qp>0?String(qp):'';
function persist(){try{sessionStorage.setItem('bwMeSel',JSON.stringify({date:S.date,pax:S.pax}))}catch(e){}var u=new URL(location.href);S.date?u.searchParams.set('date',S.date):u.searchParams.delete('date');(!W&&S.pax)?u.searchParams.set('pax',S.pax):u.searchParams.delete('pax');try{history.replaceState(history.state,'',u.toString())}catch(e){}}
var MINPH={nl:'minimaal {n}',en:'at least {n}',de:'mindestens {n}',fr:'au moins {n}',es:'mínimo {n}',zh:'至少 {n}',pl:'co najmniej {n}',cs:'nejméně {n}',ko:'최소 {n}',vi:'tối thiểu {n}'};
// Datum: keuze van de gast, anders de eerstvolgende mogelijkheid van dit arrangement (KMT-feed).
function dOf(p){return S.date||(p&&p.first_date)||''}
function minAll(){var m=0;S.products.forEach(function(x){var v=+x.min_people||0;if(v&&(!m||v<m))m=v});return m}
function selHtml(p){var min=p?p.min_people:1,fd=(p&&p.first_date)||'',ph=p?fmt(MINPH[C.lang]||MINPH.nl,min):'';return '<div class="bw-sel'+(W?' single':'')+'"'+(p?' data-min="'+min+'"':'')+'><label>'+esc(T.date)+'<input type="date" class="bw-d" min="'+today()+'"'+(fd?' data-fd="'+fd+'"':'')+' value="'+esc(S.date||fd)+'" required></label>'+(W?'':'<label>'+esc(T.people)+'<input type="number" class="bw-p" inputmode="numeric" min="'+min+'" max="1000" step="1"'+(ph?' placeholder="'+esc(ph)+'"':'')+' value="'+esc(S.pax)+'" required></label>')+'<div class="bw-warn" hidden></div></div>'}
function sync(src){doc.querySelectorAll('.bw-d').forEach(function(i){var v=S.date||i.dataset.fd||'';if(i!==src&&i.value!==v)i.value=v});doc.querySelectorAll('.bw-p').forEach(function(i){if(i!==src&&i.value!==S.pax)i.value=S.pax});doc.querySelectorAll('.bw-sel[data-min]').forEach(function(s){var min=+s.dataset.min,w=s.querySelector('.bw-warn'),pi=s.querySelector('.bw-p');var bad=!W&&S.pax!==''&&+S.pax<min;if(pi)pi.classList.toggle('bw-bad',bad);w.hidden=!bad;w.textContent=bad?fmt(T.belowMin,min):''});doc.querySelectorAll('.bw-me-card').forEach(function(c){var k=c.dataset.kind;if(k==='optie'){var key=dOf(S.byId[c.dataset.id])+'|'+S.pax+'|'+c.dataset.id;if(c.dataset.checked&&c.dataset.checked!==key){c.dataset.checked='';setStatus(c,'')}}})}
function onSel(e){var i=e.target;if(i.classList.contains('bw-d')){S.date=i.value}else if(i.classList.contains('bw-p')){S.pax=i.value.replace(/[^0-9]/g,'')}else return;sync(i);persist();clearTimeout(S.recheck);S.recheck=setTimeout(recheck,600)}
// Open optieformulier: na invullen van datum/personen zelf opnieuw (een keer) KMT-beschikbaarheid checken, geen oude foutmelding laten staan.
function recheck(){doc.querySelectorAll('.bw-me-card[data-kind="optie"]').forEach(function(c){var f=c.querySelector('.bw-me-form'),p=S.byId[c.dataset.id];if(!p||!f||f.hidden)return;var d=dOf(p),n=+S.pax;if(d&&d>=today()&&(W||n>=p.min_people))avail(p,c);else setStatus(c,'')})}
doc.addEventListener('input',onSel);doc.addEventListener('change',onSel);
if(topSel){topSel.innerHTML=selHtml(null)}
function topMin(){if(!topSel)return;var m=minAll(),pi=topSel.querySelector('.bw-p'),di=topSel.querySelector('.bw-d'),fd='';S.products.forEach(function(x){if(x.first_date&&(!fd||x.first_date<fd))fd=x.first_date});if(pi&&m)pi.placeholder=fmt(MINPH[C.lang]||MINPH.nl,m);if(di&&fd){di.dataset.fd=fd;if(!S.date)di.value=fd}}
// ---- programma uit KMT program_text ----
var TIME=/^(\\d{1,2}[.:]\\d{2}(?:\\s*(?:uur|uhr|h|hrs?|heures?|godz\\.?|hod\\.?|giờ|시))?)\\s*(.*)$/i;
var OPT=/^(optie|option|opción|opcja|možnost|옵션|tùy chọn|选项)\\s*\\d*\\s*[:：]/i;
var REST=/(?:https?:\\/\\/)?(?:www\\.)?buswhisky\\.com\\/(?:[a-z]{2}\\/)?(?:boerderij)?restaurant\\/?/i;
var END=/^(einde|end|ende|fin|koniec|konec|kết thúc|结束|종료)/i;
function line(l,rest){if(REST.test(l))return '<div class="rl"><a href="'+esc(rest)+'" target="_blank" rel="noopener">'+esc(T.restLink)+'</a></div>';return '<div class="tx">'+esc(l)+'</div>'}
function program(raw,rest){var L=String(raw||'').split(/\\n+/).map(function(x){return x.trim()}).filter(Boolean);if(!L.length)return '';var o=[],i=0,head=T.program;if(L[0].length<24&&!/\\d/.test(L[0])&&!TIME.test(L[0])&&L[0]===L[0].toUpperCase()){head=L[0].replace(/:$/,'');i=1}o.push('<div class="pt">'+esc(head)+'</div>');
while(i<L.length){var l=L[i],m=l.match(TIME);if(m){var title=m[2]||'';i++;if(!title&&i<L.length&&!TIME.test(L[i])&&!OPT.test(L[i]))title=L[i++];var body=[];while(i<L.length&&!TIME.test(L[i])&&!OPT.test(L[i]))body.push(L[i++]);var end=END.test(title);o.push('<div class="it"><div><span class="tm">'+esc(m[1])+'</span> '+esc(title)+'</div>'+(body.length?(end?'<div class="dis">'+body.map(esc).join('<br>')+'</div>':body.map(function(b){return line(b,rest)}).join('')):'')+'</div>');continue}
if(OPT.test(l)){o.push('<div class="op">'+esc(l)+'</div>');i++;var bd=[];while(i<L.length&&!TIME.test(L[i])&&!OPT.test(L[i]))bd.push(L[i++]);o.push(bd.map(function(b){return line(b,rest)}).join(''));continue}
o.push(line(l,rest));i++}return '<div class="bw-prog">'+o.join('')+'</div>'}
// ---- kaarten ----
function rev(p){if(!(p.review_score>0))return '';var sc=Number(p.review_score).toLocaleString(C.lang,{minimumFractionDigits:1,maximumFractionDigits:1});return '<div class="bw-rev" aria-label="'+esc(sc+' / '+(p.review_scale||10))+'"><i class="st">★</i><b>'+esc(sc)+'</b>'+(p.review_count>0?'<span>'+esc(p.review_count+' '+T.reviews)+'</span>':'')+'</div>'}
function kort(x){return String(x).replace(/\\s+-\\s+/g,' - ').replace(/\\b(januari|februari|maart|april|mei|juni|juli|augustus|september|oktober|november|december|january|february|march|june|july|august|october|januar|februar|oktober|dezember)\\b/gi,function(m){return m.length>4?m.slice(0,3):m})}
function meta(p){var b=[],mn=+p.min_people||0,mx=+p.max_people||0,IP='<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0 2c-3.3 0-7 1.7-7 4.5V20h14v-2.5C16 14.7 12.3 13 9 13zm8-2a3.5 3.5 0 1 0-1.6-6.6A5.9 5.9 0 0 1 15 11.1c.6.1 1.3-.1 2-.1zm1.3 2.2c1.6.9 2.7 2.3 2.7 4.3V20h3v-2.5c0-2.3-2.7-3.8-5.7-4.3z"/></svg>',IS='<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7 2h2v2h6V2h2v2h3a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3V2zm12 8H5v9h14v-9zM5 8h14V6H5v2z"/></svg>',IA='<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7 2h1.5v6.2c0 .9.5 1.6 1.2 1.9V2h1.5v8.1c.7-.3 1.3-1 1.3-1.9V2H14v6.2c0 1.9-1.3 3.4-3 3.8V22H9.2V12C7.4 11.6 6 10.1 6 8.2V2h1zm11.8 0c1.5 0 2.7 2.4 2.7 5.4 0 2.4-.8 4.3-2 5V22h-1.8v-9.6c-1.2-.7-2-2.6-2-5C15.9 4.4 17.2 2 18.8 2z"/></svg>',AI={nl:'all-in',en:'all-inclusive',de:'All-inclusive',fr:'tout compris',es:'todo incluido',zh:'全包',pl:'all-inclusive',cs:'all-inclusive',ko:'올인클루시브',vi:'trọn gói'};var pp=(mn&&mx&&mx>=mn)?mn+'–'+mx+' '+T.pers:(mn?fmt(T.minPeople,mn):'');if(pp)b.push('<span class="mi">'+IP+esc(pp)+'</span>');if(p.season_label)b.push('<span class="mi ms">'+IS+'<span class="t">'+esc(kort(p.season_label))+'</span></span>');if(p.all_inclusive)b.push('<span class="mi">'+IA+esc(AI[C.lang]||AI.nl)+'</span>');return b.length?'<div class="bw-min">'+b.join('')+'</div>':''}
function recent(p){var r=Array.isArray(p.recent_reviews)?p.recent_reviews.slice(0,5):[];if(!r.length)return '';return '<div class="bw-recent"><div class="rt">'+esc(T.recent)+'</div>'+r.map(function(x){var m=[];if(x.date)m.push(x.date);if(x.name)m.push(x.name+(x.party_size?' ('+x.party_size+' '+T.pers+')':''));return '<div class="ri"><div class="rm">'+esc(m.join(' · '))+'</div><div class="rx">'+esc(x.text)+'</div></div>'}).join('')+'</div>'}
function card(p){var yt=p.youtube_id?'<button type="button" class="bw-yt" data-yt="'+esc(p.youtube_id)+'" style="background-image:url(https://i.ytimg.com/vi/'+esc(p.youtube_id)+'/hqdefault.jpg)" aria-label="'+esc(T.video)+'"><span>'+esc(T.video)+'</span></button>':'';var prog=program(p.program_text,p.restaurant_url);var rv=recent(p);var acts='<div class="bw-me-actions"><button type="button" data-kind="offerte">'+esc(T.offer)+'</button><button type="button" data-kind="optie">'+esc(T.option)+'</button></div>';var detail=(prog||rv||yt)?'<button type="button" class="bw-me-more" data-more>'+esc(T.more)+'</button><div class="bw-me-detail" hidden>'+prog+'<div class="bw-me-detail-acts">'+acts+'</div>'+rv+yt+'</div>':'';
return '<article class="card bw-me-card" data-id="'+esc(p.product_id)+'"><div class="media'+(p.review_score>0?' has-rev':'')+'">'+(p.image_url?'<img class="photo" src="'+esc(p.image_url)+'" alt="'+esc(p.title)+'" loading="lazy">':'')+rev(p)+(p.price_label?'<div class="price"><span class="now">'+esc(p.price_label)+'</span></div>':'')+'</div><div class="body"><h2>'+esc(p.title)+'</h2><p>'+esc(p.description)+'</p>'+meta(p)+detail+'<div class="bw-me-actions"><button type="button" data-kind="offerte">'+esc(T.offer)+'</button><button type="button" data-kind="optie">'+esc(T.option)+'</button></div><div class="bw-me-status" role="status"></div><form class="bw-me-form" hidden novalidate>'+selHtml(p)+'<div class="row2"><input class="fld" name="first_name" autocomplete="given-name" placeholder="'+esc(T.first)+'"><input class="fld" name="last_name" autocomplete="family-name" placeholder="'+esc(T.last)+'"></div>'+(W?'':'<input class="fld" name="company" autocomplete="organization" placeholder="'+esc(T.company)+'">')+'<input class="fld" name="email" type="email" autocomplete="email" placeholder="'+esc(T.email)+'"><input class="fld" name="phone" type="tel" autocomplete="tel" placeholder="'+esc(T.phone)+'"><button type="submit"></button><button type="button" class="bw-me-cancel">'+esc(T.cancel)+'</button></form></div></article>'}
function setStatus(c,txt,cls){var s=c.querySelector('.bw-me-status');s.textContent=txt||'';s.className='bw-me-status'+(cls?' '+cls:'')}
function render(){var ps=S.products;cards.innerHTML=ps.length?ps.map(card).join(''):'<div class="bw-me-msg">'+esc(T.noProducts)+'</div>';sync(null);var a=url.searchParams.get('arrangement')||url.searchParams.get('product');var c=a&&cards.querySelector('.bw-me-card[data-id="'+CSS.escape(a)+'"]');if(c){cards.insertBefore(c,cards.firstChild);toggleMore(c,true)}try{window.dispatchEvent(new Event('resize'))}catch(e){}}
function toggleMore(c,open){var d=c.querySelector('.bw-me-detail'),b=c.querySelector('[data-more]');if(!d)return;d.hidden=open===undefined?!d.hidden:!open;b.textContent=d.hidden?T.more:T.less}
// ---- validatie (zelfde regels als de server) ----
function valid(p,c){var dd=dOf(p);if(!dd||dd<today()){setStatus(c,T.selectDate,'no');return false}if(!W){var n=+S.pax;if(!S.pax||!(n>=1)){setStatus(c,T.fillPax,'no');return false}if(n<p.min_people){setStatus(c,fmt(T.belowMin,p.min_people),'no');return false}}return true}
function avail(p,c){var key=dOf(p)+'|'+S.pax+'|'+p.product_id;if(c.dataset.checked===key&&c.dataset.avail==='1')return Promise.resolve(true);setStatus(c,T.checking);return fetch(C.api+'availability?product_id='+encodeURIComponent(p.product_id)+'&date='+encodeURIComponent(dOf(p))+'&pax='+encodeURIComponent(W?'':S.pax)).then(function(r){return r.json()}).then(function(o){c.dataset.checked=key;c.dataset.avail=o.available?'1':'0';if(o.code==='MIN_PEOPLE'){setStatus(c,fmt(T.belowMin,o.min_people||p.min_people),'no');return false}setStatus(c,o.available?T.available:T.notAvail,o.available?'ok':'no');return !!o.available}).catch(function(){setStatus(c,T.error,'no');return false})}
function openForm(c,p,kind){c.dataset.kind=kind;var f=c.querySelector('.bw-me-form');f.hidden=false;c.querySelectorAll('.bw-me-actions').forEach(function(x){x.hidden=true});f.querySelector('button[type=submit]').textContent=kind==='optie'?T.sendOption:T.proposal;sync(null);try{f.scrollIntoView({block:'start',behavior:'smooth'})}catch(x){}}
cards.addEventListener('click',function(e){var c=e.target.closest('.bw-me-card');if(!c)return;var p=S.byId[c.dataset.id];if(!p)return;
 if(e.target.closest('[data-more]')){e.preventDefault();toggleMore(c);return}
 var y=e.target.closest('button.bw-yt');if(y){var f=doc.createElement('iframe');f.className='bw-yt';f.src='https://www.youtube-nocookie.com/embed/'+y.dataset.yt+'?autoplay=1&rel=0&playsinline=1';f.allow='autoplay; encrypted-media; picture-in-picture; fullscreen';f.allowFullscreen=true;f.title=T.video;y.replaceWith(f);return}
 if(e.target.closest('.bw-me-cancel')){c.querySelector('.bw-me-form').hidden=true;c.querySelectorAll('.bw-me-actions').forEach(function(x){x.hidden=false});c.dataset.kind='';setStatus(c,'');return}
 var b=e.target.closest('.bw-me-actions button');if(!b)return;var kind=b.dataset.kind;setStatus(c,'');
 if(kind==='offerte'){openForm(c,p,'offerte');return}
 // Optie: eerst realtime KMT-beschikbaarheid; zonder geldige datum/personen eerst die invullen.
 openForm(c,p,'optie');if(W||S.pax){if(valid(p,c))avail(p,c)}});
cards.addEventListener('submit',function(e){var f=e.target.closest('.bw-me-form');if(!f)return;e.preventDefault();var c=f.closest('.bw-me-card'),p=S.byId[c.dataset.id],kind=c.dataset.kind||'offerte';if(!valid(p,c))return;var el=f.elements,need=['first_name','last_name','email','phone'].concat(W?[]:['company']),miss=false;need.forEach(function(n){var v=(el[n].value||'').trim(),bad=!v||(n==='email'&&!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(v));el[n].classList.toggle('bw-bad',bad);if(bad)miss=true});if(miss){setStatus(c,T.check,'no');return}
 var btn=f.querySelector('button[type=submit]');btn.disabled=true;
 var go=kind==='optie'?avail(p,c):Promise.resolve(true);
 go.then(function(ok){if(!ok){btn.disabled=false;return}setStatus(c,T.sending);var body={category:C.cat,product_id:p.product_id,date:dOf(p),pax:W?null:+S.pax,company:el.company?el.company.value.trim():'',first_name:el.first_name.value.trim(),last_name:el.last_name.value.trim(),email:el.email.value.trim(),phone:el.phone.value.trim(),request_type:kind,lang:C.lang};
  return fetch(C.api+'quote',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}).then(function(r){return r.json()}).then(function(o){if(o.succes){setStatus(c,kind==='optie'?T.sentOption:T.sentOffer,'ok');f.hidden=true;try{var tw=window.top;(tw.dataLayer=tw.dataLayer||[]).push({event:'bus_me_'+kind,bus_category:C.cat,bus_product_id:p.product_id,bus_pax:body.pax});if(typeof tw.fbq==='function')tw.fbq('track','Lead',{content_name:p.title_nl,content_category:C.cat,num_items:body.pax||undefined})}catch(x){}return}
   btn.disabled=false;var m=o.code==='MIN_PEOPLE'?fmt(T.belowMin,o.min_people||p.min_people):o.code==='NIET_BESCHIKBAAR'?T.notAvail:o.code==='DATUM'?T.selectDate:(o.code==='VELDEN'||o.code==='PAX')?T.check:T.error;setStatus(c,m,'no')})}).catch(function(){btn.disabled=false;setStatus(c,T.error,'no')})});
fetch(C.api+'products?category='+encodeURIComponent(C.cat)+'&lang='+encodeURIComponent(C.lang)).then(function(r){return r.json()}).then(function(o){S.products=(o.products||[]);S.products.forEach(function(p){S.byId[p.product_id]=p});render();topMin()}).catch(function(){S.products=[];render()});
persist();sync(null);
})();</script>`;
h = h.replace('</body>', baseJs + meJs + '</body>');
return [{ json: { ...j, html: h } }];

}).call(__self,__mk(__items)));
// ===== Dineropties vanaf 15 pers. =====
__items=__norm(await (async function($input){
const j=$input.first().json||{};let h=String(j.html||'');
// 1 nov 2026: bedrijfsuitjes + vergaderingen. Standaard diner kan altijd.
// Pizza, BBQ/barbecue en stamppot zijn pas vanaf 15 personen mogelijk.
// In de uitvouw "Meer info" tonen we dat achter de betreffende dineroptie, tenzij
// het arrangement zelf al een minimum van 15 personen of hoger heeft.
const js=`<script id="bw-diner-min15">(function(){
var Q=new URLSearchParams(location.search),CAT=(Q.get('category')||Q.get('type')||'').toLowerCase();
if(CAT!=='bedrijfsuitjes'&&CAT!=='vergaderingen')return;
var P={nl:'vanaf 15 pers.',en:'from 15 people',de:'ab 15 Pers.',fr:'à partir de 15 pers.',es:'desde 15 pers.',zh:'15 人起',pl:'od 15 os.',cs:'od 15 osob',ko:'15명부터',vi:'từ 15 người'};
function run(){
 var lg=(document.documentElement.lang||'nl').slice(0,2).toLowerCase(),label=P[lg]||P.nl;
 document.querySelectorAll('#cards .bw-me-card').forEach(function(card){
   var meta=card.querySelector('.bw-min'),m=meta&&String(meta.textContent||'').match(/\\d+/),min=m?parseInt(m[0],10):0;
   if(min>=15)return;
   card.querySelectorAll('.bw-me-detail .bw-prog .op,.bw-me-detail .bw-prog .tx').forEach(function(el){
     if(el.dataset.bwDiner15)return;
     var txt=String(el.textContent||'').trim();
     if(!/(pizza|bbq|barbecue|barbeque|stamppot)/i.test(txt))return;
     if(/15\\s*(?:pers\\.?|personen|people|persons|os\\.?|osob|人|명|người)/i.test(txt)){el.dataset.bwDiner15='1';return;}
     el.appendChild(document.createTextNode(' ('+label+')'));
     el.dataset.bwDiner15='1';
   });
 });
}
new MutationObserver(run).observe(document.documentElement,{childList:true,subtree:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
})();</script>`;
if(!h.includes('id="bw-diner-min15"'))h=h.replace('</body>',js+'</body>');
return [{json:{...j,html:h}}];
}).call(__self,__mk(__items)));
// ===== M&E beschikbaarheidskalender =====
__items=__norm(await (async function($input){
const j=$input.first().json||{};let h=String(j.html||'');
const css=`<style id="bw-mec-css">
.bw-mec-native{position:absolute!important;opacity:0!important;pointer-events:none!important;width:1px!important;height:1px!important;min-height:0!important;margin:0!important;padding:0!important}
.bw-mec-trigger{display:flex!important;box-sizing:border-box;width:100%;height:50px;min-height:50px;margin:5px 0 0;padding:0 12px;align-items:center;justify-content:space-between;gap:10px;border:1px solid #d8d1c7;border-radius:7px;background:#fff;color:#1d1d1b;font:600 16px/48px -apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif;cursor:pointer;text-align:left}
.bw-mec-trigger .ci{font-size:17px;color:#8a673f;line-height:1}.bw-mec-trigger .cv{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.bw-mec{grid-column:1/-1;background:#fff;border:1px solid #e6dfd5;border-radius:8px;padding:10px 10px 12px;margin:3px 0 4px}.bw-mec[hidden]{display:none!important}
.bw-mec-head{display:grid;grid-template-columns:38px 1fr 38px;align-items:center;margin:0 0 6px}.bw-mec-head button{border:0;background:transparent;color:#1d1d1b;font:400 27px/38px Arial,sans-serif;cursor:pointer;padding:0}.bw-mec-head button:disabled{opacity:.18;cursor:default}.bw-mec-title{text-align:center;font-size:17px;font-weight:800;text-transform:none}
.bw-mec-week,.bw-mec-grid{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:2px}.bw-mec-week span{text-align:center;color:#777;font-size:12px;padding:5px 0 4px}.bw-mec-day{position:relative;display:grid;place-items:center;aspect-ratio:1;border:0;border-radius:50%;background:transparent;color:#b7b7b7;font:500 20px/1 -apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif;padding:0;cursor:default}.bw-mec-day.open{color:#111;cursor:pointer}.bw-mec-day.open:hover{background:#f3efe8}.bw-mec-day.selected{outline:2px solid #111;outline-offset:-3px}.bw-mec-day.past{color:#d0d0d0!important;cursor:default!important}.bw-mec-empty{visibility:hidden}
@media(max-width:380px){.bw-mec{padding-left:7px;padding-right:7px}.bw-mec-day{font-size:19px}.bw-mec-week span{font-size:11px}}
</style>`;
const js=`<script id="bw-mec-js">(function(){
var Q=new URLSearchParams(location.search),CAT=(Q.get('category')||Q.get('type')||'').toLowerCase();if(CAT!=='bedrijfsuitjes'&&CAT!=='vergaderingen')return;
var API='https://buswhiskyevents.app.n8n.cloud/webhook/bus-me-widget/';var LANG=(Q.get('lang')||document.documentElement.lang||'nl').slice(0,2).toLowerCase();var products=[],byId={},timer=0;
var CH={nl:'Kies datum',en:'Choose date',de:'Datum wählen',fr:'Choisir une date',es:'Elegir fecha',zh:'选择日期',pl:'Wybierz datę',cs:'Vyberte datum',ko:'날짜 선택',vi:'Chọn ngày'};
function td(){var d=new Date();d.setMinutes(d.getMinutes()-d.getTimezoneOffset());return d.toISOString().slice(0,10)}
function iso(y,m,d){return y+'-'+String(m+1).padStart(2,'0')+'-'+String(d).padStart(2,'0')}
function fmt(k){if(!k)return CH[LANG]||CH.nl;try{return new Intl.DateTimeFormat(LANG==='nl'?'nl-NL':LANG,{day:'numeric',month:'short',year:'numeric'}).format(new Date(k+'T12:00:00'))}catch(e){return k}}
function weeks(){var a=[],b=new Date(2026,10,2,12);for(var i=0;i<7;i++){var d=new Date(b);d.setDate(b.getDate()+i);try{a.push(new Intl.DateTimeFormat(LANG==='nl'?'nl-NL':LANG,{weekday:'short'}).format(d).replace('.',''))}catch(e){a.push(['ma','di','wo','do','vr','za','zo'][i])}}return a}
function pax(sel){var a=sel&&sel.querySelector('.bw-p'),b=document.querySelector('#bwSelTop .bw-p');return +(a&&a.value||b&&b.value||0)}
function prod(sel){var c=sel&&sel.closest('.bw-me-card');return c?byId[c.dataset.id]:null}
function fit(p,n){if(!n)return true;var mn=+p.min_people||0,mx=+p.max_people||0;return (!mn||n>=mn)&&(!mx||n<=mx)}
function setFor(sel){var n=pax(sel),p=prod(sel),list=p?[p]:products.filter(function(x){return fit(x,n)}),s={};list.forEach(function(x){(Array.isArray(x.available_dates)?x.available_dates:[]).forEach(function(k){if(k>=td())s[k]=1})});return s}
function first(set){var a=Object.keys(set).sort();return a[0]||''}
function monthOf(sel){var i=sel.querySelector('.bw-d'),k=i&&i.value||first(setFor(sel))||td();var d=new Date(k+'T12:00:00');return new Date(d.getFullYear(),d.getMonth(),1,12)}
function title(d){try{return new Intl.DateTimeFormat(LANG==='nl'?'nl-NL':LANG,{month:'long',year:'numeric'}).format(d)}catch(e){return (d.getMonth()+1)+' '+d.getFullYear()}}
function updateTrigger(sel){var i=sel.querySelector('.bw-d'),b=sel.querySelector('.bw-mec-trigger .cv');if(b)b.textContent=fmt(i&&i.value||'')}
function render(sel){var box=sel.querySelector('.bw-mec');if(!box)return;var inp=sel.querySelector('.bw-d'),set=setFor(sel),v=sel.__bwMecView||monthOf(sel);sel.__bwMecView=v;var y=v.getFullYear(),m=v.getMonth(),fst=new Date(y,m,1,12),last=new Date(y,m+1,0,12).getDate(),off=(fst.getDay()+6)%7,w=weeks(),z='<div class="bw-mec-head"><button type="button" data-prev aria-label="Vorige maand">‹</button><div class="bw-mec-title">'+title(v)+'</div><button type="button" data-next aria-label="Volgende maand">›</button></div><div class="bw-mec-week">'+w.map(function(x){return '<span>'+x+'</span>'}).join('')+'</div><div class="bw-mec-grid">';for(var e=0;e<off;e++)z+='<span class="bw-mec-empty"></span>';for(var d=1;d<=last;d++){var k=iso(y,m,d),open=!!set[k]&&k>=td(),cl='bw-mec-day '+(open?'open':'closed')+(k===(inp&&inp.value)?' selected':'')+(k<td()?' past':'');z+='<button type="button" class="'+cl+'" data-date="'+k+'"'+(open?'':' disabled')+'>'+d+'</button>'}z+='</div>';box.innerHTML=z;var cur=new Date();cur=new Date(cur.getFullYear(),cur.getMonth(),1,12);var pr=box.querySelector('[data-prev]');if(pr){pr.disabled=(v.getFullYear()<cur.getFullYear()||(v.getFullYear()===cur.getFullYear()&&v.getMonth()<=cur.getMonth()));pr.onclick=function(){if(pr.disabled)return;sel.__bwMecView=new Date(y,m-1,1,12);render(sel)}}var nx=box.querySelector('[data-next]');if(nx)nx.onclick=function(){sel.__bwMecView=new Date(y,m+1,1,12);render(sel)};box.querySelectorAll('.bw-mec-day.open[data-date]').forEach(function(b){b.onclick=function(){if(!inp)return;inp.value=b.dataset.date;inp.dispatchEvent(new Event('change',{bubbles:true}));box.hidden=true;updateTrigger(sel);setTimeout(refresh,0)}});updateTrigger(sel)}
function closeOthers(ex){document.querySelectorAll('.bw-mec').forEach(function(x){if(x!==ex)x.hidden=true})}
function mount(sel){if(!sel||sel.dataset.bwMec)return;var inp=sel.querySelector('.bw-d');if(!inp)return;sel.dataset.bwMec='1';inp.classList.add('bw-mec-native');var b=document.createElement('button');b.type='button';b.className='bw-mec-trigger';b.innerHTML='<span class="cv"></span><span class="ci">▣</span>';inp.after(b);var box=document.createElement('div');box.className='bw-mec';box.hidden=true;sel.appendChild(box);b.onclick=function(e){e.preventDefault();e.stopPropagation();closeOthers(box);box.hidden=!box.hidden;if(!box.hidden){sel.__bwMecView=monthOf(sel);render(sel)}};updateTrigger(sel)}
function refresh(){document.querySelectorAll('.bw-sel').forEach(function(sel){mount(sel);updateTrigger(sel);var b=sel.querySelector('.bw-mec');if(b&&!b.hidden)render(sel)})}
function plan(){clearTimeout(timer);timer=setTimeout(refresh,60)}
document.addEventListener('input',function(e){if(e.target&&e.target.classList&&e.target.classList.contains('bw-p'))plan()},true);document.addEventListener('change',function(e){if(e.target&&e.target.classList&&(e.target.classList.contains('bw-p')||e.target.classList.contains('bw-d')))plan()},true);document.addEventListener('click',function(e){if(!e.target.closest('.bw-mec')&&!e.target.closest('.bw-mec-trigger'))closeOthers(null)},true);
var root=document.getElementById('cards')||document.body;new MutationObserver(plan).observe(root,{childList:true,subtree:true});
fetch(API+'products?category='+encodeURIComponent(CAT)+'&lang='+encodeURIComponent(LANG)).then(function(r){return r.json()}).then(function(o){products=(o&&o.products)||[];products.forEach(function(p){byId[p.product_id]=p});refresh();setTimeout(refresh,250)}).catch(function(){refresh()});
refresh();
})();</script>`;
if(!h.includes('id="bw-mec-css"'))h=h.replace('</head>',css+'</head>');if(!h.includes('id="bw-mec-js"'))h=h.replace('</body>',js+'</body>');return [{json:{...j,html:h}}];
}).call(__self,__mk(__items)));
// ===== Zondagdeal restaurantcategorie =====
__items=__norm(await (async function($input){
const j=$input.first().json||{};
let h=String(j.html||'');
const oud="restaurant:['CewjJvV','4cSbXnj','GhDVYP4']";
const nieuw="restaurant:['CewjJvV','4cSbXnj','GhDVYP4','HcssB9y']";
if(h.includes(oud)) h=h.replace(oud,nieuw);
return [{json:{...j,html:h}}];
}).call(__self,__mk(__items)));
// ===== M&E Beeldbank foto's =====
__items=__norm(await (async function($input){
const j=$input.first().json||{};let h=String(j.html||'');
// Gebruik weer de oorspronkelijke KMT-foto per M&E-arrangement. Geen generieke Beeldbank-override meer.
// KMT-productteksten worden pas in de browser opgehaald en vallen daardoor buiten de server-side encodingfix.
// Repareer veelvoorkomende UTF-8->Windows-1252 mojibake vóór het escapen/renderen, o.a. één -> Ã©Ã©n -> één.
const marker="function esc(x){return String(x==null?'':x).replace(";
if(h.includes(marker)){
 const dyn="function bwFixText(x){x=String(x==null?'':x);var F=[[String.fromCharCode(195,169),String.fromCharCode(233)],[String.fromCharCode(195,168),String.fromCharCode(232)],[String.fromCharCode(195,171),String.fromCharCode(235)],[String.fromCharCode(195,175),String.fromCharCode(239)],[String.fromCharCode(195,182),String.fromCharCode(246)],[String.fromCharCode(195,188),String.fromCharCode(252)],[String.fromCharCode(195,161),String.fromCharCode(225)],[String.fromCharCode(195,179),String.fromCharCode(243)],[String.fromCharCode(195,173),String.fromCharCode(237)],[String.fromCharCode(195,177),String.fromCharCode(241)],[String.fromCharCode(195,164),String.fromCharCode(228)],[String.fromCharCode(195,167),String.fromCharCode(231)],[String.fromCharCode(195,170),String.fromCharCode(234)],[String.fromCharCode(195,174),String.fromCharCode(238)],[String.fromCharCode(195,180),String.fromCharCode(244)],[String.fromCharCode(195,187),String.fromCharCode(251)],[String.fromCharCode(195,159),String.fromCharCode(223)],[String.fromCharCode(194,160),' '],[String.fromCharCode(194,176),String.fromCharCode(176)],[String.fromCharCode(226,8364,8482),String.fromCharCode(8217)],[String.fromCharCode(226,8364,339),String.fromCharCode(8220)],[String.fromCharCode(226,8364,8220),String.fromCharCode(8211)],[String.fromCharCode(226,8364,8221),String.fromCharCode(8212)],[String.fromCharCode(226,8364,166),String.fromCharCode(8230)],[String.fromCharCode(226,8218,172),String.fromCharCode(8364)]];for(var i=0;i<F.length;i++)x=x.split(F[i][0]).join(F[i][1]);return x}function esc(x){x=bwFixText(x);return x.replace(";
 h=h.replace(marker,dyn);
}
return [{json:{...j,html:h}}];
}).call(__self,__mk(__items)));
// ===== Tekencodering herstellen =====
__items=__norm(await (async function($input){
const item = $input.first();
const j = item.json || {};
let h = String(j.html || '');
const fixes = [
  ['Ã€','À'],['Ã','Á'],['Ã‚','Â'],['Ãƒ','Ã'],['Ã„','Ä'],['Ã…','Å'],['Ã‡','Ç'],['Ãˆ','È'],['Ã‰','É'],['ÃŠ','Ê'],['Ã‹','Ë'],['ÃŒ','Ì'],['Ã','Í'],['ÃŽ','Î'],['Ã','Ï'],['Ã‘','Ñ'],['Ã’','Ò'],['Ã“','Ó'],['Ã”','Ô'],['Ã•','Õ'],['Ã–','Ö'],['Ã™','Ù'],['Ãš','Ú'],['Ã›','Û'],['Ãœ','Ü'],['ÃŸ','ß'],
  ['Ã ','à'],['Ã¡','á'],['Ã¢','â'],['Ã£','ã'],['Ã¤','ä'],['Ã¥','å'],['Ã§','ç'],['Ã¨','è'],['Ã©','é'],['Ãª','ê'],['Ã«','ë'],['Ã¬','ì'],['Ã­','í'],['Ã®','î'],['Ã¯','ï'],['Ã±','ñ'],['Ã²','ò'],['Ã³','ó'],['Ã´','ô'],['Ãµ','õ'],['Ã¶','ö'],['Ã¹','ù'],['Ãº','ú'],['Ã»','û'],['Ã¼','ü'],['Ã½','ý'],['Ã¿','ÿ'],
  ['â€™','’'],['â€˜','‘'],['â€œ','“'],['â€','”'],['â€“','–'],['â€”','—'],['â€¦','…'],['â‚¬','€'],['â€¢','•'],['Â ',' '],['Â°','°']
];
for (const [bad, good] of fixes) h = h.split(bad).join(good);
return [{ json: { ...j, html: h } }];
}).call(__self,__mk(__items)));
// ===== NIX18 aanduiding =====
__items=__norm(await (async function($input){
// 17 nov 2026 (Dennis): geen NIX18-icoontjes meer op de foto's in de widget. De tekstregel onder webshop/tours alleen
// als de widget op buswhisky.com draait; nooit op visitbus.nl of een andere site (Dennis 17 nov).
const j=$input.first().json||{};let h=String(j.html||'');
const css=`<style id="bw-nix18-css">.bw-nix18{display:none!important}.bw-nix18-note{margin:8px 0 14px;text-align:center;font-size:12px;font-weight:700;color:#625d56}</style>`;
const js=`<script id="bw-nix18-js">(function(){function opBus(){var hs=[];try{hs.push(String(window.top.location.hostname||''))}catch(e){}try{var a=location.ancestorOrigins;if(a)for(var i=0;i<a.length;i++)hs.push(String(a[i]))}catch(e){}try{hs.push(String(document.referrer||''))}catch(e){}var s=hs.join(' ').toLowerCase();if(s.indexOf('visitbus')>=0)return false;return /buswhisky\\.com/.test(s)}function run(){if(!opBus()){document.querySelectorAll('.bw-nix18-note').forEach(function(x){x.remove()});return}var q=new URLSearchParams(location.search),cat=(q.get('category')||q.get('type')||'').toLowerCase(),shop=q.get('shop')==='1';if(shop||cat==='tours'){var cards=document.getElementById('cards');if(cards&&!cards.nextElementSibling?.classList?.contains('bw-nix18-note')){var n=document.createElement('div');n.className='bw-nix18-note';n.textContent='NIX18 · Alcohol wordt alleen verkocht of geschonken aan personen van 18 jaar en ouder.';cards.after(n)}}}new MutationObserver(run).observe(document.documentElement,{childList:true,subtree:true});if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run()})();</script>`;if(!h.includes('id="bw-nix18-css"'))h=h.replace('</head>',css+'</head>');if(!h.includes('id="bw-nix18-js"'))h=h.replace('</body>',js+'</body>');return [{json:{...j,html:h}}];
}).call(__self,__mk(__items)));
// ===== Whisky webshop in widget =====
__items=__norm(await (async function($input){
// 31 okt 2026: categoriekeuze (eigen lijst) en categorie "Whisky kopen" als echte webshop in de widget.
// Producten komen uit de Driver-webshop (via BtwBGSkEZqKKhJOf /bus-me-widget/shop). De widget draait op buswhisky.com
// (zelfde domein als de shop), dus de winkelmand is de echte Driver-winkelmand van de bezoeker (/cart/add/{id}/{aantal})
// en afrekenen gaat via de bestaande Driver-checkout (/winkelwagen -> /bestellen, betaling zoals altijd).
// 31 okt 2026 (Dennis): webshop is een APART onderdeel, net als de cadeaubon: eigen flessenknop naast de cadeaubonknop op de site
// (shop=1), niet meer in het keuzemenu. De knop zelf en het aan/uit zitten in chat/bus-chat.js (buswhisky-data),
// blok WEBSHOP-KNOP: WEBSHOP.aan en WEBSHOP.uitOpPaden; verder uit buiten buswhisky.com, bij data-bus-shop="uit" of ?webshop=0.
const j = $input.first().json || {}; let h = String(j.html || ''); let q = {};
try { q = $('GET BUS Booking Widget').first().json.query || {}; } catch (e) {}
const SOLO = String(q.shop || '') === '1';
const cat = SOLO ? 'whisky' : String(q.category || q.type || '').toLowerCase();
// Whisky kopen niet meer in het keuzemenu (apart onderdeel).
h = h.replace(/<option value="whisky"[^>]*>[^<]*<\/option>/, '');
// Categoriekeuze als eigen lijst (geen native iOS-picker, die brak lange namen af over 2 regels). Geldt voor alle categorieen.
const ddJs = `<script id="bw-dd-js">(function(){var sel=document.getElementById('bwCategory');if(!sel)return;(function(){var lab=sel.closest('label');if(!lab||lab.querySelector('.bw-dd-btn'))return;var st=document.createElement('style');st.textContent='.bw-dd-sel{position:absolute!important;opacity:0!important;pointer-events:none!important;width:1px!important;height:1px!important;min-height:0!important}.bw-dd-btn{all:unset;box-sizing:border-box;display:block;width:100%;min-height:46px;line-height:46px;font-size:19px;color:#1d1d1b;cursor:pointer;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;text-align:left}.bw-dd-list{list-style:none;margin:0;padding:4px 0;border-bottom:1px solid #d8d1c7;background:#fff}.bw-dd-list[hidden]{display:none}.bw-dd-list li{position:relative;padding:13px 14px 13px 48px;font-size:17px;line-height:1.2;white-space:nowrap;cursor:pointer;color:#1d1d1b}.bw-dd-list li+li{border-top:1px solid #f0ebe3}.bw-dd-list li[aria-selected=true]{font-weight:700}.bw-dd-list li[aria-selected=true]:before{content:"✓";position:absolute;left:20px;color:#8a673f}.bw-category .arr.arr-empty{display:block!important;width:12px!important;height:12px!important;overflow:visible!important;justify-self:center;transition:transform .15s}.bw-category .arr:after{content:"";display:block;width:8px;height:8px;border-right:2px solid #1d1d1b;border-bottom:2px solid #1d1d1b;transform:rotate(45deg);margin:0 auto}.bw-dd-open .arr.arr-empty{transform:rotate(180deg) translateY(-4px)}';document.head.appendChild(st);sel.classList.add('bw-dd-sel');sel.tabIndex=-1;var btn=document.createElement('button');btn.type='button';btn.className='bw-dd-btn';btn.setAttribute('aria-haspopup','listbox');btn.setAttribute('aria-expanded','false');btn.textContent=sel.options[sel.selectedIndex].text;sel.after(btn);var ul=document.createElement('ul');ul.className='bw-dd-list';ul.hidden=true;ul.setAttribute('role','listbox');[].forEach.call(sel.options,function(o){var li=document.createElement('li');li.setAttribute('role','option');li.dataset.v=o.value;li.textContent=o.text;if(o.selected)li.setAttribute('aria-selected','true');ul.appendChild(li)});lab.after(ul);function zet(o){ul.hidden=!o;btn.setAttribute('aria-expanded',o?'true':'false');lab.classList.toggle('bw-dd-open',o)}lab.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();zet(ul.hidden)});ul.addEventListener('click',function(e){var li=e.target.closest('li');if(!li)return;zet(false);if(li.dataset.v===sel.value)return;[].forEach.call(ul.children,function(x){x.removeAttribute('aria-selected')});li.setAttribute('aria-selected','true');sel.value=li.dataset.v;btn.textContent=li.textContent;sel.dispatchEvent(new Event('change'))});document.addEventListener('click',function(e){if(!ul.hidden&&!ul.contains(e.target)&&!lab.contains(e.target))zet(false)});window.__bwDdSync=function(){btn.textContent=sel.options[sel.selectedIndex].text;[].forEach.call(ul.children,function(x){x.toggleAttribute('aria-selected',x.dataset.v===sel.value)})}})();})();</script>`;
if (h.indexOf('id="bw-dd-js"') < 0) h = h.replace('</body>', ddJs + '</body>');
// 31 okt 2026 (Dennis): scrollbalk iets minder subtiel en met de muis te bedienen (slepen en klikken op de baan).
const sbCss = '<style id="bw-scrolldrag-css">#bwScrollHint{width:12px!important;right:2px!important;height:calc(100vh - 20px)!important;pointer-events:auto!important;cursor:pointer;background:rgba(29,29,27,.12)!important;transition:opacity .25s,width .15s!important}#bwScrollHint:not(.aan){pointer-events:none!important}#bwScrollHint i{background:rgba(29,29,27,.5)!important;cursor:grab}#bwScrollHint:hover,#bwScrollHint.sleep{width:16px!important}#bwScrollHint:hover i,#bwScrollHint.sleep i{background:rgba(29,29,27,.72)!important}#bwScrollHint.sleep i{cursor:grabbing}@media (hover:none){#bwScrollHint{width:6px!important}}</style>';
const sbJs = `<script id="bw-scrolldrag-js">(function(){var se=function(){return document.scrollingElement||document.documentElement};
document.addEventListener('pointerdown',function(e){var tr=e.target.closest&&e.target.closest('#bwScrollHint');if(!tr||!tr.classList.contains('aan'))return;e.preventDefault();var th=tr.querySelector('i'),s=se(),vh=innerHeight,sh=s.scrollHeight,h=tr.getBoundingClientRect().height,t=th.getBoundingClientRect().height,ratio=(sh-vh)/Math.max(1,h-t);
 if(e.target!==th){var tt=th.getBoundingClientRect();s.scrollTop+=(e.clientY<tt.top?-1:1)*(vh-60);return}
 var y0=e.clientY,top0=s.scrollTop;tr.classList.add('sleep');try{tr.setPointerCapture(e.pointerId)}catch(x){}
 function mv(ev){s.scrollTop=top0+(ev.clientY-y0)*ratio}function up(){tr.classList.remove('sleep');removeEventListener('pointermove',mv);removeEventListener('pointerup',up);removeEventListener('pointercancel',up)}
 addEventListener('pointermove',mv);addEventListener('pointerup',up);addEventListener('pointercancel',up)},true)})();</script>`;
const plJs = `<script id="bw-shop-launcher-plek">(function(){try{var d=window.parent&&window.parent!==window?window.parent.document:null;if(!d||d.getElementById('bw-shop-launcher-css'))return;var st=d.createElement('style');st.id='bw-shop-launcher-css';st.textContent='@media (min-width:640px){#booking-widget.is-open #bwShopLauncher{margin-right:56px}}';d.head.appendChild(st)}catch(e){}})();</script>`;
if (h.indexOf('id="bw-shop-launcher-plek"') < 0) h = h.replace('</body>', plJs + '</body>');
if (h.indexOf('id="bw-scrolldrag-js"') < 0) { h = h.replace('</head>', sbCss + '</head>'); h = h.replace('</body>', sbJs + '</body>'); }
const lang = String(q.lang || 'nl').slice(0, 2).toLowerCase();
const L = {
  nl: { title: 'Whisky kopen', loading: 'Whisky laden...', add: 'In winkelmand', added: 'Toegevoegd aan je winkelmand', sold: 'Uitverkocht', cart: 'Winkelmand', checkout: 'Afrekenen', more: 'Meer info', error: 'Er ging iets mis. Probeer het opnieuw.', none: 'Geen producten gevonden.', age: 'Verkoop alleen aan personen van 18 jaar en ouder.', back: 'Verder winkelen', cartTitle: 'Je winkelmand', empty: 'Je winkelmand is leeg.', total: 'Totaal', remove: 'Verwijderen' },
  en: { title: 'Buy whisky', loading: 'Loading whisky...', add: 'Add to cart', added: 'Added to your cart', sold: 'Sold out', cart: 'Cart', checkout: 'Checkout', more: 'More info', error: 'Something went wrong. Please try again.', none: 'No products found.', age: 'Sales only to persons aged 18 and over.', back: 'Continue shopping', cartTitle: 'Your cart', empty: 'Your cart is empty.', total: 'Total', remove: 'Remove' },
  de: { title: 'Whisky kaufen', loading: 'Whisky wird geladen...', add: 'In den Warenkorb', added: 'Zum Warenkorb hinzugefügt', sold: 'Ausverkauft', cart: 'Warenkorb', checkout: 'Zur Kasse', more: 'Mehr Info', error: 'Etwas ist schiefgelaufen. Bitte erneut versuchen.', none: 'Keine Produkte gefunden.', age: 'Verkauf nur an Personen ab 18 Jahren.', back: 'Weiter einkaufen', cartTitle: 'Dein Warenkorb', empty: 'Dein Warenkorb ist leer.', total: 'Gesamt', remove: 'Entfernen' },
  fr: { title: 'Acheter du whisky', loading: 'Chargement...', add: 'Ajouter au panier', added: 'Ajouté à votre panier', sold: 'Épuisé', cart: 'Panier', checkout: 'Commander', more: 'Plus d’infos', error: 'Une erreur est survenue. Réessayez.', none: 'Aucun produit trouvé.', age: 'Vente réservée aux personnes de 18 ans et plus.', back: 'Continuer mes achats', cartTitle: 'Votre panier', empty: 'Votre panier est vide.', total: 'Total', remove: 'Supprimer' },
  es: { title: 'Comprar whisky', loading: 'Cargando...', add: 'Añadir al carrito', added: 'Añadido a tu carrito', sold: 'Agotado', cart: 'Carrito', checkout: 'Pagar', more: 'Más info', error: 'Algo salió mal. Inténtalo de nuevo.', none: 'No se encontraron productos.', age: 'Venta solo a mayores de 18 años.', back: 'Seguir comprando', cartTitle: 'Tu carrito', empty: 'Tu carrito está vacío.', total: 'Total', remove: 'Eliminar' }
};
const t = L[lang] || L.en;
if (cat !== 'whisky') return [{ json: { ...j, html: h } }];
const CKT = {"nl": {"title": "Afrekenen", "delivery": "Bezorging", "ship": "Verzenden", "pickup": "Afhalen in Loosbroek", "details": "Jouw gegevens", "mr": "Dhr.", "mrs": "Mevr.", "first": "Voornaam", "last": "Achternaam", "email": "E-mailadres", "phone": "Telefoon", "zip": "Postcode", "nr": "Huisnr.", "add": "Toev.", "street": "Straat", "city": "Plaats", "pay": "Betaalmethode", "code": "Ik heb een kortingscode", "codePh": "Kortingscode", "apply": "Toepassen", "codeOk": "Kortingscode toegepast", "codeBad": "Deze kortingscode is niet geldig.", "note": "Opmerking toevoegen", "a18": "Ik ben 18 jaar of ouder en ga akkoord met een leeftijdscheck bij aflevering.", "terms": "Ik ga akkoord met de {v}.", "termsLink": "algemene voorwaarden", "sub": "Subtotaal", "shipCost": "Verzendkosten", "disc": "Korting", "total": "Totaal", "payBtn": "Bestellen en betalen", "busy": "Doorsturen naar betalen...", "fill": "Vul de rood gemarkeerde velden in.", "empty": "Je winkelmand is leeg.", "remove": "Verwijderen"}, "en": {"title": "Checkout", "delivery": "Delivery", "ship": "Shipping", "pickup": "Pick up in Loosbroek", "details": "Your details", "mr": "Mr", "mrs": "Ms", "first": "First name", "last": "Last name", "email": "Email address", "phone": "Phone", "zip": "Postcode", "nr": "No.", "add": "Add.", "street": "Street", "city": "City", "pay": "Payment method", "code": "I have a discount code", "codePh": "Discount code", "apply": "Apply", "codeOk": "Discount code applied", "codeBad": "This discount code is not valid.", "note": "Add a note", "a18": "I am 18 or older and agree to an age check on delivery.", "terms": "I agree to the {v}.", "termsLink": "terms and conditions", "sub": "Subtotal", "shipCost": "Shipping", "disc": "Discount", "total": "Total", "payBtn": "Order and pay", "busy": "Redirecting to payment...", "fill": "Please fill in the fields marked in red.", "empty": "Your cart is empty.", "remove": "Remove"}, "de": {"title": "Kasse", "delivery": "Lieferung", "ship": "Versand", "pickup": "Abholen in Loosbroek", "details": "Deine Daten", "mr": "Herr", "mrs": "Frau", "first": "Vorname", "last": "Nachname", "email": "E-Mail-Adresse", "phone": "Telefon", "zip": "PLZ", "nr": "Nr.", "add": "Zus.", "street": "Straße", "city": "Ort", "pay": "Zahlungsart", "code": "Ich habe einen Rabattcode", "codePh": "Rabattcode", "apply": "Anwenden", "codeOk": "Rabattcode angewendet", "codeBad": "Dieser Rabattcode ist ungültig.", "note": "Anmerkung hinzufügen", "a18": "Ich bin mindestens 18 Jahre alt und stimme einer Alterskontrolle bei der Lieferung zu.", "terms": "Ich stimme den {v} zu.", "termsLink": "AGB", "sub": "Zwischensumme", "shipCost": "Versandkosten", "disc": "Rabatt", "total": "Gesamt", "payBtn": "Bestellen und bezahlen", "busy": "Weiter zur Zahlung...", "fill": "Bitte fülle die rot markierten Felder aus.", "empty": "Dein Warenkorb ist leer.", "remove": "Entfernen"}};
const API = 'https://buswhiskyevents.app.n8n.cloud/webhook/bus-me-widget/shop';
const cfg = JSON.stringify({ lang, api: API, t, k: CKT[lang] || CKT.en }).replace(/</g, '\\u003c');
h = h.replace(/<html([^>]*)>/i, (m, a) => /class="/.test(a) ? m.replace('class="', 'class="bw-shop ') : '<html' + a + ' class="bw-shop">');
h = h.replace('<section id="cards">', '<section id="cards"><div class="bw-shop-msg">' + t.loading + '</div>');
const css = `<style id="bw-shop-css">
html.bw-shop #cards>:not(.bw-shop-card):not(.bw-shop-msg){display:none!important}
html.bw-shop .filters .filter:not(.bw-category){display:none!important}
html.bw-shop .note,html.bw-shop .gift-buy,html.bw-shop .gift-modal-backdrop{display:none!important}
html.bw-shop .filters{display:none!important}
.bw-shop-msg{text-align:center;padding:25px;color:#625d56}
.bw-shop-card{display:grid;grid-template-columns:96px 1fr;gap:12px;background:#fff;border:1px solid #e6dfd5;border-radius:10px;padding:12px;margin:0 0 12px;text-align:left}
.bw-shop-card .im{width:96px;height:128px;border-radius:8px;background:#f4efe8 center/contain no-repeat}
.bw-shop-card h3{margin:0 0 3px;font-size:16px;line-height:1.25;color:#1d1d1b}
.bw-shop-card .mt{font-size:12px;color:#6f6a63;margin:0 0 5px}
.bw-shop-card .sh{font-size:13px;line-height:1.4;color:#444;margin:0 0 6px;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
.bw-shop-card .mi{font-size:12px;color:#8a673f;text-decoration:underline;cursor:pointer;background:none;border:0;padding:0;font:inherit;font-size:12px}
.bw-shop-card .rw{display:flex;align-items:center;gap:8px;margin-top:8px;flex-wrap:wrap}
.bw-shop-card .pr{font-weight:800;font-size:17px;color:#1d1d1b;margin-right:auto}
.bw-shop-card .qt{display:inline-flex;align-items:center;border:1px solid #d8d1c7;border-radius:7px;height:38px}
.bw-shop-card .qt button{width:32px;height:36px;border:0;background:none;font-size:18px;cursor:pointer;color:#1d1d1b}
.bw-shop-card .qt span{min-width:22px;text-align:center;font-weight:700}
.bw-shop-card .ad{height:38px;border:0;border-radius:7px;background:#1d1d1b;color:#fff;font:inherit;font-weight:800;padding:0 12px;cursor:pointer;white-space:nowrap}
.bw-shop-card .ad[disabled]{opacity:.45;cursor:default}
.bw-shop-card .ok{grid-column:1/-1;font-size:13px;font-weight:700;color:#24783b;margin:0}
.bw-shop-card .ok:empty{display:none}
.bw-shop-age{font-size:12px;color:#6f6a63;text-align:center;margin:4px 0 12px}
.bw-shop-bar{position:fixed;left:0;right:0;bottom:0;z-index:50;display:flex;align-items:center;gap:10px;padding:12px 14px calc(12px + env(safe-area-inset-bottom));background:#1d1d1b;color:#fff;box-shadow:0 -4px 16px #0003}
.bw-shop-bar[hidden]{display:none}
.bw-shop-bar .ct{font-weight:700;margin-right:auto}
.bw-co{position:fixed;left:0;right:0;top:0;bottom:0;z-index:70;display:flex;flex-direction:column;background:#F7F4EE}
html.bw-co-aan .bw-shop-bar,html.bw-co-aan #bwScrollHint{display:none!important}
html.bw-co-aan,html.bw-co-aan body{overflow:hidden!important;height:100%!important}
.bw-co-kop{flex:none;display:flex;align-items:center;justify-content:space-between;gap:8px;padding:6px 12px;border-bottom:1px solid #e6dfd5}
.bw-co-kop b{font-size:14px;color:#1d1d1b}
.bw-co-terug{border:0;background:none;font:inherit;font-weight:700;font-size:14px;color:#1d1d1b;cursor:pointer;padding:6px 2px}
.ck-body{flex:1;overflow-y:auto;padding:10px 14px 6px;scrollbar-width:auto;scrollbar-color:rgba(29,29,27,.45) rgba(29,29,27,.08)}
.ck-body::-webkit-scrollbar{width:12px}.ck-body::-webkit-scrollbar-thumb{background:rgba(29,29,27,.45);border-radius:6px;border:2px solid transparent;background-clip:padding-box}.ck-body::-webkit-scrollbar-track{background:rgba(29,29,27,.06)}
.bw-ck.bezig .ck-body,.bw-ck.bezig .ck-voet{opacity:.6;pointer-events:none}
.ck-leeg{text-align:center;color:#625d56;padding:18px 0;margin:0}
.ck-rij{display:grid;grid-template-columns:40px 1fr auto auto 22px;gap:8px;align-items:center;padding:7px 0;border-bottom:1px solid #e6dfd5}
.ck-rij .im{width:40px;height:52px;border-radius:5px;background:#fff center/contain no-repeat}
.ck-rij .nm{display:flex;flex-direction:column;min-width:0;font-size:12px;color:#6f6a63}.ck-rij .nm b{font-size:13px;color:#1d1d1b;line-height:1.25;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}
.ck-rij .qt{display:inline-flex;align-items:center;border:1px solid #d8d1c7;border-radius:7px;height:32px;background:#fff}.ck-rij .qt button{width:26px;height:30px;border:0;background:none;font-size:16px;cursor:pointer;color:#1d1d1b}.ck-rij .qt span{min-width:18px;text-align:center;font-weight:700;font-size:13px}
.ck-rij .tt{font-size:13px;color:#1d1d1b;white-space:nowrap}.ck-rij .rm{border:0;background:none;font-size:18px;line-height:1;color:#8b2727;cursor:pointer;padding:0}
.ck-h{font-size:12px;font-weight:700;color:#625d56;margin:12px 0 6px}
.bw-ck .fld{display:block;box-sizing:border-box;width:100%;height:40px;margin:0 0 6px;padding:0 10px;border:1px solid #d8d1c7;border-radius:7px;background:#fff;color:#1d1d1b;font:inherit;font-size:16px}
.bw-ck [hidden]{display:none!important}
.bw-ck select.fld{-webkit-appearance:none;appearance:none}
.bw-ck textarea.fld{height:auto;padding:8px 10px}
.bw-ck .fld.bw-bad{border-color:#8b2727;background:#fff6f6}
.bw-ck .r2{display:grid;grid-template-columns:1fr 1fr;gap:7px}.bw-ck .r3{display:grid;grid-template-columns:1.4fr 1fr .8fr;gap:7px}.bw-ck .r2b{display:grid;grid-template-columns:1fr auto;gap:7px}
.bw-ck .seg{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin:0 0 7px;border-radius:8px}
.bw-ck .seg label,.bw-ck .chip{position:relative;cursor:pointer}
.bw-ck .seg input,.bw-ck .chip input,.bw-ck .cb input{position:absolute;opacity:0;pointer-events:none}
.bw-ck .seg span,.bw-ck .chip span{display:flex;align-items:center;justify-content:center;gap:5px;height:40px;padding:0 8px;border:1px solid #d8d1c7;border-radius:7px;background:#fff;font-size:14px;font-weight:700;color:#1d1d1b;text-align:center;line-height:1.1}
.bw-ck .seg em{font-style:normal;font-weight:400;color:#6f6a63;font-size:12px}
.bw-ck .seg input:checked+span,.bw-ck .chip input:checked+span{background:#1d1d1b;color:#fff;border-color:#1d1d1b}.bw-ck .seg input:checked+span em{color:#e8e1d6}
.bw-ck .seg.bw-bad span,.bw-ck .chips.bw-bad span{border-color:#8b2727}
.bw-ck .chips{display:flex;flex-wrap:wrap;gap:7px;margin:0 0 7px}.bw-ck .chip span{height:36px;font-size:13px;padding:0 12px}
.bw-ck .ck-x{display:flex;gap:16px;margin:4px 0 6px}.bw-ck .lnk{border:0;background:none;padding:2px 0;font:inherit;font-size:12px;color:#6f6a63;text-decoration:underline;cursor:pointer}
.bw-ck .kc-ok{border:0;border-radius:7px;background:#1d1d1b;color:#fff;font:inherit;font-weight:700;padding:0 14px;height:42px;cursor:pointer}
.bw-ck .kc-m{font-size:12px;margin:0 0 6px}.bw-ck .kc-m:empty{display:none}.bw-ck .kc-m.ok{color:#24783b}.bw-ck .kc-m.no{color:#8b2727}
.bw-ck .cb{display:flex;gap:8px;align-items:flex-start;font-size:12px;line-height:1.35;color:#444;margin:6px 0;cursor:pointer}
.bw-ck .cb span:before{content:"";flex:none;display:inline-block;width:16px;height:16px;margin:0 8px -3px 0;border:1px solid #9c958b;border-radius:4px;background:#fff center/12px no-repeat}
.bw-ck .cb input:checked+span:before{background-color:#1d1d1b;border-color:#1d1d1b;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12'%3E%3Cpath d='M2 6.5l2.5 2.5L10 3.5' fill='none' stroke='%23fff' stroke-width='2'/%3E%3C/svg%3E")}
.bw-ck .cb.bw-bad span:before{border-color:#8b2727}.bw-ck .cb a{color:#8a673f}
.ck-voet{flex:none;padding:8px 14px 10px;background:#1d1d1b;color:#fff}
.ck-som div{display:flex;justify-content:space-between;font-size:13px;line-height:1.5;color:#e8e1d6}.ck-som .tot{font-size:16px;color:#fff;margin-top:2px}
.ck-msg{font-size:12px;font-weight:700;color:#ffb4a8;margin:4px 0 0}.ck-msg:empty{display:none}
.ck-pay{width:100%;margin-top:8px;border:0;border-radius:7px;background:#C9A227;color:#1d1d1b;font:inherit;font-weight:800;font-size:15px;padding:12px;cursor:pointer}.ck-pay[disabled]{opacity:.5;cursor:default}
.bw-shop-bar a{background:#C9A227;color:#1d1d1b;border-radius:7px;padding:11px 16px;font-weight:800;text-decoration:none;white-space:nowrap}
@media(max-width:360px){.bw-shop-card{grid-template-columns:76px 1fr}.bw-shop-card .im{width:76px;height:104px}}
</style>`;
h = h.replace('</head>', css + '</head>');
const js = `<script id="bw-shop-js">(function(){
var C=${cfg},T=C.t,doc=document,cards=doc.getElementById('cards');if(!cards)return;
var dv=doc.querySelector('.divider');if(dv)dv.textContent=T.title;
function esc(x){return String(x==null?'':x).replace(/[&<>\"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]})}
function eur(n){try{return new Intl.NumberFormat(C.lang==='nl'?'nl-NL':C.lang,{style:'currency',currency:'EUR'}).format(n)}catch(e){return '€ '+Number(n).toFixed(2).replace('.',',')}}
var bar=doc.createElement('div');bar.className='bw-shop-bar';bar.hidden=true;bar.innerHTML='<span class="ct"></span><a href="/bestellen" class="bw-co-open">'+esc(T.checkout)+'</a>';doc.body.appendChild(bar);
// 31 okt 2026 (Dennis): afrekenen IN de widget, compact en in de stijl van het boekformulier van de reserveringen.
// Praat rechtstreeks met de Driver-webshop op hetzelfde domein: winkelmand (/winkelwagen data, /cart/update), verzendkosten
// (/cart/get-data), adres bij postcode (/postcode-api/search), kortingscode (/cart/apply-discount-code) en de bestelling zelf
// (POST /order/store met precies de velden van de Driver-checkout). Alleen de betaalstap (bank/Mollie) opent in het hoofdvenster.
// Betaalmethode Op factuur wordt in deze webshop niet aangeboden (Dennis 31 okt 2026).
var K=C.k,ck=null,CK={},M='deliver';
function hdr(j){var h={Accept:'application/json','X-Requested-With':'XMLHttpRequest'};if(j){h['Content-Type']='application/json';h['X-CSRF-TOKEN']=CK.token||''}return h}
function getJ(u){return fetch(u,{credentials:'same-origin',headers:hdr()}).then(function(r){if(!r.ok)throw new Error(r.status);return r.json()})}
function postJ(u,b){return fetch(u,{method:'POST',credentials:'same-origin',headers:hdr(1),body:JSON.stringify(b||{})}).then(function(r){if(!r.ok)throw new Error(r.status);return r.json()})}
function attr(h,n){var m=h.match(new RegExp(':'+n+'="([^"]*)"'));if(!m)return null;var t=doc.createElement('textarea');t.innerHTML=m[1];try{return JSON.parse(t.value)}catch(e){return null}}
function laadCk(){return fetch('/bestellen',{credentials:'same-origin'}).then(function(r){return r.text()}).then(function(h){var d=new DOMParser().parseFromString(h,'text/html');var mt=d.querySelector('meta[name="csrf-token"]');CK.token=(mt&&mt.getAttribute('content'))||'';CK.pm=attr(h,'payment-methods')||[];CK.ctr=attr(h,'countries')||{NL:{name:'Nederland',alpha_3:'NLD'}};CK.inv=attr(h,'invoice-address')||null;CK.mail=attr(h,'user-email')||'';var cd=attr(h,'cart-data');if(cd)CK.cart=cd})}
function veld(n){return ck.querySelector('[name="'+n+'"]')}
function waarde(n){var e=veld(n);return e?String(e.value||'').trim():''}
function keuze(n){var e=ck.querySelector('input[name="'+n+'"]:checked');return e?e.value:''}
function land(){return waarde('co')||'NL'}
function kosten(){return getJ('/cart/get-data?countryCode='+encodeURIComponent(land())+'&shippingMethod='+M).then(function(c){if(c&&c.items)CK.cart=c;regels()}).catch(function(){regels()})}
function regels(){if(!ck)return;var c=CK.cart||{},it=Object.values(c.items||{}).filter(function(x){return (+x.quantity||0)>0});zetAantal(it.reduce(function(a,x){return a+(+x.quantity||0)},0));
 var L=ck.querySelector('.ck-lines');L.innerHTML=it.length?it.map(function(x){return '<div class="ck-rij" data-id="'+x.id+'"><div class="im" style="background-image:url('+esc(x.image||'')+')"></div><div class="nm"><b>'+esc(x.name)+'</b><span>'+esc(x.price_incl_formatted||'')+'</span></div><span class="qt"><button type="button" data-q="-1" aria-label="-">−</button><span>'+(+x.quantity)+'</span><button type="button" data-q="1" aria-label="+">+</button></span><b class="tt">'+esc(x.price_total_incl_formatted||'')+'</b><button type="button" class="rm" aria-label="'+esc(K.remove)+'">×</button></div>'}).join(''):'<p class="ck-leeg">'+esc(K.empty)+'</p>';
 var sc=ck.querySelector('.sc');if(sc)sc.textContent=c.shipping_costs_send_formatted||'';
 var r=[[K.sub,c.products_price_incl_formatted],[M==='pickup'?K.pickup:K.shipCost,M==='pickup'?'€ 0,00':c.shipping_costs_formatted]];if(+c.discount_price>0)r.push([K.disc,'- '+(c.discount_price_formatted||'')]);
 ck.querySelector('.ck-som').innerHTML=r.filter(function(x){return x[1]}).map(function(x){return '<div><span>'+esc(x[0])+'</span><span>'+esc(x[1])+'</span></div>'}).join('')+'<div class="tot"><span>'+esc(K.total)+'</span><b>'+esc(c.total_price_incl_formatted||'')+'</b></div>';
 ck.querySelector('.ck-pay').disabled=!it.length;ck.classList.remove('bezig')}
function wijzig(id,n){ck.classList.add('bezig');fetch('/cart/update/'+id+'/'+Math.max(0,n),{credentials:'same-origin',headers:hdr()}).then(function(){return kosten()}).catch(function(){kosten()})}
function zoekAdres(){if(land()!=='NL')return;var z=waarde('zip').replace(/ /g,'').toUpperCase(),n=waarde('nr');if(!/^[0-9]{4}[A-Z]{2}$/.test(z)||!/^[0-9]+$/.test(n))return;var a3=(CK.ctr.NL&&CK.ctr.NL.alpha_3)||'NLD';postJ('/postcode-api/search',{countryCode:a3,zip:z,number:n+waarde('ad'),street:''}).then(function(o){var d=(o&&o.data)||o||{};if(d.street){veld('st').value=d.street;veld('st').classList.remove('bw-bad')}if(d.city){veld('ci').value=d.city;veld('ci').classList.remove('bw-bad')}}).catch(function(){})}
function vul(){var a=CK.inv||{},z=function(n,v){var e=veld(n);if(e&&v&&!e.value)e.value=v};z('fn',a.first_name);z('ln',[a.middle_name,a.last_name].filter(Boolean).join(' '));z('em',CK.mail||a.email);z('ph',a.phone);z('zip',a.zip);z('nr',a.house_number);z('ad',a.house_number_addition);z('st',a.street);z('ci',a.city);if(a.salutation){var s=ck.querySelector('input[name="cks"][value="'+a.salutation+'"]');if(s)s.checked=true}}
function bouwCk(){var pm=(CK.pm||[]).filter(function(p){return !/factuur|invoice/i.test((p.identifier||'')+' '+(p.title||''))}).map(function(p,i){return '<label class="chip"><input type="radio" name="ckpay" value="'+esc(p.identifier)+'"'+(i===0?' checked':'')+'><span>'+esc(p.title)+'</span></label>'}).join('');
 var ctr=Object.keys(CK.ctr||{}).map(function(k){return '<option value="'+esc(k)+'"'+(k==='NL'?' selected':'')+'>'+esc(CK.ctr[k].name)+'</option>'}).join('');
 ck.querySelector('.ck-body').innerHTML='<div class="ck-lines"></div>'+
  '<div class="ck-h">'+esc(K.delivery)+'</div><div class="seg"><label><input type="radio" name="ckm" value="deliver" checked><span>'+esc(K.ship)+' <em class="sc"></em></span></label><label><input type="radio" name="ckm" value="pickup"><span>'+esc(K.pickup)+'</span></label></div>'+
  '<div class="ck-h">'+esc(K.details)+'</div><div class="seg sm"><label><input type="radio" name="cks" value="Dhr"><span>'+esc(K.mr)+'</span></label><label><input type="radio" name="cks" value="Mevr"><span>'+esc(K.mrs)+'</span></label></div>'+
  '<div class="r2"><input class="fld" name="fn" placeholder="'+esc(K.first)+'" autocomplete="given-name"><input class="fld" name="ln" placeholder="'+esc(K.last)+'" autocomplete="family-name"></div>'+
  '<div class="r2"><input class="fld" name="em" type="email" placeholder="'+esc(K.email)+'" autocomplete="email"><input class="fld" name="ph" type="tel" placeholder="'+esc(K.phone)+'" autocomplete="tel"></div>'+
  '<div class="r3"><input class="fld" name="zip" placeholder="'+esc(K.zip)+'" autocomplete="postal-code"><input class="fld" name="nr" placeholder="'+esc(K.nr)+'" inputmode="numeric"><input class="fld" name="ad" placeholder="'+esc(K.add)+'"></div>'+
  '<div class="r2"><input class="fld" name="st" placeholder="'+esc(K.street)+'" autocomplete="address-line1"><input class="fld" name="ci" placeholder="'+esc(K.city)+'" autocomplete="address-level2"></div>'+
  '<select class="fld" name="co" autocomplete="country">'+ctr+'</select>'+
  '<div class="ck-h">'+esc(K.pay)+'</div><div class="chips">'+pm+'</div>'+
  '<div class="ck-x"><button type="button" class="lnk" data-x="kc">'+esc(K.code)+'</button><button type="button" class="lnk" data-x="cm">'+esc(K.note)+'</button></div>'+
  '<div class="kc" hidden><div class="r2b"><input class="fld" name="kc" placeholder="'+esc(K.codePh)+'"><button type="button" class="kc-ok">'+esc(K.apply)+'</button></div><p class="kc-m"></p></div>'+
  '<textarea class="fld cm" name="cm" rows="2" hidden placeholder="'+esc(K.note)+'"></textarea>'+
  '<label class="cb"><input type="checkbox" name="a18"><span>'+esc(K.a18)+'</span></label>'+
  '<label class="cb"><input type="checkbox" name="at"><span>'+K.terms.replace('{v}','<a href="https://wordpress.buswhisky.com/wp-content/uploads/Algemene_Voorwaarden_Bus_Whisky_Distillers.pdf" target="_blank" rel="noopener">'+esc(K.termsLink)+'</a>')+'</span></label>';
 vul()}
function plaatsBestelling(){var need=['fn','ln','em','ph','zip','nr','st','ci'],fout=false;need.forEach(function(n){var v=waarde(n),bad=!v||(n==='em'&&!/^[^ @]+@[^ @]+[.][^ @]+$/.test(v));veld(n).classList.toggle('bw-bad',bad);if(bad)fout=true});
 [['cks','.seg.sm'],['ckpay','.chips']].forEach(function(x){var bad=!keuze(x[0]);ck.querySelector(x[1]).classList.toggle('bw-bad',bad);if(bad)fout=true});
 ['a18','at'].forEach(function(n){var bad=!veld(n).checked;veld(n).closest('.cb').classList.toggle('bw-bad',bad);if(bad)fout=true});
 var msg=ck.querySelector('.ck-msg');if(fout){msg.textContent=K.fill;var e=ck.querySelector('.bw-bad');if(e)e.scrollIntoView({block:'center',behavior:'smooth'});return}msg.textContent='';
 var nr=waarde('nr'),ad=waarde('ad'),F={type:'',show_products:'false',forgot_password:'false',email_check:waarde('em'),email_has_account:'false',is_valid_email_layout:'',
  invoice_salutation:keuze('cks'),invoice_first_name:waarde('fn'),invoice_middle_name:'',invoice_last_name:waarde('ln'),invoice_email:waarde('em'),invoice_street:waarde('st'),invoice_house_number:nr,invoice_house_number_addition:ad,invoice_zip:waarde('zip').toUpperCase(),invoice_city:waarde('ci'),invoice_country:land(),invoice_phone:waarde('ph'),
  shipping_salutation:'',shipping_first_name:'',shipping_middle_name:'',shipping_last_name:'',shipping_email:'',shipping_street:'',shipping_house_number:'',shipping_house_number_addition:'',shipping_zip:'',shipping_city:'',shipping_country:'',shipping_phone:'',
  different_shipping_address:'false',shipping_select:M==='deliver'?'delivery':'',shipping_method:M,payment_method:keuze('ckpay'),comment:waarde('cm'),accept_terms:'true',accept_eighteen_years_or_older:'true',accept_age_check:'true',show_discount_code_value_error:'false',discount_code_value:'',discount_code:(CK.cart&&CK.cart.discountCode)||''};
 var f=doc.createElement('form');f.method='post';f.action='/order/store';f.target='_top';f.style.display='none';F._token=CK.token;Object.keys(F).forEach(function(k){var i=doc.createElement('input');i.type='hidden';i.name=k;i.value=F[k]==null?'':String(F[k]);f.appendChild(i)});doc.body.appendChild(f);
 var b=ck.querySelector('.ck-pay');b.disabled=true;b.textContent=K.busy;try{var tw=window.top;(tw.dataLayer=tw.dataLayer||[]).push({event:'add_payment_info',payment_type:F.payment_method})}catch(x){}f.submit()}
function sluitCk(){if(!ck)return;ck.remove();ck=null;doc.documentElement.classList.remove('bw-co-aan')}
function openCk(){if(ck)return;try{window.scrollTo(0,0)}catch(x){}ck=doc.createElement('div');ck.className='bw-co bw-ck bezig';
 ck.innerHTML='<div class="bw-co-kop"><button type="button" class="bw-co-terug">‹ '+esc(T.back)+'</button><b>'+esc(K.title)+'</b></div><div class="ck-body"><p class="ck-leeg">'+esc(T.loading)+'</p></div><div class="ck-voet"><div class="ck-som"></div><p class="ck-msg" role="status"></p><button type="button" class="ck-pay">'+esc(K.payBtn)+'</button></div>';
 var br=doc.querySelector('.brand'),pw=doc.querySelector('.bw-powered');ck.style.top=(br?Math.max(0,Math.round(br.getBoundingClientRect().bottom)):0)+'px';ck.style.bottom=(pw&&getComputedStyle(pw).display!=='none'?pw.offsetHeight:0)+'px';doc.body.appendChild(ck);doc.documentElement.classList.add('bw-co-aan');
 ck.querySelector('.bw-co-terug').addEventListener('click',sluitCk);ck.querySelector('.ck-pay').addEventListener('click',plaatsBestelling);
 ck.addEventListener('click',function(e){var r=e.target.closest('.ck-rij');if(r&&!ck.classList.contains('bezig')){var n=+r.querySelector('.qt span').textContent||0;if(e.target.closest('.rm'))return wijzig(r.dataset.id,0);var q=e.target.closest('[data-q]');if(q)return wijzig(r.dataset.id,n+(+q.dataset.q))}
  var x=e.target.closest('[data-x]');if(x){var t=ck.querySelector(x.dataset.x==='kc'?'.kc':'.cm');t.hidden=!t.hidden;if(!t.hidden){var i=t.matches('textarea')?t:t.querySelector('input');if(i)i.focus()}return}
  if(e.target.closest('.kc-ok')){var code=waarde('kc'),m=ck.querySelector('.kc-m');if(!code)return;m.textContent='...';postJ('/cart/apply-discount-code',{code:code}).then(function(c){if(c&&c.items)CK.cart=c;m.textContent='✓ '+K.codeOk;m.className='kc-m ok';kosten()}).catch(function(){m.textContent=K.codeBad;m.className='kc-m no'})}});
 ck.addEventListener('change',function(e){var n=e.target.name;if(n==='ckm'){M=e.target.value;ck.classList.toggle('afhalen',M==='pickup');ck.classList.add('bezig');kosten()}else if(n==='co'){kosten()}else if(n==='zip'||n==='nr'||n==='ad'){zoekAdres()}if(e.target.classList)e.target.classList.remove('bw-bad');var g=e.target.closest('.bw-bad');if(g)g.classList.remove('bw-bad');if(!ck.querySelector('.bw-bad'))ck.querySelector('.ck-msg').textContent=''});
 ck.addEventListener('input',function(e){if(e.target.classList&&e.target.classList.contains('bw-bad')&&e.target.value)e.target.classList.remove('bw-bad');if(!ck.querySelector('.bw-bad'))ck.querySelector('.ck-msg').textContent=''});
 try{var tw=window.top;(tw.dataLayer=tw.dataLayer||[]).push({event:'begin_checkout'});if(typeof tw.fbq==='function')tw.fbq('track','InitiateCheckout')}catch(x){}
 laadCk().then(function(){bouwCk();return kosten()}).catch(function(){ck.querySelector('.ck-body').innerHTML='<p class="ck-leeg">'+esc(T.error)+'</p>';ck.classList.remove('bezig')})}
bar.querySelector('.bw-co-open').addEventListener('click',function(e){e.preventDefault();openCk()});
bar.querySelector('.ct').style.cursor='pointer';bar.querySelector('.ct').addEventListener('click',openCk);
function topDoc(){try{return window.top.document}catch(e){return null}}
function zetAantal(n){n=+n||0;bar.hidden=!(n>0);var pw=doc.querySelector('.bw-powered'),ph=pw&&getComputedStyle(pw).display!=='none'?pw.offsetHeight:0;bar.style.bottom=ph+'px';if(ph)bar.style.paddingBottom='12px';doc.body.style.paddingBottom=(n>0?ph+70:ph)+'px';bar.querySelector('.ct').textContent=T.cart+' ('+n+')';var td=topDoc();if(td){td.querySelectorAll('[data-id="cartCounter"]').forEach(function(x){x.innerText=n;if(n>0)x.classList.remove('hidden')})}}
(function(){var td=topDoc();if(!td)return;var x=td.querySelector('[data-id="cartCounter"]');if(x&&!x.classList.contains('hidden')){var n=parseInt(x.innerText,10);if(n>0)zetAantal(n)}})();
function card(p){var meta=[];if(p.volume_cl)meta.push(p.volume_cl+' cl');if(p.abv)meta.push(String(p.abv).replace('.',',')+'%');var uit=!(p.stock>0)||!(p.price>0);
return '<article class="bw-shop-card" data-id="'+p.id+'"><div class="im" style="background-image:url('+esc(p.image)+')" role="img" aria-label="'+esc(p.name)+'"></div><div><h3>'+esc(p.name)+'</h3>'+(meta.length?'<div class="mt">'+esc(meta.join(' · '))+'</div>':'')+'<p class="sh">'+esc(p.short)+'</p>'+(p.url?'<a class="mi" href="'+esc(p.url)+'" target="_top">'+esc(T.more)+'</a>':'')+'<div class="rw"><span class="pr">'+(p.price>0?esc(eur(p.price)):'')+'</span>'+(uit?'<button class="ad" disabled>'+esc(T.sold)+'</button>':'<span class="qt"><button type="button" data-d="-1" aria-label="-">−</button><span>1</span><button type="button" data-d="1" aria-label="+">+</button></span><button type="button" class="ad">'+esc(T.add)+'</button>')+'</div></div><p class="ok" role="status"></p></article>'}
var P={};
cards.addEventListener('click',function(e){var c=e.target.closest('.bw-shop-card');if(!c)return;var p=P[c.dataset.id];if(!p)return;
 var d=e.target.closest('[data-d]');if(d){var s=c.querySelector('.qt span'),n=Math.max(1,Math.min(Math.max(1,p.stock),(+s.textContent||1)+(+d.dataset.d)));s.textContent=n;return}
 var b=e.target.closest('.ad');if(!b||b.disabled)return;var n=+(c.querySelector('.qt span')||{}).textContent||1;b.disabled=true;var ok=c.querySelector('.ok');ok.style.color='';ok.textContent='';
 fetch('/cart/add/'+p.id+'/'+n,{credentials:'same-origin',headers:{'X-Requested-With':'XMLHttpRequest',Accept:'application/json'}}).then(function(r){if(!r.ok)throw new Error(r.status);return r.json()}).then(function(o){b.disabled=false;ok.textContent='✓ '+T.added;zetAantal(o&&o.total_quantity);try{var tw=window.top;(tw.dataLayer=tw.dataLayer||[]).push({event:'add_to_cart',ecommerce:{currency:'EUR',value:p.price*n,items:[{item_id:p.sku||String(p.id),item_name:p.name,price:p.price,quantity:n}]}});if(typeof tw.fbq==='function')tw.fbq('track','AddToCart',{content_ids:[p.sku||String(p.id)],content_type:'product',value:p.price*n,currency:'EUR'})}catch(x){}}).catch(function(){b.disabled=false;ok.style.color='#8b2727';ok.textContent=T.error})});
fetch(C.api+'?lang='+encodeURIComponent(C.lang)).then(function(r){return r.json()}).then(function(o){var ps=(o&&o.products)||[];ps.forEach(function(p){P[p.id]=p});cards.innerHTML=ps.length?ps.map(card).join('')+'<p class="bw-shop-age">'+esc(T.age)+'</p>':'<div class="bw-shop-msg">'+esc(T.none)+'</div>';try{window.dispatchEvent(new Event('resize'))}catch(e){}}).catch(function(){cards.innerHTML='<div class="bw-shop-msg">'+esc(T.error)+'</div>'});
})();</script>`;
h = h.replace('</body>', js + '</body>');
return [{ json: { ...j, html: h } }];
}).call(__self,__mk(__items)));
// ===== Webshop productcache =====
__items=__norm(await (async function($input){
// 9 nov 2026 executiebudget: de webshop-productlijst (/bus-me-widget/shop) 15 min in localStorage, zodat niet elke
// (voor)geladen shop een extra n8n-executie in BtwBGSkEZqKKhJOf kost. Vervangt precies de fetch in node "Whisky webshop in widget".
const j = $input.first().json || {};
let h = String(j.html || '');
const oud = "fetch(C.api+'?lang='+encodeURIComponent(C.lang)).then(function(r){return r.json()}).then(function(o){var ps=";
const nieuw = "(function(){var k='bwShop1:'+C.lang;try{var c=JSON.parse(localStorage.getItem(k)||'null');if(c&&Date.now()-c.t<900000&&c.o&&c.o.products&&c.o.products.length)return Promise.resolve(c.o)}catch(e){}return fetch(C.api+'?lang='+encodeURIComponent(C.lang)).then(function(r){return r.json()}).then(function(o){try{if(o&&o.products&&o.products.length)localStorage.setItem(k,JSON.stringify({t:Date.now(),o:o}))}catch(e){}return o})})().then(function(o){var ps=";
if (h.indexOf(oud) >= 0) h = h.split(oud).join(nieuw);
return $input.all().map((it, i) => (i === 0 ? { json: { ...j, html: h } } : it));
}).call(__self,__mk(__items)));
// ===== Webshop meer info uitvouwen =====
__items=__norm(await (async function($input){
// 1 nov 2026 (Dennis): "Meer info" bij de whiskyflessen werkt zoals "Lees meer" bij de arrangementen. Geen link naar de
// website meer, maar een uitvouw in de widget met alle productdata uit Driver (foto's, kenmerken, het vat, de proeverij,
// het moment) en een bestelblok zoals reserveren bij een arrangement: aantal, totaal, In winkelmand of direct afrekenen.
// Weer invouwbaar. Data: BtwBGSkEZqKKhJOf /bus-me-widget/shop (description, usps, images). Toevoegen aan de mand loopt via
// de bestaande knop van de kaart (zelfde Driver-route, analytics en melding).
const j = $input.first().json || {}; let h = String(j.html || '');
const A = "(p.url?'<a class=\"mi\" href=\"'+esc(p.url)+'\" target=\"_top\">'+esc(T.more)+'</a>':'')";
const B = "'</div></div><p class=\"ok\" role=\"status\"></p></article>'";
const C = 'var P={};';
if (h.split(A).length !== 2 || h.split(B).length !== 2 || h.split(C).length !== 2) return [{ json: j }];
h = h.replace(A, () => "'<button type=\"button\" class=\"mi\" data-mi aria-expanded=\"false\">'+esc(T.more)+'</button>'");
h = h.replace(B, () => "'</div></div><div class=\"bw-sd\" hidden></div><p class=\"ok\" role=\"status\"></p></article>'");
h = h.replace(C, () => 'var P=window.__bwShopP={};');
const css = `<style id="bw-sd-css">
.bw-shop-card .im{cursor:pointer}
.bw-shop-card .mi{display:inline-block;margin:0 0 2px;padding:2px 0;color:#555;font-size:13px;text-decoration:underline;text-underline-offset:2px}
.bw-shop-card.sd-open .sh{-webkit-line-clamp:unset;display:block}
.bw-shop-card.sd-open .rw{display:none}
.bw-sd{grid-column:1/-1;margin:2px 0 0;animation:bwSdIn .22s ease}
@keyframes bwSdIn{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:none}}
.bw-sd .sd-gal{display:flex;gap:8px;overflow-x:auto;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;margin:0 0 10px;padding-bottom:4px}
.bw-sd .sd-gal img{flex:0 0 auto;height:190px;width:auto;max-width:82%;object-fit:contain;background:#f4efe8;border-radius:8px;scroll-snap-align:start}
.bw-sd .sd-gal:has(img:only-child) img{max-width:100%;margin:0 auto}
.bw-sd .sd-usp{display:flex;flex-wrap:wrap;gap:6px;list-style:none;margin:0 0 10px;padding:0}
.bw-sd .sd-usp li{font-size:12px;line-height:1.3;padding:5px 9px;border-radius:999px;background:#f4efe8;color:#4a4540;border:1px solid #e6dfd5}
.bw-sd .sd-txt{padding:12px 14px;background:#faf7f2;border:1px solid #e6dfd5;border-radius:8px;color:#333;font-size:14px;line-height:1.55;text-align:left}
.bw-sd .sd-txt p{margin:0 0 10px}.bw-sd .sd-txt p:last-child{margin:0}.bw-sd .sd-txt strong{color:#1d1d1b}
.bw-sd .sd-txt ul{margin:0 0 10px;padding-left:18px}
.bw-sd .sd-best{margin:12px 0 0;padding:12px 14px;border:1px solid #e6dfd5;border-radius:8px;background:#fff}
.bw-sd .sd-kop{font-weight:800;font-size:15px;color:#1d1d1b;margin:0 0 8px}
.bw-sd .sd-rij{display:flex;align-items:center;justify-content:space-between;gap:10px;margin:0 0 10px;font-size:14px;color:#444}
.bw-sd .sd-qt{display:inline-flex;align-items:center;border:1px solid #d8d1c7;border-radius:7px;height:40px}
.bw-sd .sd-qt button{width:38px;height:38px;border:0;background:none;font-size:19px;cursor:pointer;color:#1d1d1b}
.bw-sd .sd-qt span{min-width:26px;text-align:center;font-weight:700}
.bw-sd .sd-tot{font-weight:800;font-size:17px;color:#1d1d1b}
.bw-sd .sd-knop{display:block;width:100%;height:46px;border-radius:8px;font:inherit;font-weight:800;font-size:16px;cursor:pointer;margin:0 0 8px}
.bw-sd .sd-add{border:0;background:#1d1d1b;color:#fff}
.bw-sd .sd-dir{border:1.5px solid #1d1d1b;background:#fff;color:#1d1d1b}
.bw-sd .sd-knop[disabled]{opacity:.45;cursor:default}
.bw-sd .sd-info{font-size:12px;color:#6f6a63;margin:2px 0 0;text-align:center}
.bw-sd .sd-dicht{display:block;margin:10px auto 0;border:0;background:transparent;color:#555;text-decoration:underline;font:inherit;font-size:14px;cursor:pointer;padding:4px 8px}
</style>`;
const js = `<script id="bw-sd-js">(function(){
var L=(new URLSearchParams(location.search).get('lang')||document.documentElement.lang||'nl').slice(0,2).toLowerCase();
var TT={nl:{more:'Meer info',less:'Minder info',order:'Bestellen',qty:'Aantal',tot:'Totaal',add:'In winkelmand',dir:'Direct afrekenen',sold:'Uitverkocht',info:'Thuisbezorgd of afhalen in Loosbroek'},
en:{more:'More info',less:'Less info',order:'Order',qty:'Quantity',tot:'Total',add:'Add to cart',dir:'Checkout now',sold:'Sold out',info:'Home delivery or pick-up in Loosbroek'},
de:{more:'Mehr Info',less:'Weniger Info',order:'Bestellen',qty:'Menge',tot:'Gesamt',add:'In den Warenkorb',dir:'Direkt zur Kasse',sold:'Ausverkauft',info:'Lieferung nach Hause oder Abholung in Loosbroek'},
fr:{more:"Plus d'infos",less:"Moins d'infos",order:'Commander',qty:'Quantité',tot:'Total',add:'Ajouter au panier',dir:'Commander maintenant',sold:'Épuisé',info:'Livraison à domicile ou retrait à Loosbroek'},
es:{more:'Más info',less:'Menos info',order:'Pedir',qty:'Cantidad',tot:'Total',add:'Añadir a la cesta',dir:'Pagar ahora',sold:'Agotado',info:'Envío a domicilio o recogida en Loosbroek'}};
var T=TT[L]||TT.en;
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function eur(n){try{return new Intl.NumberFormat(L==='en'?'en-IE':(L+'-'+(L==='nl'?'NL':L.toUpperCase())),{style:'currency',currency:'EUR'}).format(n)}catch(e){return '€ '+Number(n).toFixed(2).replace('.',',')}}
function P(c){var m=window.__bwShopP||{};return m[c.dataset.id]}
function vul(c,p){var d=c.querySelector('.bw-sd');if(!d||d.dataset.vol)return;d.dataset.vol='1';
 var fotos=(p.images&&p.images.length?p.images:(p.image?[p.image]:[]));
 var uit=!(p.stock>0)||!(p.price>0);
 var g=fotos.length?'<div class="sd-gal">'+fotos.map(function(u){return '<img src="'+esc(u)+'" alt="'+esc(p.name)+'" loading="lazy">'}).join('')+'</div>':'';
 var u=(p.usps&&p.usps.length)?'<ul class="sd-usp">'+p.usps.map(function(x){return '<li>'+esc(x)+'</li>'}).join('')+'</ul>':'';
 var t=p.description?'<div class="sd-txt">'+p.description+'</div>':(p.short?'<div class="sd-txt"><p>'+esc(p.short)+'</p></div>':'');
 var b='<div class="sd-best"><div class="sd-kop">'+esc(T.order)+'</div>'+(uit?'<button type="button" class="sd-knop sd-add" disabled>'+esc(T.sold)+'</button>':
 '<div class="sd-rij"><span>'+esc(T.qty)+'</span><span class="sd-qt"><button type="button" data-sq="-1" aria-label="-">−</button><span>1</span><button type="button" data-sq="1" aria-label="+">+</button></span></div>'+
 '<div class="sd-rij"><span>'+esc(T.tot)+'</span><span class="sd-tot">'+esc(eur(p.price))+'</span></div>'+
 '<button type="button" class="sd-knop sd-add" data-sa>'+esc(T.add)+'</button><button type="button" class="sd-knop sd-dir" data-sc>'+esc(T.dir)+'</button><p class="sd-info">'+esc(T.info)+'</p>')+'</div>';
 d.innerHTML=g+u+t+b+'<button type="button" class="sd-dicht" data-mi>'+esc(T.less)+'</button>'}
function zet(c,open){var d=c.querySelector('.bw-sd'),p=P(c);if(!d||!p)return;if(open)vul(c,p);d.hidden=!open;c.classList.toggle('sd-open',open);var m=c.querySelector('.mi[data-mi]');if(m){m.textContent=open?T.less:T.more;m.setAttribute('aria-expanded',open?'true':'false')}
 if(open){try{c.scrollIntoView({behavior:'smooth',block:'start'})}catch(e){}}else{try{var r=c.getBoundingClientRect();if(r.top<0)c.scrollIntoView({block:'start'})}catch(e){}}
 try{window.dispatchEvent(new Event('resize'))}catch(e){}}
function aantal(c){return +(c.querySelector('.sd-qt span')||{}).textContent||1}
function voegToe(c,dan){var p=P(c);var hq=c.querySelector('.rw .qt span'),ha=c.querySelector('.rw .ad');if(!p||!ha||ha.disabled)return;
 if(hq)hq.textContent=aantal(c);var ok=c.querySelector('.ok');var knop=c.querySelectorAll('.bw-sd [data-sa],.bw-sd [data-sc]');knop.forEach(function(k){k.disabled=true});
 var mo=new MutationObserver(function(){var t=ok.textContent||'';if(!t)return;mo.disconnect();knop.forEach(function(k){k.disabled=false});if(hq)hq.textContent='1';if(t.charAt(0)==='✓')c.dataset.sdNet=String(aantal(c));
  if(t.charAt(0)==='✓'&&dan){var o=document.querySelector('.bw-shop-bar .bw-co-open');if(o)setTimeout(function(){o.click()},150)}});
 mo.observe(ok,{childList:true,characterData:true,subtree:true});setTimeout(function(){mo.disconnect();knop.forEach(function(k){k.disabled=false})},15000);
 ha.click()}
document.addEventListener('click',function(e){var c=e.target.closest&&e.target.closest('.bw-shop-card');if(!c)return;
 if(e.target.closest('[data-mi]')||e.target.closest('.im')){e.preventDefault();zet(c,c.querySelector('.bw-sd').hidden);return}
 var q=e.target.closest('[data-sq]');if(q){var p=P(c),s=c.querySelector('.sd-qt span'),n=Math.max(1,Math.min(Math.max(1,(p&&p.stock)||1),(+s.textContent||1)+(+q.dataset.sq)));s.textContent=n;delete c.dataset.sdNet;var t=c.querySelector('.sd-tot');if(t&&p)t.textContent=eur(p.price*n);return}
 if(e.target.closest('[data-sa]')){voegToe(c,false);return}
 if(e.target.closest('[data-sc]')){if(c.dataset.sdNet&&+c.dataset.sdNet===aantal(c)){var o=document.querySelector('.bw-shop-bar .bw-co-open');if(o){o.click();return}}voegToe(c,true);return}
});
})();</script>`;
h = h.replace('</head>', css + '</head>');
h = h.replace('</body>', js + '</body>');
// 2 nov 2026 (Dennis): deeplink naar een product (shop=1&product=<id>, of window.__bwToonProduct vanuit bus-chat-core.js).
const sp = "<script id=\"bw-sp-js\">(function(){\n// 2 nov 2026 (Dennis): Meer info-links op de site (/<slug>/<driverId>) openen de widget-webshop met dat product bovenaan, uitgevouwen.\n// Vanuit de URL (shop=1&product=<id>) of vanuit de parent via window.__bwToonProduct(id) (voorgeladen #bwShopFrame, geen herladen).\nvar wacht=0;\nfunction ids(){return Object.keys(window.__bwShopP||{})}\nwindow.__bwShopIds=ids;\nwindow.__bwToonProduct=function(id){id=String(id||'').replace(/[^0-9]/g,'');if(!id)return;var mijn=++wacht,t0=Date.now();\n (function poog(){if(mijn!==wacht)return;var cards=document.getElementById('cards'),c=cards&&cards.querySelector('.bw-shop-card[data-id=\"'+id+'\"]');\n  if(!c||!(window.__bwShopP||{})[id]){if(Date.now()-t0<15000)setTimeout(poog,80);return}\n  var tr=document.querySelector('.bw-co-terug');if(document.documentElement.classList.contains('bw-co-aan')&&tr)tr.click();\n  cards.querySelectorAll('.bw-shop-card.sd-open').forEach(function(x){if(x!==c){var m=x.querySelector('.mi[data-mi]');if(m)m.click()}});\n  if(cards.firstElementChild!==c)cards.insertBefore(c,cards.firstElementChild);\n  var d=c.querySelector('.bw-sd'),mi=c.querySelector('.mi[data-mi]');\n  if(d&&d.hidden&&mi)mi.click();\n  try{(document.scrollingElement||document.documentElement).scrollTop=0;window.scrollTo(0,0)}catch(e){}\n  setTimeout(function(){try{window.scrollTo(0,0)}catch(e){}},60);\n })()};\nvar q=new URLSearchParams(location.search).get('product');if(q)window.__bwToonProduct(q);\n})();</script>";
if (h.indexOf('id="bw-sp-js"') < 0) h = h.replace('</body>', () => sp + '</body>');
return [{ json: { ...j, html: h } }];

}).call(__self,__mk(__items)));
// ===== Webshop afrekenen in widget =====
__items=__norm(await (async function($input){
// 31 okt 2026 (Dennis): webshop-afrekenen en betalen blijven in de widget, net als bij reserveren.
// 1 nov 2026: bij versturen zet de iframe zijn URL op /bestellen (replaceState). Driver stuurt bij een afkeuring terug naar de Referer;
// zo landt de gast op /bestellen, leest 'Webshop terug in widget' de $notify-melding en toont de widget die bij de checkout.
// 1 nov 2026: tijdens versturen is de iframe onzichtbaar (laadicoon, data-bw-sub) zodat Driver-tussenpagina's (/order/store, /bestellen met rode melding) niet flitsen;
// 'Webshop terug in widget' maakt hem weer zichtbaar bij Mollie of een widgetpagina.
// 1 nov 2026 (2): Mollie weigert iframes (wit scherm). Afrekenen gaat nu in het volledige venster (target _top), net als reserveren en
// de cadeaubon; bw-shop-retour bewaart de pagina waar de gast was. De kern (bus-chat-core.js, build 2026110102) slaat Driver's bedank-
// of foutpagina over en opent de widget daar weer op de bevestiging of de checkout met melding. Geen onzichtbaar maken meer bij versturen
// (daardoor flitste de reserveringswidget eronder).
// 1 nov 2026 (3): bw-shop-retour ook in localStorage (bank-app opent de terugkeer soms in een nieuw tabblad).
// Patcht de html van 'Whisky webshop in widget': bestelformulier post naar de iframe zelf (target _self i.p.v. _top) met vlag bw-shop-order,
// en de widget toont bij besteld=1 een bevestiging en bij shopfout=1 weer het afrekenscherm. Het terugsturen van de Driver-pagina
// naar de widget gebeurt in de parent (script uit node 'Niet automatisch openen').
const j = $input.first().json || {}; let h = String(j.html || '');
const A = "f.target='_top';";
if (h.indexOf('id="bw-shop-js"') < 0 || h.indexOf(A) < 0) return [{ json: j }];
h = h.replace(A, "f.target='_top';try{sessionStorage.setItem('bw-shop-order',String(Date.now()));var tl=window.top.location;var rj=JSON.stringify({u:tl.href,p:tl.pathname,t:Date.now()});sessionStorage.setItem('bw-shop-retour',rj);try{localStorage.setItem('bw-shop-retour',rj)}catch(y){}}catch(x){}try{history.replaceState(history.state,'','/bestellen')}catch(x){}try{fetch('/reserveren/widget?launcher=0&modal=1&shop=1&diag='+encodeURIComponent('submit|terug='+(window.parent&&window.parent.__busShopTerug?1:0)+'|'+(navigator.userAgent||'').slice(0,90)+'|'+(Date.now()%1e7)),{keepalive:true,credentials:'omit'})}catch(x){}");
const BLOK = "(function(){var s=new URLSearchParams(location.search),RES={\"nl\": {\"t\": \"Bestelling\", \"h\": \"Bedankt voor je bestelling!\", \"nr\": \"Bestelnummer\", \"m\": \"Je ontvangt een bevestiging per mail.\", \"v\": \"Verder winkelen\", \"f\": \"De betaling is niet afgerond. Je winkelmand staat nog klaar, probeer het opnieuw.\"}, \"en\": {\"t\": \"Order\", \"h\": \"Thank you for your order!\", \"nr\": \"Order number\", \"m\": \"You will receive a confirmation by email.\", \"v\": \"Continue shopping\", \"f\": \"The payment was not completed. Your basket is still here, please try again.\"}, \"de\": {\"t\": \"Bestellung\", \"h\": \"Vielen Dank für deine Bestellung!\", \"nr\": \"Bestellnummer\", \"m\": \"Du erhältst eine Bestätigung per E-Mail.\", \"v\": \"Weiter einkaufen\", \"f\": \"Die Zahlung wurde nicht abgeschlossen. Dein Warenkorb ist noch da, bitte versuche es erneut.\"}, \"fr\": {\"t\": \"Commande\", \"h\": \"Merci pour votre commande !\", \"nr\": \"Numéro de commande\", \"m\": \"Vous recevrez une confirmation par e-mail.\", \"v\": \"Continuer mes achats\", \"f\": \"Le paiement n'a pas abouti. Votre panier est toujours là, veuillez réessayer.\"}, \"es\": {\"t\": \"Pedido\", \"h\": \"¡Gracias por tu pedido!\", \"nr\": \"Número de pedido\", \"m\": \"Recibirás una confirmación por correo electrónico.\", \"v\": \"Seguir comprando\", \"f\": \"El pago no se completó. Tu cesta sigue aquí, inténtalo de nuevo.\"}},R=RES[C.lang]||RES.en;if(s.get('besteld')==='1'){try{sessionStorage.removeItem('bw-shop-order')}catch(x){}zetAantal(0);var nr=s.get('nr')||'';var o=doc.createElement('div');o.className='bw-co bw-ck bw-ok';o.innerHTML='<div class=\"bw-co-kop\"><b>'+esc(R.t)+'</b></div><div class=\"ck-body\"><div class=\"ok-b\"><div class=\"ok-i\">✓</div><h3>'+esc(R.h)+'</h3>'+(nr?'<p>'+esc(R.nr)+' <b>'+esc(nr)+'</b></p>':'')+'<p>'+esc(R.m)+'</p><button type=\"button\" class=\"ck-pay ok-v\">'+esc(R.v)+'</button></div></div>';var br=doc.querySelector('.brand'),pw=doc.querySelector('.bw-powered');o.style.top=(br?Math.max(0,Math.round(br.getBoundingClientRect().bottom)):0)+'px';o.style.bottom=(pw&&getComputedStyle(pw).display!=='none'?pw.offsetHeight:0)+'px';doc.body.appendChild(o);doc.documentElement.classList.add('bw-co-aan');o.querySelector('.ok-v').addEventListener('click',function(){o.remove();doc.documentElement.classList.remove('bw-co-aan')});try{var tw=window.top;(tw.dataLayer=tw.dataLayer||[]).push({event:'purchase',ecommerce:{transaction_id:nr||undefined,currency:'EUR'}});if(typeof tw.fbq==='function')tw.fbq('track','Purchase',{currency:'EUR'})}catch(x){}}else if(s.get('shopfout')==='1'){openCk();var mm=ck&&ck.querySelector('.ck-msg');if(mm)mm.textContent=s.get('msg')||R.f}})();\n";
const st = h.indexOf('<script id="bw-shop-js">'); const end = h.indexOf('})();</script>', st);
if (st < 0 || end < 0) return [{ json: { ...j, html: h } }];
h = h.slice(0, end) + BLOK + h.slice(end);
h = h.replace('</head>', "<style id=\"bw-shop-ok-css\">.bw-ok .ok-b{text-align:center;padding:28px 18px}.bw-ok .ok-i{width:56px;height:56px;border-radius:50%;background:#1d7a3e;color:#fff;font-size:30px;line-height:56px;margin:0 auto 12px}.bw-ok h3{margin:0 0 8px;font-size:18px;color:#1d1d1b}.bw-ok p{margin:0 0 8px;font-size:14px;color:#444}.bw-ok .ok-v{max-width:320px}</style>" + '</head>');
return [{ json: { ...j, html: h } }];
}).call(__self,__mk(__items)));
// ===== Webshop adresblok en afhalen =====
__items=__norm(await (async function($input){
// 31 okt 2026 (Dennis): adresblok webshop-afrekenen. Postcode even breed als E-mailadres en Straat (huisnr. en toev. samen rechts),
// en bij Afhalen in Loosbroek verdwijnen postcode, huisnummer, toevoeging, straat, plaats en land en zijn ze niet verplicht.
// Patcht de html van 'Whisky webshop in widget' (zelfde patroon als 'Webshop afrekenen in widget').
const j = $input.first().json || {}; let h = String(j.html || '');
if (h.indexOf('id="bw-shop-js"') < 0) return [{ json: j }];
const P = [
 ['\'<div class="r3"><input class="fld" name="zip" placeholder="\'+esc(K.zip)+\'" autocomplete="postal-code"><input class="fld" name="nr" placeholder="\'+esc(K.nr)+\'" inputmode="numeric"><input class="fld" name="ad" placeholder="\'+esc(K.add)+\'"></div>\'+',
  '\'<div class="ck-adr"><div class="r2"><input class="fld" name="zip" placeholder="\'+esc(K.zip)+\'" autocomplete="postal-code"><div class="r2n"><input class="fld" name="nr" placeholder="\'+esc(K.nr)+\'" inputmode="numeric"><input class="fld" name="ad" placeholder="\'+esc(K.add)+\'"></div></div>\'+'],
 ['\'<select class="fld" name="co" autocomplete="country">\'+ctr+\'</select>\'+',
  '\'<select class="fld" name="co" autocomplete="country">\'+ctr+\'</select></div>\'+'],
 ["var need=['fn','ln','em','ph','zip','nr','st','ci'],fout=false;",
  "var need=M==='pickup'?['fn','ln','em','ph']:['fn','ln','em','ph','zip','nr','st','ci'],fout=false;"]
];
for (const [a, b] of P) { if (h.split(a).length !== 2) return [{ json: { ...j, html: h } }]; }
for (const [a, b] of P) h = h.replace(a, () => b);
h = h.replace('</head>', '<style id="bw-shop-adr-css">.bw-ck .r2n{display:grid;grid-template-columns:1.3fr 1fr;gap:7px}.bw-ck.afhalen .ck-adr{display:none}</style></head>');
return [{ json: { ...j, html: h } }];
}).call(__self,__mk(__items)));
// ===== Webshop Wallet en kortingscode =====
__items=__norm(await (async function($input){
const j=$input.first().json||{};let h=String(j.html||'');
const css=`<style id="bw-shop-credit-css">
.bw-ck .bw-credit{margin:5px 0 9px;padding:10px;border:1px solid #ece6dc;border-radius:8px;background:#faf7f2}
.bw-ck .bw-credit label{display:block;margin:0 0 6px;font-size:14px;font-weight:700;color:#1d1d1b}
.bw-ck .bw-credit input{display:block;box-sizing:border-box;width:100%;height:40px;margin:0 0 6px;padding:0 10px;border:1px solid #d8d1c7;border-radius:7px;background:#fff;color:#1d1d1b;font:inherit;font-size:16px}
.bw-ck .bw-credit input::placeholder{color:#8a8478}.bw-ck .bw-credit input[name=bwvoucher]::placeholder{font-style:italic;font-size:12.5px}
.bw-ck .bw-disc-toggle{display:inline-block;border:0;background:none;color:#555;text-decoration:underline;font:inherit;font-size:14px;cursor:pointer;padding:4px 0;margin:0}
.bw-ck .bw-disc-wrap{display:none;margin-top:7px}.bw-ck .bw-disc-wrap.open{display:block}.bw-ck .bw-disc-wrap input{text-transform:uppercase}
.bw-ck .bw-credit-apply{width:100%;height:40px;margin-top:4px;border:0;border-radius:7px;background:#1d1d1b;color:#fff;font:inherit;font-weight:800;cursor:pointer}.bw-ck .bw-credit-apply[disabled]{opacity:.55}
.bw-ck .bw-credit-msg{font-size:12px;line-height:1.4;margin:7px 0 0}.bw-ck .bw-credit-msg.ok{color:#24783b}.bw-ck .bw-credit-msg.no{color:#8b2727}.bw-ck .bw-credit-break{margin-top:4px;color:#555}.bw-ck .bw-credit-lock{font-size:11px;color:#6f6a63;margin-top:5px}
.bw-ck .ck-x [data-x=kc],.bw-ck .kc{display:none!important}
</style>`;
const js=String.raw`<script id="bw-shop-credit-js">(function(){
var END='https://buswhiskyevents.app.n8n.cloud/webhook/bus-wallet/webshop/check';
function vpLinkCode(){var raw='';try{raw=new URL(window.top.location.href).searchParams.get('bw_vp')||''}catch(e){try{raw=new URL(location.href).searchParams.get('bw_vp')||''}catch(_){}}raw=String(raw).trim().toUpperCase();return /^VOORPRET-[A-Z0-9]{6}$/.test(raw)?raw:''}
var VP_LINK=vpLinkCode();if(VP_LINK){try{sessionStorage.setItem('bw-shop-credit-input',JSON.stringify({v:'',d:VP_LINK}))}catch(e){}}

function euro(v){try{return new Intl.NumberFormat('nl-NL',{style:'currency',currency:'EUR'}).format(Number(v||0))}catch(e){return '€ '+Number(v||0).toFixed(2)}}
function ref(){try{var x=sessionStorage.getItem('bw-shop-checkout-ref');if(x)return x;x='WS-'+Date.now()+'-'+Math.random().toString(36).slice(2,9).toUpperCase();sessionStorage.setItem('bw-shop-checkout-ref',x);return x}catch(e){return 'WS-'+Date.now()}}
function n(v){v=Number(v);return Number.isFinite(v)?v:0}
function currentCart(ck){var co=ck.querySelector('[name=co]'),m=ck.querySelector('input[name=ckm]:checked');var u='/cart/get-data?countryCode='+encodeURIComponent(co?co.value:'NL')+'&shippingMethod='+encodeURIComponent(m?m.value:'deliver');return fetch(u,{credentials:'same-origin',headers:{Accept:'application/json','X-Requested-With':'XMLHttpRequest'}}).then(function(r){if(!r.ok)throw new Error(String(r.status));return r.json()})}
function gross(c){var total=n(c&&c.total_price_incl),disc=n(c&&c.discount_price);if(total>0||disc>0)return Math.round((total+disc)*100)/100;var p=n(c&&c.products_price_incl),s=n(c&&c.shipping_costs);return Math.round((p+s)*100)/100}
function mount(ck){if(!ck||ck.querySelector('.bw-credit'))return;var x=ck.querySelector('.ck-x');if(!x)return;var oldLink=x.querySelector('[data-x=kc]');if(oldLink)oldLink.style.display='none';var old=ck.querySelector('.kc');if(old)old.hidden=true;
 var box=document.createElement('div');box.className='bw-credit';box.innerHTML='<label>Waardebon</label><input name="bwvoucher" autocomplete="off" spellcheck="false" placeholder="Meer dan 1 waardebon? Scheid de codes met ; of ,"><button type="button" class="bw-disc-toggle" aria-expanded="false">Ik heb een kortingscode</button><div class="bw-disc-wrap"><input name="bwdiscount" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="Kortingscode (optioneel)"></div><button type="button" class="bw-credit-apply">Toepassen</button><div class="bw-credit-msg" role="status"></div>';
 x.parentNode.insertBefore(box,x);var vi=box.querySelector('[name=bwvoucher]'),di=box.querySelector('[name=bwdiscount]'),tg=box.querySelector('.bw-disc-toggle'),dw=box.querySelector('.bw-disc-wrap'),bt=box.querySelector('.bw-credit-apply'),msg=box.querySelector('.bw-credit-msg');
 try{var sv=JSON.parse(sessionStorage.getItem('bw-shop-credit-input')||'{}');vi.value=sv.v||'';di.value=sv.d||'';if(di.value){dw.classList.add('open');tg.textContent='Kortingscode verbergen';tg.setAttribute('aria-expanded','true')}}catch(e){}
 function save(){try{sessionStorage.setItem('bw-shop-credit-input',JSON.stringify({v:vi.value,d:di.value}))}catch(e){}}
 vi.addEventListener('input',save);di.addEventListener('input',function(){di.value=di.value.toUpperCase();save()});tg.addEventListener('click',function(){var o=dw.classList.toggle('open');tg.textContent=o?'Kortingscode verbergen':'Ik heb een kortingscode';tg.setAttribute('aria-expanded',o?'true':'false');if(o)setTimeout(function(){di.focus()},0)});
 bt.addEventListener('click',async function(){var v=vi.value.trim(),d=di.value.trim();if(!v&&!d){msg.className='bw-credit-msg no';msg.textContent='Vul een waardebon of kortingscode in.';return}bt.disabled=true;bt.textContent='Controleren…';msg.className='bw-credit-msg';msg.textContent='';try{var c=await currentCart(ck),g=gross(c);if(!(g>0))throw new Error('order_total');var r=await fetch(END,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({order_total:g,shipping_total:n(c&&c.shipping_costs),email:((ck.querySelector('[name=em]')||{}).value||'').trim(),voucher_code:v,discount_code:d,checkout_ref:ref()})});var tx=await r.text(),o=null;try{o=JSON.parse(tx)}catch(_){o=null}if(!o)throw new Error('Controleren lukte niet. Probeer het opnieuw.');if(!r.ok||!o||o.ok!==true){throw new Error((o&&o.message)||'Deze code kon niet worden toegepast.')}var oldInp=ck.querySelector('.kc input[name=kc]'),oldBtn=ck.querySelector('.kc .kc-ok');if(!oldInp||!oldBtn||!o.technical_code)throw new Error('Technische verrekening kon niet worden gestart.');oldInp.value=o.technical_code;oldBtn.click();var parts=[];if(Number(o.discount_amount)>0)parts.push('Kortingscode: -'+euro(o.discount_amount));if(Number(o.voucher_amount)>0)parts.push('Waardebon: -'+euro(o.voucher_amount));parts.push('Nog te betalen: '+euro(o.remaining));msg.className='bw-credit-msg ok';msg.innerHTML='✓ '+parts.join(' · ')+'<div class="bw-credit-lock">De verrekening is gereserveerd voor deze checkout.</div>';vi.readOnly=true;di.readOnly=true;bt.disabled=true;bt.textContent='Toegepast';try{sessionStorage.setItem('bw-shop-credit-applied',JSON.stringify({ref:o.checkout_ref,tech:o.technical_code,v:v,d:d,total:o.total_credit}))}catch(e){}setTimeout(function(){var m=ck.querySelector('.kc-m');if(m)m.textContent=''},500)}catch(e){msg.className='bw-credit-msg no';msg.textContent=e&&e.message?e.message:'Controleren lukte niet. Probeer het opnieuw.';bt.disabled=false;bt.textContent='Toepassen'}});
}
function run(){document.querySelectorAll('.bw-ck').forEach(mount)}
new MutationObserver(run).observe(document.documentElement,{childList:true,subtree:true});document.addEventListener('click',function(e){if(e.target&&e.target.closest&&e.target.closest('.bw-co-open'))setTimeout(run,20)},true);run();
})();</script>`;
if(h.indexOf('id="bw-shop-credit-css"')<0)h=h.replace('</head>',css+'</head>');if(h.indexOf('id="bw-shop-credit-js"')<0)h=h.replace('</body>',js+'</body>');return [{json:{...j,html:h}}];
}).call(__self,__mk(__items)));
// ===== Webshop waardebon als reserveren =====
__items=__norm(await (async function($input){
// 31 okt 2026 (Dennis): waardebon en kortingscode in de webshop-checkout exact zoals bij de reserveringscheckout:
// zelfde vak, label, veld en grijs linkje, GEEN aparte Toepassen-knop. De controle gebeurt bij Bestellen en betalen (net als Reserveer):
// is er een code ingevuld en nog niet toegepast, dan klikt dit script de verborgen Toepassen-knop van 'Webshop Wallet en kortingscode',
// wacht op het resultaat en gaat bij succes door met bestellen; bij een fout blijft de melding in het vak staan.
// 1 nov 2026 (Dennis): totalen en Bestellen en betalen scrollen mee met de rest: het blok .ck-voet wordt na het opbouwen IN .ck-body (onderaan) gezet.
// 1 nov 2026 (Dennis): ingevulde gegevens worden onthouden (localStorage bw-shop-ck-v1) en bij een nieuw afrekenscherm teruggezet.
const j=$input.first().json||{};let h=String(j.html||'');
if(h.indexOf('id="bw-shop-credit-js"')<0)return [{json:j}];
const css="<style id=\"bw-shop-credit-res\">\n.bw-ck .bw-credit-apply{display:none!important}\n.bw-ck .bw-credit{margin:4px 0 12px;padding:10px;border:1px solid #ece6dc;border-radius:8px;background:#faf7f2}\n.bw-ck .bw-credit label{display:block;margin:0 0 6px;font-size:14px;font-weight:700;color:#1d1d1b}\n.bw-ck .bw-credit input{display:block;box-sizing:border-box;width:100%;height:auto;margin:0 0 4px;padding:12px 13px;border:1px solid #d8d1c7;border-radius:7px;background:#fff;color:#1d1d1b;font-size:16px!important;line-height:1.3!important;outline:none;-webkit-appearance:none;appearance:none}\n.bw-ck .bw-credit input:focus{border-color:#1d1d1b;box-shadow:0 0 0 2px rgba(29,29,27,.08)}\n.bw-ck .bw-credit input::placeholder{color:#8a8478;font-style:normal!important}\n.bw-ck .bw-credit input[name=bwvoucher]{padding-left:11px;padding-right:8px}\n.bw-ck .bw-credit input[name=bwvoucher]::placeholder{font-size:12.5px;letter-spacing:-.1px}\n.bw-ck .bw-disc-toggle{display:inline-block;width:auto;margin:2px 0 0;padding:4px 0;border:0;background:none!important;color:#555!important;font-size:14px;text-decoration:underline;cursor:pointer;box-shadow:none}\n.bw-ck .bw-disc-wrap{margin-top:8px}.bw-ck .bw-disc-wrap input{margin-bottom:0}\n.bw-ck .bw-credit-msg{font-size:14px;margin:8px 0 0}.bw-ck .bw-credit-msg:empty{display:none}\n@media(max-width:380px){.bw-ck .bw-credit input[name=bwvoucher]::placeholder{font-size:11px;letter-spacing:-.2px}}\n.bw-ck .ck-body>.ck-voet{margin:14px -14px -6px;border-radius:0}\n</style>";
const js="<script id=\"bw-shop-credit-res-js\">(function(){var busy=false,door=false;\ndocument.addEventListener('click',function(e){var pb=e.target&&e.target.closest&&e.target.closest('.bw-ck .ck-pay');if(!pb||door)return;var ck=pb.closest('.bw-ck'),box=ck&&ck.querySelector('.bw-credit');if(!box)return;\nvar vi=box.querySelector('[name=bwvoucher]'),di=box.querySelector('[name=bwdiscount]'),bt=box.querySelector('.bw-credit-apply'),msg=box.querySelector('.bw-credit-msg');if(!bt||!msg)return;\nvar v=(vi&&vi.value||'').trim(),d=(di&&di.value||'').trim();if(!v&&!d)return;if((vi&&vi.readOnly)||bt.textContent==='Toegepast')return;\ne.preventDefault();e.stopImmediatePropagation();if(busy)return;busy=true;var lbl=pb.textContent,som=ck.querySelector('.ck-som'),voor=som?som.textContent:'';pb.disabled=true;pb.textContent='Waardebon controleren…';\nbt.disabled=false;bt.click();var t0=Date.now();\n(function wacht(){var c=' '+msg.className+' ';if(c.indexOf(' ok ')>=0){var t1=Date.now();(function totaal(){if((som&&som.textContent!==voor)||Date.now()-t1>3000){busy=false;pb.disabled=false;pb.textContent=lbl;door=true;pb.click();door=false}else setTimeout(totaal,150)})()}\nelse if(c.indexOf(' no ')>=0||Date.now()-t0>20000){busy=false;pb.disabled=false;pb.textContent=lbl;try{box.scrollIntoView({block:'center',behavior:'smooth'})}catch(x){}}else setTimeout(wacht,150)})()},true)})();</script>";
if(h.indexOf('id="bw-shop-credit-res"')<0)h=h.replace('</head>',css+'</head>');
if(h.indexOf('id="bw-shop-credit-res-js"')<0)h=h.replace('</body>',js+'</body>');
const js2="<script id=\"bw-shop-ck-extra\">(function(){var K='bw-shop-ck-v1',F=['fn','ln','em','ph','zip','nr','ad','st','ci','co','cm'];\nfunction lees(){try{return JSON.parse(localStorage.getItem(K)||'{}')}catch(e){return {}}}\nfunction bewaar(ck){var o=lees();F.forEach(function(n){var e=ck.querySelector('[name=\"'+n+'\"]');if(e)o[n]=e.value});var m=ck.querySelector('input[name=ckm]:checked');if(m)o.ckm=m.value;var q=ck.querySelector('input[name=ckpay]:checked');if(q)o.ckpay=q.value;try{localStorage.setItem(K,JSON.stringify(o))}catch(e){}}\nfunction herstel(ck){if(ck.dataset.bwHersteld||!ck.querySelector('[name=fn]'))return;ck.dataset.bwHersteld='1';var o=lees();F.forEach(function(n){var e=ck.querySelector('[name=\"'+n+'\"]');if(e&&o[n]&&!e.value)e.value=o[n]});if(o.ckm){var m=ck.querySelector('input[name=ckm][value=\"'+o.ckm+'\"]');if(m&&!m.checked)m.click()}if(o.ckpay){var q=ck.querySelector('input[name=ckpay][value=\"'+o.ckpay+'\"]');if(q)q.checked=true}ck.addEventListener('input',function(){bewaar(ck)});ck.addEventListener('change',function(){bewaar(ck)})}\nfunction voet(ck){var b=ck.querySelector('.ck-body'),v=ck.querySelector(':scope>.ck-voet');if(b&&v&&b.querySelector('.ck-lines'))b.appendChild(v)}\nfunction run(){document.querySelectorAll('.bw-ck:not(.bw-ok)').forEach(function(ck){voet(ck);herstel(ck)})}\nnew MutationObserver(run).observe(document.documentElement,{childList:true,subtree:true});run()})();</script>";
if(h.indexOf('id="bw-shop-ck-extra"')<0)h=h.replace('</body>',js2+'</body>');
return [{json:{...j,html:h}}];
}).call(__self,__mk(__items)));
// ===== Checkout zonder aanhef =====
__items=__norm(await (async function($input){
// 1 nov 2026: Driver eist een niet-lege aanhef (invoice_salutation required; spatie wordt door Laravel weggetrimd -> afkeuring en terug naar de shop).
// De gast ziet geen aanhef; naar Driver gaat '-' (onzichtbare tekens zoals NBSP keurt Driver ook af, getest).
const j=$input.first().json||{};let h=String(j.html||'');
const css='<style id="bw-no-salutation">.bw-ck .seg.sm{display:none!important}</style>';
// 1 nov 2026 (Dennis): bij Afhalen GEEN verplichte adresvelden (blijven verborgen). Driver eist wel een factuuradres;
// lege adresvelden gaan bij Afhalen als '-' naar Driver (getest: Driver accepteert '-').
const F_OUD="var f=doc.createElement('form');";
if(h.indexOf(F_OUD)>=0&&h.indexOf('bw-afhalen-adres')<0)h=h.replace(F_OUD,"/*bw-afhalen-adres*/if(M==='pickup'){['invoice_street','invoice_house_number','invoice_zip','invoice_city'].forEach(function(k){if(!String(F[k]==null?'':F[k]).trim())F[k]='-'})}"+F_OUD);
const js=`<script id="bw-no-salutation-js">(function(){function fix(){document.querySelectorAll('.bw-ck .seg.sm').forEach(function(s){s.style.display='none'});var ck=document.querySelector('.bw-ck');if(!ck)return;var old=ck.querySelector('input[name="cks"][data-bw-empty]');if(!old){var i=document.createElement('input');i.type='radio';i.name='cks';i.value='-';i.checked=true;i.hidden=true;i.setAttribute('data-bw-empty','1');ck.appendChild(i)}else old.checked=true}document.addEventListener('click',function(e){if(e.target&&e.target.closest&&e.target.closest('.bw-co-open'))setTimeout(fix,0)},true);new MutationObserver(fix).observe(document.documentElement,{childList:true,subtree:true});fix()})();</script>`;
if(h.indexOf('id="bw-no-salutation"')<0)h=h.replace('</head>',css+'</head>');if(h.indexOf('id="bw-no-salutation-js"')<0)h=h.replace('</body>',js+'</body>');return [{json:{...j,html:h}}];
}).call(__self,__mk(__items)));
// ===== Mobiel uniform met chat =====
__items=__norm(await (async function($input){
// 31 okt 2026: EEN coordinator voor chat en reserveringspaneel (vervangt de sync-interval, het terugopenen
// van het paneel na sluiten van de chat, de chat-auto-open-blokkade en de launcher-CSS-node).
// Draait in de PARENT (script-element, overleeft het herladen van de iframe), alleen observers op het paneel
// en de chat-wrapper, geen intervals of polling. Regel: er staat nooit meer dan een pop-up open.
//  - paneel gaat open (klik of boeklink/deeplink) -> open chat sluit (een keer)
//  - chat geopend door een klik van de gast -> paneel sluit
//  - chat-auto-open (niet-gast-klik op de toggle) terwijl het paneel open is -> geblokkeerd bij de bron
// Er wordt nooit iets automatisch geopend en de chatobserver zet alleen een klasse: een lus is uitgesloten
// (31 okt: eerdere versie die op elke chatmutatie de toggle klikte, kon heen en weer klikken).
const j = $input.first().json || {}; let h = String(j.html || '');
const CSS = ".chat-window-wrapper{z-index:2147483600!important;pointer-events:none!important}.chat-window-wrapper .chat-window,.chat-window-wrapper .chat-window-toggle{pointer-events:auto!important}.chat-window-wrapper .chat-window{position:relative!important}.chat-window-wrapper .chat-window-toggle{visibility:visible!important;opacity:1!important;z-index:2147483647!important}#booking-widget.is-open>div.fixed:not(#booking-widget-panel){display:flex!important;visibility:visible!important;opacity:1!important;z-index:2147483646!important}#booking-widget #bwCollapse{z-index:2147483647!important}#bwChatClose{position:absolute!important;top:10px!important;right:10px!important;z-index:2147483646!important;width:38px!important;height:38px!important;border:0!important;border-radius:50%!important;background:#1d1d1b!important;color:#fff!important;font:400 28px/38px Arial,sans-serif!important;padding:0!important;display:grid!important;place-items:center!important;box-shadow:0 2px 8px rgba(0,0,0,.25)!important;cursor:pointer!important}#bw-zwart{display:none;position:fixed;left:0;right:0;top:-120px;bottom:auto;height:calc(100lvh + 360px);min-height:calc(100vh + 360px);background:#000;z-index:39}@media(max-width:639px){html.booking-widget-open #bw-zwart,html.bw-chat-open #bw-zwart{display:block!important}html.booking-widget-open,html.booking-widget-open body,html.bw-chat-open,html.bw-chat-open body{background:#000!important}.chat-window-wrapper{left:16px!important;right:16px!important;top:16px!important;bottom:80px!important;width:auto!important;height:auto!important;max-width:none!important}.chat-window-wrapper .chat-window{width:100%!important;max-width:none!important;height:100%!important;max-height:none!important;border-radius:8px!important;overflow:hidden!important}html #booking-widget #booking-widget-panel,html #booking-widget.is-gift #booking-widget-panel{top:16px!important;left:16px!important;right:16px!important;bottom:80px!important;width:auto!important;height:auto!important;max-height:none!important;border-radius:8px!important}#booking-widget.is-open #bwCollapse{display:grid!important;left:16px!important;right:auto!important;bottom:16px!important}.chat-window-wrapper .chat-window-toggle{position:fixed!important;left:72px!important;bottom:16px!important}html.booking-widget-open body .chat-window-wrapper{display:flex!important}}";
const PARENT = `(function(){if(window.__bwCoord5)return;window.__bwCoord5=1;var d=document,w=window;
var st=d.getElementById('bw-coord-css');if(!st){st=d.createElement('style');st.id='bw-coord-css';d.head.appendChild(st)}st.textContent=${JSON.stringify(CSS)};
if(!d.getElementById('bw-zwart')){var z=d.createElement('div');z.id='bw-zwart';z.setAttribute('aria-hidden','true');d.body.appendChild(z)}
function host(){return d.getElementById('booking-widget')}
function chatWin(){return d.querySelector('.chat-window-wrapper .chat-window')}
function toggle(){return d.querySelector('.chat-window-wrapper .chat-window-toggle')}
function chatOpen(){var c=chatWin();if(!c||!c.getClientRects().length)return false;var s=w.getComputedStyle(c);return s.display!=='none'&&s.visibility!=='hidden'&&s.opacity!=='0'}
function bookOpen(){var x=host();return !!x&&x.classList.contains('is-open')}
var eigen=0,laatsteToggle=0;
function closeChat(){if(!chatOpen()||Date.now()-laatsteToggle<900)return;var t=toggle();if(!t)return;eigen=1;try{t.click()}finally{eigen=0}}
// Chat-toggle: een automatische (niet door de gast geklikte) opening terwijl het paneel open staat wordt bij de bron
// geblokkeerd; een echte klik van de gast op de chat sluit het paneel. Sluitklikken van de chat zelf gaan altijd door.
d.addEventListener('click',function(e){var tg=e.target&&e.target.closest&&e.target.closest('.chat-window-toggle');if(!tg)return;
 if(eigen){laatsteToggle=Date.now();return}
 var open=chatOpen();
 if(open){laatsteToggle=Date.now();return}
 if(!e.isTrusted){if(bookOpen()){e.stopImmediatePropagation();e.preventDefault()}return}
 if(bookOpen()){var x=host().querySelector('[data-booking-widget-close]');if(x)x.click()}},true);
// Paneel gaat open (klik, boeklink of deeplink): een open chat sluit, een keer.
function ensureClose(){var c=chatWin();if(!c||c.querySelector('.bw-close,#bwChatClose'))return;var b=d.createElement('button');b.id='bwChatClose';b.type='button';b.setAttribute('aria-label','Chat sluiten');b.textContent='\\u00d7';b.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();var t=toggle();if(t)t.click()});c.appendChild(b)}
var lastB=bookOpen(),hooked={};
function klasse(){var c=chatOpen();d.documentElement.classList.toggle('bw-chat-open',c);if(c)ensureClose()}
function attach(){var x=host();if(x&&!hooked.h){hooked.h=1;new MutationObserver(function(){var b=bookOpen();if(b&&!lastB)closeChat();lastB=b}).observe(x,{attributes:true,attributeFilter:['class']})}var wr=d.querySelector('.chat-window-wrapper');if(wr&&hooked.w!==wr){hooked.w=wr;new MutationObserver(klasse).observe(wr,{attributes:true,attributeFilter:['style','class'],subtree:true})}}
attach();if(!hooked.w){var bo=new MutationObserver(function(){attach();if(hooked.w){bo.disconnect();klasse()}});bo.observe(d.body,{childList:true})}
if(bookOpen())closeChat();klasse();})();`;
const host = `<script id="bw-uniform-mobiel-js">(function(){try{if(window.self===window.top)return;var pd=window.parent.document;if(window.parent.__bwCoord5)return;var s=pd.createElement('script');s.id='bw-coord-script';s.textContent=${JSON.stringify(PARENT).replace(/<\//g, '<\\/')};pd.head.appendChild(s)}catch(e){}})();</script>`;
if (h.indexOf('bw-uniform-mobiel-js') < 0) { const k = h.lastIndexOf('</body>'); h = k >= 0 ? h.slice(0, k) + host + h.slice(k) : h + host; } else { h = h.replace(/<script id="bw-uniform-mobiel-js">[\s\S]*?<\/script>/, host); }
// Subtiele scrollbalk (Dennis 31 okt): alleen op scroll/resize en bij inhoudswijziging (ResizeObserver), geen interval.
const SCROLL = '<style id="bw-scrollhint-css">#bwScrollHint{position:fixed;right:4px;top:10px;width:4px;border-radius:4px;background:rgba(29,29,27,.08);z-index:2147483000;pointer-events:none;opacity:0;transition:opacity .25s}#bwScrollHint.aan{opacity:1}#bwScrollHint i{position:absolute;left:0;right:0;top:0;border-radius:4px;background:rgba(29,29,27,.38)}</style><script id="bw-scrollhint-js">(function(){var tr=document.createElement("div");tr.id="bwScrollHint";tr.setAttribute("aria-hidden","true");var th=document.createElement("i");tr.appendChild(th);var raf=0;function zet(){raf=0;if(!document.body)return;if(!tr.parentNode)document.body.appendChild(tr);var se=document.scrollingElement||document.documentElement,vh=innerHeight,sh=se.scrollHeight;if(sh<=vh+4){tr.classList.remove("aan");return}var h=vh-20,t=Math.max(28,Math.round(h*vh/sh)),y=Math.round((h-t)*Math.min(1,Math.max(0,se.scrollTop/(sh-vh))));th.style.height=t+"px";th.style.transform="translateY("+y+"px)";tr.classList.add("aan")}function plan(){if(!raf)raf=requestAnimationFrame(zet)}addEventListener("scroll",plan,{passive:true});addEventListener("resize",plan);if(window.ResizeObserver&&document.body)new ResizeObserver(plan).observe(document.body);plan()})();</script>';
h = h.replace(/<style id="bw-scrollhint-css">[\s\S]*?<\/script>/, '');
{ const k2 = h.lastIndexOf('</body>'); h = k2 >= 0 ? h.slice(0, k2) + SCROLL + h.slice(k2) : h + SCROLL; }

const CAMPER_PROMO = `<style id="bus-camper-style">.bus-camper-explainer{padding:12px 14px;margin:10px 0;background:#f2f0e8;color:#201e1a;border-radius:8px;font-size:14px;line-height:1.5}.bus-camper-explainer strong{display:block}.bus-camper-explainer small{display:block;margin-top:5px}.bus-camper-old{text-decoration:line-through;opacity:.7;margin-right:8px}</style><script id="bus-camper-script">(function(){var q=new URLSearchParams(location.search);if(q.get('camper')!=='1')return;function apply(){document.querySelectorAll('.card[data-code="42SA1mn"],.card[data-code="79BAxWL"]').forEach(function(card){if(card.dataset.camperApplied==='1')return;card.dataset.camperApplied='1';var pr=card.querySelector('.price');if(pr){pr.innerHTML='<span class="bus-camper-old">€ 17,50</span><span class="now">€ 8,75 p.p.</span>';pr.classList.add('sale')}var body=card.querySelector('.body');if(body){var info=document.createElement('div');info.className='bus-camper-explainer';info.innerHTML='<strong>Campergasttarief: € 8,75 p.p. (50% korting)</strong>De korting wordt automatisch bij het afrekenen toegepast.<small>Alleen voor gasten die op onze camperplaats verblijven. Meld bij aankomst dat je campergast bent. Niet te combineren met andere kortingscodes.</small>';body.insertBefore(info,body.querySelector('.book')||body.firstChild)}})}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply);else apply();new MutationObserver(apply).observe(document.documentElement,{childList:true,subtree:true})})();<\/script>`;
h = h.replace('</head>',CAMPER_PROMO+'</head>');
return [{ json: { ...j, html: h } }];

}).call(__self,__mk(__items)));
// ===== Actiecode uit fanzone =====
__items=__norm(await (async function($input){
// Actiecode uit de fanzone (7 nov 2026, Aanbieding van de maand): opent de fanzone de widget met #webshop?...&actie=AV-xxxxxxx
// of #reserveren?...&actie=AV-xxxxxxx, dan staat die persoonlijke actiecode al ingevuld als kortingscode (webshop en reserveren).
// Haalt de fan de code zelf weg, dan blijft hij weg. De checks (alleen eigen mailadres, looptijd, eenmalig, minimumbedrag) zitten server-side.
const S = String.raw`<script id="bw-actie-js">(function(){var RE=/[?&]actie=(AV-[A-Z0-9]{7}|VOORPRET-[A-Z0-9]{6})/;function code(){var m=null;try{m=String(window.top.location.hash||"").match(RE)}catch(e){}if(!m){try{m=String(location.hash||"").match(RE)}catch(e){}}return m?m[1]:""}
var C="";function opslag(){try{sessionStorage.setItem("bw-shop-credit-input",JSON.stringify({v:"",d:C}))}catch(e){}try{var s=JSON.parse(sessionStorage.getItem("busBookingSpecificV2")||"{}")||{};s.discountCode=C;s.giftCards="";sessionStorage.setItem("busBookingSpecificV2",JSON.stringify(s))}catch(e){}}
function veld(el,naast,f){if(!el||el.readOnly||f.dataset.bwActieUit==="1"||el.value===C)return;el.value=C;try{el.dispatchEvent(new Event("input",{bubbles:true}))}catch(e){}if(naast&&!naast.readOnly)naast.value="";if(!f.dataset.bwActieL){f.dataset.bwActieL="1";el.addEventListener("input",function(){if(el.value!==C)f.dataset.bwActieUit="1"})}}
function zet(){var c=code();if(c&&c!==C){C=c;opslag()}if(!C)return;
document.querySelectorAll("form.booking-form").forEach(function(f){var e=f.elements;if(!e)return;veld(e.discountCode,e.giftCards,f);var w=f.querySelector(".discount-wrap");if(w&&e.discountCode&&e.discountCode.value===C)w.classList.add("open")});
document.querySelectorAll(".bw-ck").forEach(function(ck){var d=ck.querySelector("[name=bwdiscount]"),v=ck.querySelector("[name=bwvoucher]");veld(d,v,ck);var w=ck.querySelector(".bw-disc-wrap");if(w&&d&&d.value===C)w.classList.add("open")})}
var tm=null;function plan(){if(tm)return;tm=setTimeout(function(){tm=null;zet()},80)}
try{window.top.addEventListener("hashchange",plan)}catch(e){}window.addEventListener("hashchange",plan);if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",plan);else plan();
new MutationObserver(function(){if(C||code())plan()}).observe(document.documentElement,{childList:true,subtree:true})})();</script>`;
return $input.all().map(it => {
  const j = it.json || {};
  let h = String(j.html || '');
  if (!h || h.indexOf('id="bw-actie-js"') >= 0) return it;
  h = h.indexOf('</body>') >= 0 ? h.split('</body>').join(S + '</body>') : h + S;
  return { json: Object.assign({}, j, { html: h }), pairedItem: it.pairedItem };
});

}).call(__self,__mk(__items)));
// ===== Fanzone profiel in widget =====
__items=__norm(await (async function($input){
// 7 nov 2026: fanzone-profiel in de widget. Met ?fz=<token> (link uit de fanzone) of een eerder opgeslagen profiel
// worden naam, mail, telefoon, investeerderscode (webshop 25%, arrangementen 10%) of tegoed vooraf ingevuld.
// Met ?bon=<code> (rondleidingsbon van een investeerder) staat de bon al in het waardebonveld.
// 7 nov (middag): NAW uit de fanzone vult ook het adres in de webshop-checkout; zonder compleet profiel geen codes of tegoed (melding met link).
// 7 nov (middag): fanzonecode in de webshop-checkout wordt direct toegepast (autoToep), het totaal zakt meteen.
// 7 nov: bij het Dutch Whisky Event (kaart Uc6FXYq) staat de persoonlijke fancode (10%) klaar in plaats van andere codes of tegoed.
// 8 nov 2026 (besluit Dennis): investeerders 25% op flessen alleen in de online webshop (niet in de winkel), 10% op arrangementen.
// De arrangementencode komt niet in een restaurantreservering (die weigert hem); staat hij daar, dan wordt het veld leeggemaakt.
const j=$input.first().json||{};let h=String(j.html||'');
const FZ=String.raw`<script id="bw-fanzone-js">(function(){
var API='https://buswhiskyevents.app.n8n.cloud/webhook/fanzone';
var KP='busFanProfielV1';
function zoekTok(){var re=/[?&]fz=([A-Za-z0-9_.-]{20,200})/,m=null;try{m=String(window.top.location.search||'').match(re)}catch(e){}if(!m){try{m=String(location.search||'').match(re)}catch(e){}}if(!m){try{m=String(window.top.location.hash||'').match(re)}catch(e){}}return m?m[1]:''}
function lees(k,s){try{return JSON.parse((s||localStorage).getItem(k)||'null')}catch(e){return null}}
function zet(k,v,s){try{(s||localStorage).setItem(k,JSON.stringify(v))}catch(e){}}
function wegUitUrl(){try{var t=window.top,u=String(t.location.href);var n=u.replace(/([?&])fz=[A-Za-z0-9_.-]+&?/,'$1').replace(/[?&](#|$)/,'$1');if(n!==u)t.history.replaceState(t.history.state,'',n)}catch(e){}}
function vul(el,v){if(el&&v&&!el.value){el.value=v;try{el.dispatchEvent(new Event('input',{bubbles:true}))}catch(e){}}}
function opslag(p){
 var b=lees('busBookingProfileV2')||{};
 if(p.voornaam)b.firstName=p.voornaam;if(p.achternaam)b.lastName=p.achternaam;if(p.email)b.email=p.email;if(p.telefoon)b.phone=p.telefoon;
 zet('busBookingProfileV2',b);
 var s=lees('busBookingSpecificV2',sessionStorage)||{};
 if(p.code_arr){if(!s.discountCode)s.discountCode=p.code_arr}
 else if(p.tegoed&&p.tegoed.codes&&!s.giftCards){s.giftCards=p.tegoed.codes}
 zet('busBookingSpecificV2',s,sessionStorage);
 var c=lees('bw-shop-ck-v1')||{};
 if(p.voornaam)c.fn=p.voornaam;if(p.achternaam)c.ln=p.achternaam;if(p.email)c.em=p.email;if(p.telefoon)c.ph=p.telefoon;
 if(p.naw){var nw=p.naw;if(nw.postcode&&!c.zip)c.zip=nw.postcode;if(nw.huisnummer&&!c.nr)c.nr=nw.huisnummer;if(nw.toevoeging&&!c.ad)c.ad=nw.toevoeging;if(nw.straat&&!c.st)c.st=nw.straat;if(nw.plaats&&!c.ci)c.ci=nw.plaats;if(nw.land&&!c.co)c.co=nw.land}
 zet('bw-shop-ck-v1',c);
 var a=lees('bw-shop-credit-applied',sessionStorage);
 if(!a){var ci=lees('bw-shop-credit-input',sessionStorage)||{};
  if(p.code_flessen){if(!ci.d){ci.d=p.code_flessen;ci.v=''}}
  else if(p.tegoed&&p.tegoed.codes&&!ci.v&&!ci.d){ci.v=p.tegoed.codes}
  zet('bw-shop-credit-input',ci,sessionStorage)}
}
function velden(p){
 document.querySelectorAll('form.booking-form').forEach(function(f){var e=f.elements;if(!e)return;vul(e.firstName,p.voornaam);vul(e.lastName,p.achternaam);vul(e.email,p.email);vul(e.phone,p.telefoon);
  var kaart=f.closest('[data-code]');if(p.code_event&&p.event_svc&&kaart&&kaart.getAttribute('data-code')===p.event_svc){if(e.discountCode&&f.dataset.bwEvt!=='1'){var oud=e.discountCode.value;if(!oud||oud===p.code_arr){e.discountCode.value=p.code_event;var we=f.querySelector('.discount-wrap');if(we)we.classList.add('open')}if(e.giftCards&&p.tegoed&&p.tegoed.codes&&e.giftCards.value===p.tegoed.codes)e.giftCards.value='';f.dataset.bwEvt='1'}return}
  var rest=kaart&&(kaart.getAttribute('data-kind')==='restaurant'||kaart.getAttribute('data-code')==='CewjJvV');if(rest&&!p.medewerker){if(p.code_arr&&e.discountCode&&e.discountCode.value===p.code_arr)e.discountCode.value='';return}
  if(p.code_arr&&e.discountCode&&!e.discountCode.value&&!(e.giftCards&&e.giftCards.value)){e.discountCode.value=p.code_arr;var w=f.querySelector('.discount-wrap');if(w)w.classList.add('open')}
  else if(!p.code_arr&&p.tegoed&&p.tegoed.codes&&e.giftCards&&!e.giftCards.value&&!(e.discountCode&&e.discountCode.value)){e.giftCards.value=p.tegoed.codes}});
 document.querySelectorAll('form.bw-me-form').forEach(function(f){var e=f.elements;if(!e)return;vul(e.first_name,p.voornaam);vul(e.last_name,p.achternaam);vul(e.email,p.email);vul(e.phone,p.telefoon)});
 document.querySelectorAll('.bw-ck').forEach(function(ck){vul(ck.querySelector('[name=fn]'),p.voornaam);vul(ck.querySelector('[name=ln]'),p.achternaam);vul(ck.querySelector('[name=em]'),p.email);vul(ck.querySelector('[name=ph]'),p.telefoon);
  if(p.naw){vul(ck.querySelector('[name=zip]'),p.naw.postcode);vul(ck.querySelector('[name=nr]'),p.naw.huisnummer);vul(ck.querySelector('[name=ad]'),p.naw.toevoeging);vul(ck.querySelector('[name=st]'),p.naw.straat);vul(ck.querySelector('[name=ci]'),p.naw.plaats)}
  var d=ck.querySelector('[name=bwdiscount]'),v=ck.querySelector('[name=bwvoucher]');
  if(d&&!d.readOnly&&!d.value&&!(v&&v.value)&&p.code_flessen){d.value=p.code_flessen;var w=ck.querySelector('.bw-disc-wrap'),t=ck.querySelector('.bw-disc-toggle');if(w)w.classList.add('open');if(t){t.textContent='Kortingscode verbergen';t.setAttribute('aria-expanded','true')}try{sessionStorage.setItem('bw-shop-credit-input',JSON.stringify({v:'',d:p.code_flessen}))}catch(x){}}
  else if(v&&!v.readOnly&&!v.value&&!(d&&d.value)&&!p.code_flessen&&p.tegoed&&p.tegoed.codes){v.value=p.tegoed.codes}});
}
// 7 nov 2026 (Dennis): een code uit de fanzone wordt in de webshop-checkout meteen toegepast, zodat het totaal direct zakt
// (eerder pas bij Bestellen en betalen). Alleen codes die de fanzone zelf invulde, alleen met compleet profiel en ingevuld mailadres.
function autoToep(p){
 if(!p||p.naw_compleet===false)return;var mijn=[];if(p.code_flessen)mijn.push(String(p.code_flessen).toUpperCase());if(p.tegoed&&p.tegoed.codes)String(p.tegoed.codes).split(/[;,]/).forEach(function(c){c=c.trim().toUpperCase();if(c)mijn.push(c)});if(!mijn.length)return;
 document.querySelectorAll('.bw-ck').forEach(function(ck){if(ck.dataset.bwAuto)return;var box=ck.querySelector('.bw-credit');if(!box)return;var vi=box.querySelector('[name=bwvoucher]'),di=box.querySelector('[name=bwdiscount]'),bt=box.querySelector('.bw-credit-apply');if(!bt)return;
  if((vi&&vi.readOnly)||bt.textContent==='Toegepast'){ck.dataset.bwAuto='1';return}
  var v=(vi&&vi.value||'').trim().toUpperCase(),d=(di&&di.value||'').trim().toUpperCase();if(!v&&!d)return;
  var ok=(!v||v.split(/[;,]/).every(function(c){c=c.trim();return !c||mijn.indexOf(c)>=0}))&&(!d||mijn.indexOf(d)>=0);if(!ok)return;
  var em=ck.querySelector('[name=em]');if(!em||!/@/.test(em.value||''))return;if(!ck.querySelector('.ck-som'))return;
  ck.dataset.bwAuto='1';setTimeout(function(){if(bt.textContent==='Toegepast')return;bt.disabled=false;bt.click()},250)})}
function balk(p){
 if(document.getElementById('bw-fz-balk'))return;var b=document.createElement('div');b.id='bw-fz-balk';
 b.setAttribute('style','margin:0 0 8px;padding:8px 12px;border-radius:8px;background:#14110F;color:#F3EBDD;font-size:13px;line-height:1.4;display:flex;gap:8px;align-items:center;justify-content:space-between;flex-wrap:wrap');
 var t=document.createElement('span');var deel=['Ingelogd als fan'+(p.voornaam?': '+p.voornaam:'')];
 if(p.medewerker){deel.push((p.pk_pct||20)+'% personeelskorting staat klaar');if(p.investeerder&&p.code_flessen&&p.code_flessen!==p.pk_code)deel.push('25% investeerderskorting op flessen in de webshop')}
 else{if(p.code_flessen)deel.push('25% investeerderskorting op flessen in de webshop staat klaar');
 if(p.code_arr)deel.push('10% op arrangementen staat klaar');
 if(p.code_event)deel.push('fankorting Dutch Whisky Event staat klaar');}
 if(!p.code_flessen&&p.tegoed&&p.tegoed.saldo>0)deel.push('tegoed '+p.tegoed.label+' staat klaar');
 t.textContent=deel.join(' · ');b.appendChild(t);
 if(p.naw_compleet===false&&p.naw_link){var nl=document.createElement('a');nl.href=p.naw_link;nl.target='_top';nl.textContent='Maak eerst je fanprofiel af (naam en adres) om je tegoed en fanvoordeel te gebruiken';nl.setAttribute('style','color:#E3A857;font-size:12px;text-decoration:underline');b.appendChild(nl)}
 var x=document.createElement('button');x.type='button';x.textContent='Niet jij?';x.setAttribute('style','border:0;background:none;color:#E3A857;text-decoration:underline;font:inherit;font-size:12px;cursor:pointer;padding:0');
 x.onclick=function(){try{localStorage.removeItem(KP);localStorage.removeItem('busBookingProfileV2');localStorage.removeItem('bw-shop-ck-v1');sessionStorage.removeItem('busBookingSpecificV2');sessionStorage.removeItem('bw-shop-credit-input')}catch(e){}b.remove();location.reload()};b.appendChild(x);
 var plek=document.querySelector('.bw-shop,.bw-ck,.cards,main,.wrap')||document.body.firstElementChild;
 if(plek&&plek.parentNode&&plek!==document.body.firstElementChild)plek.parentNode.insertBefore(b,plek);else document.body.insertBefore(b,document.body.firstChild);
}
var P=null;
function start(p){P=p;opslag(p);var go=function(){balk(p);velden(p);autoToep(p)};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',go);else go();
 var tm=null;new MutationObserver(function(){if(tm)return;tm=setTimeout(function(){tm=null;velden(P);autoToep(P)},60)}).observe(document.documentElement,{childList:true,subtree:true});
 document.addEventListener('click',function(){setTimeout(function(){velden(P);autoToep(P)},80)},true)}
// Rondleidingsbon uit een deellink (?bon=CODE): code in het waardebonveld zetten.
(function(){var re=/[?&]bon=(BUS-[A-Z0-9]{8,16})/,m=null;try{m=String(window.top.location.search||'').match(re)}catch(e){}if(!m){try{m=String(location.search||'').match(re)}catch(e){}}if(!m)return;var code=m[1];
 var s=lees('busBookingSpecificV2',sessionStorage)||{};if(!s.giftCards){s.giftCards=code;s.discountCode='';zet('busBookingSpecificV2',s,sessionStorage)}
 function z(){document.querySelectorAll('form.booking-form').forEach(function(f){var g=f.elements&&f.elements.giftCards;if(g&&!g.value)g.value=code})}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',z);else z();new MutationObserver(z).observe(document.documentElement,{childList:true,subtree:true})})();
var tok=zoekTok();
if(tok){fetch(API+'?a=profiel&fz='+encodeURIComponent(tok),{credentials:'omit',cache:'no-store'}).then(function(r){return r.json()}).then(function(p){if(p&&p.ok){p.tot=Date.now()+30*86400000;zet(KP,p);start(p);wegUitUrl()}}).catch(function(){})}
else{var o=lees(KP);if(o&&o.ok&&o.tot>Date.now())start(o)}
})();
</script>`;
if(h.indexOf('id="bw-fanzone-js"')<0)h=h.indexOf('</body>')>=0?h.split('</body>').join(FZ+'</body>'):h+FZ;
return [{json:{...j,html:h}}];
}).call(__self,__mk(__items)));
// ===== Bon-link ook oude codes =====
__items=__norm(await (async function($input){
// 10 nov 2026: ?bon=CODE vult het waardebonveld ook voor oude 8-tekens codes (giftpack, Formitable), niet alleen BUS-codes.
// De BUS Wallet importeert die codes bij de controle zelf. Cadeaubonnen lopen nooit via Guestplan.
const j = $input.first().json || {};
let h = String(j.html || '');
h = h.split('var re=/[?&]bon=(BUS-[A-Z0-9]{8,16})/,m=null;').join('var re=/[?&]bon=((?:BUS-)?[A-Za-z0-9]{8,16})/,m=null;');
h = h.split('if(!m)return;var code=m[1];').join('if(!m)return;var code=String(m[1]).toUpperCase();');
return [{ json: { ...j, html: h } }];

}).call(__self,__mk(__items)));
// ===== Medewerker combineren 8 nov =====
__items=__norm(await (async function($input){
// 8 nov 2026 01:16 (besluit Dennis): personeelskorting is te combineren met een waardebon of tegoed.
// Past het fanzonescript (bw-fanzone-js) aan zodat bij een medewerker MW-code EN tegoed/bon samen klaarstaan.
// Andere fans: ongewijzigd (code of tegoed). Zelfde item door, alleen html aangepast.
const R=[["if(p.code_arr){if(!s.discountCode)s.discountCode=p.code_arr}\n else if(p.tegoed&&p.tegoed.codes&&!s.giftCards){s.giftCards=p.tegoed.codes}", "if(p.code_arr){if(!s.discountCode)s.discountCode=p.code_arr}\n if((!p.code_arr||p.medewerker)&&p.tegoed&&p.tegoed.codes&&!s.giftCards){s.giftCards=p.tegoed.codes}"], ["if(p.code_flessen){if(!ci.d){ci.d=p.code_flessen;ci.v=''}}\n  else if(p.tegoed&&p.tegoed.codes&&!ci.v&&!ci.d){ci.v=p.tegoed.codes}", "if(p.code_flessen){if(!ci.d){ci.d=p.code_flessen;if(!p.medewerker)ci.v=''}}\n  if((!p.code_flessen||p.medewerker)&&p.tegoed&&p.tegoed.codes&&!ci.v&&(!ci.d||p.medewerker)){ci.v=p.tegoed.codes}"], ["if(p.code_arr&&e.discountCode&&!e.discountCode.value&&!(e.giftCards&&e.giftCards.value)){", "if(p.code_arr&&e.discountCode&&!e.discountCode.value&&(p.medewerker||!(e.giftCards&&e.giftCards.value))){"], ["}\n  else if(!p.code_arr&&p.tegoed&&p.tegoed.codes&&e.giftCards&&!e.giftCards.value&&!(e.discountCode&&e.discountCode.value)){e.giftCards.value=p.tegoed.codes}", "}\n  if((!p.code_arr||p.medewerker)&&p.tegoed&&p.tegoed.codes&&e.giftCards&&!e.giftCards.value&&(p.medewerker||!(e.discountCode&&e.discountCode.value))){e.giftCards.value=p.tegoed.codes}"], ["if(d&&!d.readOnly&&!d.value&&!(v&&v.value)&&p.code_flessen){", "if(d&&!d.readOnly&&!d.value&&(p.medewerker||!(v&&v.value))&&p.code_flessen){"], ["}\n  else if(v&&!v.readOnly&&!v.value&&!(d&&d.value)&&!p.code_flessen&&p.tegoed&&p.tegoed.codes){v.value=p.tegoed.codes}", "}\n  if(v&&!v.readOnly&&!v.value&&(p.medewerker||(!(d&&d.value)&&!p.code_flessen))&&p.tegoed&&p.tegoed.codes){v.value=p.tegoed.codes}"], ["if(!p.code_flessen&&p.tegoed&&p.tegoed.saldo>0)deel.push(", "if((!p.code_flessen||p.medewerker)&&p.tegoed&&p.tegoed.saldo>0)deel.push("]];
return $input.all().map(it=>{const j=it.json||{};let h=String(j.html||'');if(h.indexOf('id="bw-fanzone-js"')>=0){for(const [a,b] of R){h=h.split(a).join(b)}}return {json:{...j,html:h},pairedItem:it.pairedItem};});

}).call(__self,__mk(__items)));
// ===== Mollie in hoofdvenster (16 nov) =====
__items=__norm(await (async function($input){
// 16 nov 2026: reserverings- en cadeaubon-checkout deden location.href=o.checkoutUrl BINNEN de widget-iframe.
// Mollie weigert te laden in een iframe (X-Frame-Options), dus de gast zag een leeg of kapot vak en haakte af
// (method=null in Mollie, conversie zakte van ~90% naar ~55%). Nu gaat de betaalpagina altijd in het hoofdvenster.
const OUD = 'location.href=o.checkoutUrl';
const NIEUW = "(function(u){\n var p,h;\n try{p=new URL(String(u||''));h=p.hostname.toLowerCase();if(p.protocol!=='https:')throw Error('protocol');if(!(h==='mollie.com'||h.endsWith('.mollie.com')||(h==='buswhiskyevents.app.n8n.cloud'&&p.pathname==='/webhook/bus-checkout/betaal'&&p.searchParams.has('co'))))throw Error('domein')}\n catch(e){alert('De beveiligde betaallink is ongeldig. Probeer opnieuw.');return}\n var root=document.getElementById('bw-pay-fallback');\n if(!root){\n   root=document.createElement('section');root.id='bw-pay-fallback';root.setAttribute('role','dialog');root.setAttribute('aria-label','Mollie betaling openen');\n   root.style.cssText='position:fixed;z-index:2147483647;inset:0;padding:18px;background:#050b20ef;display:flex;align-items:center;justify-content:center;font:16px Arial,sans-serif';\n   var box=document.createElement('div');box.style.cssText='background:#fff;color:#161616;max-width:440px;width:100%;padding:24px;border-radius:12px;text-align:center';\n   var t=document.createElement('h2');t.textContent='Verder naar beveiligde betaling';t.style.cssText='font-size:20px;margin:0 0 12px';\n   var d=document.createElement('p');d.textContent='Wordt Mollie niet automatisch geopend? Gebruik een van de onderstaande betaallinks.';d.style.cssText='font-size:14px;line-height:1.5;margin:0 0 14px';\n   var a=document.createElement('a');a.className='bw-pay-top';a.textContent='Open Mollie betaling';a.target='_top';a.rel='noopener noreferrer';a.style.cssText='display:block;background:#07142e;color:#fff;padding:13px;text-decoration:none;border-radius:7px;font-weight:bold;margin:10px 0';\n   var b=document.createElement('a');b.className='bw-pay-new';b.textContent='Of open in een nieuw tabblad';b.target='_blank';b.rel='noopener noreferrer';b.style.cssText='display:block;color:#07142e;padding:10px;text-decoration:underline';\n   var z=document.createElement('button');z.type='button';z.textContent='Terug naar reservering';z.style.cssText='background:transparent;border:0;color:#666;cursor:pointer;text-decoration:underline;padding:12px';z.onclick=function(){root.remove()};\n   box.appendChild(t);box.appendChild(d);box.appendChild(a);box.appendChild(b);box.appendChild(z);root.appendChild(box);document.body.appendChild(root)\n }\n root.querySelector('.bw-pay-top').href=p.href;root.querySelector('.bw-pay-new').href=p.href;\n try{if(window.top!==window)window.top.location.assign(p.href);else window.location.assign(p.href)}catch(e){}\n})(o.checkoutUrl)";
return $input.all().map(it => {
  const j = it.json || {};
  let h = String(j.html || '');
  if (!h || h.indexOf(OUD) < 0) return it;
  h = h.split(OUD).join(NIEUW);
  return { json: Object.assign({}, j, { html: h }), pairedItem: it.pairedItem };
});
}).call(__self,__mk(__items)));
// ===== Nieuwsbriefvinkje reserveren (17 nov) =====
__items=__norm(await (async function($input){
// 17 nov 2026 (Dennis): nieuwsbriefvinkje bij ELKE aanvraag (reserveerformulier en M&E offerte/optie), standaard AAN, 1 regel, klein vinkje.
// M&E-aanvragen gaan via BtwBGSkEZqKKhJOf (veld newsletter), die zet de aanvrager in Brevo lijst 23.
// De checkout (qHz3IsDzp2jJeiQn) zet de gast met vinkje direct in Brevo lijst 23, ook als de betaling daarna niet wordt afgerond.
const S = String.raw`<script id="bw-nb-js">(function(){
var L=(document.documentElement.lang||new URLSearchParams(location.search).get('lang')||'nl').slice(0,2).toLowerCase();
var T={nl:'Ja, stuur mij af en toe nieuws en acties van Bus',en:'Yes, send me news and offers from Bus now and then',de:'Ja, schickt mir ab und zu News und Angebote von Bus',fr:'Oui, envoyez-moi parfois des news et offres de Bus',es:'Sí, envíame de vez en cuando novedades de Bus'};
var V=true;function maak(){var lab=document.createElement('label');lab.className='bw-nb';var cb=document.createElement('input');cb.type='checkbox';cb.name='bwNieuwsbrief';cb.checked=V;cb.defaultChecked=true;cb.addEventListener('change',function(){V=cb.checked;document.querySelectorAll('input[name="bwNieuwsbrief"]').forEach(function(x){x.checked=V})});var sp=document.createElement('span');sp.textContent=T[L]||T.nl;lab.appendChild(cb);lab.appendChild(sp);return lab}
function addMe(){document.querySelectorAll('form.bw-me-form').forEach(function(f){if(f.querySelector('.bw-nb'))return;var s=f.querySelector('button[type=submit]');if(s&&s.parentNode)s.parentNode.insertBefore(maak(),s);else f.appendChild(maak())})}
function add(){addMe();document.querySelectorAll('.booking-form').forEach(function(f){if(f.querySelector('.bw-nb')||!f.querySelector('input[name="email"]'))return;var lab=maak();var n=f.querySelector('textarea[name="notes"]');if(n&&n.parentNode){n.parentNode.insertBefore(lab,n.nextSibling)}else{var s=f.querySelector('button[type=submit]');if(s&&s.parentNode)s.parentNode.insertBefore(lab,s);else f.appendChild(lab)}})}
var st=document.createElement('style');st.textContent='.bw-me-form label.bw-nb,.booking-form label.bw-nb{display:flex!important;flex-direction:row!important;align-items:center!important;gap:7px!important;margin:6px 0 10px!important;padding:0!important;border:0!important;background:none!important;font-size:12.5px!important;line-height:1.2!important;white-space:nowrap!important;overflow:hidden;text-overflow:ellipsis;cursor:pointer;text-align:left;user-select:none}.bw-me-form label.bw-nb span,.booking-form label.bw-nb span{overflow:hidden;text-overflow:ellipsis;color:#444}.bw-me-form label.bw-nb input[type=checkbox],.booking-form label.bw-nb input[type=checkbox]{-webkit-appearance:checkbox!important;appearance:auto!important;display:inline-block!important;position:static!important;opacity:1!important;pointer-events:auto!important;width:16px!important;height:16px!important;min-width:16px!important;max-width:16px!important;min-height:0!important;flex:0 0 16px!important;margin:0!important;padding:0!important;border-radius:3px!important;box-shadow:none!important;accent-color:#C9A227;cursor:pointer}';(document.head||document.documentElement).appendChild(st);
var of=window.fetch;window.fetch=function(u,o){try{var us=String(u);if((us.indexOf('/bus-checkout/start')>=0||us.indexOf('/bus-me-widget/quote')>=0)&&o&&typeof o.body==='string'){var b=JSON.parse(o.body);var sel=us.indexOf('/quote')>=0?'.bw-me-form:not([hidden]) input[name="bwNieuwsbrief"]':'.booking-form input[name="bwNieuwsbrief"]';var lijst=document.querySelectorAll(sel);b.newsletter=lijst.length?V:true;o=Object.assign({},o,{body:JSON.stringify(b)})}}catch(e){}return of.apply(this,[u,o])};
function start(){add();try{new MutationObserver(add).observe(document.body||document.documentElement,{childList:true,subtree:true})}catch(e){}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();</script>`;
const j = $input.first().json || {};
let h = String(j.html || '');
if (h && h.indexOf('bw-nb-js') < 0) { h = h.indexOf('</body>') >= 0 ? h.replace('</body>', S + '</body>') : h + S; }
return [{ json: Object.assign({}, j, { html: h }) }];

}).call(__self,__mk(__items)));
// ===== Gegevens uit link (17 nov) =====
__items=__norm(await (async function($input){
// 17 nov 2026 (Dennis): link uit de herinneringsmail (#reserveren?...&vul=<token>) vult naam, mail, telefoon en opmerking al in,
// neemt datum en personen uit de link mee en opent het formulier. De kortingscode komt via &actie= (node Actiecode uit fanzone).
const S = String.raw`<script id="bw-vul-js">(function(){
function hs(){var a="";try{a=String(window.top.location.hash||"")}catch(e){}return a+" "+String(location.hash||"")}
var m=hs().match(/[?&]vul=([A-Za-z0-9_-]{10,})/);if(!m)return;
var p=null;try{var b=m[1].replace(/-/g,"+").replace(/_/g,"/");while(b.length%4)b+="=";p=JSON.parse(decodeURIComponent(escape(atob(b))))}catch(e){return}
if(!p||typeof p!=="object")return;
try{var h=hs(),d=(h.match(/[?&]date=(\d{4}-\d{2}-\d{2})/)||[])[1],x=(h.match(/[?&]pax=(\d{1,2})/)||[])[1],u=new URL(location.href),ch=false;
if(d&&u.searchParams.get("date")!==d&&!sessionStorage.getItem("bw-vul-d"+d)){sessionStorage.setItem("bw-vul-d"+d,"1");u.searchParams.set("date",d);ch=true}
if(x&&u.searchParams.get("pax")!==x&&!sessionStorage.getItem("bw-vul-p"+x)){sessionStorage.setItem("bw-vul-p"+x,"1");u.searchParams.set("pax",x);ch=true}
if(ch){location.replace(u.toString());return}}catch(e){}
try{localStorage.setItem("busBookingProfileV2",JSON.stringify({firstName:p.v||"",lastName:p.a||"",email:p.e||"",phone:p.t||""}))}catch(e){}
try{var s=JSON.parse(sessionStorage.getItem("busBookingSpecificV2")||"{}")||{};if(p.n&&!s.notes)s.notes=p.n;sessionStorage.setItem("busBookingSpecificV2",JSON.stringify(s))}catch(e){}
function zet(el,v){if(el&&v&&!el.value){el.value=v;try{el.dispatchEvent(new Event("input",{bubbles:true}))}catch(e){}}}
function vul(){var fs=document.querySelectorAll("form.booking-form");fs.forEach(function(f){if(f.dataset.bwVul==="1")return;var e=f.elements;if(!e||!e.email)return;f.dataset.bwVul="1";zet(e.firstName,p.v);zet(e.lastName,p.a);zet(e.email,p.e);zet(e.phone,p.t);zet(e.notes,p.n);
if(fs.length===1&&f.style.display==="none"){var c=f.closest(".card"),k=c&&c.querySelector("button.book[type=button]");if(k&&k.style.display!=="none")k.click()}})}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",vul);else vul();
new MutationObserver(vul).observe(document.documentElement,{childList:true,subtree:true});
})();</script>`;
const j = $input.first().json || {};
let h = String(j.html || '');
if (h && h.indexOf('bw-vul-js') < 0) { h = h.indexOf('</body>') >= 0 ? h.replace('</body>', S + '</body>') : h + S; }
return [{ json: Object.assign({}, j, { html: h }) }];

}).call(__self,__mk(__items)));
// ===== Fanprijs zichtbaar 10 nov =====
__items=__norm(await (async function($input){
// 10 nov 2026 (Dennis, feedback Bertus Franssens): een fan met korting op flessen (investeerder 25%, medewerker 20%, of een
// groepskorting uit Fanzone beheer) ziet zijn voordeel overal in de webshop: bij elke fles de gewone prijs doorgestreept met
// daarnaast zijn eigen prijs, en in de checkout een eigen regel met het bedrag, plus de prijs zonder korting. Voordat de code is
// verrekend staat er een voorlopige regel met het berekende bedrag. Leest het fanzoneprofiel (localStorage busFanProfielV1);
// pct_flessen en korting_label komen uit de fanzone (node Groepskorting 10 nov).
// 11 nov 2026 (Dennis): het zwarte USP-blok 'Eerlijke whisky uit Brabant' (S2, bw-usp-js) is verwijderd, geen toegevoegde waarde.
const S = String.raw`<script id="bw-fanprijs-js">(function(){
function prof(){try{var o=JSON.parse(localStorage.getItem('busFanProfielV1')||'null');if(!o||!o.ok||(o.tot&&o.tot<Date.now())||o.naw_compleet===false||!o.code_flessen)return null;var pct=Number(o.pct_flessen)||(o.medewerker?(Number(o.pk_pct)||20):25);pct=Math.min(25,pct);if(!pct)return null;return {pct:pct,lbl:o.korting_label||(o.medewerker?'Personeelskorting':'Investeerderskorting'),code:String(o.code_flessen||'').toUpperCase()}}catch(e){return null}}
function num(t){t=String(t||'').replace(/[^0-9,.-]/g,'');if(t.indexOf(',')>=0)t=t.replace(/\./g,'').replace(',','.');var n=parseFloat(t);return isFinite(n)?n:0}
function eur(v){try{return new Intl.NumberFormat('nl-NL',{style:'currency',currency:'EUR'}).format(v)}catch(e){return '€ '+v.toFixed(2).replace('.',',')}}
function r2(v){return Math.round(v*100)/100}
function css(){if(document.getElementById('bw-fanprijs-css'))return;var s=document.createElement('style');s.id='bw-fanprijs-css';s.textContent='.bw-shop-card .pr.bw-fp{display:flex;flex-direction:column;line-height:1.15}.bw-fp-oud{color:#8a8478;font-size:12px;text-decoration:line-through}.bw-fp-nieuw{color:#1d1d1b;font-weight:800}.bw-fp-lbl{font-size:11px;color:#8a673f;font-weight:700}.ck-som .bw-fp-rij span:last-child,.ck-som .bw-fp-rij span:first-child{color:#E3A857;font-weight:700}.ck-som .bw-fp-zonder{opacity:.75}.ck-som .bw-fp-noot{display:block!important;font-size:11px;color:#c9bba6;margin-top:2px}';(document.head||document.documentElement).appendChild(s)}
function kaarten(p){document.querySelectorAll('.bw-shop-card .pr').forEach(function(el){if(el.dataset.bwFp===el.textContent)return;var raw=el.dataset.bwFpRaw||el.textContent,v=num(raw);if(!(v>0))return;el.dataset.bwFpRaw=raw;el.classList.add('bw-fp');el.innerHTML='<s class="bw-fp-oud">'+eur(v)+'</s><b class="bw-fp-nieuw">'+eur(r2(v*(1-p.pct/100)))+'</b><span class="bw-fp-lbl">jouw prijs, '+p.pct+'% korting</span>';el.dataset.bwFp=el.textContent})}
function toegepast(p){try{var a=JSON.parse(sessionStorage.getItem('bw-shop-credit-applied')||'null');return a&&String(a.d||'').toUpperCase()===p.code&&!String(a.v||'').trim()}catch(e){return false}}
function som(p){document.querySelectorAll('.bw-ck .ck-som').forEach(function(s){if(s.querySelector('.bw-fp-rij'))return;var rows=[].slice.call(s.querySelectorAll(':scope>div:not(.tot)'));if(!rows.length)return;var sub=num(rows[0].lastElementChild&&rows[0].lastElementChild.textContent);if(!(sub>0))return;var tot=s.querySelector('.tot');
 var disc=rows.filter(function(r){var f=r.firstElementChild;return f&&/korting|discount|rabatt|remise|descuento/i.test(f.textContent)})[0];
 var ship=0;rows.slice(1).forEach(function(r){if(r!==disc)ship+=num(r.lastElementChild&&r.lastElementChild.textContent)});
 var zonder=document.createElement('div');zonder.className='bw-fp-zonder';zonder.innerHTML='<span>Prijs zonder korting</span><span>'+eur(r2(sub+ship))+'</span>';
 if(disc){if(toegepast(p)){disc.firstElementChild.textContent=p.lbl+' '+p.pct+'%'}disc.classList.add('bw-fp-rij');s.insertBefore(zonder,disc);return}
 var k=r2(sub*p.pct/100),rij=document.createElement('div');rij.className='bw-fp-rij';rij.innerHTML='<span>'+p.lbl+' '+p.pct+'%</span><span>- '+eur(k)+'</span>';
 s.insertBefore(zonder,tot);s.insertBefore(rij,tot);if(tot&&tot.lastElementChild){tot.lastElementChild.textContent=eur(r2(sub+ship-k))}
 var n=document.createElement('span');n.className='bw-fp-noot';n.textContent='Je korting wordt verrekend zodra je naam en mailadres zijn ingevuld.';s.appendChild(n)})}
var tm=null;function run(){tm=null;var p=prof();if(!p)return;css();kaarten(p);som(p)}
function plan(){if(!tm)tm=setTimeout(run,60)}
new MutationObserver(plan).observe(document.documentElement,{childList:true,subtree:true,characterData:true});if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',plan);else plan();
})();</script>`;

const T = String.raw`<script id="bw-telemetry-v1">(function(){
if(window.__bwTelemetryV1)return;window.__bwTelemetryV1=true;
var END='https://buswhiskyevents.app.n8n.cloud/webhook/bus-widget-telemetry';
var started=(window.performance&&performance.timeOrigin)||Date.now();
var rid=function(){try{return crypto.randomUUID().replace(/-/g,'')}catch(e){return Math.random().toString(36).slice(2)+Date.now().toString(36)}};
var sid;try{sid=sessionStorage.getItem('busWidgetSessionV1');if(!sid){sid=rid();sessionStorage.setItem('busWidgetSessionV1',sid)}}catch(e){sid=rid()}
var sent={};var selected='';
function src(){try{return(new URLSearchParams(location.search)).get('utm_source')||'direct'}catch(e){return'direct'}}
function arr(){try{return (new URLSearchParams(location.search)).get('arrangement')||document.querySelector('[data-code].selected,[data-code].active')?.getAttribute('data-code')||selected||''}catch(e){return selected}}
function send(type,ms,ref,component){var key=type+'|'+(['arrangement_selected','reserveer_clicked','date_selected','checkout_created','resource_timing'].indexOf(type)>=0?String(ref||''):'');if(sent[key])return;sent[key]=1;
var p={event_id:rid(),session_id:sid,event_type:type,occurred_at:new Date().toISOString(),duration_ms:ms||0,device:/iPhone|iPad|iPod/.test(navigator.userAgent)?'iOS':/Android/.test(navigator.userAgent)?'Android':/Windows/.test(navigator.userAgent)?'Windows':'other',arrangement:arr(),source:src(),page:location.pathname,checkout_ref:(type==='checkout_created'||type==='booking_confirmation_seen')?String(ref||''):'',component:String(component||'')};
try{var data=JSON.stringify(p);if(!navigator.sendBeacon||!navigator.sendBeacon(END,new Blob([data],{type:'text/plain'}))){fetch(END,{method:'POST',body:data,headers:{'Content-Type':'text/plain'},keepalive:true,mode:'no-cors'}).catch(function(){})}}catch(e){}}
/* Timing metadata only: no URLs, tokens, names or query strings are transmitted. */
var __bwResource={};
function __bwClassify(entry){try{var u=new URL(entry.name),h=u.hostname,p=u.pathname;if(/guestplan|etender-connect/.test(h))return'guestplan';if(/kmt|heischehoeve/.test(h))return'kmt';if(/n8n\.cloud/.test(h)&&p.indexOf('/webhook/')>=0&&p.indexOf('bus-widget-telemetry')<0)return'n8n_api';if(/\.(js|css)$/.test(p))return'asset';return''}catch(e){return''}}
function __bwAddResource(e){var k=__bwClassify(e);if(k&&Number.isFinite(e.duration)&&e.duration>0)__bwResource[k]=Math.max(__bwResource[k]||0,e.duration)}
try{performance.getEntriesByType('resource').forEach(__bwAddResource);if('PerformanceObserver'in window)new PerformanceObserver(function(l){l.getEntries().forEach(__bwAddResource)}).observe({type:'resource',buffered:true})}catch(e){}
setTimeout(function(){Object.keys(__bwResource).forEach(function(k){send('resource_timing',Math.round(__bwResource[k]),k,k)})},5000);
/* First visible image is measured separately from DOM. No URLs or PII leave the browser. */
function __bwMeasureFirstPhoto(){
 try{var im=document.querySelector('img.photo');if(!im)return;
 var logged=false;function done(){if(logged||!im.naturalWidth)return;logged=true;send('first_photo_loaded',Math.round(performance.now()),'','hero_image')}
 if(im.complete)done();else im.addEventListener('load',done,{once:true});
 }catch(e){}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',__bwMeasureFirstPhoto,{once:true});else __bwMeasureFirstPhoto();
window.__busTrackWidget=send;
send('widget_loaded',Math.round(performance.now?performance.now():Date.now()-started));
function interactive(){if(document.querySelector('form.booking-form,[data-code],.cards,.bw-me-form')){send('widget_interactive',Math.round(performance.now?performance.now():Date.now()-started));return true}return false}
if(!interactive()){var ticks=0;var t=setInterval(function(){if(interactive()||++ticks>=80)clearInterval(t)},150)}
document.addEventListener('click',function(e){var x=e.target.closest&&e.target.closest('[data-code]');if(x){selected=x.getAttribute('data-code')||'';send('arrangement_selected',Math.round(performance.now()),selected)}var y=e.target.closest&&e.target.closest('button[type=submit],.submit-booking,.bw-pay');if(y&&y.closest('form.booking-form,.bw-me-form,.bw-ck'))send('checkout_started',Math.round(performance.now()))},true);
document.addEventListener('change',function(e){var x=e.target;if(x&&(x.type==='date'||x.id==='date'||/date|datum/i.test(x.name||'')))send('date_selected',Math.round(performance.now()),String(x.value||''))},true);
document.addEventListener('focusin',function(e){if(e.target&&e.target.closest&&e.target.closest('form.booking-form,.bw-me-form,.bw-ck'))send('form_started',Math.round(performance.now()))},true);
document.addEventListener('submit',function(e){if(e.target&&e.target.matches&&e.target.matches('form.booking-form,.bw-me-form,.bw-ck'))send('checkout_started',Math.round(performance.now()))},true);

/* Reserveer klik in stap 2: intentie zonder PII naar telemetrie.
   NA deze klik: vastleggen zodra de gast zelf een geldig mailadres invoert.
   Geen betaalgegevens, boncodes of vrije notities naar lead endpoint. */
var LEAD_END='https://buswhiskyevents.app.n8n.cloud/webhook/bus-widget-reserveren-lead';
var reserveerClicks={};var leadTimers={};var leadHashes={};
function codeFor(f){try{return String(f.closest('.card[data-code]')?.getAttribute('data-code')||'').slice(0,64)}catch(e){return''}}
function keepClicked(code){if(!code)return;try{var m=JSON.parse(sessionStorage.getItem('bw-reserveer-clicked-v1')||'{}');m[code]=Date.now();sessionStorage.setItem('bw-reserveer-clicked-v1',JSON.stringify(m))}catch(e){}reserveerClicks[code]=Date.now()}
function clickTime(code){var t=reserveerClicks[code]||0;try{if(!t){var m=JSON.parse(sessionStorage.getItem('bw-reserveer-clicked-v1')||'{}');t=Number(m[code]||0)}}catch(e){}return Date.now()-t<7200000?t:0}
function sendLead(f,force){try{
 if(!f||!f.matches('form.booking-form'))return;var r=f.closest('.card[data-code]'),code=codeFor(f),t=clickTime(code);if(!r||!code||!t)return;
 var e=f.elements,email=String(e.email?.value||'').trim().toLowerCase();
 if(!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(email)||email.length>200)return;
 var val=function(k,n){return String(e[k]?.value||'').trim().slice(0,n)};
 var d=document.getElementById('date'),ti=document.getElementById('time'),pa=document.getElementById('pax');
 var payload={session_id:sid,arrangement:code,service_title:String(r.dataset.title||'').slice(0,180),
 booking_date:d?String(d.value||''):'',booking_time:ti?String(ti.value||''):'',party_size:pa?Number(pa.value||2):2,
 first_name:val('firstName',100),last_name:val('lastName',100),email:email,phone:val('phone',60),
 source:src(),clicked_at:new Date(t).toISOString(),event_id:rid(),event_type:'lead_details'};
 var hash=JSON.stringify([payload.arrangement,payload.booking_date,payload.booking_time,payload.party_size,payload.first_name,payload.last_name,payload.email,payload.phone]);
 if(!force&&leadHashes[code]===hash)return;leadHashes[code]=hash;
 var data=JSON.stringify(payload);
 if(!navigator.sendBeacon||!navigator.sendBeacon(LEAD_END,new Blob([data],{type:'text/plain'}))){
 fetch(LEAD_END,{method:'POST',body:data,headers:{'Content-Type':'text/plain'},keepalive:true,mode:'no-cors'}).catch(function(){})}
 }catch(e){}}
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('a.book,button.book[type=button]');
 if(!b)return;var r=b.closest('.card[data-code]');if(!r||r.classList.contains('unavailable'))return;
 var code=String(r.dataset.code||'');if(!code)return;selected=code;keepClicked(code);
 send('reserveer_clicked',Math.round(performance.now()),code,'step2');
},true);
document.addEventListener('input',function(e){var f=e.target.closest&&e.target.closest('form.booking-form');if(!f)return;
 var code=codeFor(f);if(!clickTime(code))return;clearTimeout(leadTimers[code]);leadTimers[code]=setTimeout(function(){sendLead(f,false)},800);
},true);
document.addEventListener('change',function(e){var f=e.target.closest&&e.target.closest('form.booking-form');if(f)sendLead(f,false)},true);
document.addEventListener('submit',function(e){var f=e.target;if(f&&f.matches&&f.matches('form.booking-form'))sendLead(f,true)},true);

/* Read-only checkout response correlation; original fetch and response are unchanged. */
var nativeFetch=window.fetch;window.fetch=function(){
var args=arguments;var url='';try{url=String(args[0]&&args[0].url||args[0]||'')}catch(e){}
var p=nativeFetch.apply(this,args);
if(url.indexOf('/bus-checkout/start')!==-1){p.then(function(res){try{res.clone().json().then(function(j){if(j&&j.checkout_id&&/^[a-zA-Z0-9_-]{4,100}$/.test(String(j.checkout_id)))send('checkout_created',Math.round(performance.now()),String(j.checkout_id))}).catch(function(){})}catch(e){}}).catch(function(){})}
return p
};
})();</script>`;
return $input.all().map(it => {
  const j = it.json || {};
  let h = String(j.html || '');
  if (!h) return it;
  if(h.indexOf('id="bw-telemetry-v1"') < 0) h=h.indexOf('</body>')>=0?h.replace('</body>',T+'</body>'):h+T;
  if (h.indexOf('id="bw-fanprijs-js"') >= 0) return { json: Object.assign({}, j, { html: h }), pairedItem: it.pairedItem };
  h = h.indexOf('</body>') >= 0 ? h.split('</body>').join(S + '</body>') : h + S;
  return { json: Object.assign({}, j, { html: h }), pairedItem: it.pairedItem };
});

}).call(__self,__mk(__items)));

/* BUS EIGEN FOTOARCHIEF v1: bronfoto's permanent in WordPress-media als 700px WebP.
   Deze vervanging vindt server-side plaats voordat de HTML in de bestaande cache gaat.
   Bij openen wordt NIETS bij Guestplan of oude Formitable storage opgehaald. */
const __bwOwnMedia={"https://wordpress.buswhisky.com/wp-content/uploads/bus-arrangement-0bce2d33-766a-488a-8371-67171095cdce.png":"https://wordpress.buswhisky.com/wp-content/uploads/bus-widget-svc-0bce2d33-766a-488a-8371-67171095cdce-fast.webp","https://wordpress.buswhisky.com/wp-content/uploads/bus-arrangement-8c7b21ff-2fb5-4761-af5b-f2f2d5806dea.png":"https://wordpress.buswhisky.com/wp-content/uploads/bus-widget-svc-8c7b21ff-2fb5-4761-af5b-f2f2d5806dea-fast.webp","https://wordpress.buswhisky.com/wp-content/uploads/bus-arrangement-1c3b484e-9f43-4d20-8e8f-403323d157ab.jpeg":"https://wordpress.buswhisky.com/wp-content/uploads/bus-widget-svc-1c3b484e-9f43-4d20-8e8f-403323d157ab-fast.webp","https://wordpress.buswhisky.com/wp-content/uploads/bus-arrangement-e2a8437d-3a86-4c81-8d69-61b7d59e5af7.png":"https://wordpress.buswhisky.com/wp-content/uploads/bus-widget-svc-e2a8437d-3a86-4c81-8d69-61b7d59e5af7-fast.webp","https://wordpress.buswhisky.com/wp-content/uploads/bus-arrangement-5164166d-3c5f-48b5-ad07-3378368fa329.png":"https://wordpress.buswhisky.com/wp-content/uploads/bus-widget-svc-5164166d-3c5f-48b5-ad07-3378368fa329-fast.webp","https://wordpress.buswhisky.com/wp-content/uploads/bus-arrangement-1d8c0dad-b8e9-41c4-8053-4bdfecb6375c.png":"https://wordpress.buswhisky.com/wp-content/uploads/bus-widget-svc-1d8c0dad-b8e9-41c4-8053-4bdfecb6375c-fast.webp","https://wordpress.buswhisky.com/wp-content/uploads/bus-arrangement-cd1801e7-a7ee-4926-8bf7-03116b8f2db2.png":"https://wordpress.buswhisky.com/wp-content/uploads/bus-widget-svc-cd1801e7-a7ee-4926-8bf7-03116b8f2db2-fast.webp","https://ftstorageprod.blob.core.windows.net/images/restaurant/59f03a82/images/ca5183b4-49ca-4301-8584-66735983ada9.jpg":"https://wordpress.buswhisky.com/wp-content/uploads/bus-widget-ft-ca5183b4-49ca-4301-8584-66735983ada9-fast.webp","https://wordpress.buswhisky.com/wp-content/uploads/bus-arrangement-17f1ef9a-51f4-4a82-bc9d-0e5bb9d9e4e4.png":"https://wordpress.buswhisky.com/wp-content/uploads/bus-widget-svc-17f1ef9a-51f4-4a82-bc9d-0e5bb9d9e4e4-fast.webp","https://wordpress.buswhisky.com/wp-content/uploads/bus-arrangement-849f9867-73a9-413c-82f3-3981ef61f18d.png":"https://wordpress.buswhisky.com/wp-content/uploads/bus-widget-svc-849f9867-73a9-413c-82f3-3981ef61f18d-fast.webp","https://wordpress.buswhisky.com/wp-content/uploads/bus-arrangement-b4e58cad-bbce-4566-a645-d88fe63d068d.jpeg":"https://wordpress.buswhisky.com/wp-content/uploads/bus-widget-svc-b4e58cad-bbce-4566-a645-d88fe63d068d-fast.webp","https://wordpress.buswhisky.com/wp-content/uploads/bus-arrangement-b87d2cba-d8b1-47b3-baf7-973ae2466738.png":"https://wordpress.buswhisky.com/wp-content/uploads/bus-widget-svc-b87d2cba-d8b1-47b3-baf7-973ae2466738-fast.webp","https://ftstorageprod.blob.core.windows.net/images/restaurant/59f03a82/images/37708858-0ee2-458b-aac2-472678f39e0c.jpg":"https://wordpress.buswhisky.com/wp-content/uploads/bus-widget-ft-37708858-0ee2-458b-aac2-472678f39e0c-fast.webp","https://wordpress.buswhisky.com/wp-content/uploads/bus-arrangement-4b7bb422-53ca-4c17-aa66-11c524393e9a.png":"https://wordpress.buswhisky.com/wp-content/uploads/bus-widget-svc-4b7bb422-53ca-4c17-aa66-11c524393e9a-fast.webp","https://ftstorageprod.blob.core.windows.net/images/restaurant/59f03a82/images/fb11cca7-c3ad-428b-9b8b-bc07cd168829.jpg":"https://wordpress.buswhisky.com/wp-content/uploads/bus-widget-ft-fb11cca7-c3ad-428b-9b8b-bc07cd168829-fast.webp","https://ftstorageprod.blob.core.windows.net/images/restaurant/59f03a82/images/c5a5cfd7-5cb2-4090-ae10-c06b2731cb22.jpg":"https://wordpress.buswhisky.com/wp-content/uploads/bus-widget-ft-c5a5cfd7-5cb2-4090-ae10-c06b2731cb22-fast.webp","https://wordpress.buswhisky.com/wp-content/uploads/bus-arrangement-4b2dcdf9-cb11-4cb0-81be-38db792cdd53.jpeg":"https://wordpress.buswhisky.com/wp-content/uploads/bus-widget-svc-4b2dcdf9-cb11-4cb0-81be-38db792cdd53-fast.webp","https://wordpress.buswhisky.com/wp-content/uploads/bus-arrangement-3afe3ca7-c0f6-4021-b356-25304be2f039.jpeg":"https://wordpress.buswhisky.com/wp-content/uploads/bus-widget-svc-3afe3ca7-c0f6-4021-b356-25304be2f039-fast.webp","https://wordpress.buswhisky.com/wp-content/uploads/bus-arrangement-e93a930d-e337-43c9-aff3-619154ebe6b0.jpeg":"https://wordpress.buswhisky.com/wp-content/uploads/bus-widget-svc-e93a930d-e337-43c9-aff3-619154ebe6b0-fast.webp","https://wordpress.buswhisky.com/wp-content/uploads/bus-arrangement-46cb79cd-378c-45c6-8f55-43415e2c9693.jpeg":"https://wordpress.buswhisky.com/wp-content/uploads/bus-widget-svc-46cb79cd-378c-45c6-8f55-43415e2c9693-fast.webp","https://ftstorageprod.blob.core.windows.net/images/restaurant/59f03a82/images/ddd1ad04-1816-4301-97a2-ab20b9e4e8b2.jpg":"https://wordpress.buswhisky.com/wp-content/uploads/bus-widget-ft-ddd1ad04-1816-4301-97a2-ab20b9e4e8b2-fast.webp","https://ftstorageprod.blob.core.windows.net/images/restaurant/59f03a82/images/3d5539ec-2e53-4047-afb7-a3a6c1fea214.jpg":"https://wordpress.buswhisky.com/wp-content/uploads/bus-widget-ft-3d5539ec-2e53-4047-afb7-a3a6c1fea214-fast.webp","https://ftstorageprod.blob.core.windows.net/images/restaurant/59f03a82/images/f38b3532-d7ba-41a5-a2c8-9d35ab18b9e9.jpg":"https://wordpress.buswhisky.com/wp-content/uploads/bus-widget-ft-f38b3532-d7ba-41a5-a2c8-9d35ab18b9e9-fast.webp","https://wordpress.buswhisky.com/wp-content/uploads/bus-cadeaubon-2x1-logo.jpeg":"https://wordpress.buswhisky.com/wp-content/uploads/bus-cadeaubon-2x1-logo-fast.webp","https://www.heischehoeve.com/download/?id=18699177&width=900&height=600&zc=1&fileType=auto":"https://wordpress.buswhisky.com/wp-content/uploads/bus-widget-me-18699177-fast.webp","https://www.heischehoeve.com/download/?id=18699171&width=900&height=600&zc=1&fileType=auto":"https://wordpress.buswhisky.com/wp-content/uploads/bus-widget-me-18699171-fast.webp","https://www.heischehoeve.com/download/?id=17746891&width=900&height=600&zc=1&fileType=auto":"https://wordpress.buswhisky.com/wp-content/uploads/bus-widget-me-17746891-fast.webp","https://www.heischehoeve.com/download/?id=18496040&width=900&height=600&zc=1&fileType=auto":"https://wordpress.buswhisky.com/wp-content/uploads/bus-widget-me-18496040-fast.webp","https://www.heischehoeve.com/download/?id=18690993&width=900&height=600&zc=1&fileType=auto":"https://wordpress.buswhisky.com/wp-content/uploads/bus-widget-me-18690993-fast.webp","https://www.heischehoeve.com/download/?id=18699120&width=900&height=600&zc=1&fileType=auto":"https://wordpress.buswhisky.com/wp-content/uploads/bus-widget-me-18699120-fast.webp","https://www.heischehoeve.com/download/?id=18827725&width=900&height=600&zc=1&fileType=auto":"https://wordpress.buswhisky.com/wp-content/uploads/bus-widget-me-18827725-fast.webp","https://www.heischehoeve.com/download/?id=18501331&width=900&height=600&zc=1&fileType=auto":"https://wordpress.buswhisky.com/wp-content/uploads/bus-widget-me-18501331-fast.webp","https://www.heischehoeve.com/download/?id=18690990&width=900&height=600&zc=1&fileType=auto":"https://wordpress.buswhisky.com/wp-content/uploads/bus-widget-me-18690990-fast.webp","https://www.heischehoeve.com/download/?id=18914421&width=900&height=600&zc=1&fileType=auto":"https://wordpress.buswhisky.com/wp-content/uploads/bus-widget-me-18914421-fast.webp","https://www.heischehoeve.com/download/?id=19402955&width=900&height=600&zc=1&fileType=auto":"https://wordpress.buswhisky.com/wp-content/uploads/bus-widget-me-19402955-fast.webp","https://www.heischehoeve.com/download/?id=692443&width=80&height=60&zc=1&fileType=auto":"https://wordpress.buswhisky.com/wp-content/uploads/bus-widget-me-692443-fast.webp","https://www.heischehoeve.com/download/?id=18922389&width=900&height=600&zc=1&fileType=auto":"https://wordpress.buswhisky.com/wp-content/uploads/bus-widget-me-18690993-fast.webp"};
__items=(__items||[]).map(function(it){
 if(!it||!it.json||typeof it.json.html!=='string')return it;
 let h=it.json.html;
 for(const [remote,own] of Object.entries(__bwOwnMedia))if(h.includes(remote))h=h.split(remote).join(own);
 let shown=0;
 h=h.replace(/<img class="photo" src=/g,function(){
  const priority=shown++<2?' loading="eager" fetchpriority="high"':' loading="lazy" fetchpriority="low"';
  return '<img class="photo" decoding="async"'+priority+' src=';
 });
 if(!h.includes('data-bw-own-preconnect="1"'))h=h.replace('</head>','<link data-bw-own-preconnect="1" rel="preconnect" href="https://wordpress.buswhisky.com" crossorigin></head>');
 const first=h.match(/<img class="photo"[^>]*\bsrc="(https:\/\/wordpress\.buswhisky\.com\/wp-content\/uploads\/[^"]+\.webp)"/);
 if(first&&!h.includes('data-bw-first-photo="1"'))h=h.replace('</head>','<link data-bw-first-photo="1" rel="preload" as="image" href="'+first[1]+'"></head>');

 return {...it,json:{...it.json,html:h}};
});
return __items;
  };
  S["k2"] = async function ($input, $, DateTime, $vars, $getWorkflowStaticData) {
// 26 nov 2026 (Dennis): de nabel-mail (Gebeld, geen gehoor) stuurt eerder gebruikte codes mee:
// kortingscode via #...&actie=CODE en waardebon via ?bon=CODE, ook allebei tegelijk (combineren mag in de checkout).
// 1) bw-actie-js kende alleen AV- en VOORPRET-; nu ook andere kortingscodes zoals INVA-XXXXXXX.
// 2) bw-actie-js wiste de waardebon; met ?bon= in de link blijft de bon nu staan.
// 3) het ?bon=-script wiste de kortingscode; met &actie= in de link blijft die nu staan.
// Geldigheid en combinatieregels blijven server-side.
const R = [
  ['AV-[A-Z0-9]{7}|VOORPRET-[A-Z0-9]{6})/', 'AV-[A-Z0-9]{7}|VOORPRET-[A-Z0-9]{6}|[A-Z][A-Z0-9]{1,9}-[A-Z0-9]{4,14})/'],
  ['<script id="bw-actie-js">(function(){', '<script id="bw-actie-js">(function(){var BON=(function(){var q="";try{q=String(window.top.location.search||"")}catch(e){}q+=" "+String(location.search||"");var m=q.match(/[?&]bon=((?:BUS-)?[A-Za-z0-9]{8,16})/);return m?String(m[1]).toUpperCase():""})();'],
  ['s.discountCode=C;s.giftCards="";', 's.discountCode=C;if(!BON)s.giftCards="";'],
  ['if(naast&&!naast.readOnly)naast.value="";', 'if(naast&&!naast.readOnly&&!BON)naast.value="";'],
  ['JSON.stringify({v:"",d:C})', 'JSON.stringify({v:BON,d:C})'],
  ["if(!s.giftCards){s.giftCards=code;s.discountCode='';", "if(!s.giftCards){s.giftCards=code;var ha='';try{ha=String(window.top.location.hash||'')}catch(e){}if(!/[?&]actie=/.test(ha+' '+String(location.hash||'')))s.discountCode='';"]
];
return $input.all().map(it => {
  const j = it.json || {};
  let h = String(j.html || '');
  if (!h) return it;
  let ok = false;
  for (const [o, n] of R) { if (h.indexOf(o) >= 0) { h = h.split(o).join(n); ok = true; } }
  if (!ok) return it;
  return { json: Object.assign({}, j, { html: h }), pairedItem: it.pairedItem };
});

  };
  S["k3"] = async function ($input, $, DateTime, $vars, $getWorkflowStaticData) {

// 21 nov 2026 executiebudget (akkoord Dennis): telemetrie-events gebundeld.
// 22 nov 2026 (Dennis: "10% is geen meting"): telemetrie gaat niet meer naar n8n maar naar GA4 via de Google-tag van de site
// (G-0S69HE9T00, property 538229815). Kost geen n8n-run en meet elke bezoeker met analytics-toestemming.
// Checkout-events niet meer apart: de checkout zelf staat al serverside vast. Leadvastlegging (reserveren-lead) blijft ongewijzigd.
const F="try{var data=JSON.stringify(p);if(!navigator.sendBeacon||!navigator.sendBeacon(END,new Blob([data],{type:'text/plain'}))){fetch(END,{method:'POST',body:data,headers:{'Content-Type':'text/plain'},keepalive:true,mode:'no-cors'}).catch(function(){})}}catch(e){}}";
const R="try{if(type!=='checkout_started'&&type!=='checkout_created'&&type!=='booking_confirmation_seen')bwGa(type,p)}catch(e){}}\n/* Privacyarme browser-events in een bundel, zonder wachten op het netwerk. */\nvar __bwQ=[],__bwTimer=null;\nfunction bwQueue(p){if(['widget_loaded','widget_interactive','first_photo_loaded','arrangement_selected','reserveer_clicked','date_selected','form_started','checkout_started','checkout_created','booking_confirmation_seen'].indexOf(p.event_type)<0)return;__bwQ.push(p);if(!__bwTimer)__bwTimer=setTimeout(bwFlush,3500)}\nfunction bwFlush(){if(__bwTimer){clearTimeout(__bwTimer);__bwTimer=null}if(!__bwQ.length)return;var batch=__bwQ.splice(0,40),data=JSON.stringify({batch:batch});try{if(navigator.sendBeacon&&navigator.sendBeacon(END,new Blob([data],{type:'text/plain'})))return;fetch(END,{method:'POST',body:data,headers:{'Content-Type':'text/plain'},keepalive:true,mode:'no-cors'}).catch(function(){})}catch(e){}}\nwindow.addEventListener('pagehide',bwFlush);document.addEventListener('visibilitychange',function(){if(document.visibilityState==='hidden')bwFlush()});\n/* 22 nov 2026: naar GA4 via de Google-tag van de site, geen n8n-run. Geen PII: alleen type, duur, arrangementcode, onderdeel, toestel. */\nfunction bwGa(type,p){try{var w=window;try{if(window.top!==window&&window.top.document)w=window.top}catch(e){w=window}\nvar g=typeof w.gtag==='function'?w.gtag:(w.__bwGtag||(w.__bwGtag=new w.Function('window.dataLayer=window.dataLayer||[];window.dataLayer.push(arguments)')));\nvar lok=false;try{lok=!!(w.__busWidgetVers&&w.__busWidgetVers())}catch(e){}\nvar ms=Math.max(0,Math.round(Number(p.duration_ms)||0));g('event','bw_'+type,{send_to:'G-0S69HE9T00',value:ms,content_id:String(p.arrangement||'').slice(0,40),content_type:String(p.component||'')?String(p.component).slice(0,40):(lok?'browser':'n8n'),bw_ms:ms,bw_arrangement:String(p.arrangement||'').slice(0,40),bw_onderdeel:String(p.component||'').slice(0,40),bw_toestel:String(p.device||''),bw_bron:lok?'browser':'n8n'})}catch(e){}}\nwindow.__bwTelemetryFlush=bwFlush;";
// 24 nov 2026 (Dennis: "repareer de meting"): Meta-funnel in de widget. (1) script bw-meta-v1: ViewContent bij een geopend
// arrangement, AddToCart bij Reserveren/invullen, met waarde. (2) InitiateCheckout krijgt waarde. (3) _fbc valt terug op de
// klik-ID die bus-chat-core.js bij binnenkomst via een advertentie bewaart (sessionStorage bw_fbc), zodat de serverside
// Purchase aan de advertentieklik gekoppeld wordt, ook zonder pixelcookie.
const META="<script id=\"bw-meta-v1\">(function(){\n/* 24 nov 2026: Meta-pixel funnel in de eigen widget. Formitable stuurde ViewContent/AddToCart; sinds Guestplan en de eigen\n   widget kwamen die niet meer, waardoor campagnes die op aankopen optimaliseren te weinig signaal kregen.\n   Alleen als de pixel op de site geladen is (cookietoestemming marketing). Geen persoonsgegevens. */\nif(window.__bwMetaV1)return;window.__bwMetaV1=true;\nfunction px(){try{var t=window.top;if(t&&typeof t.fbq==='function')return t.fbq}catch(e){}return typeof window.fbq==='function'?window.fbq:null}\nfunction pax(){var n=Number((document.getElementById('pax')||{}).value||0);return n>0?n:1}\nfunction info(card){var code=String(card.getAttribute('data-code')||''),cents=Number(card.getAttribute('data-price')||0),n=pax();\n var d={content_ids:[code],content_name:String(card.getAttribute('data-title')||'').slice(0,100),content_type:'product',content_category:String(card.getAttribute('data-kind')||''),currency:'EUR',num_items:n};\n if(cents>0)d.value=Math.round(cents*n)/100;return d}\nfunction eenmaal(k){try{var s=window.sessionStorage,key='bwMeta:'+k;if(s.getItem(key))return false;s.setItem(key,'1');return true}catch(e){return true}}\nfunction stuur(ev,card){var f=px();if(!f||!card)return;var d=info(card);if(!d.content_ids[0])return;if(!eenmaal(ev+':'+d.content_ids[0]+':'+(ev==='ViewContent'?'':d.num_items)))return;try{f('track',ev,d)}catch(e){}}\nfunction bekeken(){var q;try{q=new URLSearchParams(location.search).get('arrangement')||''}catch(e){q=''}if(!q)return;\n var c=document.querySelector('.card[data-code=\"'+q.replace(/\"/g,'')+'\"]');if(c)stuur('ViewContent',c)}\ndocument.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('button.book[type=button]');if(!b)return;var r=b.closest('.card[data-code]');if(!r||r.classList.contains('unavailable'))return;stuur('AddToCart',r)},true);\ndocument.addEventListener('focusin',function(e){var f=e.target.closest&&e.target.closest('form.booking-form');if(!f)return;var r=f.closest('.card[data-code]');if(r&&!r.classList.contains('unavailable'))stuur('AddToCart',r)},true);\nif(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bekeken);else bekeken();\nvar tel=0,iv=setInterval(function(){if(px()||++tel>20){clearInterval(iv);bekeken()}},500);\n})();</script>";
const IC_OUD="tw.fbq('track','InitiateCheckout',{currency:'EUR',content_ids:[body.service_code],num_items:body.pax})";
const IC_NIEUW="tw.fbq('track','InitiateCheckout',Object.assign({currency:'EUR',content_ids:[body.service_code],content_type:'product',num_items:body.pax},body.unit_price_cents>0?{value:Math.round(body.unit_price_cents*body.pax)/100}:{}))";
const FBC_OUD="var fbc=g('_fbc');";
const FBC_NIEUW="var fbc=g('_fbc');if(!fbc){try{fbc=window.top.sessionStorage.getItem('bw_fbc')||''}catch(e){}}";
// 24 nov 2026: checkout rechtstreeks naar n8n (niet via de doorgeefserver van buswhisky.com), zodat n8n het IP van de gast
// ziet voor de Meta Conversions API. Lukt dat netwerkverzoek niet (bijv. geblokkeerd), dan valt hij terug op de oude route.
const START_OUD="fetch(location.origin+'/webhook/bus-checkout/start',";
const START_NIEUW="(function(u,o){return fetch('https://buswhiskyevents.app.n8n.cloud/webhook/bus-checkout/start',o).catch(function(){return fetch(u,o)})})(location.origin+'/webhook/bus-checkout/start',";
function metaFix(h){if(h.indexOf(START_OUD)>=0)h=h.split(START_OUD).join(START_NIEUW);if(h.indexOf('id="bw-meta-v1"')<0&&h.indexOf('</body>')>=0)h=h.replace('</body>',()=>META+'</body>');if(h.indexOf(IC_OUD)>=0)h=h.split(IC_OUD).join(IC_NIEUW);if(h.indexOf(FBC_OUD)>=0&&h.indexOf("getItem('bw_fbc')")<0)h=h.split(FBC_OUD).join(FBC_NIEUW);return h}
return $input.all().map(it=>{const j=it.json||{};let h=String(j.html||'');if(!h)return it;if(h.indexOf(F)>=0)h=h.split(F).join(R);h=metaFix(h);return {json:Object.assign({},j,{html:h}),pairedItem:it.pairedItem};});

  };
  S["k4"] = async function ($input, $, DateTime, $vars, $getWorkflowStaticData) {
// 19 nov 2026 (Dennis: 'ik moet 2x drukken op reserveren'). Een deeplink naar EEN arrangement op een datum zonder plek
// (bv. vandaag bij het restaurant, 24 uur vooraf) toonde in plaats van het formulier een tweede knop Reserveer.
// Dit script drukt die knop zelf in zodra de pagina geladen is: door naar de eerste vrije datum met het formulier open,
// of (zonder bekende vrije datum) de kalender open. Lusbeveiliging: maximaal 2 sprongen per 20 seconden.
const S="<script id=\"bw-geen-tweede-reserveer\">(function(){function go(){try{if(!document.body.classList.contains('bw-single'))return;var cards=document.querySelectorAll('#cards .card');if(cards.length!==1)return;var c=cards[0];var f=c.querySelector('form.booking-form');if(f&&f.offsetParent)return;var b=c.querySelector('.nextdate');if(!b||!b.offsetParent)return;var k='bwAutoNext',n=0;try{var o=JSON.parse(sessionStorage.getItem(k)||'null');if(o&&Date.now()-o.t<20000)n=o.n}catch(e){}if(n>=2){var tr=document.getElementById('dateTrigger'),box=document.getElementById('busCal');if(tr&&box&&box.hidden)tr.click();return}try{sessionStorage.setItem(k,JSON.stringify({t:Date.now(),n:n+1}))}catch(e){}b.click()}catch(e){}}if(document.readyState!=='loading')setTimeout(go,0);else document.addEventListener('DOMContentLoaded',function(){setTimeout(go,0)},{once:true})})();</script>";

// 20 nov 2026 (casus Freek Meulendijks, investeerder): de 25% investeerderskorting wordt in de webshop-checkout automatisch
// toegepast en zet het waardebonveld vast. Onder de toegepaste INV-korting staat nu een korte, positieve uitleg waar de
// persoonlijke waardebon wel volledig werkt (bezoek). 25% is het wettelijk maximum op alcohol, dus de bon telt in de webshop niet bij.
// 20 nov 2026 (Dennis): Alcoholwet-waarschuwing. Klikt een investeerder op het vergrendelde waardebonveld, dan verschijnt een gele
// melding. Komt de webshopcontrole met een melding terug (bon afgetopt op 25%), dan staat die ook geel onder de toegepaste korting.
// 28 nov 2026 (Dennis): duidelijke pop-up in plaats van alleen een gele regel. Bij klik op het vergrendelde bonveld (investeerder),
// bij een geweigerde combinatie kortingscode + gekregen bon, en bij een afgetopte bon. Positief: wat wel kan en waar de bon volledig werkt,
// plus dat een gekochte cadeaubon altijd bovenop de korting mag. Per paginabezoek een keer automatisch, bij klik altijd.
const INV="<script id=\"bw-inv-bon-js\">(function(){\nvar T='Je investeerderskorting van 25% is toegepast: de maximale korting op whisky. Je persoonlijke waardebon zet je volledig in bij een bezoek aan ons restaurant, de B&B of een rondleiding.';\nvar P_INV={t:'Zo haal je het meeste uit je voordeel',b:['Je investeerderskorting van 25% is toegepast. Dat is de hoogste korting op whisky die de Alcoholwet toestaat, en die krijg je bij elke bestelling.','Je persoonlijke waardebon zet je volledig in bij een bezoek aan Bus: in het boerderijrestaurant, de B&B, bij een rondleiding of een proeverij. Het hele bedrag blijft daarvoor op je bon staan.','Heb je een gekochte cadeaubon uit onze giftshop? Die vul je hier gewoon in, bovenop je 25% korting.'],k:'Reserveer een bezoek',u:'https://buswhisky.com/#reserveren'};\nvar P_GEN={t:'Een voordeel per bestelling',b:['Volgens de Alcoholwet is de korting op whisky maximaal 25% per bestelling. Kies daarom hier je kortingscode of je bon.','De andere blijft gewoon staan voor een volgende bestelling of een bezoek aan Bus: restaurant, B&B, rondleiding of proeverij.','Een gekochte cadeaubon uit onze giftshop vul je wel altijd in, bovenop je korting.'],k:'',u:''};\nvar P_CAP=function(m){return {t:'Je bon is deels gebruikt',b:[m,'Een gekochte cadeaubon uit onze giftshop vul je wel altijd volledig in, bovenop je korting.'],k:'',u:''}};\nvar LAST='',SHOWN={};\nfunction pop(p,key){try{if(key&&SHOWN[key])return;if(key)SHOWN[key]=1;var o=document.getElementById('bw-awet-pop');if(o)o.remove();o=document.createElement('div');o.id='bw-awet-pop';o.setAttribute('role','dialog');o.setAttribute('aria-modal','true');o.setAttribute('style','position:fixed;inset:0;z-index:2147483000;background:rgba(29,29,27,.55);display:flex;align-items:center;justify-content:center;padding:16px');var c=document.createElement('div');c.setAttribute('style','background:#fff;max-width:420px;width:100%;border-radius:12px;padding:20px 20px 16px;box-shadow:0 10px 40px rgba(0,0,0,.25);font:inherit;color:#1d1d1b');var h=document.createElement('div');h.textContent=p.t;h.setAttribute('style','font-weight:800;font-size:17px;margin:0 0 10px');c.appendChild(h);p.b.forEach(function(t){var q=document.createElement('p');q.textContent=t;q.setAttribute('style','font-size:14px;line-height:1.5;margin:0 0 9px');c.appendChild(q)});var r=document.createElement('div');r.setAttribute('style','display:flex;gap:8px;margin-top:12px;flex-wrap:wrap');if(p.k){var a=document.createElement('a');a.href=p.u;a.target='_top';a.textContent=p.k;a.setAttribute('style','flex:1;text-align:center;padding:10px;border-radius:7px;border:1px solid #1d1d1b;color:#1d1d1b;text-decoration:none;font-weight:700;font-size:14px');r.appendChild(a)}var b=document.createElement('button');b.type='button';b.textContent='Duidelijk';b.setAttribute('style','flex:1;padding:10px;border:0;border-radius:7px;background:#1d1d1b;color:#fff;font:inherit;font-weight:800;font-size:14px;cursor:pointer');b.addEventListener('click',function(){o.remove()});r.appendChild(b);c.appendChild(r);o.appendChild(c);o.addEventListener('click',function(e){if(e.target===o)o.remove()});document.body.appendChild(o);b.focus()}catch(e){}}\nfunction isInv(){var d=document.querySelector('.bw-ck .bw-credit [name=bwdiscount]');return !!(d&&/^INV-/i.test(String(d.value||'').trim()))}\ntry{var of=window.fetch;window.fetch=function(u,o){var p=of.apply(this,arguments);try{if(String(u||'').indexOf('/bus-wallet/webshop/check')>=0){p.then(function(r){try{r.clone().json().then(function(j){LAST=(j&&j.ok===true&&j.message)?String(j.message):'';if(j&&j.alcoholwet){if(j.ok===true)pop(P_CAP(String(j.message||'')),'cap');else pop(isInv()?P_INV:P_GEN,'combi')}setTimeout(z,50)}).catch(function(){})}catch(e){}}).catch(function(){})}}catch(e){}return p}}catch(e){}\nfunction blok(b,cls,txt,stijl){var x=b.querySelector('.'+cls);if(txt){if(!x){x=document.createElement('div');x.className=cls;x.setAttribute('style',stijl);b.appendChild(x)}if(x.textContent!==txt)x.textContent=txt}else if(x){x.remove()}}\nvar GEEL='font-size:12.5px;line-height:1.45;color:#7a4b00;background:#fff4dc;border:1px solid #f0d08a;border-radius:6px;padding:7px 9px;margin-top:6px';\nfunction z(){document.querySelectorAll('.bw-ck .bw-credit').forEach(function(b){var d=b.querySelector('[name=bwdiscount]'),v=b.querySelector('[name=bwvoucher]'),m=b.querySelector('.bw-credit-msg');if(!d||!m)return;var inv=/^INV-/i.test(String(d.value||'').trim());var ok=(' '+m.className+' ').indexOf(' ok ')>=0;blok(b,'bw-inv-bon',(inv&&ok)?T:'','font-size:12.5px;line-height:1.45;color:#555;margin-top:6px');blok(b,'bw-alcoholwet',ok&&LAST?LAST:'',GEEL);if(v&&!v.dataset.bwAwetL){v.dataset.bwAwetL='1';var h=function(){var i=/^INV-/i.test(String(d.value||'').trim());var k=(' '+m.className+' ').indexOf(' ok ')>=0;if(v.readOnly&&i&&k)pop(P_INV,'')};v.addEventListener('click',h);v.addEventListener('focus',h)}if(!ok){LAST=''}})}\nvar tm=null;new MutationObserver(function(){if(tm)return;tm=setTimeout(function(){tm=null;z()},120)}).observe(document.documentElement,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['class']});z()})();</script>";
return $input.all().map(function(it){const j=it.json||{};if(typeof j.html!=='string')return it;let h=j.html;if(h.indexOf('bw-geen-tweede-reserveer')<0)h=h.replace('</body>',S+'</body>');if(h.indexOf('id="bw-shop-credit-js"')>=0&&h.indexOf('id="bw-inv-bon-js"')<0)h=h.replace('</body>',INV+'</body>');return {json:Object.assign({},j,{html:h})};});
  };
  S["k5"] = async function ($input, $, DateTime, $vars, $getWorkflowStaticData) {
// 21 nov 2026 (casus John): laadstatus, verplichte tijd, bevestigingsblok, vooraf-check vol. 24 nov: rondleiding-tijdcheck en extra ronde 17:30.
const S = `<script id="bw-boekstatus-v2">(function(){
if(window.__bwBoekstatus)return;window.__bwBoekstatus=true;
var css=document.createElement('style');css.id='bw-boekstatus-css';
css.textContent='.booking-form button.book.bw-bezig{opacity:1!important;cursor:progress!important;display:flex!important;align-items:center;justify-content:center;gap:10px}'+
'.bw-spin{width:16px;height:16px;border:2px solid currentColor;border-right-color:transparent;border-radius:50%;display:inline-block;animation:bwspin .8s linear infinite}'+
'@keyframes bwspin{to{transform:rotate(360deg)}}'+
'.booking-form .booking-msg.bw-msg{display:block;margin-top:12px;padding:12px 14px;border-radius:8px;background:#fff4e5;border:1px solid #e0a43a;color:#151515!important;font-size:15px;font-weight:600;line-height:1.4}'+
'.bw-gelukt{margin-top:12px;padding:18px 16px;border-radius:10px;background:#eaf6ec;border:1px solid #3c9a52;color:#151515!important;text-align:center}'+
'.bw-gelukt b{display:block;font-size:20px;margin-bottom:6px}'+
'.bw-tijd-leeg{outline:3px solid #e0a43a!important;outline-offset:2px}'+
'.booking-form .bw-vol{display:block;margin:0 0 12px;padding:12px 14px;border-radius:8px;background:#fff4e5;border:1px solid #e0a43a;color:#151515!important;font-size:15px;font-weight:600;line-height:1.4}';
(document.head||document.documentElement).appendChild(css);
function knop(f){return f&&f.querySelector('button[type=submit]')}
function msgEl(f){return f&&f.querySelector('.booking-msg')}
function bezig(f,tekst){var b=knop(f);if(!b)return;if(!b.dataset.bwTekst)b.dataset.bwTekst=b.textContent||'Reserveer';b.classList.add('bw-bezig');b.disabled=true;b.innerHTML='<span class="bw-spin"></span><span></span>';b.lastChild.textContent=tekst;}
function klaar(f){var b=knop(f);if(!b||!b.classList.contains('bw-bezig'))return;b.classList.remove('bw-bezig');b.textContent=b.dataset.bwTekst||'Reserveer';b.disabled=false;}
function melding(f,tekst){var m=msgEl(f);if(!m)return;m.hidden=false;m.textContent=tekst;m.classList.add('bw-msg');try{m.scrollIntoView({block:'center',behavior:'smooth'})}catch(e){}}
var actief=null;
window.addEventListener('submit',function(e){
 var f=e.target;if(!f||!f.matches||!f.matches('form.booking-form'))return;
 var t=document.getElementById('time');
 var tijdNodig=t&&t.offsetParent!==null&&t.tagName==='SELECT'&&Array.prototype.some.call(t.options,function(o){return o.value&&!o.disabled});
 if(tijdNodig&&!t.value){e.preventDefault();e.stopImmediatePropagation();t.classList.add('bw-tijd-leeg');try{t.focus();t.scrollIntoView({block:'center',behavior:'smooth'})}catch(x){}melding(f,'Kies eerst een tijd, dan zetten we je reservering direct vast.');return;}
 if(t)t.classList.remove('bw-tijd-leeg');
 var m=msgEl(f);if(m){m.hidden=true;m.classList.remove('bw-msg');}
 actief=f;bezig(f,'Even geduld, we zetten je reservering vast...');
},true);
document.addEventListener('change',function(e){if(e.target&&e.target.id==='time')e.target.classList.remove('bw-tijd-leeg')},true);
new MutationObserver(function(ms){ms.forEach(function(mu){var m=mu.target;if(m&&m.classList&&m.classList.contains('booking-msg')&&!m.hidden){var f=m.closest('form.booking-form');m.classList.add('bw-msg');klaar(f);}})}).observe(document.documentElement,{subtree:true,attributes:true,attributeFilter:['hidden']});
var LIVE_TIJD=['CewjJvV','4cSbXnj','42SA1mn','79BAxWL'];var RESTO=['CewjJvV','4cSbXnj'];/* 24 nov 2026 (casus Michelle Witlox): ook rondleidingen met vaste tijd via de engine checken; restaurant heeft al live tijden. */var laatsteSleutel='',cacheV={};
function voorafCheck(){try{
 var cards=document.querySelectorAll('#cards .card');if(cards.length!==1)return;var c=cards[0];var code=String(c.dataset.code||'');if(!code||RESTO.indexOf(code)>=0)return;
 var f=c.querySelector('form.booking-form');if(!f)return;var d=document.getElementById('date'),p=document.getElementById('pax');if(!d||!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(d.value))return;
 var pax=Number(p&&p.value||2)||2;var tijd='';if(LIVE_TIJD.indexOf(code)>=0){var te=f.querySelector('[name=time]')||document.getElementById('time');tijd=String(te&&te.value||'').slice(0,5);if(!/^[0-9]{2}:[0-9]{2}$/.test(tijd))return;}var key=code+'|'+d.value+'|'+pax+'|'+tijd;if(key===laatsteSleutel)return;laatsteSleutel=key;
 var toon=function(vol){var n=f.querySelector('.bw-vol');var b=knop(f);
  if(vol){if(!n){n=document.createElement('div');n.className='bw-vol';f.insertBefore(n,f.firstChild)}n.textContent=tijd?'Dit tijdstip is volgeboekt. Kies een andere datum in de kalender, dan zetten we het direct voor je vast.':'Deze datum is volgeboekt. Kies een andere datum in de kalender, dan zetten we het direct voor je vast.';if(b){b.disabled=true;b.dataset.bwVol='1'}
   /* 24 nov 2026 (Dennis): 16:00 vol = extra ronde om 17:30 aanbieden als daar plek is. */
   if(code==='42SA1mn'&&tijd==='16:00')extraRonde(f,n,code,d.value,pax);}
  else{if(n)n.remove();if(b&&b.dataset.bwVol){b.disabled=false;delete b.dataset.bwVol}}};
 if(key in cacheV){toon(cacheV[key]);return}
 of('https://buswhiskyevents.app.n8n.cloud/webhook/bus-engine-availability',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(tijd?{service_code:code,date:d.value,time:tijd,pax:pax}:{service_code:code,date:d.value,pax:pax})}).then(function(r){return r.json()}).then(function(j){
  var vol=!!(j&&j.status==='READ_OK'&&j.available===false);cacheV[key]=vol;if(laatsteSleutel===key)toon(vol);}).catch(function(){});
}catch(e){}}
function extraRonde(f,n,code,datum,pax){var k=code+'|'+datum+'|'+pax+'|17:30';
 var go=function(vrij){if(!vrij||!n.isConnected)return;var t=document.getElementById('time');
  n.innerHTML='';var s=document.createElement('span');s.textContent='Om 16:00 is het vol. Om 17:30 is er een extra rondleiding met nog plek voor jullie.';n.appendChild(s);
  var kb=document.createElement('button');kb.type='button';kb.className='bw-extra-ronde';kb.textContent='Kies 17:30';kb.style.cssText='display:block;margin-top:10px;padding:10px 16px;border:0;border-radius:8px;background:#151515;color:#fff;font-weight:700;cursor:pointer';n.appendChild(kb);
  kb.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();
   if(t&&t.tagName==='SELECT'){if(!Array.prototype.some.call(t.options,function(o){return o.value==='17:30'})){var o=document.createElement('option');o.value='17:30';o.textContent='17:30';t.appendChild(o)}}
   if(t){t.value='17:30';t.dispatchEvent(new Event('input',{bubbles:true}))}
   var up=f.querySelector('#busUpsell');if(up&&up.checked){up.checked=false;up.dispatchEvent(new Event('change',{bubbles:true}))}
   cacheV[k]=false;laatsteSleutel='';voorafCheck();});};
 if(k in cacheV){go(cacheV[k]===false);return}
 of('https://buswhiskyevents.app.n8n.cloud/webhook/bus-engine-availability',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({service_code:code,date:datum,time:'17:30',pax:pax})}).then(function(r){return r.json()}).then(function(j){var v=!!(j&&j.status==='READ_OK'&&j.available===false);cacheV[k]=v;go(j&&j.status==='READ_OK'&&j.available===true)}).catch(function(){});
}
setInterval(voorafCheck,700);setTimeout(voorafCheck,50);
var of=window.fetch;window.fetch=function(u,o){var url='';try{url=String(u&&u.url||u||'')}catch(e){}var p=of.apply(this,arguments);
 if(actief&&(url.indexOf('/bus-checkout/start')>=0||url.indexOf('/bus-checkout/finalize')>=0)){var f=actief;p.then(function(res){try{res.clone().json().then(function(j){
  if(!j)return;
  if(url.indexOf('/bus-checkout/start')>=0){if(j.status==='PAYMENT_REQUIRED'&&j.checkoutUrl)bezig(f,'Door naar betalen...');else if(j.status==='READY_TO_BOOK')bezig(f,'Bijna klaar, je reservering wordt vastgezet...');else if(j.message)melding(f,j.message),klaar(f);}
  else if(j.status==='BOOKED'||j.ok===true){var b=knop(f);var d=document.createElement('div');d.className='bw-gelukt';d.innerHTML='<b>Gelukt, je reservering staat vast!</b><span></span>';d.lastChild.textContent='De bevestiging komt binnen een paar minuten per mail. Tot snel bij Bus Whisky!';if(b){b.style.display='none';b.after(d)}else f.appendChild(d);try{d.scrollIntoView({block:'center',behavior:'smooth'})}catch(e){}}
 }).catch(function(){klaar(f)})}catch(e){}}).catch(function(){klaar(f)})}
 return p};
})();</script>`;
return $input.all().map(it => {
  const j = it.json || {};
  let h = String(j.html || '');
  if (!h || h.indexOf('id="bw-boekstatus-v2"') >= 0) return it;
  h = h.indexOf('</body>') >= 0 ? h.replace('</body>', S + '</body>') : h + S;
  return { json: Object.assign({}, j, { html: h }), pairedItem: it.pairedItem };
});

  };
  S["k6"] = async function ($input, $, DateTime, $vars, $getWorkflowStaticData) {
// 24 nov 2026 (executiebudget): de vrij/vol-check van de rondleiding (16:00, 14:30, extra ronde 17:30) leest de bezetting
// uit widget/r/bez.json op GitHub (elk kwartier gezet door de kwartierbundel T5FN3LHGxTkxIRET) in plaats van een n8n-run.
// 26 nov 2026 plan ronde 2.6: bez.json v2 bevat de bezetting van alle resources, de capaciteit, blokkades en per dienst de
// claimregel-spec (zelfde regels als Bouw claimregels in WbANeOr5sgeu6KGw). Elke publieke beschikbaarheidsvraag
// (/bus-engine-availability) wordt daarmee in de browser beantwoord; de live engine draait alleen nog in de checkout.
// Twijfel (onbekende dienst, geen tijd, blokkade op die dag, bestand ouder dan 1 uur) = de vraag gaat gewoon naar n8n.
const S = '<script id="bw-tourbez">(function(){if(window.__bwTourBez)return;window.__bwTourBez=2;'
 + 'var CODES={"42SA1mn":1,"79BAxWL":1},CAP=24,BEZ=null,LAAD=null;'
 + 'function laad(){if(LAAD)return LAAD;LAAD=fetch("https://raw.githubusercontent.com/dhurkmans716/buswhisky-data/widget-static/widget/r/bez.json?m="+Math.floor(Date.now()/120000),{cache:"no-store"}).then(function(r){return r.ok?r.json():null}).then(function(j){if(j&&j.tour&&Date.now()-Number(j.ts||0)<3600000){BEZ=j;if(j.cap)CAP=Number(j.cap)||24}return BEZ}).catch(function(){return null});return LAAD}'
 + 'function dag(d,n){var x=new Date(d+"T12:00:00Z");x.setUTCDate(x.getUTCDate()+n);return x.toISOString().slice(0,10)}'
 + 'function regels(z,b){var D=z.diensten&&z.diensten[b.service_code];if(!D)return null;var d=String(b.date),t=String(b.time||"").slice(0,5),pax=Math.max(1,Number(b.pax||1)),L=[],i;'
 + 'if(D.dicht)return "dicht";if(pax<(D.min||1)||(D.max&&pax>D.max))return "dicht";'
 + 'var wd=((new Date(d+"T12:00:00Z").getUTCDay()+6)%7)+1;if(D.w&&D.w.length&&D.w.indexOf(wd)<0)return "dicht";'
 + 'if(D.van&&d<D.van)return "dicht";if(D.tot&&d>D.tot)return "dicht";'
 + 'for(i=0;i<(D.bl||[]).length;i++){if(d>=D.bl[i][0]&&d<=D.bl[i][1])return "dicht"}'
 + 'for(i=0;i<(z.blok||[]).length;i++){if(dag(d,Math.max(0,(D.n||1)-1))>=z.blok[i][0]&&d<=z.blok[i][1])return null}'
 + 'var tt=t||D.tv||"",hh=tt.replace(":","");'
 + 'function rest(dd,x){L.push(["RESTAURANT_SECTION_117004",dd+"T"+(String(x)<"16:00"?"12":"18"),pax])}'
 + 'if(D.k==="bnb"){for(i=0;i<(D.n||1);i++)L.push(["BNB",dag(d,i),Math.ceil(pax/2)]);if(D.dt)rest(dag(d,Math.max(0,(D.dd||1)-1)),D.dt)}'
 + 'else if(D.k==="camp")L.push(["CAMP_117018",d,1]);'
 + 'else if(D.k==="rest"){if(!tt)return null;rest(d,tt)}'
 + 'else if(D.k==="tour"||D.k==="gtour"||D.k==="act"){if(!/^[0-9]{4}$/.test(hh))return null;L.push([D.r,d+"T"+hh,pax])}'
 + 'else if(D.k==="event")L.push(["EVENT_SECTION_117013",d,pax]);'
 + 'else return null;return L}'
 + 'function antwoord(z,b){if(!(z&&z.v===2&&z.bez&&z.caps&&z.diensten))return null;var L=regels(z,b);'
 + 'if(L==="dicht")return {ok:false,available:false,action:"READ",reason:"GESLOTEN",bron:"bez.json"};if(!L||!L.length)return null;'
 + 'var free=1e9,ok=true,i;for(i=0;i<L.length;i++){var cap=Number(z.caps[L[i][0]]||0);if(!cap)return null;var bz=Number(z.bez[L[i][0]+"|"+L[i][1]]||0);free=Math.min(free,cap-bz);if(bz+L[i][2]>cap)ok=false}'
 + 'return {ok:true,status:"READ_OK",available:ok,free:free,action:"READ",bron:"bez.json"}}'
 + 'window.__bwBezAntwoord=antwoord;'
 + 'var of=window.fetch;window.fetch=function(u,o){try{var url=String(u&&u.url||u||"");if(url.indexOf("/bus-engine-availability")>=0&&o&&o.body){var b=JSON.parse(String(o.body));if(b&&b.service_code&&/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(String(b.date||""))){var self=this,args=arguments;'
 + 'return laad().then(function(z){if(!z)return of.apply(self,args);var res=null;try{res=antwoord(z,b)}catch(e){res=null}'
 + 'if(!res&&CODES[b.service_code]&&/^[0-9]{2}:[0-9]{2}$/.test(String(b.time||""))){var k=b.date+"T"+String(b.time).replace(":","");var bez=Number(z.tour[k]||0);res={ok:true,status:"READ_OK",available:bez+Number(b.pax||1)<=CAP,free:CAP-bez,bron:"bez.json"}}'
 + 'if(!res)return of.apply(self,args);return new Response(JSON.stringify(res),{status:200,headers:{"Content-Type":"application/json"}})})}}}catch(e){}return of.apply(this,arguments)};laad()})();</script>';
return $input.all().map(it => {
  const j = it.json || {};
  let h = String(j.html || '');
  if (!h || h.indexOf('id="bw-tourbez"') >= 0) return it;
  h = /<head[^>]*>/i.test(h) ? h.replace(/<head([^>]*)>/i, function (m) { return m + S; }) : S + h;
  return { json: Object.assign({}, j, { html: h }), pairedItem: it.pairedItem };
});

  };
  S["k7"] = async function ($input, $, DateTime, $vars, $getWorkflowStaticData) {
// 27 nov 2026: v2 - geen waardebon/betaalmethode bij prijs 0 zonder rondleiding, PLUS-vinkje rondleiding.
// 21 nov 2026 (Dennis, akkoord publiceren betaalmethode): Formitable gaf de betaalmethode mee aan Mollie (89% betaald),
// onze widget niet: elke gast belandde op het keuzescherm van Mollie (45% betaald, 93 van de mislukte zonder methode).
// Dit script zet een keuze iDEAL / Bancontact / Creditcard op 1 regel (22 nov, zoals de webshop) in het reserveer- en cadeaubonformulier (niet bij een
// restauranttafel), stuurt de keuze als method mee naar bus-checkout/start en de cadeaubon, en verstuurt op iPhone al bij
// het loslaten van de vinger op de knop (eerste tik sloot anders alleen het toetsenbord).
const S = String.raw`<script id="bw-betaalmethode-v2">(function(){
if(window.__bwBetaalmethode)return;window.__bwBetaalmethode=true;
var M=[['ideal','iDEAL'],['bancontact','Bancontact'],['creditcard','Creditcard']];
var lang=(document.documentElement.lang||'nl').slice(0,2).toLowerCase();
var KOP={nl:'Betaalmethode',en:'Payment method',de:'Zahlungsart',fr:'Moyen de paiement',es:'Método de pago'}[lang]||'Betaalmethode';
try{window.__bwMethod=sessionStorage.getItem('bw-methode')||'ideal'}catch(e){window.__bwMethod='ideal'}
if(!M.some(function(m){return m[0]===window.__bwMethod}))window.__bwMethod='ideal';
var css=document.createElement('style');css.id='bw-bm-css';
css.textContent='.bw-bm{margin:14px 0 12px}.bw-bm-kop{font-weight:700;font-size:14px;margin:0 0 8px;color:#4a4a4a}.bw-bm-rij{display:flex;flex-wrap:nowrap;gap:8px}.bw-bm button{flex:1 1 0;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding:11px 6px;border:1.5px solid #d9d4ca;border-radius:10px;background:#fff;color:#161616;font-family:inherit;font-weight:600;font-size:14px;line-height:1.2;cursor:pointer;touch-action:manipulation}.bw-bm button[aria-pressed="true"]{background:#161616;color:#fff;border-color:#161616}';
(document.head||document.documentElement).appendChild(css);
function restaurant(){try{var q=new URL(location.href).searchParams;var a=q.get('arrangement')||q.get('service_code')||q.get('service')||'';if(a==='CewjJvV')return true;var c=document.querySelector('.booking-form [name="service_code"],.booking-form [name="arrangement"]');if(c&&c.value==='CewjJvV')return true;var t=document.querySelector('.booking-form');return !!(t&&t.closest('[data-code="CewjJvV"]'))}catch(e){return false}}
function blok(){var d=document.createElement('div');d.className='bw-bm';d.setAttribute('role','group');d.setAttribute('aria-label',KOP);
 var k=document.createElement('div');k.className='bw-bm-kop';k.textContent=KOP;d.appendChild(k);var r=document.createElement('div');r.className='bw-bm-rij';d.appendChild(r);
 M.forEach(function(m){var b=document.createElement('button');b.type='button';b.dataset.m=m[0];b.textContent=m[1];b.setAttribute('aria-pressed',String(window.__bwMethod===m[0]));
  b.addEventListener('click',function(){window.__bwMethod=m[0];try{sessionStorage.setItem('bw-methode',m[0])}catch(e){}document.querySelectorAll('.bw-bm button').forEach(function(x){x.setAttribute('aria-pressed',String(x.dataset.m===m[0]))})});r.appendChild(b)});return d}
// 27 nov 2026 (Dennis): niet vooruit betalen (prijs 0, zoals restaurant en PLUS-actie) = geen waardebon en geen betaalmethode.
// Kiest de gast de rondleiding vooraf (upsell tour), dan wordt er wel betaald en komen beide terug.
function nodig(f){var k=f.closest('[data-code]');var u=f.querySelector('input[name="busUpsell"]');if(u&&u.checked&&f.dataset.busUpsellKind==='tour')return true;if(restaurant())return false;var p=k?Number(k.getAttribute('data-price')):NaN;return !(p===0)}
function plaats(){
 document.querySelectorAll('form.booking-form').forEach(function(f){var s=f.querySelector('button[type=submit]');var bestaat=f.querySelector('.bw-bm');var n=nodig(f);
  var cb=f.querySelector('.credit-box');if(cb){var w=n?'':'none';if(cb.style.display!==w)cb.style.display=w}
  if(!n){if(bestaat)bestaat.remove()}
  else if(s&&!bestaat){var w2=s.closest('div')&&s.parentNode!==f?s.parentNode:s;(w2.parentNode||f).insertBefore(blok(),w2)}});
 var g=document.getElementById('giftForm');
 if(g&&!g.querySelector('.bw-bm')){var gs=[].slice.call(g.querySelectorAll('button[type=submit]')).pop();if(gs){var gw=gs.parentNode!==g?gs.parentNode:gs;(gw.parentNode||g).insertBefore(blok(),gw)}}
}
document.addEventListener('change',function(){setTimeout(plaats,0)},true);
document.addEventListener('click',function(){setTimeout(plaats,0)},true);
setInterval(plaats,800);
var of=window.fetch;
window.fetch=function(u,o){try{var url=String(u&&u.url||u);if(o&&typeof o.body==='string'&&/\/(bus-checkout\/start|bus-booking-widget-preview\/giftcard)(\?|$)/.test(url)){var j=JSON.parse(o.body);if(j&&!j.method){j.method=window.__bwMethod||'ideal';o=Object.assign({},o,{body:JSON.stringify(j)})}}}catch(e){}return of.call(this,u,o)};
// iPhone: de eerste tik op de knop sloot vaak alleen het toetsenbord; de knop schoof weg en de klik viel ernaast.
// Daarom versturen we al bij het loslaten van de vinger op de knop, met een rem tegen dubbel versturen.
var laatste=0;
document.addEventListener('touchend',function(e){var b=e.target&&e.target.closest&&e.target.closest('form.booking-form button[type=submit],#giftForm button[type=submit]');if(!b)return;var f=b.form;if(!f||b.disabled||/bw-bezig/.test(b.className))return;var nu=Date.now();if(nu-laatste<1500){e.preventDefault();return}
 if(typeof f.checkValidity==='function'&&!f.checkValidity())return;laatste=nu;e.preventDefault();try{if(document.activeElement&&document.activeElement.blur)document.activeElement.blur()}catch(x){}
 if(typeof f.requestSubmit==='function')f.requestSubmit(b);else b.click()},{passive:false,capture:true});
document.addEventListener('click',function(e){var b=e.target&&e.target.closest&&e.target.closest('form.booking-form button[type=submit],#giftForm button[type=submit]');if(b&&Date.now()-laatste<1500){e.preventDefault();e.stopImmediatePropagation()}},true);
plaats();
try{new MutationObserver(function(){plaats()}).observe(document.documentElement,{childList:true,subtree:true})}catch(e){}
document.addEventListener('DOMContentLoaded',plaats);
})();
</script>`;
return $input.all().map(it => {
  const j = it.json || {};
  let h = String(j.html || '');
  if (!h || h.indexOf('id="bw-betaalmethode-v2"') >= 0) return it;
  // Met een vooraf gekozen methode stuurt Mollie de gast direct naar de betaalpagina van de methode (pay.ideal.nl,
  // redirect.ppro.com voor Bancontact enz.). De betaallinktoets liet alleen mollie.com toe; de link komt van onze eigen
  // checkout, dus alleen https blijft verplicht.
  h = h.split("throw Error('domein')").join("void 0");
  // 27 nov 2026 (Dennis): PLUS-actie (RE5tMdy) krijgt hetzelfde vinkje als het restaurant: rondleiding om 16:00 vóór het diner.
  h = h.split("if(r.dataset.kind==='restaurant'&&code==='CewjJvV'&&t>='17:30'&&t<='20:00')").join("if(((r.dataset.kind==='restaurant'&&code==='CewjJvV')||code==='RE5tMdy')&&t>='17:30'&&t<='20:00')");
  h = h.split("if(!selected){if(r.dataset.code==='CewjJvV'&&date&&pax)").join("if(!selected){if(['CewjJvV','RE5tMdy'].includes(r.dataset.code)&&date&&pax)");
  h = h.indexOf('</body>') >= 0 ? h.replace('</body>', S + '</body>') : h + S;
  return { json: Object.assign({}, j, { html: h }), pairedItem: it.pairedItem };
});

  };
  S["k8"] = async function ($input, $, DateTime, $vars, $getWorkflowStaticData) {
const S="<script id=\"bw-soft-date-pax-v1\">(function(){\n'use strict';\nif(window.__bwDatePaxSPA)return;\nwindow.__bwDatePaxSPA=true;\nvar nativeNav=window.__bwNav||function(u){location.href=String(u)};\nvar inFlight=null,seq=0,lastGood=new URL(location.href);\nfunction byId(id){return document.getElementById(id)}\nfunction isRelevant(u){\n try{var x=new URL(String(u),location.href),a=new URL(location.href);\n if(x.origin!==a.origin||x.pathname!==a.pathname)return false;\n var fixed=['arrangement','service','service_code','category','type','lang','gift','shop','modal','launcher'];\n if(!fixed.every(function(k){return x.searchParams.get(k)===a.searchParams.get(k)}))return false;\n if((x.searchParams.get('date')||'')===(a.searchParams.get('date')||'')&&(x.searchParams.get('pax')||'')===(a.searchParams.get('pax')||''))return false;\n return !!(byId('date')&&byId('pax')&&byId('cards')&&typeof window.__bwInitCard==='function');\n }catch(e){return false}\n}\nfunction status(message,busy){\n var el=byId('bwSoftStatus');\n if(!el){el=document.createElement('div');el.id='bwSoftStatus';el.setAttribute('role','status');el.style.cssText='font:600 13px Arial,sans-serif;margin:6px 2px;color:#fff;min-height:0';var f=document.querySelector('.filters');if(f&&f.parentNode)f.after(el);else document.body.prepend(el)}\n el.textContent=message||'';document.body.classList.toggle('bw-soft-busy',!!busy);document.body.classList.toggle('bw-laden',!!busy);\n}\nfunction states(){\n var out={};document.querySelectorAll('#cards .card[data-code]').forEach(function(c){var f=c.querySelector('form.booking-form');if(!f)return;var values={};Array.from(f.elements||[]).forEach(function(el){if(!el.name)return;values[el.name]=el.type==='checkbox'?el.checked:el.value});out[c.dataset.code]={values:values,open:f.style.display!=='none'&&getComputedStyle(f).display!=='none'}});\n return out\n}\nfunction applyFormStates(data){\n document.querySelectorAll('#cards .card[data-code]').forEach(function(c){if(typeof window.__bwInitCard==='function')window.__bwInitCard(c);\n var s=data[c.dataset.code],f=c.querySelector('form.booking-form');if(!s||!f)return;\n Array.from(f.elements||[]).forEach(function(el){if(!el.name||!Object.prototype.hasOwnProperty.call(s.values,el.name))return;if(el.type==='checkbox')el.checked=!!s.values[el.name];else el.value=s.values[el.name]});\n if(s.open){f.style.display='block';var b=c.querySelector('button.book[type=button]');if(b)b.style.display='none'}\n });\n}\n\nfunction reserveerKnoppen(doc){\n // 24 nov: SPA-datumwissel vervangt #cards; de overzichtsknop Reserveer (bw-reserveer-js) moet terug.\n if(!document.body.classList.contains('bw-overzicht'))return;\n var NEXT={};try{var sc=doc.getElementById('bw-reserveer-js'),mm=sc&&/var NEXT=(\\{[^}]*\\})/.exec(sc.textContent||'');if(mm)NEXT=JSON.parse(mm[1])}catch(e){}\n document.querySelectorAll('#cards .card[data-code]').forEach(function(c){\n  var body=c.querySelector('.body');if(!body||body.querySelector('.bw-reserveer'))return;\n  var b=document.createElement('button');b.type='button';b.className='bw-reserveer';b.textContent='Reserveer';body.appendChild(b);\n  b.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();\n   var de=byId('date'),k=de&&de.value,code=c.dataset.code;\n   if(c.classList.contains('unavailable')&&NEXT[code])k=NEXT[code];\n   var u=new URL(location.href),pe=byId('pax');u.searchParams.set('arrangement',code);if(pe&&pe.value)u.searchParams.set('pax',pe.value);\n   if(k)u.searchParams.set('date',k);['gekozen','time','choose_date'].forEach(function(x){u.searchParams.delete(x)});u.searchParams.set('intent','1');\n   document.body.classList.add('bw-laden');window.__bwNav(u.toString());\n  });\n });\n}\nfunction commit(html,u,fromHistory){\n var doc=new DOMParser().parseFromString(html,'text/html'),next=doc.getElementById('cards'),cur=byId('cards');\n if(!next||!cur||!next.querySelector('.card[data-code]'))throw Error('ongeldige kaartgegevens');\n var oldCards=new Map(Array.from(cur.querySelectorAll('.card[data-code]')).map(function(c){return[c.dataset.code,c]}));\n var before=states();\n Array.from(next.querySelectorAll('.card[data-code]')).forEach(function(card){\n var previous=oldCards.get(card.dataset.code),oldImg=previous&&previous.querySelector('.media img.photo'),newImg=card.querySelector('.media img.photo');\n if(oldImg&&newImg&&oldImg.getAttribute('src')===newImg.getAttribute('src'))newImg.replaceWith(oldImg);\n });\n cur.replaceChildren(...Array.from(next.childNodes).map(function(n){return document.adoptNode(n)}));\n // Reused original photos have been moved to new nodes only if the nodes are in the current document.\n applyFormStates(before);\n try{reserveerKnoppen(doc)}catch(e){}\n ['pax','date'].forEach(function(id){var field=byId(id),source=doc.getElementById(id);if(field&&source)field.value=source.value});\n var time=byId('time'),freshTime=doc.getElementById('time');\n if(time&&freshTime){var selected=freshTime.value;time.replaceChildren(...Array.from(freshTime.children).map(function(n){return document.importNode(n,true)}));time.value=selected}\n var heading=document.querySelector('.divider'),newHeading=doc.querySelector('.divider');if(heading&&newHeading)heading.textContent=newHeading.textContent;\n var dateTrigger=byId('dateTrigger'),nextTrigger=doc.getElementById('dateTrigger');if(dateTrigger&&nextTrigger)dateTrigger.innerHTML=nextTrigger.innerHTML;\n if(!fromHistory)history.pushState({bwSoftNav:1},'',u.href);lastGood=new URL(u.href);\n try{window.parent.postMessage({source:'bus-booking-widget',type:'BUS_BOOKING_STATE',url:location.href},'*')}catch(e){}\n try{window.BUSBookingWidget?.resize?.()}catch(e){}\n}\nasync function navigate(url,fromHistory){\n var u=new URL(String(url),location.href),n=++seq;\n if(inFlight){try{inFlight.abort()}catch(e){}}\n var controller=new AbortController();inFlight=controller;\n var to=setTimeout(function(){controller.abort()},11000);\n var dateField=byId('date'),paxField=byId('pax'),oldDate=lastGood.searchParams.get('date'),oldPax=lastGood.searchParams.get('pax');\n status('Beschikbaarheid bijwerken…',true);\n try{\n var res=await fetch(u.href,{method:'GET',credentials:'same-origin',signal:controller.signal,headers:{Accept:'text/html'}});\n if(!res.ok)throw Error('HTTP '+res.status);\n var html=await res.text();if(n!==seq)return;\n commit(html,u,fromHistory);status('',false);\n }catch(e){\n if(n!==seq)return;\n if(dateField)dateField.value=oldDate||dateField.defaultValue;\n if(paxField)paxField.value=oldPax||paxField.defaultValue;\n status('Beschikbaarheid kon niet worden vernieuwd. Kies opnieuw een datum of aantal personen.',false);\n }finally{clearTimeout(to);if(n===seq)inFlight=null}\n}\nwindow.__bwNav=function(url){\n if(isRelevant(url)){navigate(url,false);return true}\n return nativeNav(url)\n};\ndocument.addEventListener('change',function(e){\n if(!e.target||!['pax','date'].includes(e.target.id)||!byId('cards')||typeof window.__bwInitCard!=='function')return;\n var u=new URL(location.href),p=byId('pax'),d=byId('date');\n if(!p||!d)return;\n u.searchParams.set('pax',p.value);u.searchParams.set('date',d.value);u.searchParams.delete('time');\n e.stopImmediatePropagation();e.preventDefault();navigate(u,false);\n},true);\ndocument.addEventListener('submit',function(e){if(document.body.classList.contains('bw-soft-busy')&&e.target.closest('#cards')){e.preventDefault();e.stopImmediatePropagation()}},true);\ndocument.addEventListener('click',function(e){\n var day=e.target.closest&&e.target.closest('#busCal .cal-day[data-date]');\n if(day&&!day.disabled&&!day.classList.contains('past')&&!day.classList.contains('disabled')){\n var uDay=new URL(location.href);uDay.searchParams.set('date',day.dataset.date);uDay.searchParams.set('pax',byId('pax')?.value||'2');uDay.searchParams.delete('time');\n e.preventDefault();e.stopImmediatePropagation();window.__bwNav(uDay);return;\n }\n var b=e.target.closest&&e.target.closest('#cards .nextdate');\n if(!b)return;\n // New HTML nodes do not inherit the old per-card click handlers.\n if(b.dataset.date){var u=new URL(location.href);u.searchParams.set('date',b.dataset.date);u.searchParams.set('pax',byId('pax')?.value||'2');e.preventDefault();e.stopImmediatePropagation();window.__bwNav(u)}\n else{var trig=byId('dateTrigger');if(trig){e.preventDefault();e.stopImmediatePropagation();trig.click()}}\n},true);\nwindow.addEventListener('popstate',function(){var u=new URL(location.href);if(u.searchParams.get('date')!==lastGood.searchParams.get('date')||u.searchParams.get('pax')!==lastGood.searchParams.get('pax'))navigate(u,true)});\n})();</script>";
return $input.all().map(function(it){
 const j=it.json||{};let h=String(j.html||'');if(!h)return it;
 if(h.indexOf('id="bw-soft-date-pax-v1"')>=0)return it;
 const start=h.indexOf("<script>(function(){const K='busBookingProfileV2'");
 const end=start>=0?h.indexOf('</script>',start):-1;
 if(start>=0&&end>start){
  let segment=h.slice(start,end);
  const old="document.querySelectorAll('.card').forEach(function(r){";
  const tail="q.disabled=false}})})();";
  if(segment.includes(old)&&segment.includes(tail)){
   segment=segment.replace(old,"function __bwInitCard(r){").replace(tail,'q.disabled=false}};window.__bwInitCard=__bwInitCard;document.querySelectorAll(".card").forEach(__bwInitCard)})();');
   h=h.slice(0,start)+segment+h.slice(end);
  }
 }
 if(h.indexOf('window.__bwInitCard=__bwInitCard')<0)return it;
 return {json:{...j,html:h.replace('</body>',S+'</body>')}};
});
  };
  S["k9"] = async function ($input, $, DateTime, $vars, $getWorkflowStaticData) {
// 26 nov 2026 (Dennis: "vormgeving en customer journey van de widget integraal in de website"). Met ?inline=1 toont de
// widget zich als blok in de pagina (visitbus.nl): geen kop, sluitknop of categoriekeuze, kaarten in een raster, open kaart
// over de volle breedte, hoogte en scrollpositie via postMessage {bwInline:1,h,top} naar de pagina. ?ids=a,b,c toont alleen
// die kaarten (data-id M&E, data-code overige). ?filter=1 (+typen=o:..;m:..;h:..;n:..) toont een filterrij; Lees meer meldt
// {lees:id} aan de pagina (eigen detailpagina); ?detail=1 = een arrangement groot. Zonder inline=1 doet het script NIETS:
// de gewone widget mag door deze inbouw nooit veranderen (Dennis 26 nov). Pure HTML-node, ook in render.js.
const SCRIPT = '<script id="bw-inline-js">' + "(function(){try{\nvar Q=new URLSearchParams(location.search);if(Q.get('inline')!=='1')return;\nvar d=document,R=d.documentElement;R.classList.add('bw-inline');\nvar DET=Q.get('detail')==='1',FIL=Q.get('filter')==='1';if(DET)R.classList.add('bw-inl-detail');\nvar ids=(Q.get('ids')||'').split(',').map(function(s){return s.replace(/[^0-9A-Za-z_-]/g,'')}).filter(Boolean);\nvar TYP={};(Q.get('typen')||'').split(';').forEach(function(p){var a=p.split(':');if(a[0]&&a[1])TYP[a[0]]=a[1].split(',')});\nvar css='html.bw-inline,html.bw-inline body{background:transparent!important;height:auto!important;min-height:0!important;overflow:hidden!important}'\n+'html.bw-inline #busLauncher,html.bw-inline #busModalClose,html.bw-inline .brand,html.bw-inline .bw-powered,html.bw-inline .divider,html.bw-inline label.bw-category,html.bw-inline .bw-dd-list,html.bw-inline #bwScrollHint,html.bw-inline form.filters{display:none!important}'\n+'html.bw-inline main.app{max-width:1200px!important;width:100%!important;margin:0 auto!important;padding:0 0 8px!important;box-sizing:border-box!important;height:auto!important;max-height:none!important;overflow:visible!important}'\n+'html.bw-inline #cards{display:grid!important;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:24px;align-items:stretch!important;overflow:visible!important;height:auto!important;max-height:none!important}'\n+'html.bw-inline.bw-inl-heeftopen #cards{align-items:start!important}'\n+'html.bw-inline #cards>.card{margin:0!important;width:auto!important;max-width:none!important;display:flex!important;flex-direction:column!important}'\n+'html.bw-inline #cards>.card>.body{display:flex!important;flex-direction:column!important;flex:1 1 auto!important}'\n+'html.bw-inline #cards>.card .bw-me-more{margin:auto 0 8px!important;display:block!important;width:100%!important;box-sizing:border-box!important;background:#C68828!important;color:#fff!important;border:0!important;border-radius:7px!important;padding:13px 8px!important;font-size:16px!important;font-weight:800!important;text-decoration:none!important;cursor:pointer!important;line-height:1.2!important}'\n+'html.bw-inline #cards>.card .bw-me-more:hover{background:#B07722!important}'\n+'html.bw-inl-detail #cards{grid-template-columns:1fr!important;max-width:820px!important;margin:0 auto!important}html.bw-inl-detail #cards>.card .bw-me-more{display:none!important}html.bw-inl-detail #cards>.card .bw-me-detail{margin-top:auto}'\n+'html.bw-inline #cards>.card.bw-inl-weg{display:none!important}'\n+'.bw-inl-fil{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px;background:#fff;border:1px solid #e4ddd0;border-radius:10px;padding:12px;margin:0 0 20px;font:14px/1.3 -apple-system,BlinkMacSystemFont,\"Segoe UI\",Roboto,sans-serif;color:#1d1d1b}'\n+'.bw-inl-fil label{display:flex;flex-direction:column;gap:4px;font-size:12px;font-weight:700;color:#6b6457}'\n+'.bw-inl-fil select,.bw-inl-fil input{width:100%;box-sizing:border-box;height:42px;border:1px solid #d9d2c4;border-radius:7px;padding:0 10px;font-size:15px;color:#1d1d1b;background:#fff;-webkit-appearance:none;appearance:none}'\n+'.bw-inl-fil select{background-image:linear-gradient(45deg,transparent 50%,#6b6457 50%),linear-gradient(135deg,#6b6457 50%,transparent 50%);background-position:calc(100% - 16px) 18px,calc(100% - 11px) 18px;background-size:5px 5px;background-repeat:no-repeat;padding-right:28px}'\n+'.bw-inl-tel{grid-column:1/-1;display:flex;justify-content:space-between;align-items:center;font-size:13px;color:#6b6457}.bw-inl-tel button{background:none;border:0;color:#C68828;font-weight:700;cursor:pointer;font-size:13px;padding:0}'\n+'.bw-inl-leeg{grid-column:1/-1;text-align:center;padding:28px;color:#6b6457;font:15px -apple-system,BlinkMacSystemFont,\"Segoe UI\",Roboto,sans-serif}'\n+'@media(max-width:700px){html.bw-inline #cards{grid-template-columns:1fr;gap:16px}.bw-inl-fil{grid-template-columns:1fr 1fr}}';\nif(ids.length)css+='html.bw-inline #cards>.card'+ids.map(function(i){return ':not([data-id=\"'+i+'\"]):not([data-code=\"'+i+'\"])'}).join('')+'{display:none!important}';\nvar st=d.createElement('style');st.id='bw-inline-css';st.textContent=css;(d.head||R).appendChild(st);\nvar P=window.parent,lastH=0;\nfunction hoogte(){var a=d.querySelector('main.app')||d.body;var r=a.getBoundingClientRect();return Math.ceil(r.bottom+(window.scrollY||0))+16}\nfunction meld(extra){var h=hoogte();if(!extra&&Math.abs(h-lastH)<2)return;lastH=h;try{P.postMessage(Object.assign({bwInline:1,h:h},extra||{}),'*')}catch(e){}}\nfunction zichtbaar(x){return x&&!x.hidden&&x.offsetParent!==null}\nfunction idVan(c){return c.getAttribute('data-id')||c.getAttribute('data-code')||''}\n// Lees meer opent een eigen pagina met alle informatie (Dennis 26 nov), geen uitgevouwen tegel.\nif(!DET)d.addEventListener('click',function(e){var b=e.target&&e.target.closest&&e.target.closest('.bw-me-more');if(!b)return;var c=b.closest('.card');if(!c)return;e.preventDefault();e.stopImmediatePropagation();meld({lees:idVan(c)})},true);\n// Filterrij (prijs, type, seizoen, personen), alleen met ?filter=1.\nvar F=null,MND={jan:1,feb:2,mrt:3,maa:3,apr:4,mei:5,jun:6,jul:7,aug:8,sep:9,okt:10,nov:11,dec:12};\nfunction num(s){s=String(s||'').replace(/[^0-9,.]/g,'').replace(/\\.(?=\\d{3}(\\D|$))/g,'').replace(',','.');var n=parseFloat(s);return isNaN(n)?0:n}\nfunction info(c){var pr=num((c.querySelector('.price .now')||c.querySelector('.price')||{}).textContent);var mi=c.querySelectorAll('.bw-min .mi'),pp=(mi[0]&&mi[0].textContent)||'',sz=((mi[1]&&mi[1].textContent)||'').toLowerCase();var m=pp.match(/(\\d+)\\D+(\\d+)/),m1=pp.match(/(\\d+)/);var min=m?+m[1]:(m1?+m1[1]:1),max=m?+m[2]:0;\n var mnd=null;if(sz.indexOf('jaarrond')<0){var r=sz.match(/([a-z]{3})[a-z]*\\.?\\s*-\\s*\\d*\\s*([a-z]{3})/);if(r&&MND[r[1]]&&MND[r[2]]){var a=MND[r[1]],z=MND[r[2]];mnd=[];for(var k=a;;k=k%12+1){mnd.push(k);if(k===z)break}}}\n return {pr:pr,min:min,max:max,mnd:mnd}}\nfunction opt(v,t){return '<option value=\"'+v+'\">'+t+'</option>'}\nfunction bouwFilter(){if(!FIL||F)return;var cards=d.getElementById('cards');if(!cards||!cards.querySelector('.card'))return;F=d.createElement('div');F.className='bw-inl-fil';\n var h='<label>Prijs p.p.<select data-f=\"prijs\">'+opt('','Alle prijzen')+opt('0-100','Tot € 100')+opt('100-150','€ 100 tot € 150')+opt('150-250','€ 150 tot € 250')+opt('250-99999','Vanaf € 250')+'</select></label>';\n var heeft=function(k){return TYP[k]&&(!ids.length||TYP[k].some(function(x){return ids.indexOf(x)>=0}))};var TN={o:'Ochtend, lunch en middag',m:'Middag en avond',h:'Hele dag',n:'Met overnachting'},to='';['o','m','h','n'].forEach(function(k){if(heeft(k))to+=opt(k,TN[k])});\n if(to)h+='<label>Type<select data-f=\"type\">'+opt('','Alle typen')+to+'</select></label>';\n h+='<label>Seizoen<select data-f=\"seizoen\">'+opt('','Alle seizoenen')+opt('jaar','Hele jaar')+opt('zomer','Zomer')+opt('winter','Winter')+'</select></label>';\n h+='<label>Aantal personen<input data-f=\"pax\" type=\"number\" inputmode=\"numeric\" min=\"1\" placeholder=\"Bijv. 25\"></label>';\n h+='<div class=\"bw-inl-tel\"><span class=\"bw-inl-n\"></span><button type=\"button\" data-f=\"wis\">Wis filters</button></div>';\n F.innerHTML=h;cards.parentNode.insertBefore(F,cards);\n F.addEventListener('input',pas);F.addEventListener('change',pas);F.querySelector('[data-f=\"wis\"]').addEventListener('click',function(){F.querySelectorAll('select,input').forEach(function(x){x.value=''});pas()});pas()}\nfunction val(k){var x=F&&F.querySelector('[data-f=\"'+k+'\"]');return x?x.value:''}\nfunction pas(){if(!F)return;var pr=val('prijs').split('-'),ty=val('type'),sz=val('seizoen'),pax=parseInt(val('pax'),10)||0;var n=0,cards=d.querySelectorAll('#cards>.card');\n cards.forEach(function(c){var id=idVan(c);if(ids.length&&ids.indexOf(id)<0)return;var i=info(c),ok=true;\n  if(pr.length===2&&i.pr&&(i.pr<+pr[0]||i.pr>=+pr[1]))ok=false;\n  if(ok&&ty&&TYP[ty]&&TYP[ty].indexOf(id)<0)ok=false;\n  if(ok&&sz){if(sz==='jaar'&&i.mnd)ok=false;if(sz==='zomer'&&i.mnd&&i.mnd.indexOf(7)<0)ok=false;if(sz==='winter'&&i.mnd&&i.mnd.indexOf(1)<0)ok=false}\n  if(ok&&pax&&(pax<i.min||(i.max&&pax>i.max)))ok=false;\n  c.classList.toggle('bw-inl-weg',!ok);if(ok)n++});\n var L=d.querySelector('#cards>.bw-inl-leeg');if(!n){if(!L){L=d.createElement('div');L.className='bw-inl-leeg';L.textContent='Pas een filter aan voor meer uitjes, of vraag ons om een voorstel op maat.';d.getElementById('cards').appendChild(L)}}else if(L)L.remove();\n var t=F.querySelector('.bw-inl-n');if(t)t.textContent=n===1?'1 uitje':n+' uitjes';meld()}\nfunction markeer(){bouwFilter();var open=null;d.querySelectorAll('#cards>.card').forEach(function(c){var el=[].filter.call(c.querySelectorAll('form.bw-me-form,.booking-form,input[name=\"first_name\"],input[name=\"email\"]'),zichtbaar)[0],f=!!el;if(f&&!c.__bwOpen)open=el;c.__bwOpen=f});\n var any=[].some.call(d.querySelectorAll('#cards>.card form.bw-me-form,#cards>.card .bw-me-detail,#cards>.card .booking-form'),zichtbaar);if(R.classList.contains('bw-inl-heeftopen')!==any)R.classList.toggle('bw-inl-heeftopen',any);\n if(open){meld({top:Math.max(0,Math.round(open.getBoundingClientRect().top+(window.scrollY||0))-70)})}else meld()}\nvar t=0;function plan(){clearTimeout(t);t=setTimeout(markeer,80)}\ntry{new MutationObserver(function(){plan();if(F)setTimeout(pas,90)}).observe(d.body,{subtree:true,childList:true,attributes:true,attributeFilter:['hidden','style']})}catch(e){}\ntry{new ResizeObserver(function(){meld()}).observe(d.querySelector('main.app')||d.body)}catch(e){}\nd.addEventListener('click',function(){plan();setTimeout(markeer,500);setTimeout(markeer,1200)},true);window.addEventListener('load',function(){markeer();meld({klaar:1})});setInterval(meld,1500);if(FIL){var tri=0,ivF=setInterval(function(){if(F||++tri>60)clearInterval(ivF);else markeer()},500)}markeer();meld({klaar:1});\n}catch(e){}})();\n" + '</script>';
return $input.all().map(function (it) {
  const j = it.json || {}; const h = String(j.html || '');
  if (!h || h.indexOf('id="bw-inline-js"') >= 0 || h.indexOf('</body>') < 0) return it;
  const i = h.lastIndexOf('</body>');
  return { json: Object.assign({}, j, { html: h.slice(0, i) + SCRIPT + h.slice(i) }), pairedItem: it.pairedItem };
});

  };
  S["k10"] = async function ($input, $, DateTime, $vars, $getWorkflowStaticData) {
// 26 nov 2026 (Dennis: B&B weekendarrangementen inline op visitbus.nl/weekendje-weg). Alleen met ?inline=1:
// - tegels gecentreerd (ook bij 1 of 2 arrangementen, bv. Camping Culinair);
// - met ?ids= (een selectie, zoals rondleidingen of workshops) geen cadeaubonblok onder de tegels;
// - met een gekozen arrangement (Reserveer laadt ?arrangement=..) zonder detail=1: kaart in een kolom in het midden,
//   datum/personen weer zichtbaar, link terug naar alle arrangementen en de pagina scrollt naar boven.
// Zonder inline=1 doet dit NIETS (pop-up blijft gelijk).
const SCRIPT = '<script id="bw-inline-arr-js">(function(){try{var Q=new URLSearchParams(location.search);if(Q.get("inline")!=="1")return;var d=document,R=d.documentElement;'
 + 'var sg=d.createElement("style");sg.textContent="@media(min-width:701px){html.bw-inline:not(.bw-inl-detail) #cards{grid-template-columns:repeat(auto-fit,minmax(300px,380px))!important;justify-content:center!important}}"+(Q.get("ids")?"html.bw-inline #giftBuy{display:none!important}":"");(d.head||R).appendChild(sg);'
 + 'if(Q.get("detail")==="1"||!Q.get("arrangement"))return;'
 + 'R.classList.add("bw-inl-detail","bw-inl-arr");'
 + 'var st=d.createElement("style");st.textContent="html.bw-inl-arr form.filters{display:block!important;max-width:820px!important;margin:0 auto 16px!important}html.bw-inl-arr label.bw-category{display:none!important}.bw-inl-terug{display:block;max-width:820px;margin:0 auto 12px;font:700 15px -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;color:#C68828;text-decoration:none}";(d.head||R).appendChild(st);'
 + 'function zet(){if(d.querySelector(".bw-inl-terug"))return;var ap=d.querySelector("main.app");if(!ap)return;var u=new URL(location.href);["arrangement","date","pax","time","intent"].forEach(function(k){u.searchParams.delete(k)});var a=d.createElement("a");a.className="bw-inl-terug";a.href=u.toString();a.textContent="\\u2190 Alle arrangementen";ap.insertBefore(a,ap.firstChild)}'
 + 'function top(){try{var a=d.querySelector("main.app")||d.body;var h=Math.ceil(a.getBoundingClientRect().bottom+(window.scrollY||0))+16;window.parent.postMessage({bwInline:1,h:h,top:0},"*")}catch(e){}}'
 + 'zet();setTimeout(function(){zet();top()},300);window.addEventListener("load",function(){zet();top()})}catch(e){}})();</script>';
return $input.all().map(function (it) {
  const j = it.json || {}; const h = String(j.html || '');
  if (!h || h.indexOf('id="bw-inline-arr-js"') >= 0 || h.indexOf('</body>') < 0) return it;
  const i = h.lastIndexOf('</body>');
  return { json: Object.assign({}, j, { html: h.slice(0, i) + SCRIPT + h.slice(i) }), pairedItem: it.pairedItem };
});

  };
  S["k11"] = async function ($input, $, DateTime, $vars, $getWorkflowStaticData) {
// 24 nov 2026 (casus Michelle Witlox, test Claude): bij een deeplink staat het blok datum/personen/tijd IN de kaart
// (bw-arr-eerst-js). De SPA-datumwissel verving #cards en gooide dat blok weg: na een andere datum geen kalender meer.
// Deze node past de SPA-commit aan: blok losmaken, kaarten vervangen, blok terugzetten in de nieuwe kaart.
const OLD="cur.replaceChildren(...Array.from(next.childNodes).map(function(n){return document.adoptNode(n)}));";
const NEW="var filt=cur.querySelector('form.filters');if(filt)filt.remove();cur.replaceChildren(...Array.from(next.childNodes).map(function(n){return document.adoptNode(n)}));if(filt){var nc=cur.querySelector('.card[data-code]'),nb=nc&&nc.querySelector('.body');if(nb){var desc=nb.querySelector('.arrangement-description')||nb.querySelector('p'),anker=desc||nb.querySelector('h2');if(anker&&anker.parentNode===nb)anker.after(filt);else nb.insertBefore(filt,nb.firstChild);if(desc&&desc.scrollHeight>150&&!nb.querySelector('.bw-meer')){var mb=document.createElement('button');mb.type='button';mb.className='bw-meer';mb.textContent='Lees minder';mb.setAttribute('aria-expanded','true');mb.addEventListener('click',function(){var dicht=desc.classList.toggle('bw-ingeklapt');mb.textContent=dicht?'Lees meer':'Lees minder';mb.setAttribute('aria-expanded',dicht?'false':'true')});desc.after(mb)}}else cur.parentNode.insertBefore(filt,cur)}";
return $input.all().map(function(it){const j=it.json||{};let h=String(j.html||'');
 if(!h||h.indexOf('bw-soft-date-pax-v1')<0||h.indexOf(NEW)>=0||h.indexOf(OLD)<0)return it;
 return {json:Object.assign({},j,{html:h.replace(OLD,function(){return NEW})}),pairedItem:it.pairedItem};
});

  };
  var KETEN = ["k0","k1","k2","k3","k4","k5","k6","k7","k8","k9","k10","k11"];
  var NAMEN = ["Bouw preview","Fanprijs zichtbaar 10 nov","Actiecodes breder (26 nov)","Telemetrie bundelen (21 nov)","Geen tweede Reserveer (19 nov)","Boekstatus zichtbaar (21 nov)","Tourbezetting statisch (24 nov)","Betaalmethode en eerste tik (21 nov)","BUS SPA datum en personen v1","Inline weergave (26 nov)","Inline arrangement (26 nov)","SPA filterblok behouden (24 nov)"];
  var NAVKOP = function(h){h=String(h||'');if(h.indexOf('id="bw-nav-head"')<0){h=h.replace(/location\.href=u(\.toString\(\))?(?=[})])/g,function(m,t){return '(window.__bwNav||function(x){location.href=x})(u'+(t||'')+')'});h=h.replace(/<head([^>]*)>/i,function(m){return m+'<script id="bw-nav-head">window.__bwNav=function(u){try{if(window.parent!==window&&parent.__busWidgetNaar&&parent.__busWidgetNaar(String(u),window))return}catch(e){}location.href=u};<\/script>'})}return h};
  var INTERN = ["3EzdLfy","QroaBzE"];

  var ME = ['bedrijfsuitjes', 'vergaderingen', 'bruiloften'];
  var RESTAURANT = ['CewjJvV', '4cSbXnj'];
  function items(a) { return (Array.isArray(a) ? a : [a]).filter(function (x) { return x != null; }).map(function (x) { return (x && typeof x === 'object' && 'json' in x) ? x : { json: x }; }); }
  function mk(it) { return { first: function () { return it[0]; }, last: function () { return it[it.length - 1]; }, all: function () { return it; }, item: it[0], isExecuted: true }; }
  // Geeft de HTML zoals n8n hem zou serveren, of null als deze pagina via n8n moet (live tijden, onbekend arrangement).
  G.__bwRenderWidget = async function (query, snapshot, DateTime) {
    var q = {}; Object.keys(query || {}).forEach(function (k) { q[k] = String(query[k]); });
    var code = String(q.arrangement || q.service_code || q.service || '').trim();
    if (RESTAURANT.indexOf(code) >= 0) return null;
    var cat = String(q.category || q.type || '').toLowerCase();
    var namen = { 'GET BUS Booking Widget': items({ query: q, headers: {}, params: {}, body: {} }) };
    var $ = function (n) { if (!namen[n]) throw new Error('Node ' + n + ' niet beschikbaar in de browser'); return mk(namen[n]); };
    var $vars = { BUS_ENGINE_LIVE: 'true' };
    var zelf = { helpers: { httpRequest: function () { return Promise.reject(new Error('geen server in de browser')); } } };
    var gwsd = function () { return {}; };
    var invoer;
    if (ME.indexOf(cat) >= 0) invoer = { __cacheKey: '__me__' + cat, __hit: true, __data: { ok: true, experiences: [] } };
    else {
      var rows = (snapshot && Array.isArray(snapshot.experiences) ? snapshot.experiences : []).filter(function (s) { return s && s.engine && INTERN.indexOf(String(s.service_code || '')) < 0 && !/alleen intern te boeken/i.test(String(s.description || '')); });
      var ex = code ? rows.filter(function (s) { return String(s.service_code) === code; }) : rows.filter(function (s) { return s.engine.promoted === true; });
      if (!snapshot || snapshot.ok !== true || !ex.length) return null;
      invoer = { ok: true, source: 'BUS_WIDGET_SNAPSHOT', locale: String(q.lang || 'nl'), experiences: ex, count: ex.length };
    }
    var it = items(await S.engine.call(zelf, mk(items(invoer)), $, DateTime, $vars, gwsd));
    namen['BUS Engine services'] = it;
    for (var i = 0; i < KETEN.length; i++) {
      it = items(await S[KETEN[i]].call(zelf, mk(it), $, DateTime, $vars, gwsd));
      namen[NAMEN[i]] = it;
    }
    var html = it[0] && it[0].json && it[0].json.html;
    if (!html || String(html).length < 1000) return null;
    return NAVKOP(String(html));
  };
  G.__bwRenderWidgetVersie = "2470bc17-2273-439e-b21f-7543e9f5b64b";
})(typeof window !== 'undefined' ? window : globalThis);

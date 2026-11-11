// BUS Whisky website-chatbot. Bron: github.com/dhurkmans716/buswhisky-data/chat/bus-chat.js
// Wordt op buswhisky.com geladen met EEN regel: <script type="module" src="https://cdn.jsdelivr.net/gh/dhurkmans716/buswhisky-data@main/chat/bus-chat.js"></script>
// Aanpassen via n8n-hulptool "BUS Chatwidget publiceren"; de website hoeft daarvoor niet te veranderen.
// Chatmodule dynamisch laden (31 okt 2026): de rest van dit bestand draait meteen, ook als de module nog onderweg is.
var createChat = null;
// Buildnummer: de reserveerwidget-iframe (n8n) vergelijkt dit en laadt deze kern opnieuw in een pagina met een verouderde gecachete versie.
window.__busBuild = Math.max(window.__busBuild || 0, 2026111103);
// Leeftijdscheck + cookiekeuze: eigen module BUS_AGECHECK_CONSENT_V5 (4 nov 2026). Ook hier laden voor bezoekers met een oude gecachete lader.
import('https://cdn.jsdelivr.net/gh/dhurkmans716/buswhisky-data@61a3b3f1/chat/bus-agegate.js').catch(function (e) { console.error('[BUS] agecheck vaste versie mislukt, @main laden', e); return import('https://cdn.jsdelivr.net/gh/dhurkmans716/buswhisky-data@main/chat/bus-agegate.js?v=' + Math.floor(Date.now() / 600000)); }).catch(function (e) { console.error('[BUS] agecheck laden mislukt', e); });
var __busChatModule = import('https://cdn.jsdelivr.net/npm/@n8n/chat@1.44.7/dist/chat.bundle.es.js').then(function (m) { createChat = m.createChat; });

// === EERSTE TIK OP RESERVEREN/CADEAUBON OP MOBIEL (Dennis 31 okt 2026) ===
// app.js laadt bij pointerenter de widget alvast voor. Op een aanraakscherm verandert de pagina dan precies
// onder de vinger, waardoor iOS de eerste tik als hover ziet en geen klik geeft (pas de tweede tik opende).
// Op touch slaan we dat voorladen over; de klik laadt de widget zelf.
(function () {
  if (window.__busGeenTouchVoorladen) return;
  window.__busGeenTouchVoorladen = true;
  // Sinds 9 nov 2026 ook voor muis, behalve als de statische widgetkopie vers is (zie WIDGET ZONDER N8N-RUN).
  document.addEventListener('pointerenter', function (e) {
    // Muis: voorladen mag weer zodra de statische kopie vers is, want dan kost het geen n8n-run.
    if (e.pointerType === 'mouse' && window.__busWidgetVers && window.__busWidgetVers()) return;
    var t = e.target;
    if (t && t.closest && t.closest('[data-booking-widget-open]')) e.stopImmediatePropagation();
  }, true);
})();
// === WIDGET ZONDER N8N-RUN (Dennis 9 nov 2026: "wel de lusten, niet de lasten") ===
// De kale widget (nog geen categorie, arrangement of datum gekozen) en de webshop (flesknop, shop=1) komen uit een statische
// kopie die de kwartierbundel in n8n elk kwartier op GitHub zet (branch widget-static). Voorladen en klikken kosten dan geen n8n-run.
// Is de kopie er niet of ouder dan 2 uur, dan gaat alles zoals altijd via n8n (Guestplan controleert de tijd bij het boeken opnieuw).
(function () {
  if (window.__busWidgetStatisch) return;
  window.__busWidgetStatisch = true;
  var BRON = window.__busWidgetBron || 'https://raw.githubusercontent.com/dhurkmans716/buswhisky-data/widget-static/widget/';
  // 11 nov 2026: 's nachts (21-07 uur) publiceert de kwartierbundel niet; dan mag de laatste kopie van de avond blijven gelden.
  var MAX = (function () { var h = new Date().getUTCHours(); return (h >= 20 || h < 7) ? 11 * 60 : 120; })() * 60000;
  var VERBODEN = ['category', 'type', 'arrangement', 'service_code', 'service', 'pax', 'date', 'diag', 'code', 'giftcard', 'fz', 'actie', 'product', 'besteld', 'shopfout', 'nr', 'msg', 'time', 'choose_date'];
  var kopie = {}, vers = {};
  function paginaTaal() { return 'nl'; }
  // === FASE 2 (Dennis 11 nov 2026): elke widgetpagina die n8n de afgelopen 25 minuten heeft opgebouwd (deeplink, datum,
  // personen, categorie) staat als statische kopie op GitHub (map k/, index k/index.json). Bestaat er een verse kopie voor
  // precies deze sleutel, dan komt de pagina daarvandaan en kost hij geen n8n-run. Anders gaat alles zoals altijd via n8n.
  // Aan/uit: localStorage bw-fase2 = 1 of 0 overschrijft window.__busFase2Standaard.
  function FASE2() { try { var v = localStorage.getItem('bw-fase2'); if (v === '1') return true; if (v === '0') return false; } catch (e) {} return window.__busFase2Standaard === true; }
  var SLEUTELS = ['category', 'type', 'lang', 'arrangement', 'service_code', 'service', 'gift', 'shop', 'pax', 'date', 'launcher', 'modal'];
  function fnvK(s) { var h = 0x811c9dc5; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; } return h.toString(16); }
  function sleutelVan(u) { return SLEUTELS.map(function (k) { var v = u.searchParams.get(k); return k + '=' + (v == null ? '' : v); }).join('&'); }
  function algemeen(u) { if (!FASE2()) return null; return { url: u.pathname + u.search, l: 'k:' + fnvK(sleutelVan(u)) }; }
  // Overdag hooguit 45 minuten oud (de kwartierbundel ververst elk kwartier), 's nachts (21-07 uur) geldt de stand van de avond.
  function maxK() { var h = new Date().getUTCHours(); return (h >= 20 || h < 7) ? 11 * 3600000 : 45 * 60000; }
  var kIdx = null, kIdxT = 0, kKop = {};
  function kIndex() {
    if (!kIdx || Date.now() - kIdxT > 300000) {
      kIdxT = Date.now();
      kIdx = fetch(BRON + 'k/index.json', { cache: 'no-cache', credentials: 'omit' })
        .then(function (r) { return r.ok ? r.json() : {}; })
        .catch(function () { kIdx = null; return {}; });
    }
    return kIdx;
  }
  function haalK(h) {
    return kIndex().then(function (ix) {
      var t = Number((ix && ix[h]) || 0);
      if (!t || Date.now() - t > maxK()) return null;
      if (!kKop[h] || kKop[h].t !== t) {
        kKop[h] = { t: t, p: fetch(BRON + 'k/' + h + '.json', { cache: 'no-cache', credentials: 'omit' })
          .then(function (r) { return r.ok ? r.json() : null; })
          .catch(function () { return null; }) };
      }
      return kKop[h].p.then(function (j) { return (j && j.html && j.html.length > 1000 && Date.now() - Number(j.ts) < maxK()) ? j : null; });
    });
  }
  // De kale widget is voor alle talen dezelfde HTML (de vertaling gebeurt in de widget zelf, op basis van het pad).
  // Alleen een expliciete lang-parameter geeft andere HTML; die gaat gewoon via n8n.
  function taalVan(u) { var l = (u.searchParams.get('lang') || '').toLowerCase(); return (!l || l === 'nl') ? 'nl' : null; }
  function haal(l) {
    if (String(l).indexOf('k:') === 0) return haalK(String(l).slice(2));
    if (!kopie[l]) {
      kopie[l] = fetch(BRON + l + '.json', { cache: 'no-cache', credentials: 'omit' })
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (j) { var ok = !!(j && j.html && j.html.length > 1000 && Date.now() - Number(j.ts) < MAX); vers[l] = ok; if (!ok) kopie[l] = null; return ok ? j : null; })
        .catch(function () { vers[l] = false; kopie[l] = null; return null; });
    }
    return kopie[l];
  }
  // Productlijst van de webshop (anders een run op /webhook/bus-me-widget/shop bij elke opening). Mag 6 uur oud zijn:
  // voorraad en prijs worden bij het afrekenen in Driver toch opnieuw gecontroleerd.
  var shopData = null;
  function haalData() {
    if (!shopData) {
      shopData = fetch(BRON + 'shopdata-nl.json', { cache: 'no-cache', credentials: 'omit' })
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (j) { if (!(j && j.data && j.data.products && j.data.products.length && Date.now() - Number(j.ts) < 6 * 3600000)) { shopData = null; return null; } return j.data; })
        .catch(function () { shopData = null; return null; });
    }
    return shopData;
  }
  window.__busWidgetVers = function () { var l = paginaTaal(); if (vers[l] === undefined) haal(l); return vers[l] === true; };
  function geschikt(v) {
    try {
      var u = new URL(v, location.href);
      if (u.origin !== location.origin || !/\/reserveren\/widget\/?$/.test(u.pathname)) return null;
      if (u.searchParams.get('modal') !== '1' || u.searchParams.get('launcher') !== '0') return algemeen(u);
      for (var i = 0; i < VERBODEN.length; i++) if (u.searchParams.has(VERBODEN[i])) return algemeen(u);
      var shop = u.searchParams.get('shop');
      if (shop && shop !== '1') return algemeen(u);
      // intent hoort alleen bij de webshop (voorkomt dichtklappen bij voorladen); bij de gewone widget is het een deeplink.
      if (!shop && u.searchParams.has('intent')) return algemeen(u);
      if (!taalVan(u)) return algemeen(u);
      return { url: u.pathname + u.search, l: shop ? 'shop' : 'nl' };
    } catch (e) { return null; }
  }
  function haak(ifr) {
    if (!ifr || ifr.__busHaak) return;
    var d = Object.getOwnPropertyDescriptor(HTMLIFrameElement.prototype, 'src');
    if (!d || !d.set) return;
    ifr.__busHaak = true;
    // Bij een statische pagina blijft het echte src-attribuut staan; code die getAttribute('src') leest ziet de virtuele URL (11 nov 2026).
    var gaSrc = ifr.getAttribute;
    ifr.getAttribute = function (n) { if (String(n).toLowerCase() === 'src' && ifr.__busVirtSrc != null) return ifr.__busVirtSrc; return gaSrc.apply(ifr, arguments); };
    var beurt = 0;
    function echt(v) { ifr.__busVirtSrc = null; d.set.call(ifr, v); }
    function schrijf(url, html, data) {
      ifr.__busVirtSrc = url; // statische pagina: voor de rest van de site (boeklinks, app.js) staat de iframe op deze URL
      var w = ifr.contentWindow, doc = w.document, geladen = false;
      var lt = function () { geladen = true; };
      ifr.addEventListener('load', lt, { once: true });
      doc.open();
      try { w.history.replaceState(null, '', url); } catch (e) {}
      if (data) {
        try {
          var of = w.fetch;
          w.fetch = function (u) {
            try { if (/\/webhook\/bus-me-widget\/shop\?lang=nl$/.test(String((u && u.url) || u))) return Promise.resolve(new w.Response(JSON.stringify(data), { status: 200, headers: { 'Content-Type': 'application/json' } })); } catch (e) {}
            return of.apply(this, arguments);
          };
        } catch (e) {}
      }
      doc.write(html);
      doc.close();
      ifr.__busGeschreven = true;
      setTimeout(function () { if (!geladen) { ifr.removeEventListener('load', lt); ifr.dispatchEvent(new Event('load')); } }, 60);
    }
    Object.defineProperty(ifr, 'src', {
      configurable: true, enumerable: true,
      get: function () { return ifr.__busVirtSrc != null ? new URL(ifr.__busVirtSrc, location.href).href : d.get.call(ifr); },
      set: function (v) {
        var mijn = ++beurt;
        var g = geschikt(v);
        if (!g) { echt(v); return; }
        Promise.all([haal(g.l), g.l === 'shop' ? haalData() : null]).then(function (r) {
          var j = r[0], data = r[1];
          if (mijn !== beurt) return;
          if (!j) { echt(v); return; }
          var leeg = false;
          try { leeg = !ifr.__busGeschreven && ifr.contentWindow.location.href === 'about:blank'; } catch (e) {}
          if (leeg) { schrijf(g.url, j.html, data); return; }
          // Vers venster nodig (anders blijven oude scriptvariabelen staan): eerst naar about:blank.
          ifr.addEventListener('load', function opBlank() {
            var nu = ''; try { nu = ifr.contentWindow.location.href; } catch (e) {}
            if (nu !== 'about:blank') return;
            ifr.removeEventListener('load', opBlank);
            if (mijn !== beurt) return;
            ifr.__busGeschreven = false;
            schrijf(g.url, j.html, data);
          });
          echt('about:blank');
        });
      }
    });
  }
  window.__busHaakIframe = haak;
  // Navigatie binnen de widget (datum, personen, arrangement, categorie) komt via window.__bwNav in de widgetpagina hier binnen,
  // zodat ook die stap eerst de statische kopie probeert. Geeft false als dat niet kan; dan navigeert de widget zelf.
  window.__busWidgetNaar = function (url, win) {
    if (!FASE2()) return false;
    var l = document.querySelectorAll('iframe'), ifr = null;
    for (var i = 0; i < l.length; i++) { try { if (l[i].contentWindow === win) { ifr = l[i]; break; } } catch (e) {} }
    if (!ifr || !ifr.__busHaak) return false;
    try { ifr.src = new URL(url, win.location.href).href; return true; } catch (e) { return false; }
  };
  function start(p) {
    var host = document.getElementById('booking-widget');
    var ifr = host && host.querySelector('iframe');
    if (!ifr) { if ((p || 0) < 40) setTimeout(function () { start((p || 0) + 1); }, 250); return; }
    haak(ifr);
    try { if (navigator.connection && navigator.connection.saveData) return; } catch (e) {}
    var go = function () { haal(paginaTaal()); haal('shop'); haalData(); if (FASE2()) kIndex(); };
    if (window.requestIdleCallback) requestIdleCallback(go, { timeout: 4000 }); else setTimeout(go, 1500);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { start(0); }); else start(0);
})();
if (!window.__busChatGeladen) {
window.__busChatGeladen = true;
(function () {
  var l = document.createElement('link'); l.rel = 'stylesheet'; l.href = 'https://cdn.jsdelivr.net/npm/@n8n/chat@1.44.7/dist/style.css'; document.head.appendChild(l);
  var s = document.createElement('style'); s.id = 'bus-chat-huisstijl'; s.textContent = "\n                /* --- Bus Whisky huisstijl (donker + whisky-amber) --- */\n                :root {\n                    --chat--color-primary:            #C9A227;\n                    --chat--color-primary-shade-50:   #b8931f;\n                    --chat--color-primary-shade-100:  #a7841b;\n                    --chat--color-secondary:          #C9A227;\n                    --chat--toggle--background:       #C9A227;\n                    --chat--toggle--hover--background:#b8931f;\n                    --chat--header--background:       #141414;\n                    --chat--header--color:            #ffffff;\n                    --chat--heading--color:           #ffffff;\n                    --chat--subtitle--color:          #d9d2c6;\n                    --chat--message--user--background:#C9A227;\n                    --chat--message--user--color:     #111111;\n                    --chat--window--width:            380px;\n                    --chat--window--height:           580px;\n                    /* Grotere chatknop */\n                    --chat--toggle--size: 48px;\n                    /* Verzendknop (pijltje) in huisstijl-goud i.p.v. groen */\n                    --chat--input--send--button--background:       #C9A227;\n                    --chat--input--send--button--color:            #111111;\n                    --chat--input--send--button--background-hover: #b8931f;\n                    --chat--input--send--button--color-hover:      #111111;\n                }\n                /* --- Widget LINKSONDER in plaats van rechtsonder --- */\n                .chat-window-wrapper {\n                    left: 1rem !important;\n                    right: auto !important;\n                }\n                .chat-window-wrapper .chat-window-toggle {\n                    margin-left: 0 !important;\n                    margin-right: auto !important;\n                }\n                /* Links in botberichten altijd goed zichtbaar en klikbaar */\n                .chat-messages-list a, .chat-message a {\n                    color: #C9A227 !important;\n                    text-decoration: underline !important;\n                    word-break: break-word;\n                }\n                /* Verzendknop hard overschrijven (val terug op selector als de variabele niet pakt) */\n                .chat-input-send-button,\n                .chat-inputs-controls button,\n                .chat-input [class*=\"send\"] {\n                    background: #C9A227 !important;\n                    color: #111111 !important;\n                    fill: #111111 !important;\n                }\n                .chat-input-send-button:hover,\n                .chat-inputs-controls button:hover {\n                    background: #b8931f !important;\n                }\n                .chat-input-send-button svg,\n                .chat-inputs-controls button svg,\n                .chat-input [class*=\"send\"] svg,\n                .chat-input-send-button svg path,\n                .chat-inputs-controls button svg path {\n                    color: #111111 !important;\n                    fill: #111111 !important;\n                }\n            \n/* Op desktop op dezelfde hoogte als de reserveringsknoppen (md:bottom-6) */\n@media (min-width:768px){.chat-window-wrapper{left:1.5rem!important;bottom:1.5rem!important}}\n"; document.head.appendChild(s);
})();

                

                // --- Taal bepalen uit het URL-pad: /en/... of /de/..., anders Nederlands ---
                var pad = window.location.pathname;
                var TALEN = ['nl', 'en', 'de', 'fr', 'es', 'zh', 'pl', 'cs', 'ko', 'vi'];
                var pad = window.location.pathname;
                var htmlTaal = (document.documentElement.getAttribute('lang') || '').toLowerCase().slice(0, 2);
                var padTaal = (pad.match(/^\/([a-z]{2})(\/|$)/) || [])[1] || 'nl';
                var taal = TALEN.indexOf(htmlTaal) >= 0 ? htmlTaal : (TALEN.indexOf(padTaal) >= 0 ? padTaal : 'nl');

                var teksten = {
                    nl: {
                        welkom: [
                            'Hoi! Ik ben Claude van Bus Whisky 👋',
                            'Vraag me gerust naar beschikbaarheid meetings & events, restaurant en B&B reserveringen of nieuwe whiskyreleases. Hoe kan ik je helpen?'
                        ],
                        subtitle: 'We helpen je graag verder.',
                        getStarted: 'Nieuw gesprek',
                        inputPlaceholder: 'Typ je vraag…',
                        close: 'Sluiten',
                        closeAria: 'Chat sluiten'
                    },
                    en: {
                        welkom: [
                            "Hi! I'm Claude from Bus Whisky 👋",
                            'Feel free to ask me about availability for meetings & events, restaurant and B&B bookings, or new whisky releases. How can I help you?'
                        ],
                        subtitle: "We're happy to help.",
                        getStarted: 'New chat',
                        inputPlaceholder: 'Type your question…',
                        close: 'Close',
                        closeAria: 'Close chat'
                    },
                    de: {
                        welkom: [
                            'Hallo! Ich bin Claude von Bus Whisky 👋',
                            'Fragen Sie mich gerne nach Verfügbarkeit für Meetings & Events, Restaurant- und B&B-Reservierungen oder neuen Whisky-Releases. Wie kann ich Ihnen helfen?'
                        ],
                        subtitle: 'Wir helfen Ihnen gerne weiter.',
                        getStarted: 'Neues Gespräch',
                        inputPlaceholder: 'Ihre Frage eingeben…',
                        close: 'Schließen',
                        closeAria: 'Chat schließen'
                    },
                    fr: {
                        welkom: [
                            "Bonjour ! Je suis Claude de Bus Whisky 👋",
                            "N'hésitez pas à me poser vos questions sur les disponibilités pour les réunions et événements, les réservations au restaurant et au B&B, ou les nouvelles éditions de whisky. Comment puis-je vous aider ?"
                        ],
                        subtitle: 'Nous sommes là pour vous aider.',
                        getStarted: 'Nouvelle conversation',
                        inputPlaceholder: 'Posez votre question…',
                        close: 'Fermer',
                        closeAria: 'Fermer le chat'
                    },
                    es: {
                        welkom: [
                            '¡Hola! Soy Claude de Bus Whisky 👋',
                            'Pregúntame lo que quieras sobre disponibilidad para reuniones y eventos, reservas en el restaurante y el B&B o nuevas ediciones de whisky. ¿En qué puedo ayudarte?'
                        ],
                        subtitle: 'Estaremos encantados de ayudarte.',
                        getStarted: 'Nueva conversación',
                        inputPlaceholder: 'Escribe tu pregunta…',
                        close: 'Cerrar',
                        closeAria: 'Cerrar el chat'
                    },
                    zh: {
                        welkom: [
                            '您好！我是 Bus Whisky 的 Claude 👋',
                            '欢迎向我咨询会议与活动的可预订情况、餐厅和民宿预订，或最新的威士忌发布。有什么可以帮您？'
                        ],
                        subtitle: '我们很乐意为您提供帮助。',
                        getStarted: '新对话',
                        inputPlaceholder: '请输入您的问题…',
                        close: '关闭',
                        closeAria: '关闭聊天'
                    },
                    pl: {
                        welkom: [
                            'Cześć! Jestem Claude z Bus Whisky 👋',
                            'Zapytaj mnie o dostępność na spotkania i wydarzenia, rezerwacje w restauracji i B&B albo o nowe edycje whisky. W czym mogę pomóc?'
                        ],
                        subtitle: 'Chętnie pomożemy.',
                        getStarted: 'Nowa rozmowa',
                        inputPlaceholder: 'Wpisz swoje pytanie…',
                        close: 'Zamknij',
                        closeAria: 'Zamknij czat'
                    },
                    cs: {
                        welkom: [
                            'Dobrý den! Jsem Claude z Bus Whisky 👋',
                            'Klidně se mě zeptejte na dostupnost pro setkání a akce, rezervace v restauraci a B&B nebo na nové edice whisky. Jak vám mohu pomoci?'
                        ],
                        subtitle: 'Rádi vám pomůžeme.',
                        getStarted: 'Nový rozhovor',
                        inputPlaceholder: 'Napište svou otázku…',
                        close: 'Zavřít',
                        closeAria: 'Zavřít chat'
                    },
                    ko: {
                        welkom: [
                            '안녕하세요! Bus Whisky의 Claude입니다 👋',
                            '미팅 및 이벤트 예약 가능 여부, 레스토랑과 B&B 예약, 새로운 위스키 출시에 대해 편하게 물어보세요. 무엇을 도와드릴까요?'
                        ],
                        subtitle: '기꺼이 도와드리겠습니다.',
                        getStarted: '새 대화',
                        inputPlaceholder: '질문을 입력하세요…',
                        close: '닫기',
                        closeAria: '채팅 닫기'
                    },
                    vi: {
                        welkom: [
                            'Xin chào! Tôi là Claude của Bus Whisky 👋',
                            'Bạn cứ hỏi tôi về lịch trống cho hội họp và sự kiện, đặt bàn nhà hàng và phòng B&B, hoặc các phiên bản whisky mới. Tôi có thể giúp gì cho bạn?'
                        ],
                        subtitle: 'Chúng tôi rất sẵn lòng hỗ trợ.',
                        getStarted: 'Cuộc trò chuyện mới',
                        inputPlaceholder: 'Nhập câu hỏi của bạn…',
                        close: 'Đóng',
                        closeAria: 'Đóng cửa sổ chat'
                    }
                };
                var t = teksten[taal];

                __busChatModule.then(function () {
                    createChat({
                        webhookUrl: 'https://buswhiskyevents.app.n8n.cloud/webhook/b88f324f-e6e4-470b-a73c-4b1ecbe50721/chat',
                        mode: 'window',
                        enableStreaming: false,
                        showWelcomeScreen: false,
                        loadPreviousSession: false,
                        defaultLanguage: 'en', // i18n-sleutel van de widget, altijd 'en' laten staan
                        initialMessages: t.welkom,
                        metadata: { taal: taal }, // gaat mee naar n8n; de bot start hierdoor in de juiste taal
                        i18n: {
                            en: {
                                title: 'Bus Whisky',
                                subtitle: t.subtitle,
                                footer: '',
                                getStarted: t.getStarted,
                                inputPlaceholder: t.inputPlaceholder,
                                closeButtonTooltip: t.close
                            }
                        }
                    });

                    // --- Nette gouden knop met een duidelijk pictogram (GEEN logo op de knop) ---
                    var st = document.createElement('style');
                    st.textContent =
                        '.chat-window-toggle{background:#C9A227!important;box-shadow:0 4px 16px rgba(0,0,0,.45),0 0 0 2px #000!important;}' +
                        '.chat-window-toggle:hover{background:#b8931f!important;}' +
                        'body:not(.bw-open) .chat-window-toggle svg{color:#141414!important;fill:#141414!important;width:24px!important;height:24px!important;}';
                    document.head.appendChild(st);

                    // --- Groot logo in de zwarte kopbalk ---
                    var HEADER_LOGO = "data:image/png;base64,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";
                    var stH = document.createElement('style');
                    stH.textContent =
                        // Compacte, horizontale kopbalk: titel + ondertitel links uitgelijnd, logo vast rechts.
                        '.chat-header{display:block!important;position:relative!important;text-align:left!important;padding:9px 78px 44px 20px!important;}' +
                        '.chat-header *{text-align:left!important;line-height:1.2!important;}' +
                        '.chat-header>*{align-items:flex-start!important;justify-content:flex-start!important;}' +
                        '.chat-header .chat-heading{margin:0!important;font-size:21px!important;font-weight:700!important;}' +
                        '.chat-header .chat-subtitle,.chat-header p{font-size:14px!important;margin:-4px 0 0 0!important;}' +
                        '.bw-logo{position:absolute!important;right:54px!important;top:50%!important;transform:translateY(-50%)!important;height:56px!important;width:auto!important;}' +
                        // Altijd zichtbare, tikbare sluitknop rechtsboven (ook op mobiel)
                        '.bw-close{position:absolute!important;top:8px!important;right:12px!important;z-index:2147483001!important;width:30px!important;height:30px!important;border:0!important;border-radius:50%!important;background:rgba(255,255,255,.15)!important;color:#fff!important;font-size:22px!important;line-height:28px!important;text-align:center!important;cursor:pointer!important;padding:0!important;}' +
                        '.bw-close:hover{background:rgba(255,255,255,.3)!important;}' +
                        // Open/sluit-knop altijd bovenop zodat hij nooit onbereikbaar is
                        '.chat-window-toggle{z-index:2147483000!important;}' +
                        // Op mobiel het venster net iets kleiner dan volledig, zodat de sluitknop altijd zichtbaar blijft
                        '@media (max-width:640px){.chat-window{height:90vh!important;max-height:90vh!important;}}' +
                        // Powered by-regel onderin het chatvenster (Dennis 30 okt 2026)
                        ".chat-window-wrapper .chat-window{flex-direction:column!important}.chat-window-wrapper .chat-window .chat-layout{min-height:0}.bw-powered{flex:none;display:flex;align-items:center;justify-content:center;gap:6px;background:#000;color:#fff;font:500 11px/1.2 -apple-system,BlinkMacSystemFont,\"Segoe UI\",Arial,sans-serif;letter-spacing:.02em;padding:6px 10px;margin:0}.bw-powered svg{width:13px;height:13px;flex:none}";
                    document.head.appendChild(stH);

                    // Zet het logo én een sluitknop (×) in de kopbalk; herplaats ze als de
                    // widget opnieuw rendert, zodat de bezoeker de chat altijd kan sluiten.
                    window.setInterval(function () {
                        var heading = document.querySelector('.chat-window .chat-heading, .chat-heading');
                        if (!heading) return;
                        var hdr = heading.closest('.chat-header') || heading.parentNode;
                        if (!hdr) return;
                        if (false && !hdr.querySelector('.bw-logo')) {
                            var img = document.createElement('img');
                            img.className = 'bw-logo';
                            img.src = HEADER_LOGO;
                            img.alt = 'Bus Whisky';
                            hdr.appendChild(img);
                        }
                        if (!hdr.querySelector('.bw-close')) {
                            var x = document.createElement('button');
                            x.className = 'bw-close';
                            x.type = 'button';
                            x.setAttribute('aria-label', t.closeAria);
                            x.innerHTML = '&times;';
                            x.addEventListener('click', function () {
                                var t = document.querySelector('.chat-window-toggle');
                                if (t) { t.click(); }
                            });
                            hdr.appendChild(x);
                        }
                    }, 500);

                    // Is het chatvenster ECHT zichtbaar (open)? — kijkt naar zichtbaarheid,
                    // niet alleen of het element bestaat (dat bestaat namelijk altijd).
                    function chatIsOpen() {
                        var w = document.querySelector('.chat-window');
                        return !!(w && w.offsetHeight > 0 && w.getClientRects().length);
                    }

                    // Houd de body-klasse in sync met de echte open/dicht-status
                    window.setInterval(function () {
                        document.body.classList.toggle('bw-open', chatIsOpen());
                    }, 300);

                    // --- Chat opent automatisch na 30 seconden, hooguit 1x terug na wegklikken ---
                    // De knop verschijnt na 15s; 15s later (dus ~30s na paginalaad) klapt de
                    // chat vanzelf open. Klikt de bezoeker hem weg, dan komt hij in deze sessie
                    // nog EEN keer vanzelf terug (op een volgende pagina). Klikt hij hem daarna
                    // weer weg, dan blijft hij de rest van de sessie dicht. Zelf openen via de
                    // gouden knop werkt altijd. Teller staat in sessionStorage (per tabblad).
                    var BW_MAX_WEGKLIKKEN = 2;
                    var BW_SLEUTEL = 'bw_chat_weggeklikt';
                    function bwLees() { try { return parseInt(window.sessionStorage.getItem(BW_SLEUTEL) || '0', 10) || 0; } catch (e) { return 0; } }
                    function bwSchrijf(v) { try { window.sessionStorage.setItem(BW_SLEUTEL, String(v)); } catch (e) {} }
                    var bwUserOpened = false;
                    var bwWasOpen = false;
                    window.setInterval(function () {
                        var open = chatIsOpen();
                        if (open) { bwUserOpened = true; }
                        if (bwWasOpen && !open) { bwSchrijf(bwLees() + 1); } // open -> dicht = weggeklikt
                        bwWasOpen = open;
                    }, 500);
                    function bwOpenChat() {
                        if (bwUserOpened || chatIsOpen() || document.documentElement.classList.contains('booking-widget-open')) return;
                        if (bwLees() >= BW_MAX_WEGKLIKKEN) return; // al 2x weggeklikt: deze sessie niet meer
                        var toggle = document.querySelector('.chat-window-toggle');
                        if (toggle) { toggle.click(); }
                    }
                    window.setTimeout(bwOpenChat, 30000); // ~30s na paginalaad (knop staat er sinds 31 okt meteen)

                    // === LINKS KLIKBAAR MAKEN =========================================
                    // Zet Markdown-links [tekst](url) én kale URL's om naar echte,
                    // aanklikbare links die in een nieuw tabblad openen.
                    function bwReplace(node) {
                        var text = node.nodeValue;
                        var re = /\[([^\]]+)\]\((https?:\/\/[^)]+)\)|(https?:\/\/[^\s<>()]+)/g;
                        if (!re.test(text)) return;
                        re.lastIndex = 0;
                        var frag = document.createDocumentFragment();
                        var last = 0, m;
                        while ((m = re.exec(text)) !== null) {
                            if (m.index > last) frag.appendChild(document.createTextNode(text.slice(last, m.index)));
                            var a = document.createElement('a');
                            var trail = '';
                            if (m[1]) { a.textContent = m[1]; a.href = m[2]; }
                            else {
                                var u = m[3];
                                trail = (u.match(/[.,;:!?]+$/) || [''])[0];
                                if (trail) u = u.slice(0, u.length - trail.length);
                                a.textContent = u; a.href = u;
                            }
                            // Alle links (ook de boekingspagina's) openen in een nieuw tabblad,
                            // zodat de echte beschikbaarheid en prijzen altijd betrouwbaar laden.
                            a.target = '_blank'; a.rel = 'noopener noreferrer';
                            frag.appendChild(a);
                            if (trail) frag.appendChild(document.createTextNode(trail));
                            last = re.lastIndex;
                        }
                        if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
                        node.parentNode.replaceChild(frag, node);
                    }
                    function bwLinkify() {
                        var root = document.querySelector('.chat-window');
                        if (!root) return;
                        try {
                            var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
                            var targets = [], n;
                            while ((n = walker.nextNode())) {
                                if (n.parentNode && n.parentNode.closest && n.parentNode.closest('a')) continue;
                                if (/\[[^\]]+\]\(https?:\/\/[^)]+\)|https?:\/\//.test(n.nodeValue)) targets.push(n);
                            }
                            targets.forEach(bwReplace);
                        } catch (e) {}
                    }
                    window.setInterval(bwLinkify, 800);

                    // === UNIFORM DESIGN met de reserveerwidget (Dennis 30 okt 2026): kleuren, lettertype, header ===
                    var stU = document.createElement('style'); stU.id = 'bw-uniform'; stU.textContent = ".chat-window-wrapper .chat-window{border:0!important;border-radius:8px!important;overflow:hidden!important;box-shadow:0 25px 50px -12px rgba(0,0,0,.45)!important;background:#F7F4EE!important;font-family:-apple-system,BlinkMacSystemFont,\"Segoe UI\",Arial,sans-serif!important;color:#1d1d1b!important}.chat-window-wrapper .chat-window *{font-family:-apple-system,BlinkMacSystemFont,\"Segoe UI\",Arial,sans-serif!important}.chat-window-wrapper .chat-window .chat-header{background:#F7F4EE!important;color:#1d1d1b!important;padding:16px 16px 14px!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;border:0!important;min-height:0!important;text-align:center!important}.chat-window-wrapper .chat-window .chat-header *{text-align:center!important}.chat-window-wrapper .chat-window .chat-header .chat-heading{font-size:18px!important;font-weight:700!important;line-height:1.2!important;color:#1d1d1b!important;margin:0!important;justify-content:center!important}.chat-window-wrapper .chat-window .chat-header p,.chat-window-wrapper .chat-window .chat-header .chat-subtitle,.chat-window-wrapper .chat-window .chat-header .chat-close-button,.bw-logo{display:none!important}.chat-window-wrapper .chat-window .chat-header .bw-close{display:grid!important;place-items:center!important;position:absolute!important;top:12px!important;right:12px!important;width:28px!important;height:28px!important;padding:0!important;border:0!important;border-radius:50%!important;background-color:rgba(0,0,0,.7)!important;color:#fff!important;font-size:0!important;line-height:0!important;cursor:pointer!important;background-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2.5' stroke-linecap='round'%3E%3Cpath d='M6 6l12 12M18 6L6 18'/%3E%3C/svg%3E\")!important;background-repeat:no-repeat!important;background-position:center!important;background-size:14px 14px!important}.chat-window-wrapper .chat-window .chat-header .bw-close:hover{background-color:#000!important}.chat-window-wrapper .chat-window .chat-header{position:relative!important}.chat-window-wrapper .chat-window .chat-layout,.chat-window-wrapper .chat-window .chat-body,.chat-window-wrapper .chat-window .chat-messages-list{background:#F7F4EE!important}.chat-window-wrapper .chat-window .chat-message{font-size:16px!important;line-height:1.45!important;border-radius:8px!important;box-shadow:none!important}.chat-window-wrapper .chat-window .chat-message.chat-message-from-bot{background:#fff!important;color:#1d1d1b!important;border:1px solid #d8d1c7!important}.chat-window-wrapper .chat-window .chat-message.chat-message-from-user{background:#1d1d1b!important;color:#fff!important;border:0!important}.chat-window-wrapper .chat-window .chat-message.chat-message-from-user *{color:#fff!important}.chat-window-wrapper .chat-window .chat-message.chat-message-from-bot a{color:#8a673f!important}.chat-window-wrapper .chat-window .chat-inputs{background:#fff!important;border-top:1px solid #d8d1c7!important}.chat-window-wrapper .chat-window .chat-inputs textarea{font-size:16px!important;color:#1d1d1b!important;background:#fff!important}.chat-window-wrapper .chat-window .chat-inputs textarea::placeholder{color:#625d56!important}.chat-window-wrapper .chat-window .chat-inputs .chat-input-send-button,.chat-window-wrapper .chat-window .chat-inputs .chat-inputs-controls button{background:#1d1d1b!important;color:#fff!important;fill:#fff!important}.chat-window-wrapper .chat-window .chat-inputs .chat-input-send-button:hover,.chat-window-wrapper .chat-window .chat-inputs .chat-inputs-controls button:hover{background:#000!important}.chat-window-wrapper .chat-window .chat-inputs .chat-input-send-button svg,.chat-window-wrapper .chat-window .chat-inputs .chat-input-send-button svg path,.chat-window-wrapper .chat-window .chat-inputs .chat-inputs-controls button svg,.chat-window-wrapper .chat-window .chat-inputs .chat-inputs-controls button svg path{color:#fff!important;fill:#fff!important}.chat-window-wrapper .chat-window .chat-header h1,.chat-window-wrapper .chat-window .chat-header .chat-heading h1{font-size:18px!important;font-weight:700!important;line-height:1.2!important;padding:0!important;margin:0!important;color:#1d1d1b!important;letter-spacing:0!important;text-transform:none!important}@media (min-width:641px){.chat-window-wrapper .chat-window{height:min(640px,calc(100dvh - 112px))!important;max-height:none!important}}"; document.head.appendChild(stU);

                    // === POWERED BY-REGEL onderin het chatvenster (Dennis 30 okt 2026) ===
                    var BW_POWERED = "<div class=\"bw-powered\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path fill=\"#C9A227\" d=\"M12 2l1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8z\"/><path fill=\"#C9A227\" d=\"M19 14l.9 2.1L22 17l-2.1.9L19 20l-.9-2.1L16 17l2.1-.9z\"/><path fill=\"#C9A227\" d=\"M5 14.5l.7 1.6 1.6.7-1.6.7L5 19.1l-.7-1.6-1.6-.7 1.6-.7z\"/></svg><span>Powered by Bus Whisky Angels’ Share</span><svg style=\"transform:scaleX(-1)\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path fill=\"#C9A227\" d=\"M12 2l1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8z\"/><path fill=\"#C9A227\" d=\"M19 14l.9 2.1L22 17l-2.1.9L19 20l-.9-2.1L16 17l2.1-.9z\"/><path fill=\"#C9A227\" d=\"M5 14.5l.7 1.6 1.6.7-1.6.7L5 19.1l-.7-1.6-1.6-.7 1.6-.7z\"/></svg></div>";
                    window.setInterval(function () {
                        var w = document.querySelector('.chat-window');
                        if (!w || w.querySelector('.bw-powered')) return;
                        w.insertAdjacentHTML('beforeend', BW_POWERED);
                    }, 500);
                }); // chatknop zodra de chatmodule binnen is (Dennis 31 okt 2026; was 15 s vertraging)
            
}

// === RESERVEERPANEEL NOOIT AUTOMATISCH OPENEN (Dennis 30 okt 2026) ===
// De site (app.js, Rosegaar) opent #booking-widget bij het eerste bezoek per sessie vanzelf.
// Dat mag niet: alleen openen na een klik op Reserveren/Cadeaubon of een boeklink.
(function () {
  if (window.__busGeenAutoOpen) return;
  window.__busGeenAutoOpen = true;
  try { sessionStorage.setItem('booking-widget-dismissed', '1'); } catch (e) {}
  document.addEventListener('click', function (e) {
    var t = e.target && e.target.closest ? e.target.closest('[data-booking-widget-open]') : null;
    if (t) window.__busOpenKlik = Date.now();
  }, true);
  function gewild() {
    var nu = Date.now();
    return (window.__busOpenKlik && nu - window.__busOpenKlik < 3000) || (window.__busBoekIntent && nu - window.__busBoekIntent < 20000);
  }
  function dicht(host) {
    if (!host.classList.contains('is-open') || gewild()) return;
    var x = host.querySelector('[data-booking-widget-close]');
    if (x) x.click();
  }
  function start(n) {
    var host = document.getElementById('booking-widget');
    if (!host) { if (n < 100) setTimeout(function () { start(n + 1); }, 50); return; }
    dicht(host);
    var tot = Date.now() + 15000;
    var mo = new MutationObserver(function () { if (Date.now() > tot) { mo.disconnect(); return; } dicht(host); });
    mo.observe(host, { attributes: true, attributeFilter: ['class'] });
  }
  start(0);
})();

// === BOEKLINKS NAAR DE EIGEN BUS-WIDGET (30 okt 2026) ===
// Vangt elke boeklink op de site op en opent ons eigen reserveringspaneel (#booking-widget, /reserveren/widget)
// op het juiste arrangement. Ondersteunt permanent de oude Guestplan-ankers en het nieuwe formaat:
//   #gstpln_openWidget?serviceCode=CODE[&partySize=N]   (oud, Guestplan)
//   #gstpln_openGiftCardWidget                           (oud, Guestplan cadeaubon)
//   #reserveren?arrangement=CODE[&pax=N]  of  #reserveren (nieuw, algemeen overzicht)
//   #cadeaubon                                           (nieuw, cadeaubon)
//   /pad?arrangement=CODE#reserveren                     (nieuw, van buiten de site)
//   widget.guestplan.com/?...serviceCode=CODE            (oude directe Guestplan-link)
// Werkt ook bij het laden van een pagina met zo'n hash of ?arrangement= in de URL.
(function () {
  if (window.__busBoekLinks) return;
  window.__busBoekLinks = true;

  function lees(href) {
    if (!href) return null;
    var u;
    try { u = new URL(href, location.href); } catch (e) { return null; }
    var hash = (u.hash || '').replace(/^#/, '');
    var hq = new URLSearchParams(hash.indexOf('?') >= 0 ? hash.slice(hash.indexOf('?') + 1) : '');
    var hnaam = hash.split('?')[0].toLowerCase();
    var sq = u.searchParams;
    var eigen = u.origin === location.origin;
    // De arrangementlinks op de landingspagina openen de bestaande widget boven deze pagina.
    if ((u.hostname === 'buswhisky.com' || u.hostname === 'www.buswhisky.com') &&
        u.pathname.replace(/\/+$/, '') === '/reserveren/widget') {
      return { soort: 'book', code: sq.get('arrangement') || sq.get('product') || sq.get('service_code') || sq.get('service'),
               category: sq.get('category') || sq.get('type'), pax: sq.get('pax'), lang: sq.get('lang') };
    }
    if (/guestplan\.com$/i.test(u.hostname)) {
      if (sq.get('openGiftCardWidget')) return { soort: 'gift' };
      var gc = sq.get('serviceCode');
      return gc ? { soort: 'book', code: gc, pax: sq.get('partySize') } : { soort: 'book' };
    }
    if (hnaam === 'gstpln_opengiftcardwidget' || hnaam === 'cadeaubon') return eigen ? { soort: 'gift' } : null;
    if (hnaam === 'gstpln_openwidget') return eigen ? { soort: 'book', code: hq.get('serviceCode') || hq.get('arrangement'), pax: hq.get('partySize') || hq.get('pax') } : null;
    if (hnaam === 'reserveren') {
      if (!eigen) return null;
      // 11 nov 2026: categorie mee (programmaknoppen op de M&E-pagina's zijn hashlinks, zodat crawlers geen n8n-run veroorzaken).
      return { soort: 'book', code: hq.get('arrangement') || sq.get('arrangement'), pax: hq.get('pax') || sq.get('pax'), category: hq.get('category') || hq.get('type') || sq.get('category') };
    }
    return null;
  }

  function openFallback(url) {
    if (!document.body) return;
    var shade=document.getElementById('bus-booking-fallback-overlay');
    if (!shade) {
      shade=document.createElement('div');
      shade.id='bus-booking-fallback-overlay';
      shade.setAttribute('role','dialog');
      shade.setAttribute('aria-label','Reserveren bij Bus Whisky');
      shade.style.cssText='position:fixed;inset:0;z-index:2147483400;background:rgba(0,0,0,.62);display:flex;align-items:center;justify-content:center;padding:12px;';
      var box=document.createElement('div');
      box.style.cssText='position:relative;width:min(460px,100%);height:min(710px,calc(100dvh - 24px));background:#f7f4ee;border-radius:12px;overflow:hidden;box-shadow:0 15px 50px #0007;';
      var close=document.createElement('button');
      close.type='button';close.setAttribute('aria-label','Sluiten');close.textContent='×';
      close.style.cssText='position:absolute;right:8px;top:8px;z-index:2;width:34px;height:34px;border:0;border-radius:18px;background:#111;color:white;font-size:25px;line-height:29px;cursor:pointer';
      close.addEventListener('click',function(){shade.remove();});
      shade.addEventListener('click',function(e){if(e.target===shade)shade.remove();});
      shade.addEventListener('keydown',function(e){if(e.key==='Escape'){e.preventDefault();shade.remove();}});
      var iframe=document.createElement('iframe');
      iframe.setAttribute('title','BUS reserveren');
      iframe.setAttribute('allow','payment');
      iframe.style.cssText='width:100%;height:100%;border:0;display:block;';
      box.appendChild(iframe);box.appendChild(close);shade.appendChild(box);
      document.body.appendChild(shade);
    }
    shade.querySelector('iframe').src=url;
  }

  function open(d, poging) {
    poging = poging || 0;
    var host = document.getElementById('booking-widget');
    var ifr = host && host.querySelector('iframe');
    var knop = host && host.querySelector('[data-booking-widget-open="' + d.soort + '"]');
    var p = new URLSearchParams();
    if (d.soort === 'gift') { p.set('gift', '1'); } else { if (d.code) p.set('arrangement', d.code); if (d.pax) p.set('pax', d.pax); }
    if (d.soort === 'book' && d.category) p.set('category', d.category);
    p.set('launcher', '0'); p.set('modal', '1'); p.set('intent', '1');
    var lang = (document.documentElement.lang || '').slice(0, 2).toLowerCase();
    if (lang && lang !== 'nl') p.set('lang', lang);
    var url = ((host && host.dataset.url) || '/reserveren/widget') + '?' + p.toString();
    if (!host || !ifr || !knop) {
      if (poging < 20) { setTimeout(function () { open(d, poging + 1); }, 250); return; }
      openFallback(url);
      return;
    }
    window.__busBoekIntent = Date.now();
    window.__busLuiReset = null;
    if (!host.classList.contains('is-open')) knop.click();
    if (!host.classList.contains('is-open') && poging < 20) { setTimeout(function () { open(d, poging + 1); }, 250); return; }
    host.classList.remove('is-ready');
    ifr.src = url;
  }

  window.BUSBoekLink = { open: open, lees: lees };

  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
    if (!a) return;
    var href = a.getAttribute('href') || '';
    var d = lees(href);
    if (!d) return;
    // Herkende boeklink: altijd ter plekke openen, ook als de link naar een andere pagina wijst (zoals Guestplan deed).
    e.preventDefault();
    e.stopImmediatePropagation();
    open(d);
  }, true);

  var bijStart = lees(location.href);
  if (!bijStart) {
    var sa = new URLSearchParams(location.search);
    if (sa.get('arrangement')) bijStart = { soort: 'book', code: sa.get('arrangement'), pax: sa.get('pax') };
  }
  if (bijStart) window.__busBoekIntent = Date.now();
  function bijLaden() {
    if (!bijStart) return;
    window.__busBoekIntent = Date.now();
    setTimeout(function () { open(bijStart); zeker(bijStart, 0); }, 400);
  }
  // Bij het laden kan de host het paneel daarna nog op het standaardoverzicht zetten: controleren en zo nodig opnieuw.
  function zeker(d, n) {
    var t0 = sluitTeller;
    setTimeout(function () {
      if (t0 !== sluitTeller) return; // gast heeft het paneel intussen gesloten: niet opnieuw openen
      var host = document.getElementById('booking-widget');
      var ifr = host && host.querySelector('iframe');
      var l = '';
      l = (ifr && ifr.getAttribute('src')) || '';
      var goed = d.soort === 'gift' ? /[?&]gift=1/.test(l) : (!d.code || l.indexOf('arrangement=' + d.code) >= 0);
      if (!goed && n < 5) { open(d); zeker(d, n + 1); }
    }, 1500);
  }
  // Na sluiten: een deeplink-paneel terugzetten naar een vers overzicht, zodat de knop Reserveren daarna alle arrangementen toont.
  // De host laadt de iframe alleen opnieuw bij een wissel reserveren/cadeaubon en hergebruikt anders de arrangement-URL.
  var sluitTeller = 0;
  function urlOpschonen() {
    try {
      var u = new URL(location.href);
      var w = false;
      if (u.searchParams.has('arrangement')) { u.searchParams.delete('arrangement'); u.searchParams.delete('pax'); w = true; }
      if (lees(location.href)) { u.hash = ''; w = true; }
      if (w) history.replaceState(history.state, '', u.pathname + (u.searchParams.toString() ? '?' + u.searchParams.toString() : '') + u.hash);
    } catch (e) {}
  }
  function resetNaSluiten(host) {
    sluitTeller++;
    bijStart = null;
    urlOpschonen();
    var ifr = host.querySelector('iframe');
    var src = (ifr && ifr.getAttribute('src')) || '';
    try { if (ifr && ifr.contentWindow && ifr.contentWindow.location.href !== 'about:blank') src = ifr.contentWindow.location.search; } catch (e) {}
    if (!ifr || !/[?&](arrangement|intent)=/.test(src)) return;
    // Niet meteen herladen (kostte een n8n-run per sluiten); pas bij de volgende klik op een widgetknop.
    var p = new URLSearchParams();
    if (/[?&]gift=1/.test(src)) p.set('gift', '1');
    p.set('launcher', '0'); p.set('modal', '1');
    var lang = (document.documentElement.lang || '').slice(0, 2).toLowerCase();
    if (lang && lang !== 'nl') p.set('lang', lang);
    window.__busLuiReset = (host.dataset.url || '/reserveren/widget') + '?' + p.toString();
  }
  document.addEventListener('click', function (e) {
    var url = window.__busLuiReset;
    if (!url) return;
    var t = e.target && e.target.closest ? e.target.closest('[data-booking-widget-open]') : null;
    if (!t) return;
    window.__busLuiReset = null;
    var host = document.getElementById('booking-widget');
    var ifr = host && host.querySelector('iframe');
    if (ifr) { host.classList.remove('is-ready'); ifr.src = url; }
  }, true);
  function bewaakSluiten(poging) {
    var host = document.getElementById('booking-widget');
    if (!host) { if ((poging || 0) < 40) setTimeout(function () { bewaakSluiten((poging || 0) + 1); }, 250); return; }
    var wasOpen = host.classList.contains('is-open');
    new MutationObserver(function () {
      var nu = host.classList.contains('is-open');
      if (wasOpen && !nu) resetNaSluiten(host);
      wasOpen = nu;
    }).observe(host, { attributes: true, attributeFilter: ['class'] });
  }
  bewaakSluiten(0);

  if (document.readyState === 'complete') bijLaden(); else window.addEventListener('load', bijLaden);
  window.addEventListener('hashchange', function () { var d = lees(location.href); if (d) open(d); });
})();

// === POP-UPS UNIFORM + ZWARTE ACHTERGROND ACHTER DE KNOPPEN (Dennis 31 okt 2026) ===
// Mobiel: chat en reserveer/cadeaubon dezelfde kaart (16px marge, knoppen eronder) en zwart achter de knoppen
// zolang een pop-up open is. Zelfde CSS zet de widget-iframe (TDOHm6WLSfFVNSEo, node "Mobiel uniform met chat").
(function () {
  if (window.__busPopUniform) return;
  window.__busPopUniform = true;
  var CSS = ".chat-window-wrapper{pointer-events:none!important}.chat-window-wrapper .chat-window,.chat-window-wrapper .chat-window-toggle{pointer-events:auto!important}#bw-zwart{display:none;position:fixed;top:0;left:0;right:0;bottom:0;background:#000;z-index:39}@media(max-width:640px){html.bw-chat-open #bw-zwart{display:block}}@media(max-width:639px){html.booking-widget-open #bw-zwart{display:block}html #booking-widget #booking-widget-panel,html #booking-widget.is-gift #booking-widget-panel{top:16px!important;left:16px!important;right:16px!important;bottom:80px!important;width:auto!important;height:auto!important;max-height:none!important;border-radius:8px!important}html #booking-widget.is-open>div.fixed:not(#booking-widget-panel){display:flex!important}html #booking-widget.is-open #bwCollapse{display:grid!important;left:16px!important;right:auto!important;bottom:16px!important}html.booking-widget-open body .chat-window-wrapper{display:flex!important;left:72px!important}html #booking-widget.is-open [data-booking-widget-open=\"book\"]{padding-right:14px!important;gap:6px!important}}@media(max-width:385px){html #booking-widget.is-open [data-booking-widget-open=\"book\"]{padding-left:16px!important}html #booking-widget.is-open [data-booking-widget-open=\"book\"] svg{display:none!important}}";
  var st = document.getElementById('bw-uniform-mobiel');
  if (!st) { st = document.createElement('style'); st.id = 'bw-uniform-mobiel'; document.head.appendChild(st); }
  st.textContent = CSS;
  var sc = document.createElement('style'); sc.id = 'bw-zwart-chat'; sc.textContent = 'html.bw-chat-open .chat-window-wrapper{z-index:9999!important}'; document.head.appendChild(sc);
  function zwart() {
    if (document.getElementById('bw-zwart') || !document.body) return;
    var z = document.createElement('div'); z.id = 'bw-zwart'; z.setAttribute('aria-hidden', 'true'); document.body.appendChild(z);
  }
  (function(w,d){if(w.__busPopWissel)return;w.__busPopWissel=1;function chatOpen(){var c=d.querySelector('.chat-window-wrapper .chat-window');if(!c||!c.getClientRects().length)return false;var s=w.getComputedStyle(c);return s.display!=='none'&&s.visibility!=='hidden'&&s.opacity!=='0'}d.addEventListener('click',function(e){if(!e.isTrusted||!e.target||!e.target.closest)return;if(e.target.closest('.chat-window-toggle')){var h=d.getElementById('booking-widget');if(h&&h.classList.contains('is-open')){var x=h.querySelector('[data-booking-widget-close]');if(x)x.click()}}else if(e.target.closest('[data-booking-widget-open]')&&chatOpen()){var t=d.querySelector('.chat-window-toggle');if(t)t.click()}},true)})(window, document);

  // Chatknop blijft staan als de chat is uitgevouwen (Dennis 31 okt 2026): inklappijl buitenaan, chatknop ernaast.
  var sk = document.createElement('style'); sk.id = 'bw-chatknop-css';
  sk.textContent = '#bwChatKnop{display:none;position:fixed;left:72px;bottom:16px;z-index:2147483000;width:48px;height:48px;border:0;border-radius:50%;background:#C9A227;color:#111;place-items:center;padding:0;cursor:pointer;box-shadow:0 4px 16px rgba(0,0,0,.45),0 0 0 2px #000}#bwChatKnop svg{width:24px;height:24px}@media(max-width:640px){html.bw-chat-open #bwChatKnop{display:grid}html.bw-chat-open #booking-widget [data-booking-widget-open="book"]{padding-right:14px!important;gap:6px!important}}@media(max-width:385px){html.bw-chat-open #booking-widget [data-booking-widget-open="book"]{padding-left:16px!important}html.bw-chat-open #booking-widget [data-booking-widget-open="book"] svg{display:none!important}}';
  document.head.appendChild(sk);
  var bwKnopIcoon = '';
  function chatKnop(open) {
    var tg = document.querySelector('.chat-window-toggle');
    if (tg && !open && tg.innerHTML.indexOf('<svg') >= 0) bwKnopIcoon = tg.innerHTML;
    var k = document.getElementById('bwChatKnop');
    if (!k && document.body) {
      k = document.createElement('button'); k.id = 'bwChatKnop'; k.type = 'button'; k.setAttribute('aria-label', 'Chat'); k.title = 'Chat';
      k.addEventListener('click', function () { var ta = document.querySelector('.chat-window textarea'); if (ta) ta.focus(); });
      document.body.appendChild(k);
    }
    if (k && bwKnopIcoon && k.innerHTML !== bwKnopIcoon) k.innerHTML = bwKnopIcoon;
  }
  window.setInterval(function () {
    zwart();
    var w = document.querySelector('.chat-window-wrapper .chat-window');
    var open = false;
    if (w && w.getClientRects().length) { var cs = getComputedStyle(w); open = cs.display !== 'none' && cs.visibility !== 'hidden' && cs.opacity !== '0'; }
    document.documentElement.classList.toggle('bw-chat-open', open);
    chatKnop(open);
  }, 250);
})();

// === WEBSHOP-KNOP NAAST DE CADEAUBON (Dennis 31 okt 2026) ===
// Flessenknop naast de cadeaubonknop; opent de reserveerwidget met alleen de webshop (shop=1).
// AAN/UIT: zet WEBSHOP.aan op false (overal uit) of zet paden in WEBSHOP.uitOpPaden (begin van het pad, * aan het eind mag).
// Ook uit: ander domein dan buswhisky.com, een element met data-bus-shop="uit" op de pagina, of webshop=0 in de URL.
(function () {
  var WEBSHOP = { aan: true, uitOpPaden: [] };
  try {
    if (!WEBSHOP.aan) return;
    if (!/(^|[.])buswhisky[.]com$/i.test(location.hostname)) return;
    if (/[?&]webshop=(0|uit|nee)(&|$)/i.test(location.search)) return;
    var pad = location.pathname;
    for (var i = 0; i < WEBSHOP.uitOpPaden.length; i++) {
      var u = String(WEBSHOP.uitOpPaden[i] || ''); if (!u) continue;
      var ster = u.slice(-1) === '*'; if (ster) u = u.slice(0, -1);
      if ((ster || u.slice(-1) === '/') ? pad.indexOf(u) === 0 : (pad === u || pad.indexOf(u + '/') === 0)) return;
    }
  } catch (e) { return; }
  var LABEL = { nl: 'Whisky kopen', en: 'Buy whisky', de: 'Whisky kaufen', fr: 'Acheter du whisky', es: 'Comprar whisky' };
  var taal = String(document.documentElement.lang || 'nl').slice(0, 2).toLowerCase();
  var label = LABEL[taal] || LABEL.en;
  // 1 nov 2026: Mollie laat zich niet in een iframe tonen. De webshop rekent daarom af in het volledige venster (net als reserveren
  // en de cadeaubon); 'Webshop afrekenen in widget' bewaart vooraf sessionStorage bw-shop-retour {u,p,t}. Komt de gast terug op een
  // Driver-pagina (bedankpagina, of /bestellen na een afkeuring), dan wordt die verborgen en gaat de gast direct terug naar de pagina
  // waar hij was, met de widget open op de bevestiging (besteld) of op de checkout met de melding (fout).
  // Knop 'Kom proeven in Loosbroek' op de bedankpagina: #bw-open=book opent de reserveringswidget.
  if (/bw-open=book/.test(location.hash)) {
    try { history.replaceState(history.state, '', location.pathname + location.search); } catch (e) {}
    (function klik(n) { var k = document.querySelector('[data-booking-widget-open="book"]'); if (k && document.readyState === 'complete') { setTimeout(function () { k.click(); }, 400); return; } if (n < 60) setTimeout(function () { klik(n + 1); }, 150); })(0);
  }
  (function () {
    var hm = location.hash.match(/bw-shop=(besteld|fout)(?:&nr=([0-9A-Za-z%-]+))?(?:&msg=([^&]*))?/);
    if (hm) {
      try { history.replaceState(history.state, '', location.pathname + location.search); } catch (e) {}
      window.__bwShopNa = { s: hm[1], nr: hm[2] || '', msg: hm[3] || '' };
      return;
    }
    // localStorage (ook leesbaar als de bank-app de terugkeer in een nieuw tabblad opent), sessionStorage als terugval.
    var R = null; try { R = JSON.parse(localStorage.getItem('bw-shop-retour') || sessionStorage.getItem('bw-shop-retour') || 'null'); } catch (e) {}
    // 1 nov 2026 15:00: de bank-app opent de terugkeer soms in een ander (niet-incognito) tabblad zonder deze vlag. De bedankpagina
    // komt er dan toch: zonder vlag alleen op Driver's bedankpagina, en een afkeuring blijft dan Driver's eigen pagina.
    if (R && (!R.u || Date.now() - (R.t || 0) > 7200000)) R = null;
    var pad = location.pathname;
    var html0 = document.documentElement.innerHTML || '';
    // Driver's bedankpagina herkennen aan de betaalcomponent (adres van die pagina is niet vast), /bestellen en /winkelwagen bij afkeuring.
    var BED = /payment-thank-you|paymentThankYou|thankyou-wrapper|mollie-id|Bedankt voor je bestelling|Bestelling bevestigd/i;
    // Alleen echte pagina-inhoud tellen: gewone scripts en stijlen bevatten soms dezelfde woorden (bijv. een zoekpatroon).
    function isBed(h) {
      try {
        var dd = new DOMParser().parseFromString(h, 'text/html');
        dd.querySelectorAll('script:not([type="text/x-template"]),style,noscript').forEach(function (x) { x.remove(); });
        return BED.test(dd.documentElement.innerHTML || '');
      } catch (e) { return BED.test(h); }
    }
    var bedankt = isBed(html0);
    var BEDPAD = /bestelling-geplaatst|bedankt|thank/i;
    if (!bedankt && !/winkelwagen|bestellen|bestelling|betaling|bedankt|thank/i.test(pad)) return;
    if (!R && !bedankt && !BEDPAD.test(pad)) return;
    function ruim() { try { localStorage.removeItem('bw-shop-retour'); sessionStorage.removeItem('bw-shop-retour'); sessionStorage.removeItem('bw-shop-order'); } catch (e) {} }
    function terugFout(msg) {
      if (!R) { var o = document.getElementById('bwBedankt'); if (o) o.remove(); document.documentElement.classList.remove('bw-bedankt-aan'); document.documentElement.style.visibility = ''; return; }
      ruim();
      location.replace(String(R.u).split('#')[0] + '#bw-shop=fout' + (msg ? '&msg=' + encodeURIComponent(msg.slice(0, 300)) : ''));
    }
    // 1 nov 2026 (Dennis): eigen, enthousiaste bedankpagina. Die legt zich direct over Driver's bedankpagina (geen tweede paginalading).
    // De betaalstatus komt uit Driver's eigen statusadres (mollie_id), niet uit de paginatekst: het Vue-sjabloon op die pagina bevat
    // ook de teksten voor een mislukte betaling, waardoor build 0103 een geslaagde betaling als mislukt zag.
    var T = {
      nl: { even: 'Even je betaling checken', proost: 'Proost', bin: 'Je bestelling is binnen!', sub: 'Wij pakken hem met liefde voor je in. De bevestiging staat zo in je mailbox.', subAf: 'Wij zetten hem met liefde voor je klaar in Loosbroek. De bevestiging staat zo in je mailbox.', nr: 'Bestelnummer', engel: 'Terwijl jouw fles onderweg is, rijpen er in Brabant honderden vaten rustig verder. De engelen nemen hun deel, jij straks het jouwe.', engelAf: 'Terwijl jouw fles klaarstaat, rijpen er in Brabant honderden vaten rustig verder. De engelen nemen hun deel, jij straks het jouwe.', verwerk: 'Je betaling wordt nog verwerkt door de bank. Dat komt vanzelf goed.', verder: 'Verder kijken', proef: 'Kom proeven in Loosbroek' },
      en: { even: 'Checking your payment', proost: 'Cheers', bin: 'Your order is in!', sub: 'We are packing it for you with love. Your confirmation will be in your inbox shortly.', subAf: 'We are getting it ready for you in Loosbroek. Your confirmation will be in your inbox shortly.', nr: 'Order number', engel: 'While your bottle is on its way, hundreds of casks keep maturing quietly in Brabant. The angels take their share, soon you take yours.', engelAf: 'While your bottle waits for you, hundreds of casks keep maturing quietly in Brabant. The angels take their share, soon you take yours.', verwerk: 'Your bank is still processing the payment. It will sort itself out.', verder: 'Keep browsing', proef: 'Come and taste in Loosbroek' },
      de: { even: 'Zahlung wird geprüft', proost: 'Prost', bin: 'Deine Bestellung ist da!', sub: 'Wir packen sie mit Liebe für dich ein. Die Bestätigung ist gleich in deinem Postfach.', subAf: 'Wir legen sie mit Liebe in Loosbroek für dich bereit. Die Bestätigung ist gleich in deinem Postfach.', nr: 'Bestellnummer', engel: 'Während deine Flasche unterwegs ist, reifen in Brabant Hunderte Fässer in Ruhe weiter. Die Engel nehmen ihren Anteil, du bald deinen.', engelAf: 'Während deine Flasche auf dich wartet, reifen in Brabant Hunderte Fässer in Ruhe weiter. Die Engel nehmen ihren Anteil, du bald deinen.', verwerk: 'Deine Bank verarbeitet die Zahlung noch. Das klappt von selbst.', verder: 'Weiter stöbern', proef: 'Komm zur Verkostung nach Loosbroek' }
    };
    var t = T[taal] || T.en;
    var css = '#bwBedankt{position:fixed;inset:0;z-index:2147483646;background:radial-gradient(120% 80% at 50% 0%,#2a2214 0%,#141414 55%,#0d0d0d 100%);color:#F7F4EE;display:flex;align-items:safe center;justify-content:center;overflow:auto;-webkit-font-smoothing:antialiased;opacity:1}'
      + 'html.bw-bedankt-aan body>*:not(#bwBedankt){visibility:hidden!important}html.bw-bedankt-aan,html.bw-bedankt-aan body{overflow:hidden!important;background:#141414!important}'
      + '#bwBedankt .bwb-in{position:relative;z-index:2;width:100%;max-width:460px;padding:28px 24px 24px;text-align:center;box-sizing:border-box}'
      + '#bwBedankt .bwb-glas{width:120px;height:167px;margin:0 auto 4px;background:url(https://buswhisky.com/images/products/6/_large_66f54775e5040.webp) -259px -239px/900px 678px no-repeat;mix-blend-mode:screen;-webkit-mask-image:radial-gradient(ellipse 50% 50% at 50% 50%,#000 72%,transparent 100%);mask-image:radial-gradient(ellipse 50% 50% at 50% 50%,#000 72%,transparent 100%);animation:bwbGlas 1s cubic-bezier(.2,.8,.2,1) both}@keyframes bwbGlas{from{opacity:0;transform:translateY(10px) scale(.94)}to{opacity:1;transform:none}}'
      + '#bwBedankt .bwb-drank{transform:translateY(64px);transition:transform 1.6s cubic-bezier(.2,.8,.2,1)}#bwBedankt.bwb-vol .bwb-drank{transform:translateY(0)}'
      + '#bwBedankt .bwb-tekst{opacity:0;transform:translateY(14px);transition:opacity .7s ease .5s,transform .7s ease .5s}#bwBedankt.bwb-klaar .bwb-tekst{opacity:1;transform:none}'
      + '#bwBedankt .bwb-laad{font:500 15px/1.4 inherit;letter-spacing:.04em;color:#d9d2c6;transition:opacity .4s}#bwBedankt.bwb-klaar .bwb-laad{opacity:0;height:0;overflow:hidden}'
      + '#bwBedankt h1{font-family:Oswald,"Oswald",Impact,sans-serif;font-weight:600;text-transform:uppercase;font-size:clamp(40px,12vw,58px);line-height:1;margin:6px 0 6px;color:#C9A227;letter-spacing:.02em}'
      + '#bwBedankt h2{font-size:22px;line-height:1.25;margin:0 0 12px;font-weight:700;color:#fff}'
      + '#bwBedankt p{font-size:16px;line-height:1.5;margin:0 0 14px;color:#e9e3d8}'
      + '#bwBedankt .bwb-nr{display:inline-block;margin:6px 0 18px;padding:10px 18px;border:1px solid rgba(201,162,39,.55);border-radius:999px;font-size:15px;letter-spacing:.03em;color:#fff}#bwBedankt .bwb-nr b{color:#C9A227}'
      + '#bwBedankt .bwb-engel{font-size:14px;color:#bdb4a5;font-style:italic;margin:2px auto 20px;max-width:360px}'
      + '#bwBedankt .bwb-vw{font-size:13px;color:#bdb4a5}'
      + '#bwBedankt .bwb-knop{display:block;width:100%;box-sizing:border-box;padding:14px 20px;border-radius:999px;font-family:Oswald,Impact,sans-serif;text-transform:uppercase;font-size:20px;letter-spacing:.03em;text-decoration:none;cursor:pointer;border:0;margin:0 0 12px}'
      + '#bwBedankt .bwb-k1{background:#C9A227;color:#111}#bwBedankt .bwb-k2{background:transparent;color:#C9A227;border:1.5px solid #C9A227}'
      + '#bwBedankt .bwb-voet{margin-top:18px;font-size:13px;letter-spacing:.05em;color:#d9d2c6}'
      + '#bwBedankt .bwb-v{position:absolute;bottom:-20px;width:6px;height:6px;border-radius:50%;background:#C9A227;opacity:0;z-index:1;animation:bwbStijg linear infinite;box-shadow:0 0 8px #C9A227}'
      + '@keyframes bwbStijg{0%{transform:translateY(0) scale(.6);opacity:0}15%{opacity:.85}100%{transform:translateY(-105vh) scale(1.1);opacity:0}}'
      + '#bwBedankt .bwb-bel{animation:bwbBel 2.4s ease-in infinite}@keyframes bwbBel{0%{transform:translateY(0);opacity:0}20%{opacity:.8}100%{transform:translateY(-46px);opacity:0}}'
      + '@media (prefers-reduced-motion:reduce){#bwBedankt .bwb-glas{animation:none}#bwBedankt .bwb-v,#bwBedankt .bwb-bel{animation:none;display:none}#bwBedankt .bwb-drank,#bwBedankt .bwb-tekst{transition:none}}';
    // 1 nov 2026 (Dennis): echte foto van het BUS Whisky-glas in plaats van een getekend glas. Uitsnede van de productfoto Mini Tasting
    // (Driver); mix-blend-mode screen laat de zwarte doos achter het glas wegvallen, een ovaal masker maakt de randen zacht.
    var glas = '<div class="bwb-glas" role="img" aria-label="BUS Whisky glas"></div>';
    var O = null;
    function bouw() {
      if (O) return O;
      var s = document.createElement('style'); s.id = 'bwBedanktCss'; s.textContent = css; (document.head || document.documentElement).appendChild(s);
      document.documentElement.classList.add('bw-bedankt-aan');
      O = document.createElement('div'); O.id = 'bwBedankt'; O.setAttribute('role', 'dialog'); O.setAttribute('aria-live', 'polite');
      var v = ''; for (var i = 0; i < 18; i++) v += '<i class="bwb-v" style="left:' + (Math.random() * 100).toFixed(1) + '%;animation-duration:' + (5 + Math.random() * 6).toFixed(1) + 's;animation-delay:' + (Math.random() * 6).toFixed(1) + 's;width:' + (3 + Math.random() * 5).toFixed(1) + 'px;height:' + (3 + Math.random() * 5).toFixed(1) + 'px"></i>';
      O.innerHTML = v + '<div class="bwb-in">' + glas + '<div class="bwb-laad">' + t.even + '&hellip;</div><div class="bwb-tekst"></div></div>';
      document.body.appendChild(O);
      return O;
    }
    if (bedankt) { if (document.body) bouw(); else document.addEventListener('DOMContentLoaded', bouw); }
    function esc(x) { return String(x).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
    function toonBedankt(d) {
      ruim();
      bouw();
      var af = d.afhalen, naam = d.naam ? ', ' + esc(d.naam) : '';
      var home = R ? String(R.u).split('#')[0] : location.origin + (taal && taal !== 'nl' ? '/' + taal + '/' : '/');
      O.querySelector('.bwb-tekst').innerHTML = '<h1>' + t.proost + naam + '!</h1><h2>' + t.bin + '</h2><p>' + (af ? t.subAf : t.sub) + '</p>'
        + (d.nr ? '<div class="bwb-nr">' + t.nr + ' <b>#' + esc(d.nr) + '</b></div>' : '')
        + '<p class="bwb-engel">' + (af ? t.engelAf : t.engel) + '</p>' + (d.pending ? '<p class="bwb-vw">' + t.verwerk + '</p>' : '')
        + '<a class="bwb-knop bwb-k1" href="' + esc(home) + '">' + t.verder + '</a><a class="bwb-knop bwb-k2" href="' + esc(home) + '#bw-open=book">' + t.proef + '</a>'
        + '<div class="bwb-voet">&#10022; Powered by Bus Whisky Angels&rsquo; Share &#10022;</div>';
      O.classList.add('bwb-vol');
      setTimeout(function () { O.classList.add('bwb-klaar'); setTimeout(function () { var l = O.querySelector('.bwb-laad'); if (l) l.remove(); }, 450); }, 900);
      // diag-baken weg (9 nov 2026): elk baken was een betaalde n8n-run.
    }
    function attr(h, n) { var m = h.match(new RegExp('\\s' + n + '="([^"]*)"', 'i')); return m ? m[1].replace(/&amp;/g, '&').replace(/&quot;/g, '"') : ''; }
    function gegevens(h) {
      var q = '(?:&quot;|")', d = {};
      var nrm = h.match(new RegExp('(?:order_number|ordernumber|order_nr|reference)' + q + '\\s*:\\s*' + q + '?([0-9][0-9A-Za-z-]{2,})', 'i'));
      d.nr = nrm ? nrm[1] : '';
      var fn = h.match(new RegExp('(?:invoice_first_name|first_name)' + q + '\\s*:\\s*' + q + '([^"&]{1,40})' + q, 'i'));
      d.naam = fn ? fn[1].trim() : '';
      try { d.naam = JSON.parse('"' + d.naam + '"'); } catch (e) {}
      d.afhalen = new RegExp('shipping_method' + q + '\\s*:\\s*' + q + '?[^,}]*(?:pickup|afhal|ophal|collect)', 'i').test(h) || /afhalen in loosbroek|pick-?up/i.test((h.match(/shipping[^]{0,200}/i) || [''])[0]);
      d.mollie = attr(h, 'mollie-id'); d.endpoint = attr(h, 'endpoint'); d.pendingId = attr(h, 'pending-identifier');
      var stm = h.match(new RegExp('payment_status' + q + '\\s*:\\s*\\{[^}]*?identifier' + q + '\\s*:\\s*' + q + '([A-Za-z_]+)', 'i'));
      d.status = stm ? stm[1] : '';
      return d;
    }
    function isFout(s) { return /cancel|fail|expir|declin|refus|annul|mislukt/i.test(s || ''); }
    function beslis(d) {
      var start = Date.now();
      function klaarMet(s, pending) {
        if (isFout(s)) { terugFout(taal === 'nl' ? 'De betaling is niet afgerond. Probeer het gerust nog een keer.' : 'The payment was not completed. Please try again.'); return; }
        d.status = s || d.status; d.pending = !!pending; toonBedankt(d);
      }
      if (d.status && d.status !== d.pendingId && !d.mollie) { klaarMet(d.status); return; }
      if (!d.endpoint || !d.mollie) { klaarMet(d.status, d.status && d.status === d.pendingId); return; }
      (function poll() {
        fetch(d.endpoint + (d.endpoint.indexOf('?') < 0 ? '?' : '&') + 'mollie_id=' + encodeURIComponent(d.mollie), { credentials: 'same-origin', headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' } })
          .then(function (r) { return r.json(); })
          .then(function (j) {
            var id = (j && (j.identifier || (j.status && j.status.identifier) || j.status)) || '';
            if (id && id !== d.pendingId) { klaarMet(String(id)); return; }
            if (Date.now() - start > 12000) { klaarMet('', true); return; }
            setTimeout(poll, 1200);
          })
          .catch(function () { if (Date.now() - start > 6000) klaarMet(d.status, true); else setTimeout(poll, 1200); });
      })();
    }
    // Afkeuring van Driver (/bestellen of /winkelwagen met $notify): verbergen en terug naar de checkout in de widget.
    if (!bedankt) {
      document.documentElement.style.visibility = 'hidden';
      var vt = setTimeout(function () { document.documentElement.style.visibility = ''; }, 8000);
      var fk = function () {
        var nm = (document.documentElement.innerHTML || '').match(/[$]notify[(][{] *message: *'([^']{1,600})'/), msg = '';
        if (nm) { msg = nm[1]; [['Invoice salutation', 'Aanhef'], ['Invoice first name', 'Voornaam'], ['Invoice last name', 'Achternaam'], ['Invoice email', 'E-mailadres'], ['Invoice street', 'Straat'], ['Invoice house number', 'Huisnummer'], ['Invoice zip', 'Postcode'], ['Invoice city', 'Plaats'], ['Invoice country', 'Land'], ['Invoice phone', 'Telefoonnummer'], ['Shipping method', 'Verzendmethode'], ['Payment method', 'Betaalmethode']].forEach(function (v) { msg = msg.split(v[0]).join(v[1]); }); }
        terugFout(msg);
      };
      // Vue kan de bedankcomponent al vervangen hebben: de ruwe HTML van deze pagina beslist dan of het toch de bedankpagina is.
      fetch(location.href, { credentials: 'same-origin' }).then(function (r) { return r.text(); }).then(function (h) {
        if (isBed(h) && !/[$]notify[(]/.test(h)) { clearTimeout(vt); bouw(); document.documentElement.style.visibility = ''; beslis(gegevens(h)); }
        else if (R && /winkelwagen|bestellen/i.test(pad)) { if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fk); else fk(); }
        else { clearTimeout(vt); document.documentElement.style.visibility = ''; }
      }).catch(function () { clearTimeout(vt); document.documentElement.style.visibility = ''; });
      return;
    }
    // Vue kan het element met de props al vervangen hebben; dan de ruwe HTML van dezelfde pagina ophalen.
    var d0 = gegevens(html0);
    if (d0.mollie || d0.nr) beslis(d0);
    else fetch(location.href, { credentials: 'same-origin' }).then(function (r) { return r.text(); }).then(function (h) { beslis(gegevens(h)); }).catch(function () { beslis(d0); });
  })();
  var SVG = '<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 2h4M10.5 2v5.2c0 .6-.3 1.1-.8 1.5C8.6 9.6 8 10.9 8 12.3V20a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-7.7c0-1.4-.6-2.7-1.7-3.6-.5-.4-.8-.9-.8-1.5V2"/><path d="M8 14h8v4H8z"/></svg>';
  // Desktop: bij een open paneel staat de inklapknop rechts op de plek van de laatste knop; schuif de fles ernaast.
  var st = document.getElementById('bw-shop-launcher-css'); if (!st) { st = document.createElement('style'); st.id = 'bw-shop-launcher-css'; document.head.appendChild(st); } st.textContent = "@media (min-width:640px){#booking-widget.is-open #bwShopLauncher{margin-right:56px}}@media (max-width:639px){html #booking-widget.bw-met-shop [data-booking-widget-open=\"book\"],html #booking-widget.bw-met-shop.is-open [data-booking-widget-open=\"book\"]{padding-left:16px!important;padding-right:14px!important}html #booking-widget.bw-met-shop [data-booking-widget-open=\"book\"] svg{display:none!important}}@media (max-width:370px){html body #booking-widget.bw-met-shop [data-booking-widget-open=\"book\"],html body #booking-widget.bw-met-shop.is-open [data-booking-widget-open=\"book\"]{padding-left:12px!important;padding-right:12px!important}html body #booking-widget.bw-met-shop>div.fixed:not(#booking-widget-panel){gap:6px!important}}";
  // Mobiel: met de fles erbij past de rij alleen als Reserveren zonder icoon staat (anders schuift hij onder de chatknop).
  // 1 nov 2026 (Dennis): geen laadtijd en geen flits van de reserveringswidget. De webshop laadt op de achtergrond in een eigen,
  // onzichtbare iframe (#bwShopFrame) boven de reserveringsiframe; de fles schuift die direct in beeld. Reserveren, cadeaubon of
  // sluiten haalt hem weg, behalve tijdens een lopende bestelling (sessionStorage bw-shop-order, zie n8n 'Webshop terug in widget').
  // intent=1 in de URL: anders klapt het sluitscript in de widget ('Niet automatisch openen') een al open paneel dicht bij het voorladen.
  window.__busShopVoor = 1;
  var SF = null, sfKlaar = false, bezig = false;
  function hw() { return document.getElementById('booking-widget'); }
  function hoofd() { var h = hw(); return h && h.querySelector('#booking-widget-panel iframe:not(#bwShopFrame)'); }
  function vlag() { var t = 0; try { t = +sessionStorage.getItem('bw-shop-order') || 0; } catch (e) {} return t && Date.now() - t < 7200000; }
  function shopUrl() {
    var h = hw(), u = ((h && h.dataset && h.dataset.url) || '/reserveren/widget') + '?launcher=0&modal=1&shop=1&intent=1';
    if (taal && taal !== 'nl') u += '&lang=' + taal;
    return u;
  }
  function voorladen() {
    if (SF) return SF;
    var f = hoofd(); if (!f || !f.parentNode) return null;
    SF = document.createElement('iframe');
    SF.id = 'bwShopFrame'; SF.title = label; SF.setAttribute('allow', 'payment'); SF.setAttribute('tabindex', '-1');
    SF.className = 'block w-full h-full border-0';
    SF.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;border:0;z-index:5;visibility:hidden;background:#F7F4EE';
    SF.addEventListener('load', function () {
      var h2 = ''; try { h2 = SF.contentWindow.location.href; } catch (e) { h2 = 'x'; }
      if (h2 === 'about:blank') return;
      sfKlaar = true;
      setTimeout(geefProduct, 0);
      var h = hw(); if (h && h.classList.contains('bw-shop-actief')) { SF.style.visibility = 'visible'; var m = hoofd(); if (m) m.style.visibility = ''; h.classList.add('is-ready'); }
    });
    var na = window.__bwShopNa; window.__bwShopNa = null;
    // 9 nov 2026: eerst in de pagina en aan de haak van WIDGET ZONDER N8N-RUN, dan pas de src (statische kopie als die vers is).
    f.parentNode.appendChild(SF);
    if (window.__busHaakIframe) window.__busHaakIframe(SF);
    SF.src = shopUrl() + (na ? (na.s === 'besteld' ? '&besteld=1' + (na.nr ? '&nr=' + na.nr : '') : '&shopfout=1' + (na.msg ? '&msg=' + na.msg : '')) : '');
    return SF;
  }
  function toon() {
    var h = hw(); if (!h) return false;
    var s = voorladen(); if (!s) return false;
    h.classList.add('bw-shop-actief');
    s.removeAttribute('tabindex');
    if (sfKlaar) { s.style.visibility = 'visible'; h.classList.add('is-ready'); }
    else { var m = hoofd(); if (m) m.style.visibility = 'hidden'; h.classList.remove('is-ready'); }
    return true;
  }
  function verberg() {
    var h = hw(); if (!h || !SF) return;
    h.classList.remove('bw-shop-actief');
    SF.style.visibility = 'hidden'; SF.setAttribute('tabindex', '-1');
    var m = hoofd(); if (m) m.style.visibility = '';
    var q = ''; try { q = SF.contentWindow.location.search + '|' + SF.contentWindow.location.pathname; } catch (e) { q = 'x'; }
    if (/besteld=1|shopfout=1/.test(q) || q.indexOf('/reserveren/widget') < 0) { sfKlaar = false; SF.src = shopUrl(); }
  }
  function waak() {
    var h = hw(); if (!h || h.__bwShopWaak) return; h.__bwShopWaak = 1;
    new MutationObserver(function () {
      if (!h.classList.contains('is-open') && h.classList.contains('bw-shop-actief') && !vlag()) setTimeout(function () { if (!h.classList.contains('is-open')) verberg(); }, 350);
    }).observe(h, { attributes: true, attributeFilter: ['class'] });
    document.addEventListener('click', function (e) {
      if (bezig) return;
      var t = e.target && e.target.closest && e.target.closest('[data-booking-widget-open]');
      if (t && h.classList.contains('bw-shop-actief')) { try { sessionStorage.removeItem('bw-shop-order'); } catch (x) {} verberg(); }
    }, true);
  }
  function startVoorladen() {
    // 9 nov 2026 (n8n-executiebudget): NIET meer bij elk paginabezoek voorladen; elke voorlading is een betaalde n8n-executie
    // (43% van alle widgetruns). Nu pas bij intentie: hover, aanraken of focus op de flesknop. Aanraken gaat de klik ~100-300 ms
    // voor, dus de shop staat er vrijwel meteen. Loopt er een bestelling (bw-shop-order), dan wel direct voorladen.
    try { if (navigator.connection && navigator.connection.saveData) return; } catch (e) {}
    var gedaan = false;
    var go = function () { if (gedaan) return; waak(); if (voorladen()) gedaan = true; };
    if (vlag()) { if (document.readyState === 'complete') go(); else window.addEventListener('load', go); return; }
    var b = document.getElementById('bwShopLauncher'); if (!b) return;
    ['pointerenter', 'pointerdown', 'touchstart', 'focus'].forEach(function (ev) { b.addEventListener(ev, go, { passive: true }); });
  }
  function zetShop(poging, product) {
    // Terugval als de voorgeladen iframe er (nog) niet kan komen: oude werkwijze in de hoofdiframe.
    var f = document.querySelector('iframe[src*="/reserveren/widget"]:not(#bwShopFrame)');
    if (!f) { if (poging < 20) setTimeout(function () { zetShop(poging + 1, product); }, 100); return; }
    var url = new URL(f.getAttribute('src') || '/reserveren/widget', location.href);
    ['gift', 'category', 'type', 'arrangement', 'service', 'service_code', 'intent', 'product'].forEach(function (k) { url.searchParams.delete(k); });
    url.searchParams.set('launcher', '0'); url.searchParams.set('modal', '1'); url.searchParams.set('shop', '1');
    if (product) { url.searchParams.set('product', product); url.searchParams.set('intent', '1'); wilProduct = ''; }
    f.src = url.pathname + url.search;
  }
  // === PRODUCTLINKS NAAR DE WEBSHOP IN DE WIDGET (Dennis 2 nov 2026) ===
  // Een klik op een productlink van de site (Meer info, titel of foto: https://buswhisky.com/<slug>/<driverId>) opent de
  // webshop in de widget met dat product bovenaan en uitgevouwen (n8n TDOHm6WLSfFVNSEo, script bw-sp-js: __bwToonProduct).
  // Alleen voor producten die de webshop echt verkoopt (lijst uit de voorgeladen webshop, anders de laatst bekende lijst);
  // uitverkochte producten, ctrl/cmd/shift/middelklik en target=_blank gaan gewoon naar de productpagina.
  // Deeplink van buiten: #webshop?product=<id> (of alleen #webshop voor het overzicht).
  var PIDS = ['12', '80', '8', '38', '92', '5', '19', '18', '20', '30', '6', '7', '4', '78', '85', '86', '87'];
  var wilProduct = '';
  function shopIds() {
    try { var fn = SF && SF.contentWindow && SF.contentWindow.__bwShopIds; var l = fn ? fn() : null; if (l && l.length) { try { localStorage.setItem('bw-shop-ids', l.join(',')); } catch (e) {} return l; } } catch (e) {}
    try { var c = localStorage.getItem('bw-shop-ids'); if (c) return c.split(','); } catch (e) {}
    return PIDS;
  }
  function productVan(a) {
    var href = a.getAttribute('href') || ''; if (!href || href.charAt(0) === '#') return '';
    var tg = (a.getAttribute('target') || '').toLowerCase(); if (tg && tg !== '_self' && tg !== '_top' && tg !== '_parent') return '';
    var u; try { u = new URL(href, location.href); } catch (e) { return ''; }
    if (!/(^|[.])buswhisky[.]com$/i.test(u.hostname)) return '';
    var m = u.pathname.match(/^[/](?:[a-z]{2}[/])?[a-z0-9][a-z0-9-]*[/]([0-9]{1,6})[/]?$/i); if (!m) return '';
    return shopIds().indexOf(m[1]) >= 0 ? m[1] : '';
  }
  function geefProduct() {
    if (!wilProduct || !SF || !sfKlaar) return;
    var id = wilProduct, fn = null;
    try { fn = SF.contentWindow.__bwToonProduct; } catch (e) {}
    wilProduct = '';
    if (typeof fn === 'function') { try { fn(id); } catch (e) {} return; }
    // Oudere widget-HTML zonder __bwToonProduct: opnieuw laden met product in de URL.
    sfKlaar = false; SF.src = shopUrl() + '&product=' + encodeURIComponent(id);
    var h = hw(); if (h && h.classList.contains('bw-shop-actief')) { SF.style.visibility = 'hidden'; h.classList.remove('is-ready'); }
  }
  function openProduct(id) {
    var h = hw(), bk = document.querySelector('[data-booking-widget-open="book"]');
    if (!h || !bk) return false;
    wilProduct = id ? String(id) : '';
    window.__busOpenKlik = Date.now(); window.__busBoekIntent = Date.now();
    waak();
    if (!h.classList.contains('is-open')) { bezig = true; try { bk.click(); } finally { bezig = false; } }
    if (toon()) { geefProduct(); } else zetShop(0, wilProduct);
    return true;
  }
  if (!window.__bwProductLinks) {
    window.__bwProductLinks = 1;
    window.addEventListener('click', function (e) {
      if (e.defaultPrevented || e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
      var a = e.target && e.target.closest && e.target.closest('a[href]'); if (!a || a.closest('#booking-widget')) return;
      if (document.querySelector('[data-bus-shop="uit"],meta[name="bus-shop"][content="uit"]')) return;
      var id = productVan(a); if (!id) return;
      if (!openProduct(id)) return;
      e.preventDefault(); e.stopPropagation(); if (e.stopImmediatePropagation) e.stopImmediatePropagation();
    }, true);
    var hashProduct = function () {
      if (!/^#webshop([?&]|$)/i.test(location.hash)) return;
      var m = location.hash.match(/[?&]product=([0-9]{1,6})/), id = m ? m[1] : '';
      try { history.replaceState(history.state, '', location.pathname + location.search); } catch (e) {}
      if (document.querySelector('[data-bus-shop="uit"],meta[name="bus-shop"][content="uit"]')) return;
      (function probeer(n) { var k = document.querySelector('[data-booking-widget-open="book"]'); if (k && hw() && document.readyState === 'complete') { setTimeout(function () { openProduct(id); }, 400); return; } if (n < 60) setTimeout(function () { probeer(n + 1); }, 150); })(0);
    };
    hashProduct(); window.addEventListener('hashchange', hashProduct);
  }
  function plaats() {
    if (document.querySelector('[data-bus-shop="uit"],meta[name="bus-shop"][content="uit"]')) return true;
    if (document.getElementById('bwShopLauncher')) return true;
    var g = document.querySelector('[data-booking-widget-open="gift"]');
    if (!g) return false;
    var b = g.cloneNode(false);
    b.removeAttribute('data-booking-widget-open'); b.removeAttribute('aria-controls'); b.removeAttribute('aria-expanded');
    b.id = 'bwShopLauncher'; b.type = 'button'; b.title = label; b.setAttribute('aria-label', label);
    b.innerHTML = SVG;
    g.parentNode.insertBefore(b, g.nextSibling);
    var hw = document.getElementById('booking-widget'); if (hw) hw.classList.add('bw-met-shop');
    b.addEventListener('click', function (e) {
      e.preventDefault(); e.stopPropagation();
      window.__busOpenKlik = Date.now(); window.__busBoekIntent = Date.now();
      var bk = document.querySelector('[data-booking-widget-open="book"]');
      waak();
      bezig = true; try { if (bk) bk.click(); } finally { bezig = false; }
      if (!toon()) zetShop(0);
    });
    if (window.__bwShopNa) { waak(); setTimeout(function () { b.click(); }, 300); } else startVoorladen();
    return true;
  }
  if (!plaats()) { var n = 0, iv = setInterval(function () { if (plaats() || ++n > 40) clearInterval(iv); }, 250); }
// BUS_CORE_V3_ANCHOR
})();

// BUS_UNIFIED_AGE_CONSENT_V4 UITGESCHAKELD 4 nov 2026: vervangen door BUS_AGECHECK_CONSENT_V5 in bus-agegate.js
(function(){
'use strict';
return;
window.__busUnifiedAgeConsentV4=true;
var KEY='bus_age_18plus_v3', YEAR_MS=365*24*60*60*1000;
var modal=null,style=null,closing=false,submitted=false;
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
 if(ageOK()){y.value=String(new Date().getFullYear()-25);y.closest('label') /* no-op */}
 modal.querySelector('#bus-unified-next').addEventListener('click',submit);
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
  removeModal();removeNativeHide();
 }catch(e){closing=false;button.disabled=false;button.textContent='Verder';error('Cookievoorkeuren opslaan is niet gelukt. Probeer opnieuw.')}
}
function start(){
 if(!document.body){document.addEventListener('DOMContentLoaded',start,{once:true});return}
 if(ageOK()&&consentOK()){removeNativeHide();return}
 build();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
window.addEventListener('CookiebotOnDialogDisplay',function(){if(modal)hideNative()});
window.addEventListener('CookiebotOnConsentReady',function(){if(modal)hideNative()});
})();

// === BUS FANZONE OP BUSWHISKY.COM (Dennis 7 nov 2026) ===
// De fanzone draait hier, over de site heen (?fanzone=1). De pagina komt als JSON van n8n (fanzone?fmt=json) en staat in een
// iframe met srcdoc, zodat hij op buswhisky.com zelf draait: reserveren, de webshop en het Dutch Whisky Event openen in de
// widget OVER de fanzone, de winkelmand is gewoon die van de site en na het betalen kom je terug op ?fanzone=1.
// Inloggen: de losse n8n-pagina stuurt een ingelogde fan door naar /?fanzone=1#fzs=<sessie>. De sessie staat daarna in
// localStorage busFzSess. Sluiten (kruisje in de fanzone) haalt ?fanzone=1 weg. Terugknop "Terug naar je fanzone"
// verschijnt 2 uur lang op andere pagina's nadat je vanuit de fanzone iets opende.
(function () {
  'use strict';
  try { if (window.top !== window || window.__busFzHost) return; } catch (e) { return; }
  window.__busFzHost = 1;
  if (!/(^|[.])buswhisky[.]com$/i.test(location.hostname) && !window.__busFzTest) return;
  var BASE = 'https://buswhiskyevents.app.n8n.cloud/webhook/fanzone';
  var KS = 'busFzSess', KT = 'busFzTerug', KP = 'busFanProfielV1';
  function ls(k, v) { try { if (v === undefined) return localStorage.getItem(k); if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) {} return null; }
  var TOK = /^[A-Za-z0-9_-]{30,80}$/;
  var q = new URLSearchParams(location.search);
  var hp = new URLSearchParams(String(location.hash || '').replace(/^#/, ''));
  var hs = hp.get('fzs') || q.get('fzs');
  if (hs && TOK.test(hs)) ls(KS, hs);
  // 10 nov 2026: de inlogmail linkt naar /?fanzone=1#fzl=<token>; de fanzonelaag logt dan zelf in, zonder n8n-tussenpagina's.
  var hl = hp.get('fzl') || q.get('fzl'); if (!(hl && TOK.test(hl))) hl = '';
  var KH = 'busFzHtml', vteller = 0, aangeraakt = false;
  var start = { tab: hp.get('tab') || q.get('tab') || '', fles: hp.get('fles') || q.get('fles') || '', product: hp.get('product') || q.get('product') || '', hash: hp.get('hash') || '', m: hp.get('m') || '', login: hl };
  var wil = q.get('fanzone') === '1' || !!hs || !!hl;
  if (hs || hl) { try { var uz = new URL(location.href); uz.searchParams.delete('fzs'); history.replaceState(history.state, '', uz.pathname + uz.search); } catch (e) {} }
  var ov = null, fr = null, laad = null, nr = 0;
  function css() {
    if (document.getElementById('bus-fz-css')) return;
    var s = document.createElement('style'); s.id = 'bus-fz-css';
    s.textContent = '#busFz{position:fixed;inset:0;z-index:45;background:#0D0B09;display:block}#busFz iframe{position:absolute;inset:0;width:100%;height:100%;border:0;display:block;background:#0D0B09}'
      + '#busFz .bfz-laad{position:absolute;left:50%;top:50%;width:38px;height:38px;margin:-19px 0 0 -19px;border-radius:50%;border:3px solid rgba(227,168,87,.2);border-top-color:#E3A857;animation:bfzDraai .8s linear infinite;pointer-events:none}#busFz .bfz-laad[hidden]{display:none}'
      + '@keyframes bfzDraai{to{transform:rotate(360deg)}}#busFz .bfz-fout{position:absolute;left:16px;right:16px;top:40%;padding:18px;border-radius:16px;background:#18130F;border:1px solid #3A2B1E;color:#F3EBDD;font:15px/1.5 Inter,system-ui,sans-serif;text-align:center}#busFz .bfz-fout a{color:#E3A857}'
      + 'html.bus-fz-aan,html.bus-fz-aan body{overflow:hidden!important}html.bus-fz-aan #bwChatKnop,html.bus-fz-aan .chat-window-toggle,html.bus-fz-aan .chat-window-wrapper,html.bus-fz-aan #bwZwart,html.bus-fz-aan #bw-zwart{display:none!important}'
      + '#busFzTerug{position:fixed;left:16px;bottom:calc(16px + env(safe-area-inset-bottom));z-index:41;display:flex;align-items:center;gap:8px;height:48px;padding:0 18px;border-radius:999px;border:0;background:#14110F;color:#E3A857;font:600 15px/1 Inter,system-ui,sans-serif;box-shadow:0 4px 16px rgba(0,0,0,.45),0 0 0 2px #E3A857;cursor:pointer}';
    (document.head || document.documentElement).appendChild(s);
  }
  function metParam(aan) {
    try { var u = new URL(location.href); if (aan) u.searchParams.set('fanzone', '1'); else { u.searchParams.delete('fanzone'); u.searchParams.delete('fles'); u.searchParams.delete('product'); u.searchParams.delete('tab'); } history.replaceState(history.state, '', u.pathname + u.search + u.hash); } catch (e) {}
  }
  function bouw() {
    if (ov) return;
    css();
    ov = document.createElement('div'); ov.id = 'busFz'; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-label', 'Bus Fanzone');
    fr = document.createElement('iframe'); fr.title = 'Bus Fanzone'; fr.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin'); fr.setAttribute('allow', 'clipboard-write; fullscreen; autoplay; encrypted-media; picture-in-picture; web-share');
    laad = document.createElement('div'); laad.className = 'bfz-laad';
    ov.appendChild(fr); ov.appendChild(laad);
    (document.body || document.documentElement).appendChild(ov);
    document.documentElement.classList.add('bus-fz-aan');
    var t = document.getElementById('busFzTerug'); if (t) t.remove();
  }
  function fout(tekst) {
    if (!ov) return; laad.hidden = true;
    var s = ls(KS), d = document.createElement('div'); d.className = 'bfz-fout';
    d.innerHTML = tekst + '<br><br><a href="' + BASE + (s ? '?s=' + encodeURIComponent(s) + '&solo=1' : '?solo=1') + '">Open de fanzone los</a> of <a href="#" data-dicht>sluit</a>';
    d.querySelector('[data-dicht]').onclick = function (e) { e.preventDefault(); sluit(); };
    var oud = ov.querySelector('.bfz-fout'); if (oud) oud.remove(); ov.appendChild(d);
  }
  function raak(w) { try { ['click', 'keydown', 'input'].forEach(function (t) { w.addEventListener(t, function () { aangeraakt = true; }, true); }); } catch (e) {} }
  function toon(html, hash, o) {
    o = o || {};
    if (o.bewaar && html.indexOf('window.BUSFZ=') >= 0) { try { localStorage.setItem(KH, JSON.stringify({ s: ls(KS), t: Date.now(), h: html })); } catch (e) { ls(KH, null); } }
    if (o.wissel && fr && ov) {
      if (aangeraakt) return;
      var mijnW = ++nr, oudF = fr, nf = document.createElement('iframe');
      nf.title = oudF.title; nf.setAttribute('referrerpolicy', oudF.getAttribute('referrerpolicy') || ''); nf.setAttribute('allow', oudF.getAttribute('allow') || '');
      nf.style.visibility = 'hidden'; ov.insertBefore(nf, laad);
      nf.onload = function () {
        nf.onload = null;
        if (mijnW !== nr || aangeraakt || !ov) { nf.remove(); return; }
        var y = 0, hh = ''; try { y = oudF.contentWindow.scrollY || 0; hh = oudF.contentWindow.location.hash || ''; } catch (e) {}
        try { if (hh) nf.contentWindow.location.hash = hh; if (y) nf.contentWindow.scrollTo(0, y); } catch (e) {}
        nf.style.visibility = ''; oudF.remove(); fr = nf; raak(nf.contentWindow);
      };
      nf.srcdoc = html; return;
    }
    var mijn = ++nr; laad.hidden = true; var oud = ov.querySelector('.bfz-fout'); if (oud) oud.remove();
    fr.onload = function () { if (mijn !== nr) return; raak(fr.contentWindow); try { if (hash) fr.contentWindow.location.hash = hash; fr.contentWindow.focus(); } catch (e) {} };
    fr.srcdoc = html;
  }
  function verwerk(p, hash, o) {
    o = o || {}; var mijnV = ++vteller;
    if (!o.wissel) { aangeraakt = true; laad.hidden = false; }
    p.then(function (r) { return r.json(); }).then(function (j) {
      if (mijnV !== vteller || !ov) return;
      if (j && j.naar) { ga(j.naar); return; }
      if (j && j.html) { toon(j.html, hash, o); return; }
      if (o.wissel) return;
      if (j && j.bericht) { fout(String(j.bericht).replace(/[<>&]/g, '')); return; }
      fout('Dit lukte nu even niet.');
    }).catch(function () { if (mijnV !== vteller || o.wissel) return; fout('De fanzone is nu even niet bereikbaar.'); });
  }
  function ga(u) {
    var x; try { x = new URL(String(u), BASE); } catch (e) { return; }
    if (x.origin + x.pathname !== BASE) { location.href = x.href; return; }
    var s = x.searchParams.get('s');
    if (s && TOK.test(s)) ls(KS, s); else if (!x.searchParams.get('l') && !x.searchParams.get('q')) { ls(KS, null); ls(KH, null); }
    x.searchParams.set('fmt', 'json');
    var hash = String(x.hash || '').replace(/^#/, ''); x.hash = '';
    var alleenS = !!s; x.searchParams.forEach(function (v, k) { if (k !== 's' && k !== 'fmt') alleenS = false; });
    verwerk(fetch(x.href, { credentials: 'omit', cache: 'no-store' }), hash, { bewaar: alleenS && !hash });
  }
  function post(action, o) {
    var x; try { x = new URL(String(action), BASE); } catch (e) { return; }
    var b = new URLSearchParams(); for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) b.append(k, o[k] == null ? '' : String(o[k]));
    b.set('fmt', 'json');
    verwerk(fetch(x.href, { method: 'POST', credentials: 'omit', cache: 'no-store', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: b.toString() }));
  }
  function profiel(fz) {
    var fan = String(fz || '').split('.')[0];
    if (!fan) return Promise.resolve(false);
    var o = null; try { o = JSON.parse(ls(KP) || 'null'); } catch (e) { o = null; }
    if (o && o.ok && o.tot > Date.now() && o.fz_fan === fan) return Promise.resolve(false);
    return fetch(BASE + '?a=profiel&fz=' + encodeURIComponent(fz), { credentials: 'omit', cache: 'no-store' }).then(function (r) { return r.json(); }).then(function (p) {
      if (!p || !p.ok) return false;
      p.tot = Date.now() + 30 * 86400000; p.fz_fan = fan; ls(KP, JSON.stringify(p)); return true;
    }).catch(function () { return false; });
  }
  function herlaadWidget() {
    var fs = document.querySelectorAll('#booking-widget iframe');
    for (var i = 0; i < fs.length; i++) { var s = fs[i].getAttribute('src'); if (s) fs[i].setAttribute('src', s); }
  }
  function openWidget(o) {
    o = o || {}; var hash = o.hash || '', fz = o.fz || '';
    if (o.href) { try { var x = new URL(o.href); hash = x.hash || '#reserveren'; fz = x.searchParams.get('fz') || fz; } catch (e) { return; } }
    if (!/^#(webshop|reserveren|cadeaubon|gstpln)/.test(hash)) hash = '#reserveren';
    ls(KT, String(Date.now()));
    profiel(fz).then(function (nieuw) {
      if (nieuw) herlaadWidget();
      if (location.hash === hash) { try { history.replaceState(history.state, '', location.pathname + location.search); } catch (e) {} }
      location.hash = hash;
    });
  }
  // 10 nov 2026 (Dennis): een WhatsApp-link opende op de telefoon een nieuw tabblad (wa.me); terug in de browser zag je een
  // wit scherm. Op de telefoon gaat een WhatsApp-tekst nu via het deelmenu van de telefoon, je blijft gewoon in de fanzone.
  function mobiel() { var u = navigator.userAgent || ''; return /iP(hone|ad|od)|Android/i.test(u) || (/Macintosh/.test(u) && (navigator.maxTouchPoints || 0) > 1); }
  function extern(u) {
    if (/^(mailto|tel|sms):/i.test(u)) { location.href = u; return; }
    if (/^https:\/\/(wa\.me|api\.whatsapp\.com)\//i.test(u) && mobiel() && navigator.share) {
      var t = ''; try { t = new URL(u).searchParams.get('text') || ''; } catch (e) { t = ''; }
      if (t) { try { navigator.share({ text: t }).catch(function (e) { if (e && e.name === 'NotAllowedError') { try { window.open(u, '_blank', 'noopener'); } catch (x) {} } }); return; } catch (e) {} }
    }
    try { window.open(u, '_blank', 'noopener'); } catch (e) { location.href = u; }
  }
  function kopieer(t) {
    try { if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(String(t)).catch(oud); return; } } catch (e) {}
    oud();
    function oud() { var a = document.createElement('textarea'); a.value = String(t); a.style.cssText = 'position:fixed;top:-100px;opacity:0'; document.body.appendChild(a); a.select(); try { document.execCommand('copy'); } catch (e) {} a.remove(); }
  }
  function sluit() { if (ov) ov.remove(); ov = null; fr = null; document.documentElement.classList.remove('bus-fz-aan'); metParam(false); ls(KT, null); }
  function open(s0) {
    s0 = s0 || {};
    bouw(); metParam(true);
    if (s0.login) {
      verwerk(fetch(BASE + '-api', { method: 'POST', credentials: 'omit', cache: 'no-store', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'actie=inloggen&fmt=json&l=' + encodeURIComponent(s0.login) }));
      return;
    }
    var s = ls(KS), u = BASE + '?fmt=json' + (s ? '&s=' + encodeURIComponent(s) : '');
    // 10 nov 2026: meteen de laatst bekende fanzone tonen (zelfde sessie, max 24 uur oud) en stil verversen.
    var c = null, kaal = !s0.fles && !s0.product && !s0.tab && !s0.m && !s0.hash;
    if (kaal && s) { try { c = JSON.parse(localStorage.getItem(KH) || 'null'); } catch (e) { c = null; } }
    if (c && c.s === s && c.h && Date.now() - c.t < 86400000) {
      aangeraakt = false; toon(c.h, '');
      verwerk(fetch(u, { credentials: 'omit', cache: 'no-store' }), '', { wissel: true, bewaar: true });
      return;
    }
    if (s0.fles) u += '&tab=flessen&fles=' + encodeURIComponent(s0.fles);
    else if (s0.product) u += '&product=' + encodeURIComponent(s0.product);
    else if (s0.tab && /^[a-z]{2,12}$/.test(s0.tab)) u += '&tab=' + s0.tab;
    if (s0.m && /^[a-z_]{1,20}$/.test(s0.m)) u += '&m=' + s0.m;
    verwerk(fetch(u, { credentials: 'omit', cache: 'no-store' }), /^[a-z0-9/_-]{1,60}$/i.test(s0.hash || '') ? s0.hash : '', { bewaar: kaal });
  }
  window.busFz = { go: ga, post: post, open: openWidget, extern: extern, kopieer: kopieer, sluit: sluit, openFanzone: open };
  function terugKnop() {
    var t = Number(ls(KT) || 0);
    if (!t || Date.now() - t > 7200000 || !ls(KS) || document.getElementById('busFzTerug')) return;
    css();
    var b = document.createElement('button'); b.type = 'button'; b.id = 'busFzTerug'; b.textContent = 'Terug naar je fanzone';
    b.onclick = function () { b.remove(); open({}); };
    (document.body || document.documentElement).appendChild(b);
  }
  // --- Snelkoppeling op je telefoon en video's op de site zelf (7 nov 2026) ---
  // Bij ?fanzone=1 zet de site een app-manifest (Android), apple-touch-icon en app-titel (iPhone) in de head, zodat
  // "Zet op beginscherm" een eigen BUS Fanzone-icoon geeft dat de fanzone opent. Bij sluiten gaat de head terug.
  // iPhone: geen manifest, dan bewaart iOS de huidige URL; die krijgt vlak voor het toevoegen #fzs=<sessie>, zodat de
  // app (eigen opslag op iOS) meteen ingelogd opent. Android: de installatievraag van Chrome wordt opgevangen en
  // op verzoek van de fanzone getoond. busFz.video(id) speelt een YouTube-film in een laag op de site zelf.
  var bip = null, pwaWeg = [], pwaEigen = [];
  window.addEventListener('beforeinstallprompt', function (e) { try { e.preventDefault(); } catch (x) {} bip = e; });
  window.addEventListener('appinstalled', function () { bip = null; });
  function standalone() { try { return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true; } catch (e) { return false; } }
  function isIos() { var u = navigator.userAgent || ''; return /iP(hone|ad|od)/.test(u) || (/Macintosh/.test(u) && (navigator.maxTouchPoints || 0) > 1); }
  function pwaHead() {
    var hd = document.head; if (!hd || pwaEigen.length) return;
    var sel = 'link[rel="manifest"],link[rel="apple-touch-icon"],link[rel="apple-touch-icon-precomposed"],meta[name="apple-mobile-web-app-title"],meta[name="apple-mobile-web-app-capable"],meta[name="mobile-web-app-capable"],meta[name="apple-mobile-web-app-status-bar-style"],meta[name="theme-color"]';
    var oud = hd.querySelectorAll(sel);
    for (var i = 0; i < oud.length; i++) { pwaWeg.push(oud[i]); oud[i].parentNode.removeChild(oud[i]); }
    function voeg(t, a) { var x = document.createElement(t); for (var k in a) x.setAttribute(k, a[k]); x.setAttribute('data-bus-fz', '1'); hd.appendChild(x); pwaEigen.push(x); }
    voeg('meta', { name: 'apple-mobile-web-app-capable', content: 'yes' });
    voeg('meta', { name: 'mobile-web-app-capable', content: 'yes' });
    voeg('meta', { name: 'apple-mobile-web-app-title', content: 'BUS Fanzone' });
    voeg('meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' });
    voeg('meta', { name: 'theme-color', content: '#14110F' });
    voeg('link', { rel: 'apple-touch-icon', sizes: '180x180', href: BASE + '?a=icon&px=180' });
    voeg('link', { rel: 'icon', type: 'image/png', sizes: '192x192', href: BASE + '?a=icon&px=192' });
    if (!isIos()) voeg('link', { rel: 'manifest', href: BASE + '?a=manifest' });
  }
  function pwaTerug() {
    var hd = document.head; if (!hd) return;
    pwaEigen.forEach(function (x) { if (x.parentNode) x.parentNode.removeChild(x); }); pwaEigen = [];
    pwaWeg.forEach(function (x) { hd.appendChild(x); }); pwaWeg = [];
  }
  function zonderFzs() { if (/(^#|&)fzs=/.test(location.hash)) { try { history.replaceState(history.state, '', location.pathname + location.search); } catch (e) {} } }
  function install() {
    if (!bip) return Promise.resolve('geen');
    var p = bip; bip = null;
    try { p.prompt(); } catch (e) { return Promise.resolve('geen'); }
    return Promise.resolve(p.userChoice).then(function (c) { return (c && c.outcome) || 'onbekend'; }, function () { return 'onbekend'; });
  }
  function iosKlaar() { var s = ls(KS); if (s && TOK.test(s)) { try { history.replaceState(history.state, '', location.pathname + location.search + '#fzs=' + s); } catch (e) {} } }
  function video(id) {
    id = String(id || ''); if (!/^[A-Za-z0-9_-]{11}$/.test(id)) return;
    css();
    if (!document.getElementById('bus-fz-vcss')) {
      var st = document.createElement('style'); st.id = 'bus-fz-vcss';
      st.textContent = '#busFzVid{position:fixed;inset:0;z-index:60;background:rgba(0,0,0,.94);display:flex;align-items:center;justify-content:center;padding:56px 12px calc(16px + env(safe-area-inset-bottom))}'
        + '#busFzVid .bfz-vr{position:relative;width:100%;max-width:1000px;aspect-ratio:16/9;max-height:100%;background:#000;border-radius:12px;overflow:hidden}'
        + '#busFzVid iframe{position:absolute;inset:0;width:100%;height:100%;border:0}'
        + '#busFzVid .bfz-vdicht{position:absolute;top:calc(8px + env(safe-area-inset-top));right:10px;width:44px;height:44px;border-radius:50%;border:1px solid #5A4430;background:#14110F;color:#F3EBDD;font:28px/1 system-ui,sans-serif;cursor:pointer}';
      (document.head || document.documentElement).appendChild(st);
    }
    var o = document.getElementById('busFzVid'); if (o) o.remove();
    o = document.createElement('div'); o.id = 'busFzVid'; o.setAttribute('role', 'dialog'); o.setAttribute('aria-label', 'Bus TV');
    var r = document.createElement('div'); r.className = 'bfz-vr';
    var f = document.createElement('iframe'); f.title = 'Bus TV';
    f.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
    f.setAttribute('allow', 'autoplay; encrypted-media; picture-in-picture; fullscreen'); f.setAttribute('allowfullscreen', '');
    f.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&playsinline=1&rel=0&origin=' + encodeURIComponent(location.origin) + '&widget_referrer=' + encodeURIComponent(location.origin + '/');
    var b = document.createElement('button'); b.type = 'button'; b.className = 'bfz-vdicht'; b.setAttribute('aria-label', 'Sluit de film'); b.innerHTML = '&times;';
    function dicht() { document.removeEventListener('keydown', esc); if (o.parentNode) o.remove(); try { if (fr) fr.contentWindow.focus(); } catch (e) {} }
    function esc(e) { if (e.key === 'Escape') dicht(); }
    b.onclick = dicht; o.onclick = function (e) { if (e.target === o) dicht(); }; document.addEventListener('keydown', esc);
    r.appendChild(f); o.appendChild(r); o.appendChild(b); (document.body || document.documentElement).appendChild(o); b.focus();
  }
  var openOud = open, sluitOud = sluit;
  open = function (s0) { pwaHead(); return openOud(s0); };
  sluit = function () { var v = document.getElementById('busFzVid'); if (v) v.remove(); pwaTerug(); var r = sluitOud(); zonderFzs(); return r; };
  window.busFz.openFanzone = open; window.busFz.sluit = sluit;
  window.busFz.install = install; window.busFz.kanInstall = function () { return !!bip; };
  window.busFz.standalone = standalone; window.busFz.ios = isIos; window.busFz.iosKlaar = iosKlaar; window.busFz.video = video;
  window.addEventListener('message', function (e) {
    var d = e.data || {}; if (!fr || e.source !== fr.contentWindow || typeof d !== 'object') return;
    if (d.busFz === 'pwa-install') install().then(function (r) { try { fr.contentWindow.postMessage({ busFz: 'pwa-result', r: r }, '*'); } catch (x) {} });
    else if (d.busFz === 'video') video(d.id);
  });
  // --- Deelknop van de browser (Dennis 10 nov 2026) ---
  // Safari (iPhone) en Chrome delen en bookmarken de canonical-link van de pagina, niet de adresbalk. Op de homepage
  // wees die naar /homepage (404). Buiten de fanzone zetten we /homepage terug naar de echte homepage; in de fanzone
  // wordt de canonical de aanmeldlink met de vriendencode van de fan (?fanzone=1&aanmelden=1&ref=VF-...), zodat wie
  // de fanzone via de deelknop deelt een vriend naar de aanmeldpagina stuurt (EUR 10 welkomsttegoed). Nooit de sessie.
  // Alleen bij "Zet op beginscherm" (iosKlaar) staat de sessie 90 seconden in de canonical, zodat het icoon ingelogd opent.
  var DEEL = 'https://buswhisky.com/?fanzone=1&aanmelden=1', canonOud = null, ogOud = null, deelIv = null, iosTot = 0;
  function canonEl() { return document.querySelector('link[rel="canonical"]'); }
  function homeCanon() {
    var c = canonEl(); if (!c || c.getAttribute('data-bus-fz')) return;
    var h = c.getAttribute('href') || '', m = h.match(/^(https?:\/\/(?:www\.)?buswhisky\.com(?:\/[a-z]{2})?)\/homepage\/?([?#].*)?$/i);
    if (m) c.setAttribute('href', m[1] + '/');
  }
  function deelRef() {
    try { var d = fr && fr.contentDocument; if (d && d.documentElement) { var m = d.documentElement.innerHTML.match(/aanmelden=1&(?:amp;)?ref=(VF-[A-Z0-9]{4,16})/i); if (m) return m[1].toUpperCase(); } } catch (e) {}
    return '';
  }
  function deelZet() {
    if (!ov) return; var hd = document.head; if (!hd) return;
    var r = deelRef(), s = ls(KS);
    var u = (iosTot > Date.now() && s && TOK.test(s)) ? 'https://buswhisky.com/?fanzone=1&fzs=' + encodeURIComponent(s) : (r ? DEEL + '&ref=' + encodeURIComponent(r) : DEEL + '&bron=deel');
    var c = canonEl();
    if (!c) { c = document.createElement('link'); c.setAttribute('rel', 'canonical'); c.setAttribute('data-bus-fz', '1'); hd.appendChild(c); }
    else if (canonOud === null && !c.getAttribute('data-bus-fz')) canonOud = c.getAttribute('href') || '';
    if (c.getAttribute('href') !== u) c.setAttribute('href', u);
    var o = document.querySelector('meta[property="og:url"]');
    if (o) { if (ogOud === null) ogOud = o.getAttribute('content') || ''; if (o.getAttribute('content') !== u) o.setAttribute('content', u); }
  }
  function deelUit() {
    if (deelIv) { clearInterval(deelIv); deelIv = null; } iosTot = 0;
    var c = canonEl();
    if (c) { if (c.getAttribute('data-bus-fz')) c.parentNode.removeChild(c); else if (canonOud !== null) c.setAttribute('href', canonOud); }
    var o = document.querySelector('meta[property="og:url"]'); if (o && ogOud !== null) o.setAttribute('content', ogOud);
    canonOud = null; ogOud = null; homeCanon();
  }
  var openDeel = open, sluitDeel = sluit, iosKlaarOud = iosKlaar;
  open = function (s0) { var r = openDeel(s0); deelZet(); if (!deelIv) deelIv = setInterval(deelZet, 1000); return r; };
  sluit = function () { var r = sluitDeel(); deelUit(); return r; };
  iosKlaar = function () { iosTot = Date.now() + 90000; deelZet(); return iosKlaarOud(); };
  window.busFz.openFanzone = open; window.busFz.sluit = sluit; window.busFz.iosKlaar = iosKlaar;
  homeCanon(); setTimeout(homeCanon, 1500); setTimeout(homeCanon, 5000);
  function go() { if (wil) open(start); else terugKnop(); }
  if (document.body) go(); else document.addEventListener('DOMContentLoaded', go);
})();

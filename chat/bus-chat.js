// BUS Whisky website-chatbot. Bron: github.com/dhurkmans716/buswhisky-data/chat/bus-chat.js
// Wordt op buswhisky.com geladen met EEN regel: <script type="module" src="https://cdn.jsdelivr.net/gh/dhurkmans716/buswhisky-data@main/chat/bus-chat.js"></script>
// Aanpassen via n8n-hulptool "BUS Chatwidget publiceren"; de website hoeft daarvoor niet te veranderen.
// Chatmodule dynamisch laden (31 okt 2026): de rest van dit bestand draait meteen, ook als de module nog onderweg is.
var createChat = null;
var __busChatModule = import('https://cdn.jsdelivr.net/npm/@n8n/chat@1.44.7/dist/chat.bundle.es.js').then(function (m) { createChat = m.createChat; });

// === EERSTE TIK OP RESERVEREN/CADEAUBON OP MOBIEL (Dennis 31 okt 2026) ===
// app.js laadt bij pointerenter de widget alvast voor. Op een aanraakscherm verandert de pagina dan precies
// onder de vinger, waardoor iOS de eerste tik als hover ziet en geen klik geeft (pas de tweede tik opende).
// Op touch slaan we dat voorladen over; de klik laadt de widget zelf.
(function () {
  if (window.__busGeenTouchVoorladen) return;
  window.__busGeenTouchVoorladen = true;
  document.addEventListener('pointerenter', function (e) {
    if (e.pointerType === 'mouse') return;
    var t = e.target;
    if (t && t.closest && t.closest('[data-booking-widget-open]')) e.stopImmediatePropagation();
  }, true);
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
    if (/guestplan\.com$/i.test(u.hostname)) {
      if (sq.get('openGiftCardWidget')) return { soort: 'gift' };
      var gc = sq.get('serviceCode');
      return gc ? { soort: 'book', code: gc, pax: sq.get('partySize') } : { soort: 'book' };
    }
    if (hnaam === 'gstpln_opengiftcardwidget' || hnaam === 'cadeaubon') return eigen ? { soort: 'gift' } : null;
    if (hnaam === 'gstpln_openwidget') return eigen ? { soort: 'book', code: hq.get('serviceCode') || hq.get('arrangement'), pax: hq.get('partySize') || hq.get('pax') } : null;
    if (hnaam === 'reserveren') {
      if (!eigen) return null;
      return { soort: 'book', code: hq.get('arrangement') || sq.get('arrangement'), pax: hq.get('pax') || sq.get('pax') };
    }
    return null;
  }

  function open(d, poging) {
    poging = poging || 0;
    var host = document.getElementById('booking-widget');
    var ifr = host && host.querySelector('iframe');
    var knop = host && host.querySelector('[data-booking-widget-open="' + d.soort + '"]');
    var p = new URLSearchParams();
    if (d.soort === 'gift') { p.set('gift', '1'); } else { if (d.code) p.set('arrangement', d.code); if (d.pax) p.set('pax', d.pax); }
    p.set('launcher', '0'); p.set('modal', '1'); p.set('intent', '1');
    var lang = (document.documentElement.lang || '').slice(0, 2).toLowerCase();
    if (lang && lang !== 'nl') p.set('lang', lang);
    var url = ((host && host.dataset.url) || '/reserveren/widget') + '?' + p.toString();
    if (!host || !ifr || !knop) {
      if (poging < 20) { setTimeout(function () { open(d, poging + 1); }, 250); return; }
      location.href = url.replace('modal=1', 'modal=0');
      return;
    }
    window.__busBoekIntent = Date.now();
    knop.click();
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
    var p = new URLSearchParams();
    if (/[?&]gift=1/.test(src)) p.set('gift', '1');
    p.set('launcher', '0'); p.set('modal', '1');
    var lang = (document.documentElement.lang || '').slice(0, 2).toLowerCase();
    if (lang && lang !== 'nl') p.set('lang', lang);
    ifr.src = (host.dataset.url || '/reserveren/widget') + '?' + p.toString();
  }
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


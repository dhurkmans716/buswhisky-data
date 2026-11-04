// BUS_AGECHECK_CONSENT_V5 - de enige leeftijdscheck en cookiekeuze van buswhisky.com (Dennis 4 nov 2026).
// Een scherm, een knop (Verder): 18+ vastleggen (365 dagen, alleen {ok,ts}) en de cookiekeuze via de Cookiebot SDK.
// LET OP: de opslagsleutel mag GEEN cijfers bevatten. Cookiebot (uc.js removeCookieLocalStorage) wist bij elke
// consentwijziging alle localStorage-sleutels met een cijfer, ook bij alles toegestaan; daardoor verdween bus_age_18plus_v3.
// Losse module: geladen door de lader (bus-chat.js) en door de core, zodat ook bezoekers met een oude,
// 7 dagen gecachete lader deze versie krijgen. Ruimt oude V3/V4-agegates op die zo'n oude lader nog meebrengt.
// Een fout in chat, reserveren of webshop raakt deze module niet; een fout hier laat de gewone Cookiebot-banner staan.
(function () {
  'use strict';
  if (window.top !== window) return;
  if (window.__busAgeConsentV5) return;
  window.__busAgeConsentV5 = true;
  window.__busUnifiedAgeConsentV4 = true; // houdt de oude V4-kopie in een gecachete core tegen

  var KEY = 'bus_leeftijd_ok', YEAR_MS = 365 * 24 * 60 * 60 * 1000;
  var LEGACY_IDS = ['bus-unified-overlay', 'bus-unified-v4-style', 'bus-unified-hide-native', 'bus-age-fallback', 'bus-age-cookiebot', 'bus-age-cookiebot-style'];
  var dlg = null, mode = null, busy = false, touched = false;

  var LANG = (document.documentElement.lang || 'nl').slice(0, 2).toLowerCase();
  var TXT = {
    nl: { brand: 'BUS WHISKY', title: 'Welkom bij BUS', intro: 'Goede whisky heeft tijd nodig. Jij ook.', year: 'In welk jaar ben je geboren?', yearPh: 'Geboortejaar', dateIntro: 'Je wordt dit jaar 18. Vul ook je geboortedag en -maand in.', day: 'Dag', month: 'Maand', cookies: 'Cookievoorkeuren', cookiesOnly: 'Kies welke cookies je toestaat.', nec: 'Noodzakelijk', always: 'Altijd aan', pref: 'Voorkeuren', stat: 'Statistieken', mark: 'Marketing', go: 'Verder', wait: 'Even geduld...', badYear: 'Vul je geboortejaar in, bijvoorbeeld 1985.', badDate: 'Vul een geldige geboortedag en -maand in.', minor: 'Deze website is alleen voor bezoekers van 18 jaar en ouder.', foot: 'Met Verder bevestig je dat je 18+ bent en sla je je cookiekeuze op. Geniet verantwoord. NIX18.', footConsent: 'Je kunt je keuze altijd aanpassen via Cookie-instellingen onderaan de pagina.', link: 'Cookie-instellingen' },
    en: { brand: 'BUS WHISKY', title: 'Welcome to BUS', intro: 'Good whisky takes time. So do you.', year: 'What year were you born?', yearPh: 'Year of birth', dateIntro: 'You turn 18 this year. Please also enter your day and month of birth.', day: 'Day', month: 'Month', cookies: 'Cookie preferences', cookiesOnly: 'Choose which cookies you allow.', nec: 'Necessary', always: 'Always on', pref: 'Preferences', stat: 'Statistics', mark: 'Marketing', go: 'Continue', wait: 'One moment...', badYear: 'Enter your year of birth, for example 1985.', badDate: 'Enter a valid day and month of birth.', minor: 'This website is only for visitors aged 18 and over.', foot: 'By clicking Continue you confirm you are 18+ and save your cookie choice. Enjoy responsibly.', footConsent: 'You can change your choice at any time via Cookie settings at the bottom of the page.', link: 'Cookie settings' },
    de: { brand: 'BUS WHISKY', title: 'Willkommen bei BUS', intro: 'Guter Whisky braucht Zeit. Du auch.', year: 'In welchem Jahr bist du geboren?', yearPh: 'Geburtsjahr', dateIntro: 'Du wirst dieses Jahr 18. Bitte gib auch Tag und Monat an.', day: 'Tag', month: 'Monat', cookies: 'Cookie-Einstellungen', cookiesOnly: 'Wähle, welche Cookies du erlaubst.', nec: 'Notwendig', always: 'Immer an', pref: 'Präferenzen', stat: 'Statistiken', mark: 'Marketing', go: 'Weiter', wait: 'Einen Moment...', badYear: 'Gib dein Geburtsjahr ein, zum Beispiel 1985.', badDate: 'Gib einen gültigen Tag und Monat ein.', minor: 'Diese Website ist nur für Besucher ab 18 Jahren.', foot: 'Mit Weiter bestätigst du, dass du 18+ bist, und speicherst deine Cookie-Auswahl. Verantwortungsvoll genießen.', footConsent: 'Du kannst deine Auswahl jederzeit über Cookie-Einstellungen unten auf der Seite ändern.', link: 'Cookie-Einstellungen' },
    fr: { brand: 'BUS WHISKY', title: 'Bienvenue chez BUS', intro: 'Un bon whisky demande du temps. Vous aussi.', year: 'En quelle année êtes-vous né(e) ?', yearPh: 'Année de naissance', dateIntro: 'Vous avez 18 ans cette année. Indiquez aussi le jour et le mois.', day: 'Jour', month: 'Mois', cookies: 'Préférences cookies', cookiesOnly: 'Choisissez les cookies que vous autorisez.', nec: 'Nécessaires', always: 'Toujours actifs', pref: 'Préférences', stat: 'Statistiques', mark: 'Marketing', go: 'Continuer', wait: 'Un instant...', badYear: 'Saisissez votre année de naissance, par exemple 1985.', badDate: 'Saisissez un jour et un mois valides.', minor: 'Ce site est réservé aux visiteurs de 18 ans et plus.', foot: 'En cliquant sur Continuer, vous confirmez avoir 18 ans ou plus et enregistrez vos choix de cookies.', footConsent: 'Vous pouvez modifier votre choix via Paramètres cookies en bas de page.', link: 'Paramètres cookies' },
    es: { brand: 'BUS WHISKY', title: 'Bienvenido a BUS', intro: 'Un buen whisky necesita tiempo. Tú también.', year: '¿En qué año naciste?', yearPh: 'Año de nacimiento', dateIntro: 'Cumples 18 este año. Indica también el día y el mes.', day: 'Día', month: 'Mes', cookies: 'Preferencias de cookies', cookiesOnly: 'Elige qué cookies permites.', nec: 'Necesarias', always: 'Siempre activas', pref: 'Preferencias', stat: 'Estadísticas', mark: 'Marketing', go: 'Continuar', wait: 'Un momento...', badYear: 'Introduce tu año de nacimiento, por ejemplo 1985.', badDate: 'Introduce un día y mes válidos.', minor: 'Este sitio es solo para mayores de 18 años.', foot: 'Al pulsar Continuar confirmas que tienes 18+ y guardas tu elección de cookies.', footConsent: 'Puedes cambiar tu elección en Configuración de cookies al pie de la página.', link: 'Configuración de cookies' }
  };
  var T = TXT[LANG] || TXT.nl;
  // Uitleg per categorie + cookieverklaring: toestemming moet geinformeerd zijn (AVG/ePrivacy, Google EU-toestemmingsbeleid).
  var EXTRA = {
    nl: { dNec: 'Nodig voor de werking van de site, reserveren en de webshop. Altijd aan.', dPref: 'Onthoudt je keuzes, zoals taal en instellingen.', dStat: 'Inzicht in hoe bezoekers de site gebruiken (Google Analytics).', dMark: 'Advertenties en conversiemeting via Google Ads en Meta.', more: 'Welke cookies gebruiken we?', priv: 'Privacyverklaring' },
    en: { dNec: 'Required for the site, bookings and the web shop to work. Always on.', dPref: 'Remembers your choices, such as language and settings.', dStat: 'Insight into how visitors use the site (Google Analytics).', dMark: 'Advertising and conversion measurement via Google Ads and Meta.', more: 'Which cookies do we use?', priv: 'Privacy statement' },
    de: { dNec: 'Erforderlich für Website, Reservierung und Webshop. Immer an.', dPref: 'Speichert deine Auswahl, etwa Sprache und Einstellungen.', dStat: 'Einblick, wie Besucher die Website nutzen (Google Analytics).', dMark: 'Werbung und Conversion-Messung über Google Ads und Meta.', more: 'Welche Cookies verwenden wir?', priv: 'Datenschutzerklärung' },
    fr: { dNec: 'Nécessaires au fonctionnement du site, des réservations et de la boutique. Toujours actifs.', dPref: 'Mémorisent vos choix, comme la langue et les réglages.', dStat: 'Comprendre comment les visiteurs utilisent le site (Google Analytics).', dMark: 'Publicité et mesure des conversions via Google Ads et Meta.', more: 'Quels cookies utilisons-nous ?', priv: 'Déclaration de confidentialité' },
    es: { dNec: 'Necesarias para el sitio, las reservas y la tienda. Siempre activas.', dPref: 'Recuerdan tus elecciones, como idioma y ajustes.', dStat: 'Conocer cómo usan el sitio los visitantes (Google Analytics).', dMark: 'Publicidad y medición de conversiones con Google Ads y Meta.', more: '¿Qué cookies usamos?', priv: 'Declaración de privacidad' }
  };
  (function (x) { for (var k in x) T[k] = x[k]; })(EXTRA[LANG] || EXTRA.nl);

  // ---------- opslag ----------
  function ageOK() {
    try { var o = JSON.parse(localStorage.getItem(KEY) || 'null'); return !!(o && o.ok === true && Number(o.ts) > 0 && Date.now() - Number(o.ts) < YEAR_MS); } catch (e) { return false; }
  }
  function recordAge() { try { localStorage.setItem(KEY, JSON.stringify({ ok: true, ts: Date.now() })); } catch (e) {} }
  function cb() { return window.Cookiebot || null; }
  function cbReady() { var c = cb(); return !!(c && typeof c.submitCustomConsent === 'function'); }
  function consentKnown() {
    var c = cb();
    if (c && c.hasResponse) return true;
    if (c && c.consent && c.consent.stamp && c.consent.stamp !== '0') return true;
    return /(?:^|;\s*)CookieConsent=/.test(document.cookie);
  }

  // ---------- oude implementaties opruimen ----------
  function cleanLegacy() {
    for (var i = 0; i < LEGACY_IDS.length; i++) { var n = document.getElementById(LEGACY_IDS[i]); if (n) n.remove(); }
    document.documentElement.classList.remove('bus-age-pending');
  }
  var legacyObs = null;
  function watchLegacy() {
    cleanLegacy();
    if (legacyObs || !window.MutationObserver) return;
    legacyObs = new MutationObserver(function (list) {
      for (var i = 0; i < list.length; i++) {
        var add = list[i].addedNodes;
        for (var j = 0; j < add.length; j++) { if (add[j].id && LEGACY_IDS.indexOf(add[j].id) >= 0) { add[j].remove(); } }
      }
      if (dlg && !busy && mode && !dlg.isConnected) { mount(); }
    });
    legacyObs.observe(document.head, { childList: true });
    if (document.body) legacyObs.observe(document.body, { childList: true });
    setTimeout(function () { if (!mode && legacyObs) { legacyObs.disconnect(); legacyObs = null; } }, 30000);
  }

  // ---------- Cookiebot-banner alleen verbergen als ons scherm echt open staat ----------
  function hideNative(on) {
    var s = document.getElementById('bus-v5-hide-native');
    if (on && !s) {
      s = document.createElement('style'); s.id = 'bus-v5-hide-native';
      s.textContent = '#CybotCookiebotDialog,#CybotCookiebotDialogBodyUnderlay{display:none!important}';
      document.head.appendChild(s);
    } else if (!on && s) { s.remove(); }
  }

  // ---------- stijl ----------
  var CSS = '' +
    'html.bus-v5-open,html.bus-v5-open body{overflow:hidden!important}' +
    '#bus-v5-dialog{all:initial;position:fixed!important;inset:0!important;z-index:2147483647!important;width:100%!important;height:100%!important;max-width:none!important;max-height:none!important;margin:0!important;padding:16px!important;box-sizing:border-box!important;border:0!important;background:rgba(0,0,0,.82)!important;display:flex!important;align-items:flex-start!important;justify-content:center!important;overflow-y:auto!important;overflow-x:hidden!important;-webkit-overflow-scrolling:touch!important;overscroll-behavior:contain!important;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif!important;color:#fff!important}' +
    '#bus-v5-dialog::backdrop{background:transparent}' +
    '#bus-v5-dialog *{box-sizing:border-box!important;font-family:inherit!important;letter-spacing:normal;text-transform:none}' +
    '#bus-v5-card{display:block!important;width:100%!important;max-width:440px!important;margin:auto!important;background:#111!important;color:#fff!important;border:1px solid #c9a227!important;border-radius:16px!important;padding:22px 20px 18px!important;box-shadow:0 18px 60px rgba(0,0,0,.6)!important;text-align:left!important}' +
    '#bus-v5-card .b5-brand{display:block!important;font-size:13px!important;letter-spacing:.24em!important;font-weight:700!important;color:#d8b435!important;margin:0 0 8px!important}' +
    '#bus-v5-card h2{display:block!important;font-size:26px!important;line-height:1.15!important;font-weight:600!important;color:#fff!important;margin:0 0 6px!important}' +
    '#bus-v5-card p{display:block!important;font-size:14px!important;line-height:1.45!important;color:#ddd!important;margin:0 0 14px!important}' +
    '#bus-v5-card label.b5-q{display:block!important;font-size:15px!important;font-weight:600!important;color:#fff!important;margin:0 0 6px!important}' +
    '#bus-v5-card input.b5-in{display:block!important;width:100%!important;height:48px!important;border-radius:8px!important;border:2px solid #888!important;background:#fff!important;color:#111!important;font-size:18px!important;padding:0 12px!important;margin:0 0 10px!important;-webkit-appearance:none!important;appearance:none!important}' +
    '#bus-v5-card input.b5-in:focus{outline:none!important;border-color:#d5ac27!important}' +
    '#bus-v5-card .b5-row2{display:flex!important;gap:10px!important}#bus-v5-card .b5-row2>div{flex:1 1 0!important;min-width:0!important}' +
    '#bus-v5-card .b5-sub{display:block!important;font-size:15px!important;font-weight:700!important;color:#fff!important;margin:14px 0 2px!important}' +
    '#bus-v5-card .b5-opt{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:12px!important;padding:11px 0!important;border-bottom:1px solid #333!important;cursor:pointer!important;margin:0!important}' +
    '#bus-v5-card .b5-opt span{font-size:15px!important;color:#fff!important}#bus-v5-card .b5-opt small{display:block!important;font-size:12px!important;color:#aaa!important;margin-top:2px!important}' +
    '#bus-v5-card .b5-sw{position:relative!important;flex:0 0 auto!important;width:48px!important;height:28px!important}' +
    '#bus-v5-card .b5-sw input{position:absolute!important;opacity:0!important;width:100%!important;height:100%!important;margin:0!important;cursor:pointer!important;z-index:2!important}' +
    '#bus-v5-card .b5-sw i{position:absolute!important;inset:0!important;border-radius:14px!important;background:#555!important;transition:background .15s!important}' +
    '#bus-v5-card .b5-sw i:after{content:""!important;position:absolute!important;top:3px!important;left:3px!important;width:22px!important;height:22px!important;border-radius:50%!important;background:#fff!important;transition:transform .15s!important}' +
    '#bus-v5-card .b5-sw input:checked+i{background:#d5ac27!important}#bus-v5-card .b5-sw input:checked+i:after{transform:translateX(20px)!important}' +
    '#bus-v5-card .b5-sw input:disabled+i{opacity:.6!important}' +
    '#bus-v5-card .b5-sw input:focus-visible+i{outline:2px solid #fff!important;outline-offset:2px!important}' +
    '#bus-v5-card .b5-err{display:block!important;min-height:0!important;color:#ffb4a8!important;font-size:14px!important;margin:10px 0 0!important}' +
    '#bus-v5-card .b5-err:empty{display:none!important}' +
    '#bus-v5-card button.b5-go{display:block!important;width:100%!important;min-height:52px!important;margin:16px 0 0!important;border:0!important;border-radius:26px!important;background:#d5ac27!important;color:#111!important;font-size:18px!important;font-weight:700!important;cursor:pointer!important;-webkit-appearance:none!important;appearance:none!important}' +
    '#bus-v5-card button.b5-go:disabled{opacity:.7!important;cursor:wait!important}' +
    '#bus-v5-card .b5-foot{font-size:12px!important;color:#aaa!important;margin:12px 0 0!important}' +
    '#bus-v5-card .b5-more{font-size:13px!important;margin:12px 0 0!important;color:#aaa!important}#bus-v5-card .b5-more a{color:#d8b435!important;text-decoration:underline!important}' +
    '#bus-v5-decl{display:block!important;background:#fff!important;border-radius:8px!important;padding:10px!important;margin:8px 0 0!important;max-height:45vh!important;overflow:auto!important;font-size:12px!important;line-height:1.4!important}#bus-v5-decl[hidden]{display:none!important}#bus-v5-decl *{color:#111!important;font-size:12px!important}#bus-v5-decl a{text-decoration:underline!important}' +
    '@media (max-height:640px){#bus-v5-card{padding:16px 16px 14px!important}#bus-v5-card h2{font-size:22px!important}#bus-v5-card .b5-opt{padding:8px 0!important}}';
  function ensureStyle() {
    if (document.getElementById('bus-v5-style')) return;
    var s = document.createElement('style'); s.id = 'bus-v5-style'; s.textContent = CSS; document.head.appendChild(s);
  }

  // ---------- opbouw ----------
  function sw(id, label, sub, checked, disabled) {
    return '<label class="b5-opt" for="' + id + '"><span>' + label + (sub ? '<small>' + sub + '</small>' : '') + '</span>' +
      '<span class="b5-sw"><input type="checkbox" role="switch" id="' + id + '"' + (checked ? ' checked' : '') + (disabled ? ' disabled' : '') + ' aria-label="' + label + '"><i></i></span></label>';
  }
  function current() {
    var c = cb(), co = (c && c.hasResponse && c.consent) || {};
    return { p: !!co.preferences, s: !!co.statistics, m: !!co.marketing };
  }
  function build(m) {
    var cur = current();
    var d = document.createElement('dialog');
    d.id = 'bus-v5-dialog';
    d.setAttribute('aria-labelledby', 'bus-v5-title');
    var age = m === 'full';
    d.innerHTML = '<div id="bus-v5-card">' +
      '<div class="b5-brand">' + T.brand + '</div>' +
      '<h2 id="bus-v5-title">' + (age ? T.title : T.cookies) + '</h2>' +
      (age ?
        '<p>' + T.intro + '</p>' +
        '<label class="b5-q" for="bus-v5-year">' + T.year + '</label>' +
        '<input class="b5-in" id="bus-v5-year" type="text" inputmode="numeric" pattern="[0-9]*" autocomplete="bday-year" maxlength="4" placeholder="' + T.yearPh + '">' +
        '<div id="bus-v5-date" hidden><p style="margin:2px 0 8px!important">' + T.dateIntro + '</p><div class="b5-row2">' +
        '<div><label class="b5-q" for="bus-v5-day">' + T.day + '</label><input class="b5-in" id="bus-v5-day" type="text" inputmode="numeric" pattern="[0-9]*" autocomplete="bday-day" maxlength="2" placeholder="DD"></div>' +
        '<div><label class="b5-q" for="bus-v5-month">' + T.month + '</label><input class="b5-in" id="bus-v5-month" type="text" inputmode="numeric" pattern="[0-9]*" autocomplete="bday-month" maxlength="2" placeholder="MM"></div>' +
        '</div></div>' +
        '<div class="b5-sub">' + T.cookies + '</div>'
        : '<p>' + T.cookiesOnly + '</p>') +
      sw('bus-v5-nec', T.nec, T.dNec, true, true) +
      sw('bus-v5-pref', T.pref, T.dPref, cur.p) +
      sw('bus-v5-stat', T.stat, T.dStat, cur.s) +
      sw('bus-v5-mark', T.mark, T.dMark, cur.m) +
      '<p class="b5-more"><a href="#" id="bus-v5-more">' + T.more + '</a><span id="bus-v5-privwrap"> | <a href="#" id="bus-v5-priv" target="_blank" rel="noopener">' + T.priv + '</a></span></p><div id="bus-v5-decl" hidden></div>' +
      '<div class="b5-err" id="bus-v5-err" role="alert" aria-live="assertive"></div>' +
      '<button type="button" class="b5-go" id="bus-v5-go">' + T.go + '</button>' +
      '<p class="b5-foot">' + (age ? T.foot : T.footConsent) + '</p>' +
      '</div>';
    d.addEventListener('cancel', function (e) { e.preventDefault(); });
    d.addEventListener('close', function () { if (mode && !busy) { setTimeout(mount, 0); } });
    d.querySelector('#bus-v5-go').addEventListener('click', submit);
    var privA = privacyLink();
    if (privA) d.querySelector('#bus-v5-priv').href = privA.href; else d.querySelector('#bus-v5-privwrap').remove();
    d.querySelector('#bus-v5-more').addEventListener('click', function (e) {
      e.preventDefault();
      var box = d.querySelector('#bus-v5-decl'); box.hidden = !box.hidden;
      if (!box.hidden && !box.firstChild) {
        // Cookiebot zet de actuele cookieverklaring (alle cookies per categorie) zelf op de plek van dit script.
        var src = (document.getElementById('Cookiebot') || {}).src || '';
        var id = (src.match(/cbid=([0-9a-f-]+)/i) || [])[1] || '605957fe-bacb-4d3b-9fc9-0ab8b3c24b88';
        var s = document.createElement('script'); s.id = 'CookieDeclaration'; s.async = true; s.type = 'text/javascript';
        s.setAttribute('data-culture', LANG.toUpperCase());
        s.src = 'https://consent.cookiebot.com/' + id + '/cd.js';
        box.appendChild(s);
      }
    });
    ['bus-v5-pref', 'bus-v5-stat', 'bus-v5-mark'].forEach(function (id) { d.querySelector('#' + id).addEventListener('change', function () { touched = true; }); });
    var y = d.querySelector('#bus-v5-year');
    if (y) {
      var dt = d.querySelector('#bus-v5-date');
      var upd = function () { var v = y.value.replace(/\D/g, ''); if (v !== y.value) y.value = v; dt.hidden = !(v.length === 4 && Number(v) === new Date().getFullYear() - 18); };
      y.addEventListener('input', upd);
      d.querySelectorAll('input.b5-in').forEach(function (inp) { inp.addEventListener('input', function () { err(''); }); inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); submit(); } }); });
    }
    return d;
  }
  function mount() {
    if (!dlg || !mode) return;
    if (!dlg.isConnected) document.body.appendChild(dlg);
    var top = false;
    try { if (typeof dlg.showModal === 'function') { if (!dlg.open) dlg.showModal(); top = true; } } catch (e) { top = false; }
    if (!top) dlg.setAttribute('open', '');
    document.documentElement.classList.add('bus-v5-open');
    // Pas als ons scherm aantoonbaar zichtbaar is, gaat de standaardbanner weg.
    var r = dlg.getBoundingClientRect();
    hideNative(r.width > 0 && r.height > 0);
  }
  function open(m) {
    if (!document.body) { document.addEventListener('DOMContentLoaded', function () { open(m); }, { once: true }); return; }
    if (mode) return;
    try {
      ensureStyle();
      mode = m; busy = false; touched = false;
      dlg = build(m);
      watchLegacy();
      mount();
      if (m === 'full') { var y = dlg.querySelector('#bus-v5-year'); if (y && !('ontouchstart' in window)) setTimeout(function () { try { y.focus({ preventScroll: true }); } catch (e) {} }, 50); }
    } catch (e) {
      console.error('[BUS] agecheck kon niet openen', e);
      mode = null; hideNative(false); document.documentElement.classList.remove('bus-v5-open');
      if (dlg) { try { dlg.remove(); } catch (x) {} dlg = null; }
    }
  }
  function close() {
    mode = null;
    try { if (dlg && dlg.open && dlg.close) dlg.close(); } catch (e) {}
    if (dlg) dlg.remove();
    dlg = null;
    document.documentElement.classList.remove('bus-v5-open');
    cleanLegacy();
    // Cookiebot sluit zijn eigen banner na submitCustomConsent; daarna mag de verberg-regel weg.
    var s = document.getElementById('bus-unified-hide-native'); if (s) s.remove();
  }
  function err(t) { var e = dlg && dlg.querySelector('#bus-v5-err'); if (e) e.textContent = t || ''; }

  // ---------- leeftijd ----------
  function checkAge() {
    var y = dlg.querySelector('#bus-v5-year'), v = (y.value || '').trim(), now = new Date(), cy = now.getFullYear(), yr = Number(v), border = cy - 18;
    if (!/^\d{4}$/.test(v) || yr < 1900 || yr > cy) { err(T.badYear); y.focus(); return false; }
    if (yr > border) { err(T.minor); return false; }
    if (yr === border) {
      var dt = dlg.querySelector('#bus-v5-date'); dt.hidden = false;
      var dEl = dlg.querySelector('#bus-v5-day'), mEl = dlg.querySelector('#bus-v5-month');
      var day = Number(dEl.value), mon = Number(mEl.value), t = new Date(yr, mon - 1, day, 12);
      if (!day || !mon || t.getFullYear() !== yr || t.getMonth() !== mon - 1 || t.getDate() !== day) { err(T.badDate); (day ? mEl : dEl).focus(); return false; }
      var birthday18 = new Date(cy, mon - 1, day, 0, 0, 0);
      if (birthday18 > now) { err(T.minor); return false; }
    }
    return true;
  }

  // ---------- Verder ----------
  function waitForCookiebot(ms) {
    return new Promise(function (res) {
      if (cbReady()) return res(true);
      var t0 = Date.now(), iv = setInterval(function () { if (cbReady()) { clearInterval(iv); res(true); } else if (Date.now() - t0 > ms) { clearInterval(iv); res(false); } }, 100);
    });
  }
  function submit() {
    if (!dlg || busy) return;
    err('');
    var full = mode === 'full';
    if (full && !checkAge()) return;
    var pref = dlg.querySelector('#bus-v5-pref').checked, stat = dlg.querySelector('#bus-v5-stat').checked, mark = dlg.querySelector('#bus-v5-mark').checked;
    var btn = dlg.querySelector('#bus-v5-go');
    busy = true; btn.disabled = true; btn.textContent = T.wait;
    if (full) recordAge();
    waitForCookiebot(8000).then(function (ok) {
      if (ok) {
        try { cb().submitCustomConsent(pref, stat, mark); }
        catch (e) { console.error('[BUS] Cookiebot submitCustomConsent mislukt', e); ok = false; }
      }
      busy = false;
      close();
      if (ok) {
        // De keuze is opgeslagen. Cookiebot laat zijn eigen (verborgen) banner dan nog open staan: sluiten en verborgen
        // houden, anders verschijnt er alsnog een tweede cookiepopup. Opnieuw kiezen gaat via ons scherm (renew is omgeleid).
        hideNative(true);
        try { if (typeof cb().hide === 'function') cb().hide(); } catch (e) {}
      }
      // Geen Cookiebot beschikbaar: niet vastlopen, de standaardbanner van Cookiebot mag dan zelf vragen.
      if (!ok) { hideNative(false); console.warn('[BUS] Cookiebot niet beschikbaar; standaardbanner blijft actief'); }
    });
  }

  // ---------- cookie-instellingen opnieuw openen ----------
  window.BUSConsent = { open: function () { open(ageOK() ? 'consent' : 'full'); }, ageOK: ageOK };
  function privacyLink() {
    var eigen = [].filter.call(document.querySelectorAll('a[href*="privacy"]'), function (x) { return !x.closest('#CybotCookiebotDialog') && !x.closest('#bus-v5-dialog') && x.host === location.host; });
    return eigen.filter(function (x) { return x.getBoundingClientRect().width > 0; })[0] || eigen[0] || null;
  }
  function footerLink() {
    if (document.getElementById('bus-v5-cookielink')) return;
    var priv = privacyLink();
    var a = document.createElement('a');
    a.id = 'bus-v5-cookielink'; a.href = '#cookie-instellingen'; a.textContent = T.link;
    a.addEventListener('click', function (e) { e.preventDefault(); window.BUSConsent.open(); });
    if (priv && priv.parentNode) {
      a.className = priv.className;
      var holder = priv.parentNode.tagName === 'LI' ? priv.parentNode : null;
      if (holder) { var li = holder.cloneNode(false); li.appendChild(a); holder.parentNode.insertBefore(li, holder.nextSibling); }
      else { priv.parentNode.insertBefore(a, priv.nextSibling); priv.parentNode.insertBefore(document.createTextNode(' '), a); }
    }
  }
  function patchRenew() {
    var c = cb();
    if (!c || c.__busV5Renew || typeof c.renew !== 'function') return;
    c.__busV5Renew = true;
    c.renew = function () { window.BUSConsent.open(); };
  }
  window.addEventListener('hashchange', function () { if (/^#cookie-?(instellingen|settings)$/i.test(location.hash)) window.BUSConsent.open(); });

  // ---------- Cookiebot-events ----------
  window.addEventListener('CookiebotOnLoad', patchRenew);
  window.addEventListener('CookiebotOnConsentReady', function () {
    patchRenew();
    if (dlg && !touched && !busy) { var cur = current(); dlg.querySelector('#bus-v5-pref').checked = cur.p; dlg.querySelector('#bus-v5-stat').checked = cur.s; dlg.querySelector('#bus-v5-mark').checked = cur.m; }
  });
  window.addEventListener('CookiebotOnDialogDisplay', function () {
    // Cookiebot wil zelf iets vragen: dan tonen wij ons ene scherm in plaats van zijn banner.
    if (!mode) open(ageOK() ? 'consent' : 'full'); else hideNative(true);
  });

  // ---------- start ----------
  function start() {
    cleanLegacy();
    try { footerLink(); } catch (e) {}
    patchRenew();
    if (/^#cookie-?(instellingen|settings)$/i.test(location.hash)) { window.BUSConsent.open(); return; }
    if (!ageOK()) { open('full'); return; }
    if (!consentKnown()) { open('consent'); return; }
    watchLegacy();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true }); else start();
})();

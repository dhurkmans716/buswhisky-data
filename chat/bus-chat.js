// BUS Whisky lader voor buswhisky.com. Bron: github.com/dhurkmans716/buswhisky-data/chat/
// ALLEEN LADEN, GEEN LOGICA: jsDelivr laat browsers dit bestand 7 dagen bewaren. Logica hier bereikt terugkerende
// bezoekers dus pas na een week en mengt dan oude en nieuwe versies (hoofdoorzaak agecheckbug, 4 nov 2026).
// Wijzigingen horen in bus-agegate.js (leeftijd + cookies) of bus-chat-core.js (chat, reserveren, webshop).
// Beide modules laden los van elkaar: een fout in de chat blokkeert de agecheck niet en omgekeerd.
// Standaard Cookiebot-banner meteen verbergen, zodat die niet zichtbaar is voordat ons scherm er is (Dennis 4 nov 2026).
// Vangnet: is de agecheck na 6 s niet geladen, dan komt de standaardbanner terug zodat niemand vastloopt.
(function () { try { if (window.top !== window || document.getElementById('bus-early-hide-native')) return; var s = document.createElement('style'); s.id = 'bus-early-hide-native'; s.textContent = '#CybotCookiebotDialog,#CybotCookiebotDialogBodyUnderlay{display:none!important}'; (document.head || document.documentElement).appendChild(s); setTimeout(function () { if (!window.__busAgeConsentV5) { var x = document.getElementById('bus-early-hide-native'); if (x) x.remove(); } }, 6000); } catch (e) {} })();
var __busV = Math.floor(Date.now() / 600000), __busBase = 'https://cdn.jsdelivr.net/gh/dhurkmans716/buswhisky-data@main/chat/';
import('https://cdn.jsdelivr.net/gh/dhurkmans716/buswhisky-data@61a3b3f1/chat/bus-agegate.js').catch(function (e) { console.error('[BUS] agecheck vaste versie mislukt, @main laden', e); return import('https://cdn.jsdelivr.net/gh/dhurkmans716/buswhisky-data@main/chat/bus-agegate.js?v=' + Math.floor(Date.now() / 600000)); }).catch(function (e) { console.error('[BUS] agecheck laden mislukt', e); });
import(__busBase + 'bus-chat-core.js?v=' + Math.floor(Date.now() / 3600000)).catch(function (e) { console.error('[BUS] widget laden mislukt', e); });

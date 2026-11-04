// BUS Whisky lader voor buswhisky.com. Bron: github.com/dhurkmans716/buswhisky-data/chat/
// ALLEEN LADEN, GEEN LOGICA: jsDelivr laat browsers dit bestand 7 dagen bewaren. Logica hier bereikt terugkerende
// bezoekers dus pas na een week en mengt dan oude en nieuwe versies (hoofdoorzaak agecheckbug, 4 nov 2026).
// Wijzigingen horen in bus-agegate.js (leeftijd + cookies) of bus-chat-core.js (chat, reserveren, webshop).
// Beide modules laden los van elkaar: een fout in de chat blokkeert de agecheck niet en omgekeerd.
var __busV = Math.floor(Date.now() / 600000), __busBase = 'https://cdn.jsdelivr.net/gh/dhurkmans716/buswhisky-data@main/chat/';
import('https://cdn.jsdelivr.net/gh/dhurkmans716/buswhisky-data@46292924/chat/bus-agegate.js').catch(function (e) { console.error('[BUS] agecheck vaste versie mislukt, @main laden', e); return import('https://cdn.jsdelivr.net/gh/dhurkmans716/buswhisky-data@main/chat/bus-agegate.js?v=' + Math.floor(Date.now() / 600000)); }).catch(function (e) { console.error('[BUS] agecheck laden mislukt', e); });
import(__busBase + 'bus-chat-core.js?v=' + Math.floor(Date.now() / 3600000)).catch(function (e) { console.error('[BUS] widget laden mislukt', e); });

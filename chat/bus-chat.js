// BUS Whisky website-chatbot en widgetknoppen. Bron: github.com/dhurkmans716/buswhisky-data/chat/
// Dit is alleen de lader. jsDelivr laat browsers dit bestand 7 dagen bewaren; daardoor zag een terugkerende bezoeker
// wijzigingen pas na een week (Dennis 31 okt 2026: geen flesknop, eerste tik op Reserveren deed niets).
// De lader haalt daarom de echte code (bus-chat-core.js) op met een uurstempel: wijzigingen zijn binnen een uur overal.
// Aanpassen: alleen chat/bus-chat-core.js wijzigen en de jsDelivr-cache van DAT bestand legen.
import('https://cdn.jsdelivr.net/gh/dhurkmans716/buswhisky-data@main/chat/bus-chat-core.js?v=' + Math.floor(Date.now() / 3600000));

// BUS Whisky website loader: uitsluitend de centrale core, zonder oude V3-agegate.
// Agecheck en Cookiebot consent worden centraal afgehandeld door BUS_UNIFIED_AGE_CONSENT_V4.
import('https://cdn.jsdelivr.net/gh/dhurkmans716/buswhisky-data@main/chat/bus-chat-core.js?v=' + Math.floor(Date.now() / 3600000));

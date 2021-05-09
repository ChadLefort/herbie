import ReconnectingWebSocket from 'reconnecting-websocket';

export const isOpen = (ws: ReconnectingWebSocket | WebSocket) => ws.readyState === ws.OPEN;

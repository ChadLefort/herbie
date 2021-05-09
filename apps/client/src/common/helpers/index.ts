import ReconnectingWebSocket from 'reconnecting-websocket';

export const isOpen = (ws: ReconnectingWebSocket) => ws.readyState === ws.OPEN;

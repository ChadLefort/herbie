import ReconnectingWebSocket from 'reconnecting-websocket';
import ws from 'ws';

export const isOpen = (ws: ReconnectingWebSocket | WebSocket | ws) => ws.readyState === ws.OPEN;

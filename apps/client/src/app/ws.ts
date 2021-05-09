import ReconnectingWebSocket from 'reconnecting-websocket';

const { NX_DOMAIN, NX_API_PORT, NX_VIDEO_PORT } = process.env;

export const wsControl = new ReconnectingWebSocket(`ws://${NX_DOMAIN}:${NX_API_PORT}/herbie/control`);
export const wsVideoURL = `ws://${NX_DOMAIN}:${NX_VIDEO_PORT}/herbie/video`;

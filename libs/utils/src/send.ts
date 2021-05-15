import { ControlAction, VideoAction } from '@herbie/types';
import ReconnectingWebSocket from 'reconnecting-websocket';
import winston from 'winston';
import ws from 'ws';

import { isOpen } from './is-open';

export function send<T>(
  ws: ReconnectingWebSocket | WebSocket | ws,
  action: ControlAction<T> | VideoAction,
  logger?: winston.Logger
) {
  try {
    if (isOpen(ws)) {
      ws.send(JSON.stringify(action));
    }
  } catch (error) {
    if (logger) {
      logger.error(error);
    } else {
      console.error(error);
    }
  }
}

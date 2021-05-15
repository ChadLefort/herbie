import { Action } from '@herbie/types';
import { send } from '@herbie/utils';
import ws from 'ws';

import { Herbie } from './herbie';
import { logger } from './logger';

export const controlGateway = (herbie: Herbie, { clients: { size } }: ws.Server) => (ws: ws) => {
  if (size <= 1) {
    ws.on('message', (req: string) => {
      const { action, payload } = JSON.parse(req) as Action;

      logger.info(req);

      switch (action) {
        case 'start':
          herbie.start(ws);
          break;
        case 'stop':
          herbie.stop();
          break;
        case 'move head':
          herbie.moveHead(parseInt(payload));
          break;
        case 'keypress':
          herbie.keyPress(payload);
          break;
      }
    });
  } else {
    send(ws, { action: 'cannot-control', payload: 'Only one client can be connected at a time.' }, logger);
  }
};

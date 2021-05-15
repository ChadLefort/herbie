import { Action } from '@herbie/types';
import { send } from '@herbie/utils';
import ws from 'ws';

import { Herbie } from './herbie';
import { logger } from './logger';

export const controlGateway = (herbie: Herbie) => (ws: ws) => {
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
};

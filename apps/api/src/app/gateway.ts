import { Action, ControlAction } from '@herbie/types';
import ws from 'ws';

import { Herbie } from './herbie';
import { logger } from './logger';

export const controlGateway = (herbie: Herbie) => (ws: ws) => {
  ws.on('message', (req: string) => {
    const { action, payload } = JSON.parse(req) as ControlAction;

    logger.info(req);

    switch (action) {
      case Action.start:
        herbie.start(ws);
        break;
      case Action.stop:
        herbie.stop();
        break;
      case Action.moveHead:
        herbie.moveHead(parseInt(payload));
        break;
      case Action.keypress:
        herbie.keyPress(payload);
        break;
    }
  });
};

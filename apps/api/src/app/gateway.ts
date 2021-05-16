import { HerbieControlWebSocketAction as Action, ControlAction } from '@herbie/types';
import ws from 'ws';

import { Herbie } from './herbie';
import { logger } from './logger';

export const controlGateway = (herbie: Herbie) => (ws: ws) => {
  ws.on('message', (req: string) => {
    const { action, payload } = JSON.parse(req) as ControlAction;

    logger.info(req);

    switch (action) {
      case Action.Start:
        herbie.start(ws);
        break;
      case Action.Stop:
        herbie.stop();
        break;
      case Action.MoveHead:
        herbie.moveHead(parseInt(payload));
        break;
      case Action.Keypress:
        herbie.keyPress(payload);
        break;
    }
  });
};

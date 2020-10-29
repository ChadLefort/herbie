import ws from 'ws';
import { Herbie } from './herbie';
import { logger } from './logger';

type Action<T = any> = {
  action: string;
  payload?: T;
};

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

  ws.on('close', () => {
    herbie.stop();
    logger.info('client disconnected from controls');
  });
};

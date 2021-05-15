import path from 'path';

import { IClient } from '@herbie/types';
import { send } from '@herbie/utils';
import express from 'express';
import expressWs from 'express-ws';
import { v4 as uuidv4 } from 'uuid';
import ws from 'ws';

import { controlGateway } from './gateway';
import { Herbie } from './herbie';
import { logger } from './logger';

export class App {
  express: expressWs.Application;
  ws: ws.Server;
  clients: IClient[];
  clientControlling: string;

  constructor() {
    logger.info('Starting App');

    const app = express();
    const ws = expressWs(app);
    const herbie = new Herbie();

    this.express = ws.app;
    this.ws = ws.getWss();
    this.clients = [];

    this.ws.on('connection', (ws) => {
      const userId = uuidv4();

      this.clients.push({ id: userId, ws });

      logger.info(`Client connected: ${userId}`);

      if (this.clients.length > 1) {
        const client = this.clients.find(({ id }) => id === userId);
        send(client.ws, { action: 'cannot-control', payload: 'Only one client can be connected at a time.' }, logger);
      } else {
        this.clientControlling = userId;
        logger.info(`Client controlling Herbie: ${userId}`);
        this.express.ws('/herbie/control', controlGateway(herbie));
      }

      ws.on('close', () => {
        logger.info(`Client disconnected: ${userId}`);
        this.clients = this.clients.filter(({ id }) => id !== userId);

        if (this.clients.length) {
          const [client] = this.clients;

          if (client.id !== this.clientControlling) {
            logger.info(`Client controlling Herbie: ${client.id}`);
            send(client.ws, { action: 'can-control', payload: 'You can control Herbie!' }, logger);
          }

          this.clientControlling = client.id;
        }
      });
    });

    this.express.use(express.static(path.join(__dirname, '../client')));
    this.express.get('/', (req, res) => res.sendFile(path.join(__dirname, '../client', 'index.html')));
  }
}

import path from 'path';

import express from 'express';
import expressWs from 'express-ws';

import { controlGateway } from './gateway';
import { Herbie } from './herbie';
import { logger } from './logger';

export class App {
  express: expressWs.Application;

  constructor() {
    logger.info('Starting App');

    const app = express();
    const ws = expressWs(app);
    const herbie = new Herbie();

    this.express = ws.app;
    this.express.ws('/herbie/control', controlGateway(herbie));
    this.express.use(express.static(path.join(__dirname, '../client')));
    this.express.get('/', (req, res) => res.sendFile(path.join(__dirname, '../client', 'index.html')));
  }
}

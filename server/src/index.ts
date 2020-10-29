import * as dotenv from 'dotenv';
import { App } from './app';
import { logger } from './logger';

dotenv.config();
const port = process.env.EXPRESS_PORT || 4000;

const app = new App();

app.express.listen(port, () => logger.info('Listening on port %d', port));

import { App } from './app/app';
import { logger } from './app/logger';

const port = process.env.port || 4000;
const app = new App();

app.express.listen(port, () => logger.info('Listening on port %d', port));

import { Logger } from './logger/logger';
import { initMonitoring } from './monitoring';
import { startServer } from './server';

const log = new Logger('APP');

log.info('Starting the application!');

initMonitoring()
	.catch((error) => {
		log.error('Error while initializing monitoring!', error);
		process.exit(1);
	})
	.then(() => startServer());

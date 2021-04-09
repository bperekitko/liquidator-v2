import pino from 'pino';
import { config } from '../../config/config';

const options = {
	level: config.LOG_LEVEL,
	prettyPrint: {
		colorize: process.env.ENVIRONMENT === 'dev',
		levelFirst: true,
		ignore: 'pid,hostname',
		translateTime: 'yyyy-dd-mm, h:MM:ss',
	},
};

export const log = pino(options);

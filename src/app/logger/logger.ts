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

export class Logger {
	logger: pino.Logger;
	name: string;

	constructor(name: string) {
		this.logger = pino(options);
		this.name = name;
	}

	info(msg: string): void {
		this.logger.info(`[${this.name}]: ${msg}`);
	}

	warn(msg: string): void {
		this.logger.warn(`[${this.name}]: ${msg}`);
	}

	error(msg: string, error?: Error): void {
		if (error) {
			this.logger.error(error, `[${this.name}]: ${msg}`);
		} else {
			this.logger.error(msg);
		}
	}

	debug(msg: string): void {
		this.logger.debug(`[${this.name}]: ${msg}`);
	}
}

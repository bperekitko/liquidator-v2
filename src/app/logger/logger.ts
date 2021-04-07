import pino from 'pino';

const options = {
  level: 'info',
  prettyPrint: {
    colorize: false,
    levelFirst: true,
    ignore: 'pid,hostname',
    translateTime: 'yyyy-dd-mm, h:MM:ss',
  },
};

export const log = pino(options);

import express from 'express';
import { log } from './logger/logger';
import { startArbitrationRadar } from './arbitrage/arbitration-radar';

log.info('Starting the application!');

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  startArbitrationRadar();
  res.send('The app is working just fine!');
});

app.listen(port, () => {
  log.info(`Server is listening on port: ${port}`);
});

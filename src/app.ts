import express from 'express';
import { log } from './logger';

log.info('Starting the application!');

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  log.info('I got a request!');
  res.send('The app is working just fine!');
});

app.listen(port, () => {
  log.info(`Server is listening on port: ${port}`);
});

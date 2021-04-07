import { log } from '../logger/logger';
import { ethers } from 'ethers';
import { config } from '../../config/config';

export const start = async (): Promise<void> => {
  log.info('Arbitration radar started. Monitoring network for interesting opportunities.');

  const provider = new ethers.providers.InfuraProvider(config.NETWORK, {
    projectId: config.INFURA_PROJECT_ID,
    projectSecret: config.INFURA_PROJECT_SECRET,
  });

  const number = await provider.getBlockNumber();

  log.info(`Block number is %d`, number);
};

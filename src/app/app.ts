import { DAI } from './ethereum/constants/tokens/DAI';
import { USDC } from './ethereum/constants/tokens/USDC';
import { WBTC } from './ethereum/constants/tokens/WBTC';
import { WETH } from './ethereum/constants/tokens/WETH';
import { log } from './logger/logger';
import { initMonitoring } from './monitoring';
import { startServer } from './server';

log.info('Starting the application!');

initMonitoring([DAI, USDC, WETH, WBTC])
	.catch((error) => {
		log.error(error, 'Error while initializing monitoring!');
		process.exit(1);
	})
	.then(() => startServer());

import { PriceOracle } from './arbitrage/oracle/price-oracle';
import { ERC20 } from './ethereum/erc20.model';
import { GasPriceProvider } from './ethereum/gas-price-provider';
import { log } from './logger/logger';

export async function initMonitoring(tokens: ERC20[]): Promise<void> {
	log.info(`Initializing monitoring.`);
	await GasPriceProvider.start();
	await PriceOracle.start(tokens);
	log.info(`Monitoring initialized successfully.`);
}

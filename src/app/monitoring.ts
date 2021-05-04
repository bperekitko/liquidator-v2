import { OffChainPriceOracle } from './arbitrage/oracle/off-chain-price-oracle';
import { ArbitrationRadar } from './arbitrage/radar/arbitration-radar';
import { GasPriceProvider } from './ethereum/gas-price-provider';
import { Logger } from './logger/logger';

const log = new Logger('MONITORING INITIALIZER');

export async function initMonitoring(): Promise<void> {
	log.info(`Initializing monitoring.`);
	await GasPriceProvider.start();
	await OffChainPriceOracle.start();
	await ArbitrationRadar.start();

	log.info(`Monitoring initialized successfully.`);
}

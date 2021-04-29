import { TradeablePair } from './arbitrage/model/tradeable-pair.model';
import { OffChainPriceOracle } from './arbitrage/oracle/off-chain-price-oracle';
import { ArbitrationRadar } from './arbitrage/radar/arbitration-radar';
import { SmartOrderRouter } from './arbitrage/scanners/balancer/smart-order-router';
import { DAI } from './ethereum/constants/tokens/DAI';
import { WETH } from './ethereum/constants/tokens/WETH';
import { GasPriceProvider } from './ethereum/gas-price-provider';
import { Logger } from './logger/logger';

const log = new Logger('MONITORING INITIALIZER');

export async function initMonitoring(): Promise<void> {
	log.info(`Initializing monitoring.`);
	await GasPriceProvider.start();
	await OffChainPriceOracle.start();
	await ArbitrationRadar.start();

	await SmartOrderRouter.start();

	const { price } = await SmartOrderRouter.getPriceWithSwaps(new TradeablePair(WETH, DAI));
	log.info(`WETH/DAI price on balancer: ${price}`);

	log.info(`Monitoring initialized successfully.`);
}

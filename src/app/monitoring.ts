import { PriceOracle } from './arbitrage/oracle/price-oracle';
import { ArbitrationRadar } from './arbitrage/radar/arbitration-radar';
import {
	getSushiswapTradeablePairs,
	getUniswapTradeablePairs,
} from './arbitrage/uniswap/tradeable-pair/get-tradeable-pairs';
import { ERC20 } from './ethereum/erc20.model';
import { GasPriceProvider } from './ethereum/gas-price-provider';
import { Logger } from './logger/logger';

const log = new Logger('MONITORING INITIALIZER');

export async function initMonitoring(tokens: ERC20[]): Promise<void> {
	log.info(`Initializing monitoring.`);
	await GasPriceProvider.start();
	await PriceOracle.start(tokens);
	await ArbitrationRadar.start(tokens);

	const tradeablePairs = await getUniswapTradeablePairs(tokens);
	log.debug(tradeablePairs.map((p) => `Existing pair: ${p.inputToken.ticker}/${p.outputToken.ticker}`).join('\n'));

	const sushiswap = await getSushiswapTradeablePairs(tokens);
	log.debug(sushiswap.map((p) => `Existing pair: ${p.inputToken.ticker}/${p.outputToken.ticker}`).join('\n'));
	log.info(`Monitoring initialized successfully.`);
}

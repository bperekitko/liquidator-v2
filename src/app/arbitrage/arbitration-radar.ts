import { DAI, WETH } from '../ethereum/constants/tokens';
import { log } from '../logger/logger';
import { getPriceOnSushiswap, getPriceOnUniswap } from './uniswap/get-price';

export const startArbitrationRadar = async (): Promise<void> => {
	log.info('Arbitration radar started. Monitoring network for interesting opportunities.');

	const uniswapPrice = await getPriceOnUniswap(10, WETH, DAI);
	const sushiswapPrice = await getPriceOnSushiswap(10, WETH, DAI);

	const isCheaper = uniswapPrice.lt(sushiswapPrice);

	log.info(`Uniswap price for 10 WETH in DAI is ${uniswapPrice.toString()}`);
	log.info(`Sushiswap price for 10 WETH in DAI is ${sushiswapPrice.toString()}`);
	log.info(`Is uniswapCheaper?: ${isCheaper}`);
};

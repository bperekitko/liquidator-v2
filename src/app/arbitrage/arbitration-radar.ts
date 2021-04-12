import { DAI } from '../ethereum/constants/tokens/DAI';
import { WETH } from '../ethereum/constants/tokens/WETH';
import { log } from '../logger/logger';
import { getPriceOnSushiswap, getPriceOnUniswap } from './uniswap/get-price';

export const startArbitrationRadar = async (): Promise<void> => {
	log.info('Arbitration radar started. Monitoring network for interesting opportunities.');

	const amount = 10;
	const uniswapPrice = await getPriceOnUniswap(amount, WETH, DAI);
	const sushiswapPrice = await getPriceOnSushiswap(amount, WETH, DAI);

	const isCheaper = uniswapPrice < sushiswapPrice;

	log.info(`Uniswap price for ${amount} WETH in DAI is ${uniswapPrice.toString()}`);
	log.info(`Sushiswap price for ${amount} WETH in DAI is ${sushiswapPrice.toString()}`);
	log.info(`Is uniswapCheaper?: ${isCheaper}`);
};

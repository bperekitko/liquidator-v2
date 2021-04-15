import { DAI } from '../../ethereum/constants/tokens/DAI';
import { WETH } from '../../ethereum/constants/tokens/WETH';
import { log } from '../../logger/logger';
import { checkSushiswapForOpportunity } from '../sushiswap/check-sushiswap';
import { getPriceOnUniswap } from '../uniswap/get-price';

export const startArbitrationRadar = async (): Promise<void> => {
	log.info('Arbitration radar started. Monitoring network for interesting opportunities.');

	const amount = 10;
	const inputToken = WETH;
	const outputToken = DAI;

	getPriceOnUniswap(amount, inputToken, outputToken)
		.then((price) => checkSushiswapForOpportunity(price, amount, inputToken, outputToken))
		.catch((error) =>
			log.error(`Error while looking for opportunities for ${inputToken.ticker}/${outputToken.ticker}`, error)
		);
};

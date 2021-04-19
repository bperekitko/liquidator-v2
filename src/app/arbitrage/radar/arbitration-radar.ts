import { DAI } from '../../ethereum/constants/tokens/DAI';
import { WETH } from '../../ethereum/constants/tokens/WETH';
import { ERC20 } from '../../ethereum/erc20.model';
import { Logger } from '../../logger/logger';
import { checkSushiswapForOpportunity } from '../sushiswap/check-sushiswap';
import { getPriceOnUniswap } from '../uniswap/get-price';

const SCANNING_FRQUENCY_IN_MILIS = 10 * 1000;

const log = new Logger('ARBITRATION RADAR');

let interval: NodeJS.Timeout;
let isScanInProgress = false;

async function start(tokens: ERC20[]): Promise<void> {
	log.info('Arbitration radar started. Monitoring network for interesting opportunities.');

	const amount = 10;
	const inputToken = WETH;
	const outputToken = tokens.find((t) => t.ticker === DAI.ticker);
	scheduleScanning(amount, inputToken, outputToken);
}

function stop(): void {
	clearInterval(interval);
}

function scheduleScanning(amount: number, inputToken: ERC20, outputToken: ERC20) {
	interval = setInterval(() => {
		if (isScanInProgress) {
			log.debug(`Scan already in progress, skipping.`);
		} else {
			scanForArbitrage(amount, inputToken, outputToken);
		}
	}, SCANNING_FRQUENCY_IN_MILIS);
}

function scanForArbitrage(amount: number, inputToken: ERC20, outputToken: ERC20) {
	log.debug(`Performing scan for arbitrage opportunities.`);
	isScanInProgress = true;
	getPriceOnUniswap(amount, inputToken, outputToken)
		.then((price) => checkSushiswapForOpportunity(price, amount, inputToken, outputToken))
		.catch((error) =>
			log.error(`Error while looking for opportunities for ${inputToken.ticker}/${outputToken.ticker}`, error)
		)
		.finally(() => (isScanInProgress = false));
}

export const ArbitrationRadar = {
	start,
	stop,
};

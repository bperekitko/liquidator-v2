import { Logger } from '../../logger/logger';
import { checkSushiswapForOpportunity } from '../sushiswap/check-sushiswap';
import { getPriceOnUniswap } from '../uniswap/get-price';
import { getUniswapTradeablePairs } from '../uniswap/tradeable-pair/get-tradeable-pairs';
import { TradeablePair } from '../uniswap/tradeable-pair/tradeable-pair.model';

const SCANNING_FRQUENCY_IN_MILIS = 10 * 1000;

const uniswapTradeablePairsPromise = getUniswapTradeablePairs();
const log = new Logger('ARBITRATION RADAR');

const scans: { [pairId: string]: boolean } = {};

let interval: NodeJS.Timeout;

async function start(): Promise<void> {
	log.info('Arbitration radar started. Monitoring network for interesting opportunities.');
	const tradablePairs = await uniswapTradeablePairsPromise;

	tradablePairs.forEach((pair) => scheduleScanning(pair));
}

function stop(): void {
	clearInterval(interval);
}

function scheduleScanning(pair: TradeablePair) {
	interval = setInterval(() => {
		if (isScanInProgress(pair)) {
			log.debug(`Scan for ${pair.toString()} already in progress, skipping.`);
		} else {
			scanForArbitrage(pair);
		}
	}, SCANNING_FRQUENCY_IN_MILIS);
}

function scanForArbitrage(pair: TradeablePair) {
	log.debug(`Performing scan for ${pair.toString()} arbitrage opportunities.`);
	scans[pair.toString()] = true;
	getPriceOnUniswap(pair)
		.then((price) => checkSushiswapForOpportunity(price, pair))
		.catch((error) => log.error(`Error while looking for opportunities for ${pair.toString()}`, error))
		.finally(() => (scans[pair.toString()] = false));
}

function isScanInProgress(pair: TradeablePair): boolean {
	return scans[pair.toString()];
}

export const ArbitrationRadar = {
	start,
	stop,
};

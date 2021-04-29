import { FixedNumber } from '@ethersproject/bignumber';
import { ethers } from 'ethers';
import { Logger } from '../../logger/logger';
import { Opportunity } from '../model/opportunity.model';
import { ScanResult } from '../model/scan/scan-result.model';
import { Scanner } from '../model/scan/scanner.model';
import { TradeablePair } from '../model/tradeable-pair.model';
import { SushiswapScanner } from '../scanners/sushiswap/sushiswap-scanner';
import { getPriceOnUniswap } from '../scanners/uniswap/price/get-uniswap-price';
import { getUniswapTradeablePairs } from '../scanners/uniswap/tradeable-pair/get-uniswap-tradeable-pairs';

const SCANNING_FRQUENCY_IN_MILIS = 10 * 1000;

const uniswapTradeablePairsPromise = getUniswapTradeablePairs();
const log = new Logger('ARBITRATION RADAR');

const scans: { [pairId: string]: boolean } = {};
const scanners: Scanner[] = [new SushiswapScanner()];

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
	interval = setInterval(() => scanForArbitrage(pair), SCANNING_FRQUENCY_IN_MILIS);
}

function scanForArbitrage(pair: TradeablePair) {
	log.debug(`Performing scan for ${pair.toString()} arbitrage opportunities.`);
	scans[pair.toString()] = true;
	getPriceOnUniswap(pair)
		.then((price) => scanForOpportunities(price, pair))
		.catch((error) => log.error(`Error while looking for opportunities for ${pair.toString()}`, error))
		.finally(() => (scans[pair.toString()] = false));
}

async function scanForOpportunities(price: FixedNumber, pair: TradeablePair): Promise<void> {
	scanners
		.map((scanner) => scanner.scan(price, pair))
		.forEach((scanPromise) => scanPromise.then((scanResult) => handleResult(scanResult, pair)));
}

function handleResult(scanResult: ScanResult, pair: TradeablePair) {
	const opportunity = scanResult.opportunity;
	if (opportunity) {
		log.info(`Found opportunity for ${pair.toString()} on ${scanResult.targetName}!`);
		performArbitrage(opportunity);
	} else {
		log.debug(`Opportunity for ${pair.toString()} on ${scanResult.targetName} not found. ${scanResult.failReason}`);
	}
}

function performArbitrage(opportunity: Opportunity) {
	log.info(`Estimated profit: ${opportunity.estimatedProfit} ${opportunity.pair.getOutputToken().ticker}.`);
	log.info(
		`Estimated gas cost: ${ethers.utils.formatUnits(opportunity.estimatedGasCostInWei.toString(), 'eth')} ETH.!`
	);
}

export const ArbitrationRadar = {
	start,
	stop,
};

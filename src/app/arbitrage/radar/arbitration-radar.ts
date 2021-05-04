import { FixedNumber } from '@ethersproject/bignumber';
import { ethers } from 'ethers';
import { ARBITRAGEURS } from '../../ethereum/constants/contracts/arbitrageurs';
import { Logger } from '../../logger/logger';
import { estimateGasForArbitrage } from '../executor/execute-arbitrage';
import { ScanResult } from '../model/scan/scan-result.model';
import { Scanner } from '../model/scan/scanner.model';
import { TradeablePair } from '../model/tradeable-pair.model';
import { BalancerScanner } from '../scanners/balancer/balancer-scanner';
import { SushiswapScanner } from '../scanners/sushiswap/sushiswap-scanner';
import { getPriceOnUniswap } from '../scanners/uniswap/price/get-uniswap-price';
import { getUniswapTradeablePairs } from '../scanners/uniswap/tradeable-pair/get-uniswap-tradeable-pairs';
import { calculateProfitability } from './calculate-profitability';

const SCANNING_FRQUENCY_IN_MILIS = 10 * 1000;

const uniswapTradeablePairsPromise = getUniswapTradeablePairs();
const log = new Logger('ARBITRATION RADAR');
const scanners: Scanner[] = [SushiswapScanner, BalancerScanner];

let intervals: NodeJS.Timeout[];

async function start(): Promise<void> {
	const tradablePairs = await uniswapTradeablePairsPromise;
	tradablePairs.forEach((pair) => scheduleScanning(pair));
	log.info('Arbitration radar started. Monitoring network for interesting opportunities.');
}

function stop(): void {
	intervals.forEach(clearInterval);
}

function scheduleScanning(pair: TradeablePair) {
	intervals.push(setInterval(() => scanForArbitrage(pair), SCANNING_FRQUENCY_IN_MILIS));
}

function scanForArbitrage(pair: TradeablePair) {
	log.debug(`Performing scan for ${pair.toString()} arbitrage opportunities.`);
	getPriceOnUniswap(pair)
		.then((price) => scanForOpportunities(price, pair))
		.catch((error) => log.error(`Error while looking for opportunities for ${pair.toString()}.`, error));
}

async function scanForOpportunities(price: FixedNumber, pair: TradeablePair): Promise<void[]> {
	return Promise.all(
		scanners
			.map((scanner) => scanner.scan(price, pair))
			.map((scanPromise) => scanPromise.then((scanResult) => handleResult(scanResult)))
	);
}

async function handleResult(scanResult: ScanResult): Promise<void> {
	if (scanResult.opportunity) {
		log.info(`Found opportunity on ${scanResult.targetName} for ${scanResult.opportunity.pair.toString()}.`);
		return handleSuccessfulScan(scanResult);
	}
}

async function handleSuccessfulScan(scanResult: ScanResult): Promise<void> {
	const arbitrageurContractAddress = ARBITRAGEURS[scanResult.targetName.toLocaleLowerCase()];
	const opportunity = scanResult.opportunity;
	const gasUsed = await estimateGasForArbitrage(opportunity, arbitrageurContractAddress);
	const { isProfitable, estimatedProfit, gasCostInWei } = await calculateProfitability(opportunity, gasUsed);

	if (isProfitable) {
		log.info(`Profitable opportunity on ${scanResult.targetName} for ${opportunity.pair.toString()}.`);
	} else {
		log.info(
			`Opportunity on ${scanResult.targetName} for ${opportunity.pair.toString()} not profitable due to Gas costs.`
		);
	}
	log.info(`Estimated profit: ${estimatedProfit.toString()} ${opportunity.pair.getOutputToken().ticker}.`);
	log.info(`Estimated gas cost: ${ethers.utils.formatUnits(gasCostInWei, 'ether')} ETH.`);
}

export const ArbitrationRadar = {
	start,
	stop,
};

import { BigNumber, FixedNumber } from '@ethersproject/bignumber';
import { Logger } from '../../logger/logger';
import { calculateProfitability } from '../radar/calculate-profitability';
import { getPriceOnSushiswap } from '../uniswap/get-price';
import { getSushiswapTradeablePairs } from '../uniswap/tradeable-pair/get-tradeable-pairs';
import { TradeablePair } from '../uniswap/tradeable-pair/tradeable-pair.model';

let isMining = false;

const log = new Logger('SUSHISWAP');
const sushiswapTradablePairs = getSushiswapTradeablePairs();

export async function checkSushiswapForOpportunity(basePrice: FixedNumber, pair: TradeablePair): Promise<void> {
	const tradablePairs = await sushiswapTradablePairs;

	if (shouldSkipCheck(pair, tradablePairs)) {
		return;
	}

	const sushiswapPrice = await getPriceOnSushiswap(pair);

	if (isTargetPriceHigher(basePrice, sushiswapPrice)) {
		log.info(`Found price discrepancies for ${pair.getTradeAmount()} ${pair.toString()}!`);

		const isProfitable = await isTradeProfitable(pair, basePrice, sushiswapPrice);

		if (isProfitable) {
			await performArbitrage(pair);
		}
	} else {
		log.debug(`Opportunity for ${pair.toString()} on Sushiswap not found.`);
	}
}

async function performArbitrage(pair: TradeablePair) {
	isMining = true;
	log.info(`Performing arbitrage of ${pair.getTradeAmount()} ${pair.toString()}!`);
	isMining = false;
	// const transaction = await executeArbitrage(
	// 	inputToken,
	// 	outputToken,
	// 	amount,
	// 	config.SUSHISWAP_ARBITRAGEUR_ADDRESS,
	// 	ethers.utils.defaultAbiCoder.encode(['uint'], [1])
	// );

	// isMining = true;
	// log.info(`Transaction sent! Hash: ${transaction.hash}.`);
	// const receipt: TransactionReceipt = await transaction.wait();
	// log.info(`Success! Transaction ${receipt.transactionHash} mined on block ${receipt.blockNumber}.`);
	// log.debug(`Transaction ${receipt.transactionHash} used ${receipt.gasUsed} gas.`);
	// isMining = false;
}

async function isTradeProfitable(
	pair: TradeablePair,
	basePrice: FixedNumber,
	sushiswapPrice: FixedNumber
): Promise<boolean> {
	// const gasUsed = await estimateGasForArbitrage(
	// 	inputToken,
	// 	outputToken,
	// 	amount,
	// 	config.SUSHISWAP_ARBITRAGEUR_ADDRESS,
	// 	ethers.utils.defaultAbiCoder.encode(['uint'], [1])
	// );

	const gasUsed = BigNumber.from('235000');

	log.debug(`Estimated gas usage: ${gasUsed.toString()}`);

	const { isProfitable, estimatedProfit } = calculateProfitability(
		pair.getTradeAmount(),
		basePrice,
		sushiswapPrice,
		pair.getOutputToken(),
		gasUsed
	);

	log.info(`Estimated profit: ${estimatedProfit.toString()} ${pair.getOutputToken().ticker}`);

	if (!isProfitable) {
		log.info(`Arbitrage of ${pair.getTradeAmount()} ${pair.toString()} is not profitable due to gas costs.`);
	}

	return isProfitable;
}

function isTargetPriceHigher(basePrice: FixedNumber, sushiswapPrice: FixedNumber) {
	return (
		!basePrice.isNegative() &&
		!basePrice.isZero() &&
		!sushiswapPrice.isNegative() &&
		!sushiswapPrice.isZero() &&
		basePrice < sushiswapPrice
	);
}
function shouldSkipCheck(pair: TradeablePair, tradablePairs: TradeablePair[]): boolean {
	if (isMining) {
		log.debug('Skipping sushiswap check since arbitrage transaction is being mined right now.');
		return true;
	}
	const pairDoesNotExist = !tradablePairs.some((p) => p.equals(pair));

	if (pairDoesNotExist) {
		log.warn(`Pair ${pair.toString()} does not exits on Sushiswap, skipping check.`);
		return true;
	}

	return false;
}

import { BigNumber, FixedNumber } from '@ethersproject/bignumber';
import { ERC20 } from '../../ethereum/erc20.model';
import { Logger } from '../../logger/logger';
import { calculateProfitability } from '../radar/calculate-profitability';
import { getPriceOnSushiswap } from '../uniswap/get-price';

let isMining = false;

const log = new Logger('SUSHISWAP');

export async function checkSushiswapForOpportunity(
	basePrice: FixedNumber,
	amount: number,
	inputToken: ERC20,
	outputToken: ERC20
): Promise<void> {
	if (isMining) {
		log.debug('Skipping sushiswap check since arbitrage transaction is being mined right now.');
		return;
	}

	const sushiswapPrice = await getPriceOnSushiswap(amount, inputToken, outputToken);

	if (isTargetPriceHigher(basePrice, sushiswapPrice)) {
		log.info(`Found price discrepancies for ${amount} ${inputToken.ticker}/${outputToken.ticker}!`);

		const isProfitable = await isTradeProfitable(inputToken, outputToken, amount, basePrice, sushiswapPrice);

		if (isProfitable) {
			await performArbitrage(inputToken, outputToken, amount);
		}
	} else {
		log.debug(`Opportunity for ${inputToken.ticker}/${outputToken.ticker} on Sushiswap not found.`);
	}
}

async function performArbitrage(inputToken: ERC20, outputToken: ERC20, amount: number) {
	log.info(`Performing arbitrage of ${amount} ${inputToken.ticker}/${outputToken.ticker}!`);

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
	inputToken: ERC20,
	outputToken: ERC20,
	amount: number,
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
		amount,
		basePrice,
		sushiswapPrice,
		outputToken,
		gasUsed
	);

	log.info(`Estimated profit: ${estimatedProfit.toString()} ${outputToken.ticker}`);

	if (!isProfitable) {
		log.info(`Arbitrage of ${amount} ${inputToken.ticker}/${outputToken.ticker} is not profitable due to gas costs.`);
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

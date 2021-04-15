import { FixedNumber } from '@ethersproject/bignumber';
import { TransactionReceipt } from '@ethersproject/providers';
import { ethers } from 'ethers';
import { config } from '../../../config/config';
import { ERC20 } from '../../ethereum/erc20.model';
import { log } from '../../logger/logger';
import { estimateGasForArbitrage, executeArbitrage } from '../executor/arbitrage';
import { isProfitableTrade } from '../radar/calculate-profitability';
import { getPriceOnSushiswap } from '../uniswap/get-price';

let isMining = false;

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

	log.debug(`Checking Sushiswap for ${inputToken.ticker}/${outputToken.ticker} opportunity.`);
	const sushiswapPrice = await getPriceOnSushiswap(amount, inputToken, outputToken);

	if (canPerformArbitrage(basePrice, sushiswapPrice)) {
		isMining = true;
		log.info(`Found price discrepancies for ${inputToken.ticker}/${outputToken.ticker}!`);
		log.info(`Calculating profitability of trade.`);

		const gasUsed = await estimateGasForArbitrage(
			inputToken,
			outputToken,
			amount,
			config.SUSHISWAP_ARBITRAGEUR_ADDRESS,
			ethers.utils.defaultAbiCoder.encode(['uint'], [1])
		);

		const isProfitable = isProfitableTrade(amount, basePrice, sushiswapPrice, outputToken, gasUsed);

		if (isProfitable) {
			log.info(`Opportunity is profitable. Performing arbitrage for ${amount} ${inputToken.ticker}!`);
			const transaction = await executeArbitrage(
				inputToken,
				outputToken,
				amount,
				config.SUSHISWAP_ARBITRAGEUR_ADDRESS,
				ethers.utils.defaultAbiCoder.encode(['uint'], [1])
			);

			log.info(`Transaction sent! Hash: ${transaction.hash}.`);
			const receipt: TransactionReceipt = await transaction.wait();
			log.info(`Success! Transaction ${receipt.transactionHash} mined on block ${receipt.blockNumber}.`);
			log.debug(`Transaction ${receipt.transactionHash} used ${receipt.gasUsed} gas.`);
		}
		isMining = false;
	} else {
		log.debug(`Opportunity for ${inputToken.ticker}/${outputToken.ticker} on Sushiswap not found.`);
	}
}

function canPerformArbitrage(basePrice: FixedNumber, sushiswapPrice: FixedNumber) {
	return (
		!basePrice.isNegative() &&
		!basePrice.isZero() &&
		!sushiswapPrice.isNegative() &&
		!sushiswapPrice.isZero() &&
		basePrice < sushiswapPrice
	);
}

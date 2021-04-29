import { FixedNumber } from '@ethersproject/bignumber';
import { ethers } from 'ethers';
import { config } from '../../../../config/config';
import { Logger } from '../../../logger/logger';
import { estimateGasForArbitrage } from '../../executor/execute-arbitrage';
import { TradeablePair } from '../../model/tradeable-pair.model';
import { calculateProfitability, Profitability } from '../../radar/calculate-profitability';
import { OpportunityScanner } from '../opportunity-scanner';
import { getPriceOnSushiswap } from './price/get-sushiswap-price';
import { sushiswapLogger } from './susshiwap-logger';
import { getSushiswapTradeablePairs } from './tradeable-pair/get-sushiswap-tradeable-pairs';

export class SushiswapScanner extends OpportunityScanner {
	private readonly tradablePairs: Promise<TradeablePair[]>;
	private readonly arbitrageEncodedData: string;
	private readonly log: Logger;

	constructor() {
		super(config.SUSHISWAP_ARBITRAGEUR_ADDRESS, 'SUSHISWAP');
		this.tradablePairs = getSushiswapTradeablePairs();
		this.log = sushiswapLogger;
		this.arbitrageEncodedData = ethers.utils.defaultAbiCoder.encode(['uint'], [1]);
	}

	async pairExists(pair: TradeablePair): Promise<boolean> {
		const pairs = await this.tradablePairs;
		return pairs.some((p) => p.equals(pair));
	}

	async scanTarget(pair: TradeablePair): Promise<{ targetPrice: FixedNumber; arbitrageEncodedData: string }> {
		const sushiswapPrice = await getPriceOnSushiswap(pair);
		return { targetPrice: sushiswapPrice, arbitrageEncodedData: this.arbitrageEncodedData };
	}

	async getProfitability(pair: TradeablePair, price: FixedNumber, targetPrice: FixedNumber): Promise<Profitability> {
		const gasUsed = await estimateGasForArbitrage(pair, this.arbitrageurAddress, this.arbitrageEncodedData);
		return calculateProfitability(pair.getTradeAmount(), price, targetPrice, pair.getOutputToken(), gasUsed);
	}

	// async function performArbitrage(pair: TradeablePair) {
	// 	this.log.info(`Performing arbitrage of ${pair.getTradeAmount()} ${pair.toString()}!`);
	// 	const transaction = await executeArbitrage(
	// 		inputToken,
	// 		outputToken,
	// 		amount,
	// 		config.SUSHISWAP_ARBITRAGEUR_ADDRESS,
	// 		ethers.utils.defaultAbiCoder.encode(['uint'], [1])
	// 	);

	// 	isMining = true;
	// 	log.info(`Transaction sent! Hash: ${transaction.hash}.`);
	// 	const receipt: TransactionReceipt = await transaction.wait();
	// 	log.info(`Success! Transaction ${receipt.transactionHash} mined on block ${receipt.blockNumber}.`);
	// 	log.debug(`Transaction ${receipt.transactionHash} used ${receipt.gasUsed} gas.`);
	// 	isMining = false;
	// }
}

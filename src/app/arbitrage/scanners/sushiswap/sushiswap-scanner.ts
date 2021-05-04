import { ethers, FixedNumber } from 'ethers';
import { PriceProvider } from '../../model/arbitrage-data-provider.model';
import { TradeablePair } from '../../model/tradeable-pair.model';
import { OpportunityScanner } from '../opportunity-scanner';
import { getPriceOnSushiswap } from './price/get-sushiswap-price';
import { getSushiswapTradeablePairs } from './tradeable-pair/get-sushiswap-tradeable-pairs';

const ARBITRAGE_ENODED_DATA = ethers.utils.defaultAbiCoder.encode(['uint'], [1]);
const tradablePairs: Promise<TradeablePair[]> = getSushiswapTradeablePairs();

const getPrice = async (pair: TradeablePair) => {
	let price: FixedNumber;

	if (await pairExists(pair)) {
		price = await getPriceOnSushiswap(pair);
	}

	return { price, arbitrageEncodedData: ARBITRAGE_ENODED_DATA };
};

const pairExists = async (pair: TradeablePair): Promise<boolean> => {
	const pairs = await tradablePairs;
	return pairs.some((p) => p.equals(pair));
};

const sushiswapPriceProvider: PriceProvider = { getPrice };

export const SushiswapScanner = new OpportunityScanner('SUSHISWAP', sushiswapPriceProvider);

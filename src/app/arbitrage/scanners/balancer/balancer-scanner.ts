import { FixedNumber } from 'ethers/lib/ethers';
import { PriceProvider } from '../../model/arbitrage-data-provider.model';
import { TradeablePair } from '../../model/tradeable-pair.model';
import { OpportunityScanner } from '../opportunity-scanner';
import { abiEncodeSwaps } from './abi-encode-swaps';
import { SmartOrderRouter } from './smart-order-router';

const SOR = SmartOrderRouter;
const sorStarted = SOR.start();

const getPrice = async (pair: TradeablePair): Promise<{ price: FixedNumber; arbitrageEncodedData: string }> => {
	await sorStarted;

	const { swaps, price } = await SOR.getPriceWithSwaps(pair);
	const arbitrageEncodedData = abiEncodeSwaps(swaps);

	return { price: FixedNumber.fromString(price), arbitrageEncodedData };
};

const balancerPriceProvider: PriceProvider = { getPrice };

export const BalancerScanner = new OpportunityScanner('BALANCER', balancerPriceProvider);

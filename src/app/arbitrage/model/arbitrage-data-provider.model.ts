import { FixedNumber } from '@ethersproject/bignumber';
import { TradeablePair } from './tradeable-pair.model';

export interface PriceProvider {
	getPrice: (pair: TradeablePair) => Promise<{ price: FixedNumber; arbitrageEncodedData: string }>;
}

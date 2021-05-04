import { FixedNumber } from '@ethersproject/bignumber';
import { TradeablePair } from './tradeable-pair.model';

export interface Opportunity {
	basePrice: FixedNumber;
	targetPrice: FixedNumber;
	pair: TradeablePair;
	arbitrageEncodedData: string;
}

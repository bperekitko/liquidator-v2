import { FixedNumber } from '@ethersproject/bignumber';
import { TradeablePair } from './tradeable-pair.model';

export interface Opportunity {
	pair: TradeablePair;
	arbitrageurAddress: string;
	arbitrageurEncodedData: string;
	estimatedProfit: FixedNumber;
	estimatedGasCostInWei: string;
}

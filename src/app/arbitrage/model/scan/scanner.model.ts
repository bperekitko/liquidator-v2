import { FixedNumber } from 'ethers';
import { TradeablePair } from '../tradeable-pair.model';
import { ScanResult } from './scan-result.model';

export interface Scanner {
	scan: (basePrice: FixedNumber, pair: TradeablePair) => Promise<ScanResult>;
}

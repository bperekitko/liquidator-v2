import { FixedNumber } from 'ethers';
import { TradeablePair } from '../tradeable-pair.model';
import { ScanResult } from './scan-result.model';

export interface Scanner {
	scan: (price: FixedNumber, pair: TradeablePair) => Promise<ScanResult>;
}

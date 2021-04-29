import { TradeablePair } from '../tradeable-pair.model';
import { ScanFailReason } from './scan-fail-reasons.model';
import { ScanResult } from './scan-result.model';

export class FailedScan implements ScanResult {
	targetName: string;
	failReason: ScanFailReason;
	pair: TradeablePair;

	constructor(targetName: string, pair: TradeablePair, failReason: ScanFailReason) {
		this.targetName = targetName;
		this.pair = pair;
		this.failReason = failReason;
	}
}

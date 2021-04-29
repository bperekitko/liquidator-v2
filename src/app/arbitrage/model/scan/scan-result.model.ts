import { Opportunity } from '../opportunity.model';
import { ScanFailReason } from './scan-fail-reasons.model';

export interface ScanResult {
	targetName: string;
	opportunity?: Opportunity;
	failReason?: ScanFailReason;
}

import { Opportunity } from '../opportunity.model';
import { ScanResult } from './scan-result.model';

export class SuccessfulScan implements ScanResult {
	targetName: string;
	opportunity: Opportunity;

	constructor(targetName: string, opportunity: Opportunity) {
		this.targetName = targetName;
		this.opportunity = opportunity;
	}
}

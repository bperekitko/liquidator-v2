import { Opportunity } from '../opportunity.model';

export interface ScanResult {
	targetName: string;
	opportunity?: Opportunity;
}

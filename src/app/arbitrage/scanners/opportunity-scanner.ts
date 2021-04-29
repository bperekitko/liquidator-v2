import { FixedNumber } from 'ethers';
import { Opportunity } from '../model/opportunity.model';
import { FailedScan } from '../model/scan/failed-scan.model';
import { ScanFailReason } from '../model/scan/scan-fail-reasons.model';
import { ScanResult } from '../model/scan/scan-result.model';
import { Scanner } from '../model/scan/scanner.model';
import { SuccessfulScan } from '../model/scan/successful-scan.model';
import { TradeablePair } from '../model/tradeable-pair.model';
import { Profitability } from '../radar/calculate-profitability';

export abstract class OpportunityScanner implements Scanner {
	private readonly name: string;

	protected arbitrageurAddress: string;

	constructor(arbitrageurAddress: string, name: string) {
		this.arbitrageurAddress = arbitrageurAddress;
		this.name = name;
	}

	abstract pairExists(pair: TradeablePair): Promise<boolean>;
	abstract scanTarget(pair: TradeablePair): Promise<{ targetPrice: FixedNumber; arbitrageEncodedData: string }>;
	abstract getProfitability(pair: TradeablePair, price: FixedNumber, targetPrice: FixedNumber): Promise<Profitability>;

	async scan(price: FixedNumber, pair: TradeablePair): Promise<ScanResult> {
		const pairExists = await this.pairExists(pair);
		return pairExists
			? await this.performScan(price, pair)
			: new FailedScan(this.name, pair, ScanFailReason.PAIR_IMPOSSIBLE_TO_SCAN);
	}

	private async performScan(price: FixedNumber, pair: TradeablePair): Promise<ScanResult> {
		const { targetPrice, arbitrageEncodedData } = await this.scanTarget(pair);

		return this.isTargetPriceHigher(price, targetPrice)
			? await this.scanProfitability(pair, price, targetPrice, arbitrageEncodedData)
			: new FailedScan(this.name, pair, ScanFailReason.PRICE_TOO_HIGH);
	}

	private isTargetPriceHigher(basePrice: FixedNumber, targetPrice: FixedNumber) {
		return (
			!basePrice.isNegative() &&
			!basePrice.isZero() &&
			!targetPrice.isNegative() &&
			!targetPrice.isZero() &&
			basePrice < targetPrice
		);
	}

	private async scanProfitability(
		pair: TradeablePair,
		price: FixedNumber,
		targetPrice: FixedNumber,
		arbitrageurEncodedData: string
	): Promise<ScanResult> {
		const { isProfitable, estimatedProfit, gasCostInWei } = await this.getProfitability(pair, price, targetPrice);

		return isProfitable
			? this.success(pair, arbitrageurEncodedData, estimatedProfit, gasCostInWei)
			: this.failure(pair, ScanFailReason.GAS_COSTS_TOO_HIGH);
	}

	private failure(pair: TradeablePair, failReason: ScanFailReason): ScanResult {
		return new FailedScan(this.name, pair, failReason);
	}

	private success(pair: TradeablePair, encodedData: string, profit: FixedNumber, gasCost: string): ScanResult {
		return new SuccessfulScan(this.name, this.createOpportunity(pair, encodedData, profit, gasCost));
	}

	private createOpportunity(pair: TradeablePair, data: string, profit: FixedNumber, gasCost: string): Opportunity {
		return {
			pair: pair,
			arbitrageurAddress: this.arbitrageurAddress,
			arbitrageurEncodedData: data,
			estimatedProfit: profit,
			estimatedGasCostInWei: gasCost,
		};
	}
}

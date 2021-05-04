import { FixedNumber } from '@ethersproject/bignumber';
import { Logger } from '../../logger/logger';
import { PriceProvider } from '../model/arbitrage-data-provider.model';
import { ScanResult } from '../model/scan/scan-result.model';
import { Scanner } from '../model/scan/scanner.model';
import { TradeablePair } from '../model/tradeable-pair.model';

export class OpportunityScanner implements Scanner {
	private targetName: string;
	private priceProvider: PriceProvider;
	private log: Logger;

	constructor(targetName: string, priceProvider: PriceProvider) {
		this.targetName = targetName;
		this.priceProvider = priceProvider;
		this.log = new Logger(targetName);
	}

	async scan(basePrice: FixedNumber, pair: TradeablePair): Promise<ScanResult> {
		const { price, arbitrageEncodedData } = await this.priceProvider.getPrice(pair);

		if (!price) {
			this.log.debug(`Could not get price for ${pair.toString()}.`);
			return { targetName: this.targetName };
		}

		if (this.isTargetPriceHigher(basePrice, price)) {
			this.log.debug(`Found lower price for ${pair.toString()}.`);
			const opportunity = { basePrice, targetPrice: price, pair, arbitrageEncodedData };
			return { targetName: this.targetName, opportunity };
		}

		this.log.debug(`Price for ${pair.toString()} is too high.`);
		return { targetName: this.targetName };
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
}

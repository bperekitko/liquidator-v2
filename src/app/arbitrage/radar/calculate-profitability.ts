import { BigNumber, FixedNumber } from '@ethersproject/bignumber';
import { GasPriceProvider } from '../../ethereum/gas-price-provider';
import { Opportunity } from '../model/opportunity.model';
import { OffChainPriceOracle } from '../oracle/off-chain-price-oracle';

export interface Profitability {
	isProfitable: boolean;
	estimatedProfit: FixedNumber;
	gasCostInWei: string;
}

export async function calculateProfitability(opportunity: Opportunity, gasUsed: BigNumber): Promise<Profitability> {
	const { basePrice, targetPrice, pair } = opportunity;
	const amount = pair.getInputToken().tradeAmount;
	const targetToken = pair.getOutputToken();

	const estimatedProfit = targetPrice.subUnsafe(basePrice).mulUnsafe(FixedNumber.from(amount));
	const profitInWei = estimatedProfit.mulUnsafe(FixedNumber.from(OffChainPriceOracle.getEthPriceInWei(targetToken)));
	const gasCost = gasUsed.mul(await GasPriceProvider.getFastestGasPrice());
	const isProfitable = FixedNumber.from(gasCost).subUnsafe(profitInWei).isNegative();
	return { isProfitable, estimatedProfit, gasCostInWei: gasCost.toString() };
}

import { BigNumber, FixedNumber } from '@ethersproject/bignumber';
import { ERC20 } from '../../ethereum/erc20.model';
import { GasPriceProvider } from '../../ethereum/gas-price-provider';
import { OffChainPriceOracle } from '../oracle/off-chain-price-oracle';

export interface Profitability {
	isProfitable: boolean;
	estimatedProfit: FixedNumber;
	gasCostInWei: string;
}

export function calculateProfitability(
	amount: number,
	basePrice: FixedNumber,
	targetPrice: FixedNumber,
	targetToken: ERC20,
	gasUsed: BigNumber
): Profitability {
	const estimatedProfit = targetPrice.subUnsafe(basePrice).mulUnsafe(FixedNumber.from(amount));
	const profitInWei = estimatedProfit.mulUnsafe(FixedNumber.from(OffChainPriceOracle.getEthPriceInWei(targetToken)));
	const gasCost = gasUsed.mul(GasPriceProvider.getFastestGasPrice());
	const isProfitable = FixedNumber.from(gasCost).subUnsafe(profitInWei).isNegative();
	return { isProfitable, estimatedProfit, gasCostInWei: gasCost.toString() };
}

import { BigNumber, FixedNumber } from '@ethersproject/bignumber';
import { ERC20 } from '../../ethereum/erc20.model';
import { GasPriceProvider } from '../../ethereum/gas-price-provider';
import { log } from '../../logger/logger';
import { PriceOracle } from '../oracle/price-oracle';

export function isProfitableTrade(
	amount: number,
	basePrice: FixedNumber,
	targetPrice: FixedNumber,
	targetToken: ERC20,
	gasUsed: BigNumber
): boolean {
	const income = targetPrice.subUnsafe(basePrice).mulUnsafe(FixedNumber.from(amount));

	const profitInWei = income.mulUnsafe(FixedNumber.from(PriceOracle.getEthPriceInWei(targetToken)));
	const gasCost = FixedNumber.from(gasUsed.mul(GasPriceProvider.getFastestGasPrice()));

	log.debug(`Estimated profit in [${targetToken.ticker}]:${income.toString()}`);
	log.debug(`Calculated profit in wei is ${profitInWei}`);
	log.debug(`Eestimated gas cost is ${gasCost}`);
	log.debug(`The difference is ${gasCost.subUnsafe(profitInWei).toString()}`);
	log.debug(`Trade is ${gasCost.subUnsafe(profitInWei).isNegative() ? '' : 'not'} profitable!`);

	return gasCost.subUnsafe(profitInWei).isNegative();
}

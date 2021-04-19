import { BigNumber, FixedNumber } from '@ethersproject/bignumber';
import { ERC20 } from '../../ethereum/erc20.model';
import { GasPriceProvider } from '../../ethereum/gas-price-provider';
import { Logger } from '../../logger/logger';
import { PriceOracle } from '../oracle/price-oracle';

const log = new Logger('PROFITABILITY CALCULATOR');

export function calculateProfitability(
	amount: number,
	basePrice: FixedNumber,
	targetPrice: FixedNumber,
	targetToken: ERC20,
	gasUsed: BigNumber
): { isProfitable: boolean; estimatedProfit: FixedNumber } {
	const income = targetPrice.subUnsafe(basePrice).mulUnsafe(FixedNumber.from(amount));
	log.debug(`Estimated profit in [${targetToken.ticker}]:${income.toString()}`);

	const profitInWei = income.mulUnsafe(FixedNumber.from(PriceOracle.getEthPriceInWei(targetToken)));
	const gasCost = FixedNumber.from(gasUsed.mul(GasPriceProvider.getFastestGasPrice()));

	log.debug(`Eestimated gas cost is ${gasCost}`);

	return { isProfitable: gasCost.subUnsafe(profitInWei).isNegative(), estimatedProfit: income };
}

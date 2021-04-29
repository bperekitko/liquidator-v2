import { BigNumber, ethers, FixedNumber } from 'ethers';
import { TradeablePair } from '../../../model/tradeable-pair.model';
import { calculateAmountOut } from '../../utils/uniswap/calculate-amount/calculate-amount';
import { getSushiswapReserves } from '../reserves/get-sushiswap-reserves';
import { sushiswapLogger } from '../susshiwap-logger';

const log = sushiswapLogger;

export const getPriceOnSushiswap = async (pair: TradeablePair): Promise<FixedNumber> => {
	const input = pair.getInputToken();
	const output = pair.getOutputToken();
	const amount = pair.getTradeAmount();

	const [inputReserve, outputReserve] = await getSushiswapReserves(input, output);

	if (!inputReserve || !outputReserve) {
		return FixedNumber.from(0);
	}

	const amountIn = ethers.utils.parseUnits(amount.toString(), input.decimals);
	const amountOut = calculateAmountOut(amountIn, BigNumber.from(inputReserve), BigNumber.from(outputReserve));
	const amountOutInUnits = ethers.utils.formatUnits(amountOut.toString(), output.decimals);

	const price = FixedNumber.from(amountOutInUnits).divUnsafe(FixedNumber.from(amount));

	log.debug(`${pair.toString()} price: ${price.toString()}`);

	return price;
};

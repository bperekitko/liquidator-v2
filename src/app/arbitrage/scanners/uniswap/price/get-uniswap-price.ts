import { BigNumber, ethers, FixedNumber } from 'ethers';
import { TradeablePair } from '../../../model/tradeable-pair.model';
import { calculateAmountIn } from '../../utils/uniswap/calculate-amount/calculate-amount';
import { getUniswapReserves } from '../reserves/get-uniswap-reserves';
import { uniswapLogger } from '../uniswap-logger';

const log = uniswapLogger;

export const getPriceOnUniswap = async (pair: TradeablePair): Promise<FixedNumber> => {
	const input = pair.getInputToken();
	const output = pair.getOutputToken();
	const amount = pair.getTradeAmount();

	const [inputReserve, outputReserve] = await getUniswapReserves(input, output);

	if (!inputReserve || !outputReserve) {
		return FixedNumber.from(0);
	}

	const amountOut = ethers.utils.parseUnits(amount.toString(), input.decimals);
	const amountIn = calculateAmountIn(amountOut, BigNumber.from(outputReserve), BigNumber.from(inputReserve));
	const amountInInUnits = ethers.utils.formatUnits(amountIn.toString(), output.decimals);

	const price = FixedNumber.from(amountInInUnits).divUnsafe(FixedNumber.from(amount));

	log.debug(`${pair.toString()} price: ${price.toString()}`);

	return price;
};

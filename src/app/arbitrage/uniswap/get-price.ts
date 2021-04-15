import { BigNumber, ethers, FixedNumber } from 'ethers';
import { ERC20 } from '../../ethereum/erc20.model';
import { log } from '../../logger/logger';
import { calculateAmountIn, calculateAmountOut } from './calculate-amount/calculate-amount';
import { getSushiswapReserves, getUniswapReserves } from './get-reserves';

export const getPriceOnUniswap = async (amount: number, input: ERC20, output: ERC20): Promise<FixedNumber> => {
	log.debug(`Getting price on Uniswap for ${input.ticker}/${output.ticker}`);

	const [inputReserve, outputReserve] = await getUniswapReserves(input, output);

	if (!inputReserve || !outputReserve) {
		return FixedNumber.from(0);
	}

	const amountOut = ethers.utils.parseUnits(amount.toString(), input.decimals);

	const amountIn = calculateAmountIn(amountOut, BigNumber.from(outputReserve), BigNumber.from(inputReserve));

	return FixedNumber.from(amountIn).divUnsafe(FixedNumber.from(amountOut));
};

export const getPriceOnSushiswap = async (amount: number, input: ERC20, output: ERC20): Promise<FixedNumber> => {
	log.debug(`Getting price on Sushiswap for ${input.ticker}/${output.ticker}.`);

	const [inputReserve, outputReserve] = await getSushiswapReserves(input, output);

	if (!inputReserve || !outputReserve) {
		return FixedNumber.from(0);
	}

	const amountIn = ethers.utils.parseUnits(amount.toString(), input.decimals);

	const amountOut = calculateAmountOut(amountIn, BigNumber.from(inputReserve), BigNumber.from(outputReserve));

	return FixedNumber.from(amountOut).divUnsafe(FixedNumber.from(amountIn));
};

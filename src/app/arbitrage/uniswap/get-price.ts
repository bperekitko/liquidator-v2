import { BigNumber, ethers, FixedNumber } from 'ethers';
import { ERC20 } from '../../ethereum/erc20.model';
import { Logger } from '../../logger/logger';
import { calculateAmountIn, calculateAmountOut } from './calculate-amount/calculate-amount';
import { getSushiswapReserves, getUniswapReserves } from './get-reserves';

const log = new Logger('PRICE FETCHER');

export const getPriceOnUniswap = async (amount: number, input: ERC20, output: ERC20): Promise<FixedNumber> => {
	const [inputReserve, outputReserve] = await getUniswapReserves(input, output);

	if (!inputReserve || !outputReserve) {
		return FixedNumber.from(0);
	}

	const amountOut = ethers.utils.parseUnits(amount.toString(), input.decimals);
	const amountIn = calculateAmountIn(amountOut, BigNumber.from(outputReserve), BigNumber.from(inputReserve));

	const amountInInUnits = ethers.utils.formatUnits(amountIn.toString(), output.decimals);

	const price = FixedNumber.from(amountInInUnits).divUnsafe(FixedNumber.from(amount));

	log.debug(`Uniswap ${input.ticker} price: ${price.toString()} ${output.ticker}`);

	return price;
};

export const getPriceOnSushiswap = async (amount: number, input: ERC20, output: ERC20): Promise<FixedNumber> => {
	const [inputReserve, outputReserve] = await getSushiswapReserves(input, output);

	if (!inputReserve || !outputReserve) {
		return FixedNumber.from(0);
	}

	const amountIn = ethers.utils.parseUnits(amount.toString(), input.decimals);
	const amountOut = calculateAmountOut(amountIn, BigNumber.from(inputReserve), BigNumber.from(outputReserve));
	const amountOutInUnits = ethers.utils.formatUnits(amountOut.toString(), output.decimals);

	const price = FixedNumber.from(amountOutInUnits).divUnsafe(FixedNumber.from(amount));

	log.debug(`Sushiswap ${input.ticker} price: ${price.toString()} ${output.ticker}`);

	return price;
};

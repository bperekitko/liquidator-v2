import { BigNumber } from 'ethers';
import { ERC20 } from '../../ethereum/erc20.model';
import { log } from '../../logger/logger';
import { calculateAmountIn, calculateAmountOut } from './calculate-amount/calculate-amount';
import { getSushiswapReserves, getUniswapReserves } from './get-reserves';

export const getPriceOnUniswap = async (amount: number, input: ERC20, output: ERC20): Promise<BigNumber> => {
	log.debug(`Getting price on Uniswap for ${input.ticker}/${output.ticker}`);

	const [inputReserve, outputReserve] = await getUniswapReserves(input, output);

	if (!inputReserve || !outputReserve) {
		return BigNumber.from(0);
	}

	log.debug(`Uniswap ${input.ticker} reserve: ${inputReserve}.`);
	log.debug(`Uniswap ${output.ticker} reserve: ${outputReserve}.`);

	const amountMultiplier = BigNumber.from(10).pow(input.decimals);
	const amountOut = BigNumber.from(amount).mul(amountMultiplier);

	return calculateAmountIn(amountOut, BigNumber.from(outputReserve), BigNumber.from(inputReserve));
};

export const getPriceOnSushiswap = async (amount: number, input: ERC20, output: ERC20): Promise<BigNumber> => {
	log.debug(`Getting price on Sushiswap for ${input.ticker}/${output.ticker}.`);

	const [inputReserve, outputReserve] = await getSushiswapReserves(input, output);

	if (!inputReserve || !outputReserve) {
		return BigNumber.from(0);
	}

	log.debug(`Sushiswap ${input.ticker} reserve: ${inputReserve}.`);
	log.debug(`Sushiswap ${output.ticker} reserve: ${outputReserve}.`);

	const amountMultiplier = BigNumber.from(10).pow(input.decimals);
	const amountIn = BigNumber.from(amount).mul(amountMultiplier);

	return calculateAmountOut(amountIn, BigNumber.from(inputReserve), BigNumber.from(outputReserve));
};

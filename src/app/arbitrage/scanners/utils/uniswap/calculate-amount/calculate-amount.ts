import { BigNumber } from '@ethersproject/bignumber';

const WITH_FEE_MULTIPLIER = 997;
const WITHOUT_FEE_MULTIPLIER = 1000;

/**
 * Equivalent to getAmountIn() from UniswapV2Library.sol
 *
 * https://github.com/Uniswap/uniswap-v2-periphery/blob/master/contracts/libraries/UniswapV2Library.sol
 *
 */
export function calculateAmountIn(amountOut: BigNumber, reserveIn: BigNumber, reserveOut: BigNumber): BigNumber {
	const numerator = reserveIn.mul(amountOut).mul(WITHOUT_FEE_MULTIPLIER);
	const denominator = reserveOut.sub(amountOut).mul(WITH_FEE_MULTIPLIER);

	return numerator.div(denominator).add(1);
}

/**
 * Equivalent to getAmountOut() from UniswapV2Library.sol
 *
 * https://github.com/Uniswap/uniswap-v2-periphery/blob/master/contracts/libraries/UniswapV2Library.sol
 *
 */
export function calculateAmountOut(amountIn: BigNumber, reserveIn: BigNumber, reserveOut: BigNumber): BigNumber {
	const amountInWithFee = amountIn.mul(WITH_FEE_MULTIPLIER);
	const numerator = amountInWithFee.mul(reserveOut);
	const denominator = reserveIn.mul(WITHOUT_FEE_MULTIPLIER).add(amountInWithFee);

	return numerator.div(denominator);
}

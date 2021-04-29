import { Swap } from '@balancer-labs/sor/dist/types';
import { ethers } from 'ethers';
import { ParamType } from 'ethers/lib/utils';

const pool: ParamType = ParamType.fromObject({ name: 'pool', type: 'address' });

const tokenIn: ParamType = ParamType.fromObject({ name: 'tokenIn', type: 'address' });

const tokenOut: ParamType = ParamType.fromObject({ name: 'tokenOut', type: 'address' });

const swapAmount: ParamType = ParamType.fromObject({ name: 'swapAmount', type: 'uint256' });

const limitReturnAmount: ParamType = ParamType.fromObject({ name: 'limitReturnAmount', type: 'uint256' });

const maxPrice: ParamType = ParamType.fromObject({ name: 'maxPrice', type: 'uint256' });

const swapsSolidityParamType: ParamType = ParamType.fromObject({
	type: '(address,address,address,uint256,uint256,uint256)[][]',
	components: [pool, tokenIn, tokenOut, swapAmount, limitReturnAmount, maxPrice],
});

export function abiEncodeSwaps(swaps: Swap[][]): string {
	const adjustedSwaps = fillMissingProps(swaps);
	return ethers.utils.defaultAbiCoder.encode([swapsSolidityParamType], [adjustedSwaps]);
}

function fillMissingProps(swaps: Swap[][]): Swap[][] {
	return swaps.map((outer) => outer.map((swap) => withMissingPropsSetToDefaults(swap)));
}

function withMissingPropsSetToDefaults(swap: Swap) {
	const swapCopy = { ...swap };

	Object.keys(swapCopy)
		.filter((key) => !swapCopy[key])
		.forEach((key) => (swapCopy[key] = '0'));

	return swapCopy;
}

import { ERC20 } from '../../../../ethereum/erc20.model';
import { getReserves } from '../../utils/uniswap/reserves/get-reserves';
import { computeUniswapPairAddress } from '../pair-address/compute-uniswap-pair-address';

export async function getUniswapReserves(token0: ERC20, token1: ERC20): Promise<string[]> {
	const address = computeUniswapPairAddress(token0, token1);
	return getReserves(address, token0, token1);
}

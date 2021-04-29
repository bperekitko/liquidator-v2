import { ERC20 } from '../../../../ethereum/erc20.model';
import { getReserves } from '../../utils/uniswap/reserves/get-reserves';
import { computeSushiswapPairAddress } from '../pair-address/compute-sushiswap-pair-address';

export async function getSushiswapReserves(token0: ERC20, token1: ERC20): Promise<string[]> {
	const address = computeSushiswapPairAddress(token0, token1);
	return getReserves(address, token0, token1);
}

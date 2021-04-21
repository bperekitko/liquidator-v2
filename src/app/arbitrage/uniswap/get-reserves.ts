import { ethers } from 'ethers';
import { config } from '../../../config/config';
import UniswapV2PairAbi from '../../ethereum/abi/UniswapV2Pair.json';
import { ERC20 } from '../../ethereum/erc20.model';
import { ethereumProvider } from '../../ethereum/ethereum-provider';
import { computeSushiswapPairAddress, computeUniswapPairAddress } from './compute-pair-address/compute-pair-address';

export async function getUniswapReserves(token0: ERC20, token1: ERC20): Promise<string[]> {
	const address = computeUniswapPairAddress(token0, token1);
	return getReserves(address, token0, token1);
}

export async function getSushiswapReserves(token0: ERC20, token1: ERC20): Promise<string[]> {
	const address = computeSushiswapPairAddress(token0, token1);
	return getReserves(address, token0, token1);
}

async function getReserves(address: string, token0: ERC20, token1: ERC20): Promise<string[]> {
	const pairContract = new ethers.Contract(address, UniswapV2PairAbi, ethereumProvider);
	const { reserve0, reserve1 } = await pairContract.getReserves();

	const address0 = token0.address[config.NETWORK];
	const address1 = token1.address[config.NETWORK];
	return address0 < address1 ? [reserve0, reserve1] : [reserve1, reserve0];
}

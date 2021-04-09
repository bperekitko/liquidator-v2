import { ethers } from 'ethers';
import { config } from '../../../config/config';
import UniswapV2PairAbi from '../../ethereum/abi/UniswapV2Pair.json';
import { ERC20 } from '../../ethereum/erc20.model';
import { ethereumProvider } from '../../ethereum/ethereum-provider';
import { log } from '../../logger/logger';
import { computeSushiswapPairAddress, computeUniswapPairAddress } from './compute-pair-address/compute-pair-address';

const NETWORK = config.NETWORK;

export async function getUniswapReserves(token0: ERC20, token1: ERC20): Promise<string[]> {
	const address = computeUniswapPairAddress(token0, token1);
	const isContract = await isContractAddress(address);

	if (!isContract) {
		log.warn(`No pair contract for ${token0.ticker}/${token1.ticker} on Uniswap!`);
	}

	return isContract ? getReserves(address, token0, token1) : [];
}

export async function getSushiswapReserves(token0: ERC20, token1: ERC20): Promise<string[]> {
	const address = computeSushiswapPairAddress(token0, token1);
	const isContract = await isContractAddress(address);

	if (!isContract) {
		log.warn(`No pair contract for ${token0.ticker}/${token1.ticker} on Sushiswap!`);
	}

	return isContract ? getReserves(address, token0, token1) : [];
}

async function getReserves(address: string, token0: ERC20, token1: ERC20): Promise<string[]> {
	const pairContract = new ethers.Contract(address, UniswapV2PairAbi, ethereumProvider);
	const { reserve0, reserve1 } = await pairContract.getReserves();

	return token0.address[NETWORK] < token1.address[NETWORK] ? [reserve0, reserve1] : [reserve1, reserve0];
}

async function isContractAddress(address: string): Promise<boolean> {
	const contractCode = await ethereumProvider.getCode(address);
	return contractCode !== '0x';
}

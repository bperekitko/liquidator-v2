import { ethers } from 'ethers';
import { SUSHISWAP_FACTORY_ADDRESS } from '../../../ethereum/constants/contracts/sushiswap';
import { UNISWAP_V2_FACTORY_ADDRESS } from '../../../ethereum/constants/contracts/uniswap';
import { ERC20 } from '../../../ethereum/erc20.model';

const UNISWAP_INIT_CODE_HASH = '0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f';
const SUSHISWAP_INIT_CODE_HASH = '0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303';

export function computeUniswapPairAddress(token0: ERC20, token1: ERC20): string {
	return computeAddress(token0, token1, UNISWAP_INIT_CODE_HASH, UNISWAP_V2_FACTORY_ADDRESS);
}

export function computeSushiswapPairAddress(token0: ERC20, token1: ERC20): string {
	return computeAddress(token0, token1, SUSHISWAP_INIT_CODE_HASH, SUSHISWAP_FACTORY_ADDRESS);
}

/**
 * Equivalent to Solidity code:
 *
 * address pair = address(uint(keccak256(abi.encodePacked(
 *        hex'ff',
 *        factory,
 *        keccak256(abi.encodePacked(token0, token1)),
 *        initCodeHash))))
 */
function computeAddress(token0: ERC20, token1: ERC20, initCodeHash: string, factoryAddress: string): string {
	const [address0, address1] = sorted(token0.address, token1.address);
	const pairHash = ethers.utils.solidityPack(['address', 'address'], [address0, address1]);
	const salt = ethers.utils.solidityKeccak256(['bytes'], [pairHash]);

	return ethers.utils.getCreate2Address(factoryAddress, salt, initCodeHash);
}

function sorted(address0: string, address1: string) {
	const result = [address0.toLocaleLowerCase(), address1.toLocaleLowerCase()];
	result.sort();
	return result;
}

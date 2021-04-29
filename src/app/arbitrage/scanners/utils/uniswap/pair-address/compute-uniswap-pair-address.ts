import { ethers } from 'ethers';
import { ERC20 } from '../../../../../ethereum/erc20.model';

/**
 * Equivalent to Solidity code:
 *
 * address pair = address(uint(keccak256(abi.encodePacked(
 *        hex'ff',
 *        factory,
 *        keccak256(abi.encodePacked(token0, token1)),
 *        initCodeHash))))
 */
export function computePairAddress(token0: ERC20, token1: ERC20, initCodeHash: string, factoryAddress: string): string {
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

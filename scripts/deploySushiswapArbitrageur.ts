import { BigNumber, ethers, FixedNumber } from 'ethers';
import fs from 'fs';
import { abi, bytecode } from '../artifacts/contracts/sushiswap/SushiswapArbitrageur.sol/SushiswapArbitrageur.json';
import { SUSHISWAP_V2_ROUTER_ADDRESS } from '../src/app/ethereum/constants/contracts/sushiswap';
import { UNISWAP_V2_FACTORY_ADDRESS } from '../src/app/ethereum/constants/contracts/uniswap';
import { ethereumProvider } from '../src/app/ethereum/ethereum-provider';
import { config } from '../src/config/config';

export async function deploySushiswapArbitrageur(): Promise<void> {
	const signer = new ethers.Wallet(config.SIGNER_PRIVATE_KEY, ethereumProvider);

	console.log('Deploying SushiswapArbitrageur contract with the account:', signer.address);

	const factory = new ethers.ContractFactory(abi, bytecode, signer);

	const arbitrageur = await factory.deploy(UNISWAP_V2_FACTORY_ADDRESS, SUSHISWAP_V2_ROUTER_ADDRESS);

	console.log('SushiswapArbitrageur deployed at address:', arbitrageur.address);
	const gasLimit = arbitrageur.deployTransaction.gasLimit;
	const gasPrice = BigNumber.from(100).mul(BigNumber.from(10).pow(9));
	const txCost = FixedNumber.from(gasLimit.mul(gasPrice)).divUnsafe(FixedNumber.from(BigNumber.from(10).pow(18)));

	console.log(`Deploying contract took ${gasLimit} gas, whith cost of ${txCost} ETH`);
	updateEnvFile(arbitrageur.address);
}

function updateEnvFile(newAddress: string) {
	const file = fs.readFileSync('.env', 'utf8');
	const re = new RegExp('^.*' + 'SUSHISWAP_ARBITRAGEUR_ADDRESS' + '.*$', 'gm');
	const result = file.replace(re, `SUSHISWAP_ARBITRAGEUR_ADDRESS=${newAddress}`);
	fs.writeFileSync('.env', result, 'utf8');
}

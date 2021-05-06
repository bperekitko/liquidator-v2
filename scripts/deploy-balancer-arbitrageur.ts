import { BigNumber, ethers, FixedNumber } from 'ethers';
import fs from 'fs';
import { abi, bytecode } from '../artifacts/contracts/balancer/BalancerArbitrageur.sol/BalancerArbitrageur.json';
import { BALANCER_EXCHANGE_ADDRESS } from '../src/app/ethereum/constants/contracts/balancer';
import { UNISWAP_V2_FACTORY_ADDRESS } from '../src/app/ethereum/constants/contracts/uniswap';
import { ethereumProvider } from '../src/app/ethereum/ethereum-provider';
import { config } from '../src/config/config';

export async function deployBalancerArbitrageur(): Promise<void> {
	const signer = new ethers.Wallet(config.SIGNER_PRIVATE_KEY, ethereumProvider);

	console.log('Deploying BalancerArbitrageur contract with the account:', signer.address);

	const factory = new ethers.ContractFactory(abi, bytecode, signer);

	const arbitrageur = await factory.deploy(UNISWAP_V2_FACTORY_ADDRESS, BALANCER_EXCHANGE_ADDRESS);

	console.log('BalancerArbitrageur deployed at address:', arbitrageur.address);
	const gasLimit = arbitrageur.deployTransaction.gasLimit;
	const gasPrice = BigNumber.from(100).mul(BigNumber.from(10).pow(9));
	const txCost = FixedNumber.from(gasLimit.mul(gasPrice)).divUnsafe(FixedNumber.from(BigNumber.from(10).pow(18)));

	console.log(`Deploying contract took ${gasLimit} gas (${txCost} ETH)`);
	updateEnvFile(arbitrageur.address);
}

function updateEnvFile(newAddress: string) {
	const file = fs.readFileSync('.env', 'utf8');
	const re = new RegExp('^.*' + 'BALANCER_ARBITRAGEUR_ADDRESS' + '.*$', 'gm');
	const result = file.replace(re, `BALANCER_ARBITRAGEUR_ADDRESS=${newAddress}`);
	fs.writeFileSync('.env', result, 'utf8');
}

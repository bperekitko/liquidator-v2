import fs from 'fs';
import { ethers } from 'hardhat';
import { SUSHISWAP_V2_ROUTER_ADDRESS } from '../src/app/ethereum/constants/contracts/sushiswap';
import { UNISWAP_V2_FACTORY_ADDRESS } from '../src/app/ethereum/constants/contracts/uniswap';

export async function deploySushiswapArbitrageur(): Promise<void> {
	const [deployer] = await ethers.getSigners();

	console.log('Deploying SushiswapArbitrageur contract with the account:', deployer.address);

	const SushiswapArbitrageur = await ethers.getContractFactory('SushiswapArbitrageur');
	const arbitrageur = await SushiswapArbitrageur.deploy(UNISWAP_V2_FACTORY_ADDRESS, SUSHISWAP_V2_ROUTER_ADDRESS);

	console.log('SushiswapArbitrageur deployed at address:', arbitrageur.address);
	updateEnvFile(arbitrageur.address);
}

function updateEnvFile(newAddress: string) {
	const file = fs.readFileSync('.env', 'utf8');
	const re = new RegExp('^.*' + 'SUSHISWAP_ARBITRAGEUR_ADDRESS' + '.*$', 'gm');
	const result = file.replace(re, `SUSHISWAP_ARBITRAGEUR_ADDRESS=${newAddress}`);
	fs.writeFileSync('.env', result, 'utf8');
}

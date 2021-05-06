import '@nomiclabs/hardhat-waffle';
import * as dotenv from 'dotenv';
import { ethers } from 'ethers';
import { task } from 'hardhat/config';
dotenv.config({ path: __dirname + '/.env' });

task('account:local', 'Prints the local signer account address and balance', async () => {
	const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545');
	await printSigner(provider);
});

task('account:remote', 'Prints the remote signer account address and balance', async () => {
	const infuraConfig = {
		projectId: process.env.INFURA_PROJECT_ID,
		projectSecret: process.env.INFURA_PROJECT_SECRET,
	};

	const provider = new ethers.providers.InfuraProvider(process.env.NETWORK, infuraConfig);
	await printSigner(provider);
});

async function printSigner(provider: ethers.providers.Provider): Promise<void> {
	const signer = new ethers.Wallet(process.env.SIGNER_PRIVATE_KEY, provider);

	const balanceInWei = await signer.getBalance();
	const balanceInEth = ethers.utils.parseEther(balanceInWei.toString());
	console.log(`Addresss: ${signer.address}.`);
	console.log(`Balance: ${balanceInEth.toString()} ETH`);
}

export default {
	networks: {
		hardhat: {
			chainId: 1,
			forking: {
				url: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
			},
			accounts: [
				{
					privateKey: '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
					balance: '10000000000000000000000',
				},
				{
					privateKey: '0x92db14e403b83dfe3df233f83dfa3a0d7096f21ca9b0d6d6b8d88b2b4ec1564e',
					balance: '10000000000000000000000',
				},
			],
		},
	},

	solidity: {
		compilers: [
			{
				version: '0.7.3',
			},
		],
		overrides: {
			'contracts/balancer/BalancerArbitrageur.sol': {
				version: '0.8.0',
			},
			'contracts/interfaces/IExchangeProxy.sol': {
				version: '0.8.0',
				settings: {},
			},
		},
	},
};

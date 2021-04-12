import '@nomiclabs/hardhat-waffle';
import * as dotenv from 'dotenv';
import { BigNumber, ethers, FixedNumber } from 'ethers';
import { task } from 'hardhat/config';
dotenv.config({ path: __dirname + '/.env' });

task('account:local', 'Prints the local signer account address and balance', async () => {
	await printSigner('http://127.0.0.1:8545');
});

task('account:remote', 'Prints the remote signer account address and balance', async () => {
	const providerLink = `https://${process.env.NETWORK}.infura.io/v3/${process.env.INFURA_PROJECT_ID}`;
	await printSigner(providerLink);
});

async function printSigner(providerLink: string): Promise<void> {
	const provider = new ethers.providers.JsonRpcProvider(providerLink);
	const signer = new ethers.Wallet(process.env.SIGNER_PRIVATE_KEY, provider);

	const address = signer.address;
	const balanceInWei = await signer.getBalance();
	const balanceInEth = FixedNumber.from(balanceInWei).divUnsafe(FixedNumber.from(BigNumber.from(10).pow(18)));
	console.log(`Addresss: ${address}, balance: ${balanceInEth.toString()} ETH`);
}

export default {
	networks: {
		hardhat: {
			forking: {
				url: `https://mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
			},
			accounts: [
				{
					privateKey: 'ad392d27178c475ec44af83db1144f9b4fc04b26b5b3dc9a0ac6294ffeab5593',
					balance: '10000000000000000000000',
				},
				{
					privateKey: 'a7ce87cddfc0cd64dad0d54d35a12a5c0169fc728cd63ce61f389fca36dd8ce1',
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

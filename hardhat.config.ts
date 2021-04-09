import '@nomiclabs/hardhat-waffle';
import * as dotenv from 'dotenv';
dotenv.config({ path: __dirname + '/.env' });

export default {
	networks: {
		hardhat: {
			forking: {
				url: `https://mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
			},
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

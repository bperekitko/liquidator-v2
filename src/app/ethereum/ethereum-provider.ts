import { ethers } from 'ethers';
import { config } from '../../config/config';

const networkLinks = {
	mainnet: `https://mainnet.infura.io/v3/${config.INFURA_PROJECT_ID}`,
	rinkeby: `https://rinkeby.infura.io/v3/${config.INFURA_PROJECT_ID}`,
	goerli: `https://goerli.infura.io/v3/${config.INFURA_PROJECT_ID}`,
	kovan: `https://kovan.infura.io/v3/${config.INFURA_PROJECT_ID}`,
	ropsten: `https://ropsten.infura.io/v3/${config.INFURA_PROJECT_ID}`,
	local: `http://127.0.0.1:8545`,
};

export const ethereumProvider = new ethers.providers.JsonRpcProvider(networkLinks[config.NETWORK]);

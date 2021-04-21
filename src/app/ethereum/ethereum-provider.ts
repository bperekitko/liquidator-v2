import { ethers } from 'ethers';
import { config } from '../../config/config';

const LOCAL_NETWORK_LINK = 'http://127.0.0.1:8545';

export const ethereumProvider = config.NETWORK === 'local' ? getLocalProvider() : getInfuraProvider();

function getInfuraProvider() {
	const infuraConfig = {
		projectId: config.INFURA_PROJECT_ID,
		projectSecret: config.INFURA_PROJECT_SECRET,
	};

	return new ethers.providers.InfuraProvider(config.NETWORK, infuraConfig);
}

function getLocalProvider() {
	return new ethers.providers.JsonRpcProvider(LOCAL_NETWORK_LINK);
}

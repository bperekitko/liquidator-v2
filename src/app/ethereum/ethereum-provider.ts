import { ethers } from 'ethers';
import { config } from '../../config/config';

const LOCAL_NETWORK_LINK = 'http://127.0.0.1:8545';

export const ethereumProvider = config.NETWORK === 'local' ? getLocalProvider() : getRemoteProvider();

function getRemoteProvider() {
	switch (config.PROVIDER) {
		case 'infura':
			return infuraProvider();
		case 'alchemy':
			return alchemyProvider();
	}

	throw Error('Unrecognized remote provider! Use infura or alchemy.');
}

function infuraProvider() {
	const infuraConfig = {
		projectId: config.INFURA_PROJECT_ID,
		projectSecret: config.INFURA_PROJECT_SECRET,
	};

	return new ethers.providers.InfuraProvider(config.NETWORK, infuraConfig);
}

function alchemyProvider() {
	return new ethers.providers.AlchemyProvider(config.NETWORK, config.ALCHEMY_API_KEY);
}

function getLocalProvider() {
	return new ethers.providers.JsonRpcProvider(LOCAL_NETWORK_LINK);
}

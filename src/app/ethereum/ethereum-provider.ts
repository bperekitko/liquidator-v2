import { ethers } from 'ethers';
import { config } from '../../config/config';

export const ethereumProvider = new ethers.providers.InfuraProvider(config.NETWORK, {
	projectId: config.INFURA_PROJECT_ID,
	projectSecret: config.INFURA_PROJECT_SECRET,
});

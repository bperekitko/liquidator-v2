import { config } from '../../config/config';

const ids = {
	mainnet: 1,
	ropsten: 3,
	rinkeby: 4,
	kovan: 42,
	goerli: 5,
	local: 1,
};

export const CHAIN_ID = ids[config.NETWORK] || ids.mainnet;

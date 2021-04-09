import { config } from '../../../../config/config';
import { EthereumAddress } from '../../ethereum-address.model';

const factoryAddresses: EthereumAddress = {
	mainnet: '0x5c69bee701ef814a2b6a3edd4b1652cb9cc5aa6f',
	local: '0x5c69bee701ef814a2b6a3edd4b1652cb9cc5aa6f',
};

const routerAddresses: EthereumAddress = {
	mainnet: '0x7a250d5630b4cf539739df2c5dacb4c659f2488d',
	local: '0x7a250d5630b4cf539739df2c5dacb4c659f2488d',
};

export const UNISWAP_V2_FACTORY_ADDRESS = factoryAddresses[config.NETWORK];
export const UNISWAP_V2_ROUTER_ADDRESS = routerAddresses[config.NETWORK];

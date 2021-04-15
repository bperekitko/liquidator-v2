import { config } from '../../../../config/config';
import { EthereumAddress } from '../../ethereum-address.model';

const factoryAddresses: EthereumAddress = {
	mainnet: '0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac',
	local: '0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac',
};
const routerAddresses: EthereumAddress = {
	mainnet: '0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F',
	local: '0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F',
};

export const SUSHISWAP_FACTORY_ADDRESS = factoryAddresses[config.NETWORK];
export const SUSHISWAP_V2_ROUTER_ADDRESS = routerAddresses[config.NETWORK];

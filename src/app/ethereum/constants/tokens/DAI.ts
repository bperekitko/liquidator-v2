import { config } from '../../../../config/config';
import { ERC20 } from '../../erc20.model';
import { EthereumAddress } from '../../ethereum-address.model';

const address: EthereumAddress = {
	mainnet: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
	local: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
};

export const DAI: ERC20 = {
	address: address[config.NETWORK],
	ticker: 'DAI',
	decimals: 18,
};

import { config } from '../../../../config/config';
import { ERC20 } from '../../erc20.model';
import { EthereumAddress } from '../../ethereum-address.model';

const address: EthereumAddress = {
	mainnet: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
	local: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
};

export const USDC: ERC20 = {
	address: address[config.NETWORK],
	ticker: 'USDC',
	decimals: 6,
	coinmarketcapId: 3408,
};

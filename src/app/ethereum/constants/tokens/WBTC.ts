import { config } from '../../../../config/config';
import { ERC20 } from '../../erc20.model';
import { EthereumAddress } from '../../ethereum-address.model';

const address: EthereumAddress = {
	mainnet: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
	kovan: '0xe0C9275E44Ea80eF17579d33c55136b7DA269aEb',
	local: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
};

export const WBTC: ERC20 = {
	address: address[config.NETWORK],
	ticker: 'WBTC',
	decimals: 8,
	coinmarketcapId: 3717,
	tradeAmount: 1,
};

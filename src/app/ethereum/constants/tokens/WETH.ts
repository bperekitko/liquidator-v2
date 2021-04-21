import { config } from '../../../../config/config';
import { ERC20 } from '../../erc20.model';
import { EthereumAddress } from '../../ethereum-address.model';

const address: EthereumAddress = {
	mainnet: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
	rinkeby: '0xc778417E063141139Fce010982780140Aa0cD5Ab',
	local: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
};

export const WETH: ERC20 = {
	address: address[config.NETWORK],
	ticker: 'WETH',
	decimals: 18,
	coinmarketcapId: 2396,
	tradeAmount: 25,
};

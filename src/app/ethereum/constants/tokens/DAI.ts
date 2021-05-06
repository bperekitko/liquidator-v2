import { config } from '../../../../config/config';
import { ERC20 } from '../../erc20.model';
import { EthereumAddress } from '../../ethereum-address.model';

const address: EthereumAddress = {
	mainnet: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
	rinkeby: '0x5592ec0cfb4dbc12d3ab100b257153436a1f0fea',
	kovan: '0x1528F3FCc26d13F7079325Fb78D9442607781c8C',
	local: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
};

export const DAI: ERC20 = {
	address: address[config.NETWORK],
	ticker: 'DAI',
	decimals: 18,
	coinmarketcapId: 4943,
	tradeAmount: 50000,
};

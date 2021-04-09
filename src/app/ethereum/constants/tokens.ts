import { ERC20 } from '../erc20.model';

export const DAI: ERC20 = {
	address: { mainnet: '0x6B175474E89094C44Da98b954EedeAC495271d0F' },
	ticker: 'DAI',
	decimals: 18,
};

export const WETH: ERC20 = {
	address: { mainnet: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' },
	ticker: 'WETH',
	decimals: 18,
};

export const USDC: ERC20 = {
	address: { mainnet: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' },
	ticker: 'USDC',
	decimals: 6,
};

export const WBTC: ERC20 = {
	address: { mainnet: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599' },
	ticker: 'WBTC',
	decimals: 8,
};

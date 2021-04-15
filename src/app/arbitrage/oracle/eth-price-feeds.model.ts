import { BigNumber } from '@ethersproject/bignumber';

export interface EthPriceFeeds {
	[tockenTicker: string]: BigNumber;
}

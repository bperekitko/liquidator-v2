import { BigNumber } from '@ethersproject/bignumber';
import axios, { AxiosRequestConfig } from 'axios';
import { ethers } from 'ethers';
import { config } from '../../../config/config';
import { ERC20 } from '../../ethereum/erc20.model';
import { EthPriceFeeds } from './eth-price-feeds.model';

const COINMARKETCAP_URL = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest';

const ETH_COINMARKETCAP_ID = 1027;

export async function getPriceInEthFor(tokens: ERC20[]): Promise<EthPriceFeeds> {
	const data = await getRawData(tokens);
	return mapToEthPriceFeeds(data, tokens);
}

async function getRawData(tokens: ERC20[]) {
	const result = await axios.get(COINMARKETCAP_URL, buildOptions(tokens));
	return result.data.data;
}

function buildOptions(tokens: ERC20[]): AxiosRequestConfig {
	const ids = tokens.map((t) => t.coinmarketcapId).join(',');
	return {
		params: {
			id: ids,
			convert_id: ETH_COINMARKETCAP_ID,
		},
		headers: {
			'X-CMC_PRO_API_KEY': config.COINMARKETCAP_API_KEY,
		},
	};
}

function mapToEthPriceFeeds(data: unknown, tokens: ERC20[]): EthPriceFeeds {
	const ethPriceFeeds = {};

	Object.keys(data).forEach((key): void => {
		const priceInEth = data[key].quote[ETH_COINMARKETCAP_ID].price;
		const priceInWei = convertToWei(priceInEth.toString());
		const tokenTicker = tokens.find((t) => t.coinmarketcapId === +key).ticker;
		ethPriceFeeds[tokenTicker] = priceInWei;
	});

	return ethPriceFeeds;
}

function convertToWei(priceInEth: string): BigNumber {
	const [wholePart, fractional] = priceInEth.split('.');
	const priceInEthWith18Decimals = `${wholePart}.${fractional.substring(0, 18)}`;

	const priceInWei = ethers.utils.parseEther(priceInEthWith18Decimals);
	return priceInWei;
}

import { BigNumber } from '@ethersproject/bignumber';
import { ERC20 } from '../../ethereum/erc20.model';
import { log } from '../../logger/logger';
import { getPriceInEthFor } from './coinmarketcap.service';
import { EthPriceFeeds } from './eth-price-feeds.model';

const COINMARKETCAP_URL = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest';
const UPDATE_PRICE_FEEDS_FREQUENCY_IN_MILIS = 5 * 60 * 1000;

let priceFeeds: EthPriceFeeds;
let interval: NodeJS.Timeout;

async function start(tokens: ERC20[]): Promise<void> {
	log.info(`Starting the price oracle!`);
	if (!interval) {
		await updatePriceFeeds(tokens);
		schedulePriceFeedsUpdates(tokens);
		log.info(`Price oracle successfully started.`);
	} else {
		log.warn(`Price oracle already started. Skipping initialization.`);
	}
}

function schedulePriceFeedsUpdates(tokens: ERC20[]) {
	interval = setInterval(
		() => updatePriceFeeds(tokens).catch((error) => log.error(error, 'Error while updating price feeds!')),
		UPDATE_PRICE_FEEDS_FREQUENCY_IN_MILIS
	);
}

function getEthPriceInWei(token: ERC20): BigNumber {
	return priceFeeds[token.ticker];
}

function stop(): void {
	if (interval) {
		clearInterval(interval);
	}
}

async function updatePriceFeeds(tokens: ERC20[]): Promise<void> {
	log.debug(`Updating eth price feeds for tokens: [${tokens.map((t) => t.ticker).join(', ')}]`);
	const updatedFeeds = await getPriceInEthFor(tokens);
	log.debug(`Update of eth price feeds completed!`);
	priceFeeds = updatedFeeds;
}

export const PriceOracle = {
	start,
	stop,
	getEthPriceInWei,
};

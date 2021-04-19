import { ethers } from 'ethers';
import express from 'express';
import { config } from '../config/config';
import { PriceOracle } from './arbitrage/oracle/price-oracle';
import { DAI } from './ethereum/constants/tokens/DAI';
import { USDC } from './ethereum/constants/tokens/USDC';
import { WBTC } from './ethereum/constants/tokens/WBTC';
import { WETH } from './ethereum/constants/tokens/WETH';
import { Logger } from './logger/logger';

const log = new Logger('SERVER');

export function startServer(): void {
	log.info('Starting the server.');
	const app = express();

	app.get('/arbitrage', (req, res) => {
		res.send('Arbitration radar started!');
	});

	app.get('/feeds', (req, res) => {
		const feeds = [DAI, USDC, WBTC, WETH]
			.map((token) => {
				const price = PriceOracle.getEthPriceInWei(token);
				return `[${token.ticker}]: ${ethers.utils.formatEther(price)}ETH`;
			})
			.join('\n');
		log.debug('Got request for price feeds: \n' + feeds);
		res.send(feeds);
	});

	app.listen(config.PORT, () => {
		log.info(`Server is listening on port: ${config.PORT}`);
	});
}

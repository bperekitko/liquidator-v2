import { BigNumber, ethers } from 'ethers';
import { Logger } from '../logger/logger';
import { ethereumProvider } from './ethereum-provider';

const GAS_UPDATE_FREQUENCY_IN_MILIS = 60 * 60 * 1000;

const log = new Logger('GAS PRICE PROVIDER');

let gasPrice: BigNumber;
let interval: NodeJS.Timeout;

const started = new Promise<void>((resolve) => {
	const startedInterval = setInterval(() => {
		if (!!interval) {
			resolve();
			clearInterval(startedInterval);
		}
	}, 500);
});

async function start(): Promise<void> {
	log.info('Starting to monitor gas price.');
	if (!interval) {
		await updateGasPrice();
		log.info(`Current gas price is ${ethers.utils.formatUnits(gasPrice, 'gwei')} gwei.`);
		scheduleUpdates();
		log.info('Gas price monitoring sucessfuly started.');
	}
}

function scheduleUpdates() {
	interval = setInterval(
		() => updateGasPrice().catch((error) => log.error('Error while updating gas price!', error)),
		GAS_UPDATE_FREQUENCY_IN_MILIS
	);
}

async function updateGasPrice() {
	log.debug(`Updating gas price.`);
	gasPrice = await ethereumProvider.getGasPrice();
	log.debug(`New gas price is ${ethers.utils.formatUnits(gasPrice, 'gwei')} gwei.`);
}

function stop(): void {
	clearInterval(interval);
	interval = undefined;
}

const getAverageGasPrice = async (): Promise<BigNumber> => {
	await started;
	return gasPrice;
};

const getFastestGasPrice = async (): Promise<BigNumber> => {
	await started;
	return gasPrice.mul(2);
};

export const GasPriceProvider = {
	start,
	stop,
	getAverageGasPrice,
	getFastestGasPrice,
};

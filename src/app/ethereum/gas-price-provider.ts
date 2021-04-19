import { BigNumber, ethers } from 'ethers';
import { Logger } from '../logger/logger';
import { ethereumProvider } from './ethereum-provider';

const GAS_UPDATE_FREQUENCY_IN_MILIS = 60 * 60 * 1000;

const log = new Logger('GAS PRICE PROVIDER');

let gasPrice: BigNumber;
let interval: NodeJS.Timeout;

async function start(): Promise<void> {
	log.debug('Starting to monitor gas price.');
	if (!interval) {
		await updateGasPrice();
		scheduleUpdates();
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

const getAverageGasPrice = (): BigNumber => gasPrice;
const getFastestGasPrice = (): BigNumber => gasPrice.mul(2);

export const GasPriceProvider = {
	start,
	stop,
	getAverageGasPrice,
	getFastestGasPrice,
};

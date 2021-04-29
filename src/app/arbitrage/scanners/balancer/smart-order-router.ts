import { SOR } from '@balancer-labs/sor';
import { Swap } from '@balancer-labs/sor/dist/types';
import { BigNumber } from '@balancer-labs/sor/dist/utils/bignumber';
import { CHAIN_ID } from '../../../ethereum/chain-id';
import { ethereumProvider } from '../../../ethereum/ethereum-provider';
import { GasPriceProvider } from '../../../ethereum/gas-price-provider';
import { Logger } from '../../../logger/logger';
import { TradeablePair } from '../../model/tradeable-pair.model';
import { POOLS_URL } from './pools-url';

const log = new Logger('BALANCER: SMART ORDER ROUTER');
const POOLS_FETCHING_FREQUENCY = 60 * 60 * 1000;
const MAX_POOLS_HOP = 4;
const SWAP_TYPE = 'swapExactIn';

let sor: SOR;
let poolsFetchingInterval: NodeJS.Timeout;

async function start(): Promise<void> {
	if (!poolsFetchingInterval) {
		log.info(`Initializing Smart Order Router`);

		const gasPrice = GasPriceProvider.getFastestGasPrice().toString();
		sor = new SOR(ethereumProvider, new BigNumber(gasPrice), MAX_POOLS_HOP, CHAIN_ID, POOLS_URL);
		await sor.fetchPools();
		schedulePoolsFetching();

		log.info(`Smart Order Router initialiazed`);
	} else {
		log.warn(`Smart Order Router already initialized, skipping`);
	}
}

function stop(): void {
	if (poolsFetchingInterval) {
		clearInterval(poolsFetchingInterval);
	} else {
		log.warn(`Smart Order Router already stopped.`);
	}
}

async function getPriceWithSwaps(pair: TradeablePair): Promise<{ swaps: Swap[][]; price: string }> {
	const outputToken = pair.getOutputToken();
	const inputToken = pair.getInputToken();

	await sor.setCostOutputToken(outputToken.address);

	const amountIn = new BigNumber(10).pow(inputToken.decimals).multipliedBy(inputToken.tradeAmount);

	const [swaps, amountOut] = await sor.getSwaps(inputToken.address, outputToken.address, SWAP_TYPE, amountIn);

	const ouputDenominator = new BigNumber(10).pow(outputToken.decimals).multipliedBy(inputToken.tradeAmount);
	const price = amountOut.div(ouputDenominator).decimalPlaces(6).toString();

	log.debug(`Balancer ${pair.toString()} price: ${price}`);

	return { swaps, price };
}

function schedulePoolsFetching() {
	poolsFetchingInterval = setInterval(() => sor.fetchPools(), POOLS_FETCHING_FREQUENCY);
}

export const SmartOrderRouter = {
	start,
	stop,
	getPriceWithSwaps,
};

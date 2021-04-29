import { TradeablePair } from '../../../model/tradeable-pair.model';
import { isDeployedContract } from '../../utils/is-deployed-contract';
import { getPossiblePairs } from '../../utils/uniswap/tradeable-pair/get-tradeable-pairs';
import { computeUniswapPairAddress } from '../pair-address/compute-uniswap-pair-address';
import { uniswapLogger } from '../uniswap-logger';

const log = uniswapLogger;

export async function getUniswapTradeablePairs(): Promise<TradeablePair[]> {
	const pairsPromises = getPossiblePairs().map(toExistingUniswapPair);

	return (await Promise.all(pairsPromises)).filter((pair) => !!pair);
}

async function toExistingUniswapPair(pair: TradeablePair): Promise<TradeablePair> {
	const address = computeUniswapPairAddress(pair.getInputToken(), pair.getOutputToken());
	const exists = await isDeployedContract(address);

	if (!exists) {
		log.warn(`Pair ${pair.toString()} does not exist!`);
	}

	return exists ? pair : undefined;
}

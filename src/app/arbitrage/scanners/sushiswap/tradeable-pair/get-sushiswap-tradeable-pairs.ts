import { TradeablePair } from '../../../model/tradeable-pair.model';
import { isDeployedContract } from '../../utils/is-deployed-contract';
import { getPossiblePairs } from '../../utils/uniswap/tradeable-pair/get-tradeable-pairs';
import { computeSushiswapPairAddress } from '../pair-address/compute-sushiswap-pair-address';
import { sushiswapLogger } from '../susshiwap-logger';

const log = sushiswapLogger;

export async function getSushiswapTradeablePairs(): Promise<TradeablePair[]> {
	const pairsPromises = getPossiblePairs().map(toExistingSushiswapPair);

	return (await Promise.all(pairsPromises)).filter((pair) => !!pair);
}

async function toExistingSushiswapPair(pair: TradeablePair): Promise<TradeablePair> {
	const address = computeSushiswapPairAddress(pair.getInputToken(), pair.getOutputToken());
	const exists = await isDeployedContract(address);

	if (!exists) {
		log.warn(`Pair ${pair.toString()} does not exist!`);
	}

	return exists ? pair : undefined;
}

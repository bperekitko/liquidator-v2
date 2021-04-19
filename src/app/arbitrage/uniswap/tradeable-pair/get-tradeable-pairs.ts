import { ERC20 } from '../../../ethereum/erc20.model';
import { ethereumProvider } from '../../../ethereum/ethereum-provider';
import { Logger } from '../../../logger/logger';
import { computeSushiswapPairAddress, computeUniswapPairAddress } from '../compute-pair-address/compute-pair-address';
import { TradeablePair } from './tradeable-pair.model';

const EMPTY_CODE = '0x';

const log = new Logger('TRADEABLE PAIRS CALCULATOR');

export async function getUniswapTradeablePairs(tokens: ERC20[]): Promise<TradeablePair[]> {
	const pairs = await getPossiblePairs(tokens, computeUniswapPairAddress);

	return pairs.filter((pair) => {
		const hasAddress = pair.address !== undefined;
		if (!hasAddress) {
			log.warn(`Pair ${pair.inputToken.ticker}/${pair.outputToken.ticker} does not exist on Uniswap!`);
		}
		return hasAddress;
	});
}

export async function getSushiswapTradeablePairs(tokens: ERC20[]): Promise<TradeablePair[]> {
	const pairs = await getPossiblePairs(tokens, computeSushiswapPairAddress);

	return pairs.filter((pair) => {
		const hasAddress = pair.address !== undefined;
		if (!hasAddress) {
			log.warn(`Pair ${pair.inputToken.ticker}/${pair.outputToken.ticker} does not exist on Sushiswap!`);
		}
		return hasAddress;
	});
}

async function getPossiblePairs(
	tokens: ERC20[],
	computeAddress: (t0: ERC20, t1: ERC20) => string
): Promise<TradeablePair[]> {
	const pairsPromises = tokens
		.map((inputToken) => mapToPossibleCombinations(tokens, inputToken))
		.reduce((previous, current) => (current = [...current, ...previous]), [])
		.map(({ inputToken, outputToken }) => mapToTradeablePair(inputToken, outputToken, computeAddress));

	return Promise.all(pairsPromises);
}

function mapToPossibleCombinations(tokens: ERC20[], inputToken: ERC20): { inputToken: ERC20; outputToken: ERC20 }[] {
	const withoutSameToken = tokens.filter((t) => t.ticker !== inputToken.ticker);
	return withoutSameToken.map((outputToken) => ({ inputToken, outputToken }));
}

async function mapToTradeablePair(
	inputToken: ERC20,
	outputToken: ERC20,
	computeAddress: (t0: ERC20, t1: ERC20) => string
): Promise<TradeablePair> {
	const computedAddress = computeAddress(inputToken, outputToken);
	const isDeployed = await isDeployedContract(computedAddress);
	const address = isDeployed ? computedAddress : undefined;
	return { inputToken, outputToken, address };
}

async function isDeployedContract(address: string): Promise<boolean> {
	const code = await ethereumProvider.getCode(address);
	return code !== EMPTY_CODE;
}

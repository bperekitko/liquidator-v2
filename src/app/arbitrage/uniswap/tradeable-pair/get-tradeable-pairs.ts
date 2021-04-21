import { config } from '../../../../config/config';
import { ERC20 } from '../../../ethereum/erc20.model';
import { ethereumProvider } from '../../../ethereum/ethereum-provider';
import { SUPPORTED_TOKENS } from '../../../ethereum/supported-tokens';
import { Logger } from '../../../logger/logger';
import { computeSushiswapPairAddress, computeUniswapPairAddress } from '../compute-pair-address/compute-pair-address';
import { TradeablePair } from './tradeable-pair.model';

const EMPTY_CODE = '0x';

const log = new Logger('TRADEABLE PAIRS CALCULATOR');

export async function getUniswapTradeablePairs(): Promise<TradeablePair[]> {
	const pairs = await getPossiblePairs(computeUniswapPairAddress);

	return pairs.filter((pair) => {
		const hasAddress = pair.isValid();
		if (!hasAddress) {
			log.warn(`Pair ${pair.toString()} does not exist on Uniswap!`);
		}
		return hasAddress;
	});
}

export async function getSushiswapTradeablePairs(): Promise<TradeablePair[]> {
	const pairs = await getPossiblePairs(computeSushiswapPairAddress);

	return pairs.filter((pair) => {
		const hasAddress = pair.isValid();
		if (!hasAddress) {
			log.warn(`Pair ${pair.toString()} does not exist on Sushiswap!`);
		}
		return hasAddress;
	});
}

async function getPossiblePairs(computeAddress: (t0: ERC20, t1: ERC20) => string): Promise<TradeablePair[]> {
	const inputTokens = config.INPUT_TOKENS.map(mapToErc20).filter((input) => !!input);
	const outputTokens = config.OUTPUT_TOKENS.map(mapToErc20).filter((input) => !!input);

	const pairsPromises = inputTokens
		.map((inputToken) => mapToPossibleCombinations(inputToken, outputTokens))
		.reduce((previous, current) => (current = [...current, ...previous]), [])
		.map(({ inputToken, outputToken }) => mapToTradeablePair(inputToken, outputToken, computeAddress));

	return Promise.all(pairsPromises);
}

function mapToErc20(ticker: string): ERC20 {
	const token = SUPPORTED_TOKENS.find((t) => t.ticker === ticker);
	if (!token) {
		const supportedTokensTickers = SUPPORTED_TOKENS.map((t) => t.ticker).join(', ');
		log.warn(`Token [${ticker}] is not supported yet. Supported tokens: ${supportedTokensTickers}`);
	}
	return token;
}

function mapToPossibleCombinations(inputToken: ERC20, ouputs: ERC20[]): { inputToken: ERC20; outputToken: ERC20 }[] {
	const withoutSameToken = ouputs.filter((t) => t.ticker !== inputToken.ticker);
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
	return new TradeablePair(inputToken, outputToken, address);
}

async function isDeployedContract(address: string): Promise<boolean> {
	const code = await ethereumProvider.getCode(address);
	return code !== EMPTY_CODE;
}

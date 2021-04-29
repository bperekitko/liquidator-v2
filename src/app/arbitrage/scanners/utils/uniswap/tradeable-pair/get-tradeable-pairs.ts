import { config } from '../../../../../../config/config';
import { ERC20 } from '../../../../../ethereum/erc20.model';
import { SUPPORTED_TOKENS } from '../../../../../ethereum/supported-tokens';
import { Logger } from '../../../../../logger/logger';
import { TradeablePair } from '../../../../model/tradeable-pair.model';

const log = new Logger('TRADEABLE PAIRS CALCULATOR');

export function getPossiblePairs(): TradeablePair[] {
	const inputTokens = config.INPUT_TOKENS.map(mapToErc20).filter((input) => !!input);
	const outputTokens = config.OUTPUT_TOKENS.map(mapToErc20).filter((input) => !!input);

	return inputTokens
		.map((inputToken) => mapToPossibleCombinations(inputToken, outputTokens))
		.reduce((previous, current) => (current = [...current, ...previous]), [])
		.map(({ inputToken, outputToken }) => new TradeablePair(inputToken, outputToken));
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

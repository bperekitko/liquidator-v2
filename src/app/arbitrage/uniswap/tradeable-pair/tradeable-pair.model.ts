import { ERC20 } from '../../../ethereum/erc20.model';

export interface TradeablePair {
	inputToken: ERC20;
	outputToken: ERC20;
	address: string;
}

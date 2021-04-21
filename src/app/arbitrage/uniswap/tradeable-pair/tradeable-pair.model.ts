import { ERC20 } from '../../../ethereum/erc20.model';

export class TradeablePair {
	private inputToken: ERC20;
	private outputToken: ERC20;
	private address: string;
	private tradeAmount: number;

	constructor(inputToken: ERC20, outputToken: ERC20, address: string) {
		this.inputToken = inputToken;
		this.outputToken = outputToken;
		this.address = address;
		this.tradeAmount = inputToken.tradeAmount;
	}

	getInputToken(): ERC20 {
		return this.inputToken;
	}

	getAddress(): string {
		return this.address;
	}

	getOutputToken(): ERC20 {
		return this.outputToken;
	}

	getTradeAmount(): number {
		return this.tradeAmount;
	}

	equals(other: TradeablePair): boolean {
		return (
			other.getInputToken().ticker === this.inputToken.ticker &&
			other.getOutputToken().ticker === this.outputToken.ticker
		);
	}

	isValid(): boolean {
		return !!this.address;
	}

	toString(): string {
		return `${this.inputToken.ticker}/${this.outputToken.ticker}`;
	}
}

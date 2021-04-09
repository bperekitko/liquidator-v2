import { EthereumAddress } from './ethereum-address.model';

export interface ERC20 {
	address: EthereumAddress;
	ticker: string;
	decimals: number;
}

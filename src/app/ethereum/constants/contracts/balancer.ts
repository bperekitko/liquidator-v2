import { config } from '../../../../config/config';
import { EthereumAddress } from '../../ethereum-address.model';

const exchangeAddresses: EthereumAddress = {
	mainnet: '0x3E66B66Fd1d0b02fDa6C811Da9E0547970DB2f21',
	local: '0x3E66B66Fd1d0b02fDa6C811Da9E0547970DB2f21',
};

export const BALANCER_EXCHANGE_ADDRESS = exchangeAddresses[config.NETWORK];

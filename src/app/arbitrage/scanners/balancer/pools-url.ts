import { config } from '../../../../config/config';
import { EthereumAddress } from '../../../ethereum/ethereum-address.model';

const urls: EthereumAddress = {
	mainnet: 'https://ipfs.fleek.co/ipns/balancer-bucket.storage.fleek.co/balancer-exchange/pools',
	kovan: 'https://ipfs.fleek.co/ipns/balancer-bucket.storage.fleek.co/balancer-exchange-kovan/pools',
	local: 'https://ipfs.fleek.co/ipns/balancer-bucket.storage.fleek.co/balancer-exchange/pools',
};

export const POOLS_URL = urls[config.NETWORK] || urls.mainnet;

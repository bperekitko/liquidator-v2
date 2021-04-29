import { SUSHISWAP_FACTORY_ADDRESS } from '../../../../ethereum/constants/contracts/sushiswap';
import { ERC20 } from '../../../../ethereum/erc20.model';
import { computePairAddress } from '../../utils/uniswap/pair-address/compute-uniswap-pair-address';

const SUSHISWAP_INIT_CODE_HASH = '0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303';

export function computeSushiswapPairAddress(token0: ERC20, token1: ERC20): string {
	return computePairAddress(token0, token1, SUSHISWAP_INIT_CODE_HASH, SUSHISWAP_FACTORY_ADDRESS);
}

import { UNISWAP_V2_FACTORY_ADDRESS } from '../../../../ethereum/constants/contracts/uniswap';
import { ERC20 } from '../../../../ethereum/erc20.model';
import { computePairAddress } from '../../utils/uniswap/pair-address/compute-uniswap-pair-address';

const UNISWAP_INIT_CODE_HASH = '0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f';

export function computeUniswapPairAddress(token0: ERC20, token1: ERC20): string {
	return computePairAddress(token0, token1, UNISWAP_INIT_CODE_HASH, UNISWAP_V2_FACTORY_ADDRESS);
}

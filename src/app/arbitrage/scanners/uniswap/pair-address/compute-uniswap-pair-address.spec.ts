import { expect } from 'chai';
import { DAI } from '../../../../ethereum/constants/tokens/DAI';
import { USDC } from '../../../../ethereum/constants/tokens/USDC';
import { WBTC } from '../../../../ethereum/constants/tokens/WBTC';
import { WETH } from '../../../../ethereum/constants/tokens/WETH';
import { computeUniswapPairAddress } from './compute-uniswap-pair-address';

describe('Compute Uniswap pair address', function () {
	it('should calculate correct DAI/WETH pair address', function () {
		const expected = '0xA478c2975Ab1Ea89e8196811F51A7B7Ade33eB11';

		const result = computeUniswapPairAddress(DAI, WETH);
		const result2 = computeUniswapPairAddress(WETH, DAI);

		expect(result).eq(expected);
		expect(result2).eq(expected);
	});

	it('should calculate correct DAI/USDC pair address', function () {
		const expected = '0xAE461cA67B15dc8dc81CE7615e0320dA1A9aB8D5';

		const result = computeUniswapPairAddress(DAI, USDC);
		const result2 = computeUniswapPairAddress(USDC, DAI);

		expect(result).eq(expected);
		expect(result2).eq(expected);
	});

	it('should calculate correct WBTC/WETH pair address', function () {
		const expected = '0xBb2b8038a1640196FbE3e38816F3e67Cba72D940';

		const result = computeUniswapPairAddress(WBTC, WETH);
		const result2 = computeUniswapPairAddress(WETH, WBTC);

		expect(result).eq(expected);
		expect(result2).eq(expected);
	});

	it('should calculate correct WBTC/USDC pair address', function () {
		const expected = '0x004375Dff511095CC5A197A54140a24eFEF3A416';

		const result = computeUniswapPairAddress(WBTC, USDC);
		const result2 = computeUniswapPairAddress(USDC, WBTC);

		expect(result).eq(expected);
		expect(result2).eq(expected);
	});
});

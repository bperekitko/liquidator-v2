import { expect } from 'chai';
import { DAI, USDC, WBTC, WETH } from '../../../ethereum/constants/tokens';
import { computeSushiswapPairAddress } from './compute-pair-address';

describe('Compute Sushiswap pair address', function () {
	it('should calculate correct DAI/WETH pair address', function () {
		const expected = '0xC3D03e4F041Fd4cD388c549Ee2A29a9E5075882f';

		const result = computeSushiswapPairAddress(DAI, WETH);
		const result2 = computeSushiswapPairAddress(WETH, DAI);

		expect(result).eq(expected);
		expect(result2).eq(expected);
	});

	it('should calculate correct DAI/USDC pair address', function () {
		const expected = '0xAaF5110db6e744ff70fB339DE037B990A20bdace';

		const result = computeSushiswapPairAddress(DAI, USDC);
		const result2 = computeSushiswapPairAddress(USDC, DAI);

		expect(result).eq(expected);
		expect(result2).eq(expected);
	});

	it('should calculate correct WBTC/WETH pair address', function () {
		const expected = '0xCEfF51756c56CeFFCA006cD410B03FFC46dd3a58';

		const result = computeSushiswapPairAddress(WBTC, WETH);
		const result2 = computeSushiswapPairAddress(WETH, WBTC);

		expect(result).eq(expected);
		expect(result2).eq(expected);
	});

	it('should calculate correct WBTC/USDC pair address', function () {
		const expected = '0xca0e83cb6A9cF0AAA3E0Eb44C43B3e2E445CBc46';

		const result = computeSushiswapPairAddress(WBTC, USDC);
		const result2 = computeSushiswapPairAddress(USDC, WBTC);

		expect(result).eq(expected);
		expect(result2).eq(expected);
	});
});

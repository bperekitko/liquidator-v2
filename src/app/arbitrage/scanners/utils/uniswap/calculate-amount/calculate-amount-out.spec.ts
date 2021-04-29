import { BigNumber } from '@ethersproject/bignumber';
import { expect } from 'chai';
import { calculateAmountOut } from './calculate-amount';

const amountOutTestData = [
	{
		expected: '48',
		amountIn: BigNumber.from('100000'),
		reserveIn: BigNumber.from('60008726399086636904401887'),
		reserveOut: BigNumber.from('29026106481378182682578'),
	},
	{
		expected: '99690',
		amountIn: BigNumber.from('100000'),
		reserveIn: BigNumber.from('1000000000'),
		reserveOut: BigNumber.from('1000000000'),
	},
	{
		expected: '19939',
		amountIn: BigNumber.from('100000'),
		reserveIn: BigNumber.from('5000000000'),
		reserveOut: BigNumber.from('1000000000'),
	},
	{
		expected: '123',
		amountIn: BigNumber.from('12345678901'),
		reserveIn: BigNumber.from('123456789012345678'),
		reserveOut: BigNumber.from('1234567890'),
	},
];

describe('Calculate amount', function () {
	amountOutTestData.forEach(({ expected, amountIn, reserveIn, reserveOut }) => {
		it('should calculate correct amountOut', () => {
			const result = calculateAmountOut(amountIn, reserveIn, reserveOut).toString();

			expect(result).eq(expected);
		});
	});
});

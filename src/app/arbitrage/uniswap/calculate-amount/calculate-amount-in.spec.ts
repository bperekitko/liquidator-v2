import { BigNumber } from '@ethersproject/bignumber';
import { expect } from 'chai';
import { calculateAmountIn } from './calculate-amount';

const amountInTestData = [
	{
		expected: '207362618',
		amountOut: BigNumber.from('100000'),
		reserveIn: BigNumber.from('60008726399086636904401887'),
		reserveOut: BigNumber.from('29026106481378182682578'),
	},
	{
		expected: '100311',
		amountOut: BigNumber.from('100000'),
		reserveIn: BigNumber.from('1000000000'),
		reserveOut: BigNumber.from('1000000000'),
	},
	{
		expected: '20061',
		amountOut: BigNumber.from('100000'),
		reserveIn: BigNumber.from('1000000000'),
		reserveOut: BigNumber.from('5000000000'),
	},
	{
		expected: '124',
		amountOut: BigNumber.from('12345678901'),
		reserveIn: BigNumber.from('1234567890'),
		reserveOut: BigNumber.from('123456789012345678'),
	},
];

describe('Calculate amount', function () {
	amountInTestData.forEach(({ expected, amountOut, reserveIn, reserveOut }) => {
		it('should calculate correct amountOut', () => {
			const result = calculateAmountIn(amountOut, reserveIn, reserveOut).toString();

			expect(result).eq(expected);
		});
	});
});

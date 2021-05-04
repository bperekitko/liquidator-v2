import { TransactionResponse } from '@ethersproject/providers';
import { BigNumber, ethers } from 'ethers';
import UniswapV2PairAbi from '../../ethereum/abi/UniswapV2Pair.json';
import { ERC20 } from '../../ethereum/erc20.model';
import { ethereumSigner } from '../../ethereum/ethereum-signer';
import { GasPriceProvider } from '../../ethereum/gas-price-provider';
import { Opportunity } from '../model/opportunity.model';
import { computeUniswapPairAddress } from '../scanners/uniswap/pair-address/compute-uniswap-pair-address';

export async function executeArbitrage(
	{ pair, arbitrageEncodedData }: Opportunity,
	arbitrageContractAddress: string
): Promise<TransactionResponse> {
	const amount = pair.getTradeAmount();
	const inputToken = pair.getInputToken();
	const outputToken = pair.getOutputToken();

	const { amount0Out, amount1Out } = getAmountsOut(amount, inputToken, outputToken);
	const pairContract = getPairContract(inputToken, outputToken);
	const overrides = { gasPrice: (await GasPriceProvider.getFastestGasPrice()).toString() };
	return pairContract.swap(amount0Out, amount1Out, arbitrageContractAddress, arbitrageEncodedData, overrides);
}

export async function estimateGasForArbitrage(
	{ pair, arbitrageEncodedData }: Opportunity,
	arbitrageContractAddress: string
): Promise<BigNumber> {
	const amount = pair.getTradeAmount();
	const inputToken = pair.getInputToken();
	const outputToken = pair.getOutputToken();

	const { amount0Out, amount1Out } = getAmountsOut(amount, inputToken, outputToken);
	const pairContract = getPairContract(inputToken, outputToken);
	const overrides = { gasPrice: (await GasPriceProvider.getFastestGasPrice()).toString() };
	// return pairContract.estimateGas.swap(
	// 	amount0Out,
	// 	amount1Out,
	// 	arbitrageContractAddress,
	// 	arbitrageEncodedData,
	// 	overrides
	// );
	return BigNumber.from('235000');
}

function getPairContract(inputToken: ERC20, outputToken: ERC20) {
	const pairAddress = computeUniswapPairAddress(inputToken, outputToken);

	return new ethers.Contract(pairAddress, UniswapV2PairAbi, ethereumSigner);
}

function getAmountsOut(amount: number, inputToken: ERC20, outputToken: ERC20) {
	const amountToSwap = ethers.utils.parseUnits(amount.toString(), inputToken.decimals);

	const inputTokenAddress = inputToken.address;
	const outputTokenAddress = outputToken.address;

	const amount0Out = inputTokenAddress < outputTokenAddress ? amountToSwap.toString() : '0';
	const amount1Out = inputTokenAddress > outputTokenAddress ? amountToSwap.toString() : '0';
	return { amount0Out, amount1Out };
}

import { TransactionResponse } from '@ethersproject/providers';
import { BigNumber, ethers } from 'ethers';
import UniswapV2PairAbi from '../../ethereum/abi/UniswapV2Pair.json';
import { ERC20 } from '../../ethereum/erc20.model';
import { ethereumSigner } from '../../ethereum/ethereum-signer';
import { GasPriceProvider } from '../../ethereum/gas-price-provider';
import { computeUniswapPairAddress } from '../uniswap/compute-pair-address/compute-pair-address';
import { TradeablePair } from '../uniswap/tradeable-pair/tradeable-pair.model';

export function executeArbitrage(
	pair: TradeablePair,
	arbitrageContractAddress: string,
	encodedData: string
): Promise<TransactionResponse> {
	const amount = pair.getTradeAmount();
	const inputToken = pair.getInputToken();
	const outputToken = pair.getOutputToken();

	const { amount0Out, amount1Out } = getAmountsOut(amount, inputToken, outputToken);
	const pairContract = getPairContract(inputToken, outputToken);
	const overrides = { gasPrice: GasPriceProvider.getFastestGasPrice().toString() };
	return pairContract.swap(amount0Out, amount1Out, arbitrageContractAddress, encodedData, overrides);
}

export function estimateGasForArbitrage(
	pair: TradeablePair,
	arbitrageContractAddress: string,
	encodedData: string
): Promise<BigNumber> {
	const amount = pair.getTradeAmount();
	const inputToken = pair.getInputToken();
	const outputToken = pair.getOutputToken();

	const { amount0Out, amount1Out } = getAmountsOut(amount, inputToken, outputToken);
	const pairContract = getPairContract(inputToken, outputToken);
	const overrides = { gasPrice: GasPriceProvider.getFastestGasPrice().toString() };
	return pairContract.estimateGas.swap(amount0Out, amount1Out, arbitrageContractAddress, encodedData, overrides);
}

function getPairContract(inputToken: ERC20, outputToken: ERC20) {
	const pairAddress = computeUniswapPairAddress(inputToken, outputToken);

	const pairContract = new ethers.Contract(pairAddress, UniswapV2PairAbi, ethereumSigner);
	return pairContract;
}

function getAmountsOut(amount: number, inputToken: ERC20, outputToken: ERC20) {
	const amountToSwap = ethers.utils.parseUnits(amount.toString(), inputToken.decimals);

	const inputTokenAddress = inputToken.address;
	const outputTokenAddress = outputToken.address;

	const amount0Out = inputTokenAddress < outputTokenAddress ? amountToSwap.toString() : '0';
	const amount1Out = inputTokenAddress > outputTokenAddress ? amountToSwap.toString() : '0';
	return { amount0Out, amount1Out };
}

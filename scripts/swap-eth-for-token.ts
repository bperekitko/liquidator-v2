import { BigNumber, ethers } from 'ethers';
import uniswapV2RouterAbi from '../src/app/ethereum/abi/UniswapV2Router02.json';
import { UNISWAP_V2_ROUTER_ADDRESS } from '../src/app/ethereum/constants/contracts/uniswap';
import { DAI } from '../src/app/ethereum/constants/tokens/DAI';
import { USDC } from '../src/app/ethereum/constants/tokens/USDC';
import { WBTC } from '../src/app/ethereum/constants/tokens/WBTC';
import { WETH } from '../src/app/ethereum/constants/tokens/WETH';
import { ethereumSigner } from '../src/app/ethereum/ethereum-signer';

async function main(): Promise<void> {
	const amountToSwap = process.argv[2];
	const swapOutputTokenTicker = process.argv[3];
	const outputToken = [DAI, USDC, WBTC].find((token) => token.ticker === swapOutputTokenTicker);

	if (!amountToSwap || !outputToken) {
		console.log(`Invalid amount or outputToken provided! Usage: 'npm run swap:eth 10 DAI'`);
		return;
	}

	const router = new ethers.Contract(UNISWAP_V2_ROUTER_ADDRESS, uniswapV2RouterAbi, ethereumSigner);

	const amountInGwei = BigNumber.from(10).pow(WETH.decimals).mul(amountToSwap).toString();
	const deadline = new Date().getTime() + 1000000000;

	const transaction = await router.swapExactETHForTokens(
		'1000',
		[WETH.address, outputToken.address],
		ethereumSigner.address,
		deadline.toString(),
		{ value: amountInGwei }
	);

	const receipt = await transaction.wait();
	console.log(`Success transaction ${receipt.transactionHash} mined on block ${receipt.blockNumber}`);
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});

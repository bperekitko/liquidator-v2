import { BigNumber, ethers, FixedNumber } from 'ethers';
import ERC20Abi from '../src/app/ethereum/abi/ERC20.json';
import { DAI } from '../src/app/ethereum/constants/tokens/DAI';
import { USDC } from '../src/app/ethereum/constants/tokens/USDC';
import { WBTC } from '../src/app/ethereum/constants/tokens/WBTC';
import { WETH } from '../src/app/ethereum/constants/tokens/WETH';
import { ethereumSigner } from '../src/app/ethereum/ethereum-signer';

async function main(): Promise<void> {
	const tokenToCheck = [DAI, USDC, WBTC, WETH].find((token) => token.ticker === process.argv[2]);

	if (!tokenToCheck) {
		console.log('Invalid token provided! Usage: "npm run check:balance DAI');
		return;
	}

	const daiContract = new ethers.Contract(tokenToCheck.address, ERC20Abi, ethereumSigner);

	const balance = await daiContract.balanceOf(ethereumSigner.address);
	const denominator = FixedNumber.from(BigNumber.from(10).pow(tokenToCheck.decimals));
	const fixedBalance = FixedNumber.from(balance).divUnsafe(denominator).toString();

	console.log(`${tokenToCheck.ticker} balance of ${ethereumSigner.address} is ${fixedBalance}`);
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});

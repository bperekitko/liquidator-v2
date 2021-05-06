import { deployBalancerArbitrageur } from './deploy-balancer-arbitrageur';
import { deploySushiswapArbitrageur } from './deploy-sushiswap-arbitrageur';

async function deploy() {
	await deploySushiswapArbitrageur();
	await deployBalancerArbitrageur();
}

deploy()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});

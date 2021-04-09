import { deploySushiswapArbitrageur } from './deploySushiswapArbitrageur';

async function deploy() {
	await deploySushiswapArbitrageur();
}

deploy()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});

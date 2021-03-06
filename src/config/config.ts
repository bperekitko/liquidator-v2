export const config = {
	SIGNER_PRIVATE_KEY: process.env.SIGNER_PRIVATE_KEY,

	INFURA_PROJECT_ID: process.env.INFURA_PROJECT_ID,
	INFURA_PROJECT_SECRET: process.env.INFURA_PROJECT_SECRET,
	COINMARKETCAP_API_KEY: process.env.COINMARKETCAP_API_KEY,
	ALCHEMY_API_KEY: process.env.ALCHEMY_API_KEY,

	PROVIDER: process.env.PROVIDER,
	NETWORK: process.env.NETWORK || 'mainnet',
	LOG_LEVEL: process.env.LOG_LEVEL || 'info',
	PORT: process.env.PORT || 3000,

	INPUT_TOKENS: process.env.INPUT_TOKENS?.split(',').map((ticker) => ticker.trim()),
	OUTPUT_TOKENS: process.env.OUTPUT_TOKENS?.split(',').map((ticker) => ticker.trim()),

	SUSHISWAP_ARBITRAGEUR_ADDRESS: process.env.SUSHISWAP_ARBITRAGEUR_ADDRESS,
	BALANCER_ARBITRAGEUR_ADDRESS: process.env.BALANCER_ARBITRAGEUR_ADDRESS,
};

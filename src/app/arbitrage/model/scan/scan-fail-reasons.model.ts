export enum ScanFailReason {
	PRICE_TOO_HIGH = 'Target price too high to perform arbitrage.',
	GAS_COSTS_TOO_HIGH = 'Gas costs exceeds estimated profit.',
	PAIR_IMPOSSIBLE_TO_SCAN = 'Pair is impossible to scan on target DEX.',
}

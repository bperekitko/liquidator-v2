import { ethereumProvider } from '../../../ethereum/ethereum-provider';

const EMPTY_CODE = '0x';

export async function isDeployedContract(address: string): Promise<boolean> {
	const code = await ethereumProvider.getCode(address);
	return code !== EMPTY_CODE;
}

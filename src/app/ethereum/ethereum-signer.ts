import { ethers } from 'ethers';
import { config } from '../../config/config';
import { ethereumProvider } from './ethereum-provider';

export const ethereumSigner = new ethers.Wallet(config.SIGNER_PRIVATE_KEY, ethereumProvider);

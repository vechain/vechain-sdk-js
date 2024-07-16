import {
    HardhatVeChainProvider,
    ProviderInternalBaseWallet
} from '@vechain/sdk-network';
import { expect } from 'expect';
import { TESTNET_URL } from '@vechain/sdk-constant';

// START_SNIPPET: VechainHardhatProviderSnippet

// 1 - Init provider
const provider = new HardhatVeChainProvider(
    new ProviderInternalBaseWallet([]),
    TESTNET_URL,
    (message: string, parent?: Error) => new Error(message, parent)
);

// 2 - Call RPC function
const rpcCallChainId = await provider.request({
    method: 'eth_chainId'
});

// END_SNIPPET: VechainHardhatProviderSnippet

expect(rpcCallChainId).toBe('0x186aa');

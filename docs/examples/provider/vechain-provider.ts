import { TESTNET_URL, ThorClient, VeChainProvider } from '@vechain/sdk-network';
import { expect } from 'expect';

// START_SNIPPET: VeChainProviderSnippet

// 1 - Create thor client for testnet
const thorClient = ThorClient.at(TESTNET_URL);

// 2 - Init provider
const provider = new VeChainProvider(thorClient);

// 3 - Call RPC function
const rpcCallChainId = await provider.request({
    method: 'eth_chainId'
});

// END_SNIPPET: VeChainProviderSnippet

expect(rpcCallChainId).toBe('0x186aa');

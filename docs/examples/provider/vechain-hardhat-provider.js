import { CHAIN_ID, HardhatVeChainProvider, ProviderInternalBaseWallet, TESTNET_URL } from '@vechain/sdk-network';
import { expect } from 'expect';
// START_SNIPPET: VechainHardhatProviderSnippet
// 1 - Init provider
const provider = new HardhatVeChainProvider(new ProviderInternalBaseWallet([]), TESTNET_URL, (message, parent) => new Error(message, parent));
// 2 - Call RPC function
const rpcCallChainId = await provider.request({
    method: 'eth_chainId'
});
// END_SNIPPET: VechainHardhatProviderSnippet
expect(rpcCallChainId).toBe(CHAIN_ID.TESTNET);

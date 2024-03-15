import { HttpClient, ThorClient } from '@vechain/sdk-network';
import { VechainProvider } from '@vechain/sdk-provider';
import { expect } from 'expect';

// 1 - Create thor client for testnet
const testnetUrl = 'https://testnet.vechain.org';
const testNetwork = new HttpClient(testnetUrl);
const thorClient = new ThorClient(testNetwork);

// 2 - Init provider
const provider = new VechainProvider(thorClient);

// 3 - Call RPC function
const rpcCallChainId = await provider.request({
    method: 'eth_chainId'
});

expect(rpcCallChainId).toBe('0x186aa');

import { HttpClient, ThorClient } from '@vechain/sdk-network';
import { expect } from 'expect';
import { TESTNET_URL } from '@vechain/sdk-constant';

// START_SNIPPET: InitializingThorClientSnippet

// First way to initialize thor client
const httpClient = new HttpClient(TESTNET_URL);
const thorClient = new ThorClient(httpClient);

// Second way to initialize thor client
const thorClient2 = ThorClient.fromUrl(TESTNET_URL);

// END_SNIPPET: InitializingThorClientSnippet

expect(thorClient).toBeDefined();
expect(thorClient2).toBeDefined();

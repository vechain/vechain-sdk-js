import { FetchHttpClient, TESTNET_URL, ThorClient } from '@vechain/sdk-network';
import { expect } from 'expect';

// START_SNIPPET: InitializingThorClientSnippet

// First way to initialize thor client
const httpClient = new FetchHttpClient(TESTNET_URL);
const thorClient = new ThorClient(httpClient);

// Second way to initialize thor client
const thorClient2 = ThorClient.fromUrl(TESTNET_URL);

// END_SNIPPET: InitializingThorClientSnippet

expect(thorClient).toBeDefined();
expect(thorClient2).toBeDefined();

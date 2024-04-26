import { HttpClient, ThorClient } from '@vechain/sdk-network';
import { expect } from 'expect';

// START_SNIPPET: InitializingThorClientSnippet

// First way to initialize thor client
const testnetUrl = 'https://testnet.vechain.org/';
const httpClient = new HttpClient(testnetUrl);
const thorClient = new ThorClient(httpClient);

// Second way to initialize thor client
const thorClient2 = ThorClient.fromUrl(testnetUrl);

// END_SNIPPET: InitializingThorClientSnippet

expect(thorClient).toBeDefined();
expect(thorClient2).toBeDefined();

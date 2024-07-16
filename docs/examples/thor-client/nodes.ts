import { ThorClient } from '@vechain/sdk-network';
import { expect } from 'expect';
import { TESTNET_URL } from '@vechain/sdk-constant';

// START_SNIPPET: NodesSnippet

// 1 - Create thor client for testnet

const thorClient = ThorClient.fromUrl(TESTNET_URL);

// 2 - Retrieves connected peers of a node

const peerNodes = await thorClient.nodes.getNodes();

// END_SNIPPET: NodesSnippet

expect(peerNodes).toBeDefined();

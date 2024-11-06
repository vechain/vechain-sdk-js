import { TESTNET_URL, ThorClient } from '@vechain/sdk-network';
import { expect } from 'expect';

// START_SNIPPET: NodesSnippet

// 1 - Create thor client for testnet

const thorClient = ThorClient.at(TESTNET_URL);

// 2 - Retrieves connected peers of a node

const peerNodes = await thorClient.nodes.getNodes();

// END_SNIPPET: NodesSnippet

expect(peerNodes).toBeDefined();

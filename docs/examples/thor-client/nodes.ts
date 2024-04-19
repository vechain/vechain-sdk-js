import { ThorClient } from '@vechain/sdk-network';
import { expect } from 'expect';

// START_SNIPPET: NodesSnippet

// 1 - Create thor client for testnet

const _testnetUrl = 'https://testnet.vechain.org';
const thorClient = ThorClient.fromUrl(_testnetUrl);

// 2 - Retrieves connected peers of a node

const peerNodes = await thorClient.nodes.getNodes();

// END_SNIPPET: NodesSnippet

expect(peerNodes).toBeDefined();

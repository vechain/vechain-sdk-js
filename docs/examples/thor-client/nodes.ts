import { HttpClient, ThorClient } from '@vechain/vechain-sdk-network';
import { expect } from 'expect';

// 1 - Create thor client for testnet

const _testnetUrl = 'https://testnet.vechain.org';
const testNetwork = new HttpClient(_testnetUrl);
const thorClient = new ThorClient(testNetwork);

// 2 - Retrieves connected peers of a node

const peerNodes = await thorClient.nodes.getNodes();
expect(peerNodes).toBeDefined();

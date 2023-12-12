import {
    HttpClient,
    ThorestClient
} from '@vechainfoundation/vechain-sdk-network';
import { expect } from 'expect';

// 1 - Create client for testnet

const _testnetUrl = 'https://testnet.vechain.org';
const testNetwork = new HttpClient(_testnetUrl);
const thorestClient = new ThorestClient(testNetwork);

// 2 - Retrieves connected peers of a node

const peerNodes = await thorestClient.nodes.getNodes();
expect(peerNodes).toBeDefined();

import { TESTNET_URL, ThorClient } from '@vechain/sdk-network';
import { expect } from 'expect';
// START_SNIPPET: BlocksSnippet
// 1 - Create thor client for testnet
const thorClient = ThorClient.at(TESTNET_URL);
// 2 - Get block details
// Details of block
const blockDetails = await thorClient.blocks.getBlockCompressed(1);
// 3 - Get best block details
const bestBlockDetails = await thorClient.blocks.getBestBlockExpanded();
expect(bestBlockDetails).toBeDefined();
// 4 - Get finalizes block details
const finalBlockDetails = await thorClient.blocks.getFinalBlockExpanded();
// END_SNIPPET: BlocksSnippet
expect(blockDetails).toEqual({
    number: 1,
    id: '0x000000019015bbd98fc1c9088d793ba9add53896a29cd9aa3a4dcabd1f561c38',
    size: 236,
    parentID: '0x000000000b2bce3c70bc649a02749e8687721b09ed2e15997f466536b20bb127',
    timestamp: 1530014410,
    gasLimit: 10000000,
    beneficiary: '0xb4094c25f86d628fdd571afc4077f0d0196afb48',
    gasUsed: 0,
    totalScore: 1,
    txsRoot: '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
    txsFeatures: 0,
    stateRoot: '0x4ec3af0acbad1ae467ad569337d2fe8576fe303928d35b8cdd91de47e9ac84bb',
    receiptsRoot: '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
    com: false,
    signer: '0x25ae0ef84da4a76d5a1dfe80d3789c2c46fee30a',
    isTrunk: true,
    isFinalized: true,
    transactions: []
});
expect(bestBlockDetails).toBeDefined();
expect(finalBlockDetails).toBeDefined();

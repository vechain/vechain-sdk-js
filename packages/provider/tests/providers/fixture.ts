import { vechain_sdk_core_ethers } from '@vechain/vechain-sdk-core';
import { zeroBlock } from '../rpc-mapper/methods/eth_getBlockByNumber/fixture';
import {
    validTransactionDetailTestnet,
    validTransactionHashTestnet
} from '../fixture';

/**
 * Test cases for provider methods
 */
const providerMethodsTestCases = [
    {
        description:
            "Should be able to call eth_getBlockByNumber with '0x0' as the block number",
        method: 'eth_getBlockByNumber',
        params: [vechain_sdk_core_ethers.toQuantity(0), false],
        expected: zeroBlock
    },
    {
        description: 'Should be able to call eth_chainId',
        method: 'eth_chainId',
        params: [],
        expected:
            '0x000000000b2bce3c70bc649a02749e8687721b09ed2e15997f466536b20bb127'
    },
    {
        description: `Should be able to call eth_getTransactionByHash with ${validTransactionHashTestnet} as the transaction hash`,
        method: 'eth_getTransactionByHash',
        params: [validTransactionHashTestnet],
        expected: validTransactionDetailTestnet
    }
];

export { providerMethodsTestCases };

import { vechain_sdk_core_ethers } from '@vechain/vechain-sdk-core';
import { zeroBlock } from '../rpc-mapper/methods/eth_getBlockByNumber/fixture';

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
    }
];

export { providerMethodsTestCases };

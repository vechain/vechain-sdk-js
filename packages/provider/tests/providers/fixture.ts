import { vechain_sdk_core_ethers, unitsUtils } from '@vechain/vechain-sdk-core';
import { zeroBlock } from '../rpc-mapper/methods/eth_getBlockByNumber/fixture';
import {
    TESTING_CONTRACT_ADDRESS,
    TESTING_CONTRACT_BYTECODE,
    TEST_ACCOUNTS_THOR_SOLO,
    validTransactionDetailTestnet,
    validTransactionHashTestnet
} from '../fixture';

/**
 * Test cases for provider methods - Testnet
 */
const providerMethodsTestCasesTestnet = [
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

/**
 * Test cases for provider methods - Solo Network
 */
const providerMethodsTestCasesSolo = [
    {
        description:
            'Should be able to call eth_getBalance of an address with balance more than 0 VET',
        method: 'eth_getBalance',
        params: [TEST_ACCOUNTS_THOR_SOLO[0].address, 'latest'],
        expected: vechain_sdk_core_ethers.toQuantity(
            unitsUtils.parseVET('500000000')
        )
    },
    {
        description: 'Should be able to call eth_getCode of a smart contract',
        method: 'eth_getCode',
        params: [TESTING_CONTRACT_ADDRESS, 'latest'],
        expected: TESTING_CONTRACT_BYTECODE
    }
];

/**
 * Test cases for provider methods - Mainnet
 */
const providerMethodsTestCasesMainnet = [
    {
        description:
            'Should be able to call eth_getStorageAt of a smart contract that has a storage slot not empty',
        method: 'eth_getStorageAt',
        params: [
            '0x93Ae8aab337E58A6978E166f8132F59652cA6C56', // Contract with non-null storage slot at position 1
            '0x1',
            '0x10afdf1' // Block n. 17497585
        ],
        expected:
            '0x0000000000000000000000000000000000000000000000000000000061474260'
    }
];

export {
    providerMethodsTestCasesTestnet,
    providerMethodsTestCasesSolo,
    providerMethodsTestCasesMainnet
};

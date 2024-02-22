import { VET_DERIVATION_PATH } from '@vechain/vechain-sdk-core';
import { JSONRPCInternalError } from '@vechain/vechain-sdk-errors';

/**
 * Positive test cases for createWalletFromHardhatNetworkConfig function
 */
const createWalletFromHardhatNetworkConfigPositiveCasesFixture = [
    {
        test: 'Should return an empty wallet',
        networkConfig: {
            url: 'https://testnet.vechain.org',
            chainId: 74
        },
        expectedAddresses: []
    },
    {
        test: 'Should return a wallet from an Array of private keys',
        networkConfig: {
            url: 'https://testnet.vechain.org',
            chainId: 74,
            accounts: [
                '7f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158',
                '7f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa157'
            ]
        },
        expectedAddresses: [
            '0x3db469a79593dcc67f07DE1869d6682fC1eaf535',
            '0x768Ca51b9C9C2b520c845EBea9DDfaA54513b595'
        ]
    },
    {
        test: 'Should return a wallet from an Array of private keys (with 0x prefix)',
        networkConfig: {
            url: 'https://testnet.vechain.org',
            chainId: 74,
            accounts: [
                '0x7f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158',
                '0x7f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa157'
            ]
        },
        expectedAddresses: [
            '0x3db469a79593dcc67f07DE1869d6682fC1eaf535',
            '0x768Ca51b9C9C2b520c845EBea9DDfaA54513b595'
        ]
    },
    {
        test: 'Should return a wallet from an HDNode wallet',
        networkConfig: {
            url: 'https://testnet.vechain.org',
            chainId: 74,
            accounts: {
                mnemonic:
                    'vivid any call mammal mosquito budget midnight expose spirit approve reject system',
                path: VET_DERIVATION_PATH,
                count: 2,
                initialIndex: 0
            }
        },
        expectedAddresses: [
            '0x783DE01F06b4F2a068A7b3Bb6ff3db821A08f8c1',
            '0x2406180BCa83983d40191Febc6d939C62152B71b'
        ]
    }
];

/**
 * Negative test cases for createWalletFromHardhatNetworkConfig function
 */
const createWalletFromHardhatNetworkConfigNegativeCasesFixture = [
    {
        test: 'Should throw an error when the accounts are remote',
        networkConfig: {
            url: 'https://testnet.vechain.org',
            chainId: 74,
            accounts: 'remote'
        },
        expectedError: JSONRPCInternalError
    }
];

export {
    createWalletFromHardhatNetworkConfigPositiveCasesFixture,
    createWalletFromHardhatNetworkConfigNegativeCasesFixture
};

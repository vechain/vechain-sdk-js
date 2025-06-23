import { HDKey } from '@vechain/sdk-core';
import { JSONRPCInternalError } from '@vechain/sdk-errors';

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
        test: 'Should return a wallet from an Array of private keys - no gasPayer',
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
        test: 'Should return a wallet from an Array of private keys - with gasPayer',
        networkConfig: {
            url: 'https://testnet.vechain.org',
            chainId: 74,
            accounts: [
                '7f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158',
                '7f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa157'
            ],
            gasPayer: {
                gasPayerPrivateKey:
                    'ea5383ac1f9e625220039a4afac6a7f868bf1ad4f48ce3a1dd78bd214ee4ace5',
                gasPayerServiceUrl:
                    'https://sponsor-testnet.vechain.energy/by/883'
            }
        },
        expectedAddresses: [
            '0x3db469a79593dcc67f07DE1869d6682fC1eaf535',
            '0x768Ca51b9C9C2b520c845EBea9DDfaA54513b595'
        ]
    },
    {
        test: 'Should return a wallet from an Array of private keys (with 0x prefix) - no gasPayer',
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
        test: 'Should return a wallet from an Array of private keys (with 0x prefix) - with gasPayer',
        networkConfig: {
            url: 'https://testnet.vechain.org',
            chainId: 74,
            accounts: [
                '0x7f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158',
                '0x7f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa157'
            ],
            gasPayer: {
                gasPayerPrivateKey:
                    'ea5383ac1f9e625220039a4afac6a7f868bf1ad4f48ce3a1dd78bd214ee4ace5',
                gasPayerServiceUrl:
                    'https://sponsor-testnet.vechain.energy/by/883'
            }
        },
        expectedAddresses: [
            '0x3db469a79593dcc67f07DE1869d6682fC1eaf535',
            '0x768Ca51b9C9C2b520c845EBea9DDfaA54513b595'
        ]
    },
    {
        test: 'Should return a wallet from an HDNode wallet - no gasPayer',
        networkConfig: {
            url: 'https://testnet.vechain.org',
            chainId: 74,
            accounts: {
                mnemonic:
                    'vivid any call mammal mosquito budget midnight expose spirit approve reject system',
                path: HDKey.VET_DERIVATION_PATH,
                count: 2,
                initialIndex: 0
            }
        },
        expectedAddresses: [
            '0x79193D354fEed00Bcc3Bc09921Bdd3339008f148',
            '0x70E758F9320cC06b5a38f93aF24131A71f9CFd6e'
        ]
    },
    {
        test: 'Should return a wallet from an HDNode wallet - with gasPayer',
        networkConfig: {
            url: 'https://testnet.vechain.org',
            chainId: 74,
            accounts: {
                mnemonic:
                    'vivid any call mammal mosquito budget midnight expose spirit approve reject system',
                path: HDKey.VET_DERIVATION_PATH,
                count: 2,
                initialIndex: 0
            },
            gasPayer: {
                gasPayerPrivateKey:
                    'ea5383ac1f9e625220039a4afac6a7f868bf1ad4f48ce3a1dd78bd214ee4ace5',
                gasPayerServiceUrl:
                    'https://sponsor-testnet.vechain.energy/by/883'
            }
        },
        expectedAddresses: [
            '0x79193D354fEed00Bcc3Bc09921Bdd3339008f148',
            '0x70E758F9320cC06b5a38f93aF24131A71f9CFd6e'
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
    createWalletFromHardhatNetworkConfigNegativeCasesFixture,
    createWalletFromHardhatNetworkConfigPositiveCasesFixture
};

import { type SignTransactionOptions } from '../../../../src';

/**
 * Fixtures for delegation handler
 */
const delegationHandlerFixture = [
    // NOT Empty gasPayer - gasPayerServiceUrl
    {
        testName:
            'Should be able to use DelegationHandler with not empty gasPayer - gasPayerServiceUrl',
        gasPayer: {
            gasPayerServiceUrl: 'http://127.0.0.1:8669'
        } satisfies SignTransactionOptions,
        expected: {
            isDelegated: true,
            gasPayerOrUndefined: {
                gasPayerServiceUrl: 'http://127.0.0.1:8669'
            } satisfies SignTransactionOptions,
            gasPayerOrNull: {
                gasPayerServiceUrl: 'http://127.0.0.1:8669'
            } satisfies SignTransactionOptions
        }
    },
    // NOT Empty gasPayer - gasPayerPrivateKey
    {
        testName:
            'Should be able to use DelegationHandler with not empty gasPayer - gasPayerPrivateKey',
        gasPayer: {
            gasPayerPrivateKey:
                '7f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158'
        } satisfies SignTransactionOptions,
        expected: {
            isDelegated: true,
            gasPayerOrUndefined: {
                gasPayerPrivateKey:
                    '7f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158'
            } satisfies SignTransactionOptions,
            gasPayerOrNull: {
                gasPayerPrivateKey:
                    '7f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158'
            } satisfies SignTransactionOptions
        }
    },
    // NOT Empty gasPayer - gasPayerPrivateKey (with 0x in front of the private key)
    {
        testName:
            'Should be able to use DelegationHandler with not empty gasPayer - gasPayerPrivateKey',
        gasPayer: {
            gasPayerPrivateKey:
                '0x7f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158'
        } satisfies SignTransactionOptions,
        expected: {
            isDelegated: true,
            gasPayerOrUndefined: {
                gasPayerPrivateKey:
                    '0x7f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158'
            } satisfies SignTransactionOptions,
            gasPayerOrNull: {
                gasPayerPrivateKey:
                    '0x7f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158'
            } satisfies SignTransactionOptions
        }
    },
    // Empty gasPayer - undefined
    {
        testName:
            'Should be able to use DelegationHandler with empty gasPayer - undefined',
        expected: {
            isDelegated: false,
            gasPayerOrUndefined: undefined,
            gasPayerOrNull: null
        }
    },
    // Empty gasPayer - null
    {
        testName:
            'Should be able to use DelegationHandler with empty gasPayer - null',
        gasPayer: null,
        expected: {
            isDelegated: false,
            gasPayerOrUndefined: undefined,
            gasPayerOrNull: null
        }
    }
];

export { delegationHandlerFixture };

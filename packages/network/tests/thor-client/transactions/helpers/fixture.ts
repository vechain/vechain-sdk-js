import { type SignTransactionOptions } from '../../../../src';

/**
 * Fixtures for delegation handler
 */
const delegationHandlerFixture = [
    // NOT Empty delegator - delegatorUrl
    {
        testName:
            'Should be able to use DelegationHandler with not empty delegator - delegatorUrl',
        delegator: {
            delegatorUrl: 'http://localhost:8669'
        } satisfies SignTransactionOptions,
        expected: {
            isDelegated: true,
            delegatorOrUndefined: {
                delegatorUrl: 'http://localhost:8669'
            } satisfies SignTransactionOptions,
            delegatorOrNull: {
                delegatorUrl: 'http://localhost:8669'
            } satisfies SignTransactionOptions
        }
    },
    // NOT Empty delegator - delegatorPrivateKey
    {
        testName:
            'Should be able to use DelegationHandler with not empty delegator - delegatorPrivateKey',
        delegator: {
            delegatorPrivateKey:
                '7f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158'
        } satisfies SignTransactionOptions,
        expected: {
            isDelegated: true,
            delegatorOrUndefined: {
                delegatorPrivateKey:
                    '7f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158'
            } satisfies SignTransactionOptions,
            delegatorOrNull: {
                delegatorPrivateKey:
                    '7f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158'
            } satisfies SignTransactionOptions
        }
    },
    // NOT Empty delegator - delegatorPrivateKey (with 0x in front of the private key)
    {
        testName:
            'Should be able to use DelegationHandler with not empty delegator - delegatorPrivateKey',
        delegator: {
            delegatorPrivateKey:
                '0x7f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158'
        } satisfies SignTransactionOptions,
        expected: {
            isDelegated: true,
            delegatorOrUndefined: {
                delegatorPrivateKey:
                    '0x7f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158'
            } satisfies SignTransactionOptions,
            delegatorOrNull: {
                delegatorPrivateKey:
                    '0x7f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158'
            } satisfies SignTransactionOptions
        }
    },
    // Empty delegator - undefined
    {
        testName:
            'Should be able to use DelegationHandler with empty delegator - undefined',
        expected: {
            isDelegated: false,
            delegatorOrUndefined: undefined,
            delegatorOrNull: null
        }
    },
    // Empty delegator - null
    {
        testName:
            'Should be able to use DelegationHandler with empty delegator - null',
        delegator: null,
        expected: {
            isDelegated: false,
            delegatorOrUndefined: undefined,
            delegatorOrNull: null
        }
    }
];

export { delegationHandlerFixture };

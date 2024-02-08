import { InvalidDataTypeError } from '@vechain/vechain-sdk-errors';

/**
 * Debug traceTransactionClause tests fixture testnet
 *
 * @NOTE we refers to block 0x010e80e3278e234b8a5d1195c376909456b94d1f7cf3cb7bfab1e8998dbcfa8f.
 * It has the following transactions:
 * * Index 0 - 0x2dbc8268a2dbf889abe828c0671cb9adce61f537aab8855480aff6967e0ed687 (1 clause, index 0)
 * * Index 1 - 0x05b31824569f2f2ec64c62c4e6396199f56ae872ff219288eb3293b4a36e7b0f (1 clause, index 0)
 */
const traceTransactionClauseTestnet = {
    // Positive test cases
    positiveCases: [
        // Transaction 1 - With transaction ID
        {
            testName:
                'traceTransactionClause - transaction 1 with transaction ID',
            blockID:
                '0x010e80e3278e234b8a5d1195c376909456b94d1f7cf3cb7bfab1e8998dbcfa8f',
            transaction:
                '0x2dbc8268a2dbf889abe828c0671cb9adce61f537aab8855480aff6967e0ed687',
            clauseIndex: 0,
            name: null,
            expected: { gas: 0, failed: false, returnValue: '', structLogs: [] }
        },
        // Transaction 1 - With transaction index into block
        {
            testName:
                'traceTransactionClause - transaction 1 with transaction  index into block',
            blockID:
                '0x010e80e3278e234b8a5d1195c376909456b94d1f7cf3cb7bfab1e8998dbcfa8f',
            transaction: 0,
            clauseIndex: 0,
            name: null,
            expected: { gas: 0, failed: false, returnValue: '', structLogs: [] }
        },
        // Transaction 2 - With transaction ID
        {
            testName:
                'traceTransactionClause - transaction 2 with transaction ID',
            blockID:
                '0x010e80e3278e234b8a5d1195c376909456b94d1f7cf3cb7bfab1e8998dbcfa8f',
            transaction:
                '0x05b31824569f2f2ec64c62c4e6396199f56ae872ff219288eb3293b4a36e7b0f',
            clauseIndex: 0,
            name: 'call',
            expected: {
                from: '0x105199a26b10e55300cb71b46c5b5e867b7df427',
                gas: '0x8b92',
                gasUsed: '0x50fa',
                to: '0xaa854565401724f7061e0c366ca132c87c1e5f60',
                input: '0xf14fcbc800d770b9faa11ba944366f3e7a14c166f780ece542e557e0b7fe4870fcbe8dbe',
                value: '0x0',
                type: 'CALL'
            }
        },
        // Transaction 2 - With transaction index into block
        {
            testName:
                'traceTransactionClause - transaction 2 with transaction index into block',
            blockID:
                '0x010e80e3278e234b8a5d1195c376909456b94d1f7cf3cb7bfab1e8998dbcfa8f',
            transaction: 1,
            clauseIndex: 0,
            name: 'noop',
            expected: {}
        }
    ],
    // Negative test cases
    negativeCases: [
        // Invalid block ID
        {
            testName: 'traceTransactionClause - transaction 1 invalid block ID',
            blockID: 'INVALID',
            transaction:
                '0x2dbc8268a2dbf889abe828c0671cb9adce61f537aab8855480aff6967e0ed687',
            clauseIndex: 0,
            name: null,
            expectedError: InvalidDataTypeError
        },
        // Invalid transaction ID
        {
            testName:
                'traceTransactionClause - transaction 1 invalid transaction ID',
            blockID:
                '0x010e80e3278e234b8a5d1195c376909456b94d1f7cf3cb7bfab1e8998dbcfa8f',
            transaction: 'INVALID',
            clauseIndex: 0,
            name: null,
            expectedError: InvalidDataTypeError
        },
        // Invalid transaction index
        {
            testName:
                'traceTransactionClause - transaction 1 invalid transaction index',
            blockID:
                '0x010e80e3278e234b8a5d1195c376909456b94d1f7cf3cb7bfab1e8998dbcfa8f',
            transaction: -1,
            clauseIndex: 0,
            name: null,
            expectedError: InvalidDataTypeError
        },
        // Invalid clause index
        {
            testName:
                'traceTransactionClause - transaction 1 invalid clause index',
            blockID:
                '0x010e80e3278e234b8a5d1195c376909456b94d1f7cf3cb7bfab1e8998dbcfa8f',
            transaction: 0,
            clauseIndex: -1,
            name: null,
            expectedError: InvalidDataTypeError
        }
    ]
};

/**
 * First transaction for traceTransactionClause testnet fixture
 *
 * @NOTE we refers, again, to block 0x010e80e3278e234b8a5d1195c376909456b94d1f7cf3cb7bfab1e8998dbcfa8f.
 */
const firstTransactionTraceTransactionClauseTestnetFixture =
    traceTransactionClauseTestnet.positiveCases[0];

/**
 * VTHO contract testnet - 0x0000000000000000000000000000456E65726779
 */
const traceContractCallTestnet = {
    // Positive test cases
    positiveCases: [
        // Transfer token - Transaction 0x7bf1cbf0485e265075a771ac4b0875b09019163f93d8e281adb893875c36453f
        {
            testName: 'traceContractCall - transfer token',
            to: '0x0000000000000000000000000000456E65726779',
            value: '0x0',
            data: '0xa9059cbb0000000000000000000000000000000000000000000000000000456e65726779000000000000000000000000000000000000000000000004563918244f400000',
            caller: '0x625fCe8dd8E2C05e82e77847F3da06AF6e55A7AF',
            gasPayer: '0x625fCe8dd8E2C05e82e77847F3da06AF6e55A7AF',
            expiration: 18,
            blockRef: '0x0101d05409d55cce',
            name: 'call',
            expected: {
                from: '0x625fce8dd8e2c05e82e77847f3da06af6e55a7af',
                gas: '0x0',
                gasUsed: '0x0',
                to: '0x0000000000000000000000000000456e65726779',
                input: '0xa9059cbb0000000000000000000000000000000000000000000000000000456e65726779000000000000000000000000000000000000000000000004563918244f400000',
                output: '0x0000000000000000000000000000000000000000000000000000000000000001',
                calls: [
                    {
                        from: '0x0000000000000000000000000000456e65726779',
                        gas: '0x2eefd15',
                        gasUsed: '0xefe',
                        to: '0x0000000000000000000000000000456e65726779',
                        input: '0x39ed08d5000000000000000000000000625fce8dd8e2c05e82e77847f3da06af6e55a7af000000000000000000000000000000000000000000000004563918244f400000',
                        output: '0x0000000000000000000000000000000000000000000000000000000000000001',
                        value: '0x0',
                        type: 'CALL'
                    },
                    {
                        from: '0x0000000000000000000000000000456e65726779',
                        gas: '0x2eee7d0',
                        gasUsed: '0xefe',
                        to: '0x0000000000000000000000000000456e65726779',
                        input: '0x1cedfac10000000000000000000000000000000000000000000000000000456e65726779000000000000000000000000000000000000000000000004563918244f400000',
                        value: '0x0',
                        type: 'CALL'
                    }
                ],
                value: '0x0',
                type: 'CALL'
            }
        },
        // Contract deployment transaction
        {
            testName: 'traceContractCall - contract deployment',
            to: null,
            data: '0x6080604052600436106100af576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806306fdde03146100b4578063095ea7b31461014457806318160ddd146101a957806323b872dd146101d4578063313ce5671461025957806370a082311461028a57806395d89b41146102e1578063a9059cbb14610371578063bb35783b146103d6578063d89135cd1461045b578063dd62ed3e14610486575b600080fd5b3480156100c057600080fd5b506100c96104fd565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156101095780820151818401526020810190506100ee565b50505050905090810190601f1680156101365780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561015057600080fd5b5061018f600480360381019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291908035906020019092919050505061053a565b604051808215151515815260200191505060405180910390f35b3480156101b557600080fd5b506101be61062b565b6040518082815260200191505060405180910390f35b3480156101e057600080fd5b5061023f600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803590602001909291905050506106d1565b604051808215151515815260200191505060405180910390f35b34801561026557600080fd5b5061026e610865565b604051808260ff1660ff16815260200191505060405180910390f35b34801561029657600080fd5b506102cb600480360381019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919050505061086e565b6040518082815260200191505060405180910390f35b3480156102ed57600080fd5b506102f661094d565b6040518080602001828103825283818151815260200191508051906020019080838360005b8381101561033657808201518184015260208101905061031b565b50505050905090810190601f1680156103635780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561037d57600080fd5b506103bc600480360381019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291908035906020019092919050505061098a565b604051808215151515815260200191505060405180910390f35b3480156103e257600080fd5b50610441600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803590602001909291905050506109a1565b604051808215151515815260200191505060405180910390f35b34801561046757600080fd5b50610470610b67565b6040518082815260200191505060405180910390f35b34801561049257600080fd5b506104e7600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610c0d565b6040518082815260200191505060405180910390f35b60606040805190810160405280600681526020017f566554686f720000000000000000000000000000000000000000000000000000815250905090565b6000816000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925846040518082815260200191505060405180910390a36001905092915050565b60003073ffffffffffffffffffffffffffffffffffffffff1663592b389c6040518163ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401602060405180830381600087803b15801561069157600080fd5b505af11580156106a5573d6000803e3d6000fd5b505050506040513d60208110156106bb57600080fd5b8101908080519060200190929190505050905090565b6000816000808673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054101515156107c6576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601f8152602001807f6275696c74696e3a20696e73756666696369656e7420616c6c6f77616e63650081525060200191505060405180910390fd5b816000808673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254039250508190555061085a848484610c93565b600190509392505050565b60006012905090565b60003073ffffffffffffffffffffffffffffffffffffffff1663ee660480836040518263ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001915050602060405180830381600087803b15801561090b57600080fd5b505af115801561091f573d6000803e3d6000fd5b505050506040513d602081101561093557600080fd5b81019080805190602001909291905050509050919050565b60606040805190810160405280600481526020017f5654484f00000000000000000000000000000000000000000000000000000000815250905090565b6000610997338484610c93565b6001905092915050565b60003373ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff161480610add57503373ffffffffffffffffffffffffffffffffffffffff163073ffffffffffffffffffffffffffffffffffffffff1663059950e9866040518263ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001915050602060405180830381600087803b158015610a8a57600080fd5b505af1158015610a9e573d6000803e3d6000fd5b505050506040513d6020811015610ab457600080fd5b810190808051906020019092919050505073ffffffffffffffffffffffffffffffffffffffff16145b1515610b51576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260208152602001807f6275696c74696e3a2073656c66206f72206d617374657220726571756972656481525060200191505060405180910390fd5b610b5c848484610c93565b600190509392505050565b60003073ffffffffffffffffffffffffffffffffffffffff1663138d4d0c6040518163ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401602060405180830381600087803b158015610bcd57600080fd5b505af1158015610be1573d6000803e3d6000fd5b505050506040513d6020811015610bf757600080fd5b8101908080519060200190929190505050905090565b60008060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905092915050565b6000811115610eaa573073ffffffffffffffffffffffffffffffffffffffff166339ed08d584836040518363ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200182815260200192505050602060405180830381600087803b158015610d3f57600080fd5b505af1158015610d53573d6000803e3d6000fd5b505050506040513d6020811015610d6957600080fd5b81019080805190602001909291905050501515610dee576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601d8152602001807f6275696c74696e3a20696e73756666696369656e742062616c616e636500000081525060200191505060405180910390fd5b3073ffffffffffffffffffffffffffffffffffffffff16631cedfac183836040518363ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200182815260200192505050600060405180830381600087803b158015610e9157600080fd5b505af1158015610ea5573d6000803e3d6000fd5b505050505b8173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef836040518082815260200191505060405180910390a35050505600a165627a7a72305820bd55cb9aff347dc60fe8280ae6b08a6f6deacc85a4e1c89ba0a8ef31fbcaecc60029',
            caller: '0x0000000000000000000000000000000000000000',
            gasPayer: '0x0000000000000000000000000000000000000000',
            gas: 0,
            name: 'call',
            expected: {
                from: '0x0000000000000000000000000000000000000000',
                gas: '0x0',
                gasUsed: '0x0',
                input: '0x6080604052600436106100af576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806306fdde03146100b4578063095ea7b31461014457806318160ddd146101a957806323b872dd146101d4578063313ce5671461025957806370a082311461028a57806395d89b41146102e1578063a9059cbb14610371578063bb35783b146103d6578063d89135cd1461045b578063dd62ed3e14610486575b600080fd5b3480156100c057600080fd5b506100c96104fd565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156101095780820151818401526020810190506100ee565b50505050905090810190601f1680156101365780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561015057600080fd5b5061018f600480360381019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291908035906020019092919050505061053a565b604051808215151515815260200191505060405180910390f35b3480156101b557600080fd5b506101be61062b565b6040518082815260200191505060405180910390f35b3480156101e057600080fd5b5061023f600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803590602001909291905050506106d1565b604051808215151515815260200191505060405180910390f35b34801561026557600080fd5b5061026e610865565b604051808260ff1660ff16815260200191505060405180910390f35b34801561029657600080fd5b506102cb600480360381019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919050505061086e565b6040518082815260200191505060405180910390f35b3480156102ed57600080fd5b506102f661094d565b6040518080602001828103825283818151815260200191508051906020019080838360005b8381101561033657808201518184015260208101905061031b565b50505050905090810190601f1680156103635780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561037d57600080fd5b506103bc600480360381019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291908035906020019092919050505061098a565b604051808215151515815260200191505060405180910390f35b3480156103e257600080fd5b50610441600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803590602001909291905050506109a1565b604051808215151515815260200191505060405180910390f35b34801561046757600080fd5b50610470610b67565b6040518082815260200191505060405180910390f35b34801561049257600080fd5b506104e7600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610c0d565b6040518082815260200191505060405180910390f35b60606040805190810160405280600681526020017f566554686f720000000000000000000000000000000000000000000000000000815250905090565b6000816000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925846040518082815260200191505060405180910390a36001905092915050565b60003073ffffffffffffffffffffffffffffffffffffffff1663592b389c6040518163ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401602060405180830381600087803b15801561069157600080fd5b505af11580156106a5573d6000803e3d6000fd5b505050506040513d60208110156106bb57600080fd5b8101908080519060200190929190505050905090565b6000816000808673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054101515156107c6576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601f8152602001807f6275696c74696e3a20696e73756666696369656e7420616c6c6f77616e63650081525060200191505060405180910390fd5b816000808673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254039250508190555061085a848484610c93565b600190509392505050565b60006012905090565b60003073ffffffffffffffffffffffffffffffffffffffff1663ee660480836040518263ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001915050602060405180830381600087803b15801561090b57600080fd5b505af115801561091f573d6000803e3d6000fd5b505050506040513d602081101561093557600080fd5b81019080805190602001909291905050509050919050565b60606040805190810160405280600481526020017f5654484f00000000000000000000000000000000000000000000000000000000815250905090565b6000610997338484610c93565b6001905092915050565b60003373ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff161480610add57503373ffffffffffffffffffffffffffffffffffffffff163073ffffffffffffffffffffffffffffffffffffffff1663059950e9866040518263ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001915050602060405180830381600087803b158015610a8a57600080fd5b505af1158015610a9e573d6000803e3d6000fd5b505050506040513d6020811015610ab457600080fd5b810190808051906020019092919050505073ffffffffffffffffffffffffffffffffffffffff16145b1515610b51576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260208152602001807f6275696c74696e3a2073656c66206f72206d617374657220726571756972656481525060200191505060405180910390fd5b610b5c848484610c93565b600190509392505050565b60003073ffffffffffffffffffffffffffffffffffffffff1663138d4d0c6040518163ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401602060405180830381600087803b158015610bcd57600080fd5b505af1158015610be1573d6000803e3d6000fd5b505050506040513d6020811015610bf757600080fd5b8101908080519060200190929190505050905090565b60008060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905092915050565b6000811115610eaa573073ffffffffffffffffffffffffffffffffffffffff166339ed08d584836040518363ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200182815260200192505050602060405180830381600087803b158015610d3f57600080fd5b505af1158015610d53573d6000803e3d6000fd5b505050506040513d6020811015610d6957600080fd5b81019080805190602001909291905050501515610dee576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601d8152602001807f6275696c74696e3a20696e73756666696369656e742062616c616e636500000081525060200191505060405180910390fd5b3073ffffffffffffffffffffffffffffffffffffffff16631cedfac183836040518363ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200182815260200192505050600060405180830381600087803b158015610e9157600080fd5b505af1158015610ea5573d6000803e3d6000fd5b505050505b8173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef836040518082815260200191505060405180910390a35050505600a165627a7a72305820bd55cb9aff347dc60fe8280ae6b08a6f6deacc85a4e1c89ba0a8ef31fbcaecc60029',
                error: 'execution reverted',
                value: '0x0',
                type: 'CREATE'
            }
        }
    ],
    // Negative test cases
    negativeCases: [
        // Invalid to
        {
            testName: 'traceContractCall - invalid to',
            to: 'INVALID',
            value: '0x0',
            data: '0x0',
            caller: '0x',
            expectedError: InvalidDataTypeError
        },
        // Invalid value
        {
            testName: 'traceContractCall - invalid value',
            to: null,
            value: 'INVALID',
            data: '0x0',
            caller: '0x',
            expectedError: InvalidDataTypeError
        },
        // Invalid data
        {
            testName: 'traceContractCall - invalid data',
            to: null,
            value: '0x0',
            data: 'INVALID',
            caller: '0x',
            expectedError: InvalidDataTypeError
        }
    ]
};

/**
 * First transaction for traceContractCall testnet fixture
 *
 * @NOTE we refers, again, to block VTHO contract testnet - 0x0000000000000000000000000000456E65726779
 */
const firstTransactionTraceContractCallTestnetFixture =
    traceContractCallTestnet.positiveCases[0];

export {
    traceTransactionClauseTestnet,
    firstTransactionTraceTransactionClauseTestnetFixture,
    traceContractCallTestnet,
    firstTransactionTraceContractCallTestnetFixture
};

import { networkInfo, contract } from '@vechainfoundation/vechain-sdk-core';
import { expect } from 'expect';

// 1 - Init a simple contract ABI
const contractABI = JSON.stringify([
    {
        constant: false,
        inputs: [
            {
                name: 'value',
                type: 'uint256'
            }
        ],
        name: 'setValue',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        constant: true,
        inputs: [],
        name: 'getValue',
        outputs: [
            {
                name: '',
                type: 'uint256'
            }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    }
]);

// 2 - Create a transaction to call setValue(123)
const transaction = contract.txBuilder.buildCallTransaction(
    '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed', // just a sample deployed contract address
    contractABI,
    'setValue',
    [123]
);

// 3 - Check the parameters of the transaction

expect(transaction.body.clauses[0].to).toBe(
    '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed'
);

// Some checks on the transaction body
expect(transaction.body.clauses[0].value).toBe(0);
expect(transaction.body.clauses[0].data).toBeDefined();
expect(transaction.body.nonce).toBeDefined();
expect(transaction.body.chainTag).toBe(networkInfo.mainnet.chainTag);
expect(transaction.body.blockRef).toBeDefined();
expect(transaction.body.expiration).toBeDefined();
expect(transaction.body.gasPriceCoef).toBeDefined();
expect(transaction.body.gas).toBeDefined();
expect(transaction.body.dependsOn).toBeNull();
expect(transaction.body.gas).toBeGreaterThan(0);
expect(transaction.body.gasPriceCoef).toBeDefined();

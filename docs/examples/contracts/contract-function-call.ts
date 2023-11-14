import { networkInfo, buildCallContractTransaction } from '@vechainfoundation/core';
import { expect } from 'expect';

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

const transaction = buildCallContractTransaction(
    '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed', // just a sample deployed contract address
    contractABI,
    'setValue',
    [123]
);

// check the parameters of the transaction
expect(transaction.body.clauses[0].to).toBe(
    '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed'
);
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

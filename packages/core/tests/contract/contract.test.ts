import { describe, test, expect } from '@jest/globals';
import { compileContract } from '../../src/contract/compiler';
import {
    type TransactionBodyOverride,
    buildCallContractTransaction,
    buildDeployContractTransaction
} from '../../src/contract/contract';
import { contract, networkInfo } from '../../src/core';

/**
 * Unit tests for Contract-related functionality.
 * @group unit/contract
 */
describe('Contract', () => {
    test('Build a transaction to deploy a contract', () => {
        const compiledContract = compileContract(
            'tests/contract/sample',
            'Example.sol',
            'Example'
        );
        const transaction = buildDeployContractTransaction(
            compiledContract.bytecode
        );
        expect(transaction.body.clauses[0].data).toEqual(
            compiledContract.bytecode
        );
    });
    test('Build a transaction to deploy a contract with a custom transaction body', () => {
        const compiledContract = compileContract(
            'tests/contract/sample',
            'Example.sol',
            'Example'
        );

        const transactionBody: TransactionBodyOverride = {
            nonce: 1,
            chainTag: networkInfo.mainnet.chainTag,
            blockRef: '0x00ffecb8ac3142c4',
            expiration: 32,
            gasPriceCoef: 0,
            dependsOn: null
        };

        const transaction = buildDeployContractTransaction(
            compiledContract.bytecode,
            transactionBody
        );
        expect(transaction.body.clauses[0].data).toEqual(
            compiledContract.bytecode
        );
        expect(transaction.body.blockRef).toEqual('0x00ffecb8ac3142c4');
        expect(transaction.body.expiration).toEqual(32);
        expect(transaction.body.nonce).toEqual(1);
        expect(transaction.body.gasPriceCoef).toEqual(0);
        expect(transaction.body.dependsOn).toEqual(null);
    });
    test('Build a call contract transaction', () => {
        const contractCompiled = compileContract(
            'tests/contract/sample',
            'Example.sol',
            'Example'
        );

        const callFunctionTransaction = buildCallContractTransaction(
            '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
            contractCompiled.abi,
            'set',
            [1]
        );
        expect(callFunctionTransaction.body.clauses[0].data).toBeDefined();
    });
    test('Compile a sample contract and create an interface from the abi', () => {
        const contractCompiled = compileContract(
            'tests/contract/sample',
            'Example.sol',
            'Example'
        );

        expect(contractCompiled).toBeDefined();

        // Create an instance of a Contract interface using the ABI
        const contractInterface = contract.createInterface(
            contractCompiled.abi
        );

        expect(contractInterface).toBeDefined();
    });
});

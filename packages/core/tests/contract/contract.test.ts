import { describe, test, expect } from '@jest/globals';
import { compileContract } from './compiler';
import {
    type TransactionBodyOverride,
    buildCallContractTransaction,
    buildDeployContractTransaction
} from '../../src/contract/contract';
import { contract, networkInfo } from '../../src/core';

/**
 * Unit tests for building contract transactions.
 * @group unit/contract
 */
describe('Contract', () => {
    /**
     * Test to ensure building a transaction to deploy a contract.
     */
    test('Build a transaction to deploy a contract', () => {
        // Compile the contract from a sample file
        const compiledContract = compileContract(
            'tests/contract/sample',
            'Example.sol',
            'Example'
        );

        // Build a transaction to deploy the compiled contract
        const transaction = buildDeployContractTransaction(
            compiledContract.bytecode
        );

        // Ensure the transaction body contains the compiled bytecode
        expect(transaction.body.clauses[0].data).toEqual(
            compiledContract.bytecode
        );
    });

    /**
     * Test to ensure building a transaction to deploy a contract with a custom transaction body.
     */
    test('Build a transaction to deploy a contract with a custom transaction body', () => {
        // Compile the contract from a sample file
        const compiledContract = compileContract(
            'tests/contract/sample',
            'Example.sol',
            'Example'
        );

        // Create a custom transaction body
        const transactionBody: TransactionBodyOverride = {
            nonce: 1,
            chainTag: networkInfo.mainnet.chainTag,
            blockRef: '0x00ffecb8ac3142c4',
            expiration: 32,
            gasPriceCoef: 0,
            dependsOn: null
        };

        // Build a transaction to deploy the compiled contract with the custom transaction body
        const transaction = buildDeployContractTransaction(
            compiledContract.bytecode,
            transactionBody
        );

        // Ensure the transaction body and properties match the custom values
        expect(transaction.body.clauses[0].data).toEqual(
            compiledContract.bytecode
        );
        expect(transaction.body.blockRef).toEqual('0x00ffecb8ac3142c4');
        expect(transaction.body.expiration).toEqual(32);
        expect(transaction.body.nonce).toEqual(1);
        expect(transaction.body.gasPriceCoef).toEqual(0);
        expect(transaction.body.dependsOn).toEqual(null);
    });

    /**
     * Test to ensure building a call contract transaction.
     */
    test('Build a call contract transaction', () => {
        // Compile the contract from a sample file
        const contractCompiled = compileContract(
            'tests/contract/sample',
            'Example.sol',
            'Example'
        );

        // Build a transaction to call a function on the contract
        const callFunctionTransaction = buildCallContractTransaction(
            '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
            contractCompiled.abi,
            'set',
            [1]
        );

        // Ensure the transaction body contains data for the function call
        expect(callFunctionTransaction.body.clauses[0].data).toBeDefined();
    });

    /**
     * Test to ensure compiling a sample contract and creating an interface from the ABI.
     */
    test('Compile a sample contract and create an interface from the abi', () => {
        // Compile the contract from a sample file
        const contractCompiled = compileContract(
            'tests/contract/sample',
            'Example.sol',
            'Example'
        );

        // Ensure the contract compilation is successful
        expect(contractCompiled).toBeDefined();

        // Create an instance of a Contract interface using the ABI
        const contractInterface = contract.createInterface(
            contractCompiled.abi
        );

        // Ensure the contract interface is created successfully
        expect(contractInterface).toBeDefined();
    });
});

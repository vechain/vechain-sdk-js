import { describe, test, expect } from '@jest/globals';
import { compileContract } from './compiler';
import {
    type TransactionBodyOverride,
    buildCallContractTransaction,
    buildDeployContractTransaction
} from '../../src';
import { contract, networkInfo } from '../../src';

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

        expect(transaction.body.clauses[0].data).toEqual(
            compiledContract.bytecode
        );
        expect(transaction.body.clauses[0].value).toBe(0);
        expect(transaction.body.clauses[0].to).toBe(
            networkInfo.mainnet.zeroAddress
        );
        expect(transaction.body.nonce).toBeDefined();
        expect(transaction.body.chainTag).toBe(networkInfo.mainnet.chainTag);
        expect(transaction.body.blockRef).toBeDefined();
        expect(transaction.body.expiration).toBeDefined();
        expect(transaction.body.gasPriceCoef).toBeDefined();
        expect(transaction.body.gas).toBeDefined();
        expect(transaction.body.dependsOn).toBeNull();
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
        expect(transaction.body.gas).toBeGreaterThan(0);
        expect(transaction.body.gasPriceCoef).toEqual(0);
        expect(transaction.body.dependsOn).toEqual(null);
    });

    /**
     * Test to ensure the creation of a transaction to deploy a contract with a custom transaction body where only some parameters are overridden.
     */
    test('Build a transaction to deploy a contract with a custom transaction body where only some params are overridden', () => {
        // Compile the contract from a sample file
        const compiledContract = compileContract(
            'tests/contract/sample',
            'Example.sol',
            'Example'
        );

        // Create a custom transaction body overriding only some parameters
        const transactionBody: TransactionBodyOverride = {
            nonce: 4,
            chainTag: networkInfo.solo.chainTag,
            gasPriceCoef: 0
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
        expect(transaction.body.nonce).toEqual(4);
        expect(transaction.body.gas).toBeGreaterThan(0);
        expect(transaction.body.gasPriceCoef).toEqual(0);
        expect(transaction.body.dependsOn).toEqual(null);
        expect(transaction.body.chainTag).toEqual(networkInfo.solo.chainTag);
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
        expect(callFunctionTransaction.body.clauses[0].to).toBe(
            '0x742d35Cc6634C0532925a3b844Bc454e4438f44e'
        );
        expect(callFunctionTransaction.body.clauses[0].value).toBe(0);
        expect(callFunctionTransaction.body.clauses[0].data).toBeDefined();
        expect(callFunctionTransaction.body.nonce).toBeDefined();
        expect(callFunctionTransaction.body.chainTag).toBe(
            networkInfo.mainnet.chainTag
        );
        expect(callFunctionTransaction.body.blockRef).toBeDefined();
        expect(callFunctionTransaction.body.expiration).toBeDefined();
        expect(callFunctionTransaction.body.gasPriceCoef).toBeDefined();
        expect(callFunctionTransaction.body.gas).toBeGreaterThan(0);
        expect(callFunctionTransaction.body.dependsOn).toBeNull();
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

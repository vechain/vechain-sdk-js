import { describe, test, expect } from '@jest/globals';
import { compileContract } from '../../src/contract/compiler';
import {
    buildCallContractTransaction,
    buildDeployContractTransaction
} from '../../src/contract/contract';
import { contract } from '../../src/core';

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
            compiledContract.bytecode,
            false
        );
        expect(transaction.body.clauses[0].data).toEqual(
            compiledContract.bytecode
        );
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

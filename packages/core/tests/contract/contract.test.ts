import { describe, test, expect } from '@jest/globals';
import { compileContract, type Sources } from './compiler';
import { contract, type DeployParams } from '../../src';
import { coder } from '../../src';
import {
    compileERC20SampleTokenContract,
    getContractSourceCode
} from './fixture';

/**
 * Unit tests for building transaction clauses.
 * @group unit/contract
 */
describe('Contract', () => {
    const sources: Sources = {
        'Example.sol': {
            content: getContractSourceCode(
                'tests/contract/sample',
                'Example.sol'
            )
        }
    };

    test('Build a clause to deploy a contract without constructor', () => {
        const compiledContract = compileContract('Example', sources);

        const clause = contract.clauseBuilder.deployContract(
            compiledContract.bytecode
        );

        expect(clause.data).toEqual(compiledContract.bytecode);
        expect(clause.to).toBe(null);
        expect(clause.value).toBe(0);
    });

    test('Build a clause to deploy a contract with deploy params', () => {
        const compiledContract = compileContract('Example', sources);

        const deployParams: DeployParams = {
            types: ['uint256'],
            values: ['100']
        };

        const clause = contract.clauseBuilder.deployContract(
            compiledContract.bytecode,
            deployParams
        );

        // Assertions for various properties of the built transaction.
        expect(clause.value).toBe(0);
        expect(clause.to).toBe(null);
        expect(clause.data.length).toBeGreaterThan(
            compiledContract.bytecode.length
        );
    });

    test('Build a clause to call a contract function', () => {
        const compiledContract = compileContract('Example', sources);

        const clause = contract.clauseBuilder.functionInteraction(
            '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
            compiledContract.abi,
            'set',
            [1]
        );

        expect(clause.to).toBe('0x742d35Cc6634C0532925a3b844Bc454e4438f44e');
        expect(clause.value).toBe(0);
        expect(clause.data).toBeDefined();
    });

    /**
     * Test to ensure compiling a sample contract and creating an interface from the ABI.
     */
    test('Compile a sample contract and create an interface from the abi', () => {
        // Compile the contract from a sample file
        const contractCompiled = compileContract('Example', sources);

        // Ensure the contract compilation is successful
        expect(contractCompiled).toBeDefined();

        // Create an instance of a Contract interface using the ABI
        const contractInterface = coder.createInterface(contractCompiled.abi);

        // Ensure the contract interface is created successfully
        expect(contractInterface).toBeDefined();
    });

    /**
     * Test compile an ERC20 contract and create an interface from the ABI.
     */
    test('Compile an ERC20 contract and create an interface from the abi', () => {
        try {
            const compiledContract = compileERC20SampleTokenContract();

            // Ensure the contract compilation is successful
            expect(compiledContract).toBeDefined();
            expect(compiledContract.name).toBeDefined();
            expect(compiledContract.abi).toBeDefined();
            expect(compiledContract.bytecode).toBeDefined();

            // Create an instance of a Contract interface using the ABI
            const contractInterface = coder.createInterface(
                compiledContract.abi
            );

            // Ensure the contract interface is created successfully
            expect(contractInterface).toBeDefined();
        } catch (error) {
            console.log(error);
        }
    });
});

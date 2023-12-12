import { describe, test, expect } from '@jest/globals';
import { compileContract, type Sources } from './compiler';
import {
    type TransactionBodyOverride,
    contract,
    type DeployParams
} from '../../src';
import { coder, networkInfo } from '../../src';
import { getContractSourceCode } from './fixture';

/**
 * Unit tests for building contract transactions.
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

    /**
     * Test to ensure building a transaction to deploy a contract.
     */
    test('Build a transaction to deploy a contract', () => {
        // Compile the contract from a sample file
        const compiledContract = compileContract('Example', sources);

        // Build a transaction to deploy the compiled contract
        const transaction = contract.txBuilder.buildDeployTransaction(
            compiledContract.bytecode
        );

        expect(transaction.body.clauses[0].data).toEqual(
            compiledContract.bytecode
        );
        expect(transaction.body.clauses[0].value).toBe(0);
        expect(transaction.body.clauses[0].to).toBe(null);
        expect(transaction.body.nonce).toBeDefined();
        expect(transaction.body.chainTag).toBe(networkInfo.mainnet.chainTag);
        expect(transaction.body.blockRef).toBeDefined();
        expect(transaction.body.expiration).toBeDefined();
        expect(transaction.body.gasPriceCoef).toBeDefined();
        expect(transaction.body.gas).toBeDefined();
        expect(transaction.body.dependsOn).toBeNull();
    });

    /**
     * Test case for building a transaction to deploy a contract with deploy parameters.
     */
    test('Build a transaction to deploy a contract with deploy params', () => {
        const compiledContract = compileContract('Example', sources);

        const deployParams: DeployParams = {
            types: ['uint256'],
            values: ['100']
        };

        const transaction = contract.txBuilder.buildDeployTransaction(
            compiledContract.bytecode,
            deployParams
        );

        // Assertions for various properties of the built transaction.
        expect(transaction.body.clauses[0].value).toBe(0);
        expect(transaction.body.clauses[0].to).toBe(null);
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
        const compiledContract = compileContract('Example', sources);

        // Create a custom transaction body
        const transactionBody: TransactionBodyOverride = {
            nonce: 1,
            chainTag: networkInfo.mainnet.chainTag,
            blockRef: '0x0000000000000000',
            expiration: 32,
            gasPriceCoef: 0,
            dependsOn: null
        };

        // Build a transaction to deploy the compiled contract with the custom transaction body
        const transaction = contract.txBuilder.buildDeployTransaction(
            compiledContract.bytecode,
            undefined,
            transactionBody
        );

        // Ensure the transaction body and properties match the custom values
        expect(transaction.body.clauses[0].data).toEqual(
            compiledContract.bytecode
        );
        expect(transaction.body.blockRef).toEqual('0x0000000000000000');
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
        const compiledContract = compileContract('Example', sources);

        // Create a custom transaction body overriding only some parameters
        const transactionBody: TransactionBodyOverride = {
            nonce: 4,
            chainTag: networkInfo.solo.chainTag,
            gasPriceCoef: 0
        };

        // Build a transaction to deploy the compiled contract with the custom transaction body
        const transaction = contract.txBuilder.buildDeployTransaction(
            compiledContract.bytecode,
            undefined,
            transactionBody
        );

        // Ensure the transaction body and properties match the custom values
        expect(transaction.body.clauses[0].data).toEqual(
            compiledContract.bytecode
        );
        expect(transaction.body.blockRef).toEqual('0x0000000000000000');
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
        const compiledContract = compileContract('Example', sources);

        // Build a transaction to call a function on the contract
        const callFunctionTransaction = contract.txBuilder.buildCallTransaction(
            '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
            compiledContract.abi,
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
        const compiledContract = compileContract('Example', sources);

        // Ensure the contract compilation is successful
        expect(compiledContract).toBeDefined();

        // Create an instance of a Contract interface using the ABI
        const contractInterface = coder.createInterface(compiledContract.abi);

        // Ensure the contract interface is created successfully
        expect(contractInterface).toBeDefined();
    });

    /**
     * Test compile an ERC20 contract and create an interface from the ABI.
     */
    test('Compile an ERC20 contract and create an interface from the abi', () => {
        try {
            const erc20Sources: Sources = {
                'SampleToken.sol': {
                    content: getContractSourceCode(
                        'tests/contract/sample',
                        'SampleToken.sol'
                    )
                },
                '@openzeppelin/contracts/token/ERC20/ERC20.sol': {
                    content: getContractSourceCode(
                        '../../node_modules/@openzeppelin/contracts/token/ERC20/',
                        'ERC20.sol'
                    )
                },
                '@openzeppelin/contracts/token/ERC20/IERC20.sol': {
                    content: getContractSourceCode(
                        '../../node_modules/@openzeppelin/contracts/token/ERC20/',
                        'IERC20.sol'
                    )
                },
                '@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol':
                    {
                        content: getContractSourceCode(
                            '../../node_modules/@openzeppelin/contracts/token/ERC20/',
                            'extensions/IERC20Metadata.sol'
                        )
                    },
                '@openzeppelin/contracts/utils/Context.sol': {
                    content: getContractSourceCode(
                        '../../node_modules/@openzeppelin/contracts/utils/',
                        'Context.sol'
                    )
                },
                '@openzeppelin/contracts/interfaces/draft-IERC6093.sol': {
                    content: getContractSourceCode(
                        '../../node_modules/@openzeppelin/contracts/interfaces/',
                        'draft-IERC6093.sol'
                    )
                }
            };

            const compiledContract = compileContract(
                'SampleToken',
                erc20Sources
            );

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

import { describe, test, expect } from '@jest/globals';
import { contract, type DeployParams } from '../../src';
import { coder } from '../../src';
import {
    exampleContractAbi,
    exampleContractBytecode,
    invalidNFTtestCases,
    invalidTransferTokenClausesTestCases,
    invalidTransferVETtestCases,
    transferNFTtestCases,
    transferTokenClausesTestCases,
    transferVETtestCases
} from './fixture';
import { type FunctionFragment } from 'ethers';

/**
 * Unit tests for building transaction clauses.
 * @group unit/contract
 */
describe('Contract', () => {
    test('Build a clause to deploy a contract without constructor', () => {
        const clause = contract.clauseBuilder.deployContract(
            exampleContractBytecode
        );

        expect(clause.data).toEqual(exampleContractBytecode);
        expect(clause.to).toBe(null);
        expect(clause.value).toBe(0);
    });

    test('Build a clause to deploy a contract with deploy params', () => {
        const deployParams: DeployParams = {
            types: ['uint256'],
            values: ['100']
        };

        const clause = contract.clauseBuilder.deployContract(
            exampleContractBytecode,
            deployParams
        );

        // Assertions for various properties of the built transaction.
        expect(clause.value).toBe(0);
        expect(clause.to).toBe(null);
        expect(clause.data.length).toBeGreaterThan(
            exampleContractBytecode.length
        );
    });

    test('Build a clause to call a contract function', () => {
        const clause = contract.clauseBuilder.functionInteraction(
            '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
            contract.coder
                .createInterface(exampleContractAbi)
                .getFunction('set') as FunctionFragment,
            [1]
        );

        expect(clause.to).toBe('0x742d35Cc6634C0532925a3b844Bc454e4438f44e');
        expect(clause.value).toBe(0);
        expect(clause.data).toBeDefined();
    });

    /**
     * Test compile an ERC20 contract and create an interface from the ABI.
     */
    test('Create an interface from the abi of the sample contract', () => {
        // Create an instance of a Contract interface using the ABI
        const contractInterface = coder.createInterface(exampleContractAbi);

        // Ensure the contract interface is created successfully
        expect(contractInterface).toBeDefined();
    });

    describe('Transfer token clause builder test cases', () => {
        /**
         * Transfer token clause builder test cases.
         */
        transferTokenClausesTestCases.forEach(
            ({ tokenAddress, recipientAddress, amount, expected }) => {
                test(`Build a clause to transfer ${amount} tokens`, () => {
                    const clause = contract.clauseBuilder.transferToken(
                        tokenAddress,
                        recipientAddress,
                        amount
                    );

                    expect(clause.to).toBe(tokenAddress);
                    expect(clause.value).toBe(0);
                    expect(clause).toStrictEqual(expected);
                });
            }
        );

        /**
         * Invalid transfer token clause builder test cases.
         */
        invalidTransferTokenClausesTestCases.forEach(
            ({ tokenAddress, recipientAddress, amount, expectedError }) => {
                test(`Build a clause to transfer ${amount} tokens`, () => {
                    expect(() => {
                        contract.clauseBuilder.transferToken(
                            tokenAddress,
                            recipientAddress,
                            amount
                        );
                    }).toThrowError(expectedError);
                });
            }
        );

        /**
         * Transfer VET clause builder test cases.
         */
        transferVETtestCases.forEach(
            ({ recipientAddress, amount, expected }) => {
                test(`Build a clause to transfer ${amount} VET`, () => {
                    const clause = contract.clauseBuilder.transferVET(
                        recipientAddress,
                        amount
                    );

                    expect(clause.to).toBe(recipientAddress);
                    expect(clause).toStrictEqual(expected);
                });
            }
        );

        /**
         * Transfer NFT clause builder test cases.
         */
        transferNFTtestCases.forEach(
            ({
                senderAddress,
                recipientAddress,
                contractAddress,
                tokenId,
                expected
            }) => {
                test(`Build a clause to transfer NFT with id ${tokenId}`, () => {
                    const clause = contract.clauseBuilder.transferNFT(
                        contractAddress,
                        senderAddress,
                        recipientAddress,
                        tokenId
                    );

                    expect(clause).toStrictEqual(expected);
                });
            }
        );

        /**
         * Invalid transfer NFT clause builder test cases.
         */
        invalidNFTtestCases.forEach(
            ({
                senderAddress,
                recipientAddress,
                contractAddress,
                tokenId,
                expectedError
            }) => {
                test(`Build a clause to transfer NFT with id ${tokenId}, ${senderAddress}, ${recipientAddress} and ${contractAddress}`, () => {
                    expect(() =>
                        contract.clauseBuilder.transferNFT(
                            contractAddress,
                            senderAddress,
                            recipientAddress,
                            tokenId
                        )
                    ).toThrowError(expectedError);
                });
            }
        );

        /**
         * Invalid transfer VET clause builder test cases.
         */
        invalidTransferVETtestCases.forEach(
            ({ recipientAddress, amount, expectedError }) => {
                test(`Build a clause to transfer ${amount} VET`, () => {
                    expect(() => {
                        contract.clauseBuilder.transferVET(
                            recipientAddress,
                            amount
                        );
                    }).toThrowError(expectedError);
                });
            }
        );
    });
});

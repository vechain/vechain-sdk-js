import { describe, expect, test } from '@jest/globals';
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
import {
    type DeployParams,
    clauseBuilder,
    type ClauseOptions,
    type ExtendedTransactionClause
} from '../../src';
import { coder } from '../../src';
import { type FunctionFragment } from 'ethers';
/**
 * Unit tests for building transaction clauses.
 * @group unit/clause
 */
describe('Contract', () => {
    test('Build a clause to deploy a contract without constructor', () => {
        const clause = clauseBuilder.deployContract(exampleContractBytecode);

        expect(clause.data).toEqual(exampleContractBytecode);
        expect(clause.to).toBe(null);
        expect(clause.value).toBe(0);
    });

    test('Build a clause to deploy a contract with deploy params', () => {
        const deployParams: DeployParams = {
            types: ['uint256'],
            values: ['100']
        };

        const clause = clauseBuilder.deployContract(
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

    test('Build a clause to deploy a contract with a comment', () => {
        const clauseOptions: ClauseOptions = {
            comment: 'Deploying a contract with a comment'
        };

        const clause = clauseBuilder.deployContract(
            exampleContractBytecode,
            undefined,
            clauseOptions
        );

        expect(clause.data).toEqual(exampleContractBytecode);
        expect(clause.to).toBe(null);
        expect(clause.value).toBe(0);
    });

    test('Build a clause to call a contract function', () => {
        const clause = clauseBuilder.functionInteraction(
            '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
            coder
                .createInterface(exampleContractAbi)
                .getFunction('set') as FunctionFragment,
            [1]
        );

        expect(clause.to).toBe('0x742d35Cc6634C0532925a3b844Bc454e4438f44e');
        expect(clause.value).toBe(0);
        expect(clause.data).toBeDefined();
    });

    test('Build a clause to call a contract function with a comment', () => {
        const clause = clauseBuilder.functionInteraction(
            '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
            coder
                .createInterface(exampleContractAbi)
                .getFunction('set') as FunctionFragment,
            [1],
            undefined,
            { comment: 'Setting the value to 1' }
        ) as ExtendedTransactionClause;

        expect(clause.to).toBe('0x742d35Cc6634C0532925a3b844Bc454e4438f44e');
        expect(clause.value).toBe(0);
        expect(clause.data).toBeDefined();
        expect(clause.comment).toBe('Setting the value to 1');
        expect(clause.abi).toBeUndefined();
    });

    test('Build a clause to call a contract function with comments and abi', () => {
        const clause = clauseBuilder.functionInteraction(
            '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
            coder
                .createInterface(exampleContractAbi)
                .getFunction('set') as FunctionFragment,
            [1],
            undefined,
            { comment: 'Setting the value to 1', includeABI: true }
        ) as ExtendedTransactionClause;

        expect(clause.to).toBe('0x742d35Cc6634C0532925a3b844Bc454e4438f44e');
        expect(clause.value).toBe(0);
        expect(clause.data).toBeDefined();
        expect(clause.comment).toBe('Setting the value to 1');
        expect(clause.abi).toBeDefined();
    });

    describe('Transfer token clause builder test cases', () => {
        /**
         * Transfer token clause builder test cases.
         */
        transferTokenClausesTestCases.forEach(
            ({ tokenAddress, recipientAddress, amount, expected }) => {
                test(`Build a clause to transfer ${amount} tokens`, () => {
                    const clause = clauseBuilder.transferToken(
                        tokenAddress,
                        recipientAddress,
                        amount.toString()
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
                        clauseBuilder.transferToken(
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
            ({ recipientAddress, amount, clauseOptions, expected }) => {
                test(`Build a clause to transfer ${amount} VET`, () => {
                    const clause = clauseBuilder.transferVET(
                        recipientAddress,
                        amount.toString(),
                        clauseOptions
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
                    const clause = clauseBuilder.transferNFT(
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
                        clauseBuilder.transferNFT(
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
                        clauseBuilder.transferVET(recipientAddress, amount);
                    }).toThrowError(expectedError);
                });
            }
        );
    });
});

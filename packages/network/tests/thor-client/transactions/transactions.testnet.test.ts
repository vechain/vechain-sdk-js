import { describe, expect, test } from '@jest/globals';
import {
    buildTransactionBodyClausesTestCases,
    signTransactionTestCases
} from './fixture';
import {
    TESTING_CONTRACT_ABI,
    TEST_ACCOUNTS,
    TESTING_CONTRACT_ADDRESS,
    testnetUrl
} from '../../fixture';
import {
    addressUtils,
    contract,
    type FunctionFragment
} from '@vechain/vechain-sdk-core';
import { HttpClient, ThorClient } from '../../../src';

/**
 * Transactions module tests suite.
 *
 * @group integration/clients/thor-client/transactions
 */
describe('Transactions module Testnet tests suite', () => {
    /**
     * Test suite for buildTransactionBody method
     */
    describe('buildTransactionBody', () => {
        /**
         * buildTransactionBody test cases with different options
         */
        buildTransactionBodyClausesTestCases.forEach(
            ({ description, clauses, options, expected }) => {
                test(description, async () => {
                    const testNetwork = new HttpClient(testnetUrl);
                    const thorClient = new ThorClient(testNetwork);
                    const gasResult = await thorClient.gas.estimateGas(
                        clauses,
                        TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address // This address might not exist on testnet, thus the gasResult.reverted might be true
                    );

                    expect(gasResult.totalGas).toBe(expected.testnet.gas);

                    const txBody =
                        await thorClient.transactions.buildTransactionBody(
                            clauses,
                            gasResult.totalGas,
                            options
                        );

                    expect(txBody).toBeDefined();
                    expect(txBody.clauses).toStrictEqual(
                        expected.testnet.clauses
                    );
                    expect(txBody.expiration).toBe(expected.testnet.expiration);
                    expect(txBody.gas).toBe(gasResult.totalGas);
                    expect(txBody.dependsOn).toBe(expected.testnet.dependsOn);
                    expect(txBody.gasPriceCoef).toBe(
                        expected.testnet.gasPriceCoef
                    );
                    expect(txBody.reserved).toStrictEqual(
                        expected.testnet.reserved
                    );
                    expect(txBody.chainTag).toBe(expected.testnet.chainTag);
                });
            }
        );
    });

    /**
     * Test suite for signTransaction method
     */
    describe('signTransactionTestCases', () => {
        signTransactionTestCases.testnet.correct.forEach(
            ({ description, origin, options, isDelegated, expected }) => {
                test(description, async () => {
                    const testNetwork = new HttpClient(testnetUrl);
                    const thorClient = new ThorClient(testNetwork);

                    const sampleClause =
                        contract.clauseBuilder.functionInteraction(
                            TESTING_CONTRACT_ADDRESS,
                            contract.coder
                                .createInterface(TESTING_CONTRACT_ABI)
                                .getFunction(
                                    'setStateVariable'
                                ) as FunctionFragment,
                            [123]
                        );

                    const gasResult = await thorClient.gas.estimateGas(
                        [sampleClause],
                        origin.address
                    );

                    const txBody =
                        await thorClient.transactions.buildTransactionBody(
                            [sampleClause],
                            gasResult.totalGas,
                            {
                                isDelegated
                            }
                        );

                    const signedTx =
                        await thorClient.transactions.signTransaction(
                            txBody,
                            origin.privateKey,
                            options
                        );

                    expect(signedTx).toBeDefined();
                    expect(signedTx.body).toMatchObject(expected.body);
                    expect(signedTx.origin).toBe(
                        addressUtils.toChecksummed(origin.address)
                    );
                    expect(signedTx.isDelegated).toBe(isDelegated);
                    expect(signedTx.isSigned).toBe(true);
                    expect(signedTx.signature).toBeDefined();
                });
            }
        );
    });
});

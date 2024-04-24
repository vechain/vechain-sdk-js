import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';
import {
    buildTransactionBodyClausesTestCases,
    signTransactionTestCases
} from './fixture';
import {
    TESTING_CONTRACT_ABI,
    TESTING_CONTRACT_ADDRESS,
    testnetUrl,
    THOR_SOLO_ACCOUNTS_BASE_WALLET
} from '../../fixture';
import {
    addressUtils,
    clauseBuilder,
    coder,
    type FunctionFragment,
    TransactionHandler
} from '@vechain/sdk-core';
import {
    ProviderInternalBaseWallet,
    signerUtils,
    ThorClient,
    VechainBaseSigner,
    VechainProvider
} from '../../../src';

/**
 * Transactions module tests suite.
 *
 * @group integration/clients/thor-client/transactions
 */
describe('Transactions module Testnet tests suite', () => {
    /**
     * ThorClient and provider instances
     */
    let thorClient: ThorClient;
    let provider: VechainProvider;

    /**
     * Init thor client and provider before each test
     */
    beforeEach(() => {
        thorClient = ThorClient.fromUrl(testnetUrl);
        provider = new VechainProvider(
            thorClient,
            THOR_SOLO_ACCOUNTS_BASE_WALLET,
            false
        );
    });

    /**
     * Destroy thor client and provider after each test
     */
    afterEach(() => {
        provider.destroy();
    });

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
                    const thorClient = ThorClient.fromUrl(testnetUrl);
                    const gasResult = await thorClient.gas.estimateGas(
                        clauses,
                        '0x000000000000000000000000004d000000000000' // This address might not exist on testnet, thus the gasResult.reverted might be true
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
                    const thorClient = ThorClient.fromUrl(testnetUrl);

                    const sampleClause = clauseBuilder.functionInteraction(
                        TESTING_CONTRACT_ADDRESS,
                        coder
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

                    // Get the signer and sign the transaction
                    const signer = new VechainBaseSigner(
                        Buffer.from(origin.privateKey, 'hex'),
                        new VechainProvider(
                            thorClient,
                            new ProviderInternalBaseWallet([], {
                                delegator: options
                            }),
                            isDelegated
                        )
                    );

                    const signedRawTx = isDelegated
                        ? await signer.signTransactionWithDelegator(
                              signerUtils.transactionBodyToTransactionRequestInput(
                                  txBody,
                                  origin.address
                              )
                          )
                        : await signer.signTransaction(
                              signerUtils.transactionBodyToTransactionRequestInput(
                                  txBody,
                                  origin.address
                              )
                          );
                    const signedTx = TransactionHandler.decode(
                        Buffer.from(signedRawTx.slice(2), 'hex'),
                        true
                    );

                    expect(signedTx).toBeDefined();
                    expect(signedTx.body).toMatchObject(expected.body);
                    expect(signedTx.origin).toBe(
                        addressUtils.toERC55Checksum(origin.address)
                    );
                    expect(signedTx.isDelegated).toBe(isDelegated);
                    expect(signedTx.isSigned).toBe(true);
                    expect(signedTx.signature).toBeDefined();
                });
            }
        );
    });
});

import { beforeEach, describe, expect, test } from '@jest/globals';
import {
    ProviderInternalBaseWallet,
    signerUtils,
    ThorClient,
    VechainBaseSigner,
    VechainProvider
} from '../../../../src';
import {
    soloUrl,
    TESTING_CONTRACT_ABI,
    TESTING_CONTRACT_ADDRESS
} from '../../../fixture';
import {
    addressUtils,
    clauseBuilder,
    coder,
    type FunctionFragment,
    TransactionHandler
} from '../../../../../core';
import { signTransactionTestCases } from './fixture';

/**
 * Vechain base signer tests - solo
 *
 * @group integration/signers/vechain-base-signer-solo
 */
describe('Vechain base signer tests - testnet', () => {
    /**
     * ThorClient and provider instances
     */
    let thorClient: ThorClient;

    /**
     * Init thor client and provider before each test
     */
    beforeEach(() => {
        thorClient = ThorClient.fromUrl(soloUrl);
    });

    /**
     * Test suite for signTransaction method
     */
    describe('signTransactionTestCases', () => {
        /**
         * signTransaction test cases with different options
         */
        signTransactionTestCases.solo.correct.forEach(
            ({ description, origin, options, isDelegated, expected }) => {
                test(description, async () => {
                    const sampleClause = clauseBuilder.functionInteraction(
                        TESTING_CONTRACT_ADDRESS,
                        coder
                            .createInterface(TESTING_CONTRACT_ABI)
                            .getFunction('deposit') as FunctionFragment,
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

        /**
         * signTransaction test cases that should throw an error
         *
         * ----- START: TEMPORARY COMMENT -----
         * Make more incorrect tst cases coherent with the new structure
         * ----- END: TEMPORARY COMMENT -----
         */
        // signTransactionTestCases.solo.incorrect.forEach(
        //     ({ description, origin, options, expectedError }) => {
        //         test(
        //             description,
        //             async () => {
        //                 const sampleClause = clauseBuilder.functionInteraction(
        //                     TESTING_CONTRACT_ADDRESS,
        //                     coder
        //                         .createInterface(TESTING_CONTRACT_ABI)
        //                         .getFunction(
        //                             'setStateVariable'
        //                         ) as FunctionFragment,
        //                     [123]
        //                 );
        //
        //                 const txBody =
        //                     await thorClient.transactions.buildTransactionBody(
        //                         [sampleClause],
        //                         0
        //                     );
        //
        //                 const signer = new VechainBaseSigner(
        //                     Buffer.from(origin.privateKey, 'hex'),
        //                     new VechainProvider(
        //                         thorClient,
        //                         new ProviderInternalBaseWallet([], {
        //                             delegator: options
        //                         }),
        //                         true
        //                     )
        //                 );
        //
        //                 await expect(() => {
        //                     await signer.signTransactionWithDelegator(
        //                         signerUtils.transactionBodyToTransactionRequestInput(
        //                             txBody,
        //                             origin.address
        //                         )
        //                     );
        //                 }).rejects.toThrowError(expectedError);
        //             },
        //             10000
        //         );
        //     }
        // );
    });
});

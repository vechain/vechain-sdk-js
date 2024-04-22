/**
 * Vechain provider tests
 *
 * @group integration/providers/vechain-provider
 */
import { beforeEach, describe, expect, test } from '@jest/globals';
import {
    ThorClient,
    VechainBaseSigner,
    VechainProvider
} from '../../../../src';
import { testnetUrl } from '../../../fixture';
import {
    THOR_SOLO_ACCOUNTS_BASE_WALLET,
    THOR_SOLO_ACCOUNTS_BASE_WALLET_WITH_DELEGATOR
} from '../../../provider/fixture';
import { signTransactionTestCases } from '../../../thor-client/transactions/fixture';

/**
 * Vechain base signer tests - testnet
 *
 * @group integration/signers/vechain-base-signer
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
        thorClient = ThorClient.fromUrl(testnetUrl);
    });

    /**
     * Positive case tests
     */
    describe('Positive case', () => {
        /**
         * Should be able to sign transaction NOT delegated
         */
        test('Should be able to sign transaction - NOT DELEGATED CASES', async () => {
            for (const fixture of signTransactionTestCases.testnet.correct) {
                if (!fixture.isDelegated) {
                    // Init the signer
                    const signer = new VechainBaseSigner(
                        Buffer.from(fixture.origin.privateKey, 'hex'),
                        new VechainProvider(
                            thorClient,
                            THOR_SOLO_ACCOUNTS_BASE_WALLET,
                            false
                        )
                    );

                    // Sign the transaction
                    const signedTransaction = await signer.signTransaction({
                        from: fixture.origin.address
                    });

                    expect(signedTransaction).toBeDefined();
                }
            }
        });

        /**
         * Should be able to sign transaction delegated
         */
        test('Should be able to sign transaction - DELEGATED CASES', async () => {
            for (const fixture of signTransactionTestCases.testnet.correct) {
                if (fixture.isDelegated) {
                    // Init the signer
                    const signer = new VechainBaseSigner(
                        Buffer.from(fixture.origin.privateKey, 'hex'),
                        new VechainProvider(
                            thorClient,
                            THOR_SOLO_ACCOUNTS_BASE_WALLET_WITH_DELEGATOR(
                                fixture.options
                            ),
                            true
                        )
                    );

                    // Sign the transaction
                    const signedTransaction =
                        await signer.signTransactionWithDelegator({
                            from: fixture.origin.address
                        });

                    expect(signedTransaction).toBeDefined();
                }
            }
        });
    });
});

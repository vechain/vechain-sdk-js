/**
 * Vechain provider tests
 *
 * @group integration/providers/vechain-provider
 */
import {
    afterEach,
    beforeEach,
    describe,
    expect,
    jest,
    test
} from '@jest/globals';
import {
    ThorClient,
    VechainBaseSigner,
    VechainProvider,
    vnsUtils
} from '../../../../src/';
import { testnetUrl } from '../../../fixture';
import { addressUtils } from '../../../../../core';
import { populateCallTestCases, populateCallTestCasesAccount } from './fixture';

/**
 * Vechain base signer tests
 *
 * @group unit/signers/vechain-base-signer
 */
describe('Vechain base signer tests', () => {
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
        provider = new VechainProvider(thorClient);
    });

    /**
     * Destroy thor client and provider after each test
     */
    afterEach(() => {
        provider.destroy();
    });

    /**
     * Positive case tests
     */
    describe('Positive case', () => {
        /**
         * Should be able to connect with a provider
         */
        test('Should be able to connect with a provider', () => {
            // Provider is NOT attached
            const signerWithoutProvider = new VechainBaseSigner(
                Buffer.from(
                    '7f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158',
                    'hex'
                ),
                null
            );
            expect(signerWithoutProvider.provider).toBeNull();

            // Attach the provider
            const signerWithProvider = signerWithoutProvider.connect(provider);
            expect(signerWithProvider.provider).toBe(provider);
        });

        /**
         * Should be able to get the address of the signer
         */
        test('Should be able to get the address of the signer', async () => {
            const signer = new VechainBaseSigner(
                Buffer.from(
                    '7f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158',
                    'hex'
                ),
                provider
            );
            const address = await signer.getAddress();
            expect(address).toBe(
                addressUtils.toERC55Checksum(
                    '0x3db469a79593dcc67f07de1869d6682fc1eaf535'
                )
            );
        });

        /**
         * Should be able to get the nonce
         */
        test('Should be able to get the nonce', async () => {
            // Generate nonce (provider attached and detached)
            for (const tempProvider of [provider, null]) {
                const signer = new VechainBaseSigner(
                    Buffer.from(
                        '7f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158',
                        'hex'
                    ),
                    tempProvider
                );
                const nonce = await signer.getNonce('latest');
                expect(nonce).toBeDefined();
            }
        });

        /**
         * Should be able to populate call
         */
        describe('populateCall method', () => {
            /**
             * Positive case tests
             */
            populateCallTestCases.positive.forEach((fixture) => {
                test(fixture.description, async () => {
                    // Test with provider attached and detached

                    const signer = new VechainBaseSigner(
                        Buffer.from(
                            populateCallTestCasesAccount.privateKey,
                            'hex'
                        ),
                        null
                    );
                    const populatedCallTransaction = await signer.populateCall(
                        fixture.transactionToPopulate
                    );
                    expect(populatedCallTransaction).toStrictEqual(
                        fixture.expected
                    );
                });
            });

            /**
             * Negative case tests
             */
            populateCallTestCases.negative.forEach((fixture) => {
                test(fixture.description, async () => {
                    // Test with provider attached and detached

                    const signer = new VechainBaseSigner(
                        Buffer.from(
                            populateCallTestCasesAccount.privateKey,
                            'hex'
                        ),
                        null
                    );

                    await expect(
                        signer.populateCall(fixture.transactionToPopulate)
                    ).rejects.toThrowError(fixture.expectedError);
                });
            });
        });
    });

    describe('resolveName(vnsName)', () => {
        test('Should use vnsUtils.resolveName() to resolve an address by name', async () => {
            const signer = new VechainBaseSigner(
                Buffer.from(
                    '7f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158',
                    'hex'
                ),
                provider
            );

            jest.spyOn(vnsUtils, 'resolveName');
            const name = 'test-sdk.vet';
            await signer.resolveName(name);
            expect(vnsUtils.resolveName).toHaveBeenCalledWith(
                provider.thorClient,
                name
            );
        });

        test('Should return null if there were invalid result', async () => {
            const signer = new VechainBaseSigner(
                Buffer.from(
                    '7f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158',
                    'hex'
                ),
                provider
            );
            const name = 'error.vet';
            jest.spyOn(vnsUtils, 'resolveNames').mockImplementation(
                async () => {
                    return await Promise.resolve([]);
                }
            );
            const address = await signer.resolveName(name);
            expect(address).toEqual(null);
        });

        test('Should pass address provided by resolveNames()', async () => {
            const signer = new VechainBaseSigner(
                Buffer.from(
                    '7f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158',
                    'hex'
                ),
                provider
            );
            const name = 'address1.vet';
            jest.spyOn(vnsUtils, 'resolveName').mockImplementation(async () => {
                return await Promise.resolve(
                    '0x0000000000000000000000000000000000000001'
                );
            });
            const address = await signer.resolveName(name);
            expect(address).toEqual(
                '0x0000000000000000000000000000000000000001'
            );
        });
    });
});

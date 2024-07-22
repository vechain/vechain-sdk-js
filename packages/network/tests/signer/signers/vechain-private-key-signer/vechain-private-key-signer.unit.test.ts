import * as n_utils from '@noble/curves/abstract/utils';
import { addressUtils, Hex, secp256k1, txt } from '@vechain/sdk-core';
import { ethers } from 'ethers';
import {
    EIP191_MESSAGE,
    EIP191_PRIVATE_KEY,
    eip712TestCases,
    populateCallTestCases,
    populateCallTestCasesAccount
} from './fixture';
import {
    afterEach,
    beforeEach,
    describe,
    expect,
    jest,
    test
} from '@jest/globals';
import {
    TESTNET_URL,
    ThorClient,
    VeChainPrivateKeySigner,
    VeChainProvider,
    vnsUtils
} from '../../../../src/';

/**
 * VeChain base signer tests
 *
 * @group unit/signers/vechain-base-signer
 */
describe('VeChain base signer tests', () => {
    /**
     * ThorClient and provider instances
     */
    let thorClient: ThorClient;
    let provider: VeChainProvider;

    /**
     * Init thor client and provider before each test
     */
    beforeEach(() => {
        thorClient = ThorClient.fromUrl(TESTNET_URL);
        provider = new VeChainProvider(thorClient);
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
            const signerWithoutProvider = new VeChainPrivateKeySigner(
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
            const signer = new VeChainPrivateKeySigner(
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
                const signer = new VeChainPrivateKeySigner(
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

                    const signer = new VeChainPrivateKeySigner(
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

                    const signer = new VeChainPrivateKeySigner(
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
        test('Should return null if provider is not set', async () => {
            const signer = new VeChainPrivateKeySigner(
                Buffer.from(
                    '7f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158',
                    'hex'
                ),
                null
            );

            const name = 'test-sdk.vet';
            const result = await signer.resolveName(name);
            expect(result).toEqual(null);
        });

        test('Should use vnsUtils.resolveName() to resolve an address by name', async () => {
            const signer = new VeChainPrivateKeySigner(
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
            const signer = new VeChainPrivateKeySigner(
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
            const signer = new VeChainPrivateKeySigner(
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

    describe('EIP-191', () => {
        test('signMessage - invalid - simulate a signature error', async () => {
            const signer = new VeChainPrivateKeySigner(
                Buffer.from(
                    n_utils.hexToBytes(
                        Hex.canon(eip712TestCases.invalid.privateKey)
                    )
                ),
                provider
            );
            jest.spyOn(secp256k1, 'sign').mockImplementationOnce(() => {
                throw Error();
            });
            await expect(
                signer.signMessage('Hello world!')
            ).rejects.toThrowError();
        });

        test('signMessage - ethers compatible - string', async () => {
            const expected = await new ethers.Wallet(
                EIP191_PRIVATE_KEY
            ).signMessage(EIP191_MESSAGE);
            const actual = await new VeChainPrivateKeySigner(
                Buffer.from(n_utils.hexToBytes(Hex.canon(EIP191_PRIVATE_KEY))),
                provider
            ).signMessage(EIP191_MESSAGE);
            expect(actual).toBe(expected);
        });

        test('signMessage - ethers compatible - uint8array', async () => {
            const message = txt.encode(EIP191_MESSAGE);
            const expected = await new ethers.Wallet(
                EIP191_PRIVATE_KEY
            ).signMessage(message);
            const actual = await new VeChainPrivateKeySigner(
                Buffer.from(n_utils.hexToBytes(Hex.canon(EIP191_PRIVATE_KEY))),
                provider
            ).signMessage(message);
            expect(actual).toBe(expected);
        });
    });

    describe('EIP-712', () => {
        test('signTypedData - invalid', async () => {
            const signer = new VeChainPrivateKeySigner(
                Buffer.from(
                    n_utils.hexToBytes(
                        Hex.canon(eip712TestCases.invalid.privateKey)
                    )
                ),
                provider
            );
            await expect(
                signer.signTypedData(
                    eip712TestCases.invalid.domain,
                    eip712TestCases.invalid.types,
                    eip712TestCases.invalid.data
                )
            ).rejects.toThrowError(TypeError);
        });

        test('signTypedData - ethers compatible', async () => {
            const expected = await new ethers.Wallet(
                eip712TestCases.valid.privateKey
            ).signTypedData(
                eip712TestCases.valid.domain,
                eip712TestCases.valid.types,
                eip712TestCases.valid.data
            );
            expect(expected).toBe(eip712TestCases.valid.signature);
            const actual = await new VeChainPrivateKeySigner(
                Buffer.from(
                    n_utils.hexToBytes(
                        Hex.canon(eip712TestCases.valid.privateKey)
                    )
                ),
                provider
            ).signTypedData(
                eip712TestCases.valid.domain,
                eip712TestCases.valid.types,
                eip712TestCases.valid.data
            );
            expect(actual).toBe(expected);
        });
    });
});

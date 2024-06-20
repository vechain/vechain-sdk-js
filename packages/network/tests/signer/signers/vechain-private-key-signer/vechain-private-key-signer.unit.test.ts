/**
 *VeChain provider tests
 *
 * @group integration/providers/vechain-provider
 */
import * as n_utils from '@noble/curves/abstract/utils';
import { ALL_ACCOUNTS, testnetUrl } from '../../../fixture';
import { ethers } from 'ethers';
import { addressUtils, Hex } from '@vechain/sdk-core';
import { populateCallTestCases, populateCallTestCasesAccount } from './fixture';
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
    VeChainPrivateKeySigner,
    VeChainProvider,
    vnsUtils
} from '../../../../src/';

interface TestCaseTypedDataDomain {
    name?: string;
    version?: string;
    chainId?: number;
    verifyingContract?: string;
    salt?: string;
}

interface TestCaseTypedDataType {
    name: string;
    type: string;
}

interface TestCaseTypedData {
    name: string;

    domain: TestCaseTypedDataDomain;
    primaryType: string;
    types: Record<string, TestCaseTypedDataType[]>;
    data: Record<string, unknown>;

    encoded: string;
    digest: string;

    privateKey: string;
    signature: string;
}

const testCaseTypedData: TestCaseTypedData = {
    name: 'EIP712 example',
    domain: {
        name: 'Ether Mail',
        version: '1',
        chainId: 1,
        verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC'
    },
    primaryType: 'Mail',
    types: {
        Person: [
            {
                name: 'name',
                type: 'string'
            },
            {
                name: 'wallet',
                type: 'address'
            }
        ],
        Mail: [
            {
                name: 'from',
                type: 'Person'
            },
            {
                name: 'to',
                type: 'Person'
            },
            {
                name: 'contents',
                type: 'string'
            }
        ]
    },
    data: {
        from: {
            name: 'Cow',
            wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826'
        },
        to: {
            name: 'Bob',
            wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB'
        },
        contents: 'Hello, Bob!'
    },
    encoded:
        '0xa0cedeb2dc280ba39b857546d74f5549c3a1d7bdc2dd96bf881f76108e23dac2fc71e5fa27ff56c350aa531bc129ebdf613b772b6604664f5d8dbe21b85eb0c8cd54f074a4af31b4411ff6a60c9719dbd559c221c8ac3492d9d872b041d703d1b5aadf3154a261abdd9086fc627b61efca26ae5702701d05cd2305f7c52a2fc8',
    digest: '0xbe609aee343fb3c4b28e1df9e632fca64fcfaede20f02e86244efddf30957bd2',
    privateKey:
        '0xc85ef7d79691fe79573b1a7064c19c1a9819ebdbd1faaab1a8ec92344438aaf4',
    signature:
        '0x4355c47d63924e8a72e509b65029052eb6c299d53a04e167c5775fd466751c9d07299936d304c153f6443dfa05f40ff007d72911b6f72307f996231605b915621c'
};

/**
 *VeChain base signer tests
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
        thorClient = ThorClient.fromUrl(testnetUrl);
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

    describe('ethers compatible', () => {
        test('signMessage', async () => {
            const privateKey = ALL_ACCOUNTS[0].privateKey;
            const message = 'Hello world!';
            const expected = await new ethers.Wallet(privateKey).signMessage(
                message
            );
            const actual = await new VeChainPrivateKeySigner(
                Buffer.from(n_utils.hexToBytes(privateKey)),
                provider
            ).signMessage(message);
            expect(actual).toBe(expected);
        });

        test('signTypedData', async () => {
            const expected = await new ethers.Wallet(
                testCaseTypedData.privateKey
            ).signTypedData(
                testCaseTypedData.domain,
                testCaseTypedData.types,
                testCaseTypedData.data
            );
            console.log(expected);
            expect(expected).toBe(testCaseTypedData.signature);
            const actual = await new VeChainPrivateKeySigner(
                Buffer.from(
                    n_utils.hexToBytes(Hex.canon(testCaseTypedData.privateKey))
                ),
                provider
            ).signTypedData(
                testCaseTypedData.domain,
                testCaseTypedData.types,
                testCaseTypedData.data
            );
            console.log(actual);
            // assert.equal(expected, signature, 'signature');
        });
    });
});

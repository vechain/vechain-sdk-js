import {
    ABIContract,
    Address,
    Clause,
    HexUInt,
    Transaction,
    type TransactionClause
} from '@vechain/sdk-core';
import { signerUtils, THOR_SOLO_URL, ThorClient } from '@vechain/sdk-network';
import fs from 'fs';
import path from 'path';
import {
    type KMSClientParameters,
    KMSVeChainProvider,
    KMSVeChainSigner
} from '../src';
import {
    EIP712_CONTRACT,
    EIP712_FROM,
    EIP712_TO,
    fundVTHO,
    signTransactionTestCases as sendTransactionTestCases,
    signTransactionTestCases,
    TESTING_CONTRACT_ABI,
    TESTING_CONTRACT_ADDRESS,
    timeout
} from './fixture';

// This variable should be replaced once this is clarified  https://github.com/localstack/localstack/issues/11678
let expectedAddress: string;

/**
 * AWS KMS VeChain signer tests - solo
 *
 * @group integration/signers/vechain-aws-kms-signer-solo
 */
describe('KMSVeChainSigner - Thor Solo', () => {
    /**
     * ThorClient and provider instances
     */
    let thorClient: ThorClient;

    /**
     * KMSVeChainSigner instance
     */
    let signer: KMSVeChainSigner;

    /**
     * KMSVeChainSigner with gasPayer instance
     */
    let signerWithGasPayer: KMSVeChainSigner;

    /**
     * Init thor client and provider before all tests
     */
    beforeAll(async () => {
        const awsCredentialsPath = path.resolve(
            __dirname,
            './aws-credentials.json'
        );
        let awsClientParameters: KMSClientParameters;
        let gasPayerAwsClientParameters: KMSClientParameters;
        try {
            [awsClientParameters, gasPayerAwsClientParameters] = JSON.parse(
                fs.readFileSync(awsCredentialsPath, 'utf8')
            ) as KMSClientParameters[];
        } catch (error) {
            console.log('Loading test credentials');
            const testAwsCredentialsPath = path.resolve(
                __dirname,
                './test-aws-credentials.json'
            );
            [awsClientParameters, gasPayerAwsClientParameters] = JSON.parse(
                fs.readFileSync(testAwsCredentialsPath, 'utf8')
            ) as KMSClientParameters[];
        }
        thorClient = ThorClient.at(THOR_SOLO_URL);

        // Signer with gasPayer disabled
        signer = new KMSVeChainSigner(
            new KMSVeChainProvider(thorClient, awsClientParameters)
        );
        expectedAddress = await signer.getAddress();
        // This step should be removed once this is clarified  https://github.com/localstack/localstack/issues/11678
        await fundVTHO(thorClient, expectedAddress);

        // Signer with gasPayer enabled
        const gasPayerProvider = new KMSVeChainProvider(
            thorClient,
            gasPayerAwsClientParameters
        );
        expect(gasPayerProvider).toBeInstanceOf(KMSVeChainProvider);
        signerWithGasPayer = new KMSVeChainSigner(
            new KMSVeChainProvider(thorClient, awsClientParameters, true),
            {
                provider: gasPayerProvider
            }
        );
        // This step should be removed once this is clarified  https://github.com/localstack/localstack/issues/11678
        await fundVTHO(thorClient, await signerWithGasPayer.getAddress(true));
    }, timeout);

    describe('getAddress', () => {
        test('should get the address from the public key', async () => {
            expect(signer).toBeInstanceOf(KMSVeChainSigner);
            expect(await signer.getAddress()).toBe(expectedAddress);
        });
    });

    /**
     * Test suite for signTransaction method
     */
    describe('signTransaction', () => {
        /**
         * signTransaction test cases with different options
         */
        signTransactionTestCases.solo.correct.forEach(
            ({ description, isDelegated, expected }) => {
                test(
                    description,
                    async () => {
                        const signTransactionSigner = isDelegated
                            ? signerWithGasPayer
                            : signer;
                        const sampleClause = Clause.callFunction(
                            Address.of(TESTING_CONTRACT_ADDRESS),
                            ABIContract.ofAbi(TESTING_CONTRACT_ABI).getFunction(
                                'deposit'
                            ),
                            [123]
                        ) as TransactionClause;

                        const originAddress =
                            await signTransactionSigner.getAddress();

                        const gasResult = await thorClient.gas.estimateGas(
                            [sampleClause],
                            originAddress
                        );

                        const txBody =
                            await thorClient.transactions.buildTransactionBody(
                                [sampleClause],
                                gasResult.totalGas,
                                {
                                    isDelegated
                                }
                            );

                        const signedRawTx =
                            await signTransactionSigner.signTransaction(
                                signerUtils.transactionBodyToTransactionRequestInput(
                                    txBody,
                                    originAddress
                                )
                            );
                        const signedTx = Transaction.decode(
                            HexUInt.of(signedRawTx.slice(2)).bytes,
                            true
                        );

                        expect(signedTx).toBeDefined();
                        expect(signedTx.body).toMatchObject(expected.body);
                        expect(signedTx.origin.toString()).toBe(
                            Address.checksum(HexUInt.of(originAddress))
                        );
                        expect(signedTx.isDelegated).toBe(isDelegated);
                        expect(signedTx.isSigned).toBe(true);
                        expect(signedTx.signature).toBeDefined();
                    },
                    timeout
                );
            }
        );
    });

    /**
     * Test suite for sendTransaction method
     */
    describe('sendTransaction', () => {
        /**
         * sendTransaction test cases with different options
         */
        sendTransactionTestCases.solo.correct.forEach(
            ({ description, isDelegated }) => {
                test(
                    description,
                    async () => {
                        const signTransactionSigner = isDelegated
                            ? signerWithGasPayer
                            : signer;
                        const sampleClause = Clause.callFunction(
                            Address.of(TESTING_CONTRACT_ADDRESS),
                            ABIContract.ofAbi(TESTING_CONTRACT_ABI).getFunction(
                                'deposit'
                            ),
                            [123]
                        ) as TransactionClause;

                        const originAddress =
                            await signTransactionSigner.getAddress();

                        const gasResult = await thorClient.gas.estimateGas(
                            [sampleClause],
                            originAddress
                        );

                        const txBody =
                            await thorClient.transactions.buildTransactionBody(
                                [sampleClause],
                                gasResult.totalGas,
                                {
                                    isDelegated
                                }
                            );

                        const receipt =
                            await signTransactionSigner.sendTransaction(
                                signerUtils.transactionBodyToTransactionRequestInput(
                                    txBody,
                                    originAddress
                                )
                            );

                        expect(
                            /^0x([A-Fa-f0-9]{64})$/.exec(receipt)
                        ).toBeTruthy();
                    },
                    timeout
                );
            }
        );
    });

    /**
     * Test suite for signMessage method
     */
    describe('signMessage', () => {
        test('should sign a message successfully', async () => {
            const message = 'Hello, VeChain!';
            const signature = await signer.signMessage(message);
            expect(signature).toBeDefined();
            // 64-bytes hex string
            expect(signature.length).toBe(132);
        });
    });

    /**
     * Test suite for signTypedData method
     */
    describe('signTypedData', () => {
        test('should sign typed data successfully', async () => {
            const typedData = {
                domain: {
                    name: 'Ether Mail',
                    version: '1',
                    chainId: 1,
                    verifyingContract: EIP712_CONTRACT
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
                        wallet: EIP712_FROM
                    },
                    to: {
                        name: 'Bob',
                        wallet: EIP712_TO
                    },
                    contents: 'Hello, Bob!'
                }
            };
            const signature = await signer.signTypedData(
                typedData.domain,
                typedData.types,
                typedData.data,
                typedData.primaryType
            );
            expect(signature).toBeDefined();
            // 64-bytes hex string
            expect(signature).toMatch(/^0x[A-Fa-f0-9]{130}$/);

            const signatureWithoutPrimaryType = await signer.signTypedData(
                typedData.domain,
                typedData.types,
                typedData.data
            );
            expect(signatureWithoutPrimaryType).toBeDefined();
            // 64-bytes hex string
            expect(signatureWithoutPrimaryType).toMatch(/^0x[A-Fa-f0-9]{130}$/);

            // Not checking directly the signatures since there is an issue in LocalStack:
            // https://github.com/localstack/localstack/issues/11678
            // Looks like, regardless the configuration, a new SECP256r1 key is generated
            // meaning that the signature will be different every time.
            // However both hashes have been checked and they match, + tests in the other implementation.
        });
    });
});

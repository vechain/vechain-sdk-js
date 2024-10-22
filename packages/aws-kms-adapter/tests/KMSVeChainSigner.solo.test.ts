import {
    ABIContract,
    Address,
    Clause,
    ERC20_ABI,
    HexUInt,
    Transaction,
    VTHO_ADDRESS,
    type TransactionClause
} from '@vechain/sdk-core';
import {
    ProviderInternalBaseWallet,
    signerUtils,
    THOR_SOLO_ACCOUNTS,
    THOR_SOLO_URL,
    ThorClient,
    VeChainPrivateKeySigner,
    VeChainProvider,
    type TransactionReceipt
} from '@vechain/sdk-network';
import fs from 'fs';
import path from 'path';
import { KMSVeChainProvider, KMSVeChainSigner } from '../src';
import {
    EIP712_CONTRACT,
    EIP712_FROM,
    EIP712_TO,
    signTransactionTestCases,
    TESTING_CONTRACT_ABI,
    TESTING_CONTRACT_ADDRESS
} from './fixture';

const timeout = 8000; // 8 seconds

interface AwsClientParameters {
    keyId: string;
    region: string;
    credentials: {
        accessKeyId: string;
        secretAccessKey: string;
        sessionToken?: string;
    };
    endpoint: string;
}

// This variable should be replaced once this is clarified  https://github.com/localstack/localstack/issues/11678
let expectedAddress: string;

const fundVTHO = async (
    thorClient: ThorClient,
    receiverAddress: string
): Promise<void> => {
    const signer = new VeChainPrivateKeySigner(
        HexUInt.of(THOR_SOLO_ACCOUNTS[0].privateKey).bytes,
        new VeChainProvider(
            thorClient,
            new ProviderInternalBaseWallet([]),
            false
        )
    );
    // Load the ERC20 contract
    const contract = thorClient.contracts.load(VTHO_ADDRESS, ERC20_ABI, signer);

    const expectedVTHO = 200000000000000000000n;

    // Execute a 'transfer' transaction on the deployed contract,
    // transferring a specified amount of tokens
    const transferResult = await contract.transact.transfer(
        { value: 0, comment: 'Transferring tokens' },
        receiverAddress,
        expectedVTHO
    );

    // Wait for the transfer transaction to complete and obtain its receipt
    const transactionReceiptTransfer =
        (await transferResult.wait()) as TransactionReceipt;

    // Verify that the transfer transaction did not revert
    expect(transactionReceiptTransfer.reverted).toBe(false);

    // Execute a 'balanceOf' call on the contract to check the balance of the receiver
    const balanceOfResult = await contract.read.balanceOf(receiverAddress);
    expect(balanceOfResult).toStrictEqual([expectedVTHO]);
};

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
     * KMSVeChainSigner with delegator instance
     */
    let signerWithDelegator: KMSVeChainSigner;

    /**
     * Init thor client and provider before each test
     */
    beforeAll(async () => {
        const awsCredentialsPath = path.resolve(
            __dirname,
            './aws-credentials.json'
        );
        let awsClientParameters: AwsClientParameters;
        let delegatorAwsClientParameters: AwsClientParameters;
        try {
            [awsClientParameters, delegatorAwsClientParameters] = JSON.parse(
                fs.readFileSync(awsCredentialsPath, 'utf8')
            ) as AwsClientParameters[];
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            console.log('Loading test credentials');
            const testAwsCredentialsPath = path.resolve(
                __dirname,
                './test-aws-credentials.json'
            );
            [awsClientParameters, delegatorAwsClientParameters] = JSON.parse(
                fs.readFileSync(testAwsCredentialsPath, 'utf8')
            ) as AwsClientParameters[];
        }
        thorClient = ThorClient.fromUrl(THOR_SOLO_URL);
        const provider = new KMSVeChainProvider(
            thorClient,
            awsClientParameters.keyId,
            awsClientParameters.region,
            awsClientParameters.credentials,
            awsClientParameters.endpoint
        );
        expect(provider).toBeInstanceOf(KMSVeChainProvider);

        if (delegatorAwsClientParameters !== undefined) {
            const delegatorProvider = new KMSVeChainProvider(
                thorClient,
                delegatorAwsClientParameters.keyId,
                delegatorAwsClientParameters.region,
                delegatorAwsClientParameters.credentials,
                delegatorAwsClientParameters.endpoint
            );
            expect(delegatorProvider).toBeInstanceOf(KMSVeChainProvider);
            signerWithDelegator = new KMSVeChainSigner(provider, {
                provider: delegatorProvider
            });
            // This step should be removed once this is clarified  https://github.com/localstack/localstack/issues/11678
            await fundVTHO(
                thorClient,
                await signerWithDelegator.getAddress(true)
            );
        }
        signer = new KMSVeChainSigner(provider);
        expectedAddress = await signer.getAddress();
        // This step should be removed once this is clarified  https://github.com/localstack/localstack/issues/11678
        await fundVTHO(thorClient, expectedAddress);
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
                            ? signerWithDelegator
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
        test(
            'should send a transaction successfully',
            async () => {
                const sampleClause = Clause.callFunction(
                    Address.of(TESTING_CONTRACT_ADDRESS),
                    ABIContract.ofAbi(TESTING_CONTRACT_ABI).getFunction(
                        'deposit'
                    ),
                    [123]
                ) as TransactionClause;

                const originAddress = await signer.getAddress();

                const gasResult = await thorClient.gas.estimateGas(
                    [sampleClause],
                    originAddress
                );

                const txBody =
                    await thorClient.transactions.buildTransactionBody(
                        [sampleClause],
                        gasResult.totalGas,
                        {
                            isDelegated: false
                        }
                    );

                const receipt = await signer.sendTransaction(
                    signerUtils.transactionBodyToTransactionRequestInput(
                        txBody,
                        originAddress
                    )
                );

                expect(receipt.match(/^0x([A-Fa-f0-9]{64})$/)).toBeTruthy();
            },
            timeout
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
                typedData.data
            );
            expect(signature).toBeDefined();
            // 64-bytes hex string
            expect(signature.length).toBe(132);
        });
    });
});

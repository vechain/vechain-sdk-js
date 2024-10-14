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
    TESTING_CONTRACT_ABI,
    TESTING_CONTRACT_ADDRESS
} from './fixture';

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
    kmsSigner: KMSVeChainSigner
): Promise<void> => {
    const signer = new VeChainPrivateKeySigner(
        HexUInt.of(THOR_SOLO_ACCOUNTS[0].privateKey).bytes,
        new VeChainProvider(
            thorClient,
            new ProviderInternalBaseWallet([]),
            false
        )
    );
    // Deploy the ERC20 contract
    const contract = thorClient.contracts.load(VTHO_ADDRESS, ERC20_ABI, signer);

    const receiverAddress = await kmsSigner.getAddress();
    expectedAddress = receiverAddress;

    const expectedVTHO = 20000000000000000000000n;

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
     * Init thor client and provider before each test
     */
    beforeAll(async () => {
        const awsCredentialsPath = path.resolve(
            __dirname,
            './aws-credentials.json'
        );
        let awsClientParameters: AwsClientParameters;
        try {
            awsClientParameters = JSON.parse(
                fs.readFileSync(awsCredentialsPath, 'utf8')
            ) as AwsClientParameters;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            console.log('Loading test credentials');
            const testAwsCredentialsPath = path.resolve(
                __dirname,
                './test-aws-credentials.json'
            );
            awsClientParameters = JSON.parse(
                fs.readFileSync(testAwsCredentialsPath, 'utf8')
            ) as AwsClientParameters;
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
        signer = new KMSVeChainSigner(provider);
        // This step should be removed once this is clarified  https://github.com/localstack/localstack/issues/11678
        await fundVTHO(thorClient, signer);
    });

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
        test('should sign a transaction successfully', async () => {
            const sampleClause = Clause.callFunction(
                Address.of(TESTING_CONTRACT_ADDRESS),
                ABIContract.ofAbi(TESTING_CONTRACT_ABI).getFunction('deposit'),
                [123]
            ) as TransactionClause;

            const originAddress = await signer.getAddress();

            const gasResult = await thorClient.gas.estimateGas(
                [sampleClause],
                originAddress
            );

            const txBody = await thorClient.transactions.buildTransactionBody(
                [sampleClause],
                gasResult.totalGas,
                {
                    isDelegated: false
                }
            );

            const signedRawTx = await signer.signTransaction(
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
            const expectedBody = {
                chainTag: 246,
                clauses: [
                    {
                        data: '0xb6b55f25000000000000000000000000000000000000000000000000000000000000007b',
                        to: '0xb2c20a6de401003a671659b10629eb82ff254fb8',
                        value: 0
                    }
                ],
                dependsOn: null,
                expiration: 32,
                gas: 57491,
                gasPriceCoef: 0
            };
            expect(signedTx.body).toMatchObject(expectedBody);
            expect(signedTx.origin.toString()).toBe(
                Address.checksum(HexUInt.of(originAddress))
            );
            expect(signedTx.isDelegated).toBe(false);
            expect(signedTx.isSigned).toBe(true);
            expect(signedTx.signature).toBeDefined();
        }, 8000);
    });

    /**
     * Test suite for sendTransaction method
     */
    describe('sendTransaction', () => {
        test('should send a transaction successfully', async () => {
            const sampleClause = Clause.callFunction(
                Address.of(TESTING_CONTRACT_ADDRESS),
                ABIContract.ofAbi(TESTING_CONTRACT_ABI).getFunction('deposit'),
                [123]
            ) as TransactionClause;

            const originAddress = await signer.getAddress();

            const gasResult = await thorClient.gas.estimateGas(
                [sampleClause],
                originAddress
            );

            const txBody = await thorClient.transactions.buildTransactionBody(
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
        }, 8000);
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
                typedData.primaryType,
                typedData.data
            );
            expect(signature).toBeDefined();
            // 64-bytes hex string
            expect(signature.length).toBe(132);
        });
    });
});

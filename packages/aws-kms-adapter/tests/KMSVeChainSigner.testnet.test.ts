import {
    ABIContract,
    Address,
    Clause,
    HexUInt,
    Transaction,
    type TransactionClause
} from '@vechain/sdk-core';
import { signerUtils, TESTNET_URL, ThorClient } from '@vechain/sdk-network';
import fs from 'fs';
import path from 'path';
import {
    type KMSClientParameters,
    KMSVeChainProvider,
    KMSVeChainSigner
} from '../src';
import {
    addAddressToFeeDelegationWhitelist,
    removeAddressFromFeeDelegationWhitelist,
    signTransactionTestCases,
    TESTING_CONTRACT_ABI,
    TESTING_CONTRACT_ADDRESS,
    TESTNET_DELEGATE_URL,
    timeout
} from './fixture';

/**
 * AWS KMS VeChain signer tests - testnet
 *
 * @group integration/signers/vechain-aws-kms-signer-testnet
 */
describe('KMSVeChainSigner - Testnet', () => {
    /**
     * ThorClient and provider instances
     */
    let thorClient: ThorClient;

    /**
     * KMSVeChainSigner with gasPayer instance
     */
    let signerWithDelegator: KMSVeChainSigner;

    /**
     * Init thor client and provider before all tests
     */
    beforeAll(async () => {
        const awsCredentialsPath = path.resolve(
            __dirname,
            './aws-credentials.json'
        );
        let awsClientParameters: KMSClientParameters;
        try {
            [awsClientParameters] = JSON.parse(
                fs.readFileSync(awsCredentialsPath, 'utf8')
            ) as KMSClientParameters[];
        } catch (error) {
            console.log('Loading test credentials');
            const testAwsCredentialsPath = path.resolve(
                __dirname,
                './test-aws-credentials.json'
            );
            [awsClientParameters] = JSON.parse(
                fs.readFileSync(testAwsCredentialsPath, 'utf8')
            ) as KMSClientParameters[];
        }
        thorClient = ThorClient.at(TESTNET_URL);

        signerWithDelegator = new KMSVeChainSigner(
            new KMSVeChainProvider(thorClient, awsClientParameters, true),
            {
                url: TESTNET_DELEGATE_URL
            }
        );

        await addAddressToFeeDelegationWhitelist(
            thorClient,
            await signerWithDelegator.getAddress()
        );
    }, 4 * timeout);

    afterAll(async () => {
        await removeAddressFromFeeDelegationWhitelist(
            thorClient,
            await signerWithDelegator.getAddress()
        );
    }, 4 * timeout);

    describe('constructor', () => {
        test('should create a new instance of KMSVeChainSigner', () => {
            expect(() => new KMSVeChainSigner(undefined, {})).toThrow();
        });
    });

    /**
     * Test suite for signTransaction method
     */
    describe('signTransaction', () => {
        /**
         * signTransaction test cases with different options
         */
        signTransactionTestCases.testnet.correct.forEach(
            ({ description, isDelegated, expected }) => {
                test(
                    description,
                    async () => {
                        const sampleClause = Clause.callFunction(
                            Address.of(TESTING_CONTRACT_ADDRESS),
                            ABIContract.ofAbi(TESTING_CONTRACT_ABI).getFunction(
                                'deposit'
                            ),
                            [123]
                        ) as TransactionClause;

                        const originAddress =
                            await signerWithDelegator.getAddress();

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
                            await signerWithDelegator.signTransaction(
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
});

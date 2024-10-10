import {
    ABIContract,
    Address,
    Clause,
    HexUInt,
    Transaction,
    type TransactionClause
} from '@vechain/sdk-core';
import { signerUtils, THOR_SOLO_URL, ThorClient } from '@vechain/sdk-network';
import { KMSVeChainProvider, KMSVeChainSigner } from '../src';
import { TESTING_CONTRACT_ABI, TESTING_CONTRACT_ADDRESS } from './fixture';

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
    beforeAll(() => {
        thorClient = ThorClient.fromUrl(THOR_SOLO_URL);
        const provider = new KMSVeChainProvider(thorClient, '', 'eu-west-1', {
            accessKeyId: '',
            secretAccessKey: '',
            sessionToken: ''
        });
        expect(provider).toBeInstanceOf(KMSVeChainProvider);
        signer = new KMSVeChainSigner(provider);
    });

    describe('getAddress', () => {
        test('should get the address from the public key', async () => {
            expect(signer).toBeInstanceOf(KMSVeChainSigner);
            expect(await signer.getAddress()).toBe(
                '0x3db469a79593dcc67f07DE1869d6682fC1eaf535'
            );
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
     * Test suite for sendTransaction method
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
});

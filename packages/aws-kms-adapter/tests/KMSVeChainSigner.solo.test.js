"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sdk_core_1 = require("@vechain/sdk-core");
const sdk_network_1 = require("@vechain/sdk-network");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const src_1 = require("../src");
const fixture_1 = require("./fixture");
const dummy_data_1 = require("./dummy_data");
// This variable should be replaced once this is clarified  https://github.com/localstack/localstack/issues/11678
let expectedAddress;
/**
 * AWS KMS VeChain signer tests - solo
 *
 * @group integration/signers/vechain-aws-kms-signer-solo
 */
describe('KMSVeChainSigner - Thor Solo', () => {
    /**
     * ThorClient and provider instances
     */
    let thorClient;
    /**
     * KMSVeChainSigner instance
     */
    let signer;
    /**
     * KMSVeChainSigner with gasPayer instance
     */
    let signerWithGasPayer;
    /**
     * Init thor client and provider before all tests
     */
    beforeAll(async () => {
        const awsCredentialsPath = path_1.default.resolve(__dirname, './aws-credentials.json');
        let awsClientParameters;
        let gasPayerAwsClientParameters;
        try {
            [awsClientParameters, gasPayerAwsClientParameters] = JSON.parse(fs_1.default.readFileSync(awsCredentialsPath, 'utf8'));
        }
        catch {
            console.log('Loading test credentials');
            const testAwsCredentialsPath = path_1.default.resolve(__dirname, './test-aws-credentials.json');
            [awsClientParameters, gasPayerAwsClientParameters] = JSON.parse(fs_1.default.readFileSync(testAwsCredentialsPath, 'utf8'));
        }
        thorClient = sdk_network_1.ThorClient.at(sdk_network_1.THOR_SOLO_URL);
        // Signer with gasPayer disabled
        signer = new src_1.KMSVeChainSigner(new src_1.KMSVeChainProvider(thorClient, awsClientParameters));
        expectedAddress = await signer.getAddress();
        // This step should be removed once this is clarified  https://github.com/localstack/localstack/issues/11678
        await (0, fixture_1.fundVTHO)(thorClient, expectedAddress);
        // Signer with gasPayer enabled
        const gasPayerProvider = new src_1.KMSVeChainProvider(thorClient, gasPayerAwsClientParameters);
        expect(gasPayerProvider).toBeInstanceOf(src_1.KMSVeChainProvider);
        signerWithGasPayer = new src_1.KMSVeChainSigner(new src_1.KMSVeChainProvider(thorClient, awsClientParameters, true), {
            provider: gasPayerProvider
        });
        // This step should be removed once this is clarified  https://github.com/localstack/localstack/issues/11678
        await (0, fixture_1.fundVTHO)(thorClient, await signerWithGasPayer.getAddress(true));
    }, fixture_1.timeout);
    describe('getAddress', () => {
        test('should get the address from the public key', async () => {
            expect(signer).toBeInstanceOf(src_1.KMSVeChainSigner);
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
        fixture_1.signTransactionTestCases.solo.correct.forEach(({ description, isDelegated, expected }) => {
            test(description, async () => {
                const signTransactionSigner = isDelegated
                    ? signerWithGasPayer
                    : signer;
                const sampleClause = sdk_core_1.Clause.callFunction(sdk_core_1.Address.of(fixture_1.SOLO_CONTRACT_ADDRESS), sdk_core_1.ABIContract.ofAbi(fixture_1.TESTING_CONTRACT_ABI).getFunction('deposit'), [123]);
                const originAddress = await signTransactionSigner.getAddress();
                const gasResult = await thorClient.transactions.estimateGas([sampleClause], originAddress);
                const txBody = await thorClient.transactions.buildTransactionBody([sampleClause], gasResult.totalGas, {
                    isDelegated
                });
                const signedRawTx = await signTransactionSigner.signTransaction(sdk_network_1.signerUtils.transactionBodyToTransactionRequestInput(txBody, originAddress));
                const signedTx = sdk_core_1.Transaction.decode(sdk_core_1.HexUInt.of(signedRawTx.slice(2)).bytes, true);
                expect(signedTx).toBeDefined();
                expect(signedTx.body).toMatchObject(expected.body);
                expect(signedTx.origin.toString()).toBe(sdk_core_1.Address.checksum(sdk_core_1.HexUInt.of(originAddress)));
                expect(signedTx.isDelegated).toBe(isDelegated);
                expect(signedTx.isSigned).toBe(true);
                expect(signedTx.signature).toBeDefined();
                // dynamic fee default
                const galacticaForked = await thorClient.forkDetector.isGalacticaForked();
                if (galacticaForked) {
                    expect(signedTx.body.maxFeePerGas).toBeDefined();
                    expect(signedTx.body.maxPriorityFeePerGas).toBeDefined();
                }
                else {
                    expect(signedTx.body.gas).toBeDefined();
                }
            }, fixture_1.timeout);
        });
    });
    /**
     * Test suite for sendTransaction method
     */
    describe('sendTransaction', () => {
        /**
         * sendTransaction test cases with different options
         */
        fixture_1.signTransactionTestCases.solo.correct.forEach(({ description, isDelegated }) => {
            test(description, async () => {
                const signTransactionSigner = isDelegated
                    ? signerWithGasPayer
                    : signer;
                const sampleClause = sdk_core_1.Clause.callFunction(sdk_core_1.Address.of(fixture_1.SOLO_CONTRACT_ADDRESS), sdk_core_1.ABIContract.ofAbi(fixture_1.TESTING_CONTRACT_ABI).getFunction('deposit'), [123]);
                const originAddress = await signTransactionSigner.getAddress();
                const gasResult = await thorClient.transactions.estimateGas([sampleClause], originAddress);
                const txBody = await thorClient.transactions.buildTransactionBody([sampleClause], gasResult.totalGas, {
                    isDelegated
                });
                const receipt = await signTransactionSigner.sendTransaction(sdk_network_1.signerUtils.transactionBodyToTransactionRequestInput(txBody, originAddress));
                expect(/^0x([A-Fa-f0-9]{64})$/.exec(receipt)).toBeTruthy();
            }, fixture_1.timeout);
        });
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
                    verifyingContract: dummy_data_1.EIP712_CONTRACT
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
                        wallet: dummy_data_1.EIP712_FROM
                    },
                    to: {
                        name: 'Bob',
                        wallet: dummy_data_1.EIP712_TO
                    },
                    contents: 'Hello, Bob!'
                }
            };
            const signature = await signer.signTypedData(typedData.domain, typedData.types, typedData.data, typedData.primaryType);
            expect(signature).toBeDefined();
            // 64-bytes hex string
            expect(signature).toMatch(/^0x[A-Fa-f0-9]{130}$/);
            const signatureWithoutPrimaryType = await signer.signTypedData(typedData.domain, typedData.types, typedData.data);
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

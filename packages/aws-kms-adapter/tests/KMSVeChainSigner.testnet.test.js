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
/**
 * AWS KMS VeChain signer tests - testnet
 *
 * @group integration/signers/vechain-aws-kms-signer-testnet
 */
describe('KMSVeChainSigner - Testnet', () => {
    /**
     * ThorClient and provider instances
     */
    let thorClient;
    /**
     * KMSVeChainSigner with gasPayer instance
     */
    let signerWithGasPayer;
    /**
     * Init thor client and provider before all tests
     */
    beforeAll(() => {
        const awsCredentialsPath = path_1.default.resolve(__dirname, './aws-credentials.json');
        let awsClientParameters;
        try {
            [awsClientParameters] = JSON.parse(fs_1.default.readFileSync(awsCredentialsPath, 'utf8'));
        }
        catch {
            console.log('Loading test credentials');
            const testAwsCredentialsPath = path_1.default.resolve(__dirname, './test-aws-credentials.json');
            [awsClientParameters] = JSON.parse(fs_1.default.readFileSync(testAwsCredentialsPath, 'utf8'));
        }
        thorClient = sdk_network_1.ThorClient.at(sdk_network_1.TESTNET_URL);
        signerWithGasPayer = new src_1.KMSVeChainSigner(new src_1.KMSVeChainProvider(thorClient, awsClientParameters, true), {
            url: fixture_1.TESTNET_DELEGATE_URL
        });
    }, 4 * fixture_1.timeout);
    describe('constructor', () => {
        test('should create a new instance of KMSVeChainSigner', () => {
            expect(() => new src_1.KMSVeChainSigner(undefined, {})).toThrow();
        });
    });
    /**
     * Test suite for signTransaction method
     */
    describe('signTransaction', () => {
        /**
         * signTransaction test cases with different options
         */
        fixture_1.signTransactionTestCases.testnet.correct.forEach(({ description, isDelegated, expected }) => {
            test(description, async () => {
                const sampleClause = sdk_core_1.Clause.callFunction(sdk_core_1.Address.of(fixture_1.TESTNET_CONTRACT_ADDRESS), sdk_core_1.ABIContract.ofAbi(fixture_1.TESTING_CONTRACT_ABI).getFunction('deposit'), [123]);
                const originAddress = await signerWithGasPayer.getAddress();
                const gasResult = await thorClient.transactions.estimateGas([sampleClause], originAddress);
                const txBody = await thorClient.transactions.buildTransactionBody([sampleClause], gasResult.totalGas, {
                    isDelegated
                });
                const signedRawTx = await signerWithGasPayer.signTransaction(sdk_network_1.signerUtils.transactionBodyToTransactionRequestInput(txBody, originAddress));
                const signedTx = sdk_core_1.Transaction.decode(sdk_core_1.HexUInt.of(signedRawTx.slice(2)).bytes, true);
                expect(signedTx).toBeDefined();
                expect(signedTx.body).toMatchObject(expected.body);
                expect(signedTx.origin.toString()).toBe(sdk_core_1.Address.checksum(sdk_core_1.HexUInt.of(originAddress)));
                expect(signedTx.isDelegated).toBe(isDelegated);
                expect(signedTx.isSigned).toBe(true);
                expect(signedTx.signature).toBeDefined();
            }, fixture_1.timeout);
        });
    });
});

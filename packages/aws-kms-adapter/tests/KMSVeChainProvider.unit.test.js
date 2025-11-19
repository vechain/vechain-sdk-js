"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_kms_1 = require("@aws-sdk/client-kms");
const sdk_errors_1 = require("@vechain/sdk-errors");
const src_1 = require("../src");
jest.mock('@aws-sdk/client-kms', () => ({
    GetPublicKeyCommand: jest.fn(),
    SignCommand: jest.fn(),
    MessageType: jest.fn(),
    SigningAlgorithmSpec: jest.fn(),
    KMSClient: jest.fn().mockImplementation(() => ({
        send: jest.fn().mockImplementation(async (command) => {
            if (command instanceof client_kms_1.GetPublicKeyCommand) {
                return await Promise.resolve({
                    PublicKey: undefined
                });
            }
            if (command instanceof client_kms_1.SignCommand) {
                return await Promise.resolve({
                    Signature: undefined
                });
            }
            return await Promise.reject(new Error('Unknown command'));
        })
    }))
}));
/**
 * AWS KMS VeChain provider tests - unit
 *
 * @group unit/providers/vechain-aws-kms-provider
 */
describe('KMSVeChainProvider', () => {
    let instance;
    beforeEach(() => {
        jest.clearAllMocks();
        instance = new src_1.KMSVeChainProvider({}, {
            keyId: 'keyId',
            region: 'region'
        });
    });
    describe('constructor', () => {
        it('should return the instance of the client', () => {
            expect(instance).toBeInstanceOf(src_1.KMSVeChainProvider);
        });
        it('should return an instance when credentials and no endpoint', () => {
            const instance = new src_1.KMSVeChainProvider({}, {
                keyId: 'keyId',
                region: 'region',
                credentials: {
                    accessKeyId: 'accessKeyId',
                    secretAccessKey: 'secretAccess'
                }
            });
            expect(instance).toBeInstanceOf(src_1.KMSVeChainProvider);
        });
    });
    describe('getSigner', () => {
        it('should return the instance of the signer', async () => {
            const signer = await instance.getSigner();
            expect(signer).toBeDefined();
            expect(signer).toBe(await instance.getSigner());
        });
    });
    describe('getPublicKey', () => {
        it('should throw an error', async () => {
            await expect(instance.getPublicKey()).rejects.toThrow(sdk_errors_1.ProviderMethodError);
        });
    });
    describe('sign', () => {
        it('should throw an error', async () => {
            await expect(instance.sign(new Uint8Array([]))).rejects.toThrow(sdk_errors_1.ProviderMethodError);
        });
    });
});

import { GetPublicKeyCommand, SignCommand } from '@aws-sdk/client-kms';
import { ProviderMethodError } from '@vechain/sdk-errors';
import { type ThorClient } from '@vechain/sdk-network';
import { KMSVeChainProvider } from '../src';
jest.mock('@aws-sdk/client-kms', () => ({
    GetPublicKeyCommand: jest.fn(),
    SignCommand: jest.fn(),
    MessageType: jest.fn(),
    SigningAlgorithmSpec: jest.fn(),
    KMSClient: jest.fn().mockImplementation(() => ({
        send: jest.fn().mockImplementation(async (command) => {
            if (command instanceof GetPublicKeyCommand) {
                return await Promise.resolve({
                    PublicKey: undefined
                });
            }
            if (command instanceof SignCommand) {
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
    let instance: KMSVeChainProvider;
    beforeEach(() => {
        jest.clearAllMocks();
        instance = new KMSVeChainProvider(
            {} as unknown as ThorClient,
            'keyId',
            'region'
        );
    });
    describe('constructor', () => {
        it('should return the instance of the client', () => {
            expect(instance).toBeInstanceOf(KMSVeChainProvider);
        });
        it('should return an instance when credentials and no endpoint', () => {
            const instance = new KMSVeChainProvider(
                {} as unknown as ThorClient,
                'keyId',
                'region',
                false,
                {
                    accessKeyId: 'accessKeyId',
                    secretAccessKey: 'secretAccess'
                }
            );
            expect(instance).toBeInstanceOf(KMSVeChainProvider);
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
            await expect(instance.getPublicKey()).rejects.toThrow(
                ProviderMethodError
            );
        });
    });
    describe('sign', () => {
        it('should throw an error', async () => {
            await expect(instance.sign(new Uint8Array([]))).rejects.toThrow(
                ProviderMethodError
            );
        });
    });
});

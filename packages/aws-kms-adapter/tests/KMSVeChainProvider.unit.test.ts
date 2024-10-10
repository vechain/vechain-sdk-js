import { type ThorClient } from '@vechain/sdk-network';
import { KMSVeChainProvider } from '../src';

/**
 * AWS KMS VeChain provider tests - unit
 *
 * @group unit/providers/vechain-aws-kms-provider
 */
describe('KMSVeChainProvider', () => {
    describe('constructor', () => {
        it('should return the instance of the client', () => {
            const instance = new KMSVeChainProvider(
                {} as unknown as ThorClient,
                'keyId',
                'region'
            );
            expect(instance).toBeInstanceOf(KMSVeChainProvider);
        });
    });
    describe('getSigner', () => {
        it('should return the instance of the signer', async () => {
            const instance = new KMSVeChainProvider(
                {} as unknown as ThorClient,
                'keyId',
                'region'
            );
            const signer = await instance.getSigner();
            expect(signer).toBeDefined();
        });
    });
});

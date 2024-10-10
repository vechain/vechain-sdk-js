import { THOR_SOLO_URL, ThorClient } from '@vechain/sdk-network';
import { KMSVeChainProvider, KMSVeChainSigner } from '../src';

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
            expect(await signer.getAddress()).toBe('');
        });
    });
});

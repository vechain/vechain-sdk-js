import { THOR_SOLO_URL, ThorClient } from '@vechain/sdk-network';
import { KMSVeChainProvider, KMSVeChainSigner } from '../src';

/**
 * AWS KMS VeChain signer tests - solo
 *
 * @group integration/signers/vechain-aws-kms-signer-solo
 */
describe('KMSVeChainSigner', () => {
    /**
     * ThorClient and provider instances
     */
    let thorClient: ThorClient;

    /**
     * Init thor client and provider before each test
     */
    beforeEach(() => {
        thorClient = ThorClient.fromUrl(THOR_SOLO_URL);
    });

    describe('constructor', () => {
        test('should create a new instance of KMSVeChainSigner', () => {
            const provider = new KMSVeChainProvider(
                thorClient,
                '',
                'eu-west-1',
                {
                    accessKeyId: 'accessKeyId',
                    secretAccessKey: 'secretAccess',
                    sessionToken: ''
                }
            );
            expect(provider).toBeInstanceOf(KMSVeChainProvider);
            const signer = new KMSVeChainSigner(provider);
            expect(signer).toBeInstanceOf(KMSVeChainSigner);
        });
    });
});

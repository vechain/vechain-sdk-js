import {
    GetPublicKeyCommand,
    KMSClient,
    MessageType,
    SignCommand,
    SigningAlgorithmSpec
} from '@aws-sdk/client-kms';
import { ProviderMethodError } from '@vechain/sdk-errors';
import {
    type ThorClient,
    VeChainProvider,
    type VeChainSigner
} from '@vechain/sdk-network';
import { KMSVeChainSigner } from './KMSVeChainSigner';

class KMSVeChainProvider extends VeChainProvider {
    private readonly kmsClient: KMSClient;
    private signer?: KMSVeChainSigner;
    private delegatorSigner?: KMSVeChainSigner;

    /**
     * Creates a new instance of KMSVeChainProvider.
     * @param thorClient The thor client instance to use.
     * @param keyId The AWS keyId to use for signing operations locally.
     * @param region The AWS region to use.
     * @param endpoint The AWS endpoint to use (locally).
     * @param credentials The AWS credentials to connect to the KMS service.
     * @param delegator The delegator configuration to use.
     **/
    public constructor(
        thorClient: ThorClient,
        private readonly keyId: string,
        region: string,
        endpoint?: string,
        credentials?: {
            accessKeyId: string;
            secretAccessKey: string;
            sessionToken?: string;
        },
        readonly delegator?: {
            url?: string;
            keyId?: string;
        }
    ) {
        super(thorClient);
        this.kmsClient =
            endpoint !== undefined
                ? new KMSClient({
                      region,
                      endpoint,
                      credentials
                  })
                : credentials !== undefined
                  ? new KMSClient({ region, credentials })
                  : new KMSClient({ region });
    }

    /**
     * Returns a new instance of the KMSVeChainSigner using this provider configuration.
     * @param addressOrIndex Parameter with the keyId of either the origin or the delegator.
     * @returns {KMSVeChainSigner} An instance of KMSVeChainSigner
     */
    public override async getSigner(
        addressOrIndex: string
    ): Promise<VeChainSigner | null> {
        if (addressOrIndex === this.keyId) {
            if (this.signer !== undefined) {
                return this.signer;
            }
            this.signer = new KMSVeChainSigner(this);
            return await Promise.resolve(this.signer);
        } else if (addressOrIndex === this.delegator?.keyId) {
            if (this.delegatorSigner !== undefined) {
                return this.delegatorSigner;
            }
            this.delegatorSigner = new KMSVeChainSigner(this);
            return await Promise.resolve(this.delegatorSigner);
        }
        return null;
    }

    /**
     * Returns the public key associated with the keyId provided in
     * the constructor.
     * @returns {Uint8Array} The public key associated with the keyId
     */
    public async getOriginPublicKey(): Promise<Uint8Array> {
        return await this.getPublicKey(this.keyId);
    }

    /**
     * Returns the public key associated with the delegator keyId
     * provided in the constructor.
     * @returns {Uint8Array} The public key associated with the delegator keyId
     */
    public async getDelegatorPublicKey(): Promise<Uint8Array> {
        return await this.getPublicKey(this.delegator?.keyId);
    }

    /**
     * Returns the public key associated with the keyId provided in the constructor.
     * @param {string} keyId The keyId to retrieve
     * @returns {Uint8Array} The public key associated with the keyId
     */
    private async getPublicKey(keyId?: string): Promise<Uint8Array> {
        const getPublicKeyCommand = new GetPublicKeyCommand({
            KeyId: keyId
        });
        const getPublicKeyOutput =
            await this.kmsClient.send(getPublicKeyCommand);

        if (getPublicKeyOutput.PublicKey === undefined) {
            throw new ProviderMethodError(
                'KMSVeChainProvider.getPublicKey',
                'The public key could not be retrieved.',
                { getPublicKeyOutput }
            );
        }
        return getPublicKeyOutput.PublicKey;
    }

    public async signWithOrigin(message: Uint8Array): Promise<Uint8Array> {
        return await this.sign(message, this.keyId);
    }

    public async signWithDelegator(message: Uint8Array): Promise<Uint8Array> {
        return await this.sign(message, this.delegator?.keyId);
    }

    /**
     * Performs a sign operation using the keyId provided in the constructor.
     * @param {Uint8Array} message Message to sign using KMS
     * @returns {Uint8Array} The signature of the message
     */
    private async sign(
        message: Uint8Array,
        keyId?: string
    ): Promise<Uint8Array> {
        const command = new SignCommand({
            KeyId: keyId,
            Message: message,
            SigningAlgorithm: SigningAlgorithmSpec.ECDSA_SHA_256,
            MessageType: MessageType.DIGEST
        });

        const signOutput = await this.kmsClient.send(command);

        if (signOutput.Signature === undefined) {
            throw new ProviderMethodError(
                'KMSVeChainProvider.sign',
                'The signature could not be generated.',
                { signOutput }
            );
        }

        return signOutput.Signature;
    }
}

export { KMSVeChainProvider };

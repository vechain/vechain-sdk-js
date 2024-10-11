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
    private readonly keyId: string;
    private signer?: KMSVeChainSigner;

    /**
     * Creates a new instance of KMSVeChainProvider.
     * @param thorClient The thor client instance to use.
     * @param keyId The AWS keyId to use for signing operations locally.
     * @param region The AWS region to use.
     * @param credentials The AWS credentials to connect to the KMS service.
     **/
    public constructor(
        thorClient: ThorClient,
        keyId: string,
        region: string,
        credentials?: {
            accessKeyId: string;
            secretAccessKey: string;
            sessionToken?: string;
        }
    ) {
        super(thorClient);
        this.keyId = keyId;
        this.kmsClient =
            credentials !== undefined
                ? new KMSClient({
                      region,
                      credentials
                  })
                : new KMSClient({ region });
    }

    /**
     * Returns a new instance of the KMSVeChainSigner using this provider configuration.
     * @param _addressOrIndex Unused parameter, will always return the signer associated to the keyId
     * @returns {KMSVeChainSigner} An instance of KMSVeChainSigner
     */
    public override async getSigner(
        _addressOrIndex?: string | number
    ): Promise<VeChainSigner | null> {
        if (this.signer !== undefined) {
            return this.signer;
        }
        this.signer = new KMSVeChainSigner(this);
        return await Promise.resolve(this.signer);
    }

    /**
     * Returns the public key associated with the keyId provided in the constructor.
     * @returns {Uint8Array} The public key associated with the keyId
     */
    public async getPublicKey(): Promise<Uint8Array> {
        const getPublicKeyCommand = new GetPublicKeyCommand({
            KeyId: this.keyId
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

    /**
     * Performs a sign operation using the keyId provided in the constructor.
     * @param {Uint8Array} message Message to sign using KMS
     * @returns {Uint8Array} The signature of the message
     */
    public async sign(message: Uint8Array): Promise<Uint8Array> {
        const command = new SignCommand({
            KeyId: this.keyId,
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

import {
    GetPublicKeyCommand,
    KMSClient,
    MessageType,
    SignCommand,
    SigningAlgorithmSpec
} from '@aws-sdk/client-kms';
import {
    type ThorClient,
    VeChainProvider,
    type VeChainSigner
} from '@vechain/sdk-network';
import { KMSVeChainSigner } from './KMSVeChainSigner';

class KMSVeChainProvider extends VeChainProvider {
    private readonly kmsClient: KMSClient;
    private readonly keyId?: string;

    /**
     * Creates a new instance of KMSVeChainProvider.
     * @param thorClient The thor client instance to use.
     * @param region The AWS region to use.
     * @param keyId The AWS keyId to use for signing operations locally.
     * @param secretKey The AWS secretKey to use for signing operations locally.
     **/
    public constructor(
        thorClient: ThorClient,
        region: string,
        credentials?: {
            accessKeyId: string;
            secretAccessKey: string;
            sessionToken: string;
        }
    ) {
        super(thorClient);
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
        return await Promise.resolve(new KMSVeChainSigner(this));
    }

    /**
     * Returns the public key associated with the keyId provided in the constructor.
     * @returns {Uint8Array | undefined} The public key associated with the keyId
     */
    public async getPublicKey(): Promise<Uint8Array | undefined> {
        const getPublicKeyCommand = new GetPublicKeyCommand({
            KeyId: this.keyId
        });
        const getPublicKeyOutput =
            await this.kmsClient.send(getPublicKeyCommand);
        return getPublicKeyOutput.PublicKey;
    }

    /**
     * Performs a sign operation using the keyId provided in the constructor.
     * @param {Uint8Array} message Message to sign using KMS
     * @returns {Uint8Array | undefined} The signature of the message
     */
    public async sign(message: Uint8Array): Promise<Uint8Array | undefined> {
        const command = new SignCommand({
            KeyId: this.keyId,
            Message: message,
            SigningAlgorithm: SigningAlgorithmSpec.ECDSA_SHA_256,
            MessageType: MessageType.DIGEST
        });

        const signOutput = await this.kmsClient.send(command);

        return signOutput.Signature;
    }
}

export { KMSVeChainProvider };

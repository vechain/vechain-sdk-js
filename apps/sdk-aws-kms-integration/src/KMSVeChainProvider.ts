import {
    GetPublicKeyCommand,
    KMSClient,
    SignCommand
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

    public constructor(
        thorClient: ThorClient,
        region: string,
        keyId?: string,
        secretKey?: string
    ) {
        super(thorClient);
        this.kmsClient =
            keyId != null &&
            keyId !== '' &&
            secretKey != null &&
            secretKey !== ''
                ? new KMSClient({
                      region,
                      credentials: {
                          accessKeyId: keyId,
                          secretAccessKey: secretKey
                      }
                  })
                : new KMSClient({ region });
    }

    public override async getSigner(
        _addressOrIndex?: string | number
    ): Promise<VeChainSigner | null> {
        // TODO: review this
        return await Promise.resolve(new KMSVeChainSigner(this));
    }

    public async getPublicKey(): Promise<Uint8Array | undefined> {
        const getPublicKeyCommand = new GetPublicKeyCommand({
            KeyId: this.keyId
        });
        const getPublicKeyOutput =
            await this.kmsClient.send(getPublicKeyCommand);
        return getPublicKeyOutput.PublicKey;
    }

    public async sign(message: Uint8Array): Promise<Uint8Array | undefined> {
        const command = new SignCommand({
            KeyId: this.keyId,
            Message: message,
            SigningAlgorithm: 'ECDSA_SHA_256',
            MessageType: 'DIGEST'
        });

        const signOutput = await this.kmsClient.send(command);

        return signOutput.Signature;
    }
}

export { KMSVeChainProvider };

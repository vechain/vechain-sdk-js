import { type ThorClient, VeChainProvider, type VeChainSigner } from '@vechain/sdk-network';
interface KMSClientParameters {
    keyId: string;
    region: string;
    credentials?: {
        accessKeyId: string;
        secretAccessKey: string;
        sessionToken?: string;
    };
    endpoint?: string;
}
declare class KMSVeChainProvider extends VeChainProvider {
    private readonly kmsClient;
    private readonly keyId;
    private signer?;
    /**
     * Creates a new instance of KMSVeChainProvider.
     * @param thorClient The thor client instance to use.
     * @param params The parameters to configure the KMS client and the keyId.
     * @param enableDelegation Whether to enable delegation or not.
     **/
    constructor(thorClient: ThorClient, params: KMSClientParameters, enableDelegation?: boolean);
    /**
     * Returns a new instance of the KMSVeChainSigner using this provider configuration.
     * @param _addressOrIndex Unused parameter, will always return the signer associated to the keyId
     * @returns {KMSVeChainSigner} An instance of KMSVeChainSigner
     */
    getSigner(_addressOrIndex?: string | number): Promise<VeChainSigner | null>;
    /**
     * Returns the public key associated with the keyId provided in the constructor.
     * @returns {Uint8Array} The public key associated with the keyId
     */
    getPublicKey(): Promise<Uint8Array>;
    /**
     * Performs a sign operation using the keyId provided in the constructor.
     * @param {Uint8Array} message Message to sign using KMS
     * @returns {Uint8Array} The signature of the message
     */
    sign(message: Uint8Array): Promise<Uint8Array>;
}
export { KMSVeChainProvider, type KMSClientParameters };
//# sourceMappingURL=KMSVeChainProvider.d.ts.map
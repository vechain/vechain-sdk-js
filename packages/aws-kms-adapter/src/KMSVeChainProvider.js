"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KMSVeChainProvider = void 0;
const client_kms_1 = require("@aws-sdk/client-kms");
const sdk_errors_1 = require("@vechain/sdk-errors");
const sdk_network_1 = require("@vechain/sdk-network");
const KMSVeChainSigner_1 = require("./KMSVeChainSigner");
class KMSVeChainProvider extends sdk_network_1.VeChainProvider {
    kmsClient;
    keyId;
    signer;
    /**
     * Creates a new instance of KMSVeChainProvider.
     * @param thorClient The thor client instance to use.
     * @param params The parameters to configure the KMS client and the keyId.
     * @param enableDelegation Whether to enable delegation or not.
     **/
    constructor(thorClient, params, enableDelegation = false) {
        super(thorClient, undefined, enableDelegation);
        this.keyId = params.keyId;
        this.kmsClient =
            params.endpoint !== undefined
                ? new client_kms_1.KMSClient({
                    region: params.region,
                    endpoint: params.endpoint,
                    credentials: params.credentials
                })
                : params.credentials !== undefined
                    ? new client_kms_1.KMSClient({
                        region: params.region,
                        credentials: params.credentials
                    })
                    : new client_kms_1.KMSClient({ region: params.region });
    }
    /**
     * Returns a new instance of the KMSVeChainSigner using this provider configuration.
     * @param _addressOrIndex Unused parameter, will always return the signer associated to the keyId
     * @returns {KMSVeChainSigner} An instance of KMSVeChainSigner
     */
    async getSigner(_addressOrIndex) {
        if (this.signer !== undefined) {
            return this.signer;
        }
        this.signer = new KMSVeChainSigner_1.KMSVeChainSigner(this);
        return await Promise.resolve(this.signer);
    }
    /**
     * Returns the public key associated with the keyId provided in the constructor.
     * @returns {Uint8Array} The public key associated with the keyId
     */
    async getPublicKey() {
        const getPublicKeyCommand = new client_kms_1.GetPublicKeyCommand({
            KeyId: this.keyId
        });
        const getPublicKeyOutput = await this.kmsClient.send(getPublicKeyCommand);
        if (getPublicKeyOutput.PublicKey === undefined) {
            throw new sdk_errors_1.ProviderMethodError('KMSVeChainProvider.getPublicKey', 'The public key could not be retrieved.', { getPublicKeyOutput });
        }
        return getPublicKeyOutput.PublicKey;
    }
    /**
     * Performs a sign operation using the keyId provided in the constructor.
     * @param {Uint8Array} message Message to sign using KMS
     * @returns {Uint8Array} The signature of the message
     */
    async sign(message) {
        const command = new client_kms_1.SignCommand({
            KeyId: this.keyId,
            Message: message,
            SigningAlgorithm: client_kms_1.SigningAlgorithmSpec.ECDSA_SHA_256,
            MessageType: client_kms_1.MessageType.DIGEST
        });
        const signOutput = await this.kmsClient.send(command);
        if (signOutput.Signature === undefined) {
            throw new sdk_errors_1.ProviderMethodError('KMSVeChainProvider.sign', 'The signature could not be generated.', { signOutput });
        }
        return signOutput.Signature;
    }
}
exports.KMSVeChainProvider = KMSVeChainProvider;

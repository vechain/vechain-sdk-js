/**
 * Error messages
 */
const ERRORS = {
    /**
     * Secp256k1 error messages
     */
    SECP256K1: {
        INVALID_PRIVATE_KEY: 'Invalid private key',
        INVALID_MESSAGE_HASH: 'Invalid message hash',
        INVALID_SIGNATURE: 'Invalid signature',
        INVALID_SIGNATURE_RECOVERY: 'Invalid signature recovery'
    },

    /**
     * Address error messages
     */
    ADDRESS: {
        INVALID_ADDRESS: 'Invalid address',
        INVALID_CHECKSUM: 'Invalid checksum'
    },

    /**
     * Keystore error messages
     */
    KEYSTORE: {
        INVALID_KEYSTORE: 'Invalid keystore',
        INVALID_PASSWORD: 'Invalid password'
    },

    /**
     * HDNode error messages
     */
    HDNODE: {
        INVALID_PUBLICKEY: 'Invalid public key',
        INVALID_PRIVATEKEY: 'Invalid private key',
        INVALID_CHAINCODE: 'Invalid chain code'
    }
};

export { ERRORS };

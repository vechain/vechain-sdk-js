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
        INVALID_CHAINCODE: 'Invalid chain code',
        INVALID_MNEMONICS: 'Invalid mnemonics'
    },

    /**
     * Bloom filter error messages
     */
    BLOOM: {
        INVALID_BLOOM:
            'Invalid Bloom filter format. Bloom filters must adhere to the format 0x[0-9a-fA-F]{16,}.',
        INVALID_K: 'Invalid k. It should be a positive integer.'
    },

    /**
     * Data error messages
     */
    DATA: {
        INVALID_DATA_TYPE: function (format: string): string {
            return `Invalid data type. Data should be ${format}.`;
        }
    },

    /**
     * Abi error messages
     */
    ABI: {
        HIGH_LEVEL: {
            INVALID_FUNCTION: 'Invalid function',
            INVALID_EVENT: 'Invalid event',
            INVALID_DATA_TO_DECODE:
                'Invalid data to decode into function or event',
            INVALID_DATA_TO_ENCODE:
                'Invalid data to encode into function or event',
            INVALID_FORMAT_TYPE:
                "Invalid format type. Format type should be one of 'sighash', 'minimal', 'full', or 'json'."
        },
        LOW_LEVEL: {
            INVALID_DATA_TO_DECODE: 'Invalid data to decode',
            INVALID_DATA_TO_ENCODE: 'Invalid data to encode'
        }
    }
};

export { ERRORS };

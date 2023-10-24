/**
 * Collection of error messages grouped by domain.
 * @constant
 */
const ERRORS = {
    /**
     * Error messages related to Secp256k1 cryptographic operations.
     */
    SECP256K1: {
        INVALID_PRIVATE_KEY: 'Invalid private key',
        INVALID_MESSAGE_HASH: 'Invalid message hash',
        INVALID_SIGNATURE: 'Invalid signature',
        INVALID_SIGNATURE_RECOVERY: 'Invalid signature recovery'
    },

    /**
     * Error messages associated with Ethereum addresses.
     */
    ADDRESS: {
        INVALID_ADDRESS: 'Invalid address',
        INVALID_CHECKSUM: 'Invalid checksum'
    },

    /**
     * Error messages concerning operations with keystores.
     */
    KEYSTORE: {
        INVALID_KEYSTORE: 'Invalid keystore',
        INVALID_PASSWORD: 'Invalid password'
    },

    /**
     * Error messages pertaining to HDNode (Hierarchical Deterministic Node) operations.
     */
    HDNODE: {
        INVALID_PUBLICKEY: 'Invalid public key',
        INVALID_PRIVATEKEY: 'Invalid private key',
        INVALID_CHAINCODE: 'Invalid chain code',
        INVALID_MNEMONICS: 'Invalid mnemonics'
    },

    /**
     * Error messages associated with Bloom filters.
     */
    BLOOM: {
        INVALID_BLOOM:
            'Invalid Bloom filter format. Bloom filters must adhere to the format 0x[0-9a-fA-F]{16,}.',
        INVALID_K: 'Invalid k. It should be a positive integer.'
    },

    /**
     * Error messages related to data validations.
     */
    DATA: {
        /**
         * Error message for invalid data type
         * @param format - The expected data type
         * @returns The error message
         */
        INVALID_DATA_TYPE: function (format: string): string {
            return `Invalid data type. Data should be ${format}.`;
        },

        /**
         * Error message for invalid return type
         * @param format - The expected return type
         * @returns The error message
         */
        INVALID_RETURN_TYPE: function (format: string): string {
            return `Invalid return type. Return type should be ${format}.`;
        }
    },

    /**
     * Error messages corresponding to ABI (Application Binary Interface) operations, both high-level and low-level.
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
    },

    RLP: {
        /**
         * Error message for invalid RLP
         * @param context - The context of the error
         * @param message - The error message
         * @returns The error message
         */
        INVALID_RLP: function (context: string, message: string): string {
            return `${context}: ${message}`;
        }
    },

    /**
     * Error messages related to transactions.
     */
    TRANSACTION: {
        ALREADY_SIGN: 'Transaction is already signed',
        NOT_SIGNED: 'Transaction is not signed',
        INVALID_SIGNATURE: 'Invalid signature',
        NOT_DELEGATED: 'Transaction is not delegated',
        INVALID_SIGNATURE_PRIVATE_KEY: 'Invalid signature private key',
        INVALID_RESERVED_NOT_TRIMMED_FIELDS:
            'Invalid reserved field. Fields must be trimmed',
        INVALID_TRANSACTION_BODY: 'Invalid transaction body',
        DELEGATED: 'Transaction is delegated'
    }
};

export { ERRORS };

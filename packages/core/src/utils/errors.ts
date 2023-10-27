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
     * Error messages related to mnemonic operations.
     */
    MNEMONIC: {
        INVALID_MNEMONIC_SIZE:
            'Invalid mnemonic size. It must be 12, 15, 18, 21, or 24.'
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

/**
 * Collection of error messages grouped by domain.
 * @constant
 */
const ERRORS = {
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

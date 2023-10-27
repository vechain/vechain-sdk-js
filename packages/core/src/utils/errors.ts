/**
 * Collection of error messages grouped by domain.
 * @constant
 */
const ERRORS = {
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
    }
};

export { ERRORS };

/**
 * Represents boolean values in a hexadecimal format specific to Ethereum's context.
 * This enumeration is useful when interacting with Ethereum smart contracts where
 * boolean values are often represented as 256-bit integers.
 */
enum BOOLEAN {
    /**
     * Represents the boolean value `true` as a 256-bit hexadecimal.
     * Equivalent to the number 1, it is considered "truthy" in a boolean context.
     */
    True = '0x0000000000000000000000000000000000000000000000000000000000000001',

    /**
     * Represents the boolean value `false` as a 256-bit hexadecimal.
     * Equivalent to the number 0, it is considered "falsy" in a boolean context.
     */
    False = '0x0000000000000000000000000000000000000000000000000000000000000000'
}

/**
 * A collection of data types used in contracts.
 * Currently includes the BOOLEAN enum for representing Ethereum-specific boolean values.
 * This object can be extended to include more data types as needed for contracts.
 */
export const ContractDataType = {
    BOOLEAN
};

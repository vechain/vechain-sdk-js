import { type Address } from '../Address';
import { Units } from './Units';
/**
 * Represents a generic Token
 * A token has base units (e.g. wei) and display units
 * For example 1 VTHO (1 in display units) = 10^18 base units (wei)
 */
declare abstract class Token {
    /**
     * Base units to represent the token
     */
    abstract readonly units: Units;
    /**
     * Token name
     */
    abstract readonly name: string;
    /**
     * Token contract address
     */
    abstract readonly tokenAddress: Address;
    protected _valueWei: bigint;
    /**
     * Create a new instance
     */
    constructor();
    /**
     * Initilises the instance with a value
     * @param value Token value
     * @param valueUnits Units for the token value
     */
    protected initialize(value: bigint, valueUnits?: Units): void;
    /**
     * Converts provided value to the tokens base units value
     * @returns The value converted to tokens base units
     */
    private convertWeiToTokenUnits;
    /**
     * Get the token's value in base units.
     * @returns {bigint} Token value in base units
     */
    get value(): bigint;
    /**
     * Converts the base unit value to a human-readable string.
     */
    format(toUnits?: Units, displayDecimals?: number): string;
}
export { Token };
//# sourceMappingURL=Token.d.ts.map
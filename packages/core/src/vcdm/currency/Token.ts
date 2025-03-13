import { type Address } from '../Address';
import { type Units } from './Units';

/**
 * Represents a generic Token
 * A token has base units (e.g. wei) and display units
 * For example 1 VTHO (1 in display units) = 10^18 base units
 * @extends Coin
 */
abstract class Token {
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

    // Store the token's value in its base units
    protected _value: bigint;

    /**
     * Create a new instance
     * @param {bigint} value Base units value
     */
    constructor(value: bigint) {
        this._value = value;
    }

    /**
     * Get the token's value in base units.
     * @returns {bigint} Token value in base units
     */
    public get value(): bigint {
        return this._value;
    }

    /**
     * Converts the base unit value to a human-readable string.
     * If `displayDecimals` is provided the value is rounded to that number of decimals
     * Otherwise, it falls back to the token's inherent `units`.
     * @param {number} displayDecimals Number of decimal places to round to
     */
    public convertToHumanReadable(displayDecimals?: number): string {
        const divisor = 10n ** BigInt(this.units);
        const whole = this._value / divisor;
        const fraction = this._value % divisor;
        const decimal = Number(`${whole}.${fraction}`);
        const result =
            displayDecimals === undefined
                ? decimal.toFixed(this.units)
                : decimal.toFixed(displayDecimals);
        return result;
    }
}

export { Token };

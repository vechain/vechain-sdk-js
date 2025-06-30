import { type Address } from '../Address';
import { Units } from './Units';

/**
 * Represents a generic Token
 * A token has base units (e.g. wei) and display units
 * For example 1 VTHO (1 in display units) = 10^18 base units (wei)
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

    // Store the token's value in wei (smallest possible)
    protected _valueWei: bigint;

    /**
     * Create a new instance
     */
    constructor() {
        // covert value to wei units
        this._valueWei = 0n;
    }

    /**
     * Initilises the instance with a value
     * @param value Token value
     * @param valueUnits Units for the token value
     */
    protected initialize(value: bigint, valueUnits?: Units): undefined {
        this._valueWei = this.convertToWei(value, valueUnits);
    }

    /**
     * Converts provided value to the tokens base units value
     * @param value Provided value
     * @param valueUnits Units of the provided value
     * @returns The value converted to base units
     */
    private convertWeiToBaseUnits(): bigint {
        const diffUnits = BigInt(this.units - Units.wei);
        return this._valueWei * 10n ** diffUnits;
    }

    /**
     * Converts a value to the tokens internal representation of Wei
     * @param value Value to convert
     * @param valueUnits Units the value is in
     * @returns Wei value conversion
     */
    private convertToWei(value: bigint, valueUnits?: Units): bigint {
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        const convertUnits = valueUnits ?? this.units;
        const diffUnits = BigInt(convertUnits);
        const baseValue = value * 10n ** diffUnits;
        return baseValue;
    }

    /**
     * Get the token's value in base units.
     * @returns {bigint} Token value in base units
     */
    public get value(): bigint {
        return this.convertWeiToBaseUnits();
    }

    /**
     * Converts the base unit value to a human-readable string.
     * If `displayDecimals` is provided the value is rounded to that number of decimals
     * Otherwise, it falls back to the token's inherent `units`.
     * @param {number} displayDecimals Number of decimal places to round to
     */
    public format(displayDecimals?: number): string {
        const divisor = 10n ** BigInt(Units.ether);
        const whole = this._valueWei / divisor;
        const fraction = this._valueWei % divisor;
        const decimal = Number(`${whole}.${fraction}`);
        const result =
            displayDecimals === undefined
                ? decimal.toFixed(Units.ether - this.units)
                : decimal.toFixed(displayDecimals);
        return result;
    }
}

export { Token };

import { InvalidDataType } from '@vechain/sdk-errors';
import { type Address } from '../Address';
import { FixedPointNumber } from '../FixedPointNumber';
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
    protected initialize(value: bigint, valueUnits: Units = this.units): void {
        const valueWei = Units.convertUnits(
            FixedPointNumber.of(value),
            valueUnits,
            Units.wei
        );
        if (valueWei.isNegative()) {
            throw new InvalidDataType('Token.initialize', 'Value is negative', {
                value,
                valueUnits
            });
        } else {
            this._valueWei = valueWei.bi;
        }
    }

    /**
     * Converts provided value to the tokens base units value
     * @returns The value converted to tokens base units
     */
    private convertWeiToTokenUnits(): bigint {
        return Units.convertUnits(
            FixedPointNumber.of(this._valueWei),
            Units.wei,
            this.units
        ).bi;
    }

    /**
     * Get the token's value in base units.
     * @returns {bigint} Token value in base units
     */
    public get value(): bigint {
        return this.convertWeiToTokenUnits();
    }

    /**
     * Converts the base unit value to a human-readable string.
     */
    public format(
        toUnits: Units = this.units,
        displayDecimals?: number
    ): string {
        return Units.formatFromUnits(
            FixedPointNumber.of(this._valueWei),
            Units.wei,
            toUnits,
            displayDecimals
        );
    }
}

export { Token };

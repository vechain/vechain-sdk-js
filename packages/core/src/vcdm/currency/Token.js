"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Token = void 0;
const sdk_errors_1 = require("@vechain/sdk-errors");
const FixedPointNumber_1 = require("../FixedPointNumber");
const Units_1 = require("./Units");
/**
 * Represents a generic Token
 * A token has base units (e.g. wei) and display units
 * For example 1 VTHO (1 in display units) = 10^18 base units (wei)
 */
class Token {
    // Store the token's value in wei (smallest possible)
    _valueWei;
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
    initialize(value, valueUnits = this.units) {
        const valueWei = Units_1.Units.convertUnits(FixedPointNumber_1.FixedPointNumber.of(value), valueUnits, Units_1.Units.wei);
        if (valueWei.isNegative()) {
            throw new sdk_errors_1.InvalidDataType('Token.initialize', 'Value is negative', {
                value,
                valueUnits
            });
        }
        else {
            this._valueWei = valueWei.bi;
        }
    }
    /**
     * Converts provided value to the tokens base units value
     * @returns The value converted to tokens base units
     */
    convertWeiToTokenUnits() {
        return Units_1.Units.convertUnits(FixedPointNumber_1.FixedPointNumber.of(this._valueWei), Units_1.Units.wei, this.units).bi;
    }
    /**
     * Get the token's value in base units.
     * @returns {bigint} Token value in base units
     */
    get value() {
        return this.convertWeiToTokenUnits();
    }
    /**
     * Converts the base unit value to a human-readable string.
     */
    format(toUnits = this.units, displayDecimals) {
        return Units_1.Units.formatFromUnits(FixedPointNumber_1.FixedPointNumber.of(this._valueWei), Units_1.Units.wei, toUnits, displayDecimals);
    }
}
exports.Token = Token;

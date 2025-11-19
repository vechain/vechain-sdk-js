"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Units = void 0;
const sdk_errors_1 = require("@vechain/sdk-errors");
const FixedPointNumber_1 = require("../FixedPointNumber");
/**
 * Enumeration representing units (i.e. order of magnitude)
 * of cryptocurrency (e.g., ETH or VET).
 * Each unit is defined by its name and its corresponding decimal place shift.
 * The decimal place shift if the exponent of the power of 10 to multiply
 * a value expressed in the name unit to result in the equivalent value
 * expressed in `wei` unit.
 *
 * @remarks The unit `ether` refers to an order of magnitude, not to the
 * `ETH` cryptocurrency, albeit 1 ETH = 10E18 wei in
 * [scientific notation](https://en.wikipedia.org/wiki/Scientific_notation).
 *
 * @enum {number}
 */
var Units;
(function (Units) {
    /**
     * 1 ether = 1,000,000,000,000,000,000 wei. 0 fractional digits FixedPointNumber.
     */
    Units[Units["wei"] = 0] = "wei";
    /**
     * 1 ether = 1,000,000,000,000,000 kwei. 3 fractional digits FixedPointNumber.
     */
    Units[Units["kwei"] = 3] = "kwei";
    /**
     * 1 ether = 1,000,000,000,000 mwei. 6 fractional digits FixedPointNumber.
     */
    Units[Units["mwei"] = 6] = "mwei";
    /**
     * 1 ether = 1,000,000,000 gwei. 9 fractional digits FixedPointNumber.
     */
    Units[Units["gwei"] = 9] = "gwei";
    /**
     * 1 ether = 1,000,000,000 szabo. 12 fractional digits FixedPointNumber.
     */
    Units[Units["szabo"] = 12] = "szabo";
    /**
     * 1 ether = 1,000,000 finney. 15 fractional digits FixedPointNumber.
     */
    Units[Units["finney"] = 15] = "finney";
    /**
     * 18 fractional diguts FixedPointNumber.
     */
    Units[Units["ether"] = 18] = "ether";
})(Units || (exports.Units = Units = {}));
/**
 * Namespace for unit conversion functions,
 * providing the same functionalities of
 * [ethers v6 Unit Conversion](https://docs.ethers.org/v6/api/utils/#about-units).
 */
// eslint-disable-next-line @typescript-eslint/no-namespace
(function (Units) {
    /**
     * Convert a value expressed in {@link Units.wei} as a string
     * representing the same value expressed in {@link Units.ether}.
     *
     * @param {FixedPointNumber} wei - The value in {@link Units.wei}.
     * @return {string} The formatted string representing the value in
     * {@link Units.ether}.
     *
     * @remarks The term `ether` refers to the order of magnitude 10E18,
     * not to the `ETH` cryptocurrency.
     *
     * @see [ethers formatEther](https://docs.ethers.org/v6/api/utils/#formatEther)
     */
    function formatEther(wei) {
        return formatUnits(wei, Units.ether);
    }
    Units.formatEther = formatEther;
    /**
     * Convert a value expressed in {@link Units.wei} as a string
     * representing the same value expressed in `unit`.
     *
     * @param {FixedPointNumber} wei - The value in {@link Units.wei}.
     * @param {Units} unit The order of magnitude to express the `wei` value.
     * @return {string} The formatted string representing the value
     * in the named `unit`.
     *
     * @remarks The term `ether` refers to the order of magnitude 10E18,
     * not to the `ETH` cryptocurrency.
     *
     * @see [ethers formatUnits](https://docs.ethers.org/v6/api/utils/#formatUnits)
     */
    function formatUnits(wei, unit = Units.ether) {
        const fpn = wei.div(FixedPointNumber_1.FixedPointNumber.of(10n ** BigInt(unit)));
        return fpn.isInteger() ? `${fpn}.0` : `${fpn}`;
    }
    Units.formatUnits = formatUnits;
    /**
     * Parse the decimal string expressing a value in {@link Units.ether}
     * to return a {@link FixedPointNumber} value expressed in {@link Units.wei}.

     * @param ether = The representation of a numeric value expressed
     * in {@link Units.ether}.
     * @return The equivalent value in {@link Units.wei}.
     *
     * @throws {InvalidDataType} If `exp` is not a numeric expression.
     *
     * @remarks The term `ether` refers to the order of magnitude 10E18,
     * not to the `ETH` cryptocurrency.
     *
     * @see [ethers parseEther](https://docs.ethers.org/v6/api/utils/#parseEther)
     */
    function parseEther(ether) {
        return parseUnits(ether, Units.ether);
    }
    Units.parseEther = parseEther;
    /**
     * Parse the decimal string expressing a value in the named `unit`
     * ro return a {@link FixedPointNumber} value expressed in {@link Units.wei}.

     * @param {string} exp - The representation of a numeric value expressed
     * in {@link Units.ether}.
     * @param {Units} unit - The order of magnitude to use to parse the `exp`
     * representation.
     *
     * @throws {InvalidDataType} If `exp` is not a numeric expression.
     *
     * @remarks The term `ether` refers to the order of magnitude 10E18,
     * not to the `ETH` cryptocurrency.
     *
     * @see [ethers parseUnits](https://docs.ethers.org/v6/api/utils/#parseUnits)
     */
    function parseUnits(exp, unit = Units.ether) {
        return FixedPointNumber_1.FixedPointNumber.of(exp).times(FixedPointNumber_1.FixedPointNumber.of(10n ** BigInt(unit)));
    }
    Units.parseUnits = parseUnits;
    /**
     * Convert a value expressed in `fromUnits` to `toUnits`.
     *
     * @param value The value to convert.
     * @param fromUnits The units of the value to convert.
     * @param toUnits The units to convert the value to.
     * @returns The value converted to `toUnits`.
     */
    function convertUnits(value, fromUnits, toUnits) {
        const diffUnits = BigInt(toUnits - fromUnits);
        if (diffUnits >= 0n) {
            return value.div(FixedPointNumber_1.FixedPointNumber.of(10n ** diffUnits));
        }
        else {
            return value.times(FixedPointNumber_1.FixedPointNumber.of(10n ** BigInt(-diffUnits)));
        }
    }
    Units.convertUnits = convertUnits;
    /**
     * Format a value expressed in `fromUnits` to a decimal string
     * expressed in `toUnits`.
     *
     * @param value The value to format.
     * @param fromUnits The units of the value to format.
     * @param toUnits The units to format the value to.
     * @returns The formatted value as a decimal string.
     */
    function formatFromUnits(value, fromUnits, toUnits, displayDecimals) {
        let targetValue = convertUnits(value, fromUnits, toUnits);
        // round the target value to the displayDecimals
        if (displayDecimals !== undefined) {
            if (displayDecimals >= 0) {
                targetValue =
                    FixedPointNumber_1.FixedPointNumber.of(targetValue).dp(displayDecimals);
            }
            else {
                throw new sdk_errors_1.InvalidDataType('Units.formatFromUnits', 'displayDecimals must be greater than or equal to 0', {
                    value,
                    fromUnits,
                    toUnits,
                    displayDecimals
                });
            }
        }
        const decimalValue = targetValue.toString();
        // pad the decimal value with zeros to the displayDecimals
        if (displayDecimals !== undefined) {
            const decimalParts = decimalValue.split('.');
            if (decimalParts.length > 1) {
                if (displayDecimals > 0) {
                    return (decimalParts[0] +
                        '.' +
                        decimalParts[1].slice(0, displayDecimals));
                }
                else {
                    return decimalParts[0];
                }
            }
            if (displayDecimals > 0) {
                return decimalParts[0] + '.' + '0'.repeat(displayDecimals);
            }
            else {
                return decimalParts[0];
            }
        }
        return decimalValue;
    }
    Units.formatFromUnits = formatFromUnits;
})(Units || (exports.Units = Units = {}));

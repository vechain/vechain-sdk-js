import { InvalidDataType } from '@vechain/sdk-errors';
import { FixedPointNumber } from '../FixedPointNumber';

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
enum Units {
    /**
     * 1 ether = 1,000,000,000,000,000,000 wei. 0 fractional digits FixedPointNumber.
     */
    wei = 0,

    /**
     * 1 ether = 1,000,000,000,000,000 kwei. 3 fractional digits FixedPointNumber.
     */
    kwei = 3,

    /**
     * 1 ether = 1,000,000,000,000 mwei. 6 fractional digits FixedPointNumber.
     */
    mwei = 6,

    /**
     * 1 ether = 1,000,000,000 gwei. 9 fractional digits FixedPointNumber.
     */
    gwei = 9,

    /**
     * 1 ether = 1,000,000,000 szabo. 12 fractional digits FixedPointNumber.
     */
    szabo = 12,

    /**
     * 1 ether = 1,000,000 finney. 15 fractional digits FixedPointNumber.
     */
    finney = 15,

    /**
     * 18 fractional diguts FixedPointNumber.
     */
    ether = 18
}

/**
 * Namespace for unit conversion functions,
 * providing the same functionalities of
 * [ethers v6 Unit Conversion](https://docs.ethers.org/v6/api/utils/#about-units).
 */
// eslint-disable-next-line @typescript-eslint/no-namespace
namespace Units {
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
    export function formatEther(wei: FixedPointNumber): string {
        return formatUnits(wei, Units.ether);
    }

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
    export function formatUnits(
        wei: FixedPointNumber,
        unit: Units = Units.ether
    ): string {
        const fpn = wei.div(FixedPointNumber.of(10n ** BigInt(unit)));
        return fpn.isInteger() ? `${fpn}.0` : `${fpn}`;
    }

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
    export function parseEther(ether: string): FixedPointNumber {
        return parseUnits(ether, Units.ether);
    }

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
    export function parseUnits(
        exp: string,
        unit: Units = Units.ether
    ): FixedPointNumber {
        return FixedPointNumber.of(exp).times(
            FixedPointNumber.of(10n ** BigInt(unit))
        );
    }

    /**
     * Convert a value expressed in `fromUnits` to `toUnits`.
     *
     * @param value The value to convert.
     * @param fromUnits The units of the value to convert.
     * @param toUnits The units to convert the value to.
     * @returns The value converted to `toUnits`.
     */
    export function convertUnits(
        value: FixedPointNumber,
        fromUnits: Units,
        toUnits: Units
    ): FixedPointNumber {
        const diffUnits = BigInt(toUnits - fromUnits);
        if (diffUnits >= 0n) {
            return value.div(FixedPointNumber.of(10n ** diffUnits));
        } else {
            return value.times(FixedPointNumber.of(10n ** BigInt(-diffUnits)));
        }
    }

    /**
     * Format a value expressed in `fromUnits` to a decimal string
     * expressed in `toUnits`.
     *
     * @param value The value to format.
     * @param fromUnits The units of the value to format.
     * @param toUnits The units to format the value to.
     * @returns The formatted value as a decimal string.
     */
    export function formatFromUnits(
        value: FixedPointNumber,
        fromUnits: Units,
        toUnits: Units,
        displayDecimals?: number
    ): string {
        let targetValue = convertUnits(value, fromUnits, toUnits);
        // round the target value to the displayDecimals
        if (displayDecimals !== undefined) {
            if (displayDecimals >= 0) {
                targetValue =
                    FixedPointNumber.of(targetValue).dp(displayDecimals);
            } else {
                throw new InvalidDataType(
                    'Units.formatFromUnits',
                    'displayDecimals must be greater than or equal to 0',
                    {
                        value,
                        fromUnits,
                        toUnits,
                        displayDecimals
                    }
                );
            }
        }
        const decimalValue = targetValue.toString();
        // pad the decimal value with zeros to the displayDecimals
        if (displayDecimals !== undefined) {
            const decimalParts = decimalValue.split('.');
            if (decimalParts.length > 1) {
                if (displayDecimals > 0) {
                    return (
                        decimalParts[0] +
                        '.' +
                        decimalParts[1].slice(0, displayDecimals)
                    );
                } else {
                    return decimalParts[0];
                }
            }
            if (displayDecimals > 0) {
                return decimalParts[0] + '.' + '0'.repeat(displayDecimals);
            } else {
                return decimalParts[0];
            }
        }
        return decimalValue;
    }
}

export { Units };

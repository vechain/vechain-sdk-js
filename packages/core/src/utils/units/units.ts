import { BigNumber } from 'bignumber.js';
import { Hex } from '../../vcdm/Hex';
import { InvalidDataType } from '@vechain/sdk-errors';
import { type WEI_UNITS } from './types';

/**
 * Precision of big numbers.
 */
const BIG_NUMBER_PRECISION = 80;

/**
 * One VET is 10^18.
 *
 * @see {formatUnits}
 * @see {parseUnits}
 */
const VET_DECIMAL_EXPONENT = 18;

/**
 * Array of Ethereum wei unit names.
 *
 * @see {formatUnits}
 * @see {parseUnits}
 */
const WEI_UNIT_NAMES: WEI_UNITS[] = [
    'wei',
    'kwei',
    'mwei',
    'gwei',
    'szabo',
    'finney',
    'ether'
];

/**
 * Converts the given value to a BigNumber.
 *
 * @param {bigint | number | string} value - The value to be converted to BigNumber,
 * decimal or hexadecimal prefixed with `0x`.
 * @returns {BigNumber} - The converted value as a BigNumber.
 * @throws {InvalidDataType}
 */
function bigNumberOf(value: bigint | number | string): BigNumber {
    let bn: BigNumber;
    switch (typeof value) {
        case 'bigint':
            bn = BigNumber(value.toString());
            break;
        case 'number':
            bn = BigNumber(value);
            break;
        case 'string': {
            if (Hex.isValid0x(value)) {
                bn = BigNumber(Hex.of(value).bi.toString());
            } else {
                bn = BigNumber(value);
            }
        }
    }
    if (bn.isNaN())
        throw new InvalidDataType('unitUtils.bigNumberOf()', 'Not a number.', {
            value: value.toString()
        });

    return bn;
}

/**
 * Calculates the number of digits in the fractional part of a given value.
 *
 * @param {BigNumber} value - The value to calculate the number of digits.
 * @return {number} - The number of digits in the fractional part.
 */
function digitsOfFractionalPart(value: BigNumber): number {
    let d = 0; // Digits of the fractional part.
    const i = value.abs().integerValue(BigNumber.ROUND_FLOOR); // Integer part, no sign.
    let f = value.abs().minus(i); // Fractional part, no sign.
    while (!f.isInteger()) {
        ++d;
        f = f.times(10);
    }
    return d;
}

/**
 * Calculates the number of digits in the integer part of a given BigNumber.
 *
 * @param {BigNumber} value - The BigNumber to calculate the number of digits for.
 *
 * @return {number} - The number of digits in the integer part of the BigNumber.
 */
function digitsOfIntegerPart(value: BigNumber): number {
    let d = 0; // Digits of the integer part.
    let i = value.abs().integerValue(BigNumber.ROUND_FLOOR); // Integer part, no sign.
    while (i.gte(1)) {
        d++;
        i = i.div(10);
    }
    return d;
}

/**
 * Returns the number of digits expressed by `digitsOrUnit`:
 * - parsing {@link WEI_UNITS}, or
 * - interpreting the argument as an integer, truncating any factional part.
 *
 * @param {bigint | number | WEI_UNITS} digitsOrUnit - The meaningful digits,
 * to represent the unit if this parameter is a {@link WEI_UNITS} type.
 * @returns {number} - The number of meaningful digits.
 * @throws {InvalidDataType}
 * {@link WEI_UNITS} type, or it is a negative value.
 */
function digitsOfUnit(digitsOrUnit: bigint | number | WEI_UNITS): number {
    let digits: number;
    switch (typeof digitsOrUnit) {
        case 'bigint':
            digits = Number(digitsOrUnit);
            break;
        case 'number':
            digits = Math.floor(digitsOrUnit);
            break;
        case 'string': {
            const index = WEI_UNIT_NAMES.indexOf(digitsOrUnit);
            if (index < 0) {
                // assert method fails to serialize bigint.
                throw new InvalidDataType(
                    'unitUtils.digitOfUnit()',
                    "Invalid unit name. Valid unit names are 'wei','kwei', 'mwei', 'gwei', 'szabo', 'finney', 'ether'",
                    {
                        digitsOrUnit
                    }
                );
            }
            digits = index * 3;
        }
    }

    if (digits > BIG_NUMBER_PRECISION)
        throw new InvalidDataType(
            'unitsUtils.digitOfUnit()',
            'Precision overflow (digits or unit name).',
            { digitsOrUnit: digitsOrUnit.toString() }
        );

    if (digits < 0)
        throw new InvalidDataType(
            'unitsUtils.digitOfUnit()',
            'Negative precision (digits or unit name).',
            { digitsOrUnit: digitsOrUnit.toString() }
        );

    return digits;
}

/**
 * Formats the given `value` into a decimal string,
 * assuming `decimalsOrUnits` decimal places.
 *
 * The method returns **value / 10^decimalsOrUnit**.
 *
 * @param {bigint | number | string} value - The value to be formatted,
 * it can be a hexadecimal expression prefixed with `0x`.
 * @param {bigint | number | WEI_UNITS} decimalsOrUnit - The number of decimals
 * or the name unit of measurement to use for formatting
 * (e.g. `gwei` for 9 decimal places).
 * Default value is {@link VET_DECIMAL_EXPONENT}.
 * @return {string} - The formatted value as a string,
 * as [ethers.formatUnits](https://docs.ethers.org/v6/api/utils/#formatUnits)
 * it returns at least a fractional digit unless the `digitsOrUnits` is `wei`.
 * @throws {InvalidDataType}
 *
 * @remarks This function is a drop-in replacement for
 * [ethers.formatUnits](https://docs.ethers.org/v6/api/utils/#formatUnits).
 *
 */
function formatUnits(
    value: bigint | number | string,
    decimalsOrUnit: bigint | number | WEI_UNITS = VET_DECIMAL_EXPONENT
): string {
    const bnConfig = BigNumber.config();
    BigNumber.set({
        DECIMAL_PLACES: BIG_NUMBER_PRECISION,
        ROUNDING_MODE: BigNumber.ROUND_HALF_UP
    });
    try {
        const bn = bigNumberOf(value);
        const powerOfTen = digitsOfUnit(decimalsOrUnit);
        const divisor = BigNumber(10).pow(powerOfTen);
        const result = bn.div(divisor);
        let fixedDecimals: number = digitsOfFractionalPart(result);
        if (fixedDecimals === 0 && decimalsOrUnit !== WEI_UNIT_NAMES[0]) {
            fixedDecimals = 1;
        }
        return result.toFixed(fixedDecimals);
    } catch (e) {
        throw new InvalidDataType(
            'unitsUtils.formatUnits()',
            `Unable to format units: ${(e as Error).message}`,
            { value, digitsOrUnit: decimalsOrUnit },
            e
        );
    } finally {
        BigNumber.set(bnConfig);
    }
}

/**
 * Converts a value to decimal string assuming 18 digits.
 *
 * VET is the native token of the VeChainThor blockchain.
 * It has 18 decimals.
 *
 * This method can format any numeric value with 18 decimals, VTHO balance too.
 *
 * @param {bigint | number | string} value - The value to be converted,
 * hexadecimal supported prefixed with `0x`.
 * @returns {string} The value in Ether format.
 *
 * @see {formatUnits}
 */
const formatVET = (value: bigint | number | string): string => {
    return formatUnits(value, VET_DECIMAL_EXPONENT);
};

/**
 * Parses the given `value` and converts it to a BigInt value,
 * assuming `decimalsOrUnits` decimal places.
 *
 * The method returns **value * 10^digitsOrUnit**.
 *
 * @param {bigint | number | string} value - The value to parse and convert,
 * it can be a hexadecimal expression prefixed with `0x`.
 * @param {bigint | number | WEI_UNITS} digitsOrUnit - The number of digits
 * or the name of the unit of measurement to use for the conversion
 * (e.g. `gwei` for 9 decimal places),
 * Default value is VET_DECIMAL_EXPONENT.
 * @returns {bigint} - The parsed value converted to units.
 * @throws {InvalidDataType}
 *
 * @remarks This function is a drop-in replacement for
 * [ethers.parseUnits](https://docs.ethers.org/v6/api/utils/#parseUnits).
 */
function parseUnits(
    value: bigint | number | string,
    digitsOrUnit: bigint | number | WEI_UNITS = VET_DECIMAL_EXPONENT
): bigint {
    const bnConfig = BigNumber.config();
    BigNumber.set({
        DECIMAL_PLACES: BIG_NUMBER_PRECISION,
        ROUNDING_MODE: BigNumber.ROUND_HALF_UP
    });
    try {
        const bn = bigNumberOf(value);
        const powerOfTen = digitsOfUnit(digitsOrUnit);
        const multiplier = BigNumber(10).pow(powerOfTen);
        const result = bn.times(multiplier);
        const fractionDigits = digitsOfFractionalPart(result);
        const integerDigits = digitsOfIntegerPart(result);
        return BigInt(result.toPrecision(fractionDigits + integerDigits));
    } catch (e) {
        throw new InvalidDataType(
            'unitsUtils.parseUnits()',
            `Unable to format units: ${(e as Error).message}`,
            { value, decimalsOrUnit: digitsOrUnit },
            e
        );
    } finally {
        BigNumber.set(bnConfig);
    }
}

/**
 * Parses the given value as a VET (VeChainThor) amount and returns it as a bigint.
 *
 * VET is the native token of the VeChainThor blockchain.
 * It has 18 decimals.
 *
 * This method can parse any numeric string with 18 decimals, VTHO balance too.
 *
 * @param {string} value - The value to parse as a VET amount.
 * hexadecimal supported prefixed with `0x`.
 * @returns {bigint} The parsed value as a bigint.
 *
 * @link See [ethers.js parseEther](https://docs.ethers.org/v6/api/utils/#parseEther).
 *
 * @see {parseUnits}
 */
const parseVET = (value: string): bigint => {
    return parseUnits(value, VET_DECIMAL_EXPONENT);
};

export const unitsUtils = {
    formatUnits,
    formatVET,
    parseUnits,
    parseVET
};

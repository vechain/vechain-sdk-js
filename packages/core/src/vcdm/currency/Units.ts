import { FPN } from '../FPN';

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
     * 1 ether = 1,000,000,000,000,000,000 wei. 0 fractional digits FPN.
     */
    wei = 0,

    /**
     * 1 ether = 1,000,000,000,000,000 kwei. 3 fractional digits FPN.
     */
    kwei = 3,

    /**
     * 1 ether = 1,000,000,000,000 mwei. 6 fractional digits FPN.
     */
    mwei = 6,

    /**
     * 1 ether = 1,000,000,000 gwei. 9 fractional digits FPN.
     */
    gwei = 9,

    /**
     * 1 ether = 1,000,000,000 szabo. 12 fractional digits FPN.
     */
    szabo = 12,

    /**
     * 1 ether = 1,000,000 finney. 15 fractional digits FPN.
     */
    finney = 15,

    /**
     * 18 fractional diguts FPN.
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
     * @param {FPN} wei The value in {@link Units.wei}.
     * @return {string} The formatted string representing the value in
     * {@link Units.ether}.
     *
     * @remarks The term `ether` refers to the order of magnitude 10E18,
     * not to the `ETH` cryptocurrency.
     *
     * @see [ethers formatEther](https://docs.ethers.org/v6/api/utils/#formatEther)
     */
    export function formatEther(wei: FPN): string {
        return formatUnits(wei, Units.ether);
    }

    /**
     * Convert a value expressed in {@link Units.wei} as a string
     * representing the same value expressed in `unit`.
     *
     * @param {FPN} wei - The value in {@link Units.wei}.
     * @param {Units} unit The order of magnitude to express the `wei` value.
     * @return {string} The formatted string representing the value
     * in the named `unit`.
     *
     * @remarks The term `ether` refers to the order of magnitude 10E18,
     * not to the `ETH` cryptocurrency.
     *
     * @see [ethers formatUnits](https://docs.ethers.org/v6/api/utils/#formatUnits)
     */
    export function formatUnits(wei: FPN, unit: Units = Units.ether): string {
        const fpn = wei.div(FPN.of(10n ** BigInt(unit)));
        return fpn.isInteger() ? `${fpn}.0` : `${fpn}`;
    }

    /**
     * Parse the decimal string expressing a value in {@link Units.ether}
     * to return a {@link FPN} value expressed in {@link Units.wei}.

     * @param ether The representation of a numeric value expressed
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
    export function parseEther(ether: string): FPN {
        return parseUnits(ether, Units.ether);
    }

    /**
     * Parse the decimal string expressing a value in the named `unit`
     * ro return a {@link FPN} value expressed in {@link Units.wei}.

     * @param {string} exp The representation of a numeric value expressed
     * in {@link Units.ether}.
     * @param {Units} unit the order of magnitude to use to parse the `exp`
     * representation.
     *
     * @throws {InvalidDataType} If `exp` is not a numeric expression.
     *
     * @remarks The term `ether` refers to the order of magnitude 10E18,
     * not to the `ETH` cryptocurrency.
     *
     * @see [ethers parseUnits](https://docs.ethers.org/v6/api/utils/#parseUnits)
     */
    export function parseUnits(exp: string, unit: Units = Units.ether): FPN {
        return FPN.of(exp).times(FPN.of(10n ** BigInt(unit)));
    }
}

export { Units };

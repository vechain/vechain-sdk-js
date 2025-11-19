import { Coin } from './Coin';
import { FixedPointNumber } from '../FixedPointNumber';
import { Txt } from '../Txt';
import { Units } from './Units';
/**
 * Represents a
 * [VeChain VET](https://docs.vechain.org/introduction-to-vechain/dual-token-economic-model/vechain-vet)
 * monetary amount.
 *
 * @extends Coin
 */
declare class VET extends Coin {
    /**
     * The code for VET is the sequence of Unicode
     * - U+1D64D - mathematical double strike capital letter 'V',
     * - U+039F - Greek capital letter 'Xi',
     * - U+0054 - Latin capital letter 'T'.
     */
    static readonly CODE: Txt;
    /**
     * Wei fractional digits to express this value.
     */
    private static readonly WEI_FD;
    /**
     * Represents this monetary amount in terms of {@link Units.wei}.
     *
     * @type {bigint}
     */
    readonly wei: bigint;
    /**
     * Create a new instance with the given `value`.
     *
     * @param {FixedPointNumber} value The value to be used for initializing the instance.
     */
    protected constructor(value: FixedPointNumber);
    /**
     * Return a new VET instance with the specified value and unit.
     *
     * @param {bigint | number | string | FixedPointNumber} value - The numerical value for the VET instance.
     * @param {Units} unit - The unit for the value.
     *                     Defaults to {@link Units.ether} if not provided.
     * @return {VET} A new VET instance with the provided value and unit.
     *
     * @throws {InvalidDataType} If `value` is not a numeric expression.
     */
    static of(value: bigint | number | string | FixedPointNumber, unit?: Units): VET;
}
export { VET };
//# sourceMappingURL=VET.d.ts.map
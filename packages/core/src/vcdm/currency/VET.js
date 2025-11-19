"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VET = void 0;
const Coin_1 = require("./Coin");
const FixedPointNumber_1 = require("../FixedPointNumber");
const Txt_1 = require("../Txt");
const Units_1 = require("./Units");
/**
 * Represents a
 * [VeChain VET](https://docs.vechain.org/introduction-to-vechain/dual-token-economic-model/vechain-vet)
 * monetary amount.
 *
 * @extends Coin
 */
class VET extends Coin_1.Coin {
    /**
     * The code for VET is the sequence of Unicode
     * - U+1D64D - mathematical double strike capital letter 'V',
     * - U+039F - Greek capital letter 'Xi',
     * - U+0054 - Latin capital letter 'T'.
     */
    static CODE = Txt_1.Txt.of('𝕍ΞT');
    /**
     * Wei fractional digits to express this value.
     */
    static WEI_FD = 18n;
    /**
     * Represents this monetary amount in terms of {@link Units.wei}.
     *
     * @type {bigint}
     */
    wei = this.value.dp(VET.WEI_FD).scaledValue;
    /**
     * Create a new instance with the given `value`.
     *
     * @param {FixedPointNumber} value The value to be used for initializing the instance.
     */
    constructor(value) {
        super(VET.CODE, value);
    }
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
    static of(value, unit = Units_1.Units.ether) {
        const fpn = value instanceof FixedPointNumber_1.FixedPointNumber
            ? value
            : FixedPointNumber_1.FixedPointNumber.of(value);
        return new VET(fpn.div(FixedPointNumber_1.FixedPointNumber.of(10n ** (VET.WEI_FD - BigInt(unit)))));
    }
}
exports.VET = VET;

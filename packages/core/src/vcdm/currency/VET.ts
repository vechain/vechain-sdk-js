import { Coin } from './Coin';
import { Txt } from '../Txt';
import { FPN } from '../FPN';
import { Units } from './Units';
import { type Address } from '../Address';
import { Clause } from '../../clause';

/**
 * Represents a
 * [VeChain VET](https://docs.vechain.org/introduction-to-vechain/dual-token-economic-model/vechain-vet)
 * monetary amount.
 *
 * @extends Coin
 */
class VET extends Coin {
    /**
     * The code for VET is the sequence of Unicode
     * - U+1D64D - mathematical double strike capital letter 'V',
     * - U+039F - Greek capital letter 'Xi',
     * - U+0054 - Latin capital letter 'T'.
     */
    public static readonly CODE = Txt.of('𝕍ΞT');

    /**
     * Wei fractional digits to express this value.
     */
    private static readonly WEI_FD = 18n;

    /**
     * Represents this monetary amount in terms of {@link Units.wei}.
     *
     * @type {bigint}
     */
    public readonly wei: bigint = this.value.dp(VET.WEI_FD).sv;

    /**
     * Create a new instance with the given `value`.
     *
     * @param {FPN} value - The value to be used for initializing the instance.
     */
    protected constructor(value: FPN) {
        super(VET.CODE, value);
    }

    /**
     * Return a new VET instance with the specified value and unit.
     *
     * @param {FPN} value - The numerical value for the VET instance.
     * @param {Units} unit - The unit for the value.
     *                       Defaults to {@link Units.ether} if not provided.
     * @return A new VET instance with the provided value and unit.
     *
     * @throws {InvalidDataType} If `value` is not a numeric expression.
     */
    public static of(
        value: bigint | number | string | FPN,
        unit: Units = Units.ether
    ): VET {
        const fpn = value instanceof FPN ? value : FPN.of(value);
        return new VET(fpn.div(FPN.of(10n ** (VET.WEI_FD - BigInt(unit)))));
    }

    /**
     * Return the {@link Cluase} to move this amount of VET to the `address`.
     *
     * @param address to move this amount of VET.
     * @return the {@link Cluase} to move this amount of VET to the `address`.
     */
    public transferTo(address: Address): Clause {
        return Clause.transferVET(address, this);
    }
}

export { VET };

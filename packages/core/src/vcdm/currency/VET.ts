import { Clause } from '../../clause';
import { Coin } from './Coin';
import { FPN } from '../FPN';
import { Txt } from '../Txt';
import { Units } from './Units';
import { type Address } from '../Address';
import { type ClauseOptions } from '../../transaction';

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
     * @param {FPN} value The value to be used for initializing the instance.
     */
    protected constructor(value: FPN) {
        super(VET.CODE, value);
    }

    /**
     * Return a new VET instance with the specified value and unit.
     *
     * @param {bigint | number | string | FPN} value The numerical value for the VET instance.
     * @param {Units} unit The unit for the value.
     *                     Defaults to {@link Units.ether} if not provided.
     * @return {VET} A new VET instance with the provided value and unit.
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
     * Transfers a specified amount of VET to the given address.
     *
     * @param {Address} address The recipient's address to which the VET will be transferred.
     * @param {ClauseOptions} clauseOptions  Optional parameters that modify the behavior of the transaction.
     * @return {Clause} A Clause object representing the transfer transaction.
     */
    public transferTo(address: Address, clauseOptions?: ClauseOptions): Clause {
        return Clause.transferVET(address, this, clauseOptions);
    }
}

export { VET };

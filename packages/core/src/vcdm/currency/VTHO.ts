import { Clause } from '../../transaction';
import { Coin } from './Coin';
import { FixedPointNumber } from '../FixedPointNumber';
import { Txt } from '../Txt';
import { Units } from './Units';
import { type Address } from '../Address';
import { type ClauseOptions } from '../../transaction';

/**
 * Represents a
 * [VeChain VeThor](https://docs.vechain.org/introduction-to-vechain/dual-token-economic-model/vethor-vtho)
 * monetary amount.
 *
 * @extends Coin
 */
class VTHO extends Coin {
    /**
     * The code for VET is the sequence of Unicode
     * - U+1D64D - mathematical double strike capital letter 'V',
     * - U+0054 - Latin capital letter 'T',
     * - U+0048 - Latin capital letter 'H',
     * - U+004F - Latin capital letter 'O'.
     */
    public static readonly CODE = Txt.of('𝕍THO');

    /**
     * Wei fractional digits to express this value.
     */
    private static readonly WEI_FD = 18n;

    /**
     * Represents this monetary amount in terms of {@link Units.wei}.
     *
     * @type {bigint}
     */
    public readonly wei: bigint = this.value.dp(VTHO.WEI_FD).sv;

    /**
     * Create a new instance with the given `value`.
     *
     * @param {FixedPointNumber} value The value to be used for initializing the instance.
     */
    protected constructor(value: FixedPointNumber) {
        super(VTHO.CODE, value);
    }

    /**
     * Return a new VTHO instance with the specified value and unit.
     *
     * @param {bigint | number | string | FixedPointNumber} value The numerical value for the VTHO instance.
     * @param {Units} unit The unit for the value.
     *                     Defaults to {@link Units.ether} if not provided.
     * @return {VTHO} A new VTHO instance with the provided value and unit.
     *
     * @throws {InvalidDataType} If `value` is not a numeric expression.
     */
    public static of(
        value: bigint | number | string | FixedPointNumber,
        unit: Units = Units.ether
    ): VTHO {
        const fpn =
            value instanceof FixedPointNumber
                ? value
                : FixedPointNumber.of(value);
        return new VTHO(
            fpn.div(FixedPointNumber.of(10n ** (VTHO.WEI_FD - BigInt(unit))))
        );
    }

    /**
     * Return a new clause to transfers the specified amount of
     * [VIP180](https://docs.vechain.org/introduction-to-vechain/dual-token-economic-model/vethor-vtho#vip180-vechains-fungible-token-standard)
     * token.
     *
     * @param {Address} tokenAddress - The address of the token to transfer.
     * @param {Address} to - The address of the recipient.
     * @param {ClauseOptions} [clauseOptions] - Optional options for the clause.
     * @return {Clause} A Clause object representing the transfer.
     *
     * @see transferToken
     */
    public transferTokenTo(
        tokenAddress: Address,
        to: Address,
        clauseOptions?: ClauseOptions
    ): Clause {
        return Clause.transferToken(tokenAddress, to, this, clauseOptions);
    }
}

export { VTHO };

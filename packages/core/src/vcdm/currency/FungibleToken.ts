import { type FixedPointNumber } from '../FixedPointNumber';
import { type Txt } from '../Txt';
import { Coin } from './Coin';

/**
 * Represents a fungible token monetary amount.
 *
 * @extends Coin
 */
class FungibleToken extends Coin {
    /**
     * Wei default decimals.
     */
    private static readonly WEI_DEFAULT = 18n;

    /**
     * Wei number of fractional digits to express the token with.
     */
    private readonly _decimals: bigint;

    /**
     * Represents this monetary amount in terms of {@link Units.wei}.
     *
     * @type {bigint}
     */
    public readonly wei: bigint;

    protected constructor(
        symbol: Txt,
        value: FixedPointNumber,
        decimals: bigint = FungibleToken.WEI_DEFAULT
    ) {
        super(symbol, value);
        this._decimals = decimals;
        this.wei = value.dp(this._decimals).scaledValue;
    }
}

export { FungibleToken };

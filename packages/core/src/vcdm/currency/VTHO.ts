import { Coin } from './Coin';
import { Txt } from '../Txt';
import { type FPN } from '../FPN';

/**
 * Represents a
 * [VeChain VeThor](https://docs.vechain.org/introduction-to-vechain/dual-token-economic-model/vethor-vtho)
 * monetary amount.
 *
 * @extends Coin
 */
class VTHO extends Coin {
    /**
     * Create a new instance with the given `value`.
     *
     * @param {FPN} value - The value to be used for initializing the instance.
     */
    protected constructor(value: FPN) {
        super(Txt.of('𝕍THO'), value);
    }

    /**
     * Return a new instance of VET using the provided FPN `value`.
     *
     * @param {FPN} value - The FPN value to be used for creating a VTHO instance.
     * @return {VTHO} The newly created instance of VET.
     */
    public static of(value: FPN): VTHO {
        return new VTHO(value);
    }
}

export { VTHO };

import { Coin } from './Coin';
import { Txt } from '../Txt';
import { type FPN } from '../FPN';

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
     * Create a new instance with the given `value`.
     *
     * @param {FPN} value - The value to be used for initializing the instance.
     */
    protected constructor(value: FPN) {
        super(VET.CODE, value);
    }

    /**
     * Return a new instance of VET using the provided FPN `value`.
     *
     * @param {FPN} value - The FPN value to be used for creating a VET instance.
     * @return {VET} The newly created instance of VET.
     */
    public static of(value: FPN): VET {
        return new VET(value);
    }
}

export { VET };

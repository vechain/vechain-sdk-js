import { Coin } from './Coin';
import { Txt } from '../Txt';
import { type FPN } from '../FPN';

class VET extends Coin {
    protected constructor(value: FPN) {
        super(Txt.of('𝕍ΞT'), value);
    }

    public static of(value: FPN): VET {
        return new VET(value);
    }
}

export { VET };

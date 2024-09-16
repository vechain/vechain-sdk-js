import { Coin } from './Coin';
import { Txt } from '../Txt';
import { type FPN } from '../FPN';

class VTHO extends Coin {
    protected constructor(value: FPN) {
        super(Txt.of('𝕍THO'), value);
    }

    public static of(value: FPN): VTHO {
        return new VTHO(value);
    }
}

export { VTHO };

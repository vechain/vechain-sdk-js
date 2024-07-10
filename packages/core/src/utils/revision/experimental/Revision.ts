import { HEX } from '../../hex';
import { assert, DATA } from '@vechain/sdk-errors';

class Revision extends String {
    private static readonly REGEX_REVISION = /^(best|finalized|\d+)$/;

    public static isValid(value: HEX | number | string): boolean {
        switch (typeof value) {
            case 'number':
                return value >= 0;
            case 'string':
                return Revision.REGEX_REVISION.test(value);
            default:
                return true;
        }
    }

    public static of(value: HEX | number | string): Revision {
        assert(
            'Revision.of',
            this.isValid(value),
            DATA.INVALID_DATA_TYPE,
            'value is not a Revision expression',
            { value }
        );
        return new Revision(
            value instanceof HEX ? value.n.toString() : value.toString()
        );
    }
}

export { Revision };

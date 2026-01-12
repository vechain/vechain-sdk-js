import { InvalidThorestResponseError } from '@common/errors';
import { UInt } from '@common/vcdm';
import { type StatusJSON } from '@thor/thorest/json';

/**
 * [Status](http://localhost:8669/doc/stoplight-ui/#/schemas/Status)
 */
class Status {
    /**
     * The total number of transactions currently in the txpool
     */
    readonly total: number;

    constructor(json: StatusJSON) {
        try {
            this.total = UInt.of(json.total).valueOf();
        } catch (error) {
            throw new InvalidThorestResponseError(
                `Status.constructor`,
                'Bad parse',
                { json },
                error instanceof Error ? error : undefined
            );
        }
    }

    toJSON(): StatusJSON {
        return {
            total: this.total
        };
    }
}

export { Status };

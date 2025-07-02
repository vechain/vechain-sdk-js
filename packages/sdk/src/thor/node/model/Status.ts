import { UInt } from '@vcdm';
import { type StatusJSON } from '@thor/json';
import { IllegalArgumentError } from '@errors';

/**
 * Full-Qualified-Path
 */
const FQP = 'packages/core/src/thor/node/Status.ts!';

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
            throw new IllegalArgumentError(
                `${FQP}constructor(json: StatusJSON)`,
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

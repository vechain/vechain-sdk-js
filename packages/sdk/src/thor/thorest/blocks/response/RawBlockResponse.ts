import { Hex } from '@common/vcdm';
import { type RawBlockJSON } from '../json/RawBlockJSON';
import { IllegalArgumentError } from '@common/errors';

const FQP =
    'packages/sdk/src/thor/thorest/blocks/response/RawBlockResponse.ts!';

/**
 * Type checked response for raw block.
 */
class RawBlockResponse {
    readonly raw: Hex;

    /**
     * Constructor from JSON.
     */
    constructor(json: RawBlockJSON) {
        try {
            this.raw = Hex.of(json.raw);
        } catch (error) {
            throw new IllegalArgumentError(
                `${FQP}constructor(json: RawBlockJSON)`,
                'Bad parse',
                { json },
                error instanceof Error ? error : undefined
            );
        }
    }

    /**
     * Convert to JSON.
     */
    toJSON(): RawBlockJSON {
        return {
            raw: this.raw.toString()
        } satisfies RawBlockJSON;
    }
}

export { RawBlockResponse };

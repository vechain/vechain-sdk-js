import { Hex } from '@common/vcdm';
import { type RawBlockJSON } from '../json/RawBlockJSON';
import { InvalidThorestResponseError } from '@common/errors/thorest';

/**
 * Raw Block Response
 */
class RawBlockResponse {
    readonly raw: Hex;

    /**
     * Constructs a new instance of the class using the provided JSON object.
     *
     * @param {RawBlockJSON} json - The JSON object used to initialize the instance.
     * @throws {InvalidThorestResponseError} Thrown if an error occurs during parsing.
     */
    constructor(json: RawBlockJSON) {
        try {
            this.raw = Hex.of(json.raw);
        } catch (error) {
            throw new InvalidThorestResponseError(
                'RawBlockResponse.constructor',
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

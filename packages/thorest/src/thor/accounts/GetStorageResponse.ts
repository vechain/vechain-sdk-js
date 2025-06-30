import { type GetStorageResponseJSON } from './GetStorageResponseJSON';
import { IllegalArgumentError, ThorId } from '@vechain/sdk-core';

/**
 * Full-Qualified Path
 */
const FQP = 'packages/thorest/src/thor/accounts/GetStorageResponse.ts!';

/**
 * Get Storage Response
 *
 * [GetStorageResponse](http://localhost:8669/doc/stoplight-ui/#/schemas/GetStorageResponse)
 *
 * Represents a storage response containing the value at a storage position.
 */
class GetStorageResponse {
    /**
     * The value at the storage position.
     */
    readonly value: ThorId;

    /**
     * Constructs a new instance of the class by parsing the provided JSON object.
     *
     * @param {GetStorageResponseJSON} json - The JSON object containing storage response data.
     * @throws {IllegalArgumentError} If the parsing of the JSON object fails.
     */
    constructor(json: GetStorageResponseJSON) {
        try {
            this.value = ThorId.of(json.value);
        } catch (error) {
            throw new IllegalArgumentError(
                `${FQP}constructor(json: GetStorageResponseJSON)`,
                'Bad parse',
                { json },
                error instanceof Error ? error : undefined
            );
        }
    }

    /**
     * Converts the current storage response data into a JSON representation.
     *
     * @returns {GetStorageResponseJSON} A JSON object containing the storage response data.
     */
    toJSON(): GetStorageResponseJSON {
        return {
            value: this.value.toString()
        } satisfies GetStorageResponseJSON;
    }
}

export { GetStorageResponse };

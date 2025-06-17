import { GetStorageResponseJSON } from './GetStorageResponseJSON';
import { IllegalArgumentError, ThorId } from '@vechain/sdk-core';

/**
 * Full-Qualified Path
 */
const FQP = 'packages/thorest/src/thor/accounts/GetStorageResponse.ts!';

class GetStorageResponse {
    readonly value: ThorId;

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

    toJSON(): GetStorageResponseJSON {
        return {
            value: this.value.toString()
        } satisfies GetStorageResponseJSON;
    }
}

export { GetStorageResponse };

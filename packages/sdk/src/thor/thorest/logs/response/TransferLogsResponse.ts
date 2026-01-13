import { TransferLogResponse } from '@thor/thorest/logs';
import {
    type TransferLogResponseJSON,
    type TransferLogsResponseJSON
} from '@thor/thorest/json';
import { InvalidThorestResponseError } from '@common/errors';

class TransferLogsResponse extends Array<TransferLogResponse> {
    /**
     * Creates a new TransferLogsResponse instance.
     * Special constructor pattern required for Array inheritance.
     * Array constructor is first called with a length parameter,
     * so we need this pattern to properly handle array data instead.
     *
     * @param json - The JSON array containing transfer log data
     * @returns A new TransferLogsResponse instance containing TransferLogResponse objects
     * @throws InvalidThorestResponseError If the provided JSON object contains invalid or unparsable data.
     */
    constructor(json: TransferLogsResponseJSON) {
        super();
        try {
            return Object.setPrototypeOf(
                Array.from(json ?? [], (peerStat) => {
                    return new TransferLogResponse(peerStat);
                }),
                TransferLogsResponse.prototype
            ) as TransferLogsResponse;
        } catch (error) {
            throw new InvalidThorestResponseError(
                `TransferLogsResponse.constructor`,
                'Bad parse',
                { json },
                error instanceof Error ? error : undefined
            );
        }
    }

    /**
     * Converts the TransferLogsResponse instance to a JSON array
     * @returns {TransferLogsResponseJSON} An array of transfer logs in JSON format
     */
    toJSON(): TransferLogsResponseJSON {
        return this.map((response): TransferLogResponseJSON => {
            return response.toJSON();
        });
    }
}

export { TransferLogsResponse };

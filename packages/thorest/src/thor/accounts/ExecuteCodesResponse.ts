import { Gas, HexUInt, IllegalArgumentError } from '@vechain/sdk-core';
import { Transfer } from '@thor/model/Transfer';
import { Event, type EventJSON, type TransferJSON } from '@thor/model';
import { ExecuteCodeResponseJSON } from './ExecuteCodeResponseJSON';
import { ExecuteCodesResponseJSON } from './ExecuteCodesResponseJSON';

/**
 * Full-Qualified Path
 */
const FQP = 'packages/thorest/src/thor/accounts/ExecuteCodesResponse.ts!';

class ExecuteCodeResponse {
    readonly data: HexUInt;
    readonly events: Event[];
    readonly transfers: Transfer[];
    readonly gasUsed: Gas;
    readonly reverted: boolean;
    readonly vmError: string;

    constructor(json: ExecuteCodeResponseJSON) {
        try {
            this.data = HexUInt.of(json.data);
        this.events = json.events.map(
            (eventJSON: EventJSON): Event => new Event(eventJSON)
        );
        this.transfers = json.transfers.map(
            (transferJSON: TransferJSON): Transfer =>
                new Transfer(transferJSON)
        );
        this.gasUsed = Gas.of(json.gasUsed);
        this.reverted = json.reverted;
        this.vmError = json.vmError;
        } catch (error) {
            throw new IllegalArgumentError(
                `${FQP}constructor(json: ExecuteCodeResponseJSON)`,
                'Bad parse',
                { json },
                error instanceof Error ? error : undefined
            );
        }
    }

    toJSON(): ExecuteCodeResponseJSON {
        return {
            data: this.data.toString(),
            events: this.events.map(
                (event: Event): EventJSON => event.toJSON()
            ),
            transfers: this.transfers.map(
                (transfer: Transfer): TransferJSON => transfer.toJSON()
            ),
            gasUsed: this.gasUsed.valueOf(),
            reverted: this.reverted,
            vmError: this.vmError
        } satisfies ExecuteCodeResponseJSON;
    }
}

class ExecuteCodesResponse extends Array<ExecuteCodeResponse> {
    constructor(json: ExecuteCodesResponseJSON) {
        super(
            ...json.map(
                (json: ExecuteCodeResponseJSON): ExecuteCodeResponse =>
                    new ExecuteCodeResponse(json)
            )
        );
    }
}

export {
    ExecuteCodeResponse,
    ExecuteCodesResponse
};

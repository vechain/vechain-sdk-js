import { Gas, HexUInt } from '@vechain/sdk-core';
import { Transfer } from '@thor/model/Transfer';
import { Event, type EventJSON, type TransferJSON } from '@thor/model';

class ExecuteCodeResponse {
    readonly data: HexUInt;
    readonly events: Event[];
    readonly transfers: Transfer[];
    readonly gasUsed: Gas;
    readonly reverted: boolean;
    readonly vmError: string;

    constructor(json: ExecuteCodeResponseJSON) {
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

interface ExecuteCodeResponseJSON {
    data: string;
    events: EventJSON[];
    transfers: TransferJSON[];
    gasUsed: number;
    reverted: boolean;
    vmError: string;
}

interface ExecuteCodesResponseJSON extends Array<ExecuteCodeResponseJSON> {}

export {
    ExecuteCodeResponse,
    ExecuteCodesResponse,
    type ExecuteCodeResponseJSON,
    type ExecuteCodesResponseJSON
};

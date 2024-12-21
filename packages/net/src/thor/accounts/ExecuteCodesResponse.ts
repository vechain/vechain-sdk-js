import {
    Event,
    type EventJSON,
    Transfer,
    type TransferJSON
} from '../transactions';
import { HexUInt, VTHO } from '@vechain/sdk-core';

class ExecuteCodeResponse {
    readonly data: HexUInt;
    readonly events: Event[];
    readonly transfers: Transfer[];
    readonly gasUsed: VTHO;
    readonly reverted: boolean;
    readonly vmError: string;

    constructor(json: ExecuteCodeResponseJSON) {
        this.data = HexUInt.of(json.data);
        this.events = json.events.map(
            (eventJSON: EventJSON): Event => new Event(eventJSON)
        );
        this.transfers = json.transfers.map(
            (transferJSON: TransferJSON): Transfer => new Transfer(transferJSON)
        );
        this.gasUsed = VTHO.of(json.gasUsed);
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
            gasUsed: Number(this.gasUsed.wei),
            reverted: this.reverted,
            vmError: this.vmError
        } satisfies ExecuteCodeResponseJSON;
    }
}

class ExecuteCodesResponse extends Array<ExecuteCodeResponse> {}

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

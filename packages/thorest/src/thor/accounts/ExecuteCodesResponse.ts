import { Transfer, type TransferJSON, XEvent, type XEventJSON } from '@thor';
import { Gas, HexUInt } from '@vechain/sdk-core';

class ExecuteCodeResponse {
    readonly data: HexUInt;
    readonly events: XEvent[];
    readonly transfers: Transfer[];
    readonly gasUsed: Gas;
    readonly reverted: boolean;
    readonly vmError: string;

    constructor(json: ExecuteCodeResponseJSON) {
        this.data = HexUInt.of(json.data);
        this.events = json.events.map(
            (eventJSON: XEventJSON): XEvent => new XEvent(eventJSON)
        );
        this.transfers = json.transfers.map(
            (transferJSON: TransferJSON): Transfer => new Transfer(transferJSON)
        );
        this.gasUsed = Gas.of(json.gasUsed);
        this.reverted = json.reverted;
        this.vmError = json.vmError;
    }

    toJSON(): ExecuteCodeResponseJSON {
        return {
            data: this.data.toString(),
            events: this.events.map(
                (event: XEvent): XEventJSON => event.toJSON()
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
    events: XEventJSON[];
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

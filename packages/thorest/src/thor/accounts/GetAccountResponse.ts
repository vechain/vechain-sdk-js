import { Quantity, Units, VET, VTHO } from '@vechain/sdk-core';

class GetAccountResponse {
    readonly balance: VET;
    readonly energy: VTHO;
    readonly hasCode: boolean;

    constructor(json: GetAccountResponseJSON) {
        this.balance = VET.of(json.balance, Units.wei);
        this.energy = VTHO.of(json.energy, Units.wei);
        this.hasCode = json.hasCode;
    }

    toJSON(): GetAccountResponseJSON {
        return {
            balance: Quantity.of(this.balance.wei).toString(),
            energy: Quantity.of(this.energy.wei).toString(),
            hasCode: this.hasCode
        };
    }
}

interface GetAccountResponseJSON {
    balance: string;
    energy: string;
    hasCode: boolean;
}

export { GetAccountResponse, type GetAccountResponseJSON };

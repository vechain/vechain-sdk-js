import { Quantity, VET, VTHO } from '@vechain/sdk-core';

class GetAccountResponse {
    balance: VET;
    energy: VTHO;
    hasCode: boolean;

    constructor(json: GetAccountResponseJSON) {
        this.balance = VET.of(json.balance);
        this.energy = VTHO.of(json.energy);
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

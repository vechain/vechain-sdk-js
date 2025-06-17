import {
    IllegalArgumentError,
    Quantity,
    Units,
    VET,
    VTHO
} from '@vechain/sdk-core';
import { GetAccountResponseJSON } from './GetAccountResponseJSON';

/**
 * Full-Qualified Path
 */
const FQP = 'packages/thorest/src/thor/accounts/GetAccountResponse.ts!';

class GetAccountResponse {
    readonly balance: VET;
    readonly energy: VTHO;
    readonly hasCode: boolean;

    constructor(json: GetAccountResponseJSON) {
        try {
            this.balance = VET.of(json.balance, Units.wei);
            this.energy = VTHO.of(json.energy, Units.wei);
            this.hasCode = json.hasCode;
        } catch (error) {
            throw new IllegalArgumentError(
                `${FQP}constructor(json: GetAccountResponseJSON)`,
                'Bad parse',
                { json },
                error instanceof Error ? error : undefined
            );
        }
    }

    toJSON(): GetAccountResponseJSON {
        return {
            balance: Quantity.of(this.balance.wei).toString(),
            energy: Quantity.of(this.energy.wei).toString(),
            hasCode: this.hasCode
        };
    }
}

export { GetAccountResponse };

import {
    Hex,
    IllegalArgumentError,
    Quantity,
} from '@vechain/sdk-core';
import { GetAccountResponseJSON } from './GetAccountResponseJSON';

/**
 * Full-Qualified Path
 */
const FQP = 'packages/thorest/src/thor/accounts/GetAccountResponse.ts!';

class GetAccountResponse {
    readonly balance: bigint;
    readonly energy: bigint;
    readonly hasCode: boolean;

    constructor(json: GetAccountResponseJSON) {
        try {
            this.balance = Hex.of(json.balance).bi;
            this.energy = Hex.of(json.energy).bi;
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
            balance: Quantity.of(this.balance).toString(),
            energy: Quantity.of(this.energy).toString(),
            hasCode: this.hasCode
        };
    }
}

export { GetAccountResponse };

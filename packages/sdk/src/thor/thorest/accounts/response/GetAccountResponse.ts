import { Hex, Quantity } from '@common/vcdm';
import { type GetAccountResponseJSON } from '@thor/thorest/json';
import { IllegalArgumentError } from '@common/errors';

/**
 * Full-Qualified Path
 */
const FQP = 'packages/sdk/src/thor/accounts/GetAccountResponse.ts!';

/**
 * Get Account Response
 *
 * Represents an account response containing balance, energy and code information.
 *
 * [GetAccountResponse](http://localhost:8669/doc/stoplight-ui/#/schemas/GetAccountResponse)
 */
class GetAccountResponse {
    /**
     * The balance of the account.
     */
    readonly balance: bigint;

    /**
     * The energy of the account.
     */
    readonly energy: bigint;

    /**
     * Whether the account has code.
     */
    readonly hasCode: boolean;

    /**
     * Constructs a new instance of the class by parsing the provided JSON object.
     *
     * @param {GetAccountResponseJSON} json - The JSON object containing account response data.
     * @throws {IllegalArgumentError} If the parsing of the JSON object fails.
     */
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

    /**
     * Converts the current account response data into a JSON representation.
     *
     * @returns {GetAccountResponseJSON} A JSON object containing the account response data.
     */
    toJSON(): GetAccountResponseJSON {
        return {
            balance: Quantity.of(this.balance).toString(),
            energy: Quantity.of(this.energy).toString(),
            hasCode: this.hasCode
        };
    }
}

export { GetAccountResponse };

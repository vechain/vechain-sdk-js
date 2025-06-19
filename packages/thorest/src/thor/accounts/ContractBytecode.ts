import { HexUInt, IllegalArgumentError } from '@vechain/sdk-core';
import { type ContractBytecodeJSON } from './ContractBytecodeJSON';

/**
 * Full-Qualified Path
 */
const FQP = 'packages/thorest/src/thor/accounts/ContractBytecode.ts!';

/**
 * [ContractBytecode](http://localhost:8669/doc/stoplight-ui/#/schemas/ContractBytecode)
 */
class ContractBytecode {
    /**
     * The bytecode of the contract.
     */
    readonly code: HexUInt;

    /**
     * Constructs a new instance of the class.
     *
     * @param {ContractBytecodeJSON} json - The JSON object to initialize the instance with.
     */
    constructor(json: ContractBytecodeJSON) {
        try {
            this.code = HexUInt.of(json.code);
        } catch (error) {
            throw new IllegalArgumentError(
                `${FQP}constructor(json: ContractBytecodeJSON)`,
                'Bad parse',
                { json },
                error instanceof Error ? error : undefined
            );
        }
    }

    /**
     * Converts the instance to a JSON object.
     *
     * @return {ContractBytecodeJSON} - The JSON object.
     */
    toJSON(): ContractBytecodeJSON {
        return {
            code: this.code.toString()
        };
    }
}

export { ContractBytecode };

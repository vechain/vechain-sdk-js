import { Hex, HexUInt } from '@vcdm';
import { type ContractBytecodeJSON } from './ContractBytecodeJSON';
import { IllegalArgumentError } from '@errors';
/**
 * Full-Qualified Path
 */
const FQP = 'packages/core/src/thor/accounts/ContractBytecode.ts!';

/**
 * Contract Bytecode
 *
 * Represents the bytecode of a contract.
 */
class ContractBytecode {
    /**
     * The contract bytecode.
     */
    readonly code: Hex;

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

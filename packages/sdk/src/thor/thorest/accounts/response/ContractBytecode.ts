import { type Hex, HexUInt } from '@common/vcdm';
import { type ContractBytecodeJSON } from '@thor/thorest/json';
import { InvalidThorestResponseError } from '@common/errors';

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
     * @throws {InvalidThorestResponseError} if the parsing of the JSON object fails.
     */
    constructor(json: ContractBytecodeJSON) {
        try {
            this.code = HexUInt.of(json.code);
        } catch (error) {
            throw new InvalidThorestResponseError(
                'ContractBytecode.constructor',
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

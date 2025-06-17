import { HexUInt, IllegalArgumentError } from '@vechain/sdk-core';
import { type ContractBytecodeJSON } from './ContractBytecodeJSON';

/**
 * Full-Qualified Path
 */
const FQP = 'packages/thorest/src/thor/accounts/ContractBytecode.ts!';

class ContractBytecode {
    readonly code: HexUInt;

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

    toJSON(): ContractBytecodeJSON {
        return {
            code: this.code.toString()
        };
    }
}

export { ContractBytecode, type ContractBytecodeJSON };

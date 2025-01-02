import { HexUInt } from '@vechain/sdk-core';

interface ContractBytecodeJSON {
    code: string;
}

class ContractBytecode {
    readonly code: HexUInt;

    constructor(json: ContractBytecodeJSON) {
        this.code = HexUInt.of(json.code);
    }

    toJSON(): ContractBytecodeJSON {
        return {
            code: this.code.toString()
        };
    }
}

export { ContractBytecode, type ContractBytecodeJSON };

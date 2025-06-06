import { type HttpClient, type HttpPath } from '@http';
import type { Address } from '@vechain/sdk-core';
import { ContractBytecode, type ContractBytecodeJSON } from '@thor/accounts';
import { type ThorRequest, type ThorResponse } from '@thor';
class RetrieveContractBytecode
    implements ThorRequest<RetrieveContractBytecode, ContractBytecode>
{
    readonly path: RetrieveContractBytecodePath;

    constructor(path: RetrieveContractBytecodePath) {
        this.path = path;
    }

    async askTo(
        httpClient: HttpClient
    ): Promise<ThorResponse<RetrieveContractBytecode, ContractBytecode>> {
        const response = await httpClient.get(this.path, { query: '' });
        const responseBody = (await response.json()) as ContractBytecodeJSON;
        return {
            request: this,
            response: new ContractBytecode(responseBody)
        };
    }

    static of(address: Address): RetrieveContractBytecode {
        return new RetrieveContractBytecode(
            new RetrieveContractBytecodePath(address)
        );
    }
}

class RetrieveContractBytecodePath implements HttpPath {
    readonly address: Address;

    constructor(address: Address) {
        this.address = address;
    }

    get path(): string {
        return `/accounts/${this.address}/code`;
    }
}

export { RetrieveContractBytecode, RetrieveContractBytecodePath };

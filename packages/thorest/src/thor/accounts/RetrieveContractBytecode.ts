import { type HttpClient, type HttpPath } from '@http';
import type { Address } from '@vechain/sdk-core';
import { ContractBytecode, type ContractBytecodeJSON } from '@thor/accounts';
import { ThorError, type ThorRequest, type ThorResponse } from '@thor';

/**
 * Full-Qualified Path
 */
const FQP = 'packages/thorest/src/thor/accounts/RetrieveContractBytecode.ts!';

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
        const fqp = `${FQP}askTo(httpClient: HttpClient): Promise<ThorResponse<RetrieveContractBytecode, ContractBytecode>>`;
        const response = await httpClient.get(this.path, { query: '' });
        if (response.ok) {
            const json = (await response.json()) as ContractBytecodeJSON;
            try {
                return {
                    request: this,
                    response: new ContractBytecode(json)
                };
            } catch (error) {
                throw new ThorError(
                    fqp,
                    'Bad response.',
                    {
                        url: response.url,
                        body: json
                    },
                    error instanceof Error ? error : undefined,
                    response.status
                );
            }
        }
        throw new ThorError(
            fqp,
            'Bad response.',
            {
                url: response.url
            },
            undefined,
            response.status
        );
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

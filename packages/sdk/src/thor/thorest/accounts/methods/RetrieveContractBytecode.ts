import { type HttpClient, type HttpPath } from '@http';
import type { Address } from '@common/vcdm';
import { type ContractBytecodeJSON } from '@thor/thorest/json';
import { ContractBytecode } from '@thor';
import { ThorError, type ThorRequest, type ThorResponse } from '@thor';

/**
 * Full-Qualified Path
 */
const FQP = 'packages/sdk/src/thor/accounts/RetrieveContractBytecode.ts!';

/**
 * [Retrieve a contract bytecode](http://localhost:8669/doc/stoplight-ui/#/paths/accounts-address--code/get)
 *
 * Retrieve the bytecode of a contract identified by its address.
 */
class RetrieveContractBytecode
    implements ThorRequest<RetrieveContractBytecode, ContractBytecode>
{
    /**
     * Represents the HTTP path for this specific API endpoint.
     */
    private readonly path: RetrieveContractBytecodePath;

    /**
     * Constructs an instance of the class with the specified HTTP path.
     *
     * @param {HttpPath} path - The HTTP path to initialize the instance with.
     */
    protected constructor(path: RetrieveContractBytecodePath) {
        this.path = path;
    }

    /**
     * Asynchronously fetches and processes a block response using the provided HTTP client.
     *
     * @param {HttpClient} httpClient - An HTTP client used to perform the request.
     * @return {Promise<ThorResponse<RetrieveContractBytecode, ContractBytecode>>}
     * Returns a promise that resolves to a ThorResponse containing the requested block.
     * @throws ThorError if the response is invalid or the request fails.
     */
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

    /**
     * Creates an instance of RetrieveContractBytecode using the provided address.
     *
     * @param {Address} address - The address used to generate the contract bytecode's path.
     * @return {RetrieveContractBytecode} A new instance of RetrieveContractBytecode with the specified path.
     */
    static of(address: Address): RetrieveContractBytecode {
        return new RetrieveContractBytecode(
            new RetrieveContractBytecodePath(address)
        );
    }
}

/**
 * Retrieve Contract Bytecode Path
 *
 * Represents the path for retrieving the bytecode of a contract.
 */
class RetrieveContractBytecodePath implements HttpPath {
    /**
     * Represents the address of the contract.
     */
    readonly address: Address;

    /**
     * Constructs an instance of the class with the specified address.
     */
    constructor(address: Address) {
        this.address = address;
    }

    /**
     * Returns the path for retrieving the bytecode of a contract.
     *
     * @returns {string} The path for retrieving the bytecode of a contract.
     */
    get path(): string {
        return `/accounts/${this.address}/code`;
    }
}

export { RetrieveContractBytecode, RetrieveContractBytecodePath };

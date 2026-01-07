import type { HttpQuery, HttpClient, HttpPath } from '@common/http';
import type { Address, Revision } from '@common/vcdm';
import { type ContractBytecodeJSON } from '@thor/thorest/json';
import { ContractBytecode } from '@thor/thorest';
import { type ThorRequest, type ThorResponse } from '@thor/thorest';
import { parseResponseHandler } from '@thor/thorest/utils/ParseResponseHandler';

/**
 * [Retrieve a contract bytecode](http://localhost:8669/doc/stoplight-ui/#/paths/accounts-address--code/get)
 *
 * Retrieve the bytecode of a contract identified by its address.
 */
class RetrieveContractBytecode implements ThorRequest<
    RetrieveContractBytecode,
    ContractBytecode
> {
    /**
     * Represents the HTTP path for this specific API endpoint.
     */
    private readonly path: RetrieveContractBytecodePath;

    /**
     * Represents the HTTP query for this specific API endpoint.
     */
    private readonly query: RetrieveContractBytecodeQuery;

    /**
     * Constructs an instance of the class with the specified HTTP path.
     *
     * @param {HttpPath} path - The HTTP path to initialize the instance with.
     */
    protected constructor(
        path: RetrieveContractBytecodePath,
        query: RetrieveContractBytecodeQuery
    ) {
        this.path = path;
        this.query = query;
    }

    /**
     * Fetches and processes a contract bytecode response using the provided HTTP client.
     *
     * @param {HttpClient} httpClient - An HTTP client used to perform the request.
     * @return {Promise<ThorResponse<RetrieveContractBytecode, ContractBytecode>>}
     * Returns a promise that resolves to a ThorResponse containing the requested contract bytecode.
     */
    async askTo(
        httpClient: HttpClient
    ): Promise<ThorResponse<RetrieveContractBytecode, ContractBytecode>> {
        const fqp = 'RetrieveContractBytecode.askTo';
        // do http get request - this will throw an error if the request fails
        const response = await httpClient.get(this.path, this.query);
        // parse the not nullable response - this will throw an error if the response cannot be parsed
        const contractBytecode = await parseResponseHandler<
            ContractBytecode,
            ContractBytecodeJSON
        >(fqp, response, ContractBytecode, false);
        // return a thor response
        return {
            request: this,
            response: contractBytecode
        };
    }

    /**
     * Creates an instance of RetrieveContractBytecode using the provided address.
     *
     * @param {Address} address - The address used to generate the contract bytecode's path.
     * @return {RetrieveContractBytecode} A new instance of RetrieveContractBytecode with the specified path.
     */
    static of(address: Address, revision?: Revision): RetrieveContractBytecode {
        return new RetrieveContractBytecode(
            new RetrieveContractBytecodePath(address),
            new RetrieveContractBytecodeQuery(revision)
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

/**
 * Retrieve Contract Bytecode Query
 *
 * Represents a query for retrieving contract bytecode with optional revision parameter.
 */
class RetrieveContractBytecodeQuery implements HttpQuery {
    /**
     * Represents the revision of the query.
     */
    private readonly revision?: Revision;

    /**
     * Constructs an instance of the class with an optional revision.
     *
     * @param {Revision} [revision] - The revision to be set. If not provided, no revision query parameter will be added.
     */
    constructor(revision?: Revision) {
        this.revision = revision;
    }

    /**
     * Returns the query string for the revision.
     *
     * @returns {string} The query string for the revision, or empty string if no revision is set.
     */
    get query(): string {
        return this.revision != null ? `?revision=${this.revision}` : '';
    }
}

export {
    RetrieveContractBytecode,
    RetrieveContractBytecodePath,
    RetrieveContractBytecodeQuery
};

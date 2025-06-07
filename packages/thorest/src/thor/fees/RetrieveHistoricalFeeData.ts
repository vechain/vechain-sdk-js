import {
    GetFeesHistoryResponse,
    type GetFeesHistoryResponseJSON,
    ThorError,
    type ThorRequest,
    type ThorResponse
} from '@thor';
import { type HttpClient, type HttpPath, type HttpQuery } from '@http';
import { Hex, HexUInt32, Revision } from '@vechain/sdk-core';

/**
 * Full-Qualified Path
 */
const FQP = 'packages/thorest/src/thor/fees/RetrieveHistoricaFeeData.ts!';

/**
 * [Retrieve historical fee data](http://localhost:8669/doc/stoplight-ui/#/paths/fees-history/get)
 */
class RetrieveHistoricalFeeData
    implements ThorRequest<RetrieveHistoricalFeeData, GetFeesHistoryResponse> {
    /**
     * Represents the API endpoint or resource path used for priority-fee-related operations.
     */
    protected static readonly PATH: HttpPath = { path: '/fees/history' };

    /**
     * Represents the HTTP query configuration for a specific API endpoint.
     */
    protected readonly query: Query;

    /**
     * Constructs a new instance of the class.
     *
     * @param {Query} query - The query object used to initialize the instance.
     * @return {void} This constructor does not return a value.
     */
    protected constructor(query: Query) {
        this.query = query;
    }

    /**
     * Send a request to retrieve historical fee data.
     *
     * @param {HttpClient} httpClient - The HTTP client used to send the request.
     * @return {Promise<ThorResponse<RetrieveHistoricalFeeData, GetFeesHistoryResponse>>} A promise that resolves with the response containing the historical fee data or rejects with an error.
     */
    async askTo(
        httpClient: HttpClient
    ): Promise<
        ThorResponse<RetrieveHistoricalFeeData, GetFeesHistoryResponse>
    > {
        const fqp = `${FQP}askTo(httpClient: HttpClient: Promise<ThorResponse<RetrieveHistoricaFeeData, GetFeesHistoryResponse>>`;
        const response = await httpClient.get(
            RetrieveHistoricalFeeData.PATH,
            this.query
        );
        if (response.ok) {
            const json = (await response.json()) as GetFeesHistoryResponseJSON;
            try {
                return {
                    request: this,
                    response: new GetFeesHistoryResponse(json)
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
        } else {
            throw new ThorError(
                fqp,
                await response.text(),
                {
                    url: response.url
                },
                undefined,
                response.status
            );
        }
    }

    /**
     * Creates a new instance of RetrieveHistoricaFeeData for the given block count.
     *
     * @param {number} blockCount - The number of blocks to be retrieved for historical fee data.
     * @return {RetrieveHistoricalFeeData} An instance of `RetrieveHistoricaFeeData` initialized with the specified block count.
     * @throws {ThorError} If an error occurs if `blockCount` is not a positive integer.
     */
    static of(blockCount: number): RetrieveHistoricalFeeData {
        try {
            return new RetrieveHistoricalFeeData(
                new Query(blockCount, Revision.BEST, [])
            );
        } catch (error) {
            throw new ThorError(
                `${FQP}of(blockCount: number): RetrieveHistoricaFeeData`,
                'Invalid blockCount.',
                {
                    blockCount
                },
                error instanceof Error ? error : undefined
            );
        }
    }

    /**
     * Specify either best, justified, finalized, next, a block number or block ID.
     * If omitted, the best block is assumed.
     *
     * @param {Revision} [newestBlock=Revision.BEST] - The block revision to be used. Defaults to `Revision.BEST` if not provided.
     * @return {RetrieveHistoricalFeeData} An instance of `RetrieveHistoricaFeeData` initialized with the given block revision.
     * @throws {ThorError} If the provided newest block is invalid.
     */
    withNewestBlock(
        newestBlock: Hex | Revision = Revision.BEST
    ): RetrieveHistoricalFeeData {
        try {
            return new RetrieveHistoricalFeeData(
                new Query(
                    this.query.blockCount,
                    newestBlock,
                    this.query.rewardPercentiles
                )
            );
        } catch (error) {
            throw new ThorError(
                `${FQP}withNewestBlock(newestBlock: Revision): RetrieveHistoricaFeeData`,
                'Invalid newestBlock.',
                {
                    newestBlock: newestBlock.toString()
                },
                error instanceof Error ? error : undefined
            );
        }
    }

    /**
     * Set the percentiles of the rewards to be returned.
     * Each percentile value must be between 0 and 100.
     * This method sorts the percentiles, the results aare returned according
     * to ascending percentile value.
     *
     * @param {number[]} rewardPercentiles - An array of numbers representing the reward percentiles to configure.
     * Defaults to an empty array if not provided.
     * @return {RetrieveHistoricalFeeData} An instance of `RetrieveHistoricaFeeData` containing` the updated reward percentiles and related data.
     * @throws {ThorError} If the provided rewardPercentiles are invalid or if an unexpected error occurs during processing.
     */
    withRewardPercentiles(
        rewardPercentiles: number[] = []
    ): RetrieveHistoricalFeeData {
        try {
            return new RetrieveHistoricalFeeData(
                new Query(
                    this.query.blockCount,
                    this.query.newestBlock,
                    rewardPercentiles.toSorted((a, b) => a - b)
                )
            );
        } catch (error) {
            throw new ThorError(
                `${FQP}withRewardPercentiles(rewardPercentiles: number[]): RetrieveHistoricaFeeData`,
                'Invalid rewardPercentiles.',
                {
                    rewardPercentiles
                },
                error instanceof Error ? error : undefined
            );
        }
    }
}

/**
 * Represents a query for retrieving block, revision, and reward percentile information from a server.
 * The class is designed to be used with HTTP requests and provides a structured query string.
 */
class Query implements HttpQuery {
    /**
     * The number of blocks to be returned.
     */
    readonly blockCount: number;

    /**
     * Specify either best, justified, finalized, next, a block number or block ID.
     */
    readonly newestBlock: HexUInt32 | Revision;

    /**
     * The percentiles of the rewards to be returned.
     */
    readonly rewardPercentiles: number[];

    /**
     * Constructs an instance of the class.
     *
     * @param {UInt} blockCount - The total number of blocks.
     * @param {Revision} newestBlock - The most recent block information.
     * @param {number[]} rewardPercentiles - The reward percentiles data.
     * @return {void}
     */
    constructor(
        blockCount: number,
        newestBlock: HexUInt32 | Revision,
        rewardPercentiles: number[]
    ) {
        this.blockCount = blockCount;
        this.newestBlock = newestBlock;
        this.rewardPercentiles = rewardPercentiles;
    }

    /**
     * Constructs and returns a query string based on block count, newest block, and reward percentiles.
     *
     * @return {string} The constructed query string.
     */
    get query(): string {
        const rewardPercentiles =
            this.rewardPercentiles.length > 0
                ? `&rewardPercentiles=${this.rewardPercentiles.join(',')}`
                : '';
        return `?blockCount=${this.blockCount}&newestBlock=${this.newestBlock}${rewardPercentiles}`;
    }
}

export { RetrieveHistoricalFeeData };

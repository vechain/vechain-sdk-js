import {
    type Address,
    type BlockId,
    BlocksSubscription,
    type ExecuteCodesResponse,
    type ExpandedBlockResponse,
    FetchHttpClient,
    type GetFeesHistoryResponse,
    type GetFeesPriorityResponse,
    type Hex,
    InspectClauses,
    type RawTx,
    type RegularBlockResponse,
    RetrieveAccountDetails,
    RetrieveExpandedBlock,
    RetrieveHistoricalFeeData,
    RetrieveRawBlock,
    RetrieveRegularBlock,
    Revision,
    SuggestPriorityFee,
    type ThorNetworks
} from '@index';
import { type ExecuteCodesRequestJSON } from '@json';
import { MozillaWebSocketClient } from '@ws';

interface PublicClientConfig {
    chain: ThorNetworks;
}

enum BlockReponseType {
    raw = 'raw', // vechain specific
    expanded = 'expanded', // vechain specific
    regular = 'regular' // vechain specific
}

// Revision type for viem
type BlockRevision = bigint | number | string | Uint8Array | Hex;

function createPublicClient(params: PublicClientConfig): PublicClient {
    return new PublicClient(params.chain);
}

class PublicClient {
    readonly httpClient: ThorNetworks;

    constructor(httpClient: ThorNetworks) {
        this.httpClient = httpClient; // viem specific
    }

    public async getBalance(address: Address): Promise<bigint> {
        const accountDetails = await RetrieveAccountDetails.of(address).askTo(
            FetchHttpClient.at(this.httpClient)
        );
        const balance = accountDetails.response.balance;
        return balance;
    }

    public async getBlock(
        revision: BlockRevision = 'best', // viem specific
        type: BlockReponseType = BlockReponseType.regular // vechain specific
    ): Promise<ExpandedBlockResponse | RawTx | RegularBlockResponse | null> {
        if (type === BlockReponseType.expanded) {
            const data = await RetrieveExpandedBlock.of(
                Revision.of(revision)
            ).askTo(FetchHttpClient.at(this.httpClient));
            return data.response;
        } else if (type === BlockReponseType.raw) {
            const data = await RetrieveRawBlock.of(Revision.of(revision)).askTo(
                FetchHttpClient.at(this.httpClient)
            );
            return data.response;
        } else {
            const data = await RetrieveRegularBlock.of(
                Revision.of(revision)
            ).askTo(FetchHttpClient.at(this.httpClient));
            return data.response;
        }
    }

    public async getBlockNumber(
        revision: BlockRevision = 'best' // viem specific
    ): Promise<number | undefined> {
        const selectedBlock = await RetrieveRegularBlock.of(
            Revision.of(revision)
        ).askTo(FetchHttpClient.at(this.httpClient));
        const blockNumber = selectedBlock?.response?.number;
        return blockNumber;
    }

    public async getBlockTransactionCount(
        revision: BlockRevision = 'best' // viem specific
    ): Promise<number | undefined> {
        const selectedBlock = await RetrieveRegularBlock.of(
            Revision.of(revision)
        ).askTo(FetchHttpClient.at(this.httpClient));
        const trxCount = selectedBlock?.response?.transactions.length;

        return trxCount;
    }

    public watchBlocks(pos: BlockId): BlocksSubscription {
        return BlocksSubscription.at(
            new MozillaWebSocketClient(
                `ws://${FetchHttpClient.at(this.httpClient).baseURL}`
            )
        ).atPos(pos);
    }

    public watchBlockNumber(): BlocksSubscription {
        return BlocksSubscription.at(
            new MozillaWebSocketClient(
                `ws://${FetchHttpClient.at(this.httpClient).baseURL}`
            )
        );
    }

    public async simulateCalls(
        request: ExecuteCodesRequestJSON
    ): Promise<ExecuteCodesResponse> {
        // this and call are the same because ETH doesn't support multi-call and they have explicit functions for this.
        // viem specific
        const inspectClause = await InspectClauses.of(request).askTo(
            FetchHttpClient.at(this.httpClient)
        );
        const clause = inspectClause.response;
        return clause;
    }

    // eslint-disable-next-line sonarjs/no-identical-functions
    public async call(
        request: ExecuteCodesRequestJSON
    ): Promise<ExecuteCodesResponse> {
        // viem specific
        const inspectClause = await InspectClauses.of(request).askTo(
            FetchHttpClient.at(this.httpClient)
        );
        const clause = inspectClause.response;
        return clause;
    }

    public async getFeeHistory(
        blockCount: number
    ): Promise<GetFeesHistoryResponse> {
        // viem specific
        const data = await RetrieveHistoricalFeeData.of(blockCount).askTo(
            FetchHttpClient.at(this.httpClient)
        );
        return data.response;
    }

    public async getGasPrice(): Promise<bigint[]> {
        // viem specific
        const lastBlock = await RetrieveHistoricalFeeData.of(1).askTo(
            FetchHttpClient.at(this.httpClient)
        );
        const lastBaseFeePerGas = lastBlock.response.baseFeePerGas;
        return lastBaseFeePerGas;
    }

    public async estimateFeePerGas(): Promise<bigint | undefined> {
        // viem specific
        const lastRevision = await RetrieveRegularBlock.of(Revision.BEST).askTo(
            FetchHttpClient.at(this.httpClient)
        );
        const lastBaseFeePerGas = lastRevision?.response?.baseFeePerGas;
        return lastBaseFeePerGas;
    }

    public async estimateGas(
        request: ExecuteCodesRequestJSON
    ): Promise<ExecuteCodesResponse> {
        // viem specific
        const inspectClause = await InspectClauses.of(request).askTo(
            FetchHttpClient.at(this.httpClient)
        );
        const gasUsedArray = inspectClause.response;
        return gasUsedArray;
    }

    public async estimateMaxPriorityFeePerGas(): Promise<GetFeesPriorityResponse> {
        // viem specific
        const data = await SuggestPriorityFee.of().askTo(
            FetchHttpClient.at(this.httpClient)
        );
        return data.response;
    }
}

export { PublicClient, createPublicClient };

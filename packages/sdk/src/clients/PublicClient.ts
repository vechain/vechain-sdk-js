import {
    Address,
    BlockId,
    BlocksSubscription,
    FetchHttpClient,
    Hex,
    InspectClauses,
    Query,
    RetrieveAccountDetails,
    RetrieveExpandedBlock,
    RetrieveHistoricalFeeData,
    RetrieveRawBlock,
    RetrieveRegularBlock,
    Revision,
    SuggestPriorityFee,
    ThorNetworks
} from '@index';
import { ExecuteCodesRequestJSON } from '@json';
import { MozillaWebSocketClient } from '@ws';

interface PublicClientConfig {
    chain: ThorNetworks;
}

enum BlockReponseType {
    raw = 'raw', // vechain specific
    expanded = 'expanded', // vechain specific
    regular = 'regular' // vechain specific
}

function createPublicClient(params: PublicClientConfig): PublicClient {
    return new PublicClient(params.chain);
}

class PublicClient {
    readonly httpClient: ThorNetworks;

    constructor(httpClient: ThorNetworks) {
        this.httpClient = httpClient; // viem specific
    }

    public async getBalance(address: Address) {
        const accountDetails = await RetrieveAccountDetails.of(address).askTo(
            FetchHttpClient.at(this.httpClient)
        );
        const balance = accountDetails.response.balance;
        return balance;
    }

    public async getBlock(
        revision: bigint | number | string | Uint8Array | Hex = 'best', // viem specific
        type: BlockReponseType = BlockReponseType.regular // vechain specific
    ) {
        if (type == BlockReponseType.expanded) {
            return await RetrieveExpandedBlock.of(Revision.of(revision)).askTo(
                FetchHttpClient.at(this.httpClient)
            );
        } else if (type == BlockReponseType.raw) {
            return await RetrieveRawBlock.of(Revision.of(revision)).askTo(
                FetchHttpClient.at(this.httpClient)
            );
        } else {
            return await RetrieveRegularBlock.of(Revision.of(revision)).askTo(
                FetchHttpClient.at(this.httpClient)
            );
        }
    }

    public async getBlockNumber(
        revision: bigint | number | string | Uint8Array | Hex = 'best' // viem specific
    ) {
        const selectedBlock = await RetrieveRegularBlock.of(
            Revision.of(revision)
        ).askTo(FetchHttpClient.at(this.httpClient));
        const blockNumber = selectedBlock?.response?.number;

        return blockNumber;
    }

    public async getBlockTransactionCount(
        revision: bigint | number | string | Uint8Array | Hex = 'best' // viem specific
    ) {
        const selectedBlock = await RetrieveRegularBlock.of(
            Revision.of(revision)
        ).askTo(FetchHttpClient.at(this.httpClient));
        const trxCount = selectedBlock?.response?.transactions.length;

        return trxCount;
    }

    public async watchBlocks(pos: BlockId) {
        return await BlocksSubscription.at(
            new MozillaWebSocketClient(
                `ws://${FetchHttpClient.at(this.httpClient)}`
            )
        ).atPos(pos);
    }

    public async watchBlockNumber() {
        return await BlocksSubscription.at(
            new MozillaWebSocketClient(
                `ws://${FetchHttpClient.at(this.httpClient)}`
            )
        );
    }

    public async simulateCalls(request: ExecuteCodesRequestJSON) {
        // this and call are the same because ETH doesn't support multi-call and they have explicit functions for this.
        // viem specific
        const inspectClause = await InspectClauses.of(request).askTo(
            FetchHttpClient.at(this.httpClient)
        );
        const clause = inspectClause.response;
        return clause;
    }

    public async call(request: ExecuteCodesRequestJSON) {
        // viem specific
        const inspectClause = await InspectClauses.of(request).askTo(
            FetchHttpClient.at(this.httpClient)
        );
        const clause = inspectClause.response;
        return clause;
    }

    public async getFeeHistory(blockCount: number) {
        // viem specific
        return await RetrieveHistoricalFeeData.of(blockCount).askTo(
            FetchHttpClient.at(this.httpClient)
        );
    }

    public async getGasPrice() {
        // viem specific
        const lastBlock = await RetrieveHistoricalFeeData.of(1).askTo(
            FetchHttpClient.at(this.httpClient)
        );
        const lastBaseFeePerGas = lastBlock.response.baseFeePerGas;
        return lastBaseFeePerGas;
    }

    public async estimateFeePerGas() {
        // viem specific
        const lastRevision = await RetrieveRegularBlock.of(Revision.BEST).askTo(
            FetchHttpClient.at(this.httpClient)
        );
        const lastBaseFeePerGas = lastRevision?.response?.baseFeePerGas;
        return lastBaseFeePerGas;
    }

    public async estimateGas(request: ExecuteCodesRequestJSON) {
        // viem specific
        const inspectClause = await InspectClauses.of(request).askTo(
            FetchHttpClient.at(this.httpClient)
        );
        const gasUsedArray = inspectClause.response;
        return gasUsedArray;
    }

    public async estimateMaxPriorityFeePerGas() {
        // viem specific
        return await SuggestPriorityFee.of().askTo(
            FetchHttpClient.at(this.httpClient)
        );
    }
}

export { PublicClient, createPublicClient };

import { Revision } from "@vechain/sdk-core";
import { ExpandedBlockResponse, FetchHttpClient, RetrieveExpandedBlock } from "@vechain/sdk-thorest-api";

/**
 * Get the genesis block from the ThorClient
 * @returns The genesis block
 */
export const getGenesisBlock = async (): Promise<ExpandedBlockResponse> => {
    try {
        const thorClient = FetchHttpClient.at('http://localhost:8669');
        const genesisBlock = (await RetrieveExpandedBlock.of(Revision.of(0)).askTo(thorClient)).response;
        if (genesisBlock === null) {
            throw new Error('Genesis block not found');
        }
        return genesisBlock;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

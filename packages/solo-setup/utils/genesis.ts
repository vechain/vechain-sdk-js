import {
    Revision,
    type RegularBlockResponse,
    FetchHttpClient,
    RetrieveRegularBlock
} from '@vechain/sdk';

/**
 * Get the genesis block from the ThorClient
 * @returns The genesis block
 */
export const getGenesisBlock = async (): Promise<RegularBlockResponse> => {
    try {
        const thorClient = FetchHttpClient.at(new URL('http://localhost:8669'));
        const genesisBlock = (
            await RetrieveRegularBlock.of(Revision.of(0)).askTo(thorClient)
        ).response;
        if (genesisBlock === null) {
            throw new Error('Genesis block not found');
        }
        return genesisBlock;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

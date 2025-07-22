import { Revision, ThorNetworks } from '@vechain/sdk';
import {
    RegularBlockResponse,
    RetrieveRegularBlock,
    FetchHttpClient
} from '@vechain/sdk';

/**
 * Get the genesis block from the ThorClient
 * @returns The genesis block
 */
export const getGenesisBlock = async (): Promise<RegularBlockResponse> => {
    try {
        const httpClient = FetchHttpClient.at(
            new URL(ThorNetworks.SOLONET),
            {}
        );
        const genesisBlock = (
            await RetrieveRegularBlock.of(Revision.of(0)).askTo(httpClient)
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

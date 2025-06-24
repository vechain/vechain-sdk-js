import { type CompressedBlockDetail, ThorClient } from '@vechain/sdk-network';

/**
 * Get the genesis block from the ThorClient
 * @returns The genesis block
 */
export const getGenesisBlock = async (): Promise<CompressedBlockDetail> => {
    try {
        const thorClient = ThorClient.at('localhost:8669');
        const genesisBlock = await thorClient.blocks.getGenesisBlock();
        if (genesisBlock === null) {
            throw new Error('Genesis block not found');
        }
        return genesisBlock;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

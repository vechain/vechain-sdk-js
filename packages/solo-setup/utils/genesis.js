"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGenesisBlock = void 0;
const sdk_network_1 = require("@vechain/sdk-network");
/**
 * Get the genesis block from the ThorClient
 * @returns The genesis block
 */
const getGenesisBlock = async () => {
    try {
        const thorClient = sdk_network_1.ThorClient.at('http://localhost:8669');
        const genesisBlock = await thorClient.blocks.getGenesisBlock();
        if (genesisBlock === null) {
            throw new Error('Genesis block not found');
        }
        return genesisBlock;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
};
exports.getGenesisBlock = getGenesisBlock;

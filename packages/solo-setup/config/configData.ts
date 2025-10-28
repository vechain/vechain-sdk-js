import { type RegularBlockResponse } from '@vechain/sdk/thor';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import {
    THOR_SOLO_DEFAULT_ACCOUNT_ADDRESSES,
    THOR_SOLO_DEFAULT_ACCOUNT_PRIVATE_KEYS
} from './constants';

// Define the config structure type
export interface ConfigData {
    TESTING_CONTRACT_ADDRESS: string;
    TESTING_CONTRACT_ABI: any[];
    TESTING_CONTRACT_BYTECODE: string;
    SOLO_GENESIS_BLOCK: RegularBlockResponse;
    SEED_VET_TX_ID: string;
    SEED_VTHO_TX_ID: string;
    SEED_TEST_TOKEN_TX_ID: string;
    TEST_TOKEN_ADDRESS: string;
    EVENTS_CONTRACT_ADDRESS: string;
    EVENTS_CONTRACT_ABI: any[];
    DEFAULT_SOLO_ACCOUNT_ADDRESSES: string[];
    DEFAULT_SOLO_ACCOUNT_PRIVATE_KEYS: string[];
}

// Get the config file path in the current working directory
const getConfigPath = (): string => {
    return path.resolve(__dirname, '../config.json');
};

/**
 * Get configuration data from the JSON file
 */
const getConfigData = (): ConfigData => {
    const configPath = getConfigPath();

    if (!fs.existsSync(configPath)) {
        throw new Error(
            `Configuration file not found at ${configPath}. Please run "solo-setup seed" to deploy contracts and generate configuration.`
        );
    }

    try {
        const configContent = fs.readFileSync(configPath, 'utf8');
        return JSON.parse(configContent) as unknown as ConfigData;
    } catch (error) {
        throw new Error(
            `Failed to read configuration file: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
    }
};

/**
 * Set/update configuration data by writing to JSON file
 */
function setConfig(
    address: string,
    abi: string | any[], // Allow abi as string or parsed array
    bytecode: string,
    genesisBlock: RegularBlockResponse,
    seedVetTxId: string,
    seedVthoTxId: string,
    testTokenAddress: string,
    seedTestTokenTxId: string,
    eventsContractAddress: string,
    eventsContractABI: string | any[]
): void {
    const parsedAbi = typeof abi === 'string' ? JSON.parse(abi) : abi;
    const parsedEventsContractAbi =
        typeof eventsContractABI === 'string'
            ? JSON.parse(eventsContractABI)
            : eventsContractABI;
    const configData: ConfigData = {
        TESTING_CONTRACT_ADDRESS: address,
        TESTING_CONTRACT_ABI: parsedAbi,
        TESTING_CONTRACT_BYTECODE: bytecode || '',
        SOLO_GENESIS_BLOCK: genesisBlock,
        SEED_VET_TX_ID: seedVetTxId,
        SEED_VTHO_TX_ID: seedVthoTxId,
        SEED_TEST_TOKEN_TX_ID: seedTestTokenTxId,
        TEST_TOKEN_ADDRESS: testTokenAddress,
        EVENTS_CONTRACT_ADDRESS: eventsContractAddress,
        EVENTS_CONTRACT_ABI: parsedEventsContractAbi,
        DEFAULT_SOLO_ACCOUNT_ADDRESSES: THOR_SOLO_DEFAULT_ACCOUNT_ADDRESSES,
        DEFAULT_SOLO_ACCOUNT_PRIVATE_KEYS:
            THOR_SOLO_DEFAULT_ACCOUNT_PRIVATE_KEYS
    };

    const configPath = getConfigPath();

    try {
        fs.writeFileSync(configPath, JSON.stringify(configData, null, 2));
        console.log(`Configuration saved to ${configPath}`);
    } catch (error) {
        throw new Error(
            `Failed to write configuration file: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
    }
}

// Export both functions
export { getConfigData, setConfig };

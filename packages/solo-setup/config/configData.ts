import { type CompressedBlockDetail } from '@vechain/sdk-network';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Define the config structure type
export interface ConfigData {
    TESTING_CONTRACT_ADDRESS: string;
    TESTING_CONTRACT_ABI: any[];
    TESTING_CONTRACT_BYTECODE: string;
    SOLO_GENESIS_BLOCK: CompressedBlockDetail;
    SEED_VET_TX_ID: string;
    SEED_VTHO_TX_ID: string;
    SEED_TEST_TOKEN_TX_ID: string;
    TEST_TOKEN_ADDRESS: string;
}

// Get the config file path in the current working directory
const getConfigPath = (): string => {
    const filename = fileURLToPath(import.meta.url);
    const dirname = path.dirname(filename);
    const configPath =
        process.env.SOLO_SETUP_ORIGINAL_CWD ??
        path.resolve(dirname, '../config.json');
    return configPath;
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
        return JSON.parse(configContent);
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
    genesisBlock: CompressedBlockDetail,
    seedVetTxId: string,
    seedVthoTxId: string,
    testTokenAddress: string,
    seedTestTokenTxId: string
): void {
    const parsedAbi = typeof abi === 'string' ? JSON.parse(abi) : abi;

    const configData: ConfigData = {
        TESTING_CONTRACT_ADDRESS: address,
        TESTING_CONTRACT_ABI: parsedAbi,
        TESTING_CONTRACT_BYTECODE: bytecode || '',
        SOLO_GENESIS_BLOCK: genesisBlock,
        SEED_VET_TX_ID: seedVetTxId,
        SEED_VTHO_TX_ID: seedVthoTxId,
        SEED_TEST_TOKEN_TX_ID: seedTestTokenTxId,
        TEST_TOKEN_ADDRESS: testTokenAddress
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

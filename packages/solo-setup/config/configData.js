"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfigData = void 0;
exports.setConfig = setConfig;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Define the absolute path to config.json in the package root
const configPath = path_1.default.resolve(__dirname, '../config.json');
const getConfigData = () => {
    try {
        // Read using the absolute path
        const configJson = fs_1.default.readFileSync(configPath, 'utf8');
        const config = JSON.parse(configJson);
        return config;
    }
    catch (error) {
        console.error(`Failed to read or parse config file at ${configPath}:`, error);
        // Provide a more informative error if the file is missing or invalid
        throw new Error(`Configuration file '${configPath}' not found or invalid. Ensure 'yarn solo-seed' has run successfully.`);
    }
};
exports.getConfigData = getConfigData;
/**
 * Writes configuration to config.json file
 */
// eslint-disable-next-line sonarjs/sonar-max-params
function setConfig(address, abi, // Allow abi as string or parsed array
bytecode, genesisBlock, chainTag, seedVetTxId, seedVthoTxId, testTokenAddress, seedTestTokenTxId) {
    // configPath is defined above using absolute path
    if (!bytecode) {
        // Use empty string instead of throwing an error
        bytecode = '';
        console.warn('Bytecode is null or empty, using empty string');
    }
    // Parse ABI if it's a string
    const parsedAbi = typeof abi === 'string' ? JSON.parse(abi) : abi;
    // Create a JSON object with all the configuration values
    const configObject = {
        TESTING_CONTRACT_ADDRESS: address,
        TESTING_CONTRACT_ABI: parsedAbi,
        TESTING_CONTRACT_BYTECODE: bytecode,
        SOLO_GENESIS_BLOCK: genesisBlock,
        SOLO_CHAIN_TAG: chainTag,
        SEED_VET_TX_ID: seedVetTxId,
        SEED_VTHO_TX_ID: seedVthoTxId,
        SEED_TEST_TOKEN_TX_ID: seedTestTokenTxId,
        TEST_TOKEN_ADDRESS: testTokenAddress
    };
    console.log(`[setConfig] Writing config to absolute path: ${configPath}`);
    try {
        // Write the config file using the absolute path
        fs_1.default.writeFileSync(configPath, JSON.stringify(configObject, null, 2));
        console.log(`Created/updated config file at: ${configPath}`); // Log the absolute path
    }
    catch (error) {
        console.error(`Failed to write config file at ${configPath}:`, error);
        throw error; // Re-throw the error
    }
}

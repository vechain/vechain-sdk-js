import fs from 'fs';
import path from 'path';
import { adaptContractAbi } from './abi-adapter';

// Default empty values to use when config.json doesn't exist yet
const defaultConfig = {
    TESTING_CONTRACT_ADDRESS: '',
    TESTING_CONTRACT_ABI: [],
    TESTING_CONTRACT_BYTECODE: '',
    SOLO_GENESIS_BLOCK: {
        timestamp: 0,
        signer: ''
    },
    SEED_VET_TX_ID: '',
    SEED_VTHO_TX_ID: '',
    SEED_TEST_TOKEN_TX_ID: '',
    TEST_TOKEN_ADDRESS: ''
};

const configPath = path.join(__dirname, 'config.json');
let config = defaultConfig;

try {
    if (fs.existsSync(configPath)) {
        config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    } else {
        console.error(
            'Config file not found. Run build script to generate actual config.'
        );
    }
} catch (error) {
    console.error('Error loading config.json', error);
}

const TESTING_CONTRACT_ADDRESS = config.TESTING_CONTRACT_ADDRESS;
const TESTING_CONTRACT_ABI = config.TESTING_CONTRACT_ABI;
const TESTING_CONTRACT_BYTECODE = config.TESTING_CONTRACT_BYTECODE;
const SOLO_GENESIS_BLOCK = config.SOLO_GENESIS_BLOCK;
const SEED_VET_TX_ID = config.SEED_VET_TX_ID;
const SEED_VTHO_TX_ID = config.SEED_VTHO_TX_ID;
const SEED_TEST_TOKEN_TX_ID = config.SEED_TEST_TOKEN_TX_ID;
const TEST_TOKEN_ADDRESS = config.TEST_TOKEN_ADDRESS;

// Create an adapted version of the ABI that works with ABIContract.ofAbi()
const ADAPTED_TESTING_CONTRACT_ABI = TESTING_CONTRACT_ABI
    ? adaptContractAbi(TESTING_CONTRACT_ABI)
    : [];

const configData = {
    TESTING_CONTRACT_ADDRESS,
    TESTING_CONTRACT_ABI: ADAPTED_TESTING_CONTRACT_ABI,
    ADAPTED_TESTING_CONTRACT_ABI,
    TESTING_CONTRACT_BYTECODE,
    SOLO_GENESIS_BLOCK,
    SEED_VET_TX_ID,
    SEED_VTHO_TX_ID,
    SEED_TEST_TOKEN_TX_ID,
    TEST_TOKEN_ADDRESS
};

export { configData };

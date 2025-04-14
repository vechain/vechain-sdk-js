import { type CompressedBlockDetail } from '@vechain/sdk-network';
import fs from 'fs';
import path from 'path'

// eslint-disable-next-line sonarjs/sonar-max-params
export function updateConfig(
    address: string,
    abi: string | any[], // Allow abi as string or parsed array
    bytecode: string | null,
    genesisBlock: CompressedBlockDetail,
    seedVetTxId: string,
    seedVthoTxId: string,
    testTokenAddress: string,
    seedTestTokenTxId: string
): void {
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
        SEED_VET_TX_ID: seedVetTxId,
        SEED_VTHO_TX_ID: seedVthoTxId,
        SEED_TEST_TOKEN_TX_ID: seedTestTokenTxId,
        TEST_TOKEN_ADDRESS: testTokenAddress
    };

    // Write as JSON file
    fs.writeFileSync(
        path.join(__dirname, 'config.json'), 
        JSON.stringify(configObject, null, 2)
    );
}

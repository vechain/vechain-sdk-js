import { type CompressedBlockDetail } from '@vechain/sdk-network';
import fs from 'fs';
import path from 'path';

// eslint-disable-next-line sonarjs/sonar-max-params
export function updateConfig(
    address: string,
    abi: string,
    bytecode: string | null,
    genesisBlock: CompressedBlockDetail,
    seedVetTxId: string,
    seedVthoTxId: string,
    testTokenAddress: string,
    seedTestTokenTxId: string
): void {
    if (bytecode === null) {
        throw new Error('Cannot update config: Bytecode is null');
    }
    const toWrite =
        `export const TESTING_CONTRACT_ADDRESS: string = '${address}'` +
        ';\n' +
        `export const TESTING_CONTRACT_ABI = ` +
        JSON.stringify(abi, null, 2) +
        ' as const;\n' +
        `export const TESTING_CONTRACT_BYTECODE: string = '${bytecode}';\n` +
        `export const SOLO_GENESIS_BLOCK = ${JSON.stringify(genesisBlock, null, 2)};\n` +
        `export const SEED_VET_TX_ID: string = '${seedVetTxId}';\n` +
        `export const SEED_VTHO_TX_ID: string = '${seedVthoTxId}';\n` +
        `export const SEED_TEST_TOKEN_TX_ID: string = '${seedTestTokenTxId}';\n` +
        `export const TEST_TOKEN_ADDRESS: string = '${testTokenAddress}';\n`;

    fs.writeFileSync(path.join(__dirname, 'config.ts'), toWrite);
}

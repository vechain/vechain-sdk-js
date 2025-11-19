"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
const hardhat_1 = require("hardhat");
const configData_1 = require("../config/configData");
const abi_1 = require("../utils/abi");
const transfer_1 = require("../utils/transfer");
const genesis_1 = require("../utils/genesis");
const accounts_1 = require("../config/accounts");
/**
 * Main function to deploy:
 * - TestingContract
 * - Seed VET & VTHO
 * - Generate genesis block info
 * - Update config
 */
async function main() {
    try {
        // Get the genesis and chaintag
        const genesisBlock = await (0, genesis_1.getGenesisBlock)();
        const chainTag = Number(`0x${genesisBlock.id.slice(-2)}`);
        console.log(`Solo chain tag: ${chainTag}`);
        // Deploy the testing contract
        const testContract = await hardhat_1.ethers.deployContract('TestingContract');
        await testContract.waitForDeployment();
        const testContractAddress = await testContract.getAddress();
        const testContractByteCode = (await testContract.getDeployedCode()) ?? '';
        console.log(`TestingContract deployed with address: ${testContractAddress}`);
        let testContractABI = (0, abi_1.getABI)('TestingContract');
        // Deploy the testing token with initial supply of 1,000,000 tokens
        const testToken = await hardhat_1.ethers.deployContract('TestingToken', [
            1000000
        ]);
        await testToken.waitForDeployment();
        let testTokenAddress = await testToken.getAddress();
        console.log(`TestingToken deployed with address: ${testTokenAddress}`);
        try {
            // Try to seed accounts with VET & VTHO & TestToken
            const seedVetTxId = await (0, transfer_1.seedVET)(accounts_1.THOR_SOLO_ACCOUNTS_TO_SEED);
            const seedVthoTxId = await (0, transfer_1.seedVTHO)(accounts_1.THOR_SOLO_ACCOUNTS_TO_SEED);
            const seedTestTokenTxId = await (0, transfer_1.seedTestToken)(accounts_1.THOR_SOLO_ACCOUNTS_TO_SEED);
            console.log(`VET seeded with txId: ${seedVetTxId}`);
            console.log(`VTHO seeded with txId: ${seedVthoTxId}`);
            console.log(`TestToken seeded with txId: ${seedTestTokenTxId}`);
            // Update config
            (0, configData_1.setConfig)(testContractAddress, testContractABI, testContractByteCode, genesisBlock, chainTag, seedVetTxId, seedVthoTxId, testTokenAddress, seedTestTokenTxId);
            console.log('Config updated');
        }
        catch (error) {
            console.warn('Thor solo network might not be running. Skipping network operations.');
            console.warn('Run with a live Thor solo network using solo-seed command for complete setup.');
        }
    }
    catch (error) {
        console.error('Failed to deploy contracts:', error);
        console.warn('Build will continue, but config.json will not be updated.');
    }
}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error('Error in deploy script:', error);
    // Don't exit with error code to allow build to continue
    // process.exitCode = 1;
});

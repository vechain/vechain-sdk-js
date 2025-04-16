/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ethers } from 'hardhat';
import { setConfig } from '../config/configData';
import { getABI } from '../utils/abi';
import { seedTestToken, seedVET, seedVTHO } from '../utils/transfer';
import { getGenesisBlock } from '../utils/genesis';
import { THOR_SOLO_ACCOUNTS_TO_SEED } from '../config/accounts';

/**
 * Main function to deploy:
 * - TestingContract
 * - Seed VET & VTHO
 * - Generate genesis block info
 * - Update config
 */
async function main(): Promise<void> {
    
    try {
        // Deploy the testing contract
        const testContract = await ethers.deployContract('TestingContract');
        await testContract.waitForDeployment();
        let testContractAddress = await testContract.getAddress();
        let testContractByteCode = await testContract.getDeployedCode() ?? '';
        console.log(
            `TestingContract deployed with address: ${testContractAddress}`
        );
        let testContractABI = getABI('TestingContract');

        // Deploy the testing token with initial supply of 1,000,000 tokens
        const testToken = await ethers.deployContract('TestingToken', [1000000]);
        await testToken.waitForDeployment();
        let testTokenAddress = await testToken.getAddress();
        console.log(`TestingToken deployed with address: ${testTokenAddress}`);

        try {
            // Try to get genesis block details
            const genesisBlock = await getGenesisBlock();

            // Try to seed accounts with VET & VTHO & TestToken
            const seedVetTxId = await seedVET(THOR_SOLO_ACCOUNTS_TO_SEED);
            const seedVthoTxId = await seedVTHO(THOR_SOLO_ACCOUNTS_TO_SEED);
            const seedTestTokenTxId = await seedTestToken(THOR_SOLO_ACCOUNTS_TO_SEED);
            console.log(`VET seeded with txId: ${seedVetTxId}`);
            console.log(`VTHO seeded with txId: ${seedVthoTxId}`);
            console.log(`TestToken seeded with txId: ${seedTestTokenTxId}`);

            // Update config
            setConfig(
                testContractAddress,
                testContractABI,
                testContractByteCode,
                genesisBlock,
                seedVetTxId,
                seedVthoTxId,
                testTokenAddress,
                seedTestTokenTxId
            );
            console.log('Config updated');
        } catch (error) {
            console.warn('Thor solo network might not be running. Skipping network operations.');
            console.warn('Run with a live Thor solo network using solo-seed command for complete setup.');           
        }
    } catch (error) {
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

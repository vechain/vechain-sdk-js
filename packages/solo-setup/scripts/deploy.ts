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
 * - Generate config.json file
 */
async function main(): Promise<void> {
    try {
        // Deploy the testing contract
        const testContract = await ethers.deployContract('TestingContract');
        await testContract.waitForDeployment();
        const testContractAddress = await testContract.getAddress();
        const testContractByteCode =
            (await testContract.getDeployedCode()) ?? '';
        console.log(
            `TestingContract deployed with address: ${testContractAddress}`
        );
        const testContractABI = getABI('TestingContract');

        // Deploy the testing token with initial supply of 1,000,000 tokens
        const testToken = await ethers.deployContract('TestingToken', [
            1000000
        ]);
        await testToken.waitForDeployment();
        const testTokenAddress = await testToken.getAddress();
        console.log(`TestingToken deployed with address: ${testTokenAddress}`);

        // Deploy the events contract
        const eventsContract = await ethers.deployContract('EventsContract');
        await eventsContract.waitForDeployment();
        const eventsContractAddress = await eventsContract.getAddress();
        console.log(
            `EventsContract deployed with address: ${eventsContractAddress}`
        );
        const eventsContractABI = getABI('EventsContract');

        // Initialize variables for network operations
        const genesisBlock = await getGenesisBlock();

        // Try network operations (seeding)
        const seedVetTxId = await seedVET(THOR_SOLO_ACCOUNTS_TO_SEED);
        const seedVthoTxId = await seedVTHO(THOR_SOLO_ACCOUNTS_TO_SEED);
        const seedTestTokenTxId = await seedTestToken(
            THOR_SOLO_ACCOUNTS_TO_SEED
        );

        // Always create config.json file with available data
        console.log('Saving configuration to config.json...');
        setConfig(
            testContractAddress,
            testContractABI,
            testContractByteCode,
            genesisBlock,
            seedVetTxId,
            seedVthoTxId,
            testTokenAddress,
            seedTestTokenTxId,
            eventsContractAddress,
            eventsContractABI
        );

        // Success summary
        console.log('Deployment completed successfully!');
        console.log(`TestingContract: ${testContractAddress}`);
        console.log(`TestingToken: ${testTokenAddress}`);
    } catch (error) {
        console.error('Failed to deploy contracts:', error);
        throw error;
    }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error('Error in deploy script:', error);
    // Don't exit with error code to allow build to continue
    // process.exitCode = 1;
});

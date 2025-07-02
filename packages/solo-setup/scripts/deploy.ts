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
 * - TestingToken
 * - Seed VET & VTHO & TestToken (if possible)
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

        // Initialize variables for network operations
        let genesisBlock;
        let seedVetTxId = '';
        let seedVthoTxId = '';
        let seedTestTokenTxId = '';

        // Try network operations (seeding)
        try {
            // Get genesis block details
            genesisBlock = await getGenesisBlock();
            console.log('Genesis block info retrieved');

            // Seed accounts with VET & VTHO & TestToken
            seedVetTxId = await seedVET(THOR_SOLO_ACCOUNTS_TO_SEED);
            console.log(`VET seeded with txId: ${seedVetTxId}`);

            seedVthoTxId = await seedVTHO(THOR_SOLO_ACCOUNTS_TO_SEED);
            console.log(`VTHO seeded with txId: ${seedVthoTxId}`);

            seedTestTokenTxId = await seedTestToken(THOR_SOLO_ACCOUNTS_TO_SEED);
            console.log(`TestToken seeded with txId: ${seedTestTokenTxId}`);

            console.log('All seeding operations completed successfully');
        } catch (error) {
            console.warn('Thor solo network operations failed:', error);
            console.warn('The Thor node might not be running or reachable');
            console.warn(
                'Creating config with contracts only, seeding data will be empty'
            );

            // Use default values for failed operations
            genesisBlock = {
                number: 0,
                id: '0x00000000c05a20fbca2bf6ae3affba6af4a74b800b585bf7a4988aba7aea69f6',
                timestamp: Date.now()
            } as any;
        }

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
            seedTestTokenTxId
        );

        // Success summary
        console.log('Deployment completed successfully!');
        console.log(`TestingContract: ${testContractAddress}`);
        console.log(`TestingToken: ${testTokenAddress}`);
        if (seedVetTxId) {
            console.log('Account seeding completed');
        } else {
            console.log(
                'Account seeding was skipped - contracts are available for use'
            );
        }
    } catch (error) {
        console.error('Failed to deploy contracts:', error);
        throw error;
    }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error('Fatal error in deploy script:', error);
    process.exitCode = 1;
});

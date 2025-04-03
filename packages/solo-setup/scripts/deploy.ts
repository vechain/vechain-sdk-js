/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ethers } from 'hardhat';
import { updateConfig } from '../config/updateConfig';
import { getABI } from '../utils/abi';
import { seedTestToken, seedVET, seedVTHO } from './transfer';
import { getGenesisBlock } from './genesis';

/**
 * Main function to deploy:
 * - TestingContract
 * - Seed VET & VTHO
 * - Generate genesis block info
 * - Update config
 */
async function main(): Promise<void> {
    // Deploy the testing contract
    const testContract = await ethers.deployContract('TestingContract');
    await testContract.waitForDeployment();
    const testContractAddress = await testContract.getAddress();
    const testContractByteCode = await testContract.getDeployedCode();
    console.log(
        `TestingContract deployed with address: ${testContractAddress}`
    );
    const testContractABI = getABI('TestingContract');

    // Deploy the testing token with initial supply of 1,000,000 tokens
    const testToken = await ethers.deployContract('TestingToken', [1000000]);
    await testToken.waitForDeployment();
    const testTokenAddress = await testToken.getAddress();
    console.log(`TestingToken deployed with address: ${testTokenAddress}`);

    // get genesis block details
    const genesisBlock = await getGenesisBlock();

    // seed accounts with VET & VTHO & TestToken
    const seedVetTxId = await seedVET();
    const seedVthoTxId = await seedVTHO();
    const seedTestTokenTxId = await seedTestToken();
    console.log(`VET seeded with txId: ${seedVetTxId}`);
    console.log(`VTHO seeded with txId: ${seedVthoTxId}`);
    console.log(`TestToken seeded with txId: ${seedTestTokenTxId}`);
    // update config
    updateConfig(
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
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

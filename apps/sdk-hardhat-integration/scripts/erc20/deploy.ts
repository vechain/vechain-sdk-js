import { ethers } from 'hardhat';

async function main(): Promise<void> {
    const erc20Contract = await ethers.deployContract('GLDToken', [100000]);
    await erc20Contract.waitForDeployment();

    const address = await erc20Contract.getAddress();

    console.log(`Gold contract deployed with address: ${address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

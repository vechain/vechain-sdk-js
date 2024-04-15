import { ethers } from 'hardhat';

async function main(): Promise<void> {
    const erc721Contract = await ethers.deployContract('GameItem');
    await erc721Contract.waitForDeployment();

    const address = await erc721Contract.getAddress();

    console.log(`MyNFT contract deployed with address: ${address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

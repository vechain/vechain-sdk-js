import { ethers } from 'hardhat';

async function main(): Promise<void> {
    const signer = (await ethers.getSigners())[0];

    const GLDTokenContractFactory = await ethers.getContractFactory(
        'GLDToken',
        signer
    );

    const goldTokenContract = await GLDTokenContractFactory.deploy(10000);
    await goldTokenContract.waitForDeployment();
    const message = await goldTokenContract.balanceOf(
        await signer.getAddress()
    );

    console.log(`${message}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

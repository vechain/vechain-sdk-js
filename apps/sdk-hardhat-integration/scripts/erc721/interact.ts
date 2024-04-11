import { ethers } from 'hardhat';

async function main(): Promise<void> {
    const signer = (await ethers.getSigners())[0];

    const gameItemFactory = await ethers.getContractFactory('GameItem', signer);

    const gameItemContract = await gameItemFactory.deploy();

    await gameItemContract.waitForDeployment();

    const tx = await gameItemContract.awardItem(
        '0x3db469a79593dcc67f07de1869d6682fc1eaf535',
        'URINotDefined'
    );

    const receipt = await tx.wait();

    receipt?.logs?.forEach((log) => {
        console.log(gameItemContract.interface.parseLog(log));
    });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

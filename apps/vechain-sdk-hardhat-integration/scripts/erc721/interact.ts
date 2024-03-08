import { ethers } from 'hardhat';

async function main(): Promise<void> {
    const GameItem = await ethers.getContractAt(
        'GameItem',
        '0x4f433050fa55bcb811409266b51a08923c8cf9e9'
    );

    const tx = await GameItem.awardItem(
        '0x3db469a79593dcc67f07de1869d6682fc1eaf535',
        'URINotDefined'
    );

    const receipt = await tx.wait();

    receipt?.logs?.forEach((log) => {
        console.log(GameItem.interface.parseLog(log));
    });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

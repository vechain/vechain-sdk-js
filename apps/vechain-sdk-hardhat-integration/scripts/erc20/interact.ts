import { ethers } from 'hardhat';

async function main(): Promise<void> {
    const GLDTokenContract = await ethers.getContractAt(
        'GLDToken',
        '0x50addfa20cb4ce4600b24037f9f08ef5b6edc603'
    );
    const message = await GLDTokenContract.balanceOf(
        '0x3db469a79593dcc67f07de1869d6682fc1eaf535'
    );

    console.log(`${message}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

import { ethers } from 'hardhat';

async function main(): Promise<void> {
    const GLDTokenContract = await ethers.getContractAt(
        'GLDToken',
        '0x3032e00E6466F395eb7B38C2819cDd1D16076503'
    );
    const message = await GLDTokenContract.balanceOf(
        '0x783DE01F06b4F2a068A7b3Bb6ff3db821A08f8c1'
    );

    console.log(`${message}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

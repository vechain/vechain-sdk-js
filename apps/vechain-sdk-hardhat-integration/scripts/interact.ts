import { ethers } from 'hardhat';

async function main(): Promise<void> {
    const vechainHelloWorld = await ethers.getContractAt(
        'VechainHelloWorldWithNonEmptyConstructor',
        '0x3dbfbed6b0aa6981ebb65bad6ffc57206641f2f1'
    );
    const message = (await vechainHelloWorld.sayHello()) as string;

    console.log(`${message}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

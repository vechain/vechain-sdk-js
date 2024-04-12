import { ethers } from 'hardhat';

async function main(): Promise<void> {
    const signer = (await ethers.getSigners())[0];

    const vechainHelloWorldFactory = await ethers.getContractFactory(
        'VechainHelloWorld',
        signer
    );

    const vechainHelloWorld = await vechainHelloWorldFactory.deploy();

    const message = await vechainHelloWorld.sayHello();

    console.log(`${message}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

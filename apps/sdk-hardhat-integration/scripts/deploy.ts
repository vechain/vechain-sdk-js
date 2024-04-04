import { ethers } from 'hardhat';

async function main(): Promise<void> {
    const signer = (await ethers.getSigners())[0];

    const vechainHelloWorldFactory = await ethers.getContractFactory(
        'VechainHelloWorld',
        signer
    );

    console.log('factory', JSON.stringify(vechainHelloWorldFactory));

    const txResponse = await vechainHelloWorldFactory.deploy();

    console.log('txResponse', JSON.stringify(txResponse));

    console.log('address', await txResponse.getAddress());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

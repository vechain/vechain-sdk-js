import { ethers, config } from 'hardhat';
import { provider } from '@vechain/vechain-sdk-provider';

async function main() {
    const vechainHelloWorldWithNonEmptyConstructor =
        await ethers.deployContract(
            'VechainHelloWorldWithNonEmptyConstructor',
            [10],
            {
                from: (await ethers.getSigners())[0].address,
                value: ethers.parseEther('0.1')
            }
        );

    const vechainHelloWorld = await ethers.deployContract(
        'VechainHelloWorld',
        [],
        {
            from: (await ethers.getSigners())[0].address
        }
    );

    // await vechainHelloWorld.waitForDeployment();
    await vechainHelloWorldWithNonEmptyConstructor.waitForDeployment();
    // console.log(config);
    //
    console.log(
        `VechainHelloWorld deployed to ${JSON.stringify(vechainHelloWorld)}`
    );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

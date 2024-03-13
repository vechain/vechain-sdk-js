async function main(): Promise<void> {
    // console.log('Chain ID', await ethers.provider.send('eth_chainId', []));
    // console.log(
    //     'pluto',
    //     await ethers.getSigner('0x0000000000000000000000000000456E65726779')
    // );
    // const vechainHelloWorldWithNonEmptyConstructor =
    //     await ethers.deployContract(
    //         'VechainHelloWorldWithNonEmptyConstructor',
    //         [10],
    //         {
    //             from: (await ethers.getSigners())[0].address,
    //             value: ethers.parseEther('0.1')
    //         }
    //     );
    //
    // const vechainHelloWorld = await ethers.deployContract(
    //     'VechainHelloWorld',
    //     [],
    //     {
    //         from: (await ethers.getSigners())[0].address
    //     }
    // );
    //
    // await vechainHelloWorldWithNonEmptyConstructor.waitForDeployment();
    //
    // console.log(
    //     `VechainHelloWorld deployed to ${JSON.stringify(vechainHelloWorld)}`
    // );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

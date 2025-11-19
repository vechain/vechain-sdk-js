"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hardhat_1 = require("hardhat");
async function main() {
    const signer = (await hardhat_1.ethers.getSigners())[0];
    const vechainHelloWorldFactory = await hardhat_1.ethers.getContractFactory('VechainHelloWorld', signer);
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

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hardhat_1 = require("hardhat");
const sdk_errors_1 = require("@vechain/sdk-errors");
async function main() {
    const signer = (await hardhat_1.ethers.getSigners())[0];
    const vechainHelloWorldFactory = await hardhat_1.ethers.getContractFactory('VechainHelloWorld', signer);
    const txResponse = await vechainHelloWorldFactory.deploy();
    console.log('Contract deployment with the following transaction:', (0, sdk_errors_1.stringifyData)(txResponse));
}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

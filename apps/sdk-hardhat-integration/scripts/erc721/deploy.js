"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hardhat_1 = require("hardhat");
async function main() {
    const erc721Contract = await hardhat_1.ethers.deployContract('GameItem');
    await erc721Contract.waitForDeployment();
    const address = await erc721Contract.getAddress();
    console.log(`MyNFT contract deployed with address: ${address}`);
}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

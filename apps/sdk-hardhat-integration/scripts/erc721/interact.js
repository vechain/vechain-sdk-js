"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hardhat_1 = require("hardhat");
async function main() {
    const signer = (await hardhat_1.ethers.getSigners())[0];
    const gameItemFactory = await hardhat_1.ethers.getContractFactory('GameItem', signer);
    const gameItemContract = await gameItemFactory.deploy();
    await gameItemContract.waitForDeployment();
    const tx = await gameItemContract.awardItem('0x3db469a79593dcc67f07DE1869d6682fC1eaf535', 'URINotDefined');
    const receipt = await tx.wait();
    receipt?.logs?.forEach((log) => {
        console.log(gameItemContract.interface.parseLog(log));
    });
}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

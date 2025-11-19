"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hardhat_1 = require("hardhat");
const chai_1 = require("chai");
/**
 * Tests for the 'GLDToken' contract
 */
describe('GLDToken', function () {
    it('should deploy with the correct initial supply', async function () {
        const [owner] = await hardhat_1.ethers.getSigners();
        const initialSupply = hardhat_1.ethers.parseUnits('1000', 18); // 1000 tokens with 18 decimals
        const GLDToken = await hardhat_1.ethers.getContractFactory('GLDToken');
        const contract = await GLDToken.deploy(initialSupply);
        // Check the initial supply
        const ownerBalance = await contract.balanceOf(owner.address);
        (0, chai_1.expect)(ownerBalance).to.equal(initialSupply);
    });
});

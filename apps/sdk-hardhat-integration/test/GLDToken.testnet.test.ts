import { ethers } from 'hardhat';
import { expect } from 'chai';

/**
 * Tests for the 'GLDToken' contract
 */
describe('GLDToken', function () {
    it('should deploy with the correct initial supply', async function () {
        const [owner] = await ethers.getSigners();
        const initialSupply = ethers.parseUnits('1000', 18); // 1000 tokens with 18 decimals
        const GLDToken = await ethers.getContractFactory('GLDToken');
        const contract = await GLDToken.deploy(initialSupply);

        // Check the initial supply
        const ownerBalance = await contract.balanceOf(owner.address);
        expect(ownerBalance).to.equal(initialSupply);
    });
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hardhat_1 = require("hardhat");
const chai_1 = require("chai");
/**
 * Tests for custom revert error
 *
 * @group integration/hardhat-plugin
 */
describe('Custom revert error', () => {
    /**
     * Test suite for revert with custom error
     */
    it('Should revert with custom error', async function () {
        this.timeout(20000);
        const revertCustomContract = await hardhat_1.ethers.getContractFactory('RevertCustom');
        const contract = await revertCustomContract.deploy();
        const contractInfo = await contract.waitForDeployment();
        (0, chai_1.expect)(contractInfo).to.not.equal(undefined);
        await (0, chai_1.expect)(contract.revertWithCustomError('Custom error message')).to.be.revertedWithCustomError(contract, 'CustomError').withArgs('Custom error message');
    });
});

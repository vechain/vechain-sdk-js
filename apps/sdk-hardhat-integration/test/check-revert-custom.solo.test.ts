import { ethers } from 'hardhat';
import { expect } from 'chai';

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
        const revertCustomContract = await ethers.getContractFactory('RevertCustom');   
        const contract = await revertCustomContract.deploy();
        const contractInfo = await contract.waitForDeployment();
        expect(contractInfo).to.not.equal(undefined);
        await expect(
            contract.revertWithCustomError('Custom error message')
        ).to.be.revertedWithCustomError(contract, 'CustomError').withArgs('Custom error message');
    });

});

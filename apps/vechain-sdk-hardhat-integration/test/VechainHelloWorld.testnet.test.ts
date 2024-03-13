import { ethers } from 'hardhat';
import { expect } from 'chai';

/**
 * Tests for the 'VechainHelloWorld' contract
 */
describe('VechainHelloWorld', function () {
    it('sayHello() should throw errors', async function () {
        const VechainHelloWorld =
            await ethers.getContractFactory('VechainHelloWorld');
        const contract = await VechainHelloWorld.deploy();

        // @NOTE:
        // CURRENTLY Function contract.sayHello()
        // should throw because TEMPORARY we have not implemented ethers.getContractFactory.
        // OUR SUPER TEAM WILL FIX THIS SOON.
        // 💪
        await expect(contract.sayHello()).to.be.rejected;
    });
});

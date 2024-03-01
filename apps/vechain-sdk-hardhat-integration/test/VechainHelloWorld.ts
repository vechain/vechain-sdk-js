import { expect } from 'chai';
import { ethers } from 'hardhat';

/**
 * Tests for the 'VechainHelloWorld' contract
 */
describe('VechainHelloWorld', function () {
    it('sayHello() should return a defined string', async function () {
        const VechainHelloWorld =
            await ethers.getContractFactory('VechainHelloWorld');
        const contract = await VechainHelloWorld.deploy();
        expect(await contract.sayHello()).to.equal('Hello world from Vechain!');
    });
});

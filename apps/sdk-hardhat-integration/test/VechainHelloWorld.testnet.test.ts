import { ethers } from 'hardhat';
import { expect } from 'chai';

/**
 * Tests for the 'VechainHelloWorld' contract
 */
describe('VechainHelloWorld', function () {
    it('sayHello() should return the correct message', async function () {
        const VechainHelloWorld =
            await ethers.getContractFactory('VechainHelloWorld');
        const contract = await VechainHelloWorld.deploy();

        // Call the sayHello function and check the return value
        const helloMessage = await contract.sayHello();
        expect(helloMessage).to.equal('Hello world from Vechain!');
    });
});

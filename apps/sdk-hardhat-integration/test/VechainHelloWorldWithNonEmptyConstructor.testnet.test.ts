import { ethers } from 'hardhat';
import { expect } from 'chai';

/**
 * Tests for the 'VechainHelloWorldWithNonEmptyConstructor' contract
 */
describe('VechainHelloWorldWithNonEmptyConstructor', function () {
    it('should set the correct owner and simpleParameter', async function () {
        const [owner] = await ethers.getSigners();
        const simpleParameter = 42;
        const VechainHelloWorldWithNonEmptyConstructor =
            await ethers.getContractFactory(
                'VechainHelloWorldWithNonEmptyConstructor'
            );
        const contract = await VechainHelloWorldWithNonEmptyConstructor.deploy(
            simpleParameter,
            { value: ethers.parseEther('1') }
        );

        // Check the owner and simpleParameter values
        expect(await contract.owner()).to.equal(owner.address);
        expect(await contract.simpleParameter()).to.equal(simpleParameter);
    });

    it.only('sayHello() should return the correct message', async function () {
        const VechainHelloWorldWithNonEmptyConstructor =
            await ethers.getContractFactory(
                'VechainHelloWorldWithNonEmptyConstructor'
            );
        const contract = await VechainHelloWorldWithNonEmptyConstructor.deploy(
            42,
            { value: ethers.parseEther('1') }
        );

        // Call the sayHello function and check the return value
        const helloMessage = await contract.sayHello();
        expect(helloMessage).to.equal('Hello world from Vechain!');
    });
});

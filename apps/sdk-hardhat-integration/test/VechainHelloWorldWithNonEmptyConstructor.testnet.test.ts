import { VechainSDKError } from '@vechain/sdk-errors';
import { expect } from 'chai';
import { ethers } from 'hardhat';

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

    it('sayHello() should return the correct message', async function () {
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

    it('should break with an specific error due to insufficient VTHO', async function () {
        const accountWithNoVTHO = await ethers.getSigner(
            '0xB381e7da548601B1CCB05C66d415b20baE40d828'
        );
        const VechainHelloWorldWithNonEmptyConstructor =
            await ethers.getContractFactory(
                'VechainHelloWorldWithNonEmptyConstructor',
                accountWithNoVTHO
            );

        try {
            await VechainHelloWorldWithNonEmptyConstructor.deploy(42, {
                value: ethers.parseEther('1'),
                from: accountWithNoVTHO.address
            });
            fail('should not get here');
        } catch (error) {
            if (error instanceof Error) {
                expect(error.message).to.equal(
                    `Error on request eth_sendTransaction: HardhatPluginError: Error on request eth_sendRawTransaction: Error: Method 'HttpClient.http()' failed.\n-Reason: 'Request failed with status 403 and message tx rejected: insufficient energy'\n-Parameters: \n\t{\n  "method": "POST",\n  "url": "https://testnet.vechain.org/transactions"\n}`
                );
            }
        }
    });
});

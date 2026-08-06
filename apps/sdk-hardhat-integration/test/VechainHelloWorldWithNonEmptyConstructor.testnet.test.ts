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
        this.timeout(120000);
        const signers = await ethers.getSigners();
        const accountWithNoVTHO = await ethers.getSigner(
            signers[signers.length - 1].address
        );

        // The test account lives on a public testnet with a public mnemonic:
        // anyone can fund it with VTHO, silently breaking this test. Drain any
        // VTHO above a small fee reserve so the deploy below always lacks the
        // funds to pay for its gas (self-healing).
        const vtho = new ethers.Contract(
            '0x0000000000000000000000000000456E65726779',
            [
                'function balanceOf(address account) view returns (uint256)',
                'function transfer(address to, uint256 amount) returns (bool)'
            ],
            accountWithNoVTHO
        );
        const vthoBalance = (await vtho.balanceOf(
            accountWithNoVTHO.address
        )) as bigint;
        // Enough to pay the drain transfer fee, far below the deploy fee
        const feeReserve = ethers.parseEther('1');
        if (vthoBalance > feeReserve) {
            const drainTx = await vtho.transfer(
                signers[0].address,
                vthoBalance - feeReserve
            );
            await drainTx.wait();
        }

        const VechainHelloWorldWithNonEmptyConstructor =
            await ethers.getContractFactory(
                'VechainHelloWorldWithNonEmptyConstructor',
                accountWithNoVTHO
            );

        let deployError: Error | undefined;
        try {
            await VechainHelloWorldWithNonEmptyConstructor.deploy(42, {
                value: ethers.parseEther('1'),
                from: accountWithNoVTHO.address
            });
        } catch (error) {
            deployError = error as Error;
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(deployError, 'deploy should fail due to insufficient VTHO').to
            .not.be.undefined;
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(
            deployError?.message.startsWith(
                "Error on request eth_sendTransaction: HardhatPluginError: Error on request eth_sendRawTransaction: Error: Method 'HttpClient.http()' failed."
            )
        ).to.be.true;
    });
});

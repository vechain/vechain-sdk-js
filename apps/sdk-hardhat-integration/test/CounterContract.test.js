"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const hardhat_1 = require("hardhat");
describe('Counter with Typechain', function () {
    let counterContract;
    let owner;
    let addr1;
    let addr2;
    const INITIAL_COUNTER = 10;
    const INITIAL_MESSAGE = 'Test Message';
    beforeEach(async function () {
        console.log('Setting up test environment...');
        // Get signers
        [owner, addr1, addr2] = await hardhat_1.ethers.getSigners();
        console.log('Owner address:', await owner.getAddress());
        console.log('Addr1 address:', await addr1.getAddress());
        // Deploy the contract
        const CounterContractFactory = await hardhat_1.ethers.getContractFactory('CounterContract');
        counterContract = (await CounterContractFactory.deploy(INITIAL_COUNTER, INITIAL_MESSAGE));
        await counterContract.waitForDeployment();
        console.log('Contract deployed to:', await counterContract.getAddress());
    });
    describe('Deployment', function () {
        it('Should set the correct initial values', async function () {
            (0, chai_1.expect)(await counterContract.getCounter()).to.equal(INITIAL_COUNTER);
            (0, chai_1.expect)(await counterContract.getMessage()).to.equal(INITIAL_MESSAGE);
        });
        it('Should set the deployer as owner', async function () {
            (0, chai_1.expect)(await counterContract.owner()).to.equal(await owner.getAddress());
        });
        it('Should return combined values correctly', async function () {
            const [counter, message] = await counterContract.getCounterAndMessage();
            (0, chai_1.expect)(counter).to.equal(INITIAL_COUNTER);
            (0, chai_1.expect)(message).to.equal(INITIAL_MESSAGE);
        });
    });
    describe('Counter functionality', function () {
        it('Should increment counter and emit event', async function () {
            // Test increment function with typed contract
            const tx = await counterContract.increment();
            const receipt = await tx.wait();
            // Verify counter value
            (0, chai_1.expect)(await counterContract.getCounter()).to.equal(INITIAL_COUNTER + 1);
            // Test event emission with Typechain types
            await (0, chai_1.expect)(tx)
                .to.emit(counterContract, 'CounterIncremented')
                .withArgs(INITIAL_COUNTER + 1, await owner.getAddress());
            // Query events using typed filters
            const events = await counterContract.queryFilter(counterContract.filters.CounterIncremented(), receipt?.blockNumber, receipt?.blockNumber);
            (0, chai_1.expect)(events).to.have.length(1);
            (0, chai_1.expect)(events[0].args.newValue).to.equal(INITIAL_COUNTER + 1);
            (0, chai_1.expect)(events[0].args.caller).to.equal(await owner.getAddress());
        });
        it('Should allow multiple increments', async function () {
            // Multiple increments
            await counterContract.increment();
            await counterContract.increment();
            await counterContract.increment();
            (0, chai_1.expect)(await counterContract.getCounter()).to.equal(INITIAL_COUNTER + 3);
        });
        it('Should work with different signers', async function () {
            // Connect contract to different signer
            const contractAsAddr1 = counterContract.connect(addr1);
            await contractAsAddr1.increment();
            (0, chai_1.expect)(await counterContract.getCounter()).to.equal(INITIAL_COUNTER + 1);
            // Verify event with correct caller
            const filter = counterContract.filters.CounterIncremented();
            const events = await counterContract.queryFilter(filter);
            const latestEvent = events[events.length - 1];
            (0, chai_1.expect)(latestEvent.args.caller).to.equal(await addr1.getAddress());
        });
    });
    describe('Message functionality', function () {
        it('Should allow owner to set message', async function () {
            const newMessage = 'New Test Message';
            const tx = await counterContract.setMessage(newMessage);
            await tx.wait();
            (0, chai_1.expect)(await counterContract.getMessage()).to.equal(newMessage);
            // Test event emission
            await (0, chai_1.expect)(tx)
                .to.emit(counterContract, 'MessageSet')
                .withArgs(newMessage, await owner.getAddress());
        });
        it('Should reject non-owner trying to set message', async function () {
            const contractAsAddr1 = counterContract.connect(addr1);
            // Verify that calling setMessage from non-owner reverts
            await (0, chai_1.expect)(contractAsAddr1.setMessage('Unauthorized message 1')).to.be.revertedWithCustomError(counterContract, 'OwnableUnauthorizedAccount');
            await (0, chai_1.expect)(contractAsAddr1.setMessage('Unauthorized message 2'))
                .to.be.reverted;
            await (0, chai_1.expect)(contractAsAddr1.setMessage('Unauthorized message 3')).not.to.be.revertedWithoutReason();
            await (0, chai_1.expect)(contractAsAddr1.setMessage('Unauthorized message 4')).not.to.be.revertedWithPanic();
            // Verify the message hasn't changed
            (0, chai_1.expect)(await counterContract.getMessage()).to.equal(INITIAL_MESSAGE);
        });
        it('Should update combined result after message change', async function () {
            const newMessage = 'Combined Result Test';
            await counterContract.setMessage(newMessage);
            const [counter, message] = await counterContract.getCounterAndMessage();
            (0, chai_1.expect)(counter).to.equal(INITIAL_COUNTER);
            (0, chai_1.expect)(message).to.equal(newMessage);
        });
    });
    describe('VeChain Thor Solo Integration', function () {
        it('Should work with VeChain addresses', async function () {
            const ownerAddress = await owner.getAddress();
            const addr1Address = await addr1.getAddress();
            // Verify addresses are valid Ethereum/VeChain format
            (0, chai_1.expect)(ownerAddress).to.match(/^0x[a-fA-F0-9]{40}$/);
            (0, chai_1.expect)(addr1Address).to.match(/^0x[a-fA-F0-9]{40}$/);
            console.log('Owner address format valid:', ownerAddress);
            console.log('Addr1 address format valid:', addr1Address);
        });
        it('Should handle gas estimation correctly', async function () {
            // Test gas estimation with Typechain types
            const estimatedGas = await counterContract.increment.estimateGas();
            (0, chai_1.expect)(estimatedGas).to.be.greaterThan(0);
            console.log('Estimated gas for increment:', estimatedGas.toString());
        });
        it('Should provide transaction details', async function () {
            const tx = await counterContract.increment();
            const receipt = await tx.wait();
            (0, chai_1.expect)(receipt).to.not.be.null;
            (0, chai_1.expect)(receipt?.blockNumber).to.be.greaterThan(0);
            (0, chai_1.expect)(receipt?.gasUsed).to.be.greaterThan(0);
            console.log('Transaction hash:', tx.hash);
            console.log('Block number:', receipt?.blockNumber);
            console.log('Gas used:', receipt?.gasUsed.toString());
        });
    });
    describe('Typechain Type Safety', function () {
        it('Should provide type safety for function calls', async function () {
            // These should compile without type errors due to Typechain
            const counter = await counterContract.getCounter();
            const message = await counterContract.getMessage();
            const [combinedCounter, combinedMessage] = await counterContract.getCounterAndMessage();
            (0, chai_1.expect)(typeof counter).to.equal('bigint');
            (0, chai_1.expect)(typeof message).to.equal('string');
            (0, chai_1.expect)(typeof combinedCounter).to.equal('bigint');
            (0, chai_1.expect)(typeof combinedMessage).to.equal('string');
        });
        it('Should provide typed event interfaces', async function () {
            const tx = await counterContract.increment();
            const receipt = await tx.wait();
            // Query with typed filter
            const events = await counterContract.queryFilter(counterContract.filters.CounterIncremented(), receipt?.blockNumber, receipt?.blockNumber);
            if (events.length > 0) {
                const event = events[0];
                // These properties should be typed by Typechain
                const newValue = event.args.newValue;
                const caller = event.args.caller;
                (0, chai_1.expect)(typeof newValue).to.equal('bigint');
                (0, chai_1.expect)(typeof caller).to.equal('string');
                (0, chai_1.expect)(caller).to.match(/^0x[a-fA-F0-9]{40}$/);
            }
        });
        it('Should provide typed contract interface', async function () {
            // The contract should have typed methods available
            (0, chai_1.expect)(typeof counterContract.increment).to.equal('function');
            (0, chai_1.expect)(typeof counterContract.setMessage).to.equal('function');
            (0, chai_1.expect)(typeof counterContract.getCounter).to.equal('function');
            (0, chai_1.expect)(typeof counterContract.getMessage).to.equal('function');
            (0, chai_1.expect)(typeof counterContract.getCounterAndMessage).to.equal('function');
            (0, chai_1.expect)(typeof counterContract.owner).to.equal('function');
        });
    });
});

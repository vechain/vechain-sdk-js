import { expect } from "chai";
import { ethers } from "hardhat";
import { CounterContract } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("Counter with Typechain", function () {
  let counterContract: CounterContract;
  let owner: HardhatEthersSigner;
  let addr1: HardhatEthersSigner;
  let addr2: HardhatEthersSigner;

  const INITIAL_COUNTER = 10;
  const INITIAL_MESSAGE = "Test Message";

  beforeEach(async function () {
    console.log("Setting up test environment...");
    
    // Get signers
    [owner, addr1, addr2] = await ethers.getSigners();
    
    console.log("Owner address:", await owner.getAddress());
    console.log("Addr1 address:", await addr1.getAddress());
    
    // Deploy the contract
    const CounterContractFactory = await ethers.getContractFactory("CounterContract");
    counterContract = await CounterContractFactory.deploy(
      INITIAL_COUNTER,
      INITIAL_MESSAGE
    ) as CounterContract;
    
    await counterContract.waitForDeployment();
    console.log("Contract deployed to:", await counterContract.getAddress());
  });

  describe("Deployment", function () {
    it("Should set the correct initial values", async function () {
      expect(await counterContract.getCounter()).to.equal(INITIAL_COUNTER);
      expect(await counterContract.getMessage()).to.equal(INITIAL_MESSAGE);
    });

    it("Should set the deployer as owner", async function () {
      expect(await counterContract.owner()).to.equal(await owner.getAddress());
    });

    it("Should return combined values correctly", async function () {
      const [counter, message] = await counterContract.getCounterAndMessage();
      expect(counter).to.equal(INITIAL_COUNTER);
      expect(message).to.equal(INITIAL_MESSAGE);
    });
  });

  describe("Counter functionality", function () {
    it("Should increment counter and emit event", async function () {
      // Test increment function with typed contract
      const tx = await counterContract.increment();
      const receipt = await tx.wait();
      
      // Verify counter value
      expect(await counterContract.getCounter()).to.equal(INITIAL_COUNTER + 1);
      
      // Test event emission with Typechain types
      await expect(tx)
        .to.emit(counterContract, "CounterIncremented")
        .withArgs(INITIAL_COUNTER + 1, await owner.getAddress());
      
      // Query events using typed filters
      const events = await counterContract.queryFilter(
        counterContract.filters.CounterIncremented(),
        receipt?.blockNumber,
        receipt?.blockNumber
      );
      
      expect(events).to.have.length(1);
      expect(events[0].args.newValue).to.equal(INITIAL_COUNTER + 1);
      expect(events[0].args.caller).to.equal(await owner.getAddress());
    });

    it("Should allow multiple increments", async function () {
      // Multiple increments
      await counterContract.increment();
      await counterContract.increment();
      await counterContract.increment();
      
      expect(await counterContract.getCounter()).to.equal(INITIAL_COUNTER + 3);
    });

    it("Should work with different signers", async function () {
      // Connect contract to different signer
      const contractAsAddr1 = counterContract.connect(addr1);
      
      await contractAsAddr1.increment();
      
      expect(await counterContract.getCounter()).to.equal(INITIAL_COUNTER + 1);
      
      // Verify event with correct caller
      const filter = counterContract.filters.CounterIncremented();
      const events = await counterContract.queryFilter(filter);
      const latestEvent = events[events.length - 1];
      
      expect(latestEvent.args.caller).to.equal(await addr1.getAddress());
    });
  });

  describe("Message functionality", function () {
    it("Should allow owner to set message", async function () {
      const newMessage = "New Test Message";
      
      const tx = await counterContract.setMessage(newMessage);
      await tx.wait();
      
      expect(await counterContract.getMessage()).to.equal(newMessage);
      
      // Test event emission
      await expect(tx)
        .to.emit(counterContract, "MessageSet")
        .withArgs(newMessage, await owner.getAddress());
    });

    it("Should reject non-owner trying to set message", async function () {
      const contractAsAddr1 = counterContract.connect(addr1);
      
    // Verify that calling setMessage from non-owner reverts
      await expect(
        contractAsAddr1.setMessage("Unauthorized message 1")
      ).to.be.revertedWithCustomError(counterContract, "OwnableUnauthorizedAccount");

      await expect(
        contractAsAddr1.setMessage("Unauthorized message 2")
      ).to.be.reverted;

      await expect(
        contractAsAddr1.setMessage("Unauthorized message 3")
      ).not.to.be.revertedWithoutReason();

      await expect(
        contractAsAddr1.setMessage("Unauthorized message 4")
      ).not.to.be.revertedWithPanic();

      // Verify the message hasn't changed
      expect(await counterContract.getMessage()).to.equal(INITIAL_MESSAGE);
    });

    it("Should update combined result after message change", async function () {
      const newMessage = "Combined Result Test";
      await counterContract.setMessage(newMessage);
      
      const [counter, message] = await counterContract.getCounterAndMessage();
      expect(counter).to.equal(INITIAL_COUNTER);
      expect(message).to.equal(newMessage);
    });
  });

  describe("VeChain Thor Solo Integration", function () {
    it("Should work with VeChain addresses", async function () {
      const ownerAddress = await owner.getAddress();
      const addr1Address = await addr1.getAddress();
      
      // Verify addresses are valid Ethereum/VeChain format
      expect(ownerAddress).to.match(/^0x[a-fA-F0-9]{40}$/);
      expect(addr1Address).to.match(/^0x[a-fA-F0-9]{40}$/);
      
      console.log("Owner address format valid:", ownerAddress);
      console.log("Addr1 address format valid:", addr1Address);
    });

    it("Should handle gas estimation correctly", async function () {
      // Test gas estimation with Typechain types
      const estimatedGas = await counterContract.increment.estimateGas();
      expect(estimatedGas).to.be.greaterThan(0);
      
      console.log("Estimated gas for increment:", estimatedGas.toString());
    });

    it("Should provide transaction details", async function () {
      const tx = await counterContract.increment();
      const receipt = await tx.wait();
      
      expect(receipt).to.not.be.null;
      expect(receipt?.blockNumber).to.be.greaterThan(0);
      expect(receipt?.gasUsed).to.be.greaterThan(0);
      
      console.log("Transaction hash:", tx.hash);
      console.log("Block number:", receipt?.blockNumber);
      console.log("Gas used:", receipt?.gasUsed.toString());
    });
  });

  describe("Typechain Type Safety", function () {
    it("Should provide type safety for function calls", async function () {
      // These should compile without type errors due to Typechain
      const counter: bigint = await counterContract.getCounter();
      const message: string = await counterContract.getMessage();
      const [combinedCounter, combinedMessage]: [bigint, string] = await counterContract.getCounterAndMessage();
      
      expect(typeof counter).to.equal("bigint");
      expect(typeof message).to.equal("string");
      expect(typeof combinedCounter).to.equal("bigint");
      expect(typeof combinedMessage).to.equal("string");
    });

    it("Should provide typed event interfaces", async function () {
      const tx = await counterContract.increment();
      const receipt = await tx.wait();
      
      // Query with typed filter
      const events = await counterContract.queryFilter(
        counterContract.filters.CounterIncremented(),
        receipt?.blockNumber,
        receipt?.blockNumber
      );
      
      if (events.length > 0) {
        const event = events[0];
        // These properties should be typed by Typechain
        const newValue: bigint = event.args.newValue;
        const caller: string = event.args.caller;
        
        expect(typeof newValue).to.equal("bigint");
        expect(typeof caller).to.equal("string");
        expect(caller).to.match(/^0x[a-fA-F0-9]{40}$/);
      }
    });

    it("Should provide typed contract interface", async function () {
      // The contract should have typed methods available
      expect(typeof counterContract.increment).to.equal("function");
      expect(typeof counterContract.setMessage).to.equal("function");
      expect(typeof counterContract.getCounter).to.equal("function");
      expect(typeof counterContract.getMessage).to.equal("function");
      expect(typeof counterContract.getCounterAndMessage).to.equal("function");
      expect(typeof counterContract.owner).to.equal("function");
    });
  });
}); 
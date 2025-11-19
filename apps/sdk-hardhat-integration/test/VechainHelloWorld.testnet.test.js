"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hardhat_1 = require("hardhat");
const chai_1 = require("chai");
/**
 * Tests for the 'VechainHelloWorld' contract
 */
describe('VechainHelloWorld', function () {
    it('sayHello() should return the correct message', async function () {
        const VechainHelloWorld = await hardhat_1.ethers.getContractFactory('VechainHelloWorld');
        const contract = await VechainHelloWorld.deploy();
        // Call the sayHello function and check the return value
        const helloMessage = await contract.sayHello();
        (0, chai_1.expect)(helloMessage).to.equal('Hello world from Vechain!');
    });
});

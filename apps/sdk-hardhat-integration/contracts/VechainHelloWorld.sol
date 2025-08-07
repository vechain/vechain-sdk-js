// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.24;

/**
 * @title VechainHelloWorld
 * @dev A simple contract that says hello
 */
contract VechainHelloWorld {
    // State variable to store the owner's address
    address payable public owner;

    /**
     * @dev Constructor that sets the owner of the contract to the deployer's address
     */
    constructor() payable {
        owner = payable(msg.sender);
    }

    /**
     * @dev Function to return a hello message
     * @return The hello message
     */
    function sayHello() public pure returns (string memory) {
        return "Hello world from Vechain!";
    }
}

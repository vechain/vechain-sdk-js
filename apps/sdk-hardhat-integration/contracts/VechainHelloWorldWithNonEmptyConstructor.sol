// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.24;

/**
 * @title VechainHelloWorldWithNonEmptyConstructor
 * @dev A simple contract that says hello and accepts a parameter in the constructor
 */
contract VechainHelloWorldWithNonEmptyConstructor {
    // State variable to store the owner's address
    address payable public owner;

    // State variable to store a simple parameter
    uint8 public simpleParameter;

    /**
     * @dev Constructor that sets the owner of the contract and initializes a simple parameter
     * @param _simpleParameter An unsigned 8-bit integer to be stored in the contract
     */
    constructor(uint8 _simpleParameter) payable {
        owner = payable(msg.sender);
        simpleParameter = _simpleParameter;
    }

    /**
     * @dev Function to return a hello message
     * @return The hello message
     */
    function sayHello() public pure returns (string memory) {
        return "Hello world from Vechain!";
    }
}

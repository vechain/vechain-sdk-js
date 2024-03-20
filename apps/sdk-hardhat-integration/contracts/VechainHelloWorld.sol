// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

/**
 * A simple contract that says hello
 */
contract VechainHelloWorld {
    address payable public owner;

    constructor() payable {
        owner = payable(msg.sender);
    }

    /**
     * Say hello

     * @return The hello message
     */
    function sayHello() public pure returns (string memory) {
        return string("Hello world from Vechain!");
    }
}

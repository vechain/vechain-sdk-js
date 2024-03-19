// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

/**
 * A simple contract that says hello
 */
contract VechainHelloWorldWithNonEmptyConstructor {
    address payable public owner;
    uint8 public simpleParameter;

    constructor(uint8 _simpleParameter) payable {
        owner = payable(msg.sender);
        simpleParameter = _simpleParameter;
    }

    /**
     * Say hello

     * @return The hello message
     */
    function sayHello() public pure returns (string memory) {
        return string("Hello world from Vechain!");
    }
}

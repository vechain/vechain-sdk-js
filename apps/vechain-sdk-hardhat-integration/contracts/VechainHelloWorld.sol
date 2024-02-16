// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

/**
 * A simple contract that says hello to the address of the contract owner
 */
contract VechainHelloWorld {
    address payable public owner;

    constructor() payable {
        owner = payable(msg.sender);
    }

    /**
     * Say hello to the address of contract owner

     * @return The hello message
     */
    function sayHello() public view returns (string memory) {
        // Uncomment this line, and the import of "hardhat/console.sol", to print a log in your terminal
        // console.log("Unlock time is %o and block timestamp is %o", unlockTime, block.timestamp);

        return string(abi.encodePacked("Hello - ", addressToString(owner)));
    }

    /**
     * Convert an address to a string
     *
     * @param _address The address to convert
     * @return The address as a string
     */
    function addressToString(address _address) internal pure returns (string memory) {
        bytes32 value = bytes32(uint256(uint160(_address)));
        bytes memory alphabet = "0123456789abcdef";

        bytes memory str = new bytes(51);
        str[0] = "0";
        str[1] = "x";
        for (uint i = 0; i < 20; i++) {
            str[2 + i * 2] = alphabet[uint(uint8(value[i + 12] >> 4))];
            str[3 + i * 2] = alphabet[uint(uint8(value[i + 12] & 0x0f))];
        }
        return string(str);
    }
}

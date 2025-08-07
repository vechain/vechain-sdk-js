// contracts/GLDToken.sol
// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

// Importing the ERC20 contract from OpenZeppelin
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// Defining the GLDToken contract which inherits from ERC20
contract GLDToken is ERC20 {
    // Constructor to initialize the token with an initial supply
    // `initialSupply` is the amount of tokens that will be created at deployment
    constructor(uint256 initialSupply) ERC20("Gold", "GLD") {
        // Mint the initial supply of tokens and assign them to the contract deployer
        _mint(msg.sender, initialSupply);
    }
}

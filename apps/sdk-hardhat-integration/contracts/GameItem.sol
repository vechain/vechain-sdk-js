// contracts/GameItem.sol
// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

// Importing necessary libraries from OpenZeppelin
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

// Defining the GameItem contract which inherits from ERC721URIStorage
contract GameItem is ERC721URIStorage {
    // State variable to keep track of _nextTokenId
    uint256 private _nextTokenId;

    // Constructor to initialize the ERC721 token with a name and symbol
    constructor() ERC721("GameItem", "ITM") {}

    // Function to award an item (mint a new token)
    // `player` is the address to receive the new token
    // `tokenURI` is the metadata URI associated with the new token
    function awardItem(address player, string memory tokenURI)
    public
    returns (uint256)
    {
        // Generate a new token ID and increment _nextTokenId counter
        uint256 tokenId = _nextTokenId++;

        // Mint the new token and assign it to the `player` address
        _mint(player, tokenId);

        // Set the token URI for the new token
        _setTokenURI(tokenId, tokenURI);

        // Return the new token ID
        return tokenId;
    }
}

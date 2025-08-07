// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title Extension extends EVM functions.
/// Extension gives an opportunity for the developer to get information of the current transaction and any history block within the range of genesis to best block.
/// The information obtained based on block numer includes blockID, blockTotalScore, blockTime and blockSigner.
/// The developer can also get the current transaction information, including txProvedWork, txID, txBlockRef and txExpiration.

interface Extension {
    /// @notice blake2b256 computes blake2b-256 checksum for given data.
    function blake2b256(bytes memory _value) external view returns(bytes32);

    /// @notice These functions return corresponding block info from genesis to best block.
    function blockID(uint num) external view returns(bytes32);
    function blockTotalScore(uint num) external view returns(uint64);
    function blockTime(uint num) external view returns(uint);
    function blockSigner(uint num) external view returns(address);

    /// @return total supply of VET
    function totalSupply() external view returns(uint256);

    /// @notice These funtions return corresponding current transaction info.
    function txProvedWork() external view returns(uint256);
    function txID() external view returns(bytes32);
    function txBlockRef() external view returns(bytes8);
    function txExpiration() external view returns(uint);

    /// @notice Get the account that pays the TX fee at runtime. 
    function txGasPayer() external view returns(address);
}
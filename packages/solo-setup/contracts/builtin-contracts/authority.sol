// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

/// @title Authority is related to the POA(proof of authority) consensus mechanism.
/// The Authority contract manages a list of candidates proposers who is responsible for packing transactions into a block.
/// The proposers are authorized by a voting committee, but only the first 101 proposers in the candidates list can pack block.
/// A candidates propser include signer address, endorsor address and identity.
/// Signer address is releated to sign a block, endorsor address is used for charging miner's fee and identity is used for identifying the proposer.

interface Authority {

    /// @return executor address
    function executor() external view returns(address);

    /// @notice add a proposer to the candidates lists.
    function add(address _signer, address _endorsor, bytes32 _identity) external;

    /// @notice remove proposer '_signer' from the candidates lists.
    function revoke(address _signer) external;

    /// @notice get information about proposer "_signer"
    function get(address _signer) external view returns(bool listed, address endorsor, bytes32 identity, bool active);
    
    /// @notice get the first proposer in the candidates list.
    function first() external view returns(address);

    /// @notice get next one of proposer "_signer"
    function next(address _signer) external view returns(address);
}
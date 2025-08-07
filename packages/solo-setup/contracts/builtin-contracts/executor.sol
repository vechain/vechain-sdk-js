// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title Executor represents core component for on-chain governance. 
/// The on-chain governance params can be changed by the Executor through a voting.
/// A executive committee are composed to seven approvers who had been added to the contract Executor in the genesis block.
/// The new approver can be added and the old approver also can be removed from the executive committee.
/// The steps of executor include proposing, approving and executing voting if the voting was passed.
/// Only the approver in the executive committee has the authority to propose and approving a voting.

interface Executor {    
    /// @notice proposing a voting from a approver
    /// @param _target a contract address, it will be executed if the voting is passed.
    /// @param _data call data, usually composed to method ID plus input data.
    function propose(address _target, bytes memory _data) external returns(bytes32);

    /// @notice approving a voting from a approver
    /// @param _proposalID identify a voting
    function approve(bytes32 _proposalID) external;

    /// @notice If the voting is passed, the '_proposalID' will be executed.
    /// If the two-thirds of approvers in the executive committee approve a voting, the voting will be passed.
    /// The voting must be finished one week, or it will be faied no matter pass or not.
    function execute(bytes32 _proposalID) external;

    /// @notice add new a new pprover '_approver' to the executive committee
    /// @param _approver account address of the '_approver'
    /// @param _identity the id of the '_approver'
    function addApprover(address _approver, bytes32 _identity) external;

    /// @notice remove an old approver '_approver' from the executive committee
    function revokeApprover(address _approver) external;

    /// @notice The contract which is attached can propose a voting
    function attachVotingContract(address _contract) external;

    /// @notice detach a voting
    function detachVotingContract(address _contract) external;
}
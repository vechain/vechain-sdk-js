// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// Prototype is an account management model of VeChainThor.
// In the account management model every contract has a master account, which, by default, is the creator of a contract.
// The master account plays the role of a contract manager, which has some authorities including 
// "setMaster", "setCreditPlan", "addUser", "removeUser" and "selectSponsor".
// Every contract keeps a list of users who can call the contract for free but limited by credit.
// The user of a specific contract can be either added or removed by the contract master.
// Although from a user's perspective the fee is free, it is paid by a sponsor of the contract.
// Any one can be a sponser of a contract, just by calling sponsor function, and also the sponsor identity can be cancelled by calling unsponsor funtion.
// A contract may have more than one sponsors, but only the current sponsor chosen by master need to pay the fee for the contract.
// If the current sponsor is out of energy, master can select sponser from other sponsers candidates by calling selectSponsor function.
// The creditPlan can be set by the master which includes credit and recoveryRate. Every user have the same original credit.
// Every Transaction consumes some amount of credit which is equal to the fee of the Transaction, and the user can also pay the fee by itself if the gas payer is out of the credit. 
// The credit can be recovered based on recoveryRate (per block).

interface Prototype {
    /// @param self contract address
    /// @return master address of self
    function master(address self) external view returns(address);

    /// @notice 'newMaster' will be set to contract 'self' and this function only works when msg sender is the old master.
    /// @param self contract address
    /// @param newMaster new master account which will be set.
    function setMaster(address self, address newMaster) external;

    /// @param self account address which may be contract account or external account address.
    /// @param blockNumber balance will be calculated at blockNumber
    /// @return the amount of VET at blockNumber
    function balance(address self, uint blockNumber) external view returns(uint256);

    /// @param self account address which may be contract account or external account address.
    /// @param blockNumber energy will be calculated at blockNumber
    /// @return the amount of energy at blockNumber
    function energy(address self, uint blockNumber) external view returns(uint256);

    /// @param self check if address self is a contract account
    function hasCode(address self) external view returns(bool);

    /// @param self contract address
    /// @return value indexed by key at self storage
    function storageFor(address self, bytes32 key) external view returns(bytes32);

    /// @param self contract address
    /// @return credit and recoveryRate of contract 'self'
    function creditPlan(address self) external view returns(uint256 credit, uint256 recoveryRate);

    /// @param self contract address 
    /// @param credit original credit
    /// @param recoveryRate recovery rate of credit
    function setCreditPlan(address self, uint256 credit, uint256 recoveryRate) external;

    /// @notice check if address 'user' is the user of contract 'self'.
    function isUser(address self, address user) external view returns(bool);

    /// @notice return the current credit of 'user' of the contract 'self'.
    function userCredit(address self, address user) external view returns(uint256);

    /// @notice add address 'user' to the user list of a contract 'self'.
    function addUser(address self, address user) external;

    /// @notice remove 'user' from the user list of a contract 'self'.
    function removeUser(address self, address user) external;

    /// @notice msg sender volunteers to be a sponsor of the contract 'self'.
    function sponsor(address self) external;
 
    /// @notice msg sender removes itself from the sponsor candidates list of contract 'self'.
    function unsponsor(address self) external;

    /// @notice check if 'sponsorAddress' is the sponser of contract 'self'.
    function isSponsor(address self, address sponsorAddress) external view returns(bool);

    /// @notice select 'sponsorAddress' to be current selected sponsor of contract 'self'
    function selectSponsor(address self, address sponsorAddress) external;  

    /// @notice return current selected sponsor of contract 'self'
    function currentSponsor(address self) external view returns(address);
}
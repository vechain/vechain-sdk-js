// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./prototype.sol";
import "./energy.sol";
import "./authority.sol";
import "./extension.sol";
import "./params.sol";
import "./executor.sol";

/**
 * @title Builtin
 * @dev The VeChainThor builtin contracts are encapsulated in library Builtin.
 * It's very easy to use it for the developer, just need import it.
 */
library Builtin {
    function bytesToAddress(bytes memory b) public pure returns (address) {
        require(b.length <= 20, "Byte array must be less than or equal to 20 bytes");

        uint160 addr;
        // Take the last 20 bytes and convert them to address
        assembly {
            addr := mload(add(b, 32))
        }
        return address(addr);
    }

    /// @return the instance of the contract "Authority".
    function getAuthority() internal pure returns(Authority) {
        return Authority(0x0000000000000000000000417574686f72697479);
    }

    /// @return the instance of the contract "Energy".
    function getEnergy() internal pure returns(Energy) {
        return Energy(0x0000000000000000000000000000456E65726779);
    }

    /// @return the instance of the contract "Extension".
    function getExtension() internal pure returns(Extension) {
        return Extension(0x0000000000000000000000457874656E73696F6e);
    }

    /// @return the instance of the contract "Params".
    function getParams() internal pure returns(Params) {
        return Params(0x0000000000000000000000000000506172616D73);
    }

    /// @return the instance of the contract "Executor".
    function getExecutor() internal pure returns(Executor) {
        return Executor(0x0000000000000000000000004578656375746f72);
    }

    Energy constant energy = Energy(0x0000000000000000000000000000456E65726779);

    /// @return amount of VeThor in account 'self'.
    function $energy(address self) internal view returns(uint256 amount){
        return energy.balanceOf(self);
    }

    /// @notice transfer 'amount' of VeThor from msg sender to account 'self'.
    function $transferEnergy(address self, uint256 amount) internal{
        energy.transfer(self, amount);
    }

    /// @notice transfer 'amount' of VeThor from account 'self' to account 'to'.
    function $moveEnergyTo(address self, address to, uint256 amount) internal{
        energy.move(self, to, amount);
    }

    Prototype constant prototype = Prototype(0x000000000000000000000050726f746F74797065);

    /// @return master address of self
    function $master(address self) internal view returns(address){
        return prototype.master(self);
    }

    /// @notice 'newMaster' will be set to contract 'self' and this function only works when msg sender is the old master.
    function $setMaster(address self, address newMaster) internal {
        prototype.setMaster(self, newMaster);
    }

    /// @return the amount of VET at blockNumber
    function $balance(address self, uint blockNumber) internal view returns(uint256){
        return prototype.balance(self, blockNumber);
    }

    /// @return the amount of energy at blockNumber
    function $energy(address self, uint blockNumber) internal view returns(uint256){
        return prototype.energy(self, blockNumber);
    }

    /// @notice 'self' check if address self is a contract account
    function $hasCode(address self) internal view returns(bool){
        return prototype.hasCode(self);
    }

    /// @return value indexed by key at self storage
    function $storageFor(address self, bytes32 key) internal view returns(bytes32){
        return prototype.storageFor(self, key);
    }

    /// @return credit - The credit of contract 'self'
    /// @return recoveryRate - The recovery rate of contract 'self'
    function $creditPlan(address self) internal view returns(uint256 credit, uint256 recoveryRate){
        return prototype.creditPlan(self);
    }

    /// @notice set creditPlan to contract 'self'
    function $setCreditPlan(address self, uint256 credit, uint256 recoveryRate) internal{
        prototype.setCreditPlan(self, credit, recoveryRate);
    }

    /// @notice check if address 'user' is the user of contract 'self'.
    function $isUser(address self, address user) internal view returns(bool){
        return prototype.isUser(self, user);
    }

    /// @notice return the current credit of 'user' of the contract 'self'.
    function $userCredit(address self, address user) internal view returns(uint256){
        return prototype.userCredit(self, user);
    }

    /// @notice add address 'user' to the user list of a contract 'self'.
    function $addUser(address self, address user) internal{
        prototype.addUser(self, user);
    }

    /// @notice remove 'user' from the user list of a contract 'self'.
    function $removeUser(address self, address user) internal{
        prototype.removeUser(self, user);
    }

    /// @notice check if 'sponsorAddress' is the sponser of contract 'self'.
    function $isSponsor(address self, address sponsor) internal view returns(bool){
        return prototype.isSponsor(self, sponsor);
    }

    /// @notice select 'sponsorAddress' to be current selected sponsor of contract 'self'
    function $selectSponsor(address self, address sponsor) internal{
        prototype.selectSponsor(self, sponsor);
    }

    /// @notice return current selected sponsor of contract 'self'
    function $currentSponsor(address self) internal view returns(address){
        return prototype.currentSponsor(self);
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title Energy represents the sub-token in VeChainThor which conforms VIP180(ERC20) standard.
/// The name of token is "VeThor" and 1 THOR equals to 1e18 wei. The main function of VeThor is to pay for the transaction fee. 
/// VeThor is generated from VET, so the initial supply of VeThor is zero in the genesis block.
/// The growth rate of VeThor is 5000000000 wei per token(VET) per second, that is to say 1 VET will produce about 0.000432 THOR per day.
/// The miner will charge 30 percent of transation fee and 70 percent will be burned. So the total supply of VeThor is dynamic.

interface Energy {
    //// @return TOKEN name: "VeThor".
    function name() external pure returns (string memory);

    /// @notice 1e18 wei is equal to 1 THOR
    /// @return 18
    function decimals() external pure returns (uint8);

    /// @return "VTHO"
    function symbol() external pure returns (string memory);

    /// @return total supply of VeThor
    function totalSupply() external view returns (uint256);

    /// @return total amount of burned VeThor
    function totalBurned() external view returns(uint256);

    /// @return balance - amount of VeThor in account '_owner'.
    function balanceOf(address _owner) external view returns (uint256 balance);

    /// @notice transfer '_amount' of VeThor from msg sender to account '_to'
    function transfer(address _to, uint256 _amount) external returns (bool success);

    /// @notice It's not a VIP180(ERC20)'s standard method.
    /// transfer '_amount' of VeThor from account '_from' to account '_to'
    /// If account '_from' is an external account, '_from' must be the msg sender, or
    /// if account '_from' is a contract account, msg sender must be the master of contract '_from'.
    function move(address _from, address _to, uint256 _amount) external returns (bool success);

    /// @notice It's a VIP180(ERC20)'s standard method.
    function transferFrom(address _from, address _to, uint256 _amount) external returns(bool success);

    /// @notice It's a VIP180(ERC20)'s standard method.
    /// @return remaining - remaining amount of VeThor that the '_spender' is able to withdraw from '_owner'.
    function allowance(address _owner, address _spender)  external view returns (uint256 remaining);

    /// @notice It's a VIP180(ERC20)'s standard method which means approving a '_value' to be transferred to _spender from msg sender.
    function approve(address _spender, uint256 _value) external returns (bool success);
}

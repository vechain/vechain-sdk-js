// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

/// @title Params stores the governance params of VeChainThor.
/// The params can be set by the executor, a contract that is authorized to modify governance params by a voting Committee.
/// Anyone can get the params just by calling "get" funtion.
/// The governance params is written in genesis block at launch time.
/// You can check these params at source file: https://github.com/vechain/thor/blob/master/thor/params.go.

interface Params {
    function executor() external view returns(address);
    function set(bytes32 _key, uint256 _value) external;
    function get(bytes32 _key) external view returns(uint256);
}
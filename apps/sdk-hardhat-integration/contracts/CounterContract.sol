// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import '@openzeppelin/contracts/access/Ownable.sol';

contract CounterContract is Ownable {
    uint256 private _counter;
    string private _message;

    event CounterIncremented(uint256 newValue, address indexed caller);
    event MessageSet(string newMessage, address indexed caller);

    constructor(
        uint256 initialCounter,
        string memory initialMessage
    ) Ownable(msg.sender) {
        _counter = initialCounter;
        _message = initialMessage;
    }

    function increment() external {
        _counter++;
        emit CounterIncremented(_counter, msg.sender);
    }

    function setMessage(string calldata newMessage) external onlyOwner {
        _message = newMessage;
        emit MessageSet(newMessage, msg.sender);
    }

    function getCounter() external view returns (uint256) {
        return _counter;
    }

    function getMessage() external view returns (string memory) {
        return _message;
    }

    function getCounterAndMessage()
        external
        view
        returns (uint256, string memory)
    {
        return (_counter, _message);
    }
}

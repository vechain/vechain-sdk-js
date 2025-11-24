// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

// Import the builtin contract to access extended EVM builtin functions
import "./builtin-contracts/builtin.sol";


/// @title TestingContract for VeChain SDK Integration
/// @notice This contract is designed for testing various data types, error handling,
/// and state management in Solidity, particularly for SDK integration.
contract TestingContract {

    // ---------------------------- State Variables & Custom Types ---------------------------- //

    // Builtin contract to access extended EVM builtin functions
    /// @dev This is a builtin contract that provides access to extended EVM builtin functions
    /// @dev See: [Thor Built-ins](https://github.com/vechain/thor-builtins)
    Extension extension = Builtin.getExtension();

    // Custom struct type
    struct ExampleStruct {
        uint id;
        string name;
    }

    // Custom enum type
    enum ExampleEnum { SMALL, MEDIUM, LARGE }

    // Custom error type
    error CustomError(string message);

    // State variable example
    uint public stateVariable = 0;

    // Mapping example
    mapping(address => uint) public balances;

    // Event example
    event StateChanged(uint indexed newValue, uint indexed oldValue, address indexed sender, uint timestamp);

    // Modifier example
    modifier onlyPositive(uint _value) {
        require(_value > 0, "Value must be positive");
        _;
    }

    // ---------------------------- Functions ---------------------------- //

    // ------ State Management Functions Start ------ //

    /// @notice Set the state variable
    /// @param _newValue The new value to set
    function setStateVariable(uint _newValue) public {
        uint oldValue = stateVariable;
        stateVariable = _newValue;
        emit StateChanged(_newValue, oldValue, msg.sender, block.timestamp);
    }

    /// @notice Deposit funds to the contract
    /// @param _amount The amount to deposit
    function deposit(uint _amount) public onlyPositive(_amount) {
        balances[msg.sender] += _amount;
    }

    /// @notice Withdraw funds from the contract
    /// @param _amount The amount to withdraw
    function withdraw(uint _amount) public {
        require(balances[msg.sender] >= _amount, "Insufficient balance");
        balances[msg.sender] -= _amount;
        payable(msg.sender).transfer(_amount);
    }

    /// @notice Retrieve the balance of a given address
    /// @param _address The address to query the balance of
    /// @return The balance of the address
    function getBalance(address _address) public view returns (uint) {
        return balances[_address];
    }

    // ------ State Management Functions End ------ //

    // ------ Data Types Start ------ //

    /// @notice Retrieve the boolean data passed
    /// @param _boolData The boolean data to return
    /// @return The input boolean data
    function boolData(bool _boolData) public pure returns (bool) {
        return _boolData;
    }

    /// @notice Retrieve the int data passed
    /// @param _intData The int data to return
    /// @return The input int data
    function intData(int _intData) public pure returns (int) {
        return _intData;
    }

    /// @notice Retrieve the uint data passed
    /// @param _uintData The uint data to return
    /// @return The input uint data
    function uintData(uint _uintData) public pure returns (uint) {
        return _uintData;
    }

    /// @notice Retrieve the address data passed
    /// @param _addressData The address data to return
    /// @return The input address data
    function addressData(address _addressData) public pure returns (address) {
        return _addressData;
    }

    /// @notice Retrieve the bytes32 data passed
    /// @param _byteData The bytes32 data to return
    /// @return The input bytes32 data
    function bytes32Data(bytes32 _byteData) public pure returns (bytes32) {
        return _byteData;
    }

    /// @notice Retrieve the string data passed
    /// @param _stringData The string data to return
    /// @return The input string data
    function stringData(string memory _stringData) public pure returns (string memory) {
        return _stringData;
    }

    /// @notice Retrieve the fixed array data passed
    /// @param _fixedArrayData The fixed array data to return
    /// @return The input fixed array data
    function fixedArrayData(uint[3] memory _fixedArrayData) public pure returns (uint[3] memory) {
        return _fixedArrayData;
    }

    /// @notice Retrieve the dynamic array data passed
    /// @param _dynamicArrayData The dynamic array data to return
    /// @return The input dynamic array data
    function dynamicArrayData(uint[] memory _dynamicArrayData) public pure returns (uint[] memory) {
        return _dynamicArrayData;
    }

    /// @notice Retrieve the struct data passed
    /// @param _structData The struct data to return
    /// @return The input struct data
    function structData(ExampleStruct memory _structData) public pure returns (ExampleStruct memory) {
        return _structData;
    }

    /// @notice Retrieve the enum data passed
    /// @param _enumData The enum data to return
    /// @return The input enum data
    function enumData(ExampleEnum _enumData) public pure returns (ExampleEnum) {
        return _enumData;
    }

    /// @notice Retrieve the multiple data passed
    /// @param _uintData The uint data to return
    /// @param _addressData The address data to return
    /// @param _byteData The bytes32 data to return
    function multipleData(
        uint _uintData,
        address _addressData,
        bytes32 _byteData,
        string memory _stringData,
        uint[3] memory _fixedArrayData,
        uint[] memory _dynamicArrayData,
        ExampleStruct memory _structData,
        ExampleEnum _enumData
    )
        public
        pure
        returns (
            uint,
            address,
            bytes32,
            string memory,
            uint[3] memory,
            uint[] memory,
            ExampleStruct memory,
            ExampleEnum
        )
    {
        return (
            _uintData,
            _addressData,
            _byteData,
            _stringData,
            _fixedArrayData,
            _dynamicArrayData,
            _structData,
            _enumData
        );
    }

    /// @notice Retrieve the multiple int data passed
    /// @param _uint8Data The uint8 data to return
    /// @param _uint16Data The uint16 data to return
    /// @param _uint32Data The uint32 data to return
    function multipleIntData(
        uint8 _uint8Data,
        uint16 _uint16Data,
        uint32 _uint32Data,
        uint64 _uint64Data,
        uint160 _uint160Data,
        uint256 _uint256Data
    )
        public
        pure
        returns (
            uint8,
            uint16,
            uint32,
            uint64,
            uint160,
            uint256
        )
    {
        return (
            _uint8Data,
            _uint16Data,
            _uint32Data,
            _uint64Data,
            _uint160Data,
            _uint256Data
        );
    }

    // ------ Data Types End ------ //

    // ------ Error Handling Start ------ //

    /// @notice Tests for a require condition; reverts if the condition is not met
    /// @dev Demonstrates error handling using 'require'
    /// @param _value The value to test against the condition
    function testRequireError(uint _value) public pure {
        require(_value > 10, "Value must be greater than 10");
    }

    /// @notice Tests for an assert condition; fails for any value other than 0
    /// @dev Demonstrates error handling using 'assert'
    /// @param _value The value to test against the condition
    function testAssertError(uint _value) public pure {
        assert(_value == 0); // This will fail for any value other than 0
    }

    /// @notice Reverts the transaction if the value is less than 5
    /// @param _value The value to test the condition against
    function testRevertError(uint _value) public pure {
        if (_value < 5) {
            revert("Value must be at least 5");
        }
    }

    /// @notice Reverts the transaction with a custom error if the value is not 42
    /// @param _value The value to test the condition against
    function testCustomError(uint _value) public pure {
        if (_value != 42) {
            revert CustomError("Value is not 42");
        }
    }

    /// @notice Tests for an overflow error
    /// @dev Demonstrates an overflow error, should revert if the value is 255
    /// @param _value The value to test for overflow
    /// @return The value plus 1
    function testOverflowError(uint8 _value) public pure returns (uint8) {
        return _value + 1; // This will overflow if _value is 255
    }

    /// @notice Demonstrates an invalid opcode error
    /// @dev This will always revert with an invalid opcode error
    function testInvalidOpcodeError() public pure {
        assembly {
            invalid() // EVM invalid opcode
        }
    }

    // ------ Error Handling End ------ //

    // ------ VeChainThor EVM Extension functions Start ------ //

    /// @notice Get the blockID of the given block number
    /// @param blockNum The block number to query
    function getBlockID(uint blockNum) public view returns (bytes32) {
        return extension.blockID(blockNum);
    }

    /// @notice Get the block total score of the given block defined by the block number.
    /// @dev The total score is the accumulated witness number (AWN) (https://docs.vechain.org/introduction-to-vechain/about-the-vechain-blockchain/consensus-deep-dive#meta-transaction-features-3)
    /// @param blockNum The block number to query
    function getBlockTotalScore(uint blockNum) public view returns (uint64) {
        return extension.blockTotalScore(blockNum);
    }

    /// @notice Get the block time of the given block number
    /// @param blockNum The block number to query
    function getBlockTime(uint blockNum) public view returns (uint) {
        return extension.blockTime(blockNum);
    }

    /// @notice Get the block signer of the given block number
    /// @param blockNum The block number to query
    function getBlockSigner(uint blockNum) public view returns (address) {
        return extension.blockSigner(blockNum);
    }

    /// @notice Get total supply of VET
    function getTotalSupply() public view returns (uint256) {
        return extension.totalSupply();
    }

    /// @notice Get the `provedWork` of the current transaction
    function getTxProvedWork() public view returns (uint256) {
        return extension.txProvedWork();
    }

    /// @notice Get the transaction ID of the current transaction
    function getTxID() public view returns (bytes32) {
        return extension.txID();
    }

    /// @notice Get the `blockRef` of the current transaction
    function getTxBlockRef() public view returns (bytes8) {
        return extension.txBlockRef();
    }

    /// @notice Get the `expiration` of the current transaction
    function getTxExpiration() public view returns (uint) {
        return extension.txExpiration();
    }

    /// @notice Get the data hashed using Blake2b256
    /// @param _data The data to hash
    function calculateBlake2b256(bytes memory _data) public view returns (bytes32) {
        return extension.blake2b256(_data);
    }

    // ------ VeChainThor EVM Extension functions End ------ //
}

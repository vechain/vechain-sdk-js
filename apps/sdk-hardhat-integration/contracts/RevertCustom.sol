// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

/**
 * A simple contract that reverts with a custom error
 */
contract RevertCustom {

    error CustomError(string message);

    /*
     * Revert with a custom error
     * @return The error message
     */
    function revertWithCustomError(string memory errorMessage) public pure {
        revert CustomError(errorMessage);
    }
}

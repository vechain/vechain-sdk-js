import { type InterfaceAbi } from '@vechain/vechain-sdk-core';
import type { TransactionReceipt } from '../../transactions';
import { type ThorClient } from '../../thor-client';

/**
 * A class representing a smart contract deployed on the blockchain.
 */
class Contract {
    private readonly abi: InterfaceAbi;
    private readonly thor: ThorClient;
    public address: string;

    public deployTransactionReceipt: TransactionReceipt | undefined;

    /**
     * Initializes a new instance of the `Contract` class.
     * @param address The address of the contract.
     * @param abi The Application Binary Interface (ABI) of the contract, which defines the contract's methods and events.
     * @param thor An instance of ThorClient to interact with the blockchain.
     * @param transactionReceipt (Optional) The transaction receipt of the contract deployment.
     */
    constructor(
        address: string,
        abi: InterfaceAbi,
        thor: ThorClient,
        transactionReceipt?: TransactionReceipt
    ) {
        this.abi = abi;
        this.thor = thor;
        this.address = address;
        this.deployTransactionReceipt = transactionReceipt;
    }
}

export { Contract };

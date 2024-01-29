import { type InterfaceAbi } from '@vechain/vechain-sdk-core';
import type { TransactionReceipt } from '../../transactions';
import { type ThorClient } from '../../thor-client';

class Contract {
    private readonly abi: InterfaceAbi;
    private readonly thor: ThorClient;
    public address: string;

    public deployTransactionReceipt: TransactionReceipt | undefined;

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

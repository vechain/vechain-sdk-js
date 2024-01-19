import { type InterfaceAbi } from '@vechain/vechain-sdk-core';
import type { TransactionReceipt } from '../../transactions';
import { type ThorClient } from '../../thor-client';

class Contract {
    private readonly abi: InterfaceAbi;
    private readonly thor: ThorClient;
    public address: string | null;

    private readonly deployTransactionReceipt: TransactionReceipt;

    constructor(
        abi: InterfaceAbi,
        thor: ThorClient,
        transactionReceipt: TransactionReceipt
    ) {
        this.abi = abi;
        this.thor = thor;
        this.deployTransactionReceipt = transactionReceipt;
        this.address = transactionReceipt.outputs[0].contractAddress;
    }
}

export { Contract };

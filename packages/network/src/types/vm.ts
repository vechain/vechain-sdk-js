/**
 * The `VMExplainer` interface is used to simulate transaction execution.
 */
interface VMExplainer {
    /**
     * Set the caller address (msg.sender).
     * @param addr - The caller's address.
     * @returns The updated VMExplainer object.
     */
    caller: (addr: string) => this;

    /**
     * Set the maximum allowed gas.
     * @param gas - The gas limit.
     * @returns The updated VMExplainer object.
     */
    gas: (gas: number) => this;

    /**
     * Set the gas price, presented as a hex/decimal string or number.
     * @param gp - The gas price.
     * @returns The updated VMExplainer object.
     */
    gasPrice: (gp: string | number) => this;

    /**
     * Set the gas payer's address.
     * @param addr - The gas payer's address.
     * @returns The updated VMExplainer object.
     */
    gasPayer: (addr: string) => this;

    /**
     * Turn on result cache with hints for cache invalidation.
     * @param hints - A set of addresses as conditions for cache invalidation.
     * @returns The updated VMExplainer object.
     */
    cache: (hints: string[]) => this;

    /**
     * Execute the defined clauses (dry-run) without altering the blockchain.
     * @returns A promise that resolves to an array of VMOutput objects.
     */
    execute: () => Promise<VMOutput[]>;
}

/**
 * Represents a clause in a virtual machine execution.
 */
interface VMClause {
    to: string | null; // Recipient address (or null).
    value: string | number; // Value in hex string or number.
    data?: string; // Transaction data in hex string (optional).
}

/**
 * Represents the output of a virtual machine execution.
 */
interface VMOutput {
    data: string; // Output data in hex string.
    vmError: string; // Virtual machine error message.
    gasUsed: number; // Gas used.
    reverted: boolean; // Indicates if the transaction was reverted.
    revertReason?: string; // Revert reason (if available).
    events: VMEvent[]; // Array of virtual machine events.
    transfers: VMTransfer[]; // Array of virtual machine transfers.
}

/**
 * Represents a virtual machine event.
 */
interface VMEvent {
    address: string; // Event address.
    topics: string[]; // Event topics.
    data: string; // Event data in hex string.
}

/**
 * Represents a virtual machine transfer.
 */
interface VMTransfer {
    sender: string; // Sender's address.
    recipient: string; // Recipient's address.
    amount: string; // Transfer amount in hex string.
}

export type { VMExplainer, VMClause, VMOutput, VMEvent, VMTransfer };

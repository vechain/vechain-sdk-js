/** the Explainer interface, to simulate tx execution */
interface VMExplainer {
    /** set caller address (msg.sender) */
    caller: (addr: string) => this;

    /** set max allowed gas */
    gas: (gas: number) => this;

    /** set gas price, presented by hex/dec string or number type */
    gasPrice: (gp: string | number) => this;

    /** set gas payer */
    gasPayer: (addr: string) => this;

    /**
     * turn on result cache
     * @param hints a set of addresses, as the condition of cache invalidation
     */
    cache: (hints: string[]) => this;

    /** execute clauses (dry-run, without altering blockchain) */
    execute: () => Promise<VMOutput[]>;
}

interface VMClause {
    to: string | null;
    value: string | number;
    data?: string;
}

interface VMOutput {
    data: string;
    vmError: string;
    gasUsed: number;
    reverted: boolean;
    revertReason?: string;
    events: VMEvent[];
    transfers: VMTransfer[];
}

interface VMEvent {
    address: string;
    topics: string[];
    data: string;
}

interface VMTransfer {
    sender: string;
    recipient: string;
    amount: string;
}

export type { VMExplainer, VMClause, VMOutput, VMEvent, VMTransfer };

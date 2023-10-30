import { type FilterCriteria, type ThorFilter } from './filter';
import { type Transaction } from './transaction';
import { type VendorTxSigningService } from './vendor';
import { type VMOutput } from './vm';

/**
 * Represents an account's attributes including balance, energy, and code presence.
 */
interface Account {
    balance: string; // The balance in VET represented as a hex string.
    energy: string; // The energy in VTHO represented as a hex string.
    hasCode: boolean; // Indicates whether the account has associated code.
}

/**
 * Represents an account visitor interface for querying account-related information.
 */
interface AccountVisitor {
    address: string; // The account address to be visited.

    /**
     * Queries the account's basic attributes.
     * @returns A promise that resolves to an Account object.
     */
    get: () => Promise<Account>;

    /**
     * Queries the account's code.
     * @returns A promise that resolves to a Code object.
     */
    getCode: () => Promise<Code>;

    /**
     * Queries the account's storage entry for a specific key.
     * @param key - The storage key.
     * @returns A promise that resolves to a Storage object representing the storage entry.
     */
    getStorage: (key: string) => Promise<Storage>;

    /**
     * Creates a method object for performing contract calls or building VM clauses.
     * @param abi - The method's JSON ABI object.
     * @returns An AccountMethod object.
     */
    method: (abi: object) => AccountMethod;

    /**
     * Creates an object to visit events associated with this account.
     * @param abi - The event's JSON ABI object.
     * @returns An AccountEvent object.
     */
    event: (abi: object) => AccountEvent;
}

/**
 * Represents an account method interface for configuring contract method calls.
 */
interface AccountMethod {
    /**
     * Set the value (VET amount) to transfer in unit WEI.
     * @param val - The value presented as a hex/decimal string or number type.
     * @returns The updated AccountMethod object.
     */
    value: (val: string | number) => this;

    /**
     * Set the method caller (msg.sender).
     * @param addr - The caller's address.
     * @returns The updated AccountMethod object.
     */
    caller: (addr: string) => this;

    /**
     * Set the maximum allowed gas for the method.
     * @param gas - The maximum gas allowed.
     * @returns The updated AccountMethod object.
     */
    gas: (gas: number) => this;

    /**
     * Set the gas price presented as a hex/decimal string or number type.
     * @param gp - The gas price.
     * @returns The updated AccountMethod object.
     */
    gasPrice: (gp: string | number) => this;

    /**
     * Set the gas payer's address.
     * @param addr - The gas payer's address.
     * @returns The updated AccountMethod object.
     */
    gasPayer: (addr: string) => this;

    /**
     * Enable call result caching with specified cache invalidation hints.
     * @param hints - A set of addresses as cache invalidation conditions.
     * @returns The updated AccountMethod object.
     */
    cache: (hints: string[]) => this;

    /**
     * Encode arguments into a VM clause for the method.
     * @param args - The arguments to be encoded.
     * @returns A VM clause representing the encoded arguments.
     */
    asClause: (...args: unknown[]) => Transaction['clauses'][0];

    /**
     * Call the method (dry-run) without altering the blockchain.
     * @param args - The arguments to be passed to the method.
     * @returns A promise that resolves to the VM output and decoded result.
     */
    call: (...args: unknown[]) => Promise<VMOutput & WithDecoded>;

    /**
     * Initiate a signing service to commit the method call as a transaction.
     * @param args - The arguments to be passed to the method.
     * @returns A VendorTxSigningService for transaction commitment.
     */
    transact: (...args: unknown[]) => VendorTxSigningService;
}

/**
 * Represents an interface for visiting events associated with an account.
 */
interface AccountEvent {
    /**
     * Encode indexed event arguments into FilterCriteria.
     * @param indexed - Indexed event arguments.
     * @returns FilterCriteria for event filtering.
     */
    asCriteria: (indexed: object) => FilterCriteria<'event'>;

    /**
     * Create a filter with a set of Criteria encoded by a set of indexed event arguments.
     * @param indexedSet - An array of indexed event argument objects.
     * @returns A ThorFilter for filtering events.
     */
    filter: (indexedSet: object[]) => ThorFilter<'event', WithDecoded>;
}

/**
 * Represents a storage entry.
 */
interface Storage {
    value: string; // The value of the storage entry.
}

/**
 * Represents a code entry.
 */
interface Code {
    code: string; // The code associated with the account.
}

/**
 * Represents an object with decoded information.
 */
interface WithDecoded {
    decoded: Record<string | number, unknown>; // Decoded information associated with the object.
}

export type { Account, AccountVisitor, AccountMethod, AccountEvent };

import { type Address, type Hex } from '@common/vcdm';

/**
 * Criteria for filtering event logs.
 */
interface EventCriteria {
    /**
     * The address of the contract that emits the event.
     */
    readonly address?: Address;

    /**
     * The keccak256 hash representing the event signature.
     */
    readonly topic0?: Hex;

    /**
     * Filters events based on the 1st parameter in the event.
     */
    readonly topic1?: Hex;

    /**
     * Filters events based on the 2nd parameter in the event.
     */
    readonly topic2?: Hex;

    /**
     * Filters events based on the 3rd parameter in the event.
     */
    readonly topic3?: Hex;

    /**
     * Filters events based on the 4th parameter in the event.
     */
    readonly topic4?: Hex;
}

export type { EventCriteria };

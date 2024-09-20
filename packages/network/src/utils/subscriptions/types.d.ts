import { type AbiEvent } from 'viem';
/* --------- Event types start --------- */

/**
 * An Event Parameter ABI object.
 */
interface EventParameter {
    /**
     * Whether the parameter is an indexed parameter.
     */
    indexed: boolean;
    /**
     * The name of the parameter.
     */
    name: string;
    /**
     * The type of the parameter.
     */
    type: string;
    /**
     * The internal type of the parameter.
     */
    internalType?: string;
}

/**
 * An Event ABI object.
 */
interface EventAbi {
    /**
     * Whether the event was declared as anonymous.
     */
    anonymous: boolean;
    /**
     * The inputs of the event.
     */
    inputs: EventParameter[];
    /**
     * The name of the event.
     */
    name: string;
    /**
     * The type of the event. For an event, this is always 'event'.
     */
    type: string;
}

/**
 * An event represented as a string, an EventAbi object or an abitype AbiEvent.
 * If a string is provided, it must adhere to abitype's AbiEvent.
 *
 * @see [AbiEvent](https://abitype.dev/api/types#abievent)
 */
type EventLike = string | AbiEvent | EventAbi;

/* --------- Event types end --------- */

/* --- Input options start --- */

/**
 * Options for event subscription.
 */
interface EventSubscriptionOptions {
    /**
     * The block id from which to start the subscription.
     *
     * @note the Block ID must refer to a block that does not exceed the backtrace limit of the node. (Default: 1000)
     * @see [Backtrace limit](https://docs.vechain.org/start-building/tutorials/how-to-run-a-thor-solo-node#command-line-options)
     */
    blockID?: string;

    /**
     * The address of the contract that emitted the event to subscribe to.
     */
    address?: string;
}

interface BlockSubscriptionOptions {
    /**
     * The block id from which to start the subscription.
     *
     * @note the Block ID must refer to a block that does not exceed the backtrace limit of the node. (Default: 1000)
     * @see [Backtrace limit](https://docs.vechain.org/start-building/tutorials/how-to-run-a-thor-solo-node#command-line-options)
     */
    blockID?: string;
}

interface VETtransfersSubscriptionOptions {
    /**
     * The block id from which to start the subscription.
     *
     * @note the Block ID must refer to a block that does not exceed the backtrace limit of the node. (Default: 1000)
     * @see [Backtrace limit](https://docs.vechain.org/start-building/tutorials/how-to-run-a-thor-solo-node#command-line-options)
     */
    blockID?: string;

    /**
     * The address of the contract that emitted the event to subscribe to.
     */
    signerAddress?: string;

    /**
     * The address of the sender of the VET transfer to subscribe to.
     */
    sender?: string;

    /**
     * The address of the recipient of the VET transfer to subscribe to.
     */
    recipient?: string;
}

/* --- Input options end --- */

export type {
    BlockSubscriptionOptions,
    EventLike,
    EventSubscriptionOptions,
    VETtransfersSubscriptionOptions
};

import { type vechain_sdk_core_ethers } from '@vechain/sdk-core';
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
 * An Ethers Event Fragment object.
 *
 * @see [Ethers Event Fragment](https://docs.ethers.org/v6/api/abi/abi-coder/#EventFragment)
 */
type EventFragment = vechain_sdk_core_ethers.EventFragment;

/**
 * An event represented as a string, an EventAbi object or an ethers EventFragment object.
 * If a string is provided, it must adhere to ether's Format Types.
 *
 * @see [Ethers Format Types](https://docs.ethers.org/v5/api/utils/abi/interface/#Interface--formatting)
 * @see [Ethers Event Fragment](https://docs.ethers.org/v6/api/abi/abi-coder/#EventFragment)
 */
type EventLike = string | EventAbi | EventFragment;

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
    EventSubscriptionOptions,
    EventLike,
    BlockSubscriptionOptions,
    VETtransfersSubscriptionOptions,
    EventFragment
};

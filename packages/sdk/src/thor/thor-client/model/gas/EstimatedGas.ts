import { type Transfer } from "@thor/model/Transfer";
import { type Event } from "@thor/model/Event";
import { type Hex } from "@vcdm";

interface EstimatedGas {
    /**
     * The data of the response.
     */
    readonly data: Hex;

    /**
     * The events of the response.
     */
    readonly events: Event[];

    /**
     * The transfers of the response.
     */
    readonly transfers: Transfer[];

    /**
     * The gas used of the response.
     */
    readonly gasUsed: bigint;

    /**
     * The reverted of the response.
     */
    readonly reverted: boolean;

    /**
     * The VM error of the response.
     */
    readonly vmError: string;
}

export type { EstimatedGas };
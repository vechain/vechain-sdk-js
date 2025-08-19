/* --- Responses Outputs start --- */

/**
 * Type for connected peer.
 * A connected peer is a node that is connected to the node you have specified for the thorest client.
 */
interface ConnectedPeer {
    /**
     * Name of the peer in the format of `[network]/[version]-[gitcommit]-[versionmeta]/[os]/[goversion]`.
     * e.g., `thor/v2.1.0-2b5853f-release/linux/go1.21.0`
     */
    name: string;
    /**
     * Represents the block ID of the best block of the peer.
     */
    bestBlockID: string;
    /**
     * Represents the Accumulated Witness Number (AWN) of the best block of the peer.
     */
    totalScore: number;
    /**
     * ID of the peer.
     */
    peerID: string;
    /**
     * IP address of the peer.
     */
    netAddr: string;
    /**
     * indicates whether the connection to a peer is inbound or outbound.
     * If `inbound` is true,  the peer has initiated the connection to your node. In other words, the connection request came from the peer to your VeChainThor node.
     * If `inbound` is false, your node has initiated the connection to the peer. In other words, the connection request came from your VeChainThor node to the peer.
     */
    inbound: boolean;
    /**
     * Duration of the connection with the peer.
     */
    duration: number;
}

/* --- Responses Outputs end --- */

export { type ConnectedPeer };

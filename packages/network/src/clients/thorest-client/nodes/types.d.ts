/* --- Responses Outputs start --- */

interface ConnectedPeer {
    name: string;
    bestBlockID: string;
    totalScore: number;
    peerID: string;
    netAddr: string;
    inbound: boolean;
    duration: number;
}

/* --- Responses Outputs end --- */

export { type ConnectedPeer };

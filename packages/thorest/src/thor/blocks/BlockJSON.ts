/**
 * [Block](http://localhost:8669/doc/stoplight-ui/#/schemas/Block)
 */
interface BlockJSON {
    number: number; // int
    id: string; // hex
    size: number; // int
    parentID: string; // hex
    timestamp: number; // int unix epoch
    gasLimit: number; // int
    beneficiary: string; // hex address
    gasUsed: number; // int
    baseFeePerGas: string; // hex
    totalScore: number; // int
    txsRoot: string; // hex hash
    txsFeatures: number; // int
    stateRoot: string; // hex hash
    receiptsRoot: string; // hex hash;
    com: boolean;
    signer: string; // hex address
}

export { type BlockJSON };

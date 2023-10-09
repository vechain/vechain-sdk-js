/**
 * BIP32 hierarchical deterministic node
 */
export interface IHDNode {
    readonly publicKey: Buffer;
    // NOTE: Buffer | null is correct, because if we instantiate an HDNode from a public key, we don't have the private key!
    readonly privateKey: Buffer | null;
    readonly chainCode: Buffer;
    readonly address: string;
    derive: (index: number) => IHDNode;
    derivePath: (path: string) => IHDNode;
}

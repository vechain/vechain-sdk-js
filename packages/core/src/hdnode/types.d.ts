/**
 * Represents a BIP32 hierarchical deterministic (HD) node.
 *
 * BIP32 HD nodes allow for the derivation of child nodes from a master node,
 * enabling the generation of a tree structure of key pairs from a single seed.
 */
interface IHDNode {
    /**
     * The public key associated with the HD node.
     */
    readonly publicKey: Buffer;

    /**
     * The private key associated with the HD node.
     *
     * Note: This can be `null` if the HD node is instantiated from only a public key.
     */
    readonly privateKey: Buffer | null;

    /**
     * The chain code associated with the HD node.
     *
     * The chain code is used in combination with the private key or public key to derive child keys.
     */
    readonly chainCode: Buffer;

    /**
     * The address associated with the HD node's public key.
     */
    readonly address: string;

    /**
     * Derives a child node from the current node using the given index.
     *
     * @param index - The child index to derive.
     * @returns The derived child HD node.
     */
    derive: (index: number) => IHDNode;

    /**
     * Derives a series of child nodes from the current node based on a path string.
     *
     * @param path - The derivation path string (e.g., "m/0'/0'/0'").
     * @returns The derived child HD node at the end of the path.
     */
    derivePath: (path: string) => IHDNode;
}

export type { IHDNode };

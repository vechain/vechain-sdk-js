// @NOTE: Errors handling (https://eips.ethereum.org/EIPS/eip-1193#errors) will be delegated to `errors` package

/**
 * Interface for EIP-1193 provider request arguments.
 *
 * @see https://eips.ethereum.org/EIPS/eip-1193#request
 */
interface EIP1193RequestArguments {
    readonly method: string;
    readonly params?: unknown[];
}

/**
 * Standardized provider interface for EIP-1193.
 *
 * @see https://eips.ethereum.org/EIPS/eip-1193#message
 *
 * The Final usage will be:
 *
 * ```typescript
 * EIP1193ProviderMessage.request(args: EIP1193RequestArguments): Promise<unknown>;
 * ```
 */
interface EIP1193ProviderMessage {
    request: (args: EIP1193RequestArguments) => Promise<unknown>;
}

export { type EIP1193RequestArguments, type EIP1193ProviderMessage };

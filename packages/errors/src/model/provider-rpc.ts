/**
 * The `ProviderRpcError` error is thrown when the provider returns an error
 *
 * @link [ProviderRpcError](https://eips.ethereum.org/EIPS/eip-1193#provider-errors)
 */
class ProviderRpcError extends Error {
    /**
     * The error code as specified in EIP-1193 or EIP-1474
     *
     * @link [EIP-1474](https://eips.ethereum.org/EIPS/eip-1474#error-codes)
     * @link [EIP-1193](https://eips.ethereum.org/EIPS/eip-1193#provider-errors)
     */
    code: number;

    /**
     * Contains optional extra information about the error
     */
    data?: unknown;

    /**
     *
     * @param code - The error code as specified in EIP-1193 or EIP-1474
     * @param message - The error message
     * @param data - Contains optional extra information about the error
     */
    constructor(code: number, message?: string, data?: unknown) {
        super(message);
        this.code = code;
        this.data = data;
    }
}

export { ProviderRpcError };

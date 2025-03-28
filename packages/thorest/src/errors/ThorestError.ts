import { VeChainSDKError } from '@vechain/sdk-core';

class ThorestError extends VeChainSDKError {
    /**
     * The [HTTP Status Code](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status)
     * returned by the Thor REST end-point in case of error.
     *
     * @remarks
     * The `status` value is zero if the error is not originated by any response from the Thor REST end-point,
     */
    readonly status: number;

    constructor(
        fqn: string,
        message: string,
        args?: Record<string, unknown>,
        cause?: Error,
        status: number = 0
    ) {
        super(fqn, message, args, cause);
        this.status = status;
    }
}

export { ThorestError };

import { VechainSDKError } from '../sdk-error';
import { type ObjectErrorData } from '../types';

/**
 * Function not implemented error.
 *
 * WHEN TO USE:
 * * This error will be thrown when a function is not implemented.
 */
class FunctionNotImplemented extends VechainSDKError<
    {
        functionName: string;
    } & ObjectErrorData
> {}

export { FunctionNotImplemented };

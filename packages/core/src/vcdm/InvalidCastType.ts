import { VechainSDKError } from '@vechain/sdk-errors';

class InvalidCastType<T> extends VechainSDKError<T> {}

export { InvalidCastType };

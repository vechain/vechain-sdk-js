import { VechainSDKError } from '../sdk-error';

class InvalidCastType<T> extends VechainSDKError<T> {}

export { InvalidCastType };

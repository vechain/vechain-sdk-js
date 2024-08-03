import { VechainSDKError } from '../sdk-error';

class InvalidOperation<T> extends VechainSDKError<T> {}

export { InvalidOperation };

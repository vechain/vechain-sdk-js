import { VeChainSDKError } from './VeChainSDKError';

class IllegalArgumentError extends VeChainSDKError {}

export { IllegalArgumentError };

const err = new IllegalArgumentError(
    'packages/core/src/errors/IllegalArgumentError.ts!28',
    'illegal argument error',
    { data: 'invalid' },
    new VeChainSDKError(
        'packages/core/src/errors/VeChainSDKError.ts!101',
        'invalid data type',
        { type: 'string' }
    )
);
console.log(err.toString());

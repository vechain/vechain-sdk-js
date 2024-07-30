import { VechainSDKError } from '../sdk-error';

/**
 * Poll execution error.
 *
 * WHEN TO USE:
 * * Error will be thrown when a poll execution of a function throw error
 */
class PollExecution extends VechainSDKError<{ functionName: string }> {}

export { PollExecution };

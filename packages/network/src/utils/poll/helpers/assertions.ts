import { assert, DATA } from '@vechain/sdk-errors';

/**
 * Assert if poll options are valid (options are basically positive integers)
 *
 * @param methodName - The method name where the error was thrown.
 * @param field - Field to assert
 * @param fieldName - Name of the field to assert
 */
function assertPositiveIntegerForPollOptions(
    methodName: string,
    field: number | undefined,
    fieldName: string
): void {
    assert(
        `assertPositiveIntegerForPollOptions - ${methodName}`,
        field === undefined || (field > 0 && Number.isInteger(field)),
        DATA.INVALID_DATA_TYPE,
        `Invalid input for field name. ${fieldName} must be a positive number`,
        { field }
    );
}

export { assertPositiveIntegerForPollOptions };

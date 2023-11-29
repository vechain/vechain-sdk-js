import { assert, DATA } from '@vechainfoundation/vechain-sdk-errors';

/**
 * Assert if poll options are valid (options are basically positive integers)
 *
 * @param field - Field to assert
 * @param fieldName - Name of the field to assert
 */
function assertPositiveIntegerForPollOptions(
    field: number | undefined,
    fieldName: string
): void {
    assert(
        field === undefined || (field > 0 && Number.isInteger(field)),
        DATA.INVALID_DATA_TYPE,
        `${fieldName} must be a positive number`,
        { field }
    );
}

export { assertPositiveIntegerForPollOptions };

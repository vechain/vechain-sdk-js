import { type Fragment } from 'ethers';

/**
 * Sanitizes the values to encode due to the fact that ethers does not handle indexed values ordering.
 * This method allows to specify only the values for the indexed parameters and returns an array with the
 * correct order.
 *
 * 'null' values are used to fill the non-indexed parameters.
 *
 * @param valuesToEncode - Values to encode for the indexed parameters.
 * @param event - Event fragment.
 *
 * @returns Sanitized values to encode.
 */
const sanitizeValuesToEncode = (
    valuesToEncode: unknown[],
    event: Fragment
): unknown[] => {
    // If there are no values to encode, return an empty array
    if (valuesToEncode.length === 0) return [];

    // If there are more values to encode than indexed parameters, return the values as they are
    if (valuesToEncode.length > event.inputs.length) return valuesToEncode;

    const sanitizedValuesToEncode = [];

    const eventInputs = event.inputs;

    for (const input of eventInputs) {
        // push the value if it is indexed and not undefined
        if (
            input.indexed === true &&
            valuesToEncode.length > 0 &&
            valuesToEncode[0] !== undefined
        ) {
            sanitizedValuesToEncode.push(valuesToEncode.shift());
        } else {
            // shift the value if it is not indexed and undefined
            if (valuesToEncode.length > 0 && valuesToEncode[0] === undefined) {
                valuesToEncode.shift();
            }
            // push a null value if the value is not indexed and undefined
            sanitizedValuesToEncode.push(null);
        }
    }

    return sanitizedValuesToEncode;
};

export { sanitizeValuesToEncode };

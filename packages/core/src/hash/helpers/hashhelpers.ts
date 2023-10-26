/**
 * Checks if the return type is valid
 *
 * Helper method needed to validate the return type of the hash function
 *
 * @param value - The return type
 * @returns A boolean indicating whether the return type is valid
 */
const isValidReturnType = (value: string): boolean => {
    return !(value !== 'buffer' && value !== 'hex');
};

export { isValidReturnType };

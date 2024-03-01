/**
 * Function to build error message
 */
function buildErrorMessage(
    methodName: string,
    errorMessage: string,
    inputData: object,
    innerError?: Error
): string {
    return (
        `Method '${methodName}' failed.` +
        `\n-Reason: '${errorMessage}'` +
        `\n-Parameters: \n\t${JSON.stringify(inputData)}` +
        `\n-Internal error: \n\t${innerError?.message !== undefined ? innerError.message : 'No internal error given'}`
    );
}

export { buildErrorMessage };

/**
 * Adapts contract ABI to the format expected by ABIContract.ofAbi
 * This transforms the ABI format from the standard JSON format to the Viem format
 */
export function adaptContractAbi(abi: any[]): any[] {
    return abi.map((item) => {
        // Handle function type entries
        if (
            item.stateMutability ||
            (item.inputs && !item.anonymous && item.outputs)
        ) {
            return {
                ...item,
                type: 'function'
            };
        }

        // Handle error type entries
        if (item.inputs && item.type === 'error') {
            return item; // Already has correct type
        }

        // Handle event type entries
        if (item.inputs && item.anonymous !== undefined) {
            return {
                ...item,
                type: 'event'
            };
        }

        return item;
    });
}

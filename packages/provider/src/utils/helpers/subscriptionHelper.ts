const generateRandomHex = (size: number): string => {
    return [Array(size)]
        .map(() => Math.floor(Math.random() * 16).toString(16))
        .join('');
};

export const subscriptionHelper = {
    generateRandomHex
};

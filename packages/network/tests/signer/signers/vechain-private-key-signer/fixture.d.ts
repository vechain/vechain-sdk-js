import { InvalidDataType, NotDelegatedTransaction } from '@vechain/sdk-errors';
/**
 * SignTransaction test cases
 * Has both correct and incorrect for solo and an example of using gasPayerServiceUrl on testnet
 */
declare const signTransactionTestCases: {
    solo: {
        /**
         * Correct test cases
         */
        correct: ({
            description: string;
            origin: import("@vechain/sdk-solo-setup").ThorSoloAccount;
            params: {
                gasPriceCoef: number;
                maxPriorityFeePerGas?: undefined;
                maxFeePerGas?: undefined;
            };
            isDelegated: boolean;
            expected: {
                body: {
                    chainTag: any;
                    clauses: {
                        data: string;
                        to: string;
                        value: number;
                    }[];
                    dependsOn: null;
                    expiration: number;
                    gas: number;
                    gasPriceCoef: number;
                    reserved?: undefined;
                };
            };
            options?: undefined;
        } | {
            description: string;
            origin: import("@vechain/sdk-solo-setup").ThorSoloAccount;
            params: {
                maxPriorityFeePerGas: string;
                maxFeePerGas: string;
                gasPriceCoef?: undefined;
            };
            isDelegated: boolean;
            expected: {
                body: {
                    chainTag: any;
                    clauses: {
                        data: string;
                        to: string;
                        value: number;
                    }[];
                    dependsOn: null;
                    expiration: number;
                    gas: number;
                    gasPriceCoef?: undefined;
                    reserved?: undefined;
                };
            };
            options?: undefined;
        } | {
            description: string;
            origin: import("@vechain/sdk-solo-setup").ThorSoloAccount;
            params: {
                gasPriceCoef: number;
                maxPriorityFeePerGas?: undefined;
                maxFeePerGas?: undefined;
            };
            options: {
                gasPayerPrivateKey: string;
            };
            isDelegated: boolean;
            expected: {
                body: {
                    chainTag: any;
                    clauses: {
                        data: string;
                        to: string;
                        value: number;
                    }[];
                    dependsOn: null;
                    expiration: number;
                    gas: number;
                    gasPriceCoef: number;
                    reserved: {
                        features: number;
                    };
                };
            };
        } | {
            description: string;
            origin: import("@vechain/sdk-solo-setup").ThorSoloAccount;
            params: {
                maxPriorityFeePerGas: string;
                maxFeePerGas: string;
                gasPriceCoef?: undefined;
            };
            options: {
                gasPayerPrivateKey: string;
            };
            isDelegated: boolean;
            expected: {
                body: {
                    chainTag: any;
                    clauses: {
                        data: string;
                        to: string;
                        value: number;
                    }[];
                    dependsOn: null;
                    expiration: number;
                    gas: number;
                    reserved: {
                        features: number;
                    };
                    gasPriceCoef?: undefined;
                };
            };
        })[];
        /**
         * Incorrect test cases
         */
        incorrect: ({
            description: string;
            origin: import("@vechain/sdk-solo-setup").ThorSoloAccount;
            options: {
                gasPayerPrivateKey: string;
                gasPayerServiceUrl?: undefined;
            };
            isDelegated: boolean;
            expectedError: typeof InvalidDataType;
            params?: undefined;
        } | {
            description: string;
            origin: import("@vechain/sdk-solo-setup").ThorSoloAccount;
            params: {
                maxPriorityFeePerGas: string;
                maxFeePerGas: string;
            };
            options: {
                gasPayerPrivateKey: string;
                gasPayerServiceUrl?: undefined;
            };
            isDelegated: boolean;
            expectedError: typeof InvalidDataType;
        } | {
            description: string;
            origin: import("@vechain/sdk-solo-setup").ThorSoloAccount;
            options: {
                gasPayerServiceUrl: string;
                gasPayerPrivateKey?: undefined;
            };
            isDelegated: boolean;
            expectedError: typeof NotDelegatedTransaction;
            params?: undefined;
        } | {
            description: string;
            origin: import("@vechain/sdk-solo-setup").ThorSoloAccount;
            params: {
                maxPriorityFeePerGas: string;
                maxFeePerGas: string;
            };
            options: {
                gasPayerServiceUrl: string;
                gasPayerPrivateKey?: undefined;
            };
            isDelegated: boolean;
            expectedError: typeof NotDelegatedTransaction;
        })[];
    };
    testnet: {
        correct: ({
            description: string;
            origin: import("@vechain/sdk-solo-setup").ThorSoloAccount;
            params: {
                gasPriceCoef: number;
                maxPriorityFeePerGas?: undefined;
                maxFeePerGas?: undefined;
            };
            options: {
                gasPayerServiceUrl: string;
            };
            isDelegated: boolean;
            expected: {
                body: {
                    chainTag: number;
                    clauses: {
                        data: string;
                        to: string;
                        value: number;
                    }[];
                    dependsOn: null;
                    expiration: number;
                    gas: number;
                    gasPriceCoef: number;
                    reserved: {
                        features: number;
                    };
                };
            };
        } | {
            description: string;
            origin: import("@vechain/sdk-solo-setup").ThorSoloAccount;
            params: {
                maxPriorityFeePerGas: string;
                maxFeePerGas: string;
                gasPriceCoef?: undefined;
            };
            options: {
                gasPayerServiceUrl: string;
            };
            isDelegated: boolean;
            expected: {
                body: {
                    chainTag: number;
                    clauses: {
                        data: string;
                        to: string;
                        value: number;
                    }[];
                    dependsOn: null;
                    expiration: number;
                    gas: number;
                    reserved: {
                        features: number;
                    };
                    gasPriceCoef?: undefined;
                };
            };
        })[];
        incorrect: ({
            description: string;
            origin: import("@vechain/sdk-solo-setup").ThorSoloAccount;
            options: undefined;
            isDelegated: boolean;
            expected: {
                body: {
                    chainTag: number;
                    clauses: {
                        data: string;
                        to: string;
                        value: number;
                    }[];
                    dependsOn: null;
                    expiration: number;
                    gas: number;
                    gasPriceCoef: number;
                    reserved: {
                        features: number;
                    };
                };
            };
            expectedError: typeof NotDelegatedTransaction;
            params?: undefined;
        } | {
            description: string;
            origin: import("@vechain/sdk-solo-setup").ThorSoloAccount;
            params: {
                maxPriorityFeePerGas: string;
                maxFeePerGas: string;
            };
            options: undefined;
            isDelegated: boolean;
            expected: {
                body: {
                    chainTag: number;
                    clauses: {
                        data: string;
                        to: string;
                        value: number;
                    }[];
                    dependsOn: null;
                    expiration: number;
                    gas: number;
                    reserved: {
                        features: number;
                    };
                    gasPriceCoef?: undefined;
                };
            };
            expectedError: typeof NotDelegatedTransaction;
        })[];
    };
};
export { signTransactionTestCases };
//# sourceMappingURL=fixture.d.ts.map
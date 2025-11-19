import { ThorClient } from '@vechain/sdk-network';
declare const timeout = 8000;
/**
 * `TestingContract.sol` deployed contract address on thor-solo snapshot.
 */
declare const SOLO_CONTRACT_ADDRESS: string;
declare const TESTNET_CONTRACT_ADDRESS: string;
declare const TESTING_CONTRACT_ABI: any[];
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
                    reserved?: undefined;
                };
            };
        } | {
            description: string;
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
                };
            };
        })[];
    };
    testnet: {
        correct: {
            description: string;
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
                };
            };
        }[];
    };
};
declare const fundVTHO: (thorClient: ThorClient, receiverAddress: string) => Promise<void>;
/**
 * Delegate url fixture to test signing transactions with delegation by URL
 */
declare const TESTNET_DELEGATE_URL = "https://sponsor-testnet.vechain.energy/by/883";
export { fundVTHO, signTransactionTestCases, TESTING_CONTRACT_ABI, SOLO_CONTRACT_ADDRESS, TESTNET_CONTRACT_ADDRESS, TESTNET_DELEGATE_URL, timeout };
//# sourceMappingURL=fixture.d.ts.map
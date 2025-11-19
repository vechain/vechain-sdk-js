import { InvalidDataType } from '@vechain/sdk-errors';
/**
 * Transaction details function fixture.
 */
declare const transactionDetails: {
    correct: ({
        testName: string;
        transaction: {
            id: string;
            raw: boolean;
            pending: boolean;
        };
        expected: {
            id: string;
            chainTag: number;
            type: number;
            blockRef: string;
            expiration: number;
            clauses: {
                to: string;
                value: string;
                data: string;
            }[];
            gasPriceCoef: number;
            gas: number;
            origin: string;
            delegator: null;
            nonce: string;
            dependsOn: null;
            size: number;
            meta: {
                blockID: string;
                blockNumber: number;
                blockTimestamp: number;
            };
            raw?: undefined;
        };
    } | {
        testName: string;
        transaction: {
            id: string;
            raw: boolean;
            pending: boolean;
        };
        expected: {
            raw: string;
            meta: {
                blockID: string;
                blockNumber: number;
                blockTimestamp: number;
            };
            id?: undefined;
            chainTag?: undefined;
            type?: undefined;
            blockRef?: undefined;
            expiration?: undefined;
            clauses?: undefined;
            gasPriceCoef?: undefined;
            gas?: undefined;
            origin?: undefined;
            delegator?: undefined;
            nonce?: undefined;
            dependsOn?: undefined;
            size?: undefined;
        };
    })[];
    errors: ({
        testName: string;
        transaction: {
            id: string;
            raw?: undefined;
            pending?: undefined;
            head?: undefined;
        };
        expected: typeof InvalidDataType;
    } | {
        testName: string;
        transaction: {
            id: string;
            raw: boolean;
            pending: boolean;
            head: string;
        };
        expected: typeof InvalidDataType;
    })[];
};
/**
 * Transaction receipts function fixture.
 */
declare const transactionReceipts: {
    correct: {
        testName: string;
        transaction: {
            id: string;
        };
        expected: {
            gasUsed: number;
            gasPayer: string;
            paid: string;
            reward: string;
            reverted: boolean;
            meta: {
                blockID: string;
                blockNumber: number;
                blockTimestamp: number;
                txID: string;
                txOrigin: string;
            };
            outputs: {
                contractAddress: null;
                events: never[];
                transfers: {
                    sender: string;
                    recipient: string;
                    amount: string;
                }[];
            }[];
        };
    }[];
    errors: ({
        testName: string;
        transaction: {
            id: string;
            head?: undefined;
        };
        expected: typeof InvalidDataType;
    } | {
        testName: string;
        transaction: {
            id: string;
            head: string;
        };
        expected: typeof InvalidDataType;
    })[];
};
/**
 * Send transaction function errors fixture.
 */
declare const sendTransactionErrors: {
    correct: {
        testName: string;
        transaction: {
            clauses: {
                to: string;
                value: number;
                data: string;
            }[];
        };
    }[];
    errors: {
        testName: string;
        transaction: {
            raw: string;
        };
        expected: typeof InvalidDataType;
    }[];
};
/**
 * Simulate transactions test cases
 */
declare const simulateTransaction: {
    correct: {
        transfer: {
            testName: string;
            transaction: {
                clauses: {
                    to: string;
                    value: string;
                    data: string;
                }[];
                simulateTransactionOptions: {
                    caller: string;
                    callerPrivateKey: string;
                };
            };
            expected: {
                simulationResults: ({
                    data: string;
                    events: never[];
                    /**
                     * VET TRANSFER
                     */
                    transfers: {
                        sender: string;
                        recipient: string;
                        amount: string;
                    }[];
                    gasUsed: number;
                    reverted: boolean;
                    vmError: string;
                } | {
                    data: string;
                    events: {
                        address: string;
                        topics: string[];
                        data: string;
                    }[];
                    transfers: never[];
                    gasUsed: number;
                    reverted: boolean;
                    vmError: string;
                })[];
            };
        }[];
        /**
         * Simulate calls to smart contracts (i.e., getters thus no gas is consumed)
         */
        smartContractCall: ({
            testName: string;
            transaction: {
                clauses: {
                    to: string;
                    value: string;
                    data: string;
                }[];
                simulateTransactionOptions?: undefined;
            };
            expected: {
                simulationResults: {
                    /**
                     * Base gas price set in the params.sol built-in contract.
                     *
                     * The value set for thor-solo is `1000000000000000` (0,001 VTHO)
                     *
                     * @link see [thor/params.go](https://github.com/vechain/thor/blob/master/thor/params.go)
                     */
                    data: string;
                    events: never[];
                    transfers: never[];
                    gasUsed: number;
                    reverted: boolean;
                    vmError: string;
                }[];
            };
        } | {
            testName: string;
            transaction: {
                clauses: {
                    to: string;
                    value: string;
                    /**
                     * Checks the VTHO balance of TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER
                     */
                    data: string;
                }[];
                simulateTransactionOptions: {
                    revision: string;
                };
            };
            expected: {
                simulationResults: {
                    /**
                     * At block 0 (genesis) the balance of VTHO of TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER should be 0.
                     * This because the seeding happens after the genesis block.
                     */
                    data: string;
                    events: never[];
                    transfers: never[];
                    gasUsed: number;
                    reverted: boolean;
                    vmError: string;
                }[];
            };
        })[];
        deployContract: {
            testName: string;
            transaction: {
                clauses: {
                    to: null;
                    value: string;
                    /**
                     * Sample contract bytecode (Without constructor arguments)
                     *
                     * @remarks - When deploying a contract that requires constructor arguments, the encoded constructor must be appended to the bytecode
                     *            Otherwise the contract might revert if the constructor arguments are required.
                     */
                    data: string;
                }[];
            };
            expected: {
                simulationResults: {
                    data: string;
                    events: {
                        address: string;
                        topics: string[];
                        data: string;
                    }[];
                    transfers: never[];
                    gasUsed: number;
                    reverted: boolean;
                    vmError: string;
                }[];
            };
        }[];
    };
    errors: ({
        testName: string;
        transaction: {
            clauses: {
                to: string;
                value: string;
                data: string;
            }[];
            simulateTransactionOptions: {
                caller: string;
                gas?: undefined;
            };
        };
        vmError: string;
    } | {
        testName: string;
        transaction: {
            clauses: {
                to: string;
                value: string;
                data: string;
            }[];
            simulateTransactionOptions: {
                caller: string;
                gas: number;
            };
        };
        vmError: string;
    })[];
};
export { sendTransactionErrors, simulateTransaction, transactionDetails, transactionReceipts };
//# sourceMappingURL=fixture-thorest.d.ts.map
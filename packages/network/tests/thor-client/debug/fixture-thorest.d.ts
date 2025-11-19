import { InvalidDataType } from '@vechain/sdk-errors';
import { type ThorClient, type TransactionReceipt } from '../../../src';
import { BlockId } from '@vechain/sdk-core';
import { type ThorSoloAccount } from '@vechain/sdk-solo-setup';
/**
 * Debug traceTransactionClause tests fixture testnet
 *
 * @NOTE we refers to block 0x010e80e3278e234b8a5d1195c376909456b94d1f7cf3cb7bfab1e8998dbcfa8f.
 * It has the following transactions:
 * * Index 0 - 0x2dbc8268a2dbf889abe828c0671cb9adce61f537aab8855480aff6967e0ed687 (1 clause, index 0)
 * * Index 1 - 0x05b31824569f2f2ec64c62c4e6396199f56ae872ff219288eb3293b4a36e7b0f (1 clause, index 0)
 */
declare const traceTransactionClauseTestnetFixture: {
    positiveCases: ({
        testName: string;
        blockID: BlockId;
        transaction: BlockId;
        clauseIndex: number;
        expected: {
            from: string;
            gas: string;
            gasUsed: string;
            to: string;
            input: string;
            value: string;
            type: string;
        };
    } | {
        testName: string;
        blockID: BlockId;
        transaction: number;
        clauseIndex: number;
        expected: {
            from: string;
            gas: string;
            gasUsed: string;
            to: string;
            input: string;
            value: string;
            type: string;
        };
    })[];
    negativeCases: ({
        testName: string;
        blockID: string;
        transaction: BlockId;
        clauseIndex: number;
        expectedError: typeof InvalidDataType;
    } | {
        testName: string;
        blockID: BlockId;
        transaction: string;
        clauseIndex: number;
        expectedError: typeof InvalidDataType;
    } | {
        testName: string;
        blockID: BlockId;
        transaction: number;
        clauseIndex: number;
        expectedError: typeof InvalidDataType;
    })[];
};
/**
 * VTHO contract testnet - 0x0000000000000000000000000000456E65726779
 */
declare const traceContractCallTestnetFixture: {
    positiveCases: {
        testName: string;
        to: string;
        value: string;
        data: string;
        caller: string;
        gasPayer: string;
        gas: number;
        expiration: number;
        blockRef: string;
        expected: {
            from: string;
            gas: string;
            gasUsed: string;
            to: string;
            input: string;
            output: string;
            calls: ({
                from: string;
                gas: string;
                gasUsed: string;
                to: string;
                input: string;
                output: string;
                value: string;
                type: string;
            } | {
                from: string;
                gas: string;
                gasUsed: string;
                to: string;
                input: string;
                value: string;
                type: string;
                output?: undefined;
            })[];
            value: string;
            type: string;
        };
    }[];
    negativeCases: ({
        testName: string;
        to: string;
        value: string;
        data: string;
        caller: string;
        expectedError: typeof InvalidDataType;
    } | {
        testName: string;
        to: null;
        value: string;
        data: string;
        caller: string;
        expectedError: typeof InvalidDataType;
    })[];
};
/**
 * Debug retrieveStorageRange Testnet Fixture
 *
 * @NOTE we refers again to:
 * * block 0x010e80e3278e234b8a5d1195c376909456b94d1f7cf3cb7bfab1e8998dbcfa8f
 * * VTHO contract testnet - 0x0000000000000000000000000000456E65726779
 */
declare const retrieveStorageRangeTestnetFixture: {
    positiveCases: ({
        testName: string;
        address: string;
        keyStart: BlockId;
        maxResult: number;
        blockID: BlockId;
        transaction: number;
        clauseIndex: number;
        expected: {
            storage: {
                '0x004f6609cc5d569ecfdbd606d943edc5d83a893186f2942aef5e133e356ed17c': {
                    key: string;
                    value: string;
                };
                '0x0065bf3c383c7f05733ee6567e3a1201970bb5f4288d1bdb6d894167f8fc68dd': {
                    key: string;
                    value: string;
                };
                '0x01783f86c9e29f37f3277ed5abb62353ef8baf304337e511f1b5edefc9756b23': {
                    key: string;
                    value: string;
                };
                '0x0195180093382541d5396e797bd49250b1664fe8db68ff5c1d53ca95046f4549': {
                    key: string;
                    value: string;
                };
                '0x02631b1c9d1e3f1360c4c6ee00ea48161dc85a0e153a0a484429bbcef16e581e': {
                    key: string;
                    value: string;
                };
                '0x038658243306b2d07b512b04e6ddd4d70c49fd93969d71d51b0af7cf779d1c8f': {
                    key: string;
                    value: string;
                };
                '0x03969104d4e5233e212c939a85ef26b8156e2fbb0485d6d751c677e854e9ba55': {
                    key: string;
                    value: string;
                };
                '0x04379cd040e82a999f53dba26500b68e4dd783b2039d723fe9e06edecfc8c9f1': {
                    key: string;
                    value: string;
                };
                '0x0465f4b6f9fccdb2ad6f4eac8aa7731bfe4c78f6cf22f397b5ef10398d4d5771': {
                    key: string;
                    value: string;
                };
                '0x04af8500fb85efaaa5f171ef60708fc306c474011fabb6fbafcb626f09661a01': {
                    key: string;
                    value: string;
                };
            };
            nextKey: string;
        };
    } | {
        testName: string;
        address: string;
        keyStart: string;
        maxResult: number;
        blockID: BlockId;
        transaction: number;
        clauseIndex: number;
        expected: {
            storage: {
                '0x004f6609cc5d569ecfdbd606d943edc5d83a893186f2942aef5e133e356ed17c': {
                    key: string;
                    value: string;
                };
                '0x0065bf3c383c7f05733ee6567e3a1201970bb5f4288d1bdb6d894167f8fc68dd': {
                    key: string;
                    value: string;
                };
                '0x01783f86c9e29f37f3277ed5abb62353ef8baf304337e511f1b5edefc9756b23': {
                    key: string;
                    value: string;
                };
                '0x0195180093382541d5396e797bd49250b1664fe8db68ff5c1d53ca95046f4549': {
                    key: string;
                    value: string;
                };
                '0x02631b1c9d1e3f1360c4c6ee00ea48161dc85a0e153a0a484429bbcef16e581e': {
                    key: string;
                    value: string;
                };
                '0x038658243306b2d07b512b04e6ddd4d70c49fd93969d71d51b0af7cf779d1c8f': {
                    key: string;
                    value: string;
                };
                '0x03969104d4e5233e212c939a85ef26b8156e2fbb0485d6d751c677e854e9ba55': {
                    key: string;
                    value: string;
                };
                '0x04379cd040e82a999f53dba26500b68e4dd783b2039d723fe9e06edecfc8c9f1': {
                    key: string;
                    value: string;
                };
                '0x0465f4b6f9fccdb2ad6f4eac8aa7731bfe4c78f6cf22f397b5ef10398d4d5771': {
                    key: string;
                    value: string;
                };
                '0x04af8500fb85efaaa5f171ef60708fc306c474011fabb6fbafcb626f09661a01': {
                    key: string;
                    value: string;
                };
            };
            nextKey: string;
        };
    })[];
    negativeCases: ({
        testName: string;
        address: string;
        keyStart: string;
        maxResult: number;
        blockID: string;
        transaction: number;
        clauseIndex: number;
        expectedError: typeof InvalidDataType;
    } | {
        testName: string;
        address: string;
        keyStart: string;
        maxResult: number;
        blockID: string;
        transaction: string;
        clauseIndex: number;
        expectedError: typeof InvalidDataType;
    })[];
};
/**
 * Send a transaction using a sender account index
 * @param senderIndex The index of the sender account
 * @param thorClient The ThorClient instance
 * @returns The transaction receipt
 */
declare const sendTransactionWithAccount: (account: ThorSoloAccount, thorClient: ThorClient) => Promise<TransactionReceipt | null>;
export { traceTransactionClauseTestnetFixture, traceContractCallTestnetFixture, retrieveStorageRangeTestnetFixture, sendTransactionWithAccount };
//# sourceMappingURL=fixture-thorest.d.ts.map
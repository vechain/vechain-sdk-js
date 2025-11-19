import { HexUInt, type TransactionBody, type TransactionClause, VTHO } from '../../src';
declare const LegacyTransactionFixture: {
    invalidReservedFieldNotTrimmed: {
        encodedUnsigned: Uint8Array<ArrayBufferLike>;
    };
    undelegated: {
        body: TransactionBody;
        transactionHash: HexUInt;
        signedTransactionId: HexUInt;
        encodedUnsigned: Uint8Array<ArrayBufferLike>;
        encodedSigned: Uint8Array<ArrayBufferLike>;
        intrinsicGas: VTHO;
    };
    delegated: {
        body: {
            reserved: {
                features: number;
            };
            chainTag: number;
            blockRef: string;
            expiration: number;
            clauses: TransactionClause[];
            gasPriceCoef?: number;
            gas: string | number;
            dependsOn: string | null;
            nonce: string | number;
            maxFeePerGas?: string | number;
            maxPriorityFeePerGas?: string | number;
        };
        transactionHash: HexUInt;
        encodedUnsigned: Uint8Array<ArrayBufferLike>;
        encodedSigned: Uint8Array<ArrayBufferLike>;
        signedTransactionId: HexUInt;
        intrinsicGas: VTHO;
    };
    delegatedWithUnusedFields: {
        body: {
            reserved: {
                features: number;
                unused: Uint8Array<ArrayBuffer>[];
            };
            chainTag: number;
            blockRef: string;
            expiration: number;
            clauses: TransactionClause[];
            gasPriceCoef?: number;
            gas: string | number;
            dependsOn: string | null;
            nonce: string | number;
            maxFeePerGas?: string | number;
            maxPriorityFeePerGas?: string | number;
        };
        transactionHash: HexUInt;
        encodedUnsigned: Uint8Array<ArrayBufferLike>;
        encodedSigned: Uint8Array<ArrayBufferLike>;
        signedTransactionId: HexUInt;
        intrinsicGas: VTHO;
    };
};
export { LegacyTransactionFixture as TransactionFixture };
//# sourceMappingURL=Transaction.unit.test.d.ts.map
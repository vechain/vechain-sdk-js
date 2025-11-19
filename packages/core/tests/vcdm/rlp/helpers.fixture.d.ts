declare const validateNumberTestCases: ({
    number: number;
    context: string;
    expected: bigint;
} | {
    number: string;
    context: string;
    expected: bigint;
})[];
declare const invalidNumberTestCases: ({
    number: {};
    context: string;
} | {
    number: number;
    context: string;
} | {
    number: string;
    context: string;
})[];
declare const validNumericBufferTestCases: ({
    buffer: Uint8Array<ArrayBuffer>;
    context: string;
    maxBytes: undefined;
} | {
    buffer: Uint8Array<ArrayBuffer>;
    context: string;
    maxBytes: number;
})[];
declare const invalidNumericBufferTestCases: ({
    buffer: Uint8Array<ArrayBuffer>;
    context: string;
    maxBytes: number;
} | {
    buffer: Uint8Array<ArrayBuffer>;
    context: string;
    maxBytes: undefined;
})[];
declare const validHexBlobKindDataTestCases: {
    data: string;
    context: string;
}[];
declare const invalidHexBlobKindDataTestCases: ({
    data: string;
    context: string;
    expected: string;
} | {
    data: number;
    context: string;
    expected: string;
})[];
declare const validHexBlobKindBufferTestCases: {
    buffer: Uint8Array<ArrayBuffer>;
    context: string;
}[];
declare const invalidHexBlobKindBufferTestCases: ({
    buffer: string;
    context: string;
} | {
    buffer: {};
    context: string;
})[];
declare const validFixedHexBlobKindDataTestCases: {
    data: string;
    context: string;
    bytes: number;
}[];
declare const invalidFixedHexBlobKindDataTestCases: {
    data: string;
    context: string;
    bytes: number;
}[];
declare const validFixedHexBlobKindBufferTestCases: {
    buffer: Uint8Array<ArrayBuffer>;
    context: string;
    bytes: number;
}[];
declare const invalidFixedHexBlobKindBufferTestCases: {
    buffer: Uint8Array<ArrayBuffer>;
    context: string;
    bytes: number;
}[];
declare const validCompactFixedHexBlobKindBufferTestCases: {
    buffer: Uint8Array<ArrayBuffer>;
    context: string;
    bytes: number;
}[];
declare const invalidCompactFixedHexBlobKindBufferTestCases: {
    buffer: Uint8Array<ArrayBuffer>;
    context: string;
    bytes: number;
}[];
export { validateNumberTestCases, invalidNumberTestCases, validNumericBufferTestCases, invalidNumericBufferTestCases, validHexBlobKindDataTestCases, invalidHexBlobKindDataTestCases, validHexBlobKindBufferTestCases, invalidHexBlobKindBufferTestCases, validFixedHexBlobKindDataTestCases, invalidFixedHexBlobKindDataTestCases, validFixedHexBlobKindBufferTestCases, invalidFixedHexBlobKindBufferTestCases, validCompactFixedHexBlobKindBufferTestCases, invalidCompactFixedHexBlobKindBufferTestCases };
//# sourceMappingURL=helpers.fixture.d.ts.map
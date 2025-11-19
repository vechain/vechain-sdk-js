import { BufferKind, CompactFixedHexBlobKind, FixedHexBlobKind, HexBlobKind, NumericKind, type RLPProfile, type RLPValidObject } from '../../../src/vcdm/encoding';
declare const encodeTestCases: ({
    input: (number | number[])[];
    expected: string;
    description: string;
} | {
    input: number;
    expected: string;
    description: string;
})[];
declare const decodeTestCases: ({
    input: string;
    expected: Uint8Array<ArrayBuffer>;
    description: string;
} | {
    input: string;
    expected: never[];
    description: string;
})[];
declare const numericKindEncodeTestCases: ({
    kind: NumericKind;
    data: string;
    expected: string;
    description: string;
} | {
    kind: NumericKind;
    data: number;
    expected: string;
    description: string;
})[];
declare const invalidNumericKindEncodeTestCases: ({
    kind: NumericKind;
    data: string;
    description: string;
} | {
    kind: NumericKind;
    data: {};
    description: string;
} | {
    kind: NumericKind;
    data: number;
    description: string;
})[];
declare const numericKindDecodeTestCases: ({
    kind: NumericKind;
    data: Uint8Array<ArrayBuffer>;
    description: string;
    expected: string;
} | {
    kind: NumericKind;
    data: Uint8Array<ArrayBufferLike>;
    description: string;
    expected: number;
})[];
declare const invalidBufferKindDecodeTestCases: {
    kind: BufferKind;
    data: number;
    description: string;
}[];
declare const invalidNumericKindDecodeTestCases: {
    kind: NumericKind;
    data: Uint8Array<ArrayBuffer>;
    description: string;
}[];
declare const hexBlobKindEncodeTestCases: {
    kind: HexBlobKind;
    data: string;
    expected: string;
    description: string;
}[];
declare const invalidHexBlobKindEncodeTestCases: ({
    kind: HexBlobKind;
    data: string;
    description: string;
} | {
    kind: HexBlobKind;
    data: {};
    description: string;
})[];
declare const fixedHexBlobKindEncodeTestCases: {
    kind: FixedHexBlobKind;
    data: string;
    expected: string;
    description: string;
}[];
declare const invalidFixedHexBlobEncodeTestCases: ({
    kind: FixedHexBlobKind;
    data: string;
    description: string;
} | {
    kind: FixedHexBlobKind;
    data: {};
    description: string;
})[];
declare const hexBlobKindDecodeTestCases: {
    kind: HexBlobKind;
    data: Uint8Array<ArrayBuffer>;
    description: string;
    expected: string;
}[];
declare const fixedHexBlobKindDecodeTestCases: {
    kind: FixedHexBlobKind;
    data: Uint8Array<ArrayBuffer>;
    description: string;
    expected: string;
}[];
declare const invalidFixedBlobKindDecodeTestCases: ({
    kind: FixedHexBlobKind;
    data: Uint8Array<ArrayBuffer>;
    description: string;
} | {
    kind: FixedHexBlobKind;
    data: string;
    description: string;
})[];
declare const compactFixedHexBlobKindEncodeTestCases: {
    kind: CompactFixedHexBlobKind;
    data: string;
    description: string;
    expected: string;
}[];
declare const compactFixedHexBlobKindDecodeTestCases: {
    kind: CompactFixedHexBlobKind;
    data: Uint8Array<ArrayBuffer>;
    description: string;
    expected: string;
}[];
declare const bufferProfile: RLPProfile, bufferData: RLPValidObject, invalidBufferData: RLPValidObject;
declare const numericProfile: RLPProfile, numericData: RLPValidObject;
declare const numericProfileWithMaxBytes: RLPProfile, numericDataWithMaxBytes: RLPValidObject, numericDataWithString: RLPValidObject, numericDataInvalidArray: RLPValidObject, numericDataWithByteOverflow: RLPValidObject;
declare const hexBlobProfile: RLPProfile, hexBlobData: RLPValidObject;
declare const fixedHexBlobProfile: RLPProfile, fixedHexBlobData: RLPValidObject;
declare const encodeNumericProfileTestCases: {
    profile: RLPProfile;
    data: RLPValidObject;
    expected: string;
    description: string;
}[];
declare const encodeBufferProfileTestCases: {
    profile: RLPProfile;
    data: RLPValidObject;
    expected: string;
    description: string;
}[];
declare const encodeHexBlobProfileTestCases: {
    profile: RLPProfile;
    data: RLPValidObject;
    expected: string;
    description: string;
}[];
declare const encodeFixedHexBlobProfileTestCases: {
    profile: RLPProfile;
    data: RLPValidObject;
    expected: string;
    description: string;
}[];
declare const encodeOptionalFixedHexBlobProfileTestCases: {
    profile: RLPProfile;
    data: RLPValidObject;
    expected: string;
    description: string;
}[];
declare const encodeCompactFixedHexBlobProfileTestCases: {
    profile: RLPProfile;
    data: RLPValidObject;
    expected: string;
    description: string;
}[];
declare const encodeMixedKindProfileTestCases: {
    profile: RLPProfile;
    data: RLPValidObject;
    expected: string;
    description: string;
}[];
declare const invalidEncodeObjectTestCases: {
    profile: RLPProfile;
    data: RLPValidObject;
    description: string;
}[];
declare const decodeBufferProfileTestCases: {
    profile: RLPProfile;
    data: Uint8Array<ArrayBufferLike>;
    expected: RLPValidObject;
    description: string;
}[];
declare const invalidDecodeObjectTestCases: {
    profile: RLPProfile;
    data: Uint8Array<ArrayBufferLike>;
    description: string;
}[];
declare const decodeNumericProfileTestCases: {
    profile: RLPProfile;
    data: Uint8Array<ArrayBufferLike>;
    expected: RLPValidObject;
    description: string;
}[];
declare const decodeHexBlobProfileTestCases: {
    profile: RLPProfile;
    data: Uint8Array<ArrayBufferLike>;
    expected: RLPValidObject;
    description: string;
}[];
declare const decodeCompactFixedHexBlobProfileTestCases: {
    profile: RLPProfile;
    data: Uint8Array<ArrayBufferLike>;
    expected: RLPValidObject;
    description: string;
}[];
declare const decodeMixedKindProfileTestCases: {
    profile: RLPProfile;
    data: Uint8Array<ArrayBufferLike>;
    expected: RLPValidObject;
    description: string;
}[];
export { bufferData, bufferProfile, compactFixedHexBlobKindDecodeTestCases, compactFixedHexBlobKindEncodeTestCases, decodeBufferProfileTestCases, decodeCompactFixedHexBlobProfileTestCases, decodeHexBlobProfileTestCases, decodeMixedKindProfileTestCases, decodeNumericProfileTestCases, decodeTestCases, encodeBufferProfileTestCases, encodeCompactFixedHexBlobProfileTestCases, encodeFixedHexBlobProfileTestCases, encodeHexBlobProfileTestCases, encodeMixedKindProfileTestCases, encodeNumericProfileTestCases, encodeOptionalFixedHexBlobProfileTestCases, encodeTestCases, fixedHexBlobData, fixedHexBlobKindDecodeTestCases, fixedHexBlobKindEncodeTestCases, fixedHexBlobProfile, hexBlobData, hexBlobKindDecodeTestCases, hexBlobKindEncodeTestCases, hexBlobProfile, invalidBufferData, invalidBufferKindDecodeTestCases, invalidDecodeObjectTestCases, invalidEncodeObjectTestCases, invalidFixedBlobKindDecodeTestCases, invalidFixedHexBlobEncodeTestCases, invalidHexBlobKindEncodeTestCases, invalidNumericKindDecodeTestCases, invalidNumericKindEncodeTestCases, numericData, numericDataInvalidArray, numericDataWithByteOverflow, numericDataWithMaxBytes, numericDataWithString, numericKindDecodeTestCases, numericKindEncodeTestCases, numericProfile, numericProfileWithMaxBytes };
//# sourceMappingURL=rlp.fixture.d.ts.map
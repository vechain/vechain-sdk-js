/**
 * Decode reserved field.
 *
 * It can be optional or not.
 * For this reason (as already done in _encodeReservedField in Transaction class)
 * we create an ad hoc method.
 *
 * @param reserved - Reserved field to decode
 * @returns Decoded reserved field
 * @throws {InvalidTransactionField}
 */
// function _decodeReservedField(reserved: Buffer[]): {
//     features?: number;
//     unused?: Buffer[];
// } {
//     // Not trimmed reserved field
//     if (reserved[reserved.length - 1].length === 0) {
//         throw new InvalidTransactionField(
//             '_decodeReservedField()',
//             'Invalid reserved field. Fields in the reserved buffer must be properly trimmed.',
//             { fieldName: 'reserved', reserved }
//         );
//     }
//
//     // Get features field
//     const featuresField = TRANSACTION_FEATURES_KIND.kind
//         .buffer(reserved[0], TRANSACTION_FEATURES_KIND.name)
//         .decode() as number;
//
//     // Return encoded reserved field
//     return reserved.length > 1
//         ? {
//               features: featuresField,
//               unused: reserved.slice(1)
//           }
//         : { features: featuresField };
// }

// export { decode };

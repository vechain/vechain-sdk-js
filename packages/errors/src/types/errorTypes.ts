import {
    InvalidAbiEventError,
    InvalidAbiFormatTypeError,
    InvalidAbiFunctionError,
    InvalidAbiDataToEncodeError,
    InvalidAbiDataToDecodeError,
    InvalidAddressError,
    InvalidSecp256k1MessageHashError,
    InvalidHDNodePrivateKeyError,
    InvalidSecp256k1SignatureError,
    InvalidSecp256k1SignatureRecoveryError,
    InvalidBloomError,
    InvalidKError,
    InvalidDataTypeError,
    InvalidDataReturnTypeError,
    InvalidHDNodeChaincodeError,
    InvalidHDNodeMnemonicsError,
    InvalidHDNodePublicKeyError,
    InvalidKeystoreError,
    InvalidKeystorePasswordError,
    InvalidRLPError,
    InvalidSecp256k1PrivateKeyError,
    type InvalidRLPErrorData,
    type ErrorBase,
    ABI,
    ADDRESS,
    SECP256K1,
    KEYSTORE,
    HDNODE,
    BLOOM,
    RLP,
    DATA
} from '../model';

/**
 * @note: REGISTER YOUR NEW FANCY ERRORS BELOW!
 */

/**
 * Default error data type. it accepts any object.
 *
 * @param ErrorCodeT - The error code type from the error types enum.
 */
type DefaultErrorData = Record<string, unknown>;

/**
 * Error code type.
 *
 * @public
 */
type ErrorCode =
    | SECP256K1
    | ADDRESS
    | KEYSTORE
    | HDNODE
    | BLOOM
    | ABI
    | RLP
    | DATA;

/**
 * Conditional type to get the error data type from the error code.
 * The type is used to specify the data type of the error builder.
 *
 * @param ErrorCodeT - The error code type from the error types enum.
 *
 * @public
 */
type DataType<ErrorCodeT extends ErrorCode> = ErrorCodeT extends RLP.INVALID_RLP
    ? InvalidRLPErrorData
    : DefaultErrorData;

/**
 * Default error codes.
 *
 * @public
 */
const ERROR_CODES = {
    SECP256K1,
    ADDRESS,
    KEYSTORE,
    HDNODE,
    BLOOM,
    ABI,
    RLP,
    DATA
};

/**
 * Conditional type to get the error type from the error code.
 * The type is used to specify the return type of the error builder.
 *
 * @note When adding a new error, add the error code and the error class to the type.
 *
 * @param ErrorCodeT - The error code type from the error types enum.
 *
 * @public
 */
type ErrorType<ErrorCodeT> =
    ErrorCodeT extends SECP256K1.INVALID_SECP256k1_PRIVATE_KEY
        ? InvalidSecp256k1PrivateKeyError
        : ErrorCodeT extends SECP256K1.INVALID_SECP256k1_MESSAGE_HASH
        ? InvalidSecp256k1MessageHashError
        : ErrorCodeT extends SECP256K1.INVALID_SECP256k1_SIGNATURE
        ? InvalidSecp256k1SignatureError
        : ErrorCodeT extends SECP256K1.INVALID_SECP256k1_SIGNATURE_RECOVERY
        ? InvalidSecp256k1SignatureRecoveryError
        : ErrorCodeT extends ADDRESS.INVALID_ADDRESS
        ? InvalidAddressError
        : ErrorCodeT extends KEYSTORE.INVALID_KEYSTORE
        ? InvalidKeystoreError
        : ErrorCodeT extends KEYSTORE.INVALID_PASSWORD
        ? InvalidKeystorePasswordError
        : ErrorCodeT extends HDNODE.INVALID_HDNODE_CHAIN_CODE
        ? InvalidHDNodeChaincodeError
        : ErrorCodeT extends HDNODE.INVALID_HDNODE_MNEMONICS
        ? InvalidHDNodeMnemonicsError
        : ErrorCodeT extends HDNODE.INVALID_HDNODE_PRIVATE_KEY
        ? InvalidHDNodePrivateKeyError
        : ErrorCodeT extends HDNODE.INVALID_HDNODE_PUBLIC_KEY
        ? InvalidHDNodePublicKeyError
        : ErrorCodeT extends BLOOM.INVALID_BLOOM
        ? InvalidBloomError
        : ErrorCodeT extends BLOOM.INVALID_K
        ? InvalidKError
        : ErrorCodeT extends ABI.INVALID_EVENT
        ? InvalidAbiEventError
        : ErrorCodeT extends ABI.INVALID_DATA_TO_DECODE
        ? InvalidAbiDataToDecodeError
        : ErrorCodeT extends ABI.INVALID_DATA_TO_ENCODE
        ? InvalidAbiDataToEncodeError
        : ErrorCodeT extends ABI.INVALID_FORMAT_TYPE
        ? InvalidAbiFormatTypeError
        : ErrorCodeT extends ABI.INVALID_FUNCTION
        ? InvalidAbiFunctionError
        : ErrorCodeT extends RLP.INVALID_RLP
        ? InvalidRLPError
        : ErrorCodeT extends DATA.INVALID_DATA_TYPE
        ? InvalidDataTypeError
        : ErrorCodeT extends DATA.INVALID_DATA_RETURN_TYPE
        ? InvalidDataReturnTypeError
        : never;

/**
 * Map to get the error class from the error code.
 * The class is used to construct the error object.
 *
 * @note When adding a new error, add the error code and the error class to the map.
 *
 * @param ErrorCodeT - The error code type from the error types enum.
 *
 * @public
 */
const ErrorClassMap = new Map<
    ErrorCode,
    typeof ErrorBase<ErrorCode, DataType<ErrorCode>>
>([
    [ADDRESS.INVALID_ADDRESS, InvalidAddressError],
    [SECP256K1.INVALID_SECP256k1_PRIVATE_KEY, InvalidSecp256k1PrivateKeyError],
    [
        SECP256K1.INVALID_SECP256k1_MESSAGE_HASH,
        InvalidSecp256k1MessageHashError
    ],
    [SECP256K1.INVALID_SECP256k1_SIGNATURE, InvalidSecp256k1SignatureError],
    [
        SECP256K1.INVALID_SECP256k1_SIGNATURE_RECOVERY,
        InvalidSecp256k1SignatureRecoveryError
    ],
    [KEYSTORE.INVALID_KEYSTORE, InvalidKeystoreError],
    [KEYSTORE.INVALID_PASSWORD, InvalidKeystorePasswordError],
    [HDNODE.INVALID_HDNODE_CHAIN_CODE, InvalidHDNodeChaincodeError],
    [HDNODE.INVALID_HDNODE_MNEMONICS, InvalidHDNodeMnemonicsError],
    [HDNODE.INVALID_HDNODE_PRIVATE_KEY, InvalidHDNodePrivateKeyError],
    [HDNODE.INVALID_HDNODE_PUBLIC_KEY, InvalidHDNodePublicKeyError],
    [BLOOM.INVALID_BLOOM, InvalidBloomError],
    [BLOOM.INVALID_K, InvalidKError],
    [ABI.INVALID_EVENT, InvalidAbiEventError],
    [ABI.INVALID_DATA_TO_DECODE, InvalidAbiDataToDecodeError],
    [ABI.INVALID_DATA_TO_ENCODE, InvalidAbiDataToEncodeError],
    [ABI.INVALID_FORMAT_TYPE, InvalidAbiFormatTypeError],
    [ABI.INVALID_FUNCTION, InvalidAbiFunctionError],
    [RLP.INVALID_RLP, InvalidRLPError],
    [DATA.INVALID_DATA_TYPE, InvalidDataTypeError],
    [DATA.INVALID_DATA_RETURN_TYPE, InvalidDataReturnTypeError]
]);

export {
    type ErrorType,
    type DataType,
    type DefaultErrorData,
    type ErrorCode,
    ErrorClassMap,
    ERROR_CODES
};

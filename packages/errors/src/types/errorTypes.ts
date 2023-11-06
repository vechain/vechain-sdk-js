import {
    ABI,
    ADDRESS,
    BLOOM,
    CERTIFICATE,
    CertificateInvalidSignatureFormatError,
    CertificateInvalidSignerError,
    CertificateNotSignedError,
    ContractInterfaceError,
    DATA,
    type ErrorBase,
    HDNODE,
    HTTP_CLIENT,
    HTTPClientError,
    type HTTPClientErrorData,
    InvalidAbiDataToDecodeError,
    InvalidAbiDataToEncodeError,
    InvalidAbiEventError,
    InvalidAbiFormatTypeError,
    InvalidAbiFunctionError,
    InvalidAddressError,
    InvalidBloomError,
    InvalidDataReturnTypeError,
    InvalidDataTypeError,
    InvalidHDNodeChaincodeError,
    InvalidHDNodeDerivationPathError,
    InvalidHDNodeMnemonicsError,
    InvalidHDNodePrivateKeyError,
    InvalidHDNodePublicKeyError,
    InvalidKError,
    InvalidKeystoreError,
    InvalidKeystorePasswordError,
    InvalidRLPError,
    type InvalidRLPErrorData,
    InvalidSecp256k1MessageHashError,
    InvalidSecp256k1PrivateKeyError,
    InvalidSecp256k1SignatureError,
    InvalidSecp256k1SignatureRecoveryError,
    KEYSTORE,
    RLP,
    SECP256K1,
    TRANSACTION,
    TransactionAlreadySignedError,
    TransactionBodyError,
    TransactionDelegationError,
    TransactionNotSignedError
} from '../model';

/**
 * @note: REGISTER YOUR NEW FANCY ERRORS BELOW!
 */

/**
 * Default error data type. it accepts any object.
 *
 * @param ErrorCodeT - The error code type from the error types enum.
 */
type DefaultErrorData = Record<string, unknown> | { innerError: Error };

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
    | CERTIFICATE
    | ABI
    | RLP
    | DATA
    | TRANSACTION
    | HTTP_CLIENT;

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
    : ErrorCodeT extends HTTP_CLIENT.INVALID_HTTP_REQUEST
    ? HTTPClientErrorData
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
    CERTIFICATE,
    ABI,
    RLP,
    DATA,
    TRANSACTION,
    HTTP_CLIENT
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
        : ErrorCodeT extends HDNODE.INVALID_HDNODE_DERIVATION_PATH
        ? InvalidHDNodeDerivationPathError
        : ErrorCodeT extends BLOOM.INVALID_BLOOM
        ? InvalidBloomError
        : ErrorCodeT extends BLOOM.INVALID_K
        ? InvalidKError
        : ErrorCodeT extends CERTIFICATE.CERTIFICATE_NOT_SIGNED
        ? CertificateNotSignedError
        : ErrorCodeT extends CERTIFICATE.CERTIFICATE_INVALID_SIGNATURE_FORMAT
        ? CertificateInvalidSignatureFormatError
        : ErrorCodeT extends CERTIFICATE.CERTIFICATE_INVALID_SIGNER
        ? CertificateInvalidSignerError
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
        : ErrorCodeT extends ABI.CONTRACT_INTERFACE_ERROR
        ? ContractInterfaceError
        : ErrorCodeT extends RLP.INVALID_RLP
        ? InvalidRLPError
        : ErrorCodeT extends DATA.INVALID_DATA_TYPE
        ? InvalidDataTypeError
        : ErrorCodeT extends DATA.INVALID_DATA_RETURN_TYPE
        ? InvalidDataReturnTypeError
        : ErrorCodeT extends TRANSACTION.ALREADY_SIGNED
        ? TransactionAlreadySignedError
        : ErrorCodeT extends TRANSACTION.NOT_SIGNED
        ? TransactionNotSignedError
        : ErrorCodeT extends TRANSACTION.INVALID_TRANSACTION_BODY
        ? TransactionBodyError
        : ErrorCodeT extends TRANSACTION.INVALID_DELEGATION
        ? TransactionDelegationError
        : ErrorCodeT extends HTTP_CLIENT.INVALID_HTTP_REQUEST
        ? HTTPClientError
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
    [HDNODE.INVALID_HDNODE_DERIVATION_PATH, InvalidHDNodeDerivationPathError],
    [BLOOM.INVALID_BLOOM, InvalidBloomError],
    [BLOOM.INVALID_K, InvalidKError],
    [CERTIFICATE.CERTIFICATE_NOT_SIGNED, CertificateNotSignedError],
    [
        CERTIFICATE.CERTIFICATE_INVALID_SIGNATURE_FORMAT,
        CertificateInvalidSignatureFormatError
    ],
    [CERTIFICATE.CERTIFICATE_INVALID_SIGNER, CertificateInvalidSignerError],
    [ABI.INVALID_EVENT, InvalidAbiEventError],
    [ABI.INVALID_DATA_TO_DECODE, InvalidAbiDataToDecodeError],
    [ABI.INVALID_DATA_TO_ENCODE, InvalidAbiDataToEncodeError],
    [ABI.INVALID_FORMAT_TYPE, InvalidAbiFormatTypeError],
    [ABI.INVALID_FUNCTION, InvalidAbiFunctionError],
    [ABI.CONTRACT_INTERFACE_ERROR, ContractInterfaceError],
    [RLP.INVALID_RLP, InvalidRLPError],
    [DATA.INVALID_DATA_TYPE, InvalidDataTypeError],
    [DATA.INVALID_DATA_RETURN_TYPE, InvalidDataReturnTypeError],
    [TRANSACTION.ALREADY_SIGNED, TransactionAlreadySignedError],
    [TRANSACTION.NOT_SIGNED, TransactionNotSignedError],
    [TRANSACTION.INVALID_TRANSACTION_BODY, TransactionBodyError],
    [TRANSACTION.INVALID_DELEGATION, TransactionDelegationError],
    [HTTP_CLIENT.INVALID_HTTP_REQUEST, HTTPClientError]
]);

export {
    type ErrorType,
    type DataType,
    type DefaultErrorData,
    type ErrorCode,
    ErrorClassMap,
    ERROR_CODES
};

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
    EIP1193,
    EIP1193ChainDisconnected,
    EIP1193Disconnected,
    type EIP1193ProviderRpcErrorData,
    EIP1193Unauthorized,
    EIP1193UnsupportedMethod,
    EIP1193UserRejectedRequest,
    type ErrorBase,
    FUNCTION,
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
    JSONRPC,
    JSONRPCDefaultError,
    type JSONRPCErrorData,
    JSONRPCInternalError,
    JSONRPCInvalidParams,
    JSONRPCInvalidRequest,
    KEYSTORE,
    NotImplementedError,
    POLL_ERROR,
    type PollErrorData,
    PollExecutionError,
    RLP,
    SECP256K1,
    TRANSACTION,
    TransactionAlreadySignedError,
    TransactionBodyError,
    TransactionDelegationError,
    TransactionMissingPrivateKeyError,
    TransactionNotSignedError
} from '../model';
import { CONTRACT, ContractDeploymentFailedError } from '../model';

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
    | HTTP_CLIENT
    | POLL_ERROR
    | FUNCTION
    | EIP1193
    | JSONRPC
    | CONTRACT;

/**
 * Conditional type to get the error data type from the error code.
 * The type is used to specify the data type of the error builder.
 *
 * @param ErrorCodeT - The error code type from the error types enum.
 */
type DataType<ErrorCodeT extends ErrorCode> =
    // RLP
    ErrorCodeT extends RLP.INVALID_RLP
        ? InvalidRLPErrorData
        : // HTTP_CLIENT
          ErrorCodeT extends HTTP_CLIENT.INVALID_HTTP_REQUEST
          ? HTTPClientErrorData
          : // POLL_ERROR
            ErrorCodeT extends POLL_ERROR.POLL_EXECUTION_ERROR
            ? PollErrorData
            : // EIP1193
              ErrorCodeT extends EIP1193.USER_REJECTED_REQUEST
              ? EIP1193ProviderRpcErrorData
              : ErrorCodeT extends EIP1193.UNAUTHORIZED
                ? EIP1193ProviderRpcErrorData
                : ErrorCodeT extends EIP1193.UNSUPPORTED_METHOD
                  ? EIP1193ProviderRpcErrorData
                  : ErrorCodeT extends EIP1193.DISCONNECTED
                    ? EIP1193ProviderRpcErrorData
                    : ErrorCodeT extends EIP1193.CHAIN_DISCONNECTED
                      ? EIP1193ProviderRpcErrorData
                      : // JSONRPC
                        ErrorCodeT extends JSONRPC.INVALID_REQUEST
                        ? JSONRPCErrorData
                        : ErrorCodeT extends JSONRPC.INVALID_PARAMS
                          ? JSONRPCErrorData
                          : ErrorCodeT extends JSONRPC.INTERNAL_ERROR
                            ? JSONRPCErrorData
                            : // DEFAULT
                              DefaultErrorData;

/**
 * Default error codes.
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
    HTTP_CLIENT,
    POLL_ERROR,
    FUNCTION,
    EIP1193,
    JSONRPC,
    CONTRACT
};

/**
 * Conditional type to get the error type from the error code.
 * The type is used to specify the return type of the error builder.
 *
 * @note When adding a new error, add the error code and the error class to the type.
 *
 * @param ErrorCodeT - The error code type from the error types enum.
 */
type ErrorType<ErrorCodeT> =
    // SECP256K1
    ErrorCodeT extends SECP256K1.INVALID_SECP256k1_PRIVATE_KEY
        ? InvalidSecp256k1PrivateKeyError
        : ErrorCodeT extends SECP256K1.INVALID_SECP256k1_MESSAGE_HASH
          ? InvalidSecp256k1MessageHashError
          : ErrorCodeT extends SECP256K1.INVALID_SECP256k1_SIGNATURE
            ? InvalidSecp256k1SignatureError
            : ErrorCodeT extends SECP256K1.INVALID_SECP256k1_SIGNATURE_RECOVERY
              ? InvalidSecp256k1SignatureRecoveryError
              : // ADDRESS
                ErrorCodeT extends ADDRESS.INVALID_ADDRESS
                ? InvalidAddressError
                : // KEYSTORE
                  ErrorCodeT extends KEYSTORE.INVALID_KEYSTORE
                  ? InvalidKeystoreError
                  : ErrorCodeT extends KEYSTORE.INVALID_PASSWORD
                    ? InvalidKeystorePasswordError
                    : // HDNODE
                      ErrorCodeT extends HDNODE.INVALID_HDNODE_CHAIN_CODE
                      ? InvalidHDNodeChaincodeError
                      : ErrorCodeT extends HDNODE.INVALID_HDNODE_MNEMONICS
                        ? InvalidHDNodeMnemonicsError
                        : ErrorCodeT extends HDNODE.INVALID_HDNODE_PRIVATE_KEY
                          ? InvalidHDNodePrivateKeyError
                          : ErrorCodeT extends HDNODE.INVALID_HDNODE_PUBLIC_KEY
                            ? InvalidHDNodePublicKeyError
                            : ErrorCodeT extends HDNODE.INVALID_HDNODE_DERIVATION_PATH
                              ? InvalidHDNodeDerivationPathError
                              : // BLOOM
                                ErrorCodeT extends BLOOM.INVALID_BLOOM
                                ? InvalidBloomError
                                : ErrorCodeT extends BLOOM.INVALID_K
                                  ? InvalidKError
                                  : // CERTIFICATE
                                    ErrorCodeT extends CERTIFICATE.CERTIFICATE_NOT_SIGNED
                                    ? CertificateNotSignedError
                                    : ErrorCodeT extends CERTIFICATE.CERTIFICATE_INVALID_SIGNATURE_FORMAT
                                      ? CertificateInvalidSignatureFormatError
                                      : ErrorCodeT extends CERTIFICATE.CERTIFICATE_INVALID_SIGNER
                                        ? CertificateInvalidSignerError
                                        : // ABI
                                          ErrorCodeT extends ABI.INVALID_EVENT
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
                                                    : // RLP
                                                      ErrorCodeT extends RLP.INVALID_RLP
                                                      ? InvalidRLPError
                                                      : // DATA
                                                        ErrorCodeT extends DATA.INVALID_DATA_TYPE
                                                        ? InvalidDataTypeError
                                                        : ErrorCodeT extends DATA.INVALID_DATA_RETURN_TYPE
                                                          ? InvalidDataReturnTypeError
                                                          : // TRANSACTION
                                                            ErrorCodeT extends TRANSACTION.ALREADY_SIGNED
                                                            ? TransactionAlreadySignedError
                                                            : ErrorCodeT extends TRANSACTION.NOT_SIGNED
                                                              ? TransactionNotSignedError
                                                              : ErrorCodeT extends TRANSACTION.INVALID_TRANSACTION_BODY
                                                                ? TransactionBodyError
                                                                : ErrorCodeT extends TRANSACTION.INVALID_DELEGATION
                                                                  ? TransactionDelegationError
                                                                  : ErrorCodeT extends TRANSACTION.MISSING_PRIVATE_KEY
                                                                    ? TransactionMissingPrivateKeyError
                                                                    : // HTTP_CLIENT
                                                                      ErrorCodeT extends HTTP_CLIENT.INVALID_HTTP_REQUEST
                                                                      ? HTTPClientError
                                                                      : // POOL_ERROR
                                                                        ErrorCodeT extends POLL_ERROR.POLL_EXECUTION_ERROR
                                                                        ? PollExecutionError
                                                                        : // EIP1193
                                                                          ErrorCodeT extends EIP1193.USER_REJECTED_REQUEST
                                                                          ? EIP1193UserRejectedRequest
                                                                          : ErrorCodeT extends EIP1193.UNAUTHORIZED
                                                                            ? EIP1193Unauthorized
                                                                            : ErrorCodeT extends EIP1193.UNSUPPORTED_METHOD
                                                                              ? EIP1193UnsupportedMethod
                                                                              : ErrorCodeT extends EIP1193.DISCONNECTED
                                                                                ? EIP1193Disconnected
                                                                                : ErrorCodeT extends EIP1193.CHAIN_DISCONNECTED
                                                                                  ? EIP1193ChainDisconnected
                                                                                  : // FUNCTION
                                                                                    ErrorCodeT extends FUNCTION.NOT_IMPLEMENTED
                                                                                    ? NotImplementedError
                                                                                    : // JSONRPC
                                                                                      ErrorCodeT extends JSONRPC.INVALID_REQUEST
                                                                                      ? JSONRPCInvalidRequest
                                                                                      : ErrorCodeT extends JSONRPC.INVALID_PARAMS
                                                                                        ? JSONRPCInvalidParams
                                                                                        : ErrorCodeT extends JSONRPC.INTERNAL_ERROR
                                                                                          ? JSONRPCInternalError
                                                                                          : ErrorCodeT extends JSONRPC.DEFAULT
                                                                                            ? JSONRPCDefaultError
                                                                                            : ErrorCodeT extends CONTRACT.CONTRACT_DEPLOYMENT_FAILED
                                                                                              ? ContractDeploymentFailedError
                                                                                              : never;

/**
 * Map to get the error class from the error code.
 * The class is used to construct the error object.
 *
 * @note When adding a new error, add the error code and the error class to the map.
 *
 * @param ErrorCodeT - The error code type from the error types enum.
 */
const ErrorClassMap = new Map<
    ErrorCode,
    typeof ErrorBase<ErrorCode, DataType<ErrorCode>>
>([
    // ADDRESS
    [ADDRESS.INVALID_ADDRESS, InvalidAddressError],

    // SECP256K1
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

    // KEYSTORE
    [KEYSTORE.INVALID_KEYSTORE, InvalidKeystoreError],
    [KEYSTORE.INVALID_PASSWORD, InvalidKeystorePasswordError],
    // HDNODE
    [HDNODE.INVALID_HDNODE_CHAIN_CODE, InvalidHDNodeChaincodeError],
    [HDNODE.INVALID_HDNODE_MNEMONICS, InvalidHDNodeMnemonicsError],
    [HDNODE.INVALID_HDNODE_PRIVATE_KEY, InvalidHDNodePrivateKeyError],
    [HDNODE.INVALID_HDNODE_PUBLIC_KEY, InvalidHDNodePublicKeyError],
    [HDNODE.INVALID_HDNODE_DERIVATION_PATH, InvalidHDNodeDerivationPathError],
    [BLOOM.INVALID_BLOOM, InvalidBloomError],
    [BLOOM.INVALID_K, InvalidKError],

    // CERTIFICATE
    [CERTIFICATE.CERTIFICATE_NOT_SIGNED, CertificateNotSignedError],
    [
        CERTIFICATE.CERTIFICATE_INVALID_SIGNATURE_FORMAT,
        CertificateInvalidSignatureFormatError
    ],
    [CERTIFICATE.CERTIFICATE_INVALID_SIGNER, CertificateInvalidSignerError],
    // ABI
    [ABI.INVALID_EVENT, InvalidAbiEventError],
    [ABI.INVALID_DATA_TO_DECODE, InvalidAbiDataToDecodeError],
    [ABI.INVALID_DATA_TO_ENCODE, InvalidAbiDataToEncodeError],
    [ABI.INVALID_FORMAT_TYPE, InvalidAbiFormatTypeError],
    [ABI.INVALID_FUNCTION, InvalidAbiFunctionError],
    [ABI.CONTRACT_INTERFACE_ERROR, ContractInterfaceError],

    // RLP
    [RLP.INVALID_RLP, InvalidRLPError],

    // DATA
    [DATA.INVALID_DATA_TYPE, InvalidDataTypeError],
    [DATA.INVALID_DATA_RETURN_TYPE, InvalidDataReturnTypeError],

    // TRANSACTION
    [TRANSACTION.ALREADY_SIGNED, TransactionAlreadySignedError],
    [TRANSACTION.NOT_SIGNED, TransactionNotSignedError],
    [TRANSACTION.INVALID_TRANSACTION_BODY, TransactionBodyError],
    [TRANSACTION.INVALID_DELEGATION, TransactionDelegationError],
    [TRANSACTION.MISSING_PRIVATE_KEY, TransactionMissingPrivateKeyError],

    // HTTP_CLIENT
    [HTTP_CLIENT.INVALID_HTTP_REQUEST, HTTPClientError],

    // POLL_ERROR
    [POLL_ERROR.POLL_EXECUTION_ERROR, PollExecutionError],

    // FUNCTION
    [FUNCTION.NOT_IMPLEMENTED, NotImplementedError],

    // EIP1193
    [EIP1193.USER_REJECTED_REQUEST, EIP1193UserRejectedRequest],
    [EIP1193.UNAUTHORIZED, EIP1193Unauthorized],
    [EIP1193.UNSUPPORTED_METHOD, EIP1193UnsupportedMethod],
    [EIP1193.DISCONNECTED, EIP1193Disconnected],
    [EIP1193.CHAIN_DISCONNECTED, EIP1193ChainDisconnected],

    // JSONRPC
    [JSONRPC.INVALID_REQUEST, JSONRPCInvalidRequest],
    [JSONRPC.INVALID_PARAMS, JSONRPCInvalidParams],
    [JSONRPC.INTERNAL_ERROR, JSONRPCInternalError],
    [JSONRPC.DEFAULT, JSONRPCDefaultError],

    // CONTRACT
    [CONTRACT.CONTRACT_DEPLOYMENT_FAILED, ContractDeploymentFailedError]
]);

export {
    type ErrorType,
    type DataType,
    type DefaultErrorData,
    type ErrorCode,
    ErrorClassMap,
    ERROR_CODES
};

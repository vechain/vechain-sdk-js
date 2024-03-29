import {
    ABI,
    ADDRESS,
    BLOOM,
    DATA,
    HDNODE,
    RLP,
    KEYSTORE,
    SECP256K1,
    TRANSACTION,
    CERTIFICATE,
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
    InvalidHDNodeMnemonicsError,
    InvalidHDNodePrivateKeyError,
    InvalidHDNodePublicKeyError,
    InvalidKError,
    InvalidKeystoreError,
    InvalidKeystorePasswordError,
    InvalidRLPError,
    InvalidSecp256k1MessageHashError,
    InvalidSecp256k1PrivateKeyError,
    InvalidSecp256k1SignatureError,
    InvalidSecp256k1SignatureRecoveryError,
    TransactionAlreadySignedError,
    TransactionBodyError,
    TransactionDelegationError,
    TransactionNotSignedError,
    InvalidHDNodeDerivationPathError,
    CertificateNotSignedError,
    CertificateInvalidSignatureFormatError,
    CertificateInvalidSignerError,
    ContractInterfaceError,
    HTTP_CLIENT,
    HTTPClientError,
    POLL_ERROR,
    PollExecutionError,
    FUNCTION,
    NotImplementedError,
    EIP1193,
    EIP1193UserRejectedRequest,
    EIP1193Disconnected,
    EIP1193Unauthorized,
    EIP1193UnsupportedMethod,
    EIP1193ChainDisconnected,
    JSONRPC,
    JSONRPCInvalidRequest,
    JSONRPCInvalidParams,
    JSONRPCInternalError,
    JSONRPCDefaultError,
    CONTRACT,
    ContractDeploymentFailedError,
    TransactionMissingPrivateKeyError,
    TransactionNotEnoughGasError
} from '../src';

/**
 * Error maps for types (codes and classes) in order to test correctness between error codes and error classes.
 *
 * @NOTE: When adding a new error, add the error code and the error class to the map.
 */
const ErrorsCodeAndClassesMapsFixture = [
    {
        name: 'Address',
        elements: [
            {
                errorCode: ADDRESS.INVALID_ADDRESS,
                classExpected: InvalidAddressError
            }
        ]
    },
    {
        name: 'Certificate',
        elements: [
            {
                errorCode: CERTIFICATE.CERTIFICATE_NOT_SIGNED,
                classExpected: CertificateNotSignedError
            },
            {
                errorCode: CERTIFICATE.CERTIFICATE_INVALID_SIGNATURE_FORMAT,
                classExpected: CertificateInvalidSignatureFormatError
            },
            {
                errorCode: CERTIFICATE.CERTIFICATE_INVALID_SIGNER,
                classExpected: CertificateInvalidSignerError
            }
        ]
    },
    {
        name: 'Secp256k1',
        elements: [
            {
                errorCode: SECP256K1.INVALID_SECP256k1_PRIVATE_KEY,
                classExpected: InvalidSecp256k1PrivateKeyError
            },
            {
                errorCode: SECP256K1.INVALID_SECP256k1_MESSAGE_HASH,
                classExpected: InvalidSecp256k1MessageHashError
            },
            {
                errorCode: SECP256K1.INVALID_SECP256k1_SIGNATURE,
                classExpected: InvalidSecp256k1SignatureError
            },
            {
                errorCode: SECP256K1.INVALID_SECP256k1_SIGNATURE_RECOVERY,
                classExpected: InvalidSecp256k1SignatureRecoveryError
            }
        ]
    },
    {
        name: 'Keystore',
        elements: [
            {
                errorCode: KEYSTORE.INVALID_KEYSTORE,
                classExpected: InvalidKeystoreError
            },
            {
                errorCode: KEYSTORE.INVALID_PASSWORD,
                classExpected: InvalidKeystorePasswordError
            }
        ]
    },
    {
        name: 'HDNode',
        elements: [
            {
                errorCode: HDNODE.INVALID_HDNODE_CHAIN_CODE,
                classExpected: InvalidHDNodeChaincodeError
            },
            {
                errorCode: HDNODE.INVALID_HDNODE_MNEMONICS,
                classExpected: InvalidHDNodeMnemonicsError
            },
            {
                errorCode: HDNODE.INVALID_HDNODE_PRIVATE_KEY,
                classExpected: InvalidHDNodePrivateKeyError
            },
            {
                errorCode: HDNODE.INVALID_HDNODE_PUBLIC_KEY,
                classExpected: InvalidHDNodePublicKeyError
            },
            {
                errorCode: HDNODE.INVALID_HDNODE_DERIVATION_PATH,
                classExpected: InvalidHDNodeDerivationPathError
            }
        ]
    },
    {
        name: 'Bloom',
        elements: [
            {
                errorCode: BLOOM.INVALID_BLOOM,
                classExpected: InvalidBloomError
            },
            {
                errorCode: BLOOM.INVALID_K,
                classExpected: InvalidKError
            }
        ]
    },
    {
        name: 'Abi',
        elements: [
            {
                errorCode: ABI.INVALID_EVENT,
                classExpected: InvalidAbiEventError
            },
            {
                errorCode: ABI.INVALID_DATA_TO_DECODE,
                classExpected: InvalidAbiDataToDecodeError
            },
            {
                errorCode: ABI.INVALID_DATA_TO_ENCODE,
                classExpected: InvalidAbiDataToEncodeError
            },
            {
                errorCode: ABI.INVALID_FORMAT_TYPE,
                classExpected: InvalidAbiFormatTypeError
            },
            {
                errorCode: ABI.INVALID_FUNCTION,
                classExpected: InvalidAbiFunctionError
            },
            {
                errorCode: ABI.CONTRACT_INTERFACE_ERROR,
                classExpected: ContractInterfaceError
            }
        ]
    },
    {
        name: 'Rlp',
        elements: [
            {
                errorCode: RLP.INVALID_RLP,
                classExpected: InvalidRLPError
            }
        ]
    },
    {
        name: 'Data',
        elements: [
            {
                errorCode: DATA.INVALID_DATA_TYPE,
                classExpected: InvalidDataTypeError
            },
            {
                errorCode: DATA.INVALID_DATA_RETURN_TYPE,
                classExpected: InvalidDataReturnTypeError
            }
        ]
    },
    {
        name: 'Transaction',
        elements: [
            {
                errorCode: TRANSACTION.ALREADY_SIGNED,
                classExpected: TransactionAlreadySignedError
            },
            {
                errorCode: TRANSACTION.NOT_SIGNED,
                classExpected: TransactionNotSignedError
            },
            {
                errorCode: TRANSACTION.INVALID_TRANSACTION_BODY,
                classExpected: TransactionBodyError
            },
            {
                errorCode: TRANSACTION.INVALID_DELEGATION,
                classExpected: TransactionDelegationError
            },
            {
                errorCode: TRANSACTION.MISSING_PRIVATE_KEY,
                classExpected: TransactionMissingPrivateKeyError
            },
            {
                errorCode: TRANSACTION.NOT_ENOUGH_GAS,
                classExpected: TransactionNotEnoughGasError
            }
        ]
    },
    {
        name: 'HTTP Client',
        elements: [
            {
                errorCode: HTTP_CLIENT.INVALID_HTTP_REQUEST,
                classExpected: HTTPClientError
            }
        ]
    },
    {
        name: 'Poll',
        elements: [
            {
                errorCode: POLL_ERROR.POLL_EXECUTION_ERROR,
                classExpected: PollExecutionError
            }
        ]
    },
    {
        name: 'Function',
        elements: [
            {
                errorCode: FUNCTION.NOT_IMPLEMENTED,
                classExpected: NotImplementedError
            }
        ]
    },
    {
        name: 'EIP1193',
        elements: [
            {
                errorCode: EIP1193.USER_REJECTED_REQUEST,
                classExpected: EIP1193UserRejectedRequest
            },
            {
                errorCode: EIP1193.UNAUTHORIZED,
                classExpected: EIP1193Unauthorized
            },
            {
                errorCode: EIP1193.UNSUPPORTED_METHOD,
                classExpected: EIP1193UnsupportedMethod
            },
            {
                errorCode: EIP1193.DISCONNECTED,
                classExpected: EIP1193Disconnected
            },
            {
                errorCode: EIP1193.CHAIN_DISCONNECTED,
                classExpected: EIP1193ChainDisconnected
            }
        ]
    },
    {
        name: 'JSONRPC',
        elements: [
            {
                errorCode: JSONRPC.INVALID_REQUEST,
                classExpected: JSONRPCInvalidRequest
            },
            {
                errorCode: JSONRPC.INVALID_PARAMS,
                classExpected: JSONRPCInvalidParams
            },
            {
                errorCode: JSONRPC.INTERNAL_ERROR,
                classExpected: JSONRPCInternalError
            },
            {
                errorCode: JSONRPC.DEFAULT,
                classExpected: JSONRPCDefaultError
            }
        ]
    },
    {
        name: 'Contract',
        elements: [
            {
                errorCode: CONTRACT.CONTRACT_DEPLOYMENT_FAILED,
                classExpected: ContractDeploymentFailedError
            }
        ]
    }
];

/**
 * Error maps for EIP1193 and JSON RPC errors.
 *
 * @note Should be used with the `buildRPCerror` function which always builds a `ProviderRpcError` object.
 */
const JSONrpcErrorsCodeAndClassesMapsFixture = [
    {
        name: 'EIP1193',
        elements: [
            {
                errorCode: EIP1193.USER_REJECTED_REQUEST
            },
            {
                errorCode: EIP1193.UNAUTHORIZED
            },
            {
                errorCode: EIP1193.UNSUPPORTED_METHOD
            },
            {
                errorCode: EIP1193.DISCONNECTED
            },
            {
                errorCode: EIP1193.CHAIN_DISCONNECTED
            }
        ]
    },
    {
        name: 'JSONRPC',
        elements: [
            {
                errorCode: JSONRPC.INVALID_REQUEST
            },
            {
                errorCode: JSONRPC.INVALID_PARAMS
            },
            {
                errorCode: JSONRPC.INTERNAL_ERROR
            },
            {
                errorCode: JSONRPC.DEFAULT
            }
        ]
    }
];

export {
    ErrorsCodeAndClassesMapsFixture,
    JSONrpcErrorsCodeAndClassesMapsFixture
};

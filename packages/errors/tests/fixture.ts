import {
    ABI,
    ADDRESS,
    BLOOM,
    DATA,
    HDNODE,
    RLP,
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
    KEYSTORE,
    SECP256K1,
    TRANSACTION,
    TransactionAlreadySignedError,
    TransactionBodyError,
    TransactionDelegationError,
    TransactionNotSignedError
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
            }
        ]
    }
];
export { ErrorsCodeAndClassesMapsFixture };

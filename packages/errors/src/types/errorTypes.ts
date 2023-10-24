import type { ErrorBase } from '../model';
import {
    InvalidAbiEventError,
    InvalidAbiFormatTypeError,
    InvalidAbiFunctionError,
    InvalidAbiDataToEncodeError,
    InvalidAbiDataToDecodeError
} from '../model/abi';
import { InvalidAddressError, InvalidChecksumError } from '../model/address';
import { InvalidBloomError, InvalidKError } from '../model/bloom';
import { InvalidDataTypeError } from '../model/data';
import {
    InvalidChaincodeError,
    InvalidMnemonicsError,
    InvalidPublicKeyError
} from '../model/hdnode';
import {
    InvalidKeystoreError,
    InvalidKeystorePasswordError
} from '../model/keystore';
import { InvalidRLPError, type InvalidRLPErrorData } from '../model/rlp';
import {
    InvalidMessageHashError,
    InvalidPrivateKeyError,
    InvalidSignatureError,
    InvalidSignatureRecoveryError
} from '../model/secp256k1';

export enum SECP256K1 {
    INVALID_PRIVATE_KEY = 'INVALID_PRIVATE_KEY',
    INVALID_MESSAGE_HASH = 'INVALID_MESSAGE_HASH',
    INVALID_SIGNATURE = 'INVALID_SIGNATURE',
    INVALID_SIGNATURE_RECOVERY = 'INVALID_SIGNATURE_RECOVERY'
}

export enum ADDRESS {
    INVALID_ADDRESS = 'INVALID_ADDRESS',
    INVALID_CHECKSUM = 'INVALID_CHECKSUM'
}

export enum KEYSTORE {
    INVALID_KEYSTORE = 'INVALID_KEYSTORE',
    INVALID_PASSWORD = 'INVALID_PASSWORD'
}

export enum HDNODE {
    INVALID_PUBLICKEY = 'INVALID_PUBLICKEY',
    INVALID_PRIVATEKEY = 'INVALID_PRIVATEKEY',
    INVALID_CHAINCODE = 'INVALID_CHAINCODE',
    INVALID_MNEMONICS = 'INVALID_MNEMONICS'
}

export enum BLOOM {
    INVALID_BLOOM = 'INVALID_BLOOM',
    INVALID_K = 'INVALID_K'
}

export enum ABI {
    INVALID_FUNCTION = 'INVALID_FUNCTION',
    INVALID_EVENT = 'INVALID_EVENT',
    INVALID_DATA_TO_DECODE = 'INVALID_DATA_TO_DECODE',
    INVALID_DATA_TO_ENCODE = 'INVALID_DATA_TO_ENCODE',
    INVALID_FORMAT_TYPE = 'INVALID_FORMAT_TYPE'
}

export enum RLP {
    INVALID_RLP = 'INVALID_RLP'
}

export enum DATA {
    INVALID_DATA_TYPE = 'INVALID_DATA_TYPE'
}

export type ErrorCode =
    | SECP256K1
    | ADDRESS
    | KEYSTORE
    | HDNODE
    | BLOOM
    | ABI
    | RLP
    | DATA;

/**
 * Default error data type. it accepts any object.
 * @param ErrorCodeT - The error code type from the error types enum.
 */
export type DefaultErrorData = Record<string, unknown>;

export const ERROR_CODES = {
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
 * Conditional type to get the error data type from the error code.
 * The type is used to specify the data type of the error builder.
 * @param ErrorCodeT - The error code type from the error types enum.
 */
export type DataType<ErrorCodeT extends ErrorCode> =
    ErrorCodeT extends RLP.INVALID_RLP ? InvalidRLPErrorData : DefaultErrorData;

/**
 * Conditional type to get the error type from the error code.
 * The type is used to specify the return type of the error builder.
 * @param ErrorCodeT - The error code type from the error types enum.
 */
export type ErrorType<ErrorCodeT> =
    ErrorCodeT extends SECP256K1.INVALID_PRIVATE_KEY
        ? InvalidPrivateKeyError
        : ErrorCodeT extends SECP256K1.INVALID_MESSAGE_HASH
        ? InvalidMessageHashError
        : ErrorCodeT extends SECP256K1.INVALID_SIGNATURE
        ? InvalidSignatureError
        : ErrorCodeT extends SECP256K1.INVALID_SIGNATURE_RECOVERY
        ? InvalidSignatureRecoveryError
        : ErrorCodeT extends ADDRESS.INVALID_ADDRESS
        ? InvalidAddressError
        : ErrorCodeT extends ADDRESS.INVALID_CHECKSUM
        ? InvalidChecksumError
        : ErrorCodeT extends KEYSTORE.INVALID_KEYSTORE
        ? InvalidKeystoreError
        : ErrorCodeT extends KEYSTORE.INVALID_PASSWORD
        ? InvalidKeystorePasswordError
        : ErrorCodeT extends HDNODE.INVALID_CHAINCODE
        ? InvalidChaincodeError
        : ErrorCodeT extends HDNODE.INVALID_MNEMONICS
        ? InvalidMnemonicsError
        : ErrorCodeT extends HDNODE.INVALID_PRIVATEKEY
        ? InvalidPrivateKeyError
        : ErrorCodeT extends HDNODE.INVALID_PUBLICKEY
        ? InvalidPublicKeyError
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
        : never;

/**
 * Map to get the error class from the error code.
 * The class is used to construct the error object.
 * @param ErrorCodeT - The error code type from the error types enum.
 */
export const ErrorClassMap = new Map<
    ErrorCode,
    typeof ErrorBase<ErrorCode, DataType<ErrorCode>>
>([
    [ADDRESS.INVALID_ADDRESS, InvalidAddressError],
    [ADDRESS.INVALID_CHECKSUM, InvalidChecksumError],
    [SECP256K1.INVALID_PRIVATE_KEY, InvalidPrivateKeyError],
    [SECP256K1.INVALID_MESSAGE_HASH, InvalidMessageHashError],
    [SECP256K1.INVALID_SIGNATURE, InvalidSignatureError],
    [SECP256K1.INVALID_SIGNATURE_RECOVERY, InvalidSignatureRecoveryError],
    [KEYSTORE.INVALID_KEYSTORE, InvalidKeystoreError],
    [KEYSTORE.INVALID_PASSWORD, InvalidKeystorePasswordError],
    [HDNODE.INVALID_CHAINCODE, InvalidChaincodeError],
    [HDNODE.INVALID_MNEMONICS, InvalidMnemonicsError],
    [HDNODE.INVALID_PRIVATEKEY, InvalidPrivateKeyError],
    [HDNODE.INVALID_PUBLICKEY, InvalidPublicKeyError],
    [BLOOM.INVALID_BLOOM, InvalidBloomError],
    [BLOOM.INVALID_K, InvalidKError],
    [ABI.INVALID_EVENT, InvalidAbiEventError],
    [ABI.INVALID_DATA_TO_DECODE, InvalidAbiDataToDecodeError],
    [ABI.INVALID_DATA_TO_ENCODE, InvalidAbiDataToEncodeError],
    [ABI.INVALID_FORMAT_TYPE, InvalidAbiFormatTypeError],
    [ABI.INVALID_FUNCTION, InvalidAbiFunctionError],
    [RLP.INVALID_RLP, InvalidRLPError],
    [DATA.INVALID_DATA_TYPE, InvalidDataTypeError]
]);

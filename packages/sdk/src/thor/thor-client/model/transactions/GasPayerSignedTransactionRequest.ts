import {
    TransactionRequest,
    type TransactionRequestParam
} from './TransactionRequest';
import type { Address } from '@common';

interface GasPayerSignedTransactionRequestParam
    extends TransactionRequestParam {
    /**
     * The address of the sponsor delegated to pay the gas to execute the transaction request.
     */
    gasPayer: Address;

    /**
     * The signature of the sponsor delegated to pay the gas to execute the transaction request.
     */
    gasPayerSignature: Uint8Array;
}

class GasPayerSignedTransactionRequest
    extends TransactionRequest
    implements GasPayerSignedTransactionRequestParam
{
    /**
     * The address of the sponsor delegated to pay the gas to execute the transaction request.
     */
    gasPayer: Address;

    /**
     * The signature of the sponsor delegated to pay the gas to execute the transaction request.
     */
    gasPayerSignature: Uint8Array;

    public constructor(params: GasPayerSignedTransactionRequestParam) {
        super(params);
        this.gasPayer = params.gasPayer;
        // Defensive copies to avoid external mutation.
        this.gasPayerSignature = new Uint8Array(params.gasPayerSignature);
    }

    /**
     * Checks if the transaction request is signed.
     *
     * @return {boolean} `true`, because a `SignedTransactionRequest` instance has a signature.
     */
    public isSigned(): boolean {
        return true;
    }
}

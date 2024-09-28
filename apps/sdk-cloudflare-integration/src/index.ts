import {
    Address,
    Clause,
    networkInfo,
    Secp256k1,
    TransactionHandler,
    TransactionUtils,
    VET
} from '@vechain/sdk-core';

export default {
    async fetch(): Promise<Response> {
        const clauses = [
            Clause.transferVET(
                Address.of('0x7567d83b7b8d80addcb281a71d54fc7b3364ffed'),
                VET.of(0)
            )
        ];

        // 2 - Calculate intrinsic gas of clauses
        const gas = TransactionUtils.intrinsicGas(clauses);

        // 3 - Body of transaction
        const body = {
            chainTag: networkInfo.mainnet.chainTag,
            blockRef: '0x0000000000000000',
            expiration: 0,
            clauses,
            gasPriceCoef: 128,
            gas,
            dependsOn: null,
            nonce: 12345678
        };

        // Create private key
        const privateKey = await Secp256k1.generatePrivateKey();

        // 4 - Sign transaction
        const signedTransaction = TransactionHandler.sign(body, privateKey);

        // 5 - Encode transaction
        const encodedRaw = signedTransaction.encoded;

        // 6 - Decode transaction
        const decodedTx = TransactionHandler.decode(encodedRaw, true);
        return new Response(JSON.stringify(decodedTx));
    }
};

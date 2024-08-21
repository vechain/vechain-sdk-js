import {
    clauseBuilder,
    networkInfo,
    secp256k1,
    TransactionHandler,
    TransactionUtils
} from '@vechain/sdk-core';

export default {
    async fetch(): Promise<Response> {
        const clauses = [
            clauseBuilder.transferVET(
                '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed',
                0
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
        const privateKey = await secp256k1.generatePrivateKey();

        // 4 - Sign transaction
        const signedTransaction = TransactionHandler.sign(
            body,
            Buffer.from(privateKey)
        );

        // 5 - Encode transaction
        const encodedRaw = signedTransaction.encoded;

        // 6 - Decode transaction
        const decodedTx = TransactionHandler.decode(encodedRaw, true);
        return new Response(JSON.stringify(decodedTx));
    }
};

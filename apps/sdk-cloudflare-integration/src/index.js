"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sdk_core_1 = require("@vechain/sdk-core");
exports.default = {
    async fetch() {
        const clauses = [
            sdk_core_1.Clause.transferVET(sdk_core_1.Address.of('0x7567d83b7b8d80addcb281a71d54fc7b3364ffed'), sdk_core_1.VET.of(0))
        ];
        // 2 - Calculate intrinsic gas of clauses
        const gas = sdk_core_1.HexUInt.of(sdk_core_1.Transaction.intrinsicGas(clauses).wei).toString();
        // 3 - Body of transaction
        const body = {
            chainTag: sdk_core_1.networkInfo.mainnet.chainTag,
            blockRef: '0x0000000000000000',
            expiration: 0,
            clauses,
            gasPriceCoef: 128,
            gas,
            dependsOn: null,
            nonce: 12345678
        };
        // Create private key
        const privateKey = await sdk_core_1.Secp256k1.generatePrivateKey();
        // 4 - Sign transaction
        const signedTransaction = sdk_core_1.Transaction.of(body).sign(privateKey);
        // 5 - Encode transaction
        const encodedRaw = signedTransaction.encoded;
        // 6 - Decode transaction
        const decodedTx = sdk_core_1.Transaction.decode(encodedRaw, true);
        return new Response(JSON.stringify(decodedTx));
    }
};

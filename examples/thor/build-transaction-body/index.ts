import {
    Hex,
    HexUInt,
    log,
    LoggerRegistry,
    PrettyLogger
} from '@vechain/sdk-temp/common';
import {
    ClauseBuilder,
    PrivateKeySigner,
    ThorClient,
    ThorNetworks,
    TransactionRequest
} from '@vechain/sdk-temp/thor';

LoggerRegistry.getInstance().registerLogger(new PrettyLogger());

const thorClient = ThorClient.at(ThorNetworks.TESTNET);

const PRIVATE_KEY = HexUInt.of(
    'f9fc826b63a35413541d92d2bfb6661128cd5075fcdca583446d20c59994ba26'
).bytes;

const signer = new PrivateKeySigner(PRIVATE_KEY);
const recipient = signer.address;

const clauses = [
    ClauseBuilder.transferVET(recipient, 1_000_000_000_000_000n, {
        comment: 'buildTransactionBody example'
    })
];

const legacyTemplateRequest = TransactionRequest.of({
    clauses,
    gas: 21000n,
    gasPriceCoef: 0n,
    nonce: 0n,
    blockRef: Hex.of('0x0000000000000000'),
    chainTag: 0x27,
    dependsOn: null,
    expiration: 720
});

log.info({
    message: 'Legacy template metadata',
    // Expected output: blockRef 0x000..., expiration 720, chainTag 39 (0x27)
    context: {
        blockRef: legacyTemplateRequest.blockRef.toString(),
        expiration: legacyTemplateRequest.expiration,
        chainTag: legacyTemplateRequest.chainTag
    }
});

const builtRequest = await thorClient.transactions.buildTransactionBody(
    clauses,
    21000n,
    {
        gasPriceCoef: 0n
    }
);

log.info({
    message: 'Builder-generated metadata',
    // Expected output: blockRef prefix from latest block, expiration ≈32, same chainTag 39
    context: {
        blockRef: builtRequest.blockRef.toString(),
        expiration: builtRequest.expiration,
        chainTag: builtRequest.chainTag
    }
});

const signed = signer.sign(builtRequest);
const transactionId = await thorClient.transactions.sendRawTransaction(
    signed.encoded
);

// Should print a real transaction hash, confirming the builder path worked end-to-end.
console.log('Transaction sent with id:', transactionId.toString());

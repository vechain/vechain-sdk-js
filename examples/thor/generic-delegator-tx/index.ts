import { Address, Hex, Revision } from '@vechain/sdk-temp/common';
import {
    ThorClient,
    PrivateKeySigner,
    ClauseBuilder,
    TransactionBuilder,
    TransactionRequest,
    TransactionRequestRLPCodec,
    ThorNetworks
} from '@vechain/sdk-temp/thor';
import { HexUInt } from '@vechain/sdk-temp/common';

// Sender account with private key
const senderAccount = {
    privateKey: HexUInt.of(
        'f9fc826b63a35413541d92d2bfb6661128cd5075fcdca583446d20c59994ba26'
    ).bytes,
    address: Address.of('0x7a28e7361fd10f4f058f9fefc77544349ecff5d6')
};

// change accordingly to the network you are using and the token you want to pay with
const NETWORK: 'mainnet' | 'testnet' | 'solo' = 'testnet';
const TOKEN: 'vet' | 'b3tr' = 'b3tr';
const delegatorBaseUrl = `https://${NETWORK}.delegator.vechain.org/`;

async function main(): Promise<void> {
    const thorClient = ThorClient.at(
        NETWORK === 'mainnet'
            ? ThorNetworks.MAINNET
            : NETWORK === 'testnet'
                ? ThorNetworks.TESTNET
                : 'http://localhost:8669/'
    );
    console.log('NETWORK', NETWORK);
    console.log('PAYING WITH', TOKEN);
    const signer = new PrivateKeySigner(senderAccount.privateKey);

    const clauses = [
        ClauseBuilder.transferVET(
            Address.of('0x000000000000000000000000000000000000dEaD'),
            0n
        )
    ];

    // Build the transaction with fee delegation
    const txBuilder = TransactionBuilder.create(thorClient);
    const txRequest = await txBuilder
        .withClauses(clauses)
        .withDelegatedFee()
        .withEstimatedGas(senderAccount.address, { revision: Revision.BEST })
        .build();

    // Request the generic delegator to pay with the selected token (VET or B3TR)
    const delegatorUrl = `${delegatorBaseUrl}api/v1/sign/transaction/${TOKEN}`;
    const delegatorResponse = await fetch(delegatorUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            raw: txRequest.encoded.toString(),
            origin: senderAccount.address.toString()
        })
    });

    if (!delegatorResponse.ok) {
        console.error(
            'Delegator service error:',
            await delegatorResponse.text()
        );
        return;
    }

    const delegatorData = (await delegatorResponse.json()) as {
        signature: string;
        address: string;
        raw: string;
    };

    console.log('Delegator address:', delegatorData.address);

    // Decode the delegator's raw transaction (has payment clause added)
    const rawHex = delegatorData.raw.startsWith('0x')
        ? delegatorData.raw.slice(2)
        : delegatorData.raw;
    const delegatorTx = TransactionRequestRLPCodec.decode(
        HexUInt.of(rawHex).bytes
    );

    // Sign the delegator's transaction as the origin
    const originSignedTx = signer.sign(delegatorTx);
    const originSig = originSignedTx.signature ?? new Uint8Array();

    // Combine origin signature with delegator signature
    const delegatorSig = Hex.of(delegatorData.signature).bytes;
    const combinedSignature = new Uint8Array(
        originSig.length + delegatorSig.length
    );
    combinedSignature.set(originSig, 0);
    combinedSignature.set(delegatorSig, originSig.length);

    // Create fully signed transaction using delegator's transaction body
    const fullySigned = TransactionRequest.of(delegatorTx, combinedSignature);
    const txId = await thorClient.transactions.sendTransaction(fullySigned);
    console.log('Transaction id:', txId.toString());

    // Wait for receipt
    const receipt =
        await thorClient.transactions.waitForTransactionReceipt(txId);
    if (receipt) {
        console.log('Transaction confirmed!');
        console.log('Block number:', receipt.meta?.blockNumber);
        console.log('Reverted:', receipt.reverted);
    }
}

main().catch((error) => {
    console.error('Example failed:', error);
    process.exitCode = 1;
});

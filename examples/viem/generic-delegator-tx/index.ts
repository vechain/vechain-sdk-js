import { Address, Hex, Revision } from '@vechain/sdk-temp/common';
import {
    ClauseBuilder,
    ThorClient,
    ThorNetworks,
    TransactionBuilder,
    TransactionRequest,
    TransactionRequestRLPCodec
} from '@vechain/sdk-temp/thor';
import {
    createPublicClient,
    createWalletClient,
    privateKeyToAccount
} from '@vechain/sdk-temp/viem';

const senderAccount = {
    privateKey: Hex.of(
        '0xf9fc826b63a35413541d92d2bfb6661128cd5075fcdca583446d20c59994ba26'
    ),
    address: Address.of('0x7a28e7361fd10f4f058f9fefc77544349ecff5d6')
};

const NETWORK: 'mainnet' | 'testnet' | 'solo' = 'testnet';
const TOKEN: 'vet' | 'b3tr' = 'b3tr';
const delegatorBaseUrl = `https://${NETWORK}.delegator.vechain.org/`;

async function main(): Promise<void> {
    const network =
        NETWORK === 'mainnet' ? ThorNetworks.MAINNET : ThorNetworks.TESTNET;

    const publicClient = createPublicClient({ network });
    const walletClient = createWalletClient({
        network,
        account: privateKeyToAccount(senderAccount.privateKey)
    });
    const thorClient = ThorClient.at(network);

    console.log('NETWORK', NETWORK);
    console.log('PAYING WITH', TOKEN);

    const clauses = [
        ClauseBuilder.transferVET(
            Address.of('0x000000000000000000000000000000000000dEaD'),
            0n
        )
    ];

    const txBuilder = TransactionBuilder.create(thorClient);
    const txRequest = await txBuilder
        .withClauses(clauses)
        .withDelegatedFee()
        .withEstimatedGas(senderAccount.address, { revision: Revision.BEST })
        .build();

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

    const rawHex = delegatorData.raw.startsWith('0x')
        ? delegatorData.raw.slice(2)
        : delegatorData.raw;
    const delegatorTx = TransactionRequestRLPCodec.decode(Hex.of(rawHex).bytes);

    // Sign as origin (sender)
    const originSignedHex = await walletClient.signTransaction(delegatorTx);
    const originSignedTx = TransactionRequest.decode(originSignedHex);
    const originSig = originSignedTx.signature ?? new Uint8Array();

    // Combine delegator signature with origin signature
    const delegatorSig = Hex.of(delegatorData.signature).bytes;
    const combinedSignature = new Uint8Array(
        originSig.length + delegatorSig.length
    );
    combinedSignature.set(originSig, 0);
    combinedSignature.set(delegatorSig, originSig.length);

    const fullySigned = TransactionRequest.of(delegatorTx, { signature: combinedSignature });

    const txId = await walletClient.sendRawTransaction(fullySigned.encoded);
    console.log('Transaction id:', txId.toString());

    const receipt = await publicClient.waitForTransactionReceipt(txId);
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

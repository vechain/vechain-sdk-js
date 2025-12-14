import { Address, Hex, Revision, Secp256k1 } from '@vechain/sdk-temp/common';
import {
    ClauseBuilder,
    ThorClient,
    ThorNetworks,
    TransactionBuilder,
    TransactionRequest
} from '@vechain/sdk-temp/thor';
import {
    createPublicClient,
    createWalletClient,
    privateKeyToAccount
} from '@vechain/sdk-temp/viem';

const network = ThorNetworks.TESTNET;
const publicClient = createPublicClient({ network });

const privateKey = await Secp256k1.generatePrivateKey();
const account = privateKeyToAccount(Hex.of(privateKey));
const walletClient = createWalletClient({ network, account });
const thorClient = ThorClient.at(network);

console.log('Address:', account.address.toString());

const contractAddress = '0x8384738c995d49c5b692560ae688fc8b51af1059';

const incrementAbi = {
    name: 'increment',
    inputs: [],
    outputs: [],
    type: 'function',
    stateMutability: 'nonpayable'
} as const;

const clause = ClauseBuilder.callFunction(
    Address.of(contractAddress),
    [incrementAbi],
    'increment',
    [],
    0n
);

const txBuilder = TransactionBuilder.create(thorClient);
const txRequest = await txBuilder
    .withClauses([clause])
    .withDelegatedFee()
    .withLegacyTxDefaults()
    .withEstimatedGas(account.address, { revision: Revision.BEST })
    .build();

const originSignedHex = await walletClient.signTransaction(txRequest);
const originSignedTx = TransactionRequest.decode(originSignedHex);

const sponsorUrl = 'https://sponsor-testnet.vechain.energy/by/441';
const sponsorResponse = await fetch(sponsorUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        raw: txRequest.encoded.toString(),
        origin: account.address.toString()
    })
});

if (sponsorResponse.ok) {
    const sponsorData = (await sponsorResponse.json()) as {
        signature: string;
        address: string;
    };
    console.log('Sponsor address:', sponsorData.address);

    const senderSig = originSignedTx.signature ?? new Uint8Array();
    const sponsorSig = Hex.of(sponsorData.signature).bytes;
    const combinedSignature = new Uint8Array(
        senderSig.length + sponsorSig.length
    );
    combinedSignature.set(senderSig, 0);
    combinedSignature.set(sponsorSig, senderSig.length);

    const fullySigned = TransactionRequest.of(txRequest, combinedSignature);
    const txId = await walletClient.sendTransaction(fullySigned);
    console.log('Transaction id:', txId.toString());

    const receipt = await publicClient.waitForTransactionReceipt(txId);
    console.log('Receipt:', receipt);
} else {
    console.error('Sponsor service error:', await sponsorResponse.text());
}

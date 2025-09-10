import { describe } from '@jest/globals';
import {
    Address,
    BlockRef,
    FetchHttpClient,
    Quantity,
    Revision
} from '@common';
import {
    RetrieveExpandedBlock,
    type SignedTransactionRequest,
    SOLO_NETWORK,
    ThorNetworks
} from '@thor';
import { createWalletClient } from '@viem';
import { privateKeyToAccount } from 'viem/accounts';
import { TEST_ACCOUNTS } from '../../fixture';
import { RLPCodec } from '@thor/thorest/signer';
import { mockHttpClient } from '../../MockHttpClient';

const { TRANSACTION_SENDER, TRANSACTION_RECEIVER } = TEST_ACCOUNTS.TRANSACTION;

describe('VIEM WALLET CLIENT DEMO', () => {
    test('SOLO DEMO', async () => {
        // 1. Create the transport layer to THOR: JS Fetch HTTP Client
        const transport = FetchHttpClient.at(new URL(ThorNetworks.SOLONET));

        // 2. Create the transaction's origin account (the signer authority) and wallet.
        const originAccount = privateKeyToAccount(
            `0x${TRANSACTION_SENDER.privateKey}`
        );
        const originWallet = createWalletClient({
            network: transport.baseURL,
            account: originAccount
        });

        // 3. Create the transaction's gas-payer account (the signer authority) and wallet.
        const gasPayerAccount = privateKeyToAccount(
            `0x${TRANSACTION_RECEIVER.privateKey}`
        );
        const gasPayerWallet = createWalletClient({
            network: transport.baseURL,
            account: gasPayerAccount
        });

        // 4. Get the latest block from the Thor network.
        const latestBlock = (
            await RetrieveExpandedBlock.of(Revision.BEST).askTo(transport)
        ).response;
        if (latestBlock === undefined || latestBlock === null)
            throw new Error(
                'Failed to retrieve latest block from Thor network.'
            );

        // 5. Prepare the transaction request.
        const transactionRequest = originWallet.prepareTransactionRequest({
            to: Address.of(TRANSACTION_RECEIVER.address),
            value: Quantity.of(1000),
            blockRef: BlockRef.of(latestBlock.id),
            chainTag: SOLO_NETWORK.chainTag,
            expiration: 32,
            gas: 21000,
            nonce: 5,
            gasPriceCoef: 0,
            isIntendedToBeSponsored: true
        });

        // 6. The transaction's origin/sender signs the transaction request.
        // VIEM specifications require signing methods return a hex expression
        // of transaction RLP encoded.
        // `RLPCodec.decode` is used to decode the hex expression
        // into a SignedTransactionRequest.
        const signedTransactionRequest = RLPCodec.decode(
            (await originWallet.signTransaction(transactionRequest)).bytes
        ) as SignedTransactionRequest;

        // 7. The transaction's gas-payer signs and sends the signed transaction request.'
        const transactionId = await gasPayerWallet.sendTransaction(
            signedTransactionRequest
        );

        // 8. Print the transaction ID.
        console.log(transactionId.toString());
    });

    test('UNIT DEMO', async () => {
        // 0. Mock best block and THOR URL.
        const mockBlockRef = BlockRef.of('0x1234567890abcdef');
        const mockUrl = new URL('https://mock-url');

        // 1. Mock the transport layer to THOR.
        const transport = mockHttpClient(
            {
                id: '0x712c8e7985d53c36a2acafacc45b3cb225a03dd9fd7d764dd92c49b8b751de65'
            },
            'post'
        );

        // 2. Create the transaction's origin account (the signer authority) and wallet.
        const originAccount = privateKeyToAccount(
            `0x${TRANSACTION_SENDER.privateKey}`
        );
        const originWallet = createWalletClient({
            network: mockUrl,
            transport,
            account: originAccount
        });

        // 3. Create the transaction's gas-payer account (the signer authority) and wallet.
        const gasPayerAccount = privateKeyToAccount(
            `0x${TRANSACTION_RECEIVER.privateKey}`
        );
        const gasPayerWallet = createWalletClient({
            network: mockUrl,
            transport,
            account: gasPayerAccount
        });

        // 5. Prepare the transaction request.
        const transactionRequest = originWallet.prepareTransactionRequest({
            to: Address.of(TRANSACTION_RECEIVER.address),
            value: Quantity.of(1000),
            blockRef: mockBlockRef,
            chainTag: SOLO_NETWORK.chainTag,
            expiration: 32,
            gas: 21000,
            nonce: 5,
            gasPriceCoef: 0,
            isIntendedToBeSponsored: true
        });

        // 6. The transaction's origin/sender signs the transaction request.
        // VIEM specifications require signing methods return a hex expression
        // of transaction RLP encoded.
        // `RLPCodec.decode` is used to decode the hex expression
        // into a SignedTransactionRequest.
        const signedTransactionRequest = RLPCodec.decode(
            (await originWallet.signTransaction(transactionRequest)).bytes
        ) as SignedTransactionRequest;

        // 7. The transaction's gas-payer signs and sends the signed transaction request.'
        const transactionId = await gasPayerWallet.sendTransaction(
            signedTransactionRequest
        );

        // 8. Print the transaction ID.
        console.log(transactionId.toString());
    });
});

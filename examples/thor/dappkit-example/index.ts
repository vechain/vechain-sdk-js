import { DAppKitUI, friendlyAddress } from '@vechain/dapp-kit-ui';
import { Address, Revision } from '@vechain/sdk-temp/common';
import { ClauseBuilder, ThorClient, ThorNetworks, TransactionBuilder, TransactionRequest } from '@vechain/sdk-temp/thor';
import type { TransactionRequestInput } from '@vechain/sdk-network';

// Inject the demo card layout directly into the #app container.
document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
    <div class="container">
        <div class="logo-pill" aria-hidden="true">⚡️</div>
        <h2>SDK DAppKit Example</h2>
        <p class="subtitle">Connect wallets, sign data, and send TXs.</p>
        <div class="label">Kit button</div>
        <vdk-button></vdk-button>
        <div class="label">Custom button</div>
        <button class="cta" id="custom-button">Connect Custom Button</button>
        <div class="label">Transaction</div>
        <button class="secondary" id="send-tx">Send Transaction</button>
        <div class="label">Typed data</div>
        <button class="secondary" id="sign-typed-data-button">Sign Typed Data</button>
    </div>
`;

// WalletConnect metadata that identifies this sample dApp.
const walletConnectOptions = {
    projectId: 'a0b855ceaf109dbc8426479a4c3d38d8',
    metadata: {
        name: 'Sample VeChain dApp',
        description: 'A sample VeChain dApp',
        url: window.location.origin,
        icons: [`${window.location.origin}/images/logo/my-dapp.png`],
    },
};

// Initialize DAppKit to talk to VeChain testnet with persistence enabled.
DAppKitUI.configure({
    node: 'https://testnet.vechain.org/',
    walletConnectOptions,
    usePersistence: true,
});

// Custom connect/disconnect button that reflects wallet state.
const customButton = document.getElementById('custom-button');

if (customButton) {
    customButton.addEventListener('click', () => {
        DAppKitUI.modal.open();
    });

    // Re-render the custom button label using connected info.
    const render = () => {
        const address = DAppKitUI.wallet.state.address;
        const accountDomain = DAppKitUI.wallet.state.accountDomain;
        const isAccountDomainLoading =
            DAppKitUI.wallet.state.isAccountDomainLoading;

        const addressOrDomain =
            accountDomain && !isAccountDomainLoading
                ? accountDomain
                : friendlyAddress(address || '');

        if (address) {
            customButton.innerText = `Disconnect from ${addressOrDomain}`;
        } else {
            customButton.innerText = 'Connect Custom Button';
        }
    };

    render();

    DAppKitUI.modal.onConnectionStatusChange(render);
    DAppKitUI.wallet.subscribeToKey('address', render);
    DAppKitUI.wallet.subscribeToKey('accountDomain', render);
    DAppKitUI.wallet.subscribeToKey('isAccountDomainLoading', render);
}

// Create a transaction request for a simple VET transfer
// No need to estimate gas, it will be done by veworld wallet when sending the transaction
async function createTransactionRequest(): Promise<TransactionRequest> {
    const thorClient = ThorClient.at(ThorNetworks.TESTNET);
    const builder = TransactionBuilder.create(thorClient);
    const clauses = ClauseBuilder.transferVET(Address.of('0xf077b491b355E64048cE21E3A6Fc4751eEeA77fa'), 1n);
    const txRequest = await builder
        .withClauses([clauses])
        .withDynFeeTxDefaults()
        .build();
    return txRequest;
}

// Converts a TransactionRequest to a TransactionRequestInput for dappkit compatibility
const toTransactionRequestInput = (request: TransactionRequest): TransactionRequestInput => {
    // convert to primitive types
    const json = request.toJSON();
    // return a TransactionRequestInput
    return {
      chainTag: json.chainTag,
      blockRef: json.blockRef,
      expiration: json.expiration,
      gas: Number(json.gas),
      gasPriceCoef: json.gasPriceCoef !== undefined ? Number(json.gasPriceCoef) : undefined,
      maxFeePerGas: json.maxFeePerGas?.toString(),
      maxPriorityFeePerGas: json.maxPriorityFeePerGas?.toString(),
      nonce: json.nonce,
      dependsOn: json.dependsOn ?? undefined,
      clauses: json.clauses.map((clause) => ({
        to: clause.to,
        value: clause.value,
        data: clause.data ?? '0x',
      })),
    };
};

// Button that triggers a simple VET transfer.
const sendTxButton = document.getElementById('send-tx');
if (sendTxButton) {
    sendTxButton.addEventListener('click', async () => {
        const txRequest = await createTransactionRequest();
        DAppKitUI.signer?.sendTransaction(toTransactionRequestInput(txRequest));
    });
}

// Button that asks the wallet to sign typed data payload.
const signTypedDataButton = document.getElementById('sign-typed-data-button');
if (signTypedDataButton) {
    signTypedDataButton.addEventListener('click', () => {
        DAppKitUI.signer?.signTypedData(
            {
                name: 'Test Data',
                version: '1',
                chainId: 1,
                verifyingContract: '0x435933c8064b4Ae76bE665428e0307eF2cCFBD68',
            },
            { test: [{ name: 'test', type: 'address' }] },
            { test: '0x435933c8064b4Ae76bE665428e0307eF2cCFBD68' },
        );
    });
}
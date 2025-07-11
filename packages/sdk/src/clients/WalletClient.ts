import * as nc_utils from '@noble/curves/abstract/utils';
import { type Account } from 'viem';
import { type ThorNetworks, Transaction } from '@thor';
import { Address, type Hex, HexUInt } from '@vcdm';
import { UnsupportedOperationError } from '@errors';

const FQP = 'packages/sdk/src/clients/WalletClient.ts!';

function createWalletClient(parameters: WalletClientConfig): WalletClient {
    return new WalletClient(parameters.chain, parameters.account ?? null);
}

class WalletClient {
    private readonly account: Account | null;

    constructor(httpClient: ThorNetworks, account: Account | null) {
        // super(httpClient);
        this.account = account;
    }

    /**
     * Returns a list of account addresses owned by the wallet or client.
     *
     * @see https://viem.sh/docs/actions/wallet/getAddresses
     */
    public getAddresses(): Address[] {
        return this.account != null ? [Address.of(this.account.address)] : [];
    }

    private static async signHash(
        hash: Uint8Array,
        account: Account
    ): Promise<Uint8Array> {
        if (account.sign !== undefined) {
            const viemSignature = HexUInt.of(
                await account.sign({
                    hash: `0x${HexUInt.of(hash).digits}`
                })
            ).bytes;
            const r = nc_utils.bytesToNumberBE(viemSignature.slice(0, 32));
            const s = nc_utils.bytesToNumberBE(viemSignature.slice(32, 64));
            const v =
                nc_utils.bytesToNumberBE(viemSignature.slice(64, 65)) - 27n;
            return nc_utils.concatBytes(
                nc_utils.numberToBytesBE(r, 32),
                nc_utils.numberToBytesBE(s, 32),
                nc_utils.numberToVarBytesBE(v)
            );
        }
        throw new UnsupportedOperationError(
            `${FQP}WalletClient.sign(hash: Hex, signer: Account): Uint8Array`,
            'account cannot sign',
            {
                account: `${account.address}`
            }
        );
    }

    public async signTransaction(tx: Transaction): Promise<Hex> {
        if (this.account !== null) {
            const txHash = tx.getTransactionHash().bytes;
            const signature = await WalletClient.signHash(txHash, this.account);
            return HexUInt.of(Transaction.of(tx.body, signature).encode(true));
        }
        throw new UnsupportedOperationError(
            `${FQP}WalletClient.signTransaction(encodedTx: Hex): Hex`,
            'account is not set'
        );
    }
}

interface WalletClientConfig {
    chain: ThorNetworks;
    account?: Account;
}

export { createWalletClient, WalletClient, type WalletClientConfig };

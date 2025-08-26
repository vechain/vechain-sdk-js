import { ThorClient, THOR_SOLO_URL } from '@vechain/sdk-network';
import {
    Transaction,
    Address,
    HDKey,
    networkInfo,
    Token,
    Units,
    TransactionClause
} from '@vechain/sdk-core';
import { ETHTest } from '../utils/index.js';

const thor = ThorClient.at(THOR_SOLO_URL);

// Full transaction fee estimation and sending example
// 1. Derive account from mnemonic
const mnemonic =
    'denial kitchen pet squirrel other broom bar gas better priority spoil cross';
const child = HDKey.fromMnemonic(mnemonic.split(' ')).deriveChild(0);
const privateKey = child.privateKey;
const address = Address.ofPublicKey(child.publicKey).toString();

const token = new ETHTest(1n, Units.wei);

// 2. Create transaction clauses
const clause = [
    {
        to: token.tokenAddress.toString().toLowerCase(),
        value: `0x0`,
        data: `0xa9059cbb000000000000000000000000${Address.of(
            '0x051815fdc271780de69dd8959329b27d6604469e'
        )
            .toString()
            .toLowerCase()
            .slice(
                2
            )}0000000000000000000000000000000000000000000000000000000000000001`,
        comment: 'Transfer EthTest'
    }
] satisfies TransactionClause[];

// START_SNIPPET: FeeEstimationSnippet
// 3. Estimate gas and get default body options
const gasResult = await thor.gas.estimateGas(clause, address);
const defaultBodyOptions = await thor.transactions.fillDefaultBodyOptions();

// 4. Build transaction body with explicit values
const txBody = await thor.transactions.buildTransactionBody(
    clause,
    gasResult.totalGas,
    {
        chainTag: networkInfo.solo.chainTag,
        blockRef: '0x0000000000000000',
        expiration: 32,
        gasPriceCoef: 128,
        dependsOn: null,
        nonce: 12345678,
        ...defaultBodyOptions
    }
);

// 5. Sign transaction
const txClass = Transaction.of(txBody);
const txSigned = txClass.sign(privateKey);
const encodedTx = '0x' + Buffer.from(txSigned.encoded).toString('hex');

// 6. Send transaction and wait for receipt
const txId = (await thor.transactions.sendRawTransaction(encodedTx)).id;
const receipt = await thor.transactions.waitForTransaction(txId);
// END_SNIPPET: FeeEstimationSnippet

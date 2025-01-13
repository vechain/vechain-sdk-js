import { describe, test } from '@jest/globals';
import {
    Address,
    Clause,
    HexUInt,
    networkInfo,
    Transaction,
    type TransactionBody,
    VET
} from '../../../../core/src';
import { TESTNET_URL, ThorClient } from '../../../../network/src';

describe('Testnet Experiments', () => {
    const thorClient = ThorClient.at(TESTNET_URL + '/', {
        isPollingEnabled: false
    });
    const sender = {
        privateKey: HexUInt.of(
            'f9fc826b63a35413541d92d2bfb6661128cd5075fcdca583446d20c59994ba26'
        ),
        address: Address.of('0x7a28e7361fd10f4f058f9fefc77544349ecff5d6')
    };
    const receiver = {
        address: Address.of('0xb717b660cd51109334bd10b2c168986055f58c1a')
    };
    const gasPayer = {
        privateKey: HexUInt.of(
            '521b7793c6eb27d137b617627c6b85d57c0aa303380e9ca4e30a30302fbc6676'
        ),
        address: Address.of('0x062F167A905C1484DE7e75B88EDC7439f82117DE')
    };
    const OneVET = VET.of(1);
    const clauses = [Clause.transferVET(receiver.address, OneVET)];

    test('Delegated Tx', async () => {
        const latestBlock = await thorClient.blocks.getBestBlockCompressed();
        console.log(latestBlock);
        const gasToPay = await thorClient.transactions.estimateGas(
            clauses,
            gasPayer.address.toString()
        );
        console.log(gasToPay);
        const body: TransactionBody = {
            chainTag: networkInfo.testnet.chainTag,
            blockRef: latestBlock?.id.slice(0, 18) ?? '0x0',
            expiration: 0,
            clauses,
            gasPriceCoef: 0,
            gas: gasToPay.totalGas,
            dependsOn: null,
            // eslint-disable-next-line sonarjs/pseudo-random
            nonce: Math.floor(1000000 * Math.random())
        };
        const tx = Transaction.of(body).signAsSenderAndGasPayer(
            sender.privateKey.bytes,
            gasPayer.privateKey.bytes
        );
        const txResult = await thorClient.transactions.sendRawTransaction(
            HexUInt.of(tx.encoded).toString()
        );
        console.log(txResult);
        const txReceipt = await thorClient.transactions.waitForTransaction(
            tx.id.toString()
        );
        console.log(txReceipt);
    }, 60000);
});

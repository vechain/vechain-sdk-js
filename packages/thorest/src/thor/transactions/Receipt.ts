import { ReceiptOutput, type ReceiptOutputJSON } from './ReceiptOutput';
import { Address, Hex, HexUInt, Units, VTHO } from '@vechain/sdk-core';

class Receipt {
    readonly gasUsed: VTHO;
    readonly gasPayer: Address;
    readonly paid: VTHO;
    readonly reward: VTHO;
    readonly reverted: boolean;
    readonly outputs: ReceiptOutput[];

    constructor(json: ReceiptJSON) {
        this.gasUsed = VTHO.of(json.gasUsed, Units.wei);
        this.gasPayer = Address.of(json.gasPayer);
        this.paid = VTHO.of(Hex.of(json.paid).bi, Units.wei);
        this.reward = VTHO.of(Hex.of(json.reward).bi, Units.wei);
        this.reverted = json.reverted;
        this.outputs = json.outputs.map((output) => new ReceiptOutput(output));
    }

    toJSON(): ReceiptJSON {
        return {
            gasUsed: Number(this.gasUsed.wei),
            gasPayer: this.gasPayer.toString(),
            paid: HexUInt.of(this.paid.wei).toString(),
            reward: HexUInt.of(this.reward.wei).toString(),
            reverted: this.reverted,
            outputs: this.outputs.map((output) => output.toJSON())
        };
    }
}

interface ReceiptJSON {
    gasUsed: number;
    gasPayer: string;
    paid: string;
    reward: string;
    reverted: boolean;
    outputs: ReceiptOutputJSON[];
}

export { Receipt, type ReceiptJSON };

import { toBytes, toRlp } from 'viem';
import { type TransactionRequestJSON } from '@thor/json/TransactionRequestJSON';
import { Hex } from '@vcdm';

class RLPCodec {

    // static encode(obj: TransactionRequestJSON): Uint8Array {
    //     return Hex.of(toRlp(toBytes(obj.chatTag))).bytes;
    // }

}

export { RLPCodec };

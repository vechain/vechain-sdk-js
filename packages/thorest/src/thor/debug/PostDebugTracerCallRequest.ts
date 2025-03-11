import { Tracer, type TracerName } from './TracerName';
import {
    Address,
    type BlockRef,
    Gas,
    HexUInt,
    UInt,
    Units,
    VET,
    VTHO
} from '@vechain/sdk-core';

class PostDebugTracerCallRequest {
    readonly name?: TracerName;
    readonly config?: unknown;
    readonly value: VET;
    readonly data: HexUInt;
    readonly to?: Address;
    readonly gas?: Gas;
    readonly gasPrice?: VTHO;
    readonly caller?: Address;
    readonly provedWork?: string;
    readonly gasPayer?: Address;
    readonly expiration?: UInt;
    readonly blockRef?: BlockRef;

    constructor(json: PostDebugTracerCallRequestJSON) {
        this.name = json.name === undefined ? undefined : Tracer.of(json.name);
        this.config = json.config;
        this.value = VET.of(json.value);
        this.data = HexUInt.of(json.data);
        this.to = json.to === undefined ? undefined : Address.of(json.to);
        this.gas = json.gas === undefined ? undefined : Gas.of(json.gas);
        this.gasPrice =
            json.gasPrice === undefined
                ? undefined
                : VTHO.of(json.gasPrice, Units.wei);
        this.caller =
            json.caller === undefined ? undefined : Address.of(json.caller);
        this.provedWork = json.provedWork;
        this.gasPayer =
            json.gasPayer === undefined ? undefined : Address.of(json.gasPayer);
        this.expiration =
            json.expiration === undefined
                ? undefined
                : UInt.of(json.expiration);
    }

    toJSON(): PostDebugTracerCallRequestJSON {
        return {
            name: this.name?.toString(),
            config: this.config,
            value: HexUInt.of(this.value.wei).toString(),
            data: this.data.toString(),
            to: this.to?.toString(),
            gas: this.gas === undefined ? undefined : this.gas.valueOf(),
            gasPrice:
                this.gasPrice === undefined
                    ? undefined
                    : this.gasPrice.wei?.toString(),
            caller: this.caller?.toString(),
            provedWork: this.provedWork,
            gasPayer: this.gasPayer?.toString(),
            expiration: this.expiration?.valueOf(),
            blockRef: this.blockRef?.toString()
        };
    }
}

interface PostDebugTracerCallRequestJSON {
    name?: string;
    config?: unknown;
    value: string;
    data: string;
    to?: string;
    gas?: number;
    gasPrice?: string;
    caller?: string;
    provedWork?: string;
    gasPayer?: string;
    expiration?: number;
    blockRef?: string;
}

export { PostDebugTracerCallRequest, type PostDebugTracerCallRequestJSON };

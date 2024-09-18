import { type AbiFunction, getAbiItem, type Abi as ViemABI } from 'viem';
import { ABI } from './ABI';

class ABIContract extends ABI {
    private readonly abi: ViemABI;

    constructor(abi: ViemABI) {
        super();
        this.abi = abi;
    }

    public encodeFunctionInput(functionName: string): string {
        const functionAbi: AbiFunction = getAbiItem({
            abi: this.abi,
            name: functionName
        });
        return '';
    }
}

export { ABIContract };

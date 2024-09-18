import { InvalidAbiDataToEncodeOrDecode } from '@vechain/sdk-errors';
import {
    getAbiItem,
    type DecodeFunctionDataReturnType,
    type Abi as ViemABI
} from 'viem';
import { type Hex } from '../Hex';
import { ABI } from './ABI';
import { ABIFunction } from './ABIFunction';
import { type ABIItemType } from './ABIItem';

class ABIContract extends ABI {
    private readonly abi: ViemABI;

    constructor(abi: ViemABI) {
        super();
        this.abi = abi;
    }

    /**
     * Encode function data that can be used to send a transaction.
     * @param {string} functionName The name of the function defined in the ABI.
     * @param {unknown[]} functionData The data to pass to the function.
     * @returns {string} The encoded data that can be used to send a transaction.
     * @throws {InvalidAbiDataToEncodeOrDecode}
     */
    public encodeFunctionInput(
        functionName: string,
        functionData: unknown[]
    ): string {
        try {
            const functionAbiItem = getAbiItem({
                abi: this.abi,
                name: functionName
            });
            const functionAbi = new ABIFunction(functionAbiItem as ABIItemType);

            return functionAbi.encodeData(functionData);
        } catch (error) {
            throw new InvalidAbiDataToEncodeOrDecode(
                'ABIContract.encodeFunctionInput()',
                `Encoding failed: Data format is invalid. Function data does not match the expected format for ABI type encoding.`,
                { functionName, functionData },
                error
            );
        }
    }

    /**
     * Decode the function data of an encoded function
     * @param {string} functionName The name of the function defined in the ABI.
     * @param {Hex} encodedFunctionInput The encoded function data.
     * @returns {DecodeFunctionDataReturnType} an array of the decoded function data
     * @throws {InvalidAbiDataToEncodeOrDecode}
     */
    public decodeFunctionInput(
        functionName: string,
        encodedFunctionInput: Hex
    ): DecodeFunctionDataReturnType {
        try {
            const functionAbiItem = getAbiItem({
                abi: this.abi,
                name: functionName
            });
            const functionAbi = new ABIFunction(functionAbiItem as ABIItemType);

            return functionAbi.decodeData(encodedFunctionInput);
        } catch (error) {
            throw new InvalidAbiDataToEncodeOrDecode(
                'ABIContract.decodeFunctionInput()',
                'Decoding failed: Data must be a valid hex string encoding a compliant ABI type.',
                { functionName, encodedFunctionInput },
                error
            );
        }
    }
}

export { ABIContract };

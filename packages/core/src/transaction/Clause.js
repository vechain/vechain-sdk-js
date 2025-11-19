"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Clause = void 0;
const sdk_errors_1 = require("@vechain/sdk-errors");
const utils_1 = require("../utils");
const network_1 = require("../utils/const/network");
const vcdm_1 = require("../vcdm");
const Hex_1 = require("../vcdm/Hex");
const HexInt_1 = require("../vcdm/HexInt");
/**
 * This class represent a transaction clause.
 *
 * @extends {TransactionClause}
 */
class Clause {
    /**
     * Used internally in {@link Clause.callFunction}.
     */
    static FORMAT_TYPE = 'json';
    /**
     * Used internally to tag a transaction without data.
     */
    static NO_DATA = Hex_1.Hex.PREFIX;
    /**
     * Used internally in {@link Clause.transferNFT} method.
     */
    static TRANSFER_NFT_FUNCTION = 'transferFrom';
    /**
     * Used internally in {@link Clause.transferVTHOToken} method.
     */
    static TRANSFER_TOKEN_FUNCTION = 'transfer';
    /**
     * Represents the address where:
     * - transfer token to, or
     * - invoke contract method on.
     */
    to;
    /**
     * Return the hexadecimal expression of the amount of VET or VTHO
     * token in {@link Units.wei} to transfer to the destination.
     *
     * @see {Clause.callFunction}
     * @see {Clause.transferVTHOToken}
     * @see {Clause.transferVET}
     */
    value;
    /**
     * Return the hexadecimal expression of the encoding of the arguments
     * of the called function of a smart contract.
     */
    data;
    /**
     * An optional comment to describe the purpose of the clause.
     */
    comment;
    /**
     * An optional  Application Binary Interface (ABI) of the called
     * function of a smart contract.
     */
    abi;
    /**
     * Used publicly to tag a transaction not tranferring token amount.
     */
    static NO_VALUE = Hex_1.Hex.PREFIX + '0';
    /**
     * Creates an instance of the class.
     *
     * @param {string|null} to - The address to transfer token
     * or the smart contract to call, can be null.
     * @param {string} value - The token amount being transferred in wei units
     * as hexadecimal expression.
     * @param {string} data - Arguments of the smart contract function called
     * as encoded as a hexadecimal expression
     * @param {string} [comment] - An optional comment.
     * @param {string} [abi] - An optional ABI string.
     */
    constructor(to, value, data, comment, abi) {
        this.to = to;
        this.value = value;
        this.data = data;
        this.comment = comment;
        this.abi = abi;
    }
    /**
     * Return the amount of {@link VET} or {@link VTHO} token
     * in {@link Units.wei} to transfer to the destination.
     *
     * @return {FixedPointNumber} The amount as a fixed-point number.
     */
    amount() {
        return vcdm_1.FixedPointNumber.of(HexInt_1.HexInt.of(this.value).bi);
    }
    /**
     * Return a new clause to call a function of a smart contract.
     *
     * @param {Address} contractAddress - The address of the smart contract.
     * @param {ABIFunction} functionAbi - The ABI definition of the function to be called.
     * @param {unknown[]} args - The arguments for the function.
     * @param {VET} [amount=VET.of(FixedPointNumber.ZERO)] - The amount of VET to be sent with the transaction calling the function.
     * @param {ClauseOptions} [clauseOptions] - Optional clause settings.
     * @return {Clause} A clause object to call the function in a transaction.
     * @throws {InvalidDataType} Throws an error if the amount is not a finite positive value.
     */
    static callFunction(contractAddress, functionAbi, args, amount = vcdm_1.VET.of(vcdm_1.FixedPointNumber.ZERO), clauseOptions) {
        if (amount.value.isFinite() &&
            amount.value.gte(vcdm_1.FixedPointNumber.ZERO)) {
            return new Clause(contractAddress.toString().toLowerCase(), Hex_1.Hex.PREFIX + amount.wei.toString(Hex_1.Hex.RADIX), functionAbi.encodeData(args).toString(), clauseOptions?.comment, clauseOptions?.includeABI === true
                ? functionAbi.format(Clause.FORMAT_TYPE)
                : undefined);
        }
        throw new sdk_errors_1.InvalidDataType('Clause.callFunction', 'not finite positive amount', { amount: `${amount.value}` });
    }
    /**
     * Returns a new clause to deploy a smart contract.
     *
     * @param {HexUInt} contractBytecode - The bytecode of the contract to be deployed.
     * @param {DeployParams} [deployParams] - Optional parameters to pass to the smart contract constructor.
     * @param {ClauseOptions} [clauseOptions] - Optional clause settings.
     * @return {Clause} The clause to deploy the smart contract as part of a transaction.
     */
    static deployContract(contractBytecode, deployParams, clauseOptions) {
        const data = deployParams != null && deployParams !== undefined
            ? contractBytecode.digits +
                vcdm_1.ABI.of(deployParams.types, deployParams.values)
                    .toHex()
                    .toString()
                    .replace(Hex_1.Hex.PREFIX, '')
            : contractBytecode.digits;
        return new Clause(null, clauseOptions?.value ?? Clause.NO_VALUE, Hex_1.Hex.PREFIX + data, clauseOptions?.comment);
    }
    /**
     * Transfers an NFT from the sender to the recipient.
     *
     * @param {Address} contractAddress - The address of the NFT contract.
     * @param {Address} senderAddress - The address of the current owner (sender) of the NFT.
     * @param {Address} recipientAddress - The address of the new owner (recipient) of the NFT.
     * @param {HexUInt} tokenId - The unique identifier of the NFT to be transferred.
     * @param {ClauseOptions} [clauseOptions] - Optional clause settings.
     * @return {Clause} The clause object representing the transfer operation as part of a transaction.
     */
    static transferNFT(contractAddress, senderAddress, recipientAddress, tokenId, clauseOptions) {
        const clause = Clause.callFunction(contractAddress, vcdm_1.ABIContract.ofAbi(utils_1.ERC721_ABI).getFunction(Clause.TRANSFER_NFT_FUNCTION), [
            senderAddress.toString(),
            recipientAddress.toString(),
            tokenId.bi.toString()
        ], undefined, clauseOptions);
        return {
            clause,
            functionAbi: vcdm_1.ABIContract.ofAbi(utils_1.ERC721_ABI).getFunction(Clause.TRANSFER_NFT_FUNCTION)
        };
    }
    /**
     * Return a new clause to transfers the specified amount of VTHO
     *
     * @param {Address} recipientAddress - The address of the recipient.
     * @param {VTHO} amount - The amount of token to be transferred.
     * @return {ContractClause} The contract clause to transfer VTHO tokens as part of a transaction.
     * @throws {InvalidDataType} Throws an error if the amount is not a positive integer.
     *
     * @see VTHO.transferTokenTo
     */
    static transferVTHOToken(recipientAddress, amount) {
        if (amount.value.isFinite() && amount.value.isPositive()) {
            const vthoAddress = vcdm_1.Address.of(network_1.VTHO_ADDRESS);
            const functionAbi = vcdm_1.ABIContract.ofAbi(utils_1.VIP180_ABI).getFunction(Clause.TRANSFER_TOKEN_FUNCTION);
            const clause = Clause.callFunction(vthoAddress, functionAbi, [recipientAddress.toString(), amount.wei], undefined, { comment: 'Transfer VTHO' });
            return {
                clause,
                functionAbi
            };
        }
        throw new sdk_errors_1.InvalidDataType('Clause.transferVTHOToken', 'not positive integer amount', { amount: `${amount.value}` });
    }
    /**
     * Return a new clause to transfer a generic ERC20 Token
     *
     * @param {Address} recipientAddress - The address of the recipient.
     * @param {Token} amount - The amount of token to be transferred.
     * @return {ContractClause} The contract clause to transfer tokens as part of a transaction.
     * @throws {InvalidDataType} Throws an error if the amount is not a positive integer.
     */
    static transferToken(recipientAddress, token) {
        if (token.value >= 0) {
            const tokenValueWei = vcdm_1.Units.convertUnits(vcdm_1.FixedPointNumber.of(token.value), token.units, vcdm_1.Units.wei);
            const clause = Clause.callFunction(token.tokenAddress, vcdm_1.ABIContract.ofAbi(utils_1.VIP180_ABI).getFunction(Clause.TRANSFER_TOKEN_FUNCTION), [recipientAddress.toString(), tokenValueWei], undefined, { comment: `Transfer ${token.name}` });
            return {
                clause,
                functionAbi: vcdm_1.ABIContract.ofAbi(utils_1.VIP180_ABI).getFunction(Clause.TRANSFER_TOKEN_FUNCTION)
            };
        }
        throw new sdk_errors_1.InvalidDataType('Clause.transferToken', 'not positive integer amount', { amount: `${token.value}` });
    }
    /**
     * Return a new clause to transfers VET to a specified recipient address.
     *
     * @param {Address} recipientAddress - The address of the recipient.
     * @param {VET} amount - The amount of VET to transfer.
     * @param {ClauseOptions} [clauseOptions] - Optional clause settings.
     * @return {Clause} - The clause object to transfer VET as part of a transaction.
     * @throws {InvalidDataType} - If the amount is not a finite positive value.
     *
     * @see VET.transferTo
     */
    static transferVET(recipientAddress, amount, clauseOptions) {
        if (amount.value.isFinite() && amount.value.isPositive()) {
            return new Clause(recipientAddress.toString().toLowerCase(), Hex_1.Hex.PREFIX + amount.wei.toString(Hex_1.Hex.RADIX), Clause.NO_DATA, clauseOptions?.comment);
        }
        throw new sdk_errors_1.InvalidDataType('Clause.transferVET', 'not finite positive amount', { amount: `${amount.value}` });
    }
}
exports.Clause = Clause;

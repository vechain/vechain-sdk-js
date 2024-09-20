```mermaid
classDiagram
    class ABI {
        +ABI of(string|AbiParameter[] types,unknown[] values)$
        +ABI ofEncoded(string|AbiParameter[] types,string|Uint8Array[] dataEncoded)$
        +unknown[] parseObjectValues(object obj)
        +ReturnType getFirstDecodedValue<ReturnType>(object obj)
        +Hex toHex()
    }
    class ABIItem {
        <<abstract>>
        +string signatureHash()
        +string format('json' | 'string' formatType)
        +string ofSignature(new (signature: string) => T ABIItemConstructor, string signature)$
    }
    class ABIContract {
        +ABIContract ofAbi(ViemABI abi)$
        +ABIContract ofStringAbi(string abi)$
        +ABIFunction getFunction(string name)
        +ABIEvent getEvent(string name)
        +Hex encodeFunctionInput(string functionName, unknown[] functionData)
        +DecodeFunctionDataReturnType decodeFunctionInput(string functionName, Hex encodedFunctionInput)
        +DecodeFunctionResultReturnType decodeFunctionOutput(string functionName, Hex encodedFunctionOutput)
        +ABIEventData encodeEventLog(string eventName, unknown[] eventArgs)
        +DecodeEventLogReturnType decodeEventLog(string eventName, ABIEventData eventToDecode)
        +DecodeEventLogReturnType parseLog(Hex data, Hex[] topics)
    }
    class ABIFunction {
        +DecodeFunctionDataReturnType decodeData(Hex data)
        +Hex encodeData<TValue>(TValue[] dataToEncode)
        +DecodeFunctionResultReturnType decodeResult(Hex data)
    }
    class ABIEvent {
        +DecodeEventLogReturnType parseLog(ViemABI abi, Hex data, Hex[] topics)$
        +DecodeEventLogReturnType decodeEventLog(ABIEventData event)
        +EncodeEventTopicsReturnType encodeFilterTopics<TValue>(TValue[] event)
        +ABIEventData encodeEventLog<TValue>(TValue[] dataToEncode)
    }
    class Account {
        #address: Address
        #balance: Currency
    }
    class Address {
        +string checksum(HexUInt huint)$
        +boolean isValid(string exp)$
        +Address of(bigint|number|string|Uint8Array|HexUInt exp)$
        +Address ofPrivateKey(Uint8Array privateKey, boolean: isCompressed)$
        +Address ofPublicKey(Uint8Array privateKey)$
    }
    class Blake2b256 {
        +Blake2b256 of(bigint|string|Uint8Array|Hex exp)$
    }
    class BloomFilter {
        +number k
        +number computeBestBitsPerKey(number k)$
        +number computeBestHashFunctionsQuantity(number m)$
        +boolean contains(Hex|Uint8Array key)
        +boolean isJoinable(BloomFilter other)
        +BloomFilter join(BloomFilter other)
        +BloomFilter of(Hex[]|Uint8Array[] ...keys)$
    }
    class Coin
    class Contract
    class Currency {
        +Txt code
        +FPN value
    }
    class FPN {
        +FPN NaN$
        +FPN NEGATIVE_INFINITY$
        +FPN POSITIVE_INFINITY$
        +FPN ZERO$
        +FPN abs()
        +null|number comparedTo(FPN that)
        +FPN div(FPN that)
        +FPN dp(bigint|number decimalPlaces)
        +boolean eq(FPN that)
        +boolean gt(FPN that)
        +boolean gte(FPN that)
        +FPN idiv(FPN that)
        +boolean isFinite()
        +boolean isInfinite()
        +boolean isInteger()
        +boolean isIntegerExpression(string exp)$
        +boolean isNaN()
        +boolean isNaturalExpression(string exp)$
        +boolean isNegative()
        +boolean isNegativeInfinite()
        +boolean isNumberExpression(string exp)$
        +boolean isPositive()
        +boolean isPositiveInfinite()
        +boolean isUnsignedIntegerExpression(string exp)$
        +boolean isZero()
        +boolean lt(FPN that)
        +boolean lte(FPN that)
        +FPN minus(FPN that)
        +FPN modulo(FPN that)
        +FPN negated()
        +FPN of(bigint|number|string exp)$
        +FPN plus(FPN that)
        +FPN pow(FPN that)
        +FPN sqrt()
        +FPN times(FPN that)
    }
    class Hex {
        +Hex abs
        +number sign
        +Hex alignToBytes()
        +Hex fit(number digits)
        +boolean isValid(string exp)$
        +boolean isValid0x(string exp)$
        +Hex of(bigint|number|string|Uint8Array exp)$
        +Hex random(number bytes)$
    }
    class HexInt {
        +HexInt of(bigint|number|string|Uint8Array|Hex exp)$
    }
    class HexUInt {
        +HexUInt of(bigint|number|string|Uint8Array|HexInt exp)$
    }
    class Keccak256 {
        +Keccak256 of(bigint|number|string|Uint8Array|Hex exp)$
    }
    class Mnemonic {
        +Mnemonic of(string exp)$
    }
    class Quantity {
        +Quantity of(bigint|number exp)$
    }
    class Revision {
        +boolean isValid(number|string value)$
        +Revision of(bigint|number|string|Uint8Array|Hex value)$
    }
    class Sha256 {
        +Sha256 of(bigint|number|string|Uint8Array|Hex exp)$
    }
    class String
    class Txt {
        +Txt of(bigint|number|string|Uint8Array exp)$
    }
    class ThorId {
        +boolean isValid0x(string exp)
        +ThorID of(bigint|number|string|Uint8Array|HexInt exp)$
    }
    class Units {
        <<enumeration>>
        +0 wei$
        +3 kwei$
        +6 mwei$
        +9 gwei$
        +12 szabo$
        +15 finney$
        +18 ether$
        +string formatEther(FPN wei)$
        +string formatUnit(FPN wei, Units unit)$
        +FPN parseEther(string: ether)$
        +FPN parseUnit(string exp, Unit unit)$
    }
    class VeChainDataModel {
        <<interface>>
      +bigint bi
      +Uint8Array bytes
      +number n
      +number compareTo(~T~ that)
      +boolean isEqual(~T~ that)
      +boolean isNumber()
    }
    class VET {
        +VET of(FPN value)$
    }
    class VTHO {
        +VTHO of(FPN value)$
    }
    ABI <|-- ABIContract
    ABI <|-- ABIItem
    ABIItem <|-- ABIEvent
    ABIItem <|-- ABIFunction
    Account "1" ..|> "1" Address : has
    Account "1" ..|> "1" Currency : has
    Account <|-- Contract
    Coin <|-- VET
    Coin <|-- VTHO
    Currency <|.. Coin
    FPN <|-- VET
    FPN <|-- VTHO
    Hex <|-- HexInt
    HexInt <|-- HexUInt
    HexUInt <|-- Address
    HexUInt <|-- Blake2b256
    HexUInt <|-- Keccak256
    HexUInt <|-- Quantity
    HexUInt <|-- Sha256
    HexUInt <|-- ThorId
    String <|-- Txt
    Txt <|-- Revision
    Txt <|-- Mnemonic
    VeChainDataModel <|.. ABI
    VeChainDataModel <|.. BloomFilter
    VeChainDataModel <|.. Currency
    VeChainDataModel <|.. FPN
    VeChainDataModel <|.. Hex
    VeChainDataModel <|.. Txt
```

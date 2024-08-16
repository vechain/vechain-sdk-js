```mermaid
classDiagram
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
    class Hash {
        <<interface>>
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
    class Mnemonic
    class Quantity {
        +Quantity of(bigint|number exp)$
    }
    class Sha256 {
        +Sha256 of(bigint|number|string|Uint8Array|Hex exp)$
    }
    class String
    class Txt {
        +Txt of(bigint|number|string|Uint8Array exp)$
    }
    class VeChainDataModel{
        <<interface>>
      +bigint bi
      +Uint8Array bytes
      +number n
      +number compareTo(~T~ that)
      +boolean isEqual(~T~ that)
      +boolean isNumber()
    }
    Hash <|.. Blake2b256
    Hash <|.. Keccak256
    Hash <|.. Sha256
    Hex <|-- HexInt
    HexInt <|-- HexUInt
    HexUInt <|-- Address
    HexUInt <|-- Blake2b256
    HexUInt <|-- Keccak256
    HexUInt <|-- Quantity
    HexUInt <|-- Sha256
    String <|-- Txt
    Txt <|-- Mnemonic
    VeChainDataModel <|.. Hex
    VeChainDataModel <|.. Txt
```

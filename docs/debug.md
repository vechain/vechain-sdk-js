---
description: Thor debug functionalities.
---

# Debug

The [DebugModule](../packages/network/src/thor-client/debug/debug-module.ts) 
class encapsulates functionality to debug the VeChainThor blockchain.

The module provides methods to interact with the debug end points provided by 

* [**Retrieve Storage Range**](#retrieve-storage-range) - https://testnet.vechain.org/doc/swagger-ui/#/Debug/post_debug_storage_range 
* [**Trace Contract Call**](#trace-contract-call) - https://testnet.vechain.org/doc/swagger-ui/#/Debug/post_debug_tracers_call
* [**Trace Transaction Clause**](#trace-transaction-clause) - https://testnet.vechain.org/doc/swagger-ui/#/Debug/post_debug_tracers

## Retrieve Storage Range

The `retrieveStorageRange` method provides information about the storage range of an account, 
including the nextKey which is a string that can be null, and storage which is an object.

In this example the `thorClient` connects to the *testnet* to retrieve the storage range for the coordinates passed
as `input` parameter.

```typescript { name=debug-retrieve-storage-range, category=example }
// 1 - Create thor client for testnet
const thorClient = ThorClient.fromUrl(TESTNET_URL);

// 2 - Retrieve the storage range.
const result = await thorClient.debug.retrieveStorageRange({
    target: {
        blockID:
            '0x010e80e3278e234b8a5d1195c376909456b94d1f7cf3cb7bfab1e8998dbcfa8f',
        transaction: 0,
        clauseIndex: 0
    },
    options: {
        address: '0x0000000000000000000000000000456E65726779',
        keyStart:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
        maxResult: 10
    }
});

// 3 - Print the result.
console.log(result);
```

<details>
<summary>The result will show the storage.</summary>

```json
{
  storage: {
    '0x004f6609cc5d569ecfdbd606d943edc5d83a893186f2942aef5e133e356ed17c': {
      key: '0x9a92ca715ec8529b3ee4dbefd75e142176b92c3d93701808be4e36296718a5f3',
      value: '0x000000000000000000000000000000000000046ff5af2138c51ba45a80000000'
    },
    '0x0065bf3c383c7f05733ee6567e3a1201970bb5f4288d1bdb6d894167f8fc68dd': {
      key: '0xf3dfa1b3c541595cd415aef361e508553fc80af15b3e2e0d9a4e2408f2111ed8',
      value: '0xfffffffffffffffffffffffffffffffffffffffffffffe280bc404dc5470db3e'
    },
    '0x01783f86c9e29f37f3277ed5abb62353ef8baf304337e511f1b5edefc9756b23': {
      key: '0x01cfb1f8b52bdbeb1178ba8fc499479815330143d1acddb9c9d5686cd596ec24',
      value: '0x0000000000000000000000000000000000000010000000000000000000000000'
    },
    '0x0195180093382541d5396e797bd49250b1664fe8db68ff5c1d53ca95046f4549': {
      key: '0x3f4626c77582db20d0d690ce3ad9bfde8f9dd508c0212a187684678bd9dc397a',
      value: '0x000000000000000000000000000000000000000082eed4d8eb7286de6e540000'
    },
    '0x02631b1c9d1e3f1360c4c6ee00ea48161dc85a0e153a0a484429bbcef16e581e': {
      key: '0xc5e3f1ff368ddfee94124549ec19d8a50547b5cb0cc55ba72188b7159fb3ab3f',
      value: '0x00000000000000000000000000000000000000000052b7d2dcc80cd2e4000000'
    },
    '0x038658243306b2d07b512b04e6ddd4d70c49fd93969d71d51b0af7cf779d1c8f': {
      key: '0x87b232cdb2002f97b61df380acf088f13e5006543d63780567aa2b886c6a1a90',
      value: '0x00000000000000000000000000000000000000000052b7cd7100aea580f00000'
    },
    '0x03969104d4e5233e212c939a85ef26b8156e2fbb0485d6d751c677e854e9ba55': {
      key: '0xa887493a2b531915738a065a24263abae3722b9a8928a96c14c1f52a05964f23',
      value: '0x00000000000000000000000000000000000000000000003635c9adc5dea00000'
    },
    '0x04379cd040e82a999f53dba26500b68e4dd783b2039d723fe9e06edecfc8c9f1': {
      key: '0x831ade39167b84e87f89fd4cd0bcec5783d2281fe44d2bc6cb93daaff46d569e',
      value: '0x000000000000000000000000000000000000000000002a1b4ae1206dd9bd0000'
    },
    '0x0465f4b6f9fccdb2ad6f4eac8aa7731bfe4c78f6cf22f397b5ef10398d4d5771': {
      key: '0x5d56afd38de44f293bdce388b7d98120f55971a0f3a608797f1ddaced0f2b047',
      value: '0x00000000000000000000000000000000000000000052b7c8053950781de00000'
    },
    '0x04af8500fb85efaaa5f171ef60708fc306c474011fabb6fbafcb626f09661a01': {
      key: '0x136aee904ebcade77dc8d3c6e48a2365b1d9dff83f78eb90d2f6e5ef4a6466c6',
      value: '0x000000000000000000000000008ca1a3b5cbedeb0f1a0900000080845b322ac0'
    }
  },
  nextKey: '0x04e9569439bd218fce594dbd705b41f2afe6b6d8abcb9c5aaa5b1a52b7ab7cea'
}
```
</details>

## Trace Contract Call

The `traceContractCall` traces the contract call execution.

In this example the `thorClient` connects to the *testnet* to trace the contract at the coordinates specified in
the `input` parameter.

```typescript { name=debug-trace-contract-call, category=example }
// 1 - Create thor client for testnet
const thorClient = ThorClient.fromUrl(TESTNET_URL);

// 2 - Trace the contract call.
const result = await thorClient.debug.traceContractCall(
    {
        contractInput: {
            to: '0x0000000000000000000000000000456E65726779',
            data: '0xa9059cbb0000000000000000000000000000000000000000000000000000456e65726779000000000000000000000000000000000000000000000004563918244f400000',
            value: '0x0'
        },
        transactionOptions: {
            caller: '0x625fCe8dd8E2C05e82e77847F3da06AF6e55A7AF',
            gasPayer: '0x625fCe8dd8E2C05e82e77847F3da06AF6e55A7AF',
            expiration: 18,
            blockRef: '0x0101d05409d55cce'
        },
        config: {}
    },
    null
);

// 3 - Print the result.
console.log(result);
```

<details>
<summary>The result shows the trace, here only the first element is shown.</summary>

```json
{
  gas: 0,
  failed: false,
  returnValue: '0000000000000000000000000000000000000000000000000000000000000001',
  structLogs: [
    {
      pc: 0,
      op: 'PUSH1',
      gas: 50000000,
      gasCost: 3,
      depth: 1,
      stack: []
    }
  ]
}
```
</details>

## Trace Transaction Clause

The `traceTransactionClause` method trace the transactions specified in the clause at the
coordinates expressed in the `input` parameter.

In this example the `thorClient` connects to the *testnet* to trace the clause at the coordinates specified in
the `input` parameter.

```typescript { name=debug-trace-transaction-clause, category=example }
// 1 - Create thor client for testnet
const thorClient = ThorClient.fromUrl(TESTNET_URL);

// 2 - Trace the clause.
const result = await thorClient.debug.traceTransactionClause(
    {
        target: {
            blockID:
                '0x010e80e3278e234b8a5d1195c376909456b94d1f7cf3cb7bfab1e8998dbcfa8f',
            transaction:
                '0x05b31824569f2f2ec64c62c4e6396199f56ae872ff219288eb3293b4a36e7b0f',
            clauseIndex: 0
        },
        config: {}
    },
    'call' as TracerName
);

// 3 - Print the result.
console.log(result);
```

<details>
<summary>The result shows the following.</summary>

```json
{
  from: '0x105199a26b10e55300cb71b46c5b5e867b7df427',
  gas: '0x8b92',
  gasUsed: '0x50fa',
  to: '0xaa854565401724f7061e0c366ca132c87c1e5f60',
  input: '0xf14fcbc800d770b9faa11ba944366f3e7a14c166f780ece542e557e0b7fe4870fcbe8dbe',
  value: '0x0',
  type: 'CALL'
}
```
</details>

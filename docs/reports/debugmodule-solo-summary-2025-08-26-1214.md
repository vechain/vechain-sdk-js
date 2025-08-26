# DebugModule.solo.test.ts – Direct Jest Run Summary (2025-08-26 12:14 +03:00)

## Objective
- Capture and summarize the console output from a direct Jest run of `packages/network/tests/thor-client/debug/DebugModule.solo.test.ts` executed under Yarn v1.22.22, and analyze the failure.

## Yarn Context
- __Yarn version__: 1.22.22
- __Warning observed__: From Yarn 1.0 onwards, scripts don't require "--" for options to be forwarded. In a future version, any explicit "--" will be forwarded as-is to the scripts.

## Command Executed
```bash
rm -rf ./coverageIntegration && \
APPLYCODECOVLIMITS=false jest \
  --coverage \
  --coverageDirectory=coverageIntegration \
  --group=integration \
  --testPathPattern=tests/thor-client/debug/DebugModule.solo.test.ts
```

## Outcome
- __Result__: Requests to Thor endpoints failed with network error `ECONNREFUSED 127.0.0.1:8669` during gas estimation/simulation calls made by the fixture.
- __Symptom__: `TypeError: fetch failed` reported by `SimpleHttpClient.http()` while POSTing to `http://127.0.0.1:8669/accounts/*`.

## Likely Root Cause
- __Thor Solo not running__ on `http://127.0.0.1:8669` at execution time. The Debug fixture attempts to estimate gas by calling `POST /accounts/*` and fails immediately when Solo is down.

## Evidence (excerpt)
```text
[DebugFixture 2025-08-26T09:09:16.351Z] [sendTransactionWithAccount] estimating gas: {
  "from": "0x062f167a905c1484de7e75b88edc7439f82117de"
}
...
⚡ [TRACE] HTTP Request (2025-08-26T09:09:16.367Z)
➡️ {
  "category": "HTTP Request",
  "method": "POST",
  "url": "http://127.0.0.1:8669/accounts/*",
  "requestHeaders": {},
  "requestBody": {
    "clauses": [ { "to": "0x...456e65726779", "data": "0xa9059cbb...", "value": "0" } ],
    "caller": "0x062f167a905c1484de7e75b88edc7439f82117de"
  },
  "timestamp": 1756199356367
}
...
⚡ [TRACE] HTTP Error (2025-08-26T09:09:16.390Z)
❌ POST http://127.0.0.1:8669/accounts/* (23ms)
⛔ Error:
TypeError: fetch failed
  at SimpleHttpClient.http (.../packages/network/src/http/SimpleHttpClient.ts:156:30)
  at TransactionsModule.simulateTransaction (.../transactions-module.ts:708:17)
  at TransactionsModule.estimateGas (.../transactions-module.ts:886:29)
[cause]: Error: connect ECONNREFUSED 127.0.0.1:8669
```

## Full Console Output (provided excerpt)
```text
yarn workspace v1.22.22
warning From Yarn 1.0 onwards, scripts don't require "--" for options to be forwarded. In a future version, any explicit "--" will be forwarded as-is to the scripts.
yarn run v1.22.22
$ rm -rf ./coverageIntegration && APPLYCODECOVLIMITS=false jest --coverage --coverageDirectory=coverageIntegration --group=integration --testPathPattern=tests/thor-client/debug/DebugModule.solo.test.ts
  console.log
    [DebugFixture 2025-08-26T09:09:16.343Z] [sendTransactionWithAccount] start: {
      "account": {
        "address": "0x062f167a905c1484de7e75b88edc7439f82117de"
      }
    }

      at flog (tests/thor-client/debug/fixture-thorest.ts:35:17)

  console.log
    [DebugFixture 2025-08-26T09:09:16.350Z] [sendTransactionWithAccount] transfer1VTHOClause: {
      "to": "0x0000000000000000000000000000456e65726779",
      "value": "0",
      "data": "0xa9059cbb0000000000000000000000009e7911de289c3c856ce7f421034f66b6cde49c390000000000000000000000000000000000000000000000000de0b6b3a7640000"
    }

      at flog (tests/thor-client/debug/fixture-thorest.ts:35:17)

  console.log
    [DebugFixture 2025-08-26T09:09:16.351Z] [sendTransactionWithAccount] estimating gas: {
      "from": "0x062f167a905c1484de7e75b88edc7439f82117de"
    }

      at flog (tests/thor-client/debug/fixture-thorest.ts:35:17)

  console.log

    ⚡ [TRACE] HTTP Request (2025-08-26T09:09:16.367Z)

      at log (src/http/trace-logger.ts:55:13)

  console.log
    ➡️ {
      "category": "HTTP Request",
      "method": "POST",
      "url": "http://127.0.0.1:8669/accounts/*",
      "requestHeaders": {},
      "requestBody": {
        "clauses": [
          { "to": "0x0000000000000000000000000000456e65726779",
            "data": "0xa9059cbb...",
            "value": "0" }
        ],
        "caller": "0x062f167a905c1484de7e75b88edc7439f82117de"
      },
      "timestamp": 1756199356367
    }

      at log (src/http/trace-logger.ts:58:13)

  console.log

    ⚡ [TRACE] HTTP Error (2025-08-26T09:09:16.390Z)

      at log (src/http/trace-logger.ts:158:13)

  console.log
    ❌ POST http://127.0.0.1:8669/accounts/* (23ms)

      at log (src/http/trace-logger.ts:162:13)

  console.log
    ⛔ Error:

      at log (src/http/trace-logger.ts:163:13)

  console.log
    TypeError: fetch failed
        at node:internal/deps/undici/undici:13502:13
        at processTicksAndRejections (node:internal/process/task_queues:95:5)
        at SimpleHttpClient.http (.../packages/network/src/http/SimpleHttpClient.ts:156:30)
        at TransactionsModule.simulateTransaction (.../transactions-module.ts:708:17)
        at TransactionsModule.estimateGas (.../transactions-module.ts:886:29)
        at sendTransactionWithAccount (.../tests/thor-client/debug/fixture-thorest.ts:506:21)
        at testTraceContractCall (.../DebugModule.solo.test.ts:52:23)
        ...
      [cause]: Error: connect ECONNREFUSED 127.0.0.1:8669
```

## How to Re-run Successfully
- __Option A: Manual lifecycle__ (recommended for a clean run)
  ```bash
  # From project root
  yarn stop-thor-solo || true
  yarn start-thor-solo
  yarn seed-thor-solo
  yarn workspace @vechain/sdk-network jest --runInBand --verbose --detectOpenHandles --coverage=false \
    tests/thor-client/debug/DebugModule.solo.test.ts
  yarn save-thor-solo-logs
  yarn stop-thor-solo
  ```

- __Option B: One-liner orchestration__
  ```bash
  (yarn stop-thor-solo || true); \
  (yarn start-thor-solo && yarn seed-thor-solo && \
   yarn workspace @vechain/sdk-network jest --runInBand --verbose --detectOpenHandles --coverage=false \
   tests/thor-client/debug/DebugModule.solo.test.ts); \
  STATUS=$?; yarn save-thor-solo-logs; yarn stop-thor-solo; exit $STATUS
  ```

## Notes
- Timestamps in console (e.g., `2025-08-26T09:09:16Z`) are UTC; local time is `+03:00` (≈ 12:09).
- If you continue to see `HTTP 400` on `POST /transactions` instead of `ECONNREFUSED`, validate:
  - __Chain tag__ and __blockRef__ correctness in the fixture.
  - Account balances and token state after seeding.
  - That the Thor Solo container is healthy and RPC is reachable at `127.0.0.1:8669`.

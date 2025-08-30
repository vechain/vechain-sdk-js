# DebugModule.solo.test.ts – HTTP Trace Summary (SDK_TRACE)

Date: 2025-08-26 11:58 +03:00

## Command Run
```bash
(yarn stop-thor-solo || true); \
(yarn start-thor-solo && yarn seed-thor-solo && \
 SDK_TRACE=true yarn workspace @vechain/sdk-network jest --runInBand --verbose --detectOpenHandles --coverage=false \
 tests/thor-client/debug/DebugModule.solo.test.ts); \
STATUS=$?; yarn save-thor-solo-logs; yarn stop-thor-solo; exit $STATUS
```

## Full Console Log
- Saved to: `docs/reports/debugmodule-trace-20250826-120358.log`
- Thor Solo container logs saved under: `packages/solo-setup/logs/` (e.g. latest `thor-solo-20250826-114628.log`)

## TraceLogger Highlights (POST /transactions)

Examples of requests emitted by `trace-logger` from `packages/network/src/http/trace-logger.ts`:

```text
➡️ {
  "category": "HTTP Request",
  "method": "POST",
  "url": "http://127.0.0.1:8669/transactions",
  "requestHeaders": {},
  "requestBody": {
    "raw": "0xf8b8...701"  // RLP-encoded signed transaction (truncated)
  }
}
```

```text
➡️ {
  "category": "HTTP Request",
  "method": "POST",
  "url": "http://127.0.0.1:8669/transactions",
  "requestHeaders": {},
  "requestBody": {
    "raw": "0xf8b8...c01"  // RLP-encoded signed transaction (truncated)
  }
}
```

These request entries repeat for multiple tracer cases (e.g., noop, addacc, prestate, suicide, trigram, evmdis, opcount, null).

## TraceLogger Errors (POST /transactions)

Representative error blocks captured with SDK_TRACE enabled:

```text
➡️ {
  "category": "HTTP Error",
  "method": "POST",
  "url": "http://127.0.0.1:8669/transactions",
  "error": {},
  "timestamp": 1756199043410,
  "duration": 45
}
❌ POST http://127.0.0.1:8669/transactions (45ms)
```

```text
Error: HTTP 400 Bad Request
Stack: Error: HTTP 400 Bad Request
  at SimpleHttpClient.http (packages/network/src/http/SimpleHttpClient.ts:194:19)
  at TransactionsModule.sendRawTransaction (packages/network/src/thor-client/transactions/transactions-module.ts:238:36)
  at TransactionsModule.sendTransaction (packages/network/src/thor-client/transactions/transactions-module.ts:274:16)
  at sendTransactionWithAccount (packages/network/tests/thor-client/debug/fixture-thorest.ts:550:33)
```

## Seeding Note
During seeding, a similar error pattern was observed (from the captured log):

```text
Error seeding VET Method 'HttpClient.http()' failed.
-Reason: 'HTTP 400 Bad Request'
-Parameters:
  {
    "method": "POST",
    "url": "http://localhost:8669/transactions"
  }
-Internal error:
  HTTP 400 Bad Request
```

This suggests the Thor Solo node may not have been fully ready at the time of POST /transactions calls, or the submitted raw transaction did not meet node validation requirements. The pattern is consistent across tracer tests.

## Outcome (from run)
- All observed POST `/transactions` requests return `HTTP 400 Bad Request`.
- Errors consistently originate from `SimpleHttpClient.http()` and propagate through `TransactionsModule.sendRawTransaction()`.
- The environment lifecycle completed: start → seed → test → logs saved → stop.

## Files for Reference
- Test file: `packages/network/tests/thor-client/debug/DebugModule.solo.test.ts`
- Trace logger: `packages/network/src/http/trace-logger.ts`
- Full run log: `docs/reports/debugmodule-trace-20250826-120358.log`
- Thor Solo logs: `packages/solo-setup/logs/` (latest e.g. `thor-solo-20250826-114628.log`)

## Next Considerations (optional)
- Insert a readiness wait after starting Solo before seeding/tests (retry until healthcheck OK).
- Verify chainTag, gas, clauses, and signing account funds/VTHO in the raw transaction.
- Compare `127.0.0.1` vs `localhost` usage; ensure a single consistent RPC base URL.

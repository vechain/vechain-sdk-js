import { clauseBuilder, VTHO_ADDRESS } from '@vechain/sdk-core';

// build some example clauses

// 1. Transfer vet

const transferVetClause = clauseBuilder.transferVET(
    '0xf02f557c753edf5fcdcbfe4c1c3a448b3cc84d54',
    300n
);

// 2. Transfer VTHO

const transferVTHOClause = clauseBuilder.transferToken(
    VTHO_ADDRESS,
    '0xf02f557c753edf5fcdcbfe4c1c3a448b3cc84d54',
    300n
);

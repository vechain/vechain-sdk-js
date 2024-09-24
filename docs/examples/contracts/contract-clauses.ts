import {
    Address,
    Clause,
    Units,
    VET,
    VTHO,
    VTHO_ADDRESS
} from '@vechain/sdk-core';

// build some example clauses

// 1. Transfer vet

const transferVetClause = Clause.transferVET(
    Address.of('0xf02f557c753edf5fcdcbfe4c1c3a448b3cc84d54'),
    VET.of(300n, Units.wei)
);

// 2. Transfer VTHO

const transferVTHOClause = Clause.transferToken(
    Address.of(VTHO_ADDRESS),
    Address.of('0xf02f557c753edf5fcdcbfe4c1c3a448b3cc84d54'),
    VTHO.of(300n, Units.wei)
);

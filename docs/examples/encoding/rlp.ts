import { RLP } from 'thor-devkit';

// Define the profile for tx clause structure
const profile = {
    name: 'clause',
    kind: [
        { name: 'to', kind: new RLP.NullableFixedBlobKind(20) },
        { name: 'value', kind: new RLP.NumericKind(32) },
        { name: 'data', kind: new RLP.BlobKind() }
    ]
};

// Create clauses
const clause = {
    to: '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed',
    value: 10,
    data: '0x'
};

// Instace RLP
const rlp = new RLP(profile);

// Encoding and Decoding
const data = rlp.encode(clause);
console.log(data.toString('hex'));
// d7947567d83b7b8d80addcb281a71d54fc7b3364ffed0a80

const obj = rlp.decode(data);
console.log(JSON.stringify(obj) === JSON.stringify(clause));
// `obj` should be identical to `clause`s -> true

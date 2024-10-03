#!/bin/sh

if [ -z "$MASTER_KEY" ]; then
  echo "MASTER_KEY is not set"
  exit 1
fi

echo "$MASTER_KEY" > /tmp/master.key

BOOTNODE_IP=$(ping -c 1 thor-disco | awk -F'[()]' '/PING/{print $2}')

echo "$BOOTNODE_IP"

thor \
  --config-dir=/tmp \
  --network /node/config/genesis.json \
  --api-addr="0.0.0.0:8669" \
  --api-cors="*" \
  --api-allowed-tracers="all" \
  --verbosity=9 \
  --bootnode "enode://e32e5960781ce0b43d8c2952eeea4b95e286b1bb5f8c1f0c9f09983ba7141d2fdd7dfbec798aefb30dcd8c3b9b7cda8e9a94396a0192bfa54ab285c2cec515ab@$BOOTNODE_IP:55555"


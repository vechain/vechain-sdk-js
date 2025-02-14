#!/bin/bash

CUSTOM_ORIGIN_KEY_MATERIAL="f5KQzETF/SuV/iHWrW/l+pwXfhzW87TJapexPgnqoVg="
CUSTOM_ORIGIN_ID="bffb20d8-35ca-4408-9d54-f775b929b38d"
CUSTOM_GAS_PAYER_ID="3e47cac8-de37-4f50-b591-57f525c1b05c"

# The command succeeds but the key is not created with the custom key material (should be fixed once this is clarified: https://github.com/localstack/localstack/issues/11678)
# awslocal kms create-key --key-usage SIGN_VERIFY --key-spec ECC_SECG_P256K1 --tags "[{\"TagKey\":\"_custom_key_material_\",\"TagValue\":\"$CUSTOM_ORIGIN_KEY_MATERIAL\"},{\"TagKey\":\"_custom_id_\",\"TagValue\":\"$CUSTOM_ORIGIN_ID\"}]"

# Origin key
awslocal kms create-key --key-usage SIGN_VERIFY --key-spec ECC_SECG_P256K1 --tags "[{\"TagKey\":\"_custom_id_\",\"TagValue\":\"$CUSTOM_ORIGIN_ID\"}]"

# Gas-Payer key
awslocal kms create-key --key-usage SIGN_VERIFY --key-spec ECC_SECG_P256K1 --tags "[{\"TagKey\":\"_custom_id_\",\"TagValue\":\"$CUSTOM_GAS_PAYER_ID\"}]"

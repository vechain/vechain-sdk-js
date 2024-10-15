#!/bin/bash

CUSTOM_KEY_MATERIAL="f5KQzETF/SuV/iHWrW/l+pwXfhzW87TJapexPgnqoVg="
CUSTOM_ID="bffb20d8-35ca-4408-9d54-f775b929b38d"

# The command succeeds but the key is not created with the custom key material (should be fixed once this is clarified: https://github.com/localstack/localstack/issues/11678)
# awslocal kms create-key --key-usage SIGN_VERIFY --key-spec ECC_SECG_P256K1 --tags "[{\"TagKey\":\"_custom_key_material_\",\"TagValue\":\"$CUSTOM_KEY_MATERIAL\"},{\"TagKey\":\"_custom_id_\",\"TagValue\":\"$CUSTOM_ID\"}]"
awslocal kms create-key --key-usage SIGN_VERIFY --key-spec ECC_SECG_P256K1 --tags "[{\"TagKey\":\"_custom_id_\",\"TagValue\":\"$CUSTOM_ID\"}]"
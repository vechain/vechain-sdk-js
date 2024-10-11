#!/bin/bash

CUSTOM_KEY_MATERIAL="MHQCAQEEIH+SkMxExf0rlf4h1q1v5fqcF34c1vO0yWqXsT4J6qFYoAcGBSuBBAAKoUQDQgAEMDsHgoGGtL5+q81ZRo5ZnFfTOvkNhnhHugDH2XvK8zBogAYAEHTnd7fByPdyjzVvqqdYp5yzB2d+bzpLBLbqMA=="
CUSTOM_ID="bffb20d8-35ca-4408-9d54-f775b929b38d"

awslocal kms create-key --key-usage SIGN_VERIFY --key-spec ECC_SECG_P256K1 --tags "[{\"TagKey\":\"_custom_key_material_\",\"TagValue\":\"$CUSTOM_KEY_MATERIAL\"},{\"TagKey\":\"_custom_id_\",\"TagValue\":\"$CUSTOM_ID\"}]"

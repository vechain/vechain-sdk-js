#!/bin/bash

# Assign -u flag to URL if the first argument is provided
URL=${url:+-u ${url}}

# Assign -p flag to PORT if the second argument is provided
PORT=${port:+-p ${port}}

# Assign -a flag to ACCOUNTS if the third argument is provided
ACCOUNTS=${accounts:+-a ${accounts}}

# Assign -m flag to MNEMONIC if the fourth argument is provided
MNEMONIC=${mnemonic:+-m ${mnemonic}}

# Assign -mc flag to MNEMONIC_COUNT if the fifth argument is provided
MNEMONIC_COUNT=${mnemonicCount:+-mc ${mnemonicCount}}

# Assign -mi flag to MNEMONIC_INITIAL_INDEX if the sixth argument is provided
MNEMONIC_INITIAL_INDEX=${mnemonicInitialIndex:+-mi ${mnemonicInitialIndex}}

# Assign -e flag to ENABLE_DELEGATION if the seventh argument is provided
ENABLE_DELEGATION=${enableDelegation:+-e}

# Assign -dp flag to DELEGATOR_PRIVATE_KEY if the eighth argument is provided
DELEGATOR_PRIVATE_KEY=${delegatorPrivateKey:+-dp ${delegatorPrivateKey}}

# Assign -du flag to DELEGATOR_URL if the ninth argument is provided
DELEGATOR_URL=${delegatorUrl:+-du ${delegatorUrl}}

# Assign -v flag to VERBOSE if the tenth argument is provided
VERBOSE=${verbose:+-v}

# Assign -c flag to CONFIGURATION_FILE if the eleventh argument is provided
CONFIGURATION_FILE=${configurationFile:+-c ${configurationFile}}

# Run the proxy with the provided arguments
node dist/index.js $URL $PORT $ACCOUNTS $MNEMONIC $MNEMONIC_COUNT $MNEMONIC_INITIAL_INDEX $ENABLE_DELEGATION $DELEGATOR_PRIVATE_KEY $DELEGATOR_URL $VERBOSE $CONFIGURATION_FILE
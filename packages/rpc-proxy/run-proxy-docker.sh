#!/bin/bash

# Assign -u flag to URL if the first argument is provided
URL=${1:+-u ${1}}

# Assign -p flag to PORT if the second argument is provided
PORT=${2:+-p ${2}}

# Assign -a flag to ACCOUNTS if the third argument is provided
ACCOUNTS=${3:+-a ${3}}

# Assign -m flag to MNEMONIC if the fourth argument is provided
MNEMONIC=${4:+-m ${4}}

# Assign -mc flag to MNEMONIC_COUNT if the fifth argument is provided
MNEMONIC_COUNT=${5:+-mc ${5}}

# Assign -mi flag to MNEMONIC_INITIAL_INDEX if the sixth argument is provided
MNEMONIC_INITIAL_INDEX=${6:+-mi ${6}}

# Assign -e flag to ENABLE_DELEGATION if the seventh argument is provided
ENABLE_DELEGATION=${7:+-e}

# Assign -dp flag to DELEGATOR_PRIVATE_KEY if the eighth argument is provided
DELEGATOR_PRIVATE_KEY=${8:+-dp ${8}}

# Assign -du flag to DELEGATOR_URL if the ninth argument is provided
DELEGATOR_URL=${9:+-du ${9}}

# Assign -v flag to VERBOSE if the tenth argument is provided
VERBOSE=${10:+-v}

# Assign -c flag to CONFIGURATION_FILE if the eleventh argument is provided
CONFIGURATION_FILE=${11:+-c ${11}}

# Run the proxy with the provided arguments
node dist/index.js $URL $PORT $ACCOUNTS $MNEMONIC $MNEMONIC_COUNT $MNEMONIC_INITIAL_INDEX $ENABLE_DELEGATION $DELEGATOR_PRIVATE_KEY $DELEGATOR_URL $VERBOSE $CONFIGURATION_FILE
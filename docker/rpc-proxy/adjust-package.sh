#!/bin/bash

# -----------------------------------------------------------------------------
# Info:
# - input: path to package.json
# - output: 
#     package.json without devDependencies section
#     package.json without version selectors in dependencies
# -----------------------------------------------------------------------------

# Check if the input file is provided
if [ -z "$1" ]; then
  echo "Usage: $0 <path-to-package.json>"
  exit 1
fi

PACKAGE_JSON="$1"

# Check if the file exists
if [ ! -f "$PACKAGE_JSON" ]; then
  echo "Error: File '$PACKAGE_JSON' not found."
  exit 1
fi

# Remove the "devDependencies" section and overwrite the file
if jq -e '.devDependencies' "$PACKAGE_JSON" > /dev/null; then
    jq 'del(.devDependencies)' "$PACKAGE_JSON" > temp.json && mv temp.json "$PACKAGE_JSON"
    echo "devDependencies removed from $PACKAGE_JSON"
else
    echo "No devDependencies section found in $PACKAGE_JSON. No changes made."
fi

# Remove version selectors from dependencies
# Check if the dependencies section exists in the package.json file
if jq -e '.dependencies' "$PACKAGE_JSON" > /dev/null; then
  # Remove version selectors from dependencies
  jq '(.dependencies |= with_entries(.value |= ltrimstr("^") | ltrimstr("~")))' "$PACKAGE_JSON" > temp.json && mv temp.json "$PACKAGE_JSON"
  echo "Version selectors (caret/tilde) removed from dependencies in $PACKAGE_JSON"
else
  echo "No dependencies section found in $PACKAGE_JSON. No changes made."
fi






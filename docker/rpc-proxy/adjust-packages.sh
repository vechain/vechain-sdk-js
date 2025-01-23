#!/bin/bash

# -----------------------------------------------------------------------------
# Info:
# - input: directory to search for package.json files
# - output: 
#     package.json without devDependencies section
#     package.json without version selectors in dependencies
# -----------------------------------------------------------------------------

# Check if the search directory is provided
if [ -z "$1" ]; then
  echo "Usage: $0 <path-to-directory>"
  exit 1
fi
SEARCH_DIR="$1"

# Check if the search directory exists
if [ ! -d "$SEARCH_DIR" ]; then
  echo "Error: Directory '$SEARCH_DIR' not found."
  exit 1
fi


# Find all package.json files in the specified directory (excluding node_modules)
find "$SEARCH_DIR" -type f -name "package.json" ! -path "*/node_modules/*" | while read PACKAGE_JSON; do
  echo "Processing: $PACKAGE_JSON"


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

done
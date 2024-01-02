#!/usr/bin/env bash
set -e

# Ensure we're in the packages/client/python folder
cd "$(dirname "$0")/.."

if ! command -v npx &> /dev/null
then
    if ! command -v npm &> /dev/null
    then
        echo "npm & npx could not be found"
        echo "Install npm and try again"
        exit 1
    fi

    echo "npx could not be found"

    echo -n "Do you want to install it? (y/N) "
    read -r ANSWER

    if [ "$ANSWER" != y ]
    then
      exit 1
    fi
fi

# Get the version from pyproject.toml and set it in openapitools.json
PACKAGE_VERSION=$(grep -oP '(?<=version = ")[^"]*' pyproject.toml)
sed -i "s/\"packageVersion\": \".*\"/\"packageVersion\": \"$PACKAGE_VERSION\"/" openapitools.json

npx @openapitools/openapi-generator-cli generate \
  --global-property apis,models,supportingFiles,modelDocs=false \
  -i ../../../schemas/openapi.yml \
  -g python-pydantic-v1 \
  -c openapitools.json \
  --library asyncio \
  --additional-properties=generateSourceCodeOnly=true,packageName=agent_protocol_client

black .

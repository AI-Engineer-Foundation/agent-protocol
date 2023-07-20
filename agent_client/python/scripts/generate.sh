#!/usr/bin/env bash

set -e


if ! command -v npx &> /dev/null
then
    echo "npx could not be found"
    exit
fi

npm list -g | grep @openapitools/openapi-generator-cli || npm install -g @openapitools/openapi-generator-cli

npx @openapitools/openapi-generator-cli  generate --global-property apis,models,supportingFiles,modelDocs=false -i ./../../openapi.yml -g python-nextgen --library asyncio --additional-properties=generateSourceCodeOnly=true,packageName=agent_protocol_client
black .

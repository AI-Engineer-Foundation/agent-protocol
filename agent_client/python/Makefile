.PHONY: generate
generate:
	openapi-generator generate --global-property apis,models,supportingFiles,modelDocs=false -i ./../../agent/openapi.yml -g python-nextgen --library asyncio --additional-properties=generateSourceCodeOnly=true,packageName=agent_protocol_client

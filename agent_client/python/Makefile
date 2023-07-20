.PHONY: generate
generate:
	openapi-generator generate --global-property apis,models,supportingFiles,modelDocs=false -i ./../openapi.yaml -g python-nextgen --library asyncio --additional-properties=generateSourceCodeOnly=true,packageName=agent_protocol_client

.PHONY: generate
generate:
	poetry run fastapi-codegen \
		--generate-routers \
		--input ../openapi.yml \
		--output agent_protocol
	mv agent_protocol/main.py agent_protocol/server.py
	rm -rf agent_protocol/routers

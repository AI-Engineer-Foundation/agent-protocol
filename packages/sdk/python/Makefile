.PHONY: generate
generate:
	poetry run fastapi-codegen \
		--generate-routers \
		--input ../../../schemas/openapi.yml \
		--output agent_protocol \
		--template-dir codegen
	mv agent_protocol/main.py agent_protocol/server.py
	rm -rf agent_protocol/routers
	rm agent_protocol/dependencies.py
	black .

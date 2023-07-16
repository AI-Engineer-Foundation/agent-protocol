.PHONY: generate
generate:
	poetry run fastapi-codegen --generate-routers --input ../openapi.yml --output e2b_agent
	mv e2b_agent/main.py e2b_agent/server.py
	rm -rf e2b_agent/routers

# .PHONY: dev
# dev:
# 	poetry run uvicorn e2b_agent.server:app --reload
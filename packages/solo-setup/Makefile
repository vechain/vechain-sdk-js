SHELL := /bin/bash

# Thor solo
solo-up: #@ Start Thor solo
	mkdir -p logs data
	docker compose -f ./docker-compose.solo.yml up -d
	@echo "Waiting for Thor solo node to be ready..."
	@timeout=60; \
	while [ $$timeout -gt 0 ]; do \
		if docker compose -f ./docker-compose.solo.yml ps | grep -q "healthy"; then \
			echo "Thor solo node is ready!"; \
			exit 0; \
		fi; \
		echo "Waiting for Thor solo node... ($$timeout seconds remaining)"; \
		sleep 2; \
		timeout=$$((timeout - 2)); \
	done; \
	echo "ERROR: Thor solo node failed to become healthy within 60 seconds"; \
	docker compose -f ./docker-compose.solo.yml logs; \
	exit 1
	
solo-down: #@ Stop Thor solo
	docker compose -f ./docker-compose.solo.yml down
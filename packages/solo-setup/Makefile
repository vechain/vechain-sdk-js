SHELL := /bin/bash

# Thor solo
solo-up: #@ Start Thor solo
	docker compose -f ./docker-compose.solo.yml up -d
solo-down: #@ Stop Thor solo
	docker compose -f ./docker-compose.solo.yml down
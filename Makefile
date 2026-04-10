.PHONY: build up exec claude claude-skip claude-auto

build:
	docker compose up --build -d

up:
	docker compose up -d

exec:
	docker compose exec claude bash

claude:
	docker compose exec claude claude

claude-skip:
	docker compose exec claude claude --dangerously-skip-permissions

claude-auto:
	docker compose exec claude claude --enable-auto-mode

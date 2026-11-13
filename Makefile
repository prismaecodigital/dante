SHELL := /bin/sh

ENV_FILE ?= docker/.env
COMPOSE_DEV := docker compose --env-file $(ENV_FILE) -f docker-compose.yml
COMPOSE_PROD := docker compose --env-file $(ENV_FILE) -f docker-compose.prod.yml
COMPOSE_BUILD := $(COMPOSE_PROD) -f docker-compose.build.yml
COMPOSE_LOCAL := $(COMPOSE_PROD) -f docker-compose.local.yml

REGISTRY ?= prismaeco
PLATFORMS ?= linux/amd64,linux/arm64
PLATFORM ?= linux/amd64
BUILDER ?= multiarch
PHP_VERSION ?= 8.5.12
TEST_DATABASE ?= dante_testing

.DEFAULT_GOAL := help

.PHONY: help env key
.PHONY: dev-up dev-down dev-logs dev-ps sh artisan test fresh db-import
.PHONY: prod-build prod-up prod-down prod-deploy prod-migrate prod-logs prod-shell prod-artisan prod-local
.PHONY: builder release save-images backup

help: ## Show this help
	@grep -hE '^[a-zA-Z_-]+:.*?## ' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-16s\033[0m %s\n", $$1, $$2}'

env: ## Create docker/.env from the example (never overwrites)
	@test -f $(ENV_FILE) || cp docker/.env.example $(ENV_FILE)
	@echo "$(ENV_FILE) is ready"

key: ## Print a fresh APP_KEY value
	@docker run --rm php:$(PHP_VERSION)-alpine php -r 'echo "base64:".base64_encode(random_bytes(32)), PHP_EOL;'

# --- Development -----------------------------------------------------------

dev-up: ## Start the development stack (app, nginx, vite, db, adminer)
	$(COMPOSE_DEV) up -d --build

dev-down: ## Stop the development stack
	$(COMPOSE_DEV) down

dev-logs: ## Tail the development logs
	$(COMPOSE_DEV) logs -f --tail=100

dev-ps: ## Show the development containers
	$(COMPOSE_DEV) ps

sh: ## Shell inside the development app container
	$(COMPOSE_DEV) exec -u www-data app sh

artisan: ## Run an artisan command: make artisan CMD="about"
	$(COMPOSE_DEV) exec -u www-data app php artisan $(CMD)

test: ## Run the test suite against the $(TEST_DATABASE) database
	$(COMPOSE_DEV) exec -T db sh -c 'mysql -u root -p"$$MYSQL_ROOT_PASSWORD" -e "CREATE DATABASE IF NOT EXISTS \`$(TEST_DATABASE)\`; GRANT ALL ON \`$(TEST_DATABASE)\`.* TO \"$$MYSQL_USER\"@\"%\";"'
	$(COMPOSE_DEV) exec -T -e APP_ENV=testing -e DB_DATABASE=$(TEST_DATABASE) app php artisan test

fresh: ## Destroy the development database and re-seed it
	$(COMPOSE_DEV) exec -u www-data app php artisan migrate:fresh --seed --force

db-import: ## Import a dump: make db-import FILE=dump.sql STACK=dev|prod
	@test -n "$(FILE)" || (echo "FILE is required" && exit 1)
ifeq ($(STACK),prod)
	$(COMPOSE_PROD) exec -T db sh -c 'exec mysql -u root -p"$$MYSQL_ROOT_PASSWORD" "$$MYSQL_DATABASE"' < $(FILE)
else
	$(COMPOSE_DEV) exec -T db sh -c 'exec mysql -u root -p"$$MYSQL_ROOT_PASSWORD" "$$MYSQL_DATABASE"' < $(FILE)
endif

# --- Production ------------------------------------------------------------

prod-build: ## Build the production images locally (native architecture)
	$(COMPOSE_BUILD) build

prod-up: ## Start the production stack from the built/pulled images
	$(COMPOSE_PROD) up -d --no-build

prod-down: ## Stop the production stack
	$(COMPOSE_PROD) down

prod-deploy: ## Pull the pinned images and start the production stack
	$(COMPOSE_PROD) pull
	$(COMPOSE_PROD) up -d --no-build

prod-migrate: ## Run migrations in the production stack
	$(COMPOSE_PROD) exec -u www-data app php artisan migrate --force

prod-logs: ## Tail the production logs
	$(COMPOSE_PROD) logs -f --tail=100

prod-shell: ## Shell inside the production app container
	$(COMPOSE_PROD) exec -u www-data app sh

prod-artisan: ## Run an artisan command in production: make prod-artisan CMD="about"
	$(COMPOSE_PROD) exec -u www-data app php artisan $(CMD)

prod-local: ## Run the production stack locally with published ports
	$(COMPOSE_LOCAL) up -d --no-build

# --- Release ---------------------------------------------------------------

builder: ## Create the multi-platform buildx builder
	-docker buildx rm $(BUILDER)
	docker buildx create --name $(BUILDER) --driver docker-container --bootstrap

release: ## Build and push both images: make release VERSION=YYYY-MM-DD.N
	@test -n "$(VERSION)" || (echo "VERSION is required, e.g. make release VERSION=2026-11-04.1" && exit 1)
	docker buildx build --platform $(PLATFORMS) --builder $(BUILDER) \
		-f Dockerfile --target prod \
		-t $(REGISTRY)/dante-app:$(VERSION) -t $(REGISTRY)/dante-app:latest \
		--push .
	docker buildx build --platform $(PLATFORMS) --builder $(BUILDER) \
		-f Dockerfile --target web_prod \
		-t $(REGISTRY)/dante-nginx:$(VERSION) -t $(REGISTRY)/dante-nginx:latest \
		--push .

save-images: ## Save both images as a tarball: make save-images VERSION=...
	@test -n "$(VERSION)" || (echo "VERSION is required" && exit 1)
	docker buildx build --platform $(PLATFORM) --builder $(BUILDER) --load \
		-f Dockerfile --target prod \
		-t $(REGISTRY)/dante-app:$(VERSION) .
	docker buildx build --platform $(PLATFORM) --builder $(BUILDER) --load \
		-f Dockerfile --target web_prod \
		-t $(REGISTRY)/dante-nginx:$(VERSION) .
	docker save $(REGISTRY)/dante-app:$(VERSION) $(REGISTRY)/dante-nginx:$(VERSION) | gzip > dante-images.tar.gz
	@echo "dante-images.tar.gz is ready"

backup: ## Dump the production database to backup-YYYY-MM-DD.sql
	$(COMPOSE_PROD) exec -T db \
		sh -c 'exec mysqldump -u root -p"$$MYSQL_ROOT_PASSWORD" --single-transaction --routines "$$MYSQL_DATABASE"' \
		> backup-$$(date +%Y-%m-%d).sql

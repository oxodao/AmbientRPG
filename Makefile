.PHONY: tests migrations

USER := $(shell id -u):$(shell id -g)

up:
	@docker compose up --build -d --remove-orphans
	$(MAKE) reset-db

shell:
	@docker compose exec app bash

migrations:
	@docker compose exec app php bin/console doctrine:migrations:diff

migrate:
	@docker compose exec app php bin/console doctrine:migrations:migrate -vv --env=dev --no-interaction

clear:
	@docker compose exec app php bin/console cache:clear -v --env=dev

reset-db:
	@docker compose exec app bin/console doctrine:schema:drop --force --full-database
	$(MAKE) migrate
	@docker compose exec app rm -rf /data/images /data/sfx /data/soundtracks
	@docker compose exec app bin/console doctrine:fixtures:load --no-interaction --append

lint:
	$(MAKE) phpcsfixer
	$(MAKE) phpstan

phpstan:
	@docker compose exec app php -d memory_limit=8G vendor/bin/phpstan analyse

phpcsfixer:
	@docker compose exec app vendor/bin/php-cs-fixer fix --dry-run -vv --diff

phpcsfixer-fix:
	@docker compose exec app vendor/bin/php-cs-fixer fix -vv --diff

lint-fix:
	@docker compose exec app vendor/bin/php-cs-fixer fix -vv --diff

fix-perms:
	sudo chown -R "$(USER)" .

lint-ts:
	@docker compose exec frontend npx prettier . --write
	@docker compose exec frontend npm run lint -- --fix

tests:
	@docker compose exec app bin/phpunit

release:
	@docker build --no-cache -t oxodao/ambientrpg:latest .

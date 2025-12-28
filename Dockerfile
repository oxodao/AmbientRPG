# Hardcoding the vesion because they break everything and don't test before release
FROM dunglas/frankenphp:1.4.2-php8.4.3 AS frankenphp_upstream

# Frontend intermediary image
FROM node:lts AS frontend

COPY --link ./frontend /app
RUN cd /app && npm install --legacy-peer-deps && npm run build

# Sidecar intermediary image
FROM golang:1.24.0-bookworm AS sidecar_builder

WORKDIR /app

COPY sidecar/go.mod sidecar/go.sum ./

RUN go mod download

COPY ./sidecar ./

RUN go build -a -o sidecar

FROM frankenphp_upstream AS frankenphp_base

ENV COMPOSER_ALLOW_SUPERUSER=1
ENV PHP_INI_SCAN_DIR=":$PHP_INI_DIR/app.conf.d"
ENV APP_ENV=prod
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
	acl \
	file \
	gettext \
	git \
	&& rm -rf /var/lib/apt/lists/*

RUN set -eux; \
	install-php-extensions \
		@composer \
		apcu \
		intl \
		opcache \
		zip \
    	gd \
	;

RUN install-php-extensions pdo_sqlite

# Caddy / Php config
COPY --link ./backend/frankenphp/conf.d/app.ini $PHP_INI_DIR/app.conf.d/
COPY --link ./backend/frankenphp/conf.d/app.prod.ini $PHP_INI_DIR/app.conf.d/
COPY --link ./backend/frankenphp/Caddyfile /etc/caddy/Caddyfile
COPY --link ./backend/frankenphp/worker.Caddyfile /etc/caddy/worker.Caddyfile

# Entry script
COPY --link --chmod=755 ./backend/frankenphp/docker-entrypoint.sh /usr/local/bin/docker-entrypoint

# Copying the app
COPY --from=frontend /app/dist/ /frontend
COPY --link ./backend /app

RUN set -eux; export MERCURE_PUBLISHER_JWT_KEY=idc_this_is_temp; \
	mkdir -p var/cache var/log; \
    composer install --no-cache --prefer-dist --no-dev --no-autoloader --no-scripts --no-progress; \
	composer dump-autoload --classmap-authoritative --no-dev; \
	composer dump-env prod; \
	composer run-script --no-dev post-install-cmd; \
	chmod +x bin/console; sync;

COPY --from=sidecar_builder /app/sidecar /usr/bin/sidecar
RUN chmod +x /usr/bin/sidecar

HEALTHCHECK --start-period=60s CMD curl -f http://localhost:2019/metrics || exit 1
ENTRYPOINT ["docker-entrypoint"]
CMD [ "frankenphp", "run", "--config", "/etc/caddy/Caddyfile" ]

# syntax=docker/dockerfile:1

ARG PHP_VERSION=8.5.12
ARG NODE_VERSION=26.12.1
ARG COMPOSER_VERSION=2.11.1
ARG NGINX_VERSION=1.27-alpine

# ---------------------------------------------------------------------------
# Composer binary (pinned, so a new Composer release cannot change lockfile
# handling mid-release)
# ---------------------------------------------------------------------------
FROM composer:${COMPOSER_VERSION} AS composer_bin

# ---------------------------------------------------------------------------
# Frontend assets — built once on the build platform and shared by every target
# architecture, then copied into both the PHP and the nginx image so they can
# never disagree.
# ---------------------------------------------------------------------------
FROM --platform=$BUILDPLATFORM node:${NODE_VERSION}-alpine AS assets

WORKDIR /build

COPY package.json package-lock.json vite.config.js ./
RUN npm ci

COPY resources ./resources
COPY public ./public

ARG VITE_VUE_APP_I18N_LOCALE=id
ARG VITE_VUE_APP_I18N_FALLBACK_LOCALE=id
ENV VITE_VUE_APP_I18N_LOCALE=${VITE_VUE_APP_I18N_LOCALE} \
    VITE_VUE_APP_I18N_FALLBACK_LOCALE=${VITE_VUE_APP_I18N_FALLBACK_LOCALE}

RUN npm run build

# ---------------------------------------------------------------------------
# PHP base — extensions, php.ini, OPcache configuration
# ---------------------------------------------------------------------------
FROM php:${PHP_VERSION}-fpm-alpine AS php_base

RUN apk add --no-cache --virtual .build-deps \
        $PHPIZE_DEPS \
        freetype-dev \
        icu-dev \
        libjpeg-turbo-dev \
        libpng-dev \
        libzip-dev \
    && apk add --no-cache \
        freetype \
        icu-libs \
        libjpeg-turbo \
        libpng \
        libzip \
        tzdata \
        unzip \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j"$(nproc)" bcmath exif gd intl pdo_mysql zip \
    && apk del .build-deps

# Zend OPcache is compiled into the php:8.5 images — configure it, never build it.
COPY docker/php/php.ini /usr/local/etc/php/conf.d/zz-app.ini

COPY --from=composer_bin /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# ---------------------------------------------------------------------------
# Composer vendor — resolved on the build platform against the lockfile
# ---------------------------------------------------------------------------
FROM --platform=$BUILDPLATFORM php_base AS vendor

COPY composer.json composer.lock ./

RUN composer install \
        --no-dev \
        --no-scripts \
        --no-autoloader \
        --prefer-dist \
        --no-interaction \
        --no-progress

COPY . .

RUN composer dump-autoload --no-dev --optimize --classmap-authoritative \
    && mkdir -p \
        storage/app/public \
        storage/fonts \
        storage/framework/cache/data \
        storage/framework/sessions \
        storage/framework/views \
        storage/logs \
        bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache

# ---------------------------------------------------------------------------
# Development — no application code baked in, it is bind-mounted at runtime
# ---------------------------------------------------------------------------
FROM php_base AS dev

ENV APP_ENV=local

COPY docker/entrypoint.sh /usr/local/bin/entrypoint
COPY docker/php/opcache-dev.ini /usr/local/etc/php/conf.d/zz-opcache.ini

RUN chmod +x /usr/local/bin/entrypoint \
    && mkdir -p \
        storage/app/public \
        storage/fonts \
        storage/framework/cache/data \
        storage/framework/sessions \
        storage/framework/views \
        storage/logs \
        bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache

ENTRYPOINT ["entrypoint"]
CMD ["php-fpm"]

# ---------------------------------------------------------------------------
# Production — application code, vendor and built assets baked in
# ---------------------------------------------------------------------------
FROM php_base AS prod

ENV APP_ENV=production

COPY --from=vendor --chown=www-data:www-data /var/www/html /var/www/html
COPY --from=assets --chown=www-data:www-data /build/public/build /var/www/html/public/build
COPY docker/entrypoint.sh /usr/local/bin/entrypoint
COPY docker/php/opcache.ini /usr/local/etc/php/conf.d/zz-opcache.ini

RUN chmod +x /usr/local/bin/entrypoint \
    && mkdir -p \
        storage/app/public \
        storage/fonts \
        storage/framework/cache/data \
        storage/framework/sessions \
        storage/framework/views \
        storage/logs \
        bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache

ENTRYPOINT ["entrypoint"]
CMD ["php-fpm"]

# ---------------------------------------------------------------------------
# nginx — serves the built public/ directory of the same commit
# ---------------------------------------------------------------------------
FROM nginx:${NGINX_VERSION} AS web_prod

COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=assets /build/public /var/www/html/public

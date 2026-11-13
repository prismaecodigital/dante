#!/bin/sh
set -e

cd /var/www/html

APP_ENV="${APP_ENV:-production}"

log() {
    printf '[entrypoint] %s\n' "$*"
}

# storage/ and bootstrap/cache may be mounted over by an empty named volume,
# so the directory tree is created here as well as in the Dockerfile.
mkdir -p \
    storage/app/public \
    storage/fonts \
    storage/framework/cache/data \
    storage/framework/sessions \
    storage/framework/views \
    storage/logs \
    bootstrap/cache

if [ "$(id -u)" = "0" ]; then
    chown -R www-data:www-data storage bootstrap/cache
fi

if [ "$APP_ENV" = "production" ] && [ -z "${APP_KEY:-}" ]; then
    log "APP_KEY is empty — refusing to start in production."
    exit 1
fi

if [ ! -f vendor/autoload.php ]; then
    log "vendor/ is missing, running composer install."
    composer install --no-interaction --prefer-dist --no-progress
fi

if [ ! -e public/storage ]; then
    log "Linking public/storage."
    php artisan storage:link >/dev/null 2>&1 || true
fi

wait_for_database() {
    [ -n "${DB_HOST:-}" ] || return 0

    log "Waiting for the database at ${DB_HOST}:${DB_PORT:-3306}."
    i=0
    while [ "$i" -lt 30 ]; do
        if php -r '
            $dsn = sprintf("mysql:host=%s;port=%s;dbname=%s", getenv("DB_HOST"), getenv("DB_PORT") ?: "3306", getenv("DB_DATABASE"));
            try {
                new PDO($dsn, getenv("DB_USERNAME"), getenv("DB_PASSWORD"), [PDO::ATTR_TIMEOUT => 2]);
                exit(0);
            } catch (Throwable $e) {
                exit(1);
            }
        ' 2>/dev/null; then
            log "Database is reachable."
            return 0
        fi
        i=$((i + 1))
        sleep 2
    done

    log "Database did not become reachable in 60s, continuing anyway."
}

if [ "${RUN_MIGRATIONS:-false}" = "true" ]; then
    wait_for_database
    log "Running migrations."
    php artisan migrate --force
fi

if [ "${CACHE_CONFIG:-false}" = "true" ]; then
    # Compiled Blade views live in the persistent storage volume and Docker
    # preserves source mtimes, so a view compiled by a previous release can be
    # considered fresh forever. Always clear before caching.
    log "Clearing and rebuilding the caches."
    php artisan optimize:clear
    php artisan optimize
fi

exec "$@"

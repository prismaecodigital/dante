# Production Guide

Release and deployment runbook for the **DATEK** stack (`dante`): build the images, push them to a
registry, and roll them out on the VM behind Traefik.

For local development, Traefik wiring and the full environment variable reference, see
[DOCKER.md](DOCKER.md). For the PHP 8.5 / Laravel 13 / Vite 7 upgrade that produced this stack, see
[UPGRADING_LARAVEL_PHP.md](UPGRADING_LARAVEL_PHP.md).

| Component | Version |
| --- | --- |
| PHP | 8.5.12 (`php:8.5.12-fpm-alpine`) |
| Laravel | 13.40.0 |
| Node.js | 26.12.1 (`node:26.12.1-alpine`) |
| Vite | 7.3.7 + `@vitejs/plugin-vue2` (Vue 2.7.16) |
| Composer | 2.11.1 (pinned in the Dockerfile) |
| nginx | 1.27-alpine |
| MySQL | 8.0 |

## 1. Images and versioning

| Image | Dockerfile target | Contains |
| --- | --- | --- |
| `prismaeco/dante-app` | `prod` | PHP 8.5.12-FPM, application code, `vendor/`, built `public/build`, OPcache |
| `prismaeco/dante-nginx` | `web_prod` | nginx + the built `public/` directory |

Both images come from the single root `Dockerfile`. `--target prod` builds the application image,
`--target web_prod` builds the web image on top of it, so the nginx image always carries exactly the
assets from the same commit.

**Version format:** `YYYY-MM-DD.N`, for example `2026-11-13.1`. Increment `N` for every release on
the same day (`2026-11-13.2`, `2026-11-13.3`, …). Every version is immutable — never push over an
existing tag.

`latest` is published alongside each version for convenience, but **production must pin an explicit
version** in `docker/.env` so rollbacks and restarts are deterministic.

### Container, volume and network names

The names are fixed in the compose files rather than derived from the Compose project name, so the
same commands work on every host:

| Kind | Name |
| --- | --- |
| Containers | `dante-app`, `dante-nginx`, `dante-db`, `dante-adminer`, `dante-scheduler` |
| Volumes | `dante_mysql-data`, `dante_app-storage` |
| Network | `dante-internal` (`APP_NETWORK`) |
| Development containers | `dante-dev-app`, `dante-dev-nginx`, `dante-dev-vite`, `dante-dev-db`, `dante-dev-adminer` |

Two consequences of fixed container names: `docker compose --scale app=2` is not possible, and the
development stack must keep its `dante-dev-` prefix so it can run next to production on the same
machine.

### Application name and locale surfaces

There is no single source of truth for the name, and this application does not have a version badge:

| Surface | Source | When it takes effect |
| --- | --- | --- |
| Blade `<title>` and the sidebar brand | `lang/{en,id}/panel.php` → `panel.site_title` (`DATEK`) | image rebuild |
| Session cookie name, cache prefix, mail sender name | `APP_NAME` container env (compose default `DATEK`) | container recreate |
| UI language | `VITE_VUE_APP_I18N_LOCALE` / `VITE_VUE_APP_I18N_FALLBACK_LOCALE`, baked into the JS bundle | image rebuild |
| Server locale | `SetPreferredLocale` middleware + `config/project.php` (`id` only) | image rebuild |

The two `VITE_VUE_APP_I18N_*` values are build args on the `assets` stage, defaulting to `id`:

```bash
docker buildx build --build-arg VITE_VUE_APP_I18N_LOCALE=id ...
```

`docker-compose.build.yml` passes both from `docker/.env`.

Because the browser title lives in a language file, changing `APP_NAME` alone does **not** rename the
tab. Change both. (Laravel 11+ reads `lang/` at the project root — `resources/lang/` is not used any
more.)

## 2. Prerequisites

On the machine that builds the images:

- Docker Engine 24+ with the `buildx` plugin (`docker buildx version`)
- Access to the registry namespace: `docker login` (use an access token, not your password)
- QEMU emulation if you build `linux/amd64` on an Apple Silicon or other arm64 machine — Docker
  Desktop provides it; on Linux install `binfmt` support
  (`docker run --privileged --rm tonistiigi/binfmt --install all`)
- Free disk space: the two-platform build needs several GB for the layer cache. `input/output error`,
  `Cannot open phar archive "/usr/bin/composer"` or `listing workers: … EOF` during a build mean the
  build host is out of disk, not that the image is corrupt — see §10.

Create a dedicated builder once. The default `docker` driver cannot build multi-platform images:

```bash
make builder
# equivalent to: docker buildx create --name multiarch --driver docker-container --bootstrap
```

Pass `--builder multiarch` to every build command below (or set it as the default with
`docker buildx use multiarch`).

## 3. Build and push

From the repository root, on a clean checkout of the commit you are releasing:

```bash
VERSION=2026-11-13.1

docker buildx build \
  --platform linux/amd64,linux/arm64 \
  --builder multiarch \
  -f Dockerfile --target prod \
  -t prismaeco/dante-app:${VERSION} \
  -t prismaeco/dante-app:latest \
  --push .

docker buildx build \
  --platform linux/amd64,linux/arm64 \
  --builder multiarch \
  -f Dockerfile --target web_prod \
  -t prismaeco/dante-nginx:${VERSION} \
  -t prismaeco/dante-nginx:latest \
  --push .
```

What each flag does:

- `--platform linux/amd64,linux/arm64` — builds both architectures into one manifest, so the same
  tag runs natively on an amd64 VM and on Apple Silicon.
- `--builder multiarch` — the `docker-container` builder that supports multi-platform output.
- `-f Dockerfile --target prod|web_prod` — selects the stage; there are no separate
  `docker/php/Dockerfile` / `docker/nginx/Dockerfile` files.
- `--push` — required for multi-platform builds; Docker cannot store a multi-arch manifest in the
  local image store.
- Two `-t` flags — the immutable version plus `latest`.

**Faster single-architecture release.** If the VM architecture is known and you do not need arm64,
build only that platform. This is roughly twice as fast:

```bash
VERSION=2026-11-13.1

docker buildx build --platform linux/amd64 --builder multiarch \
  -f Dockerfile --target prod \
  -t prismaeco/dante-app:${VERSION} -t prismaeco/dante-app:latest --push .

docker buildx build --platform linux/amd64 --builder multiarch \
  -f Dockerfile --target web_prod \
  -t prismaeco/dante-nginx:${VERSION} -t prismaeco/dante-nginx:latest --push .
```

**Make shortcut.** The same release through the `Makefile` — this is the supported path:

```bash
make release VERSION=2026-11-13.1
# override defaults when needed:
make release VERSION=2026-11-13.1 REGISTRY=ghcr.io/prismaeco PLATFORMS=linux/amd64
```

`make release` tags both images with `${VERSION}` and `latest`, using the `multiarch` builder. The
repository names are `dante-app` / `dante-nginx` under `REGISTRY` (default `prismaeco`).

> Releasing the wrong image names is the most common mistake: the commands must say `dante-app` /
> `dante-nginx`. A build that still says `pkab-app` pushes a tag nothing on the VM references.

### Building on the VM instead of a registry

Some stack managers can run containers but cannot build images. In that case build on the VM with
the CLI first, then let the manager start the stack — it only has to run the existing images.

```bash
cd /opt/dante
make prod-build   # docker compose ... -f docker-compose.prod.yml -f docker-compose.build.yml build
make prod-up      # up -d --no-build
```

The `build:` sections live in `docker-compose.build.yml`, not in the runtime file, so a stack manager
never sees them. Compose tags the images with the names from `APP_IMAGE` / `NGINX_IMAGE`, so the
build and the runtime always agree:

```dotenv
APP_IMAGE=prismaeco/dante-app:2026-11-13.1
NGINX_IMAGE=prismaeco/dante-nginx:2026-11-13.1
```

The build is native to the VM architecture — no platform pinning, no emulation.

Do **not** run `make prod-deploy` on a locally built tag: it runs `docker compose pull`, which would
overwrite your local image with the registry version of the same tag. Use `make prod-build &&
make prod-up` for local builds and `make prod-deploy` only for registry builds.

### Transferring images without a registry

When the VM cannot pull from a registry, build on the machine that has the source and copy the images
across as a tarball.

```bash
# build machine — cross-builds for the VM architecture
make save-images VERSION=2026-11-13.1 PLATFORM=linux/amd64   # -> dante-images.tar.gz

scp dante-images.tar.gz user@vm:/tmp/

# on the VM
gunzip -c /tmp/dante-images.tar.gz | docker load
docker compose --env-file docker/.env -f docker-compose.prod.yml up -d --no-build
```

- `PLATFORM` must match the VM: `linux/amd64` for most VPS, `linux/arm64` for ARM instances. The
  wrong value produces `exec format error` at runtime.
- Start with `up -d --no-build`, **not** `make prod-deploy` — the latter runs `pull` and would
  replace the loaded image with the registry copy.
- The nginx image already contains the built `public/build`, so nothing extra needs to be copied or
  committed for the frontend.

`dante-images.tar.gz` is gitignored. Don't commit image tarballs to git — every version would live in
the repository history forever.

### Verify the pushed tags

```bash
docker buildx imagetools inspect prismaeco/dante-app:2026-11-13.1
docker buildx imagetools inspect prismaeco/dante-nginx:2026-11-13.1
```

The output must list both `linux/amd64` and `linux/arm64`. A missing platform means the build ran
without `--platform` or with a single value.

Sanity-check the image starts and reports the expected versions. Use `--entrypoint` — the image's
entrypoint refuses to start in `APP_ENV=production` without an `APP_KEY`, so a bare `docker run` only
prints that guard:

```bash
docker run --rm --entrypoint php prismaeco/dante-app:2026-11-13.1 -v
docker run --rm --entrypoint php prismaeco/dante-app:2026-11-13.1 artisan --version
```

The two images must agree on the frontend bundle. Compare the manifest hash in both:

```bash
docker run --rm --entrypoint sha256sum prismaeco/dante-app:2026-11-13.1   public/build/manifest.json
docker run --rm --entrypoint sha256sum prismaeco/dante-nginx:2026-11-13.1 /var/www/html/public/build/manifest.json
```

A mismatch means one image is stale: the HTML references asset hashes the other container does not
have → 404s → blank page.

## 4. First deployment on the VM

The VM needs the repository for the compose files (the application code itself comes from the image).

```bash
git clone <repo-url> /opt/dante
cd /opt/dante
cp docker/.env.example docker/.env
make key                 # paste the value into APP_KEY
```

Edit `docker/.env`. `docker-compose.prod.yml` declares **no fallback defaults** — every `${VAR}` it
references must be present and non-empty, or the container starts with an empty string:

```dotenv
APP_NAME=DATEK
APP_KEY=base64:...
APP_URL=https://dante.example.com
APP_DOMAIN=dante.example.com
APP_TIMEZONE=Asia/Jakarta
APP_LOCALE=id
APP_FALLBACK_LOCALE=en

DB_CONNECTION=mysql
DB_DATABASE=dante
DB_USERNAME=dante
DB_PASSWORD=...
DB_ROOT_PASSWORD=...
MYSQL_VERSION=8.0

LOG_CHANNEL=stack
LOG_STACK=single
LOG_LEVEL=warning

CACHE_STORE=file
SESSION_DRIVER=file
SESSION_LIFETIME=120
SESSION_SECURE_COOKIE=true
QUEUE_CONNECTION=sync
BROADCAST_CONNECTION=log
FILESYSTEM_DISK=local

MAIL_MAILER=smtp
MAIL_HOST=...
MAIL_PORT=587
MAIL_USERNAME=...
MAIL_PASSWORD=...
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=no-reply@dante.example.com
MAIL_FROM_NAME=DATEK

SANCTUM_STATEFUL_DOMAINS=dante.example.com

APP_NETWORK=dante-internal
TRAEFIK_ENTRYPOINT=websecure
TRAEFIK_CERT_RESOLVER=letsencrypt
ADMINER_PORT=8081
ADMINER_VERSION=4.8.1

RUN_MIGRATIONS=false
CACHE_CONFIG=true

# Pin the released images
APP_IMAGE=prismaeco/dante-app:2026-11-13.1
NGINX_IMAGE=prismaeco/dante-nginx:2026-11-13.1
```

`docker/.env.example` also carries the build-time keys (`PHP_VERSION`, `NODE_VERSION`,
`COMPOSER_VERSION`, `NGINX_VERSION`, `VITE_VUE_APP_I18N_LOCALE`,
`VITE_VUE_APP_I18N_FALLBACK_LOCALE`). They only matter when the VM builds its own images
(§3, "Building on the VM"); `docker-compose.build.yml` supplies defaults for all of them.

Notes on the values that bite:

- `APP_URL` is **not** derived from `APP_DOMAIN`; set it to the public https URL including the scheme.
  A schemeless value makes `asset()` emit `host/build/...` and the browser resolves it relative to the
  current page (asset URLs with the host twice, CSS rejected as `text/html`).
- `SANCTUM_STATEFUL_DOMAINS` is a literal list of `host:port` entries. It must contain the exact host
  you browse the SPA with, or every API call returns `401` even though the login succeeded. Behind
  Traefik on the default ports, the bare hostname is enough; behind a port, add `host:port`.
- `MAIL_MAILER` must be a real transport: an empty value fails with `Mailer [] is not defined`.
- `APP_TIMEZONE` is applied to three layers (Laravel, the container `TZ`, and MySQL's session
  timezone). Set it once here; never set only one of them by hand — see [Timezones](DOCKER.md#timezones).
- `RUN_MIGRATIONS` stays `false` once the schema is in place; the `scheduler` service hardcodes it to
  `false` so it can never race the app container.
- `CACHE_CONFIG=true` makes the entrypoint run `php artisan optimize:clear` and then `php artisan
  optimize` on every start.

Confirm Traefik is running with the Docker provider and host networking:

```bash
docker inspect traefik --format '{{.HostConfig.NetworkMode}}'          # host
docker inspect traefik --format '{{json .Config.Cmd}}' | grep providers.docker
```

No external network has to be created: Traefik is on the host network and reaches the app over
`APP_NETWORK` (default `dante-internal`), which Compose creates.

Load the database (skip for a brand-new install and run migrations instead):

```bash
make db-import FILE=/path/to/dump.sql STACK=prod
```

The production compose file has no bind mounts, so the `docker/mysql/dump/` auto-import folder is
**development only**. On a VM, import with `make db-import` above or through Adminer (Import → choose
the `.sql` file).

Start the stack from the published images:

```bash
make prod-deploy   # docker compose pull + up -d --no-build
```

`--no-build` is important: without it Compose may build locally instead of using the pinned image.

Run migrations only if the database is empty or the dump has no schema:

```bash
make prod-migrate
```

or set `RUN_MIGRATIONS=true` for the first boot and back to `false` afterwards.

### Seeding a fresh database

```bash
make prod-artisan CMD="db:seed --force"
```

`DatabaseSeeder` calls `PermissionsTableSeeder`, `RolesTableSeeder`, `PermissionRoleTableSeeder`,
`UsersTableSeeder` and `RoleUserTableSeeder`, and creates exactly one user:

| Field | Value |
| --- | --- |
| username | `admin` |
| email | `profspio23@gmail.com` |
| password | `password` |

The login form accepts **either the username or the email address** in its single field. Change the
credentials (or delete the account) on anything reachable from the internet — the seeder is meant for
local work. `ServiceSeeder` exists but is **not** called by `DatabaseSeeder`.

### Running artisan commands

Every artisan command must run inside the container, because the containers get their configuration
from the Compose environment, not from the `.env` file in the repository root:

```bash
make prod-artisan CMD="about"
make prod-artisan CMD="migrate:status"
make prod-artisan CMD="db:seed --force"
make prod-shell                       # shell as www-data
```

Running `php artisan …` directly on the host uses the host `.env`, whose `DB_HOST` / `DB_PORT` point
at whatever MySQL that machine happens to run. On a workstation that is usually a *different* stack,
which surfaces as:

```
SQLSTATE[HY000] [1045] Access denied for user 'dante'@'172.18.0.1' (using password: YES)
```

The host `.env` is only for host-side tooling (IDE, `php -l`, Composer). Anything that touches the
database belongs in the container.

`docker compose exec` runs as `root`; the `Makefile` passes `-u www-data` for the shell and artisan
targets so files in `storage/` stay writable by PHP-FPM. Use the same flag when running commands by
hand.

## 5. Hostinger VPS (Docker Manager)

### Compatibility with KVM 1

| Resource | KVM 1 | Verdict |
| --- | --- | --- |
| CPU | 1 vCPU (AMD EPYC, x86_64) | Enough to **run** the stack; too slow to build on |
| RAM | 4 GB | Comfortable: MySQL ~400 MB, PHP-FPM ~150 MB, nginx/adminer ~40 MB |
| Disk | 50 GB NVMe | Plenty: images ~350 MB + database |
| Architecture | `linux/amd64` | Matches the multi-arch images published by `make release` |

Do not build the images on the VPS: `npm ci` + `npm run build` + `composer install` on 1 vCPU will
take a long time and can hit the memory limit. Publish with `make release` (or `make save-images`) and
let the VPS pull.

### Why the Docker Manager said "project not found"

The manager does not clone the repository. It only stores the compose text at
`/docker/<project-name>/docker-compose.yml` and runs `docker compose` there. Anything that depends on
files in the repository therefore fails before the project is created:

| Unsupported | Effect |
| --- | --- |
| `build:` | no source tree → build fails |
| `env_file: docker/.env` | file does not exist → Compose aborts |
| relative bind mounts (`./docker/...`) | paths do not exist → empty/broken mounts |
| `name:` at the top level | overrides the project name the manager tracks |
| an image tag that cannot be pulled | `pull access denied` → the project is never created |

`docker-compose.prod.yml` is written for exactly this environment: no `build:`, no `env_file:`, no
relative bind mounts, no top-level `name:`. All configuration is passed as `${VAR}` project
environment variables.

The compose file has **no fallback defaults** for those variables. A variable that is missing in the
panel is not an error — Compose substitutes an empty string, the containers start, and the failure
only shows up at runtime (`APP_KEY` empty → the app container exits; `MAIL_MAILER` empty → `Mailer []
is not defined`). Set every variable listed in section 4.

### Deploy

1. Publish the images (from your build machine):

   ```bash
   make release VERSION=2026-11-13.1
   ```

2. In hPanel → VPS → Docker Manager → Compose → **Compose manually**:
   - Project name: `dante` (3–64 chars, letters/digits/`-`/`_` only)
   - Paste the contents of `docker-compose.prod.yml`

3. Add **all** environment variables from section 4 to the project.

4. Deploy and watch the log:

   ```bash
   cat /docker/dante/.build.log
   docker ps -a
   docker logs dante-app --tail 50
   ```

5. Import the database through Adminer over an SSH tunnel (see [Adminer over SSH](DOCKER.md#4-adminer-over-ssh))
   or run migrations from the container terminal:

   ```bash
   docker exec -it dante-app php artisan migrate --force
   ```

### Notes

- The containers are named `dante-app`, `dante-nginx`, `dante-db`, `dante-adminer` and
  `dante-scheduler` (fixed `container_name`, no `-1` suffix), so `docker logs dante-app` works without
  looking up the generated name.
- The Traefik labels use `traefik.docker.network: ${APP_NETWORK}`, which the compose file creates.
  This works because Traefik runs with `network_mode: host`.
- The named volumes are pinned to `dante_mysql-data` and `dante_app-storage`, independent of the
  Compose project name, so a project rename does not orphan the database.
- If the project still does not appear, the deployment log above always contains the real error —
  "project not found" in the UI is only the symptom of a failed deploy.
- Keep `APP_IMAGE` / `NGINX_IMAGE` pinned to a released version; `latest` makes rollbacks ambiguous.
- `docker compose exec` runs as `root`. Use `docker exec -u www-data` for anything that writes to
  `storage/`.

## 6. Releasing an update

```bash
# 1. Build and push the new version from the build machine
VERSION=2026-11-20.1
docker buildx build --platform linux/amd64,linux/arm64 --builder multiarch \
  -f Dockerfile --target prod \
  -t prismaeco/dante-app:${VERSION} -t prismaeco/dante-app:latest --push .

docker buildx build --platform linux/amd64,linux/arm64 --builder multiarch \
  -f Dockerfile --target web_prod \
  -t prismaeco/dante-nginx:${VERSION} -t prismaeco/dante-nginx:latest --push .

# 2. On the VM: update the pins and roll out
cd /opt/dante
sed -i 's|^APP_IMAGE=.*|APP_IMAGE=prismaeco/dante-app:2026-11-20.1|' docker/.env
sed -i 's|^NGINX_IMAGE=.*|NGINX_IMAGE=prismaeco/dante-nginx:2026-11-20.1|' docker/.env
git pull                       # only if compose/config files changed
make prod-deploy   # docker compose pull + up -d --no-build

# 3. Migrations, when the release includes schema changes
make prod-migrate
```

Always update both images together: the nginx image ships the frontend assets that match the PHP
code. Changing any value in `docker/.env` also requires recreating the containers
(`make prod-down && make prod-up`), because config caching happens at container start.

### Rollback

```bash
sed -i 's|^APP_IMAGE=.*|APP_IMAGE=prismaeco/dante-app:2026-11-13.1|' docker/.env
sed -i 's|^NGINX_IMAGE=.*|NGINX_IMAGE=prismaeco/dante-nginx:2026-11-13.1|' docker/.env
make prod-deploy   # docker compose pull + up -d --no-build
```

Rolling back the code does **not** roll back the database. If the release ran destructive migrations,
restore the backup taken before the deploy (see [Backups and restore](#8-backups-and-restore)) or roll
the schema back explicitly.

### Scheduler and queues

`routes/console.php` defines no scheduled tasks, so `make prod-artisan CMD="schedule:list"` reports
none and the `dante-scheduler` container is idle by design. It runs
`php artisan schedule:work`, so a task added to `routes/console.php` (or via the `Schedule` facade)
takes effect on the next deploy without any compose change.

`QUEUE_CONNECTION` defaults to `sync`, which means queued work runs inside the request.
`App\Notifications\DataChangeEmailNotification` implements `ShouldQueue`, so it already benefits from
that; to move it to the database queue (the `jobs` table exists), set `QUEUE_CONNECTION=database` and
run a worker next to the stack:

```bash
docker compose --env-file docker/.env -f docker-compose.prod.yml run -d --name dante-queue \
  app php artisan queue:work --sleep=3 --tries=3
```

## 7. Post-deploy checklist

```bash
# Containers are up, no restarts
docker compose --env-file docker/.env -f docker-compose.prod.yml ps

# No fatal errors in the app log
docker compose --env-file docker/.env -f docker-compose.prod.yml logs app --tail=50
docker compose --env-file docker/.env -f docker-compose.prod.yml logs scheduler --tail=20

# Environment and caches are correct
make prod-artisan CMD="about"
# Migrations applied
make prod-artisan CMD="migrate:status"

# Health endpoint and HTTPS through Traefik
curl -I https://dante.example.com/up
curl -I https://dante.example.com/login
```

In the browser, verify:

- [ ] Login works with a **username** (the form also accepts an email address) and `/admin/dashboard`
      renders the sidebar and dashboard cards
- [ ] Assets load without 404s (hard reload to bypass the cached bundle)
- [ ] Orders: list, create, view, edit; photo uploads (dropzone) and the PDF report
      (`/report/{id}`) both work
- [ ] Services: list, edit, and the status column shows `Selesai` / `Belum`
- [ ] Users, roles and permissions CRUD pages load
- [ ] The language switcher still shows `ID` and the UI is translated
- [ ] An API token works: `curl -H "Authorization: Bearer <token>" https://dante.example.com/api/v1/users`
- [ ] The scheduler container is running (`docker ps | grep dante-scheduler`) and
      `make prod-artisan CMD="schedule:list"` runs
- [ ] Adminer is reachable through the SSH tunnel (`ssh -N -L 8081:127.0.0.1:8081`) and logs in with
      the DB credentials

## 8. Backups and restore

Back up the database before every release:

```bash
make backup
# or by hand:
docker compose --env-file docker/.env -f docker-compose.prod.yml exec -T db \
  sh -c 'exec mysqldump -u root -p"$MYSQL_ROOT_PASSWORD" --single-transaction --routines "$MYSQL_DATABASE"' \
  > backup-$(date +%Y-%m-%d).sql
```

Restore:

```bash
docker compose --env-file docker/.env -f docker-compose.prod.yml exec -T db \
  sh -c 'exec mysql -u root -p"$MYSQL_ROOT_PASSWORD" "$MYSQL_DATABASE"' < backup-2026-11-13.sql
```

Persistent data lives in the named volumes `dante_mysql-data` (database) and `dante_app-storage` (logs
and compiled views; uploads go to `storage/app/public`). The names are pinned in the compose file, so
they do not depend on the Compose project name. `docker compose down` keeps them; `docker compose down
-v` deletes them.

Back up the storage volume as well, since it is not in the database:

```bash
docker run --rm -v dante_app-storage:/data -v "$PWD":/backup alpine \
  tar czf /backup/storage-$(date +%Y-%m-%d).tar.gz -C /data .
```

## 9. Security notes

- `.env` is excluded from the image by `.dockerignore`; all secrets arrive as container environment
  variables at runtime.
- `docker/.env` holds production secrets — keep it `chmod 600` and out of git (already gitignored).
- Adminer is not published on a public port and has no Traefik router. It binds to `127.0.0.1` on the
  VM and is reachable only through an SSH tunnel — see
  [Adminer over SSH](DOCKER.md#4-adminer-over-ssh).
- The PHP-FPM master process runs as `root` (it needs to drop privileges itself); workers and every
  artisan command started by the entrypoint run as `www-data`.
- `bootstrap/app.php` trusts `X-Forwarded-*` from any proxy. That is only safe because the app
  container publishes no ports and is reachable exclusively through nginx/Traefik. Do not publish
  port 9000.
- `APP_DEBUG=false` in the image; Laravel renders its own error page (there is no Ignition — it was
  dropped with the Laravel 13 upgrade).
- There are no debug routes in `routes/web.php`. The only non-application routes are the framework
  ones: `/up` (health check, returns no application data), `/sanctum/csrf-cookie`, and
  `storage/{path}` for the public disk (`config/filesystems.php`, `serve => true`).
- The default seeder creates `admin` / `password`. Never seed a production database with it; create
  real users instead.
- Use a registry access token scoped to read/write for the release machine; the VM only needs pull
  access.

## 10. Troubleshooting

**`exec format error` / `no matching manifest for linux/amd64`** — the image architecture does not
match the VM. Build on the VM itself, or publish a multi-arch image (`make release`) and pull it.
Check a tag with `docker buildx imagetools inspect`.

**`pull access denied`** — wrong image name or not logged in on the VM. `docker login` and confirm
`APP_IMAGE` / `NGINX_IMAGE` match the pushed tags exactly (`dante-app`, not `pkab-app`).

**Compose rebuilds instead of pulling** — `up` was run without `--no-build`, or the image tag does not
exist locally. Run `docker compose ... pull` first, then `up -d --no-build`.

**502 from Traefik** — PHP-FPM is not ready or the app container crashed. Check `logs app`; a failed
start (usually an empty `APP_KEY`, a schemeless `APP_URL`, or a `require-dev` package used at runtime)
aborts the entrypoint. `laravel/ui` is a **runtime** dependency here because `routes/web.php` calls
`Auth::routes()`; moving it back to `require-dev` makes the production image crash with "In order to
use the Auth::routes() method, please install the laravel/ui package."

**502 after recreating only the `app` container** — nginx resolved `app:9000` to the old container IP
at start-up and keeps using it. Restart nginx after recreating `app` on its own:

```bash
docker restart dante-nginx
```

**Blank page after a deploy, old markup with new assets** — stale compiled Blade views in the
`storage` volume. The entrypoint runs `optimize:clear` on start; if it was skipped, run
`make prod-artisan CMD="optimize:clear"` and reload.

**Assets 404 after a rebuild (`/build/assets/app-XXXX.js`)** — `docker restart` keeps the old image.
Recreate the containers so nginx serves the new `public/build` that matches the manifest in the app
image: `make prod-build && make prod-up`.

**Assets 404 while running the production stack from a working tree** — the `public/build` on the host
is a leftover from a local `npm run build` and does not match the bundle baked into the image. Only
the image's `public/build` is served; ignore (or delete) the host copy.

**Login succeeds but every API call returns 401** — `SANCTUM_STATEFUL_DOMAINS` does not contain the
host and port you are browsing. It is a literal list: `dante.example.com` or
`localhost:8180,127.0.0.1:8180`. Change it, then recreate the containers.

**Asset URLs contain the host twice** (`https://host/host/build/assets/…`, and CSS is rejected with
`MIME type ('text/html')`) — `APP_URL` is missing its scheme. Set `APP_URL=https://host`; the
entrypoint refuses to start in production otherwise. Do not set `ASSET_URL` to the app URL — leave it
unset so assets stay root-relative and immune to this.

**`Access denied for user 'dante'@…` when running `php artisan` on the host** — you are running artisan
against the host `.env`, which points at a different MySQL. Use `make prod-artisan` / `make artisan`
(see §4, "Running artisan commands").

**`Please provide a valid cache path.`** — `storage/framework/views` is missing. The Dockerfile
creates the directories and the entrypoint recreates them, so this only appears if `storage` is
mounted from an empty volume with a stale image.

**The build dies with `input/output error`, `blob sha256:… expected at …: input/output error`,
`Cannot open phar archive "/usr/bin/composer"` or `listing workers: … EOF`** — the Docker host is out
of disk space. Those errors look like image or BuildKit corruption, but they are read/write failures:
check `df -h` first (macOS: `/System/Volumes/Data`) and `docker system df`. Free space with
`docker builder prune -a -f` and `docker image prune -a -f`, restart Docker Desktop so it compacts
`Docker.raw`, then recreate the crashed builder (`docker buildx rm multiarch && make builder`) — a
builder that lost its worker stays in `error` state even after space is freed.

**A cancelled `buildx` run leaves the images missing** — `make prod-deploy` then fails with
`failed to resolve reference …: not found`. Rebuild (`make prod-build`) or pull the published tag
first.

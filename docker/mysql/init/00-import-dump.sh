#!/bin/sh
# Imports every dump in /dump on the FIRST boot of an empty data volume.
# The dump must not contain CREATE DATABASE / USE statements that conflict with
# MYSQL_DATABASE.
set -e

for file in /dump/*.sql /dump/*.sql.gz; do
    [ -e "$file" ] || continue

    printf '[init] importing %s into %s\n' "$file" "$MYSQL_DATABASE"

    case "$file" in
        *.gz)
            gunzip -c "$file" | mysql -u root -p"$MYSQL_ROOT_PASSWORD" "$MYSQL_DATABASE"
            ;;
        *)
            mysql -u root -p"$MYSQL_ROOT_PASSWORD" "$MYSQL_DATABASE" < "$file"
            ;;
    esac
done

#!/bin/sh
set -e

echo "Aguardando MySQL em ${DATABASE_HOST}:${DATABASE_PORT}..."
while ! nc -z "$DATABASE_HOST" "$DATABASE_PORT"; do
  sleep 1
done
echo "MySQL pronto."

# Em dev, geramos migrações automaticamente para refletir mudanças nos models.
# Em produção, migrações devem estar versionadas no repositório.
if [ "${DJANGO_DEBUG}" = "true" ]; then
  python manage.py makemigrations --noinput
fi

python manage.py migrate --noinput
python manage.py create_admin || true
python manage.py seed_portfolio || true

if [ "${DJANGO_DEBUG}" = "true" ]; then
  exec python manage.py runserver 0.0.0.0:8000
else
  python manage.py collectstatic --noinput
  exec gunicorn config.wsgi:application --bind 0.0.0.0:8000 --workers 3 --access-logfile -
fi

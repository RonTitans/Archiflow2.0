#!/bin/sh

echo "Waiting for database..."
while ! nc -z $DATABASE_HOST $DATABASE_PORT; do
  sleep 1
done

echo "Database is ready!"

echo "Creating migrations for users app..."
python manage.py makemigrations users --noinput

echo "Creating migrations for all apps..."
python manage.py makemigrations --noinput

echo "Applying migrations..."
python manage.py migrate --noinput

echo "Collecting static files..."
python manage.py collectstatic --noinput

echo "Starting server..."
python manage.py runserver 0.0.0.0:8000
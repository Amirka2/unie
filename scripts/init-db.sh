#!/bin/sh

echo "Waiting for PostgreSQL to start..."
max_retries=30
retry_count=0

until PGPASSWORD=$DATABASE_PASSWORD psql -h $DATABASE_HOST -p $DATABASE_PORT -U $DATABASE_USER -d $DATABASE_DB_NAME -c '\q' 2>/dev/null; do
  retry_count=$((retry_count+1))
  
  if [ $retry_count -ge $max_retries ]; then
    echo "Error: PostgreSQL is not available after $max_retries attempts."
    exit 1
  fi
  
  echo "PostgreSQL is unavailable - sleeping ($retry_count/$max_retries)"
  sleep 2
done

echo "PostgreSQL is up - executing migrations"

# Generate Prisma Client
echo "Generating Prisma Client..."
npx prisma generate

# Run migrations
echo "Running database migrations..."
npx prisma migrate deploy

echo "Database initialization completed!"

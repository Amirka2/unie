FROM node:18 AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Установка необходимых пакетов
RUN apt-get update && apt-get install -y \
    postgresql-client \
    netcat-traditional \
    && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json* ./
COPY prisma ./prisma/
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Добавляем аргументы для сборки
ARG DATABASE_URL
ARG DATABASE_HOST
ARG DATABASE_PORT
ARG DATABASE_USER
ARG DATABASE_PASSWORD
ARG DATABASE_NAME

# Устанавливаем переменные окружения
ENV DATABASE_URL=${DATABASE_URL}
ENV DATABASE_HOST=${DATABASE_HOST}
ENV DATABASE_PORT=${DATABASE_PORT}
ENV DATABASE_USER=${DATABASE_USER}
ENV DATABASE_PASSWORD=${DATABASE_PASSWORD}
ENV DATABASE_NAME=${DATABASE_NAME}
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_OPTIONS="--experimental-json-modules"

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npx prisma generate
# TODO удалить флаг
RUN npm run build --debug

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_OPTIONS="--experimental-json-modules"

# Добавляем аргументы для production
ARG DATABASE_URL
ARG DATABASE_HOST
ARG DATABASE_PORT
ARG DATABASE_USER
ARG DATABASE_PASSWORD
ARG DATABASE_NAME

# Устанавливаем переменные окружения
ENV DATABASE_URL=${DATABASE_URL}
ENV DATABASE_HOST=${DATABASE_HOST}
ENV DATABASE_PORT=${DATABASE_PORT}
ENV DATABASE_USER=${DATABASE_USER}
ENV DATABASE_PASSWORD=${DATABASE_PASSWORD}
ENV DATABASE_NAME=${DATABASE_NAME}

RUN apt-get update && apt-get install -y \
    postgresql-client \
    netcat-traditional \
    && rm -rf /var/lib/apt/lists/*

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Копируем необходимые файлы
COPY --from=builder --chown=nextjs:nodejs /app/next.config.mjs ./
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma

# Создаем скрипт для проверки доступности базы данных
RUN echo '#!/bin/bash\n\
echo "Waiting for database to be ready..."\n\
\n\
while ! nc -z $DATABASE_HOST $DATABASE_PORT; do\n\
  echo "Database is not ready - sleeping for 2 seconds"\n\
  sleep 2\n\
done\n\
\n\
echo "Database is ready!"\n\
echo "Running database migrations..."\n\
npx prisma migrate deploy\n\
\n\
echo "Starting application..."\n\
NODE_OPTIONS="--experimental-json-modules" exec node server.js\n\
' > /app/wait-for-db.sh

RUN chmod +x /app/wait-for-db.sh

USER nextjs

EXPOSE 3000

CMD ["/app/wait-for-db.sh"]

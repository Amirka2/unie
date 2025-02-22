FROM node:18 AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
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
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED=1

RUN npx prisma migrate dev --name init
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
# disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

# Используем Node.js как базовый образ
FROM node:18

# Устанавливаем необходимые пакеты
RUN apt-get update && apt-get install -y \
    postgresql-client \
    netcat-traditional \
    && rm -rf /var/lib/apt/lists/*

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci

# Копируем все файлы проекта
COPY . .

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
echo "Starting build..."\n\
npm run build\n\
\n\
echo "Starting application..."\n\
exec npm start\n\
' > /app/wait-for-db.sh

# Делаем скрипт исполняемым
RUN chmod +x /app/wait-for-db.sh

# Открываем порт
EXPOSE 3000

# Запускаем скрипт ожидания базы данных и затем приложение
CMD ["/app/wait-for-db.sh"]

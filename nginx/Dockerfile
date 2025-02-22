FROM nginx:alpine

# Удаляем дефолтный конфиг
RUN rm /etc/nginx/conf.d/default.conf

# Копируем наш конфиг
COPY nginx.conf /etc/nginx/nginx.conf
COPY conf.d/app.conf /etc/nginx/conf.d/app.conf

# Создаем директорию для логов
RUN mkdir -p /var/log/nginx

# Проверяем конфигурацию
RUN nginx -t

EXPOSE 80 443 3000

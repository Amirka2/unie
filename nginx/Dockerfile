FROM nginx:alpine

# Удаляем дефолтный конфиг
RUN rm /etc/nginx/conf.d/default.conf

# Копируем наш конфиг
COPY nginx.conf /etc/nginx/nginx.conf
COPY conf.d/app.conf /etc/nginx/conf.d/app.conf

# Создаем директорию для логов
RUN mkdir -p /var/log/nginx

EXPOSE 80 443 3000

# Используем shell форму CMD чтобы добавить проверку доступности nextjs
CMD sh -c 'until ping -c1 nextjs &>/dev/null; do echo "Waiting for nextjs..."; sleep 2; done && nginx -g "daemon off;"'

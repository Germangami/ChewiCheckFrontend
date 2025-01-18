# Этап 1: сборка проекта Angular
FROM node:20.16.0 as build

WORKDIR /app

# Копируем файлы package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Устанавливаем Angular CLI
RUN npm install -g @angular/cli

# Копируем исходный код проекта
COPY . .

# Строим проект для продакшн-режима
RUN ng build --configuration=production

# Этап 2: установка nginx для обслуживания проекта
FROM nginx:latest

# Копируем собранный проект из предыдущего этапа в папку nginx
COPY --from=build /app/dist/chewi-check-frontend/browser /usr/share/nginx/html

# Открываем порт 80 для nginx
EXPOSE 4200
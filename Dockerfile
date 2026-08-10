FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
COPY apps/www/package.json apps/www/package.json
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine AS runtime

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/apps/www/dist /usr/share/nginx/html

EXPOSE 80

# Stage 0 - Build Frontend Assets
FROM node:16-alpine as build

WORKDIR /app
COPY package*.json ./
# Install git before running yarn install
RUN apk add --no-cache git
RUN yarn install
COPY . .
RUN yarn run build

# Stage 1 - Serve Frontend Assets
FROM fholzer/nginx-brotli:v1.12.2

WORKDIR /etc/nginx
ADD nginx.conf /etc/nginx/nginx.conf

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 443
CMD ["nginx", "-g", "daemon off;"]

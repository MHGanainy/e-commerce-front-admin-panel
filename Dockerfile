FROM node:13.10.1-alpine3.10 as build-step
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run buildOpt
ENV API amazon:rds/connection?string


# FROM nginx:1.16.0-alpine as prod-stage
# COPY --from=build-step /app/dist/ecommerce-frontend-new /usr/share/nginx/html
# EXPOSE 80
# CMD ["nginx","-g","daemon off;"]

FROM nginx:1.16.0-alpine as prod-stage
COPY --from=build-step /app/dist/ecommerce-frontend-new /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 4200
CMD ["nginx","-g","daemon off;"]


#docker build -t ecommercefront .
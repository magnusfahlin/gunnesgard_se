# Stage 1
FROM node:13.12.0 as react-build
WORKDIR /app
COPY . ./
RUN yarn
RUN yarn build

# Stage 2 - the production environment
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=react-build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

# https://medium.com/greedygame-engineering/so-you-want-to-dockerize-your-react-app-64fbbb74c217
# docker build . -t magnusfahlin/gunnesgard_client
# docker run -p 8000:80 magnusfahlin/gunnesgard_client
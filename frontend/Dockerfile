FROM node:20-alpine AS build
WORKDIR /app
COPY package.json /app/package.json
RUN npm install
COPY . /app
RUN npm run build

FROM node:20-alpine
WORKDIR /app
RUN npm i -g serve
COPY --from=build /app/dist /app/dist
EXPOSE 8080
CMD ["serve", "-s", "dist", "-l", "8080"]

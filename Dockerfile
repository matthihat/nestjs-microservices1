# Stage 1 - the build process
FROM node:20 as build-deps
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2 - the dev environment
FROM node:20
WORKDIR /usr/src/app
COPY --from=build-deps /usr/src/app .
CMD ["npm", "run", "start:dev"]

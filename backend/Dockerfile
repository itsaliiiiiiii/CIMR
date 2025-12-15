FROM node:18-alpine

WORKDIR /app

# Install build dependencies for bcrypt
RUN apk add --no-cache python3 make g++

COPY package*.json ./

# Install dependencies with rebuild of bcrypt
RUN npm install
RUN npm rebuild bcrypt --build-from-source

COPY . .

EXPOSE 4000

CMD ["npm", "start"]
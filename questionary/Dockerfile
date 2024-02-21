FROM ubuntu:latest

# Install vim
RUN apt-get update && apt-get install -y vim

FROM node:18.15.0

WORKDIR /app

# Copy dependencies
COPY package*.json ./

# Install them
RUN npm install

# Copy code
COPY . .

# Expose 3000
EXPOSE 3000

CMD ["npm", "start"]

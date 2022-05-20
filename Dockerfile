FROM node:alpine

RUN apk add --no-cache bash curl

# Create app directory
RUN mkdir -p /usr/src/app
RUN npm install nodemon -g
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install

# Bundle app source
COPY . /usr/src/app

EXPOSE 5000
CMD ["npm","start"]

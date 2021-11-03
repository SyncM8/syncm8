FROM node:latest

# for our app
EXPOSE 3000
# for docker
EXPOSE 35729

WORKDIR /home/node/app

COPY package.json .
COPY package-lock.json .
RUN npm install


ENTRYPOINT [ "npm", "start"]

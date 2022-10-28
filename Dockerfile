FROM node:16.16.0-alpine3.16
WORKDIR /bonefire

COPY package.json .
COPY package-lock.json .
RUN npm install
COPY . . 
EXPOSE 2500
CMD ["node", "index.js"]


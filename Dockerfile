FROM node:16 As development

RUN mkdir -p usr/src/app

WORKDIR /usr/src/app

COPY package.json ./
RUN npm install -g nodemon && npm install
COPY . .
EXPOSE 5000

#CMD ["npm","run","dev"]


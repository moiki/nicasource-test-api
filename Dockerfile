FROM node:16 As development

RUN mkdir -p usr/src/app

WORKDIR /usr/src/app

COPY package.json ./
RUN npm install
COPY . .
EXPOSE 5000

CMD ["npm","run","dev"]
#CMD ["npm","start"]
FROM node:alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

COPY . .

COPY --from=development /usr/src/app/dist ./dist

CMD ["npm", "start"]

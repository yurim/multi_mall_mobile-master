FROM node:14.15-alpine

EXPOSE 3001

ARG NODE_ENV
ENV NODE_ENV=${NODE_ENV}
ARG DEPLOY_TARGET
ENV DEPLOY_TARGET=${DEPLOY_TARGET:-molly}

RUN echo "\033[0;36mSETTING : ${NODE_ENV} \033[0m"

RUN apk add python make g++ yarn curl

RUN mkdir /app
WORKDIR /app

ADD package.json yarn.lock /app/
RUN yarn install --pure-lockfile --production=false
ADD . /app

RUN yarn build

ENV HOST 0.0.0.0
ENV PORT 3001

CMD ["yarn", "start"]

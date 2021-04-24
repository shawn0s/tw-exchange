FROM node:12-alpine AS builder

RUN apk add --update-cache  yarn 

WORKDIR /app
COPY ./package.json ./
RUN yarn
COPY . .
RUN yarn build


FROM node:12-alpine
WORKDIR /app
COPY --from=builder /app ./
CMD ["yarn", "start"]
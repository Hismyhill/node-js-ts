FROM node:22-alpine AS builder
RUN apk update
RUN apk add --no-cache libc6-compat
#   Set working directory
WORKDIR /app
COPY . .
RUN
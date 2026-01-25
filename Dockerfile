FROM node:22-alpine AS builder
RUN apk update
RUN apk add --no-cache libc6-compat
#   Set working directory
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

FROM node:22-alpine AS installer
RUN apk update
RUN apk add --no-cache libc6-compat
RUN apk add --no-cache openssl
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts .
COPY --from=builder /app/package.json .
COPY --from=builder /app/package-lock.json .
RUN npm ci --omit=dev
RUN npm run prisma:generate

FROM node:22-alpine AS runner
RUN apk update
RUN apk add --no-cache libc6-compat
RUN apk add --no-cache openssl
WORKDIR /app
# Don't run production as root
RUN addgroup -S -g 1001 expressjs
RUN adduser -S -u 1001 -G expressjs expressjs
USER expressjs
COPY --from=installer --chown=expressjs:expressjs /app .

EXPOSE 3000
CMD [ "npm", "run", "docker-start" ]
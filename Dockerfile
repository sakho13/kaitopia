FROM node:20.11.0-slim AS base


FROM base AS deps

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm ci


FROM base AS builder

ENV NODE_ENV=production
ENV TZ=Asia/Tokyo

WORKDIR /app
RUN apt-get update -y && apt-get install -y openssl

COPY .env .env
COPY package.json package-lock.json* ./
COPY ./src ./src
COPY ./public ./public
COPY ./prisma ./prisma
COPY ./image ./image
COPY next.config.ts tsconfig.json postcss.config.mjs components.json eslint.config.mjs ./

RUN npm run prisma:generate

RUN npm run build


FROM node:20.11.0 AS runner

ENV NODE_ENV=production
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

RUN mkdir .next
RUN chown -R nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
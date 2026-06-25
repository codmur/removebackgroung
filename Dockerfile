# Etapa 1: Construcción
FROM node:22-alpine AS build
WORKDIR /app

# Limitar memoria de Node para evitar OOM
ENV NODE_OPTIONS="--max-old-space-size=1024"

# Habilitar corepack para usar pnpm
RUN corepack enable

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build

# Etapa 2: Ejecución
FROM node:22-alpine
WORKDIR /app

# TanStack Start SSR (Nitro) genera la build en .output
COPY --from=build /app/.output /app/.output

ENV HOST=0.0.0.0
ENV PORT=3000
EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]

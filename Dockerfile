# Stage 1: Build
FROM oven/bun:1 AS builder
WORKDIR /app

# Copy package files
COPY package.json bun.lock ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code

COPY . .

# Build
RUN bun run build-only

# Stage 2: Production
FROM oven/bun:1-alpine
WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./

RUN bun add -g serve

EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]

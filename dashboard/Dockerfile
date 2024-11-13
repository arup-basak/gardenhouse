# Change base image to bun
FROM oven/bun AS base

FROM base AS deps
WORKDIR /app

# Simplified dependency installation with bun
COPY package.json ./
RUN bun install

# Builder stage
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Simplified build command using bun
RUN bun run build

# Runner stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create non-root user
RUN addgroup --system --gid 1001 bunjs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:bunjs .next

# Copy build output
# COPY --from=builder --chown=nextjs:bunjs /app/.next/standalone ./
# COPY --from=builder --chown=nextjs:bunjs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Use bun to run the server
CMD ["bun", "start"]
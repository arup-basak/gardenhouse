# Use Node.js LTS (Long Term Support) as base image
FROM node:20-slim

# Install openssl - Add this before setting WORKDIR
RUN apt-get update && apt-get install -y openssl

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json pnpm-lock.yaml* ./
COPY tsconfig.json ./
COPY prisma ./prisma/

# Install dependencies
RUN pnpm install

RUN npx prisma generate

# Copy Prisma schema first to optimize build cache
COPY prisma ./prisma

# Copy source code
COPY . .

# Build TypeScript code
RUN pnpm run build

# Expose port (adjust if your app uses a different port)
EXPOSE 8080

# Start the application
CMD ["pnpm", "start"]

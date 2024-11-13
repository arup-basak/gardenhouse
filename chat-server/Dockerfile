FROM node:20-slim

# Install openssl - Add this before setting WORKDIR
RUN apt-get update && apt-get install -y openssl

WORKDIR /app

RUN npm install -g pnpm

# Copy Prisma files first for better layer caching
COPY prisma ./prisma
COPY package*.json pnpm-lock.yaml* ./

# Install dependencies using pnpm
RUN pnpm install

# Generate Prisma client after dependencies are installed
RUN pnpx prisma generate

# Copy remaining source code
COPY . .

# Build TypeScript code
RUN pnpm run build

EXPOSE 5000

CMD ["pnpm", "start"]

# Use a Node LTS image
FROM node:20-slim

# Set working directory
WORKDIR /app

# Install build tools needed for native modules
RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y \
    python3 \
    make \
    g++ \
    git \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install PNPM globally
RUN npm install -g pnpm

# Copy package files first to leverage Docker cache
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install

# Copy app code
COPY . .

# Build the app
RUN pnpm run build

# Expose the port your app uses
EXPOSE 3000

# Start the app
CMD ["node", ".output/server/index.mjs"]

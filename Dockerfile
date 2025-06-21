# Node.js 22 is Active LTS as of June 2025
# Reference: https://nodejs.org/en/about/previous-releases
FROM node:22-slim

# Set api/ as working directory in container
WORKDIR /api

# Copy and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of source code
COPY . .

# Compile TypeScript to JavaScript in dist/
RUN npm run build

# Start server using built JS output
CMD ["node", "dist/index.js"]
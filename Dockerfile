FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Install dependencies needed for Prisma and native extensions
RUN apk add --no-cache openssl

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy Prisma schema and generate client
COPY prisma ./prisma/
RUN npx prisma generate

# Copy the rest of the application
COPY . .

# Expose port
EXPOSE 5000

# Command to run in development (supports hot-reloading if mounted)
CMD ["npm", "run", "dev"]

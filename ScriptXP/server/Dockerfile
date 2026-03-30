# Use highly efficient Alpine Linux as the base with NodeJS pre-installed
FROM node:18-alpine

# Install all language compilers required for the Execution Engine
# g++ (C++), gcc (C), python3 (Python), openjdk11 (Java)
RUN apk update && \
    apk add --no-cache \
    g++ \
    gcc \
    python3 \
    openjdk11

# Set Working Directory inside the Docker Container
WORKDIR /app

# Copy package.json and install required dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the backend files
COPY . .

# Ensure the temp executable directory exists inside Docker
RUN mkdir -p temp

# Expose the correct port
EXPOSE 5000

# Start the Express API
CMD ["npm", "start"]

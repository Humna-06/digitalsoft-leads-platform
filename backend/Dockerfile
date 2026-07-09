# Dockerfile - packages the backend into a container image
# This lets the backend run identically on any machine (your laptop, Render, AWS, etc.)

# Start from an official lightweight Node.js image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package files first (before the rest of the code).
# Docker caches this layer, so "npm install" only re-runs when
# dependencies actually change - not on every code edit. Speeds up rebuilds.
COPY package*.json ./
RUN npm install --production

# Now copy the rest of the backend code
COPY . .

# Document which port the app listens on (matches PORT in .env)
EXPOSE 5000

# Command that runs when the container starts
CMD ["node", "server.js"]

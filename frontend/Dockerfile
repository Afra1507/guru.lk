# ===== Stage 1: Install dependencies =====
FROM node:20-alpine as deps
WORKDIR /app

# Copy package files first to leverage Docker cache
COPY package.json package-lock.json ./

# Install dependencies with legacy peer deps, offline if possible, no audit
RUN npm ci --legacy-peer-deps --prefer-offline --no-audit && npm cache clean --force

# ===== Stage 2: Build the app =====
FROM node:20-alpine as build
WORKDIR /app

# Copy installed node_modules from previous stage
COPY --from=deps /app/node_modules ./node_modules

# Copy the rest of the source code
COPY . .

# Build the React app
RUN npm run build

# ===== Stage 3: Serve with Nginx =====
FROM nginx:alpine

# Copy the build output to Nginx's html folder
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Run Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]

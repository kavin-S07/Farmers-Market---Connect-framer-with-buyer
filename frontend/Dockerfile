# ---------- Stage 1: Build ----------
FROM node:18-alpine AS build

WORKDIR /app

# Copy dependency files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy all source code
COPY . .

# Build React app (uses REACT_APP_* variables)
RUN npm run build

# ---------- Stage 2: Nginx ----------
FROM nginx:alpine

# Remove default config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build files
COPY --from=build /app/build /usr/share/nginx/html

# Expose port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
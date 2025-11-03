############################################
# STAGE 1 — Build the frontend
############################################
FROM node:20-alpine AS build

WORKDIR /app

# Copy install files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire source code
COPY . .

# Build static files
RUN npm run build


############################################
# STAGE 2 — Serve with Nginx
############################################
FROM nginx:alpine

# Copy built frontend from Stage 1
COPY --from=build /app/dist /usr/share/nginx/html

# Remove default Nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Add our production nginx config
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

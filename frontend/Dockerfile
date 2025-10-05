# Use Node.js 20 for building Angular app
FROM node:20 as build

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy rest of frontend code
COPY . .

# Build Angular app for production (force dist/app output)
RUN npm run build -- --output-path=dist/app

# Use nginx to serve the built app
FROM nginx:alpine

# Remove default nginx files
RUN rm -rf /usr/share/nginx/html/*

# Copy Angular dist output to nginx
COPY --from=build /app/dist/app /usr/share/nginx/html

# Copy custom nginx config for Angular routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

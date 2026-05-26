FROM nginx:alpine

COPY . /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Clean up non-web files from html directory
RUN rm -f /usr/share/nginx/html/nginx.conf \
    /usr/share/nginx/html/nginx-ssl.conf \
    /usr/share/nginx/html/Dockerfile \
    /usr/share/nginx/html/docker-compose.yml \
    /usr/share/nginx/html/deploy.sh \
    /usr/share/nginx/html/.dockerignore

# Routing is handled by Nginx try_files and redirects.

EXPOSE 80

FROM nginx:alpine

COPY . /usr/share/nginx/html

# Clean up non-web files from html directory
RUN rm -f /usr/share/nginx/html/nginx.conf \
    /usr/share/nginx/html/nginx-ssl.conf \
    /usr/share/nginx/html/Dockerfile \
    /usr/share/nginx/html/docker-compose.yml \
    /usr/share/nginx/html/deploy.sh \
    /usr/share/nginx/html/.dockerignore

# Create extensionless copies of HTML files so /blog works without .html
RUN cd /usr/share/nginx/html && \
    for f in *.html; do \
        cp "$f" "${f%.html}"; \
    done && \
    cd pages/posts && \
    for f in *.html; do \
        cp "$f" "${f%.html}"; \
    done

EXPOSE 80

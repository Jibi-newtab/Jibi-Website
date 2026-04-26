#!/bin/bash
set -e

DOMAIN="jibitab.ir"
EMAIL=""  # ایمیلت رو اینجا بنویس

echo "=== Jibi Website Deploy ==="

# 1. Install Docker if not installed
if ! command -v docker &> /dev/null; then
    echo "Installing Docker..."
    curl -fsSL https://get.docker.com | sh
    systemctl start docker
    systemctl enable docker
fi

# 2. Install Docker Compose if not installed
if ! command -v docker compose &> /dev/null; then
    echo "Installing Docker Compose plugin..."
    apt-get update && apt-get install -y docker-compose-plugin
fi

# 3. Get SSL certificate (first time only)
if [ ! -d "/etc/letsencrypt/live/$DOMAIN" ]; then
    echo "Getting SSL certificate for $DOMAIN..."

    # Start temporary nginx for certbot challenge
    docker run --rm -d \
        --name temp-nginx \
        -p 80:80 \
        -v "$(pwd)/nginx.conf:/etc/nginx/conf.d/default.conf:ro" \
        -v "$(pwd)/certbot-www:/var/www/certbot:ro" \
        nginx:alpine

    sleep 2

    # Get certificate
    docker run --rm \
        -v "$(pwd)/certbot-certs:/etc/letsencrypt" \
        -v "$(pwd)/certbot-www:/var/www/certbot" \
        certbot/certbot certonly \
        --webroot \
        --webroot-path=/var/www/certbot \
        -d "$DOMAIN" \
        -d "www.$DOMAIN" \
        --email "$EMAIL" \
        --agree-tos \
        --non-interactive

    # Stop temp nginx
    docker stop temp-nginx

    echo "SSL certificate obtained!"
else
    echo "SSL certificate already exists, skipping..."
fi

# 4. Build and start
echo "Building and starting containers..."
docker compose build
docker compose up -d

echo ""
echo "=== Deploy Complete! ==="
echo "Site: https://$DOMAIN"
echo ""
echo "Useful commands:"
echo "  docker compose logs -f         # View logs"
echo "  docker compose restart         # Restart"
echo "  docker compose down            # Stop"
echo "  docker compose up -d --build   # Rebuild & restart"

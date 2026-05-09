#!/bin/bash
set -e

DOMAIN="${DOMAIN:-jibitab.ir}"
EMAIL="${EMAIL:-}"

if [ -z "$EMAIL" ]; then
    echo "ERROR: Please set EMAIL environment variable (e.g. EMAIL=you@example.com ./deploy.sh)"
    exit 1
fi

echo "=== Jibi Website Deploy ==="
echo "Domain: $DOMAIN"
echo

# 1. Install Docker if missing
if ! command -v docker &> /dev/null; then
    echo "Installing Docker..."
    curl -fsSL https://get.docker.com | sh
    systemctl start docker
    systemctl enable docker
fi

# 2. Install Docker Compose plugin if missing
if ! docker compose version &> /dev/null; then
    echo "Installing Docker Compose plugin..."
    apt-get update && apt-get install -y docker-compose-plugin
fi

# 3. Create named volumes upfront (so we can seed them before nginx-ssl.conf needs them)
docker volume create jibi-website_certbot-certs >/dev/null 2>&1 || \
    docker volume create $(basename "$PWD")_certbot-certs >/dev/null 2>&1 || true
docker volume create jibi-website_certbot-www >/dev/null 2>&1 || \
    docker volume create $(basename "$PWD")_certbot-www >/dev/null 2>&1 || true

# Detect actual volume names (compose prefixes them with project dir)
PROJECT="$(basename "$PWD" | tr '[:upper:]' '[:lower:]' | tr -cd 'a-z0-9_-')"
CERTS_VOLUME="${PROJECT}_certbot-certs"
WWW_VOLUME="${PROJECT}_certbot-www"

# 4. Seed a self-signed dummy cert so nginx-ssl.conf can load on first start
SEED_NEEDED=0
if ! docker run --rm -v "$CERTS_VOLUME:/etc/letsencrypt" alpine \
        test -f "/etc/letsencrypt/live/$DOMAIN/fullchain.pem"; then
    SEED_NEEDED=1
fi

if [ "$SEED_NEEDED" -eq 1 ]; then
    echo "No real certificate yet — seeding a dummy self-signed cert so nginx can boot..."
    docker run --rm \
        -v "$CERTS_VOLUME:/etc/letsencrypt" \
        alpine/openssl req -x509 -nodes -newkey rsa:2048 -days 1 \
            -keyout "/etc/letsencrypt/live/$DOMAIN/privkey.pem" \
            -out "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" \
            -subj "/CN=localhost" 2>/dev/null || \
    docker run --rm \
        -v "$CERTS_VOLUME:/etc/letsencrypt" \
        --entrypoint sh \
        alpine -c "
            apk add --no-cache openssl >/dev/null
            mkdir -p /etc/letsencrypt/live/$DOMAIN
            openssl req -x509 -nodes -newkey rsa:2048 -days 1 \
                -keyout /etc/letsencrypt/live/$DOMAIN/privkey.pem \
                -out   /etc/letsencrypt/live/$DOMAIN/fullchain.pem \
                -subj '/CN=localhost'
        "
fi

# 5. Build & start nginx (it now boots successfully with the dummy cert)
echo "Building and starting containers..."
docker compose build
docker compose up -d web

# 6. Request the real Let's Encrypt cert if we don't have one yet
if [ "$SEED_NEEDED" -eq 1 ]; then
    echo "Requesting real certificate from Let's Encrypt for $DOMAIN..."
    sleep 3  # give nginx a moment to listen on :80

    docker run --rm \
        -v "$CERTS_VOLUME:/etc/letsencrypt" \
        -v "$WWW_VOLUME:/var/www/certbot" \
        certbot/certbot certonly \
            --webroot -w /var/www/certbot \
            -d "$DOMAIN" -d "www.$DOMAIN" \
            --email "$EMAIL" \
            --agree-tos --no-eff-email \
            --force-renewal \
            --non-interactive

    echo "Reloading nginx with the real cert..."
    docker compose exec web nginx -s reload
fi

# 7. Start the certbot renewal loop
docker compose up -d certbot

echo
echo "=== Deploy complete ==="
echo "Site:  https://$DOMAIN"
echo
echo "Useful commands:"
echo "  docker compose logs -f             # tail logs"
echo "  docker compose restart web         # restart web only"
echo "  docker compose down                # stop everything"
echo "  docker compose up -d --build       # rebuild & restart"
echo "  docker compose exec web nginx -s reload   # reload nginx (after cert renewal)"

# Jibi - Official Website

Official website for [Jibi](https://jibitab.ir) — a free Chrome extension for customizing the new tab page.

## About

Jibi turns your new tab into a personal dashboard with:

- Custom themes and backgrounds
- Persian (Jalali) calendar
- Weather widget
- To-Do list
- Bookmark management
- Music player
- Dark / Light mode
- Backup & Restore (JSON export)

## Project Structure

```
.
├── index.html              # Homepage
├── blog.html               # Blog listing
├── contact.html            # Contact page
├── 404.html                # Error page
├── pages/posts/            # Blog articles
│   ├── customization.html
│   ├── bookmarks.html
│   ├── dark-mode.html
│   ├── speed-tips.html
│   ├── update-2.html
│   ├── idea-story.html
│   └── privacy.html
├── assets/
│   ├── css/                # Stylesheets
│   ├── js/                 # Common + page scripts
│   ├── fonts/              # IranYekanX (woff2)
│   └── images/             # WebP images
├── nginx.conf              # HTTP dev config
├── nginx-ssl.conf          # HTTPS production config
├── docker-compose.yml      # Docker orchestration
├── deploy.sh               # One-command deploy with Let's Encrypt
└── Dockerfile
```

## Tech Stack

- HTML5
- CSS3 (custom, no framework)
- JavaScript (Vanilla)
- IranYekanX Font (Persian typeface)
- Nginx (Alpine)
- Docker + Docker Compose

## Features

- Fully static — no backend required
- Responsive design
- Dark mode support
- Full RTL (Right-to-Left)
- Smooth animations with `prefers-reduced-motion` respect
- SEO optimized (canonical, Open Graph, JSON-LD, sitemap)
- Let's Encrypt SSL via Certbot (auto-renewal)

## Deployment

Requires a server with Docker installed.

```bash
# Set your email for Let's Encrypt
EMAIL=you@example.com ./deploy.sh
```

The script will:
1. Install Docker if missing
2. Seed a temporary self-signed certificate so Nginx can boot
3. Build and start the containers
4. Request a real Let's Encrypt certificate
5. Start the auto-renewal loop

## Useful Commands

```bash
docker compose logs -f
docker compose restart web
docker compose exec web nginx -s reload
docker compose down
```

## Links

- [Download from Chrome Web Store](https://chromewebstore.google.com/detail/jibi-%E2%80%93-custom-new-tab-pro/joifpkieabcifkikfhngjcjoochaloga)

## License

Made with care for the Persian-speaking community.

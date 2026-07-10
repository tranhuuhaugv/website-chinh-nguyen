#!/usr/bin/env bash
# Deploy nhanh trên VPS. Dùng: bash deploy.sh
set -e
cd /var/www/website-chinh-nguyen

echo "→ Lấy code mới..."
git pull

echo "→ Cài package..."
npm install

echo "→ Build..."
npm run build

echo "→ Nạp lại app..."
pm2 reload chinhnguyen

echo "✅ Deploy xong!"

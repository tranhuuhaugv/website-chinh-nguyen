#!/usr/bin/env bash
# Deploy nhanh trên VPS. Dùng: bash deploy.sh
set -e
cd /var/www/website-chinh-nguyen

echo "→ Lấy code mới..."
git fetch origin master
git reset --hard origin/master

echo "→ Cài package..."
npm install

echo "→ Đồng bộ schema DB..."
npx prisma db push

echo "→ Build sạch..."
rm -rf .next
npm run build

echo "→ Khởi động lại app..."
pm2 restart chinhnguyen

echo "✅ Deploy xong!"

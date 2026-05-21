import { copyFileSync, existsSync, mkdirSync, readdirSync } from 'fs';
import path from 'path';

if (!existsSync('public')) {
  mkdirSync('public');
}

const assetsDir = path.join('src', 'assets', 'images');
const files = readdirSync(assetsDir);
const iconFile = files.find(f => f.startsWith('pwa_icon_'));

if (iconFile) {
  const iconPath = path.join(assetsDir, iconFile);
  copyFileSync(iconPath, path.join('public', 'pwa-192x192.png'));
  copyFileSync(iconPath, path.join('public', 'pwa-512x512.png'));
  copyFileSync(iconPath, path.join('public', 'apple-touch-icon.png'));
  copyFileSync(iconPath, path.join('public', 'favicon.ico'));
  copyFileSync(iconPath, path.join('public', 'masked-icon.svg'));
  console.log("Icons copied!");
}

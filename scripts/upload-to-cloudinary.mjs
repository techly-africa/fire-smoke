#!/usr/bin/env node
/**
 * scripts/upload-to-cloudinary.mjs
 *
 * One-time script: uploads all /public/photos/ to Cloudinary
 * under the folder "fire-smoke/gallery".
 *
 * Usage:
 *   node scripts/upload-to-cloudinary.mjs
 *
 * Requires .env to have:
 *   CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
 */

import { readFileSync, readdirSync } from 'fs';
import { join, basename, extname } from 'path';
import { createHash } from 'crypto';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// ── Load .env manually (no dotenv dependency needed) ──────────────────────────
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, '..', '.env');
const env = Object.fromEntries(
  readFileSync(envPath, 'utf8')
    .split('\n')
    .filter(l => l && !l.startsWith('#') && l.includes('='))
    .map(l => {
      const [k, ...v] = l.split('=');
      return [k.trim(), v.join('=').trim()];
    })
);

const CLOUD  = env['CLOUDINARY_CLOUD_NAME'];
const KEY    = env['CLOUDINARY_API_KEY'];
const SECRET = env['CLOUDINARY_API_SECRET'];
const FOLDER = 'fire-smoke/gallery';

if (!CLOUD || !KEY || !SECRET) {
  console.error('❌  Missing Cloudinary credentials in .env');
  process.exit(1);
}

// ── Cloudinary signed upload ──────────────────────────────────────────────────
function sign(params) {
  const str = Object.keys(params)
    .sort()
    .map(k => `${k}=${params[k]}`)
    .join('&') + SECRET;
  return createHash('sha1').update(str).digest('hex');
}

async function uploadFile(filePath) {
  const filename = basename(filePath, extname(filePath));
  const publicId = `${FOLDER}/${filename}`;
  const timestamp = Math.floor(Date.now() / 1000);

  const params = { folder: FOLDER, public_id: publicId, timestamp };
  const signature = sign(params);

  const form = new FormData();
  const blob = new Blob([readFileSync(filePath)]);
  form.append('file', blob, basename(filePath));
  form.append('api_key', KEY);
  form.append('timestamp', String(timestamp));
  form.append('signature', signature);
  form.append('folder', FOLDER);
  form.append('public_id', publicId);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`,
    { method: 'POST', body: form }
  );
  const data = await res.json();

  if (!res.ok || data.error) {
    throw new Error(data.error?.message ?? `HTTP ${res.status}`);
  }

  return { filename: basename(filePath), publicId: data.public_id, url: data.secure_url };
}

// ── Main ─────────────────────────────────────────────────────────────────────
const photosDir = join(__dirname, '..', 'public', 'photos');
const files = readdirSync(photosDir).filter(f =>
  ['.jpg', '.jpeg', '.png', '.webp'].includes(extname(f).toLowerCase())
);

console.log(`\n📤  Uploading ${files.length} files to Cloudinary (${CLOUD}/${FOLDER})...\n`);

const results = [];
for (const file of files) {
  const filePath = join(photosDir, file);
  try {
    process.stdout.write(`  ⬆  ${file} ... `);
    const result = await uploadFile(filePath);
    results.push(result);
    console.log(`✅  ${result.url}`);
  } catch (err) {
    console.log(`❌  ${err.message}`);
  }
}

// ── Print mapping for data.ts ─────────────────────────────────────────────────
console.log('\n\n─────────────────────────────────────────────────');
console.log('📋  Copy this mapping into data.ts:\n');
for (const r of results) {
  // e.g. '/photos/p01-grill-portrait.jpeg' → Cloudinary URL
  const localPath = `/photos/${r.filename}`;
  console.log(`  '${localPath}' → '${r.url}'`);
}
console.log('─────────────────────────────────────────────────\n');

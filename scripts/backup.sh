#!/bin/bash
# =============================================================
# backup.sh — Export all Supabase tables to timestamped JSON
# Usage: ./scripts/backup.sh
# Requires: VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
#           in .env (service role needed for protected tables)
# =============================================================

set -e

# Load env
source "$(dirname "$0")/../.env" 2>/dev/null || true

SUPABASE_URL="${VITE_SUPABASE_URL}"
ANON_KEY="${VITE_SUPABASE_ANON_KEY}"
SERVICE_KEY="${SUPABASE_SERVICE_ROLE_KEY}"

if [ -z "$SUPABASE_URL" ]; then
  echo "❌  VITE_SUPABASE_URL not set in .env"
  exit 1
fi

TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
BACKUP_DIR="$(dirname "$0")/../backups/${TIMESTAMP}"
mkdir -p "$BACKUP_DIR"

echo "📦  Backing up to: backups/${TIMESTAMP}/"

# Pick the right key: service role for protected tables, anon for public
AUTH_KEY="${SERVICE_KEY:-$ANON_KEY}"
if [ -z "$SERVICE_KEY" ]; then
  echo "⚠️   SUPABASE_SERVICE_ROLE_KEY not set — using anon key."
  echo "    Bookings (protected by RLS) may not export fully."
  echo "    Add SUPABASE_SERVICE_ROLE_KEY to .env for complete backups."
fi

fetch_table() {
  local TABLE=$1
  local FILE="${BACKUP_DIR}/${TABLE}.json"
  echo -n "  → ${TABLE}... "
  HTTP_STATUS=$(curl -s -o "$FILE" -w "%{http_code}" \
    "${SUPABASE_URL}/rest/v1/${TABLE}?select=*&limit=10000" \
    -H "apikey: ${AUTH_KEY}" \
    -H "Authorization: Bearer ${AUTH_KEY}" \
    -H "Accept: application/json")
  if [ "$HTTP_STATUS" = "200" ]; then
    COUNT=$(python3 -c "import json,sys; data=json.load(open('$FILE')); print(len(data))" 2>/dev/null || echo "?")
    echo "✅  ${COUNT} rows"
  else
    echo "❌  HTTP ${HTTP_STATUS}"
  fi
}

fetch_table "bookings"
fetch_table "cms"
fetch_table "settings"
fetch_table "tiers"

echo ""
echo "✅  Backup complete: backups/${TIMESTAMP}/"
echo "    Files: $(ls "$BACKUP_DIR" | tr '\n' ' ')"

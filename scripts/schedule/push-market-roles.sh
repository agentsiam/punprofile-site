#!/bin/bash
# Pushes the evening's published roles into Convex for the candidate feed.
# Fired hourly by com.punprofile.push-market-roles; runs only at 19:xx
# Europe/Berlin, after daily-jobs (18:05). FORCE=1 runs it now.
set -uo pipefail

APP_DIR="/Users/paulb/Documents/LTD OS/punprofile-career/punprofile-profile-app"

if [ "${FORCE:-0}" != "1" ] && [ "$(TZ=Europe/Berlin date +%H)" != "19" ]; then
  exit 0
fi

cd "$APP_DIR" || exit 1

# The script lives on whatever branch is checked out. Until the feed work is on
# master it is absent there, which is a reason to wait, not to fail loudly.
if [ ! -f scripts/push-market-roles.ts ]; then
  echo "$(date) skipped: scripts/push-market-roles.ts is not on the checked-out branch"
  exit 0
fi

npx tsx scripts/push-market-roles.ts

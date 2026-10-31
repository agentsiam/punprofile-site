#!/bin/bash
# Installs or reinstalls the push-market-roles launchd agent. Run on the Mac.
set -euo pipefail

SRC="/Users/paulb/Documents/LTD OS/punprofile-career/punprofile-profile-app/scripts/schedule/com.punprofile.push-market-roles.plist"
DST="$HOME/Library/LaunchAgents/com.punprofile.push-market-roles.plist"

mkdir -p "$HOME/Library/Logs/punprofile"
launchctl bootout "gui/$(id -u)/com.punprofile.push-market-roles" 2>/dev/null || true
cp "$SRC" "$DST"
chmod 644 "$DST"
chmod +x "$(dirname "$SRC")/push-market-roles.sh"
launchctl bootstrap "gui/$(id -u)" "$DST"

# One forced run now, so the install proves itself without waiting for 19:35.
FORCE=1 /bin/bash "$(dirname "$SRC")/push-market-roles.sh"
launchctl print "gui/$(id -u)/com.punprofile.push-market-roles" | grep -E "state|last exit" || true

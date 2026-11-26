#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
command -v git >/dev/null || { echo 'Installer git dans Termux.'; exit 1; }
command -v gh >/dev/null || { echo 'Installer gh dans Termux.'; exit 1; }
gh auth status
if [[ ! -d .git ]]; then git init -b main; fi
if [[ "$(git branch --show-current)" != main ]]; then echo 'Branche différente de main : arrêt.'; exit 1; fi
if ! git config user.name >/dev/null; then git config user.name janintibo-art; fi
if ! git config user.email >/dev/null; then gh api user --jq '.id as $id | .login as $login | "\($id)+\($login)@users.noreply.github.com"' | xargs -r git config user.email; fi
git add .
if ! git diff --cached --quiet; then git commit -m 'V1 - Simulateur de pliage et détection géométrique'; fi
if git remote get-url origin >/dev/null 2>&1; then
  case "$(git remote get-url origin)" in https://github.com/janintibo-art/pliage-machine|https://github.com/janintibo-art/pliage-machine.git|git@github.com:janintibo-art/pliage-machine.git) git push -u origin main;; *) echo 'Origin différent du dépôt prévu : arrêt.'; exit 1;; esac
else
  gh repo create janintibo-art/pliage-machine --public --source=. --remote=origin --push
fi

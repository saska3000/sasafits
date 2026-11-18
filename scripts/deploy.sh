#!/bin/zsh
# Собирает приложение и выкладывает его на GitHub Pages (ветка gh-pages)
set -e
cd "$(dirname "$0")/.."
REMOTE="$(git remote get-url origin)"
npm run build
cd dist
touch .nojekyll
rm -rf .git
git init -q -b gh-pages
git add -A
git -c user.name="$(git -C .. config user.name)" -c user.email="$(git -C .. config user.email)" commit -q -m "Сборка $(date '+%Y-%m-%d %H:%M')"
git -c credential.helper= -c 'credential.helper=!gh auth git-credential' push -q -f "$REMOTE" gh-pages
rm -rf .git
echo "Готово: через минуту обновится https://saska3000.github.io/sasafits/"

const version = $(npm version patch)
echo "version: $version"

git add .
git commit -m "chore: release $version"
git push

npm publish --access public
echo "publish: $publish"
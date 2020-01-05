#!/usr/bin/env bash

cd deploy/zmfund-front
git remote -v
git checkout $1
git pull
rm -r deploy/zmfund-front/static
find . -type f -not \( -name '.git' -or -name '*.git' \) -delete

cd ../../
yarn build
cp -r build/* deploy/zmfund-front

cd  deploy/zmfund-front
git remote -v
git add .
git commit -m $1
git push

cd ../../

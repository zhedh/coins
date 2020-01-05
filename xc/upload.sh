#!/usr/bin/env bash

cd deploy/zmfund-front
git remote -v
git checkout $1
git pull
rm -r static
ls | grep -v -E ".git|.gitignore" | xargs rm -rf

cd ../../
yarn build
cp -r build/* deploy/zmfund-front

cd  deploy/zmfund-front
git remote -v
git add .
git commit -m $1
git push

cd ../../

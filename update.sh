#!/bin/sh
cd /home/liuliang/git/w3ctech;
git pull;
npm i;
sh build.sh
cd output;
cp -r * /home/liuliang/www/w3ctech/;
cd /home/liuliang/www/w3ctech/;
#pm2 restart pm2.json;

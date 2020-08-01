#!/bin/bash
cp ~/config/campathon_config.json ~/$2/config/production.json
cd ~/$2
export PATH=$PATH:$1
$1/npm install
$1/pm2 restart ./ecosystem.config.js
echo "Done"
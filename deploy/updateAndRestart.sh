#!/bin/bash
cd ~/$2
export PATH=$PATH:$1
$1/npm install
$1/pm2 restart ./ecosystem.config.js
echo "Done"
#!/bin/bash

cd ~/Campathon/Campathon2019
git pull
export PATH=$PATH:$1
$1/npm install
$1/pm2 restart campathon_backend

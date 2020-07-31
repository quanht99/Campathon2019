#!/bin/bash

cd ~/$2
git pull
npm install
# $1/pm2 restart campathon_backend

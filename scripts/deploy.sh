#!/bin/bash

# Deployea la ultima version que se encuentra en master del backend

ssh server << 'ENDSSH'
pm2 stop api
cd Proyects/backend
git checkout master
git pull
npm i
pm2 start api
ENDSSH


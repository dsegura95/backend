#!/bin/bash

# Reinicia la BD con los datos por defecto
ssh server << 'ENDSSH'
pm2 stop api
su - nodejs
cd proyects/backend
git checkout master
git pull
sudo -u postgres psql -f data_base/generator.sql
sudo -u postgres psql -f data_base/filler.sql
exit
pm2 start api
ENDSSH


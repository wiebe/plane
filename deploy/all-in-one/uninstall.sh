#!/bin/bash

export BASE_DIR=/opt/plane
export REDIS_DIR=$BASE_DIR/redis
export DB_DIR=$BASE_DIR/db
export MINIO_DIR=$BASE_DIR/minio

# uninstall minio
echo '***********************************************************************'
echo "Uninstalling Minio"
echo

sudo dpkg --configure -a
sudo service minio stop
sudo systemctl disable plane-minio.service
sudo rm -rf /etc/systemd/system/plane-minio.service
sudo rm -rf /usr/local/bin/minio

# remove minio user
sudo userdel minio-user
sudo rm -rf /home/minio-user

# remove minio folder
sudo rm -rf $MINIO_DIR

#uninstall postgres
echo '***********************************************************************'
echo "Uninstalling Postgres"
echo

sudo dpkg --configure -a
sudo service postgresql stop
sudo apt-get --purge remove postgresql postgresql-* -y
sudo rm -rf $DB_DIR

#uninstall redis
echo '***********************************************************************'
echo "Uninstalling Redis"
echo

sudo dpkg --configure -a
sudo service redis-server stop
sudo apt-get --purge remove redis-server redis-tools -y
sudo rm -rf $REDIS_DIR

#uninstall nginx
echo '***********************************************************************'
echo "Uninstalling Nginx"
echo

sudo dpkg --configure -a
sudo service nginx stop
sudo apt-get --purge remove nginx nginx-* -y

#uninstall nodejs
echo '***********************************************************************'
echo "Uninstalling Nodejs"
echo

sudo dpkg --configure -a
sudo apt-get --purge remove nodejs -y

#uninstall python
echo '***********************************************************************'
echo "Uninstalling Python"
echo

sudo dpkg --configure -a
sudo apt-get --purge remove python3.11 python3.11-dev python3.11-distutils python3.11-venv -y



# # disable web-app service
# sudo systemctl stop plane-web.service
# sudo systemctl disable plane-web.service
# sudo rm /etc/systemd/system/plane-web.service

# # disable space-app service
# sudo systemctl stop plane-space.service
# sudo systemctl disable plane-space.service
# sudo rm /etc/systemd/system/plane-space.service

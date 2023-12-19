#!/bin/bash

export BASE_DIR=/opt/plane
export DB_DIR=$BASE_DIR/db
export REDIS_DIR=$BASE_DIR/redis
export MINIO_DIR=$BASE_DIR/minio
export SERVICE_DIR=$BASE_DIR/services

sudo apt-get -qq update 
# sudo apt upgrade -y

#install dev tools
sudo apt-get -qq install -y git nano curl wget ncdu htop

sudo mkdir -p $BASE_DIR
sudo mkdir -p $SERVICE_DIR

#***********************************************************************
# install python 3.11
echo '***********************************************************************'
echo "Installing python 3.11"
echo 

sudo apt -qq install -y software-properties-common
sudo add-apt-repository -y ppa:deadsnakes/ppa
sudo apt -qq install -y python3.11 python3.11-dev python3.11-distutils python3.11-venv python3-pip

sudo ln -s /usr/bin/python3.11 /usr/local/bin/python

#***********************************************************************
#install redis
echo '***********************************************************************'
echo "Installing redis"
echo 
sudo apt-get -qq install -y redis-server

#***********************************************************************
#install nginx
echo '***********************************************************************'
echo "Installing nginx"
echo 
sudo apt-get -qq install -y nginx

#install certbot
echo "Installing certbot"
echo 
sudo apt-get -qq install -y certbot python3-certbot-nginx

sudo rm -rf /etc/nginx/sites-enabled/default

#***********************************************************************
#install nodejs 18
echo '***********************************************************************'
echo "Installing Node.js 18"
echo 
sudo apt-get -qq update
sudo apt-get -qq install -y ca-certificates curl gnupg
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | sudo gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg

export NODE_MAJOR=18
echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" | sudo tee /etc/apt/sources.list.d/nodesource.list

sudo apt-get -qq update
sudo apt-get -qq install nodejs -y
sudo npm i -g yarn

#***********************************************************************
#ask for installing local postgress or use remote
echo '***********************************************************************'
echo 
read -p "Do you want to install local postgresql? (y/n) [y]: " install_local_postgres

#install postgresql 14
if [ "$install_local_postgres" == 'y' ] || [ "$install_local_postgres" == 'Y' ] || [ "$install_local_postgres" == '' ]; then
    echo '***********************************************************************'
    echo "Installing postgresql 14"
    echo 

    sudo apt-get -qq install -y postgresql-14 postgresql-client-14 postgresql-contrib-14

    sudo service postgresql stop

    #modify postgresql.conf to listen on all interfaces 
    sudo sed -i "s@#listen_addresses = 'localhost'@listen_addresses = '*'@" /etc/postgresql/14/main/postgresql.conf

    #modify data folder permissions
    sudo rm -rf $DB_DIR
    sudo mkdir -p $DB_DIR
    sudo chown -R postgres:postgres $DB_DIR
    sudo chmod 700 $DB_DIR

    sudo rsync -av /var/lib/postgresql/14/main/ $DB_DIR

    #modify postgresql data folder path
    sudo sed -i "s@data_directory = '\/var\/lib\/postgresql\/14\/main'@data_directory = '$DB_DIR'@" /etc/postgresql/14/main/postgresql.conf

    sudo service postgresql start

    #create postgresql database
    sudo su - postgres -c "psql -c \"CREATE DATABASE plane;\""
    sudo su - postgres -c "psql -c \"CREATE USER plane WITH PASSWORD 'plane';\""
    sudo su - postgres -c "psql -c \"GRANT ALL PRIVILEGES ON DATABASE plane TO plane;\""
fi

#***********************************************************************
#install minio

#ask for installing local minio or use remote aws s3
echo '***********************************************************************'
read -p "Do you want to install local Minio storage? (y/n) [y]: " install_local_minio
echo 

if [ "$install_local_minio" == 'y' ] || [ "$install_local_minio" == 'Y' ] || [ "$install_local_minio" == '' ]; then
    #install minio
    echo '***********************************************************************'
    echo "Installing minio"
    echo 
    sudo wget https://dl.min.io/server/minio/release/linux-amd64/minio -O /usr/local/bin/minio
    sudo chmod +x /usr/local/bin/minio

    # create service file for minio
    export MINIO_OPTS="--console-address :9001"
    export MINIO_VOLUMES="$BASE_DIR/minio"

    sudo useradd -r minio-user -s /sbin/nologin
    sudo mkdir -p /usr/local/share/minio
    sudo chown minio-user:minio-user /usr/local/share/minio
    sudo mkdir -p /etc/default

    # create minio environment config file
    sudo tee $SERVICE_DIR/minio.env &>/dev/null <<EOF
# Volume to be used for MinIO server.
MINIO_VOLUMES="$MINIO_DIR"

# Use if you want to run MinIO on a custom port.
MINIO_OPTS="--console-address :9001"

# Minio Default Credentials
MINIO_ROOT_USER="access-key"
MINIO_ROOT_PASSWORD="secret-key"
EOF

    sudo cp $SERVICE_DIR/minio.env /etc/default/minio
    sudo chown minio-user:minio-user /etc/default/minio

    #set minio folder permission
    sudo mkdir -p $MINIO_DIR
    sudo chown -R minio-user:minio-user $MINIO_DIR

    # create minio service file
    sudo tee $SERVICE_DIR/minio.service &>/dev/null <<EOF
[Unit]
Description=MinIO
Documentation=https://docs.min.io
Wants=network-online.target
After=network-online.target
AssertFileIsExecutable=/usr/local/bin/minio

[Service]
WorkingDirectory=/usr/local
User=minio-user
Group=minio-user
ProtectProc=invisible
EnvironmentFile=-/etc/default/minio
ExecStartPre=/bin/bash -c "if [ -z \"${MINIO_VOLUMES}\" ]; then echo \"Variable MINIO_VOLUMES not set in /etc/default/minio\"; exit 1; fi"
ExecStart=/usr/local/bin/minio server $MINIO_OPTS $MINIO_VOLUMES
# Let systemd restart this service always
Restart=always
# Specifies the maximum file descriptor number that can be opened by this process
LimitNOFILE=65536
# Specifies the maximum number of threads this process can create
TasksMax=infinity
# Disable timeout logic and wait until process is stopped
TimeoutStopSec=infinity
SendSIGKILL=no

[Install]
WantedBy=multi-user.target
EOF

    #enable minio service
    sudo cp $SERVICE_DIR/minio.service /etc/systemd/system/minio.service
    sudo systemctl enable minio.service
    
    sudo service minio start
fi
#!/bin/bash

#***********************************************************************
# download plane code from github

export CODE_BRANCH=${1:-master}
export CODE_DIR=~/plane-code
export TEMP_DIR=/tmp/plane

export BASE_DIR=/opt/plane
export WEB_DIR=$BASE_DIR/web
export SPACE_DIR=$BASE_DIR/space
export BACKEND_DIR=$BASE_DIR/backend
export SERVICE_DIR=$BASE_DIR/services

export WEB_PORT=3100
export SPACE_PORT=3200
export BACKEND_PORT=3300

echo "Downloading plane code from github"
echo 
rm -rf $CODE_DIR
git clone -b $CODE_BRANCH https://github.com/makeplane/plane $CODE_DIR

#***********************************************************************

export LAST_DIR=$(pwd)

#***********************************************************************
#Compile the Application
cd $CODE_DIR

# sudo cp start.sh /usr/local/bin/plane-start.sh
# sudo chmod +x /usr/local/bin/plane-start.sh

sudo yarn global add turbo
#***********************************************************************
#build web-app


sudo rm -rf $TEMP_DIR 
TEMP_DIR=$(mktemp -d -t plane-XXXXXXXXXX)

cd $CODE_DIR

sudo rm -rf $CODE_DIR/out
turbo prune --scope=web --docker

sudo cp -r $CODE_DIR/out/json/* $TEMP_DIR/
sudo cp $CODE_DIR/out/yarn.lock $TEMP_DIR/yarn.lock
cd $TEMP_DIR
sudo yarn install

sudo cp -r $CODE_DIR/out/full/* $TEMP_DIR/
sudo cp $CODE_DIR/turbo.json $TEMP_DIR/turbo.json

sudo yarn turbo run build --filter=web

sudo rm -rf $WEB_DIR
sudo mkdir -p $WEB_DIR

sudo cp $TEMP_DIR/web/next.config.js $WEB_DIR/next.config.js
sudo cp $TEMP_DIR/web/package.json $WEB_DIR/package.json

sudo cp -rf $TEMP_DIR/web/.next/standalone/* $WEB_DIR/
sudo mkdir -p $WEB_DIR/web/.next
sudo cp -r $TEMP_DIR/web/.next/* $WEB_DIR/web/.next/

#create service file for web-app
sudo tee $SERVICE_DIR/plane-web.service &>/dev/null <<EOF
[Unit]
Description=Plane-Web App
After=network.target
[Service]
User=$USER
Group=$USER
Environment=PORT=$WEB_PORT
WorkingDirectory=$WEB_DIR
ExecStart=node web/server.js web
Restart=on-failure
[Install]
WantedBy=multi-user.target
EOF

# #enable web-app service
sudo cp $SERVICE_DIR/plane-web.service /etc/systemd/system/plane-web.service
sudo systemctl enable plane-web.service

sudo rm -rf $TEMP_DIR 

#***********************************************************************
#build space-app

sudo rm -rf $TEMP_DIR
TEMP_DIR=$(mktemp -d -t plane-XXXXXXXXXX)

cd $CODE_DIR

sudo rm -rf $CODE_DIR/out
turbo prune --scope=space --docker

sudo cp -r $CODE_DIR/out/json/* $TEMP_DIR/
sudo cp $CODE_DIR/out/yarn.lock $TEMP_DIR/yarn.lock
cd $TEMP_DIR
sudo yarn install

sudo cp -r $CODE_DIR/out/full/* $TEMP_DIR/
sudo cp $CODE_DIR/turbo.json $TEMP_DIR/turbo.json

sudo NEXT_PUBLIC_API_BASE_URL="" NEXT_PUBLIC_DEPLOY_WITH_NGINX=1 yarn turbo run build --filter=space

sudo rm -rf $SPACE_DIR
sudo mkdir -p $SPACE_DIR

sudo cp $TEMP_DIR/space/next.config.js $SPACE_DIR/next.config.js
sudo cp $TEMP_DIR/space/package.json $SPACE_DIR/package.json

sudo cp -rf $TEMP_DIR/space/.next/standalone/* $SPACE_DIR/
sudo mkdir -p $SPACE_DIR/space/{.next,public}
sudo cp -r $TEMP_DIR/space/.next/* $SPACE_DIR/space/.next/
sudo cp -r $TEMP_DIR/space/public/* $SPACE_DIR/space/public

#create service file for space-app
sudo tee $SERVICE_DIR/plane-space.service &>/dev/null <<EOF
[Unit]
Description=Plane-Space App
After=network.target
[Service]
User=$USER
Group=$USER
Environment=PORT=$SPACE_PORT
WorkingDirectory=$SPACE_DIR
ExecStart=node space/server.js space
Restart=on-failure
[Install]
WantedBy=multi-user.target
EOF

# #enable space-app service
sudo cp $SERVICE_DIR/plane-space.service /etc/systemd/system/plane-space.service
sudo systemctl enable plane-space.service

sudo rm -rf $TEMP_DIR

#***********************************************************************
#build backend

sudo rm -rf $BACKEND_DIR
sudo mkdir -p $BACKEND_DIR

sudo apt-get install -y \
    libpq-dev libxslt1-dev \
    xmlsec1 libxmlsec1-dev \
    libxmlsec1 openssl \
    libxml2-dev libffi-dev

sudo cp $CODE_DIR/apiserver/requirements.txt $BACKEND_DIR
sudo cp -r $CODE_DIR/apiserver/requirements $BACKEND_DIR

cd $BACKEND_DIR

export PYTHONDONTWRITEBYTECODE=1
export PYTHONUNBUFFERED=1
export PIP_DISABLE_PIP_VERSION_CHECK=1

pip install -r requirements.txt --compile --no-cache-dir \

sudo cp $CODE_DIR/apiserver/manage.py $BACKEND_DIR/manage.py
sudo cp -r $CODE_DIR/apiserver/plane $BACKEND_DIR
sudo cp -r $CODE_DIR/apiserver/templates $BACKEND_DIR

sudo cp $CODE_DIR/apiserver/package.json $BACKEND_DIR/package.json
sudo cp -r $CODE_DIR/apiserver/bin $BACKEND_DIR

sudo chmod +x $BACKEND_DIR/bin/takeoff $BACKEND_DIR/bin/worker $BACKEND_DIR/bin/beat

sudo cp $CODE_DIR/deploy/selfhost/variables.env $SERVICE_DIR/plane.env
sudo cp $SERVICE_DIR/plane.env /etc/default/plane

#***********************************************************************
#create service file for plane-backend
sudo tee $SERVICE_DIR/plane-backend.service &>/dev/null <<EOF
[Unit]
Description=Plane-Backend App
After=network.target

[Service]
User=$USER
Group=$USER
Environment=PORT=$BACKEND_PORT
EnvironmentFile=/etc/default/plane
WorkingDirectory=$BACKEND_DIR
ExecStart=./bin/takeoff
Restart=on-failure

[Install]
WantedBy=multi-user.target
EOF

# #enable backend service
sudo cp $SERVICE_DIR/plane-backend.service /etc/systemd/system/plane-backend.service
sudo systemctl enable plane-backend.service

#***********************************************************************
#create service file for plane-worker
sudo tee $SERVICE_DIR/plane-worker.service &>/dev/null <<EOF
[Unit]
Description=Plane-Worker App
After=network.target

[Service]
User=$USER
Group=$USER
EnvironmentFile=/etc/default/plane
WorkingDirectory=$BACKEND_DIR
ExecStart=./bin/worker
Restart=on-failure

[Install]
WantedBy=multi-user.target
EOF

# #enable worker service
sudo cp $SERVICE_DIR/plane-worker.service /etc/systemd/system/plane-worker.service
sudo systemctl enable plane-worker.service


#***********************************************************************
#create service file for plane-beat-worker
sudo tee $SERVICE_DIR/plane-beat-worker.service &>/dev/null <<EOF
[Unit]
Description=Plane-Beat-Worker App
After=network.target

[Service]
User=$USER
Group=$USER
EnvironmentFile=/etc/default/plane
WorkingDirectory=$BACKEND_DIR
ExecStart=./bin/beat
Restart=on-failure

[Install]
WantedBy=multi-user.target
EOF

# #enable beat-worker service
sudo cp $SERVICE_DIR/plane-beat-worker.service /etc/systemd/system/plane-beat-worker.service
sudo systemctl enable plane-beat-worker.service

sudo tee $SERVICE_DIR/plane.sh &>/dev/null <<EOF
#!/bin/bash

action=\$1

if [ "\$action" == "start" ]; then
    echo "Starting plane services"

    service plane-web start
    service plane-space start
    service plane-backend start
    service plane-worker start
    service plane-beat-worker start
elif [ "\$action" == "stop" ]; then
    echo "Stopping plane services"

    service plane-web stop
    service plane-space stop
    service plane-backend stop
    service plane-worker stop
    service plane-beat-worker stop
elif [ "\$action" == "restart" ]; then
    echo "Restarting plane services"

    service plane-web restart
    service plane-space restart
    service plane-backend restart
    service plane-worker restart
    service plane-beat-worker restart
else
    echo "Usage: \$0 start | stop | restart"
fi
EOF

sudo cp $SERVICE_DIR/plane.sh /usr/local/bin/plane
sudo chmod +x /usr/local/bin/plane

# Create nginx configuration file
sudo tee $SERVICE_DIR/proxy.conf &>/dev/null <<EOF
# nginx default configuration file
# The default server

server {
    server_name _;
    listen 80 default_server ;

    # listen              443 ssl;
    # keepalive_timeout   70;
    # ssl_protocols       TLSv1 TLSv1.1 TLSv1.2 TLSv1.3;
    # ssl_ciphers ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA256;

    # ssl_certificate     /etc/letsencrypt/live/plane-cert/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/plane-cert/privkey.pem;
    # ssl_session_cache   shared:SSL:10m;
    # ssl_session_timeout 10m;

    gzip            on;
    gzip_types      text/plain application/json;
    gzip_proxied    no-cache no-store private expired auth;
    gunzip          on;

    client_max_body_size 20M;

    proxy_set_header Host \$http_host;
    proxy_set_header X-Real-IP \$remote_addr;
    proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto \$scheme;

    proxy_set_header Upgrade \$http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header X-Frame-Options "SAMEORIGIN";

    add_header X-Content-Type-Options    "nosniff" always;
    add_header Referrer-Policy           "no-referrer-when-downgrade" always;
    add_header Permissions-Policy        "interest-cohort=()" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    location / {
        proxy_pass http://localhost:$WEB_PORT/;
    }
    location /spaces/ {
        proxy_pass http://localhost:$SPACE_PORT/spaces/;
    }
    location /api/ {
        proxy_pass http://localhost:$BACKEND_PORT/api/;
    }
    location /uploads/ {
        proxy_pass http://localhost:9000/uploads/;
    }
}

# server {
#     server_name _;
#     listen 80 default_server ;
#     return 301 https://\$host\$request_uri;
# }

EOF

#copy proxy.conf to nginx conf.d directory
sudo cp $SERVICE_DIR/proxy.conf /etc/nginx/conf.d/plane.conf

#restart nginx
sudo service nginx restart

sudo rm -rf $CODE_DIR

#***********************************************************************
#Installation summary and instructions to start services 
echo "
***********************************************
Installation Completed

Few Todos before you start the services : 
    ‣ Setup postgres user and database
    ‣ Review and update environment variables are set in "/etc/default/plane"
    ‣ Review and update nginx configuration file "/etc/nginx/conf.d/plane.conf"

To Start/Stop/Restart Plane Services run the following command

plane start | stop | restart

***********************************************"


cd $LAST_DIR




#!/bin/bash

# THIS FILE MUST BE IN THE BASE DIRECTORY

BASE_DIR=$(dirname $(readlink -f $0))
STORAGE_DIR=$BASE_DIR/app/storage

sudo chown -R root:www-dev $BASE_DIR
sudo find $BASE_DIR -type d -exec chmod 2775 {} +
sudo find $BASE_DIR -type f -exec chmod 0664 {} +
sudo chown -R www-data:www-data $STORAGE_DIR
chmod -R g+w $STORAGE_DIR

# change this file back to executable
sudo chmod +x $BASE_DIR/set_permissions.sh

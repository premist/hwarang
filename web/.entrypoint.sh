#!/bin/sh
set -ex

sed "s/80;/${PORT:-80};/g" -i /etc/nginx/conf.d/default.conf

nginx -g "daemon off;"

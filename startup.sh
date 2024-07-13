#!/bin/bash

# Start MariaDB
service mariadb start
mysql < /docker-entrypoint-initdb.d/init.sql

# Start PHP-FPM
service php8.1-fpm start

# Remove default Nginx site configuration
rm /etc/nginx/sites-enabled/default

# Start Nginx
service nginx start

# Keep the container running
tail -f /dev/null
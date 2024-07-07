#!/bin/bash

# Start MySQL service
service mysql start

# Initialize the MySQL database
mysql < /docker-entrypoint-initdb.d/init.sql

# Start PHP-FPM service
service php7.4-fpm start

# Start Nginx service
service nginx start

# Start your application
nohup /opt/laboratory/python/apps/article_writer/run.sh --port 5000 &

# Keep the container running
tail -f /dev/null
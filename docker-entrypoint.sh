#!/bin/bash

# Run composer install if vendor directory does not exist
if [ ! -d "/var/www/html/vendor" ]; then
  composer install --ignore-platform-reqs
fi

# Continue running the original CMD from the Dockerfile
exec "$@"
FROM php:8.4-fpm-alpine

RUN apk add --no-cache \
    git \
    curl \
    unzip \
    libzip-dev \
    oniguruma-dev \
    icu-dev \
    mariadb-connector-c-dev \
    $PHPIZE_DEPS \
    && docker-php-ext-install pdo_mysql intl zip pcntl \
    && pecl install redis \
    && docker-php-ext-enable redis

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html/apps/api

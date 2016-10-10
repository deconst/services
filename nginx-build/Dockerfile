FROM alpine:3.4

RUN apk add --no-cache nginx

# forward request and error logs to docker log collector
RUN ln -sf /dev/stdout /var/log/nginx/access.log
RUN ln -sf /dev/stderr /var/log/nginx/error.log

RUN mkdir -p /var/cache/nginx/
RUN adduser -D -s /bin/sh -G www-data www-data
RUN chown -R www-data:www-data /var/lib/nginx/tmp/ /var/cache/nginx/
RUN chmod 0755 /var/ /var/lib/ /var/lib/nginx /var/cache/ /var/cache/nginx/

COPY nginx.conf /etc/nginx/nginx.conf

VOLUME ["/var/ssl"]
EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]

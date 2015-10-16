FROM alpine:3.2

RUN apk add --update nginx && rm -rf /var/cache/apk/*

# forward request and error logs to docker log collector
RUN ln -sf /dev/stdout /var/log/nginx/access.log
RUN ln -sf /dev/stderr /var/log/nginx/error.log

COPY nginx.conf /etc/nginx/nginx.conf

VOLUME ["/var/cache/nginx"]
VOLUME ["/var/ssl"]
EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]

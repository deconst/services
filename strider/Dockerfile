FROM alpine:3.2

RUN apk add --update nodejs python-dev build-base krb5-dev \
  && rm -rf /var/cache/apk/*

RUN adduser -D -g "" strider
RUN mkdir -p /home/strider/ /var/workspace/

RUN chown -R strider:strider /home/strider/ /var/workspace/

ADD deconst-content-build /home/strider/deconst-content-build
RUN npm install -g /home/strider/deconst-content-build

ENV STRIDER_CLONE_DEST /var/workspace/

ADD deconst-strider /home/strider/deconst-strider
RUN npm install -g /home/strider/deconst-strider

EXPOSE 3000
WORKDIR /home/strider
USER strider
ENV HOME /home/strider

ENTRYPOINT ["/usr/bin/node", "/home/strider/deconst-strider/index.js"]

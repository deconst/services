FROM alpine:3.2

RUN apk add --update nodejs python-dev build-base krb5-dev openssh-client \
  && rm -rf /var/cache/apk/*

RUN adduser -D -g "" -u 1000 strider
RUN mkdir -p /home/strider/ /workspace/

RUN chown -R strider:strider /home/strider/ /workspace/
WORKDIR /home/strider/deconst-strider

ADD deconst-strider/package.json /home/strider/deconst-strider/package.json
RUN npm install
ADD deconst-strider/ /home/strider/deconst-strider/

EXPOSE 3000
USER strider

ENV HOME /home/strider
ENV STRIDER_CLONE_DEST /workspace/

ENTRYPOINT ["node", "/home/strider/deconst-strider/index.js"]

FROM alpine:3.2

RUN apk add --update nodejs python-dev build-base krb5-dev openssh-client git perl \
  && rm -rf /var/cache/apk/*

RUN mkdir -p /strider/ /workspace/

WORKDIR /strider/deconst-strider/

ADD deconst-strider/package.json /strider/deconst-strider/package.json
RUN npm install
ADD deconst-strider/ /strider/deconst-strider/

EXPOSE 3000

ENV HOME /strider
ENV STRIDER_CLONE_DEST /workspace/

ENTRYPOINT ["node", "/strider/deconst-strider/index.js"]

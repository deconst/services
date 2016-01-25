FROM alpine:3.2

RUN apk add --update nodejs python-dev build-base krb5-dev \
  && rm -rf /var/cache/apk/*

RUN adduser -D -g "" strider
RUN mkdir -p /home/strider/ /workspace/

RUN chown -R strider:strider /home/strider/ /workspace/

ENV STRIDER_CLONE_DEST /workspace/

ADD deconst-strider /home/strider/deconst-strider
RUN npm install -g /home/strider/deconst-strider

EXPOSE 3000
WORKDIR /home/strider
USER strider
ENV HOME /home/strider

ENTRYPOINT ["/usr/bin/deconst-strider"]

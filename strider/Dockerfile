FROM alpine:3.2

RUN apk add --update nodejs python-dev \
  && rm -rf /var/cache/apk/*
RUN npm install -g strider strider-github-auth

RUN adduser -D -g "" strider
RUN mkdir -p /home/strider/.strider

ADD deconst-content-build /home/strider/deconst-content-build
RUN npm install /home/strider/deconst-content-build

RUN chown -R strider:strider /home/strider/.strider

EXPOSE 3000
WORKDIR /home/strider
USER strider
ENV HOME /home/strider

ENTRYPOINT ["/usr/bin/strider"]

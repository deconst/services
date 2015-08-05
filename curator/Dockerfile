FROM python:3.4.3-slim
MAINTAINER Ash Wilson <ash.wilson@rackspace.com>

RUN useradd curator
RUN mkdir -p /home/curator
WORKDIR /home/curator

ENV CERTIFI_VERSION=2015.4.28
RUN pip install certifi==${CERTIFI_VERSION}

ENV CURATOR_VERSION=3.2.3
RUN pip install elasticsearch-curator==${CURATOR_VERSION}

COPY . /home/curator
RUN chown -R curator:curator /home/curator

USER curator
ENTRYPOINT ["/home/curator/entrypoint.sh"]

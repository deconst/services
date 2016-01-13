# Deconst Service Dockerfiles

*Hand-crafted artisanal Dockerfiles for non-core services*

This repository is home to the Dockerfiles for deconst services that aren't used for software written for deconst itself, but also don't have official Docker images in the Dockerhub registry.

## Curator

[![Docker Repository on Quay.io](https://quay.io/repository/deconst/curator/status "Docker Repository on Quay.io")](https://quay.io/repository/deconst/curator)

This image bundles [Elasticsearch Curator](https://www.elastic.co/guide/en/elasticsearch/client/curator/current/index.html) and some utility scripts to quickly prune old Elasticsearch indexes.

## Nginx

[![Docker Repository on Quay.io](https://quay.io/repository/deconst/nginx/status "Docker Repository on Quay.io")](https://quay.io/repository/deconst/nginx)

An [nginx](http://nginx.org/en/docs/) server configured to proxy requests to a presenter and content service within a pod.

```bash
docker run -d \
  --volume /my-certs/:/var/ssl:ro \
  --link content:content \
  --link presenter:presenter \
  quay.io/deconst/nginx
```

## Strider

[![Docker Repository on Quay.io](https://quay.io/repository/deconst/strider/status "Docker Repository on Quay.io")](https://quay.io/repository/deconst/strider)

This image bundles [Strider CD](https://github.com/Strider-CD/strider) with a controlled set of plugins and build scripts that can build content and control repositories.
